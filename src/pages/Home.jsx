import React, { useState, useMemo, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Search, Calendar, MapPin, Users, TrendingUp, Settings as SettingsIcon, SlidersHorizontal, Star, Flame, Map as MapIcon, Grid3x3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import EventCard from "../components/events/EventCard";
import EventFilters from "../components/events/EventFilters";
import SearchAutocomplete from "../components/events/SearchAutocomplete";
import SaveSearchDialog from "../components/events/SaveSearchDialog";
import PreferencesModal from "../components/preferences/PreferencesModal";
import EventMapView from "../components/map/EventMapView";

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
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState("grid"); // "grid" or "map"
  
  const [filters, setFilters] = useState({
    searchTerm: "",
    state: "all",
    city: "all",
    category: "all",
    priceRange: [0, 1000],
    startDate: null,
    endDate: null,
    sortByProximity: false,
    sortBy: "date",
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

  const { data: events = [], isLoading } = useQuery({
    queryKey: ["events"],
    queryFn: () => base44.entities.Event.filter({ status: "ativo" }, "-date"),
    initialData: [],
  });

  const { data: allReviews = [] } = useQuery({
    queryKey: ["all-reviews"],
    queryFn: () => base44.entities.Review.list(),
    initialData: [],
  });

  const { data: savedSearches = [] } = useQuery({
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
    if (!Array.isArray(allReviews)) return ratings;
    
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

  const featuredEvents = useMemo(() => {
    if (!Array.isArray(events)) return [];
    
    return events
      .filter(e => e.status === "ativo")
      .map(event => ({
        ...event,
        score: ((eventRatings[event.id]?.average || 0) * 10) + (event.tickets_sold || 0)
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 6);
  }, [events, eventRatings]);

  const filteredEvents = useMemo(() => {
    if (!Array.isArray(events)) return [];
    
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
    } else {
      switch (filters.sortBy) {
        case "rating":
          filtered = filtered.sort((a, b) => {
            const ratingA = eventRatings[a.id]?.average || 0;
            const ratingB = eventRatings[b.id]?.average || 0;
            return ratingB - ratingA;
          });
          break;
        case "price_low":
          filtered = filtered.sort((a, b) => a.price - b.price);
          break;
        case "price_high":
          filtered = filtered.sort((a, b) => b.price - a.price);
          break;
        case "popularity":
          filtered = filtered.sort((a, b) => (b.tickets_sold || 0) - (a.tickets_sold || 0));
          break;
        case "date":
        default:
          filtered = filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
          break;
      }
    }

    return filtered;
  }, [events, filters, userLocation, eventRatings]);

  const availableCities = useMemo(() => {
    if (filters.state === "all" || !Array.isArray(events)) return [];
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
      sortBy: "date",
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

  const hasActiveFilters = 
    filters.state !== "all" || 
    filters.city !== "all" || 
    filters.category !== "all" || 
    filters.priceRange[0] !== 0 || 
    filters.priceRange[1] !== 1000 ||
    filters.startDate ||
    filters.endDate ||
    filters.sortByProximity ||
    filters.sortBy !== "date";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-purple-950">
      {/* Hero Section with Search */}
      <div className="relative bg-gradient-to-br from-blue-500/90 via-blue-400/80 to-white/90 dark:from-purple-900/90 dark:via-purple-800/80 dark:to-gray-900/90 backdrop-blur-3xl">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400/30 dark:bg-purple-600/20 rounded-full blur-3xl animate-float-slow"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white/40 dark:bg-purple-900/30 rounded-full blur-3xl animate-float-reverse animate-pulse-glow"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-3 text-white text-shadow-strong">
              Descubra Eventos Incríveis
            </h1>
            <p className="text-lg text-white/95 max-w-2xl mx-auto text-shadow-medium">
              Encontre shows, festivais, conferências e muito mais perto de você
            </p>
          </div>

          <div className="max-w-3xl mx-auto mb-6">
            <SearchAutocomplete
              events={events}
              value={filters.searchTerm}
              onChange={(value) => handleFilterChange({ searchTerm: value })}
              onSuggestionClick={handleSuggestionClick}
              savedSearches={savedSearches}
              onDeleteSavedSearch={(id) => deleteSavedSearchMutation.mutate(id)}
              onApplySavedSearch={handleApplySavedSearch}
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="bg-white/20 dark:bg-gray-800/40 backdrop-blur-md rounded-xl p-4 text-center border border-white/30 dark:border-gray-700/30 shadow-lg">
              <div className="flex items-center justify-center gap-2 mb-1">
                <div className="w-8 h-8 bg-blue-600 dark:bg-purple-600 rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <span className="text-2xl font-bold text-white text-shadow-medium">{filteredEvents?.length || 0}</span>
              </div>
              <p className="text-sm text-white/95 text-shadow-soft">Eventos Encontrados</p>
            </div>
            <div className="bg-white/20 dark:bg-gray-800/40 backdrop-blur-md rounded-xl p-4 text-center border border-white/30 dark:border-gray-700/30 shadow-lg">
              <div className="flex items-center justify-center gap-2 mb-1">
                <div className="w-8 h-8 bg-green-600 dark:bg-orange-600 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <span className="text-2xl font-bold text-white text-shadow-medium">
                  {Array.isArray(events) ? events.filter((e) => new Date(e.date) > new Date()).length : 0}
                </span>
              </div>
              <p className="text-sm text-white/95 text-shadow-soft">Próximos</p>
            </div>
            <div className="bg-white/20 dark:bg-gray-800/40 backdrop-blur-md rounded-xl p-4 text-center border border-white/30 dark:border-gray-700/30 shadow-lg">
              <div className="flex items-center justify-center gap-2 mb-1">
                <div className="w-8 h-8 bg-purple-600 dark:bg-indigo-600 rounded-lg flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-white" />
                </div>
                <span className="text-2xl font-bold text-white text-shadow-medium">
                  {Array.isArray(filteredEvents) ? new Set(filteredEvents.map((e) => e.city)).size : 0}
                </span>
              </div>
              <p className="text-sm text-white/95 text-shadow-soft">Cidades</p>
            </div>
            <div className="bg-white/20 dark:bg-gray-800/40 backdrop-blur-md rounded-xl p-4 text-center border border-white/30 dark:border-gray-700/30 shadow-lg">
              <div className="flex items-center justify-center gap-2 mb-1">
                <div className="w-8 h-8 bg-orange-600 dark:bg-pink-600 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <span className="text-2xl font-bold text-white text-shadow-medium">
                  {Array.isArray(events) ? events.reduce((sum, e) => sum + (e.tickets_sold || 0), 0) : 0}
                </span>
              </div>
              <p className="text-sm text-white/95 text-shadow-soft">Ingressos</p>
            </div>
          </div>
        </div>
      </div>

      {locationError && !userLocation && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
          <Alert className="bg-blue-50 dark:bg-purple-900/20 border-blue-200 dark:border-purple-800">
            <AlertDescription className="text-sm text-blue-800 dark:text-purple-300">
              💡 Permita acesso à localização para ver eventos próximos a você
            </AlertDescription>
          </Alert>
        </div>
      )}

      {!isLoading && featuredEvents.length > 0 && !hasActiveFilters && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 dark:from-yellow-500 dark:to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
              <Flame className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Eventos em Destaque</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">Os eventos mais populares e bem avaliados</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {featuredEvents.map((event) => (
              <div key={event.id} className="relative">
                <Badge className="absolute top-4 left-4 z-10 bg-gradient-to-r from-orange-500 to-red-500 dark:from-yellow-500 dark:to-orange-500 text-white border-none shadow-lg">
                  <Star className="w-3 h-3 mr-1" fill="currentColor" />
                  Destaque
                </Badge>
                <EventCard
                  event={event}
                  averageRating={eventRatings[event.id]?.average || 0}
                  reviewCount={eventRatings[event.id]?.count || 0}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Button
              variant={showFilters ? "default" : "outline"}
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className={`gap-2 ${
                showFilters 
                  ? 'bg-blue-600 hover:bg-blue-700 text-white dark:bg-purple-600 dark:hover:bg-purple-700 dark:text-white' 
                  : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filtros
              {hasActiveFilters && (
                <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                  {[
                    filters.state !== "all" && 1,
                    filters.city !== "all" && 1,
                    filters.category !== "all" && 1,
                    (filters.priceRange[0] !== 0 || filters.priceRange[1] !== 1000) && 1,
                    filters.startDate && 1,
                    filters.endDate && 1,
                    filters.sortByProximity && 1,
                    filters.sortBy !== "date" && 1,
                  ].filter(Boolean).length}
                </Badge>
              )}
            </Button>
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearFilters}
                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
              >
                Limpar filtros
              </Button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Tabs value={viewMode} onValueChange={setViewMode} className="w-auto">
              <TabsList className="dark:bg-gray-800">
                <TabsTrigger value="grid" className="gap-2 dark:data-[state=active]:bg-purple-600">
                  <Grid3x3 className="w-4 h-4" />
                  Grade
                </TabsTrigger>
                <TabsTrigger value="map" className="gap-2 dark:data-[state=active]:bg-purple-600">
                  <MapIcon className="w-4 h-4" />
                  Mapa
                </TabsTrigger>
              </TabsList>
            </Tabs>
            
            {user && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowPreferencesModal(true)}
                className="gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
              >
                <SettingsIcon className="w-4 h-4" />
                Preferências
              </Button>
            )}
          </div>
        </div>

        {showFilters && (
          <div className="mb-6 animate-in slide-in-from-top-2">
            <EventFilters
              filters={filters}
              onFilterChange={handleFilterChange}
              onClearFilters={handleClearFilters}
              availableCities={availableCities}
              onSaveSearch={() => setShowSaveDialog(true)}
              userLocation={userLocation}
            />
          </div>
        )}

        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
          {hasActiveFilters ? "Resultados da Busca" : "Todos os Eventos"}
        </h2>

        {viewMode === "map" ? (
          <EventMapView
            events={filteredEvents}
            userLocation={userLocation}
            onClose={() => setViewMode("grid")}
          />
        ) : (
          <>
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div
                    key={i}
                    className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg animate-pulse"
                  >
                    <div className="h-48 bg-gray-200 dark:bg-gray-700"></div>
                    <div className="p-5 space-y-3">
                      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : Array.isArray(filteredEvents) && filteredEvents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
              <div className="text-center py-20">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-purple-900/40 dark:to-purple-800/40 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-10 h-10 text-blue-600 dark:text-purple-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Nenhum evento encontrado
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
                  Tente ajustar os filtros ou buscar por outros termos para encontrar eventos incríveis
                </p>
                <Button onClick={handleClearFilters} variant="outline" className="border-gray-300 text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700">
                  Limpar todos os filtros
                </Button>
              </div>
            )}
          </>
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