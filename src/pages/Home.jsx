import React, { useState, useMemo, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Search, Calendar, MapPin, Users, TrendingUp, Settings as SettingsIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import EventCard from "../components/events/EventCard";
import EventFilters from "../components/events/EventFilters";
import SearchAutocomplete from "../components/events/SearchAutocomplete";
import SaveSearchDialog from "../components/events/SaveSearchDialog";
import PreferencesModal from "../components/preferences/PreferencesModal";

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

const cityCoordinates = {
  "São Paulo": { lat: -23.5505, lon: -46.6333 },
  "Rio de Janeiro": { lat: -22.9068, lon: -43.1729 },
  "Brasília": { lat: -15.8267, lon: -47.9218 },
  "Salvador": { lat: -12.9714, lon: -38.5014 },
  "Fortaleza": { lat: -3.7172, lon: -38.5433 },
  "Belo Horizonte": { lat: -19.9167, lon: -43.9345 },
  "Manaus": { lat: -3.1190, lon: -60.0217 },
  "Curitiba": { lat: -25.4284, lon: -49.2733 },
  "Recife": { lat: -8.0476, lon: -34.8770 },
  "Porto Alegre": { lat: -30.0346, lon: -51.2177 },
};

export default function Home() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [user, setUser] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showPreferencesModal, setShowPreferencesModal] = useState(false);
  
  const [filters, setFilters] = useState({
    searchTerm: "",
    state: "all",
    city: "all",
    category: "all",
    priceRange: [0, 1000],
    startDate: null,
    endDate: null,
    sortByProximity: false,
  });

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => setUser(null));
  }, []);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          });
          setLocationError(null);
        },
        (error) => {
          setLocationError(error.message);
        }
      );
    }
  }, []);

  const { data: events, isLoading } = useQuery({
    queryKey: ["events"],
    queryFn: () => base44.entities.Event.filter({ status: "ativo" }, "-date"),
    initialData: [],
  });

  const { data: allReviews } = useQuery({
    queryKey: ["all-reviews"],
    queryFn: () => base44.entities.Review.list(),
    initialData: [],
  });

  const { data: savedSearches } = useQuery({
    queryKey: ["saved-searches", user?.id],
    queryFn: () => base44.entities.SavedSearch.filter({ user_id: user.id }, "-created_date"),
    enabled: !!user,
    initialData: [],
  });

  const saveSearchMutation = useMutation({
    mutationFn: (searchData) => base44.entities.SavedSearch.create(searchData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["saved-searches", user?.id] });
      toast.success("Busca salva com sucesso!");
    },
  });

  const deleteSavedSearchMutation = useMutation({
    mutationFn: (searchId) => base44.entities.SavedSearch.delete(searchId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["saved-searches", user?.id] });
      toast.success("Busca removida!");
    },
  });

  const eventRatings = useMemo(() => {
    const ratings = {};
    allReviews.forEach((review) => {
      if (!ratings[review.event_id]) {
        ratings[review.event_id] = { sum: 0, count: 0 };
      }
      ratings[review.event_id].sum += review.rating;
      ratings[review.event_id].count += 1;
    });
    
    Object.keys(ratings).forEach((eventId) => {
      ratings[eventId].average = ratings[eventId].sum / ratings[eventId].count;
    });
    
    return ratings;
  }, [allReviews]);

  const filteredEvents = useMemo(() => {
    let filtered = events.filter((event) => {
      const searchLower = filters.searchTerm.toLowerCase();
      const matchesSearch =
        !filters.searchTerm ||
        event.title?.toLowerCase().includes(searchLower) ||
        event.description?.toLowerCase().includes(searchLower) ||
        event.city?.toLowerCase().includes(searchLower) ||
        event.location?.toLowerCase().includes(searchLower);

      const matchesState = filters.state === "all" || event.state === filters.state;
      const matchesCity = filters.city === "all" || event.city === filters.city;
      const matchesCategory = filters.category === "all" || event.category === filters.category;
      const matchesPrice =
        event.price >= filters.priceRange[0] &&
        (filters.priceRange[1] === 1000 ? true : event.price <= filters.priceRange[1]);

      const eventDate = new Date(event.date);
      const matchesStartDate = !filters.startDate || eventDate >= filters.startDate;
      const matchesEndDate = !filters.endDate || eventDate <= filters.endDate;

      return (
        matchesSearch &&
        matchesState &&
        matchesCity &&
        matchesCategory &&
        matchesPrice &&
        matchesStartDate &&
        matchesEndDate
      );
    });

    if (filters.sortByProximity && userLocation) {
      filtered = filtered.map(event => {
        const cityCoords = cityCoordinates[event.city];
        if (cityCoords) {
          const distance = calculateDistance(
            userLocation.lat,
            userLocation.lon,
            cityCoords.lat,
            cityCoords.lon
          );
          return { ...event, distance };
        }
        return { ...event, distance: Infinity };
      }).sort((a, b) => a.distance - b.distance);
    }

    return filtered;
  }, [events, filters, userLocation]);

  const availableCities = useMemo(() => {
    if (filters.state === "all") return [];
    const citiesInState = events
      .filter(e => e.state === filters.state && e.status === "ativo")
      .map(e => e.city)
      .filter(Boolean);
    return [...new Set(citiesInState)].sort();
  }, [events, filters.state]);

  const handleFilterChange = (newFilters) => {
    setFilters({ ...filters, ...newFilters });
  };

  const handleClearFilters = () => {
    setFilters({
      searchTerm: "",
      state: "all",
      city: "all",
      category: "all",
      priceRange: [0, 1000],
      startDate: null,
      endDate: null,
      sortByProximity: false,
    });
  };

  const handleSaveSearch = (searchName) => {
    if (!user) {
      toast.error("Faça login para salvar buscas");
      return;
    }

    saveSearchMutation.mutate({
      user_id: user.id,
      name: searchName,
      search_term: filters.searchTerm,
      state: filters.state !== "all" ? filters.state : "",
      city: filters.city !== "all" ? filters.city : "",
      category: filters.category !== "all" ? filters.category : "",
      price_min: filters.priceRange[0],
      price_max: filters.priceRange[1],
    });
  };

  const handleApplySavedSearch = (search) => {
    setFilters({
      searchTerm: search.search_term || "",
      state: search.state || "all",
      city: search.city || "all",
      category: search.category || "all",
      priceRange: [search.price_min || 0, search.price_max || 1000],
      startDate: null,
      endDate: null,
      sortByProximity: false,
    });
    toast.success(`Busca "${search.name}" aplicada!`);
  };

  const handleSuggestionClick = (eventId) => {
    navigate(`${createPageUrl("EventDetails")}?id=${eventId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900">Encontrar Eventos</h1>
            {user && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowPreferencesModal(true)}
                className="flex items-center gap-2"
              >
                <SettingsIcon className="w-4 h-4" />
                Preferências
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Search and Filters Section */}
      <div className="bg-white py-6 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
          <SearchAutocomplete
            events={events}
            value={filters.searchTerm}
            onChange={(value) => handleFilterChange({ searchTerm: value })}
            onSuggestionClick={handleSuggestionClick}
            savedSearches={savedSearches}
            onDeleteSavedSearch={(id) => deleteSavedSearchMutation.mutate(id)}
            onApplySavedSearch={handleApplySavedSearch}
          />

          {locationError && !userLocation && (
            <Alert className="bg-blue-50 border-blue-200">
              <AlertDescription className="text-sm text-blue-800">
                💡 Permita acesso à localização para ver eventos próximos a você
              </AlertDescription>
            </Alert>
          )}

          <EventFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
            availableCities={availableCities}
            onSaveSearch={() => setShowSaveDialog(true)}
            userLocation={userLocation}
          />
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-blue-600" />
              </div>
              <span className="text-xl font-bold text-gray-900">{filteredEvents.length}</span>
            </div>
            <p className="text-xs text-gray-500">Eventos Encontrados</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-4 h-4 text-blue-600" />
              </div>
              <span className="text-xl font-bold text-gray-900">
                {events.filter((e) => new Date(e.date) > new Date()).length}
              </span>
            </div>
            <p className="text-xs text-gray-500">Próximos Eventos</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <MapPin className="w-4 h-4 text-blue-600" />
              </div>
              <span className="text-xl font-bold text-gray-900">
                {new Set(filteredEvents.map((e) => e.city)).size}
              </span>
            </div>
            <p className="text-xs text-gray-500">Cidades</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-4 h-4 text-blue-600" />
              </div>
              <span className="text-xl font-bold text-gray-900">
                {events.reduce((sum, e) => sum + (e.tickets_sold || 0), 0)}
              </span>
            </div>
            <p className="text-xs text-gray-500">Ingressos Vendidos</p>
          </div>
        </div>

        {/* Events Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-white rounded-xl overflow-hidden shadow-lg animate-pulse"
              >
                <div className="h-40 bg-gray-200"></div>
                <div className="p-4 space-y-2">
                  <div className="h-5 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                averageRating={eventRatings[event.id]?.average || 0}
                reviewCount={eventRatings[event.id]?.count || 0}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Nenhum evento encontrado
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Tente ajustar os filtros para encontrar eventos
            </p>
            <Button onClick={handleClearFilters} variant="outline" size="sm">
              Limpar todos os filtros
            </Button>
          </div>
        )}
      </div>

      <SaveSearchDialog
        open={showSaveDialog}
        onOpenChange={setShowSaveDialog}
        onSave={handleSaveSearch}
        currentFilters={filters}
      />

      <PreferencesModal
        open={showPreferencesModal}
        onOpenChange={setShowPreferencesModal}
        user={user}
      />
    </div>
  );
}