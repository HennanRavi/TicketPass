import React, { useState, useEffect, useRef } from "react";
import { Search, MapPin, Tag, Bookmark, X, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function SearchAutocomplete({
  events,
  value,
  onChange,
  onSuggestionClick,
  savedSearches = [],
  onDeleteSavedSearch,
  onApplySavedSearch,
}) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState({ events: [], cities: [], categories: [] });
  const wrapperRef = useRef(null);

  useEffect(() => {
    if (value && value.length > 0) {
      const searchLower = value.toLowerCase();
      
      const matchedEvents = events
        .filter(e => 
          e.title?.toLowerCase().includes(searchLower) ||
          e.location?.toLowerCase().includes(searchLower)
        )
        .slice(0, 5);

      const cities = [...new Set(events.map(e => e.city).filter(Boolean))]
        .filter(city => city.toLowerCase().includes(searchLower))
        .slice(0, 3);

      const categories = [...new Set(events.map(e => e.category).filter(Boolean))]
        .filter(cat => cat.toLowerCase().includes(searchLower))
        .slice(0, 3);

      setSuggestions({ events: matchedEvents, cities, categories });
      setShowSuggestions(true);
    } else {
      setSuggestions({ events: [], cities: [], categories: [] });
      if (savedSearches.length > 0) {
        setShowSuggestions(true);
      } else {
        setShowSuggestions(false);
      }
    }
  }, [value, events, savedSearches]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const hasAnySuggestions = 
    suggestions.events.length > 0 || 
    suggestions.cities.length > 0 || 
    suggestions.categories.length > 0 ||
    (savedSearches.length > 0 && !value);

  return (
    <div ref={wrapperRef} className="relative w-full">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setShowSuggestions(true)}
          placeholder="Buscar eventos, cidades ou categorias..."
          className="w-full pl-12 pr-4 py-4 text-base rounded-2xl bg-white shadow-lg border-2 border-white focus:border-blue-300 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
        />
        {value && (
          <button
            onClick={() => onChange("")}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && hasAnySuggestions && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50 max-h-[500px] overflow-y-auto">
          {/* Saved Searches */}
          {!value && savedSearches.length > 0 && (
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center gap-2 mb-3">
                <Bookmark className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-semibold text-gray-700">Buscas Salvas</span>
              </div>
              <div className="space-y-2">
                {savedSearches.map((search) => (
                  <div
                    key={search.id}
                    className="flex items-center justify-between p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors cursor-pointer group"
                    onClick={() => onApplySavedSearch(search)}
                  >
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <TrendingUp className="w-4 h-4 text-blue-600 flex-shrink-0" />
                      <span className="text-sm font-medium text-gray-900 truncate">
                        {search.name}
                      </span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteSavedSearch(search.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 ml-2 p-1 hover:bg-red-100 rounded transition-all flex-shrink-0"
                    >
                      <X className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Event Suggestions */}
          {suggestions.events.length > 0 && (
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center gap-2 mb-3">
                <Search className="w-4 h-4 text-purple-600" />
                <span className="text-sm font-semibold text-gray-700">Eventos</span>
              </div>
              <div className="space-y-1">
                {suggestions.events.map((event) => (
                  <div
                    key={event.id}
                    onClick={() => {
                      onSuggestionClick(event.id);
                      setShowSuggestions(false);
                    }}
                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    {event.image_url ? (
                      <img
                        src={event.image_url}
                        alt={event.title}
                        className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Search className="w-6 h-6 text-purple-600" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 line-clamp-1">
                        {event.title}
                      </p>
                      <p className="text-xs text-gray-500 line-clamp-1 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3" />
                        {event.city} - {event.location}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* City Suggestions */}
          {suggestions.cities.length > 0 && (
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="w-4 h-4 text-green-600" />
                <span className="text-sm font-semibold text-gray-700">Cidades</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {suggestions.cities.map((city, idx) => (
                  <Badge
                    key={idx}
                    variant="outline"
                    className="cursor-pointer hover:bg-green-50 hover:border-green-300 transition-colors"
                    onClick={() => {
                      onChange(city);
                      setShowSuggestions(false);
                    }}
                  >
                    <MapPin className="w-3 h-3 mr-1" />
                    {city}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Category Suggestions */}
          {suggestions.categories.length > 0 && (
            <div className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <Tag className="w-4 h-4 text-orange-600" />
                <span className="text-sm font-semibold text-gray-700">Categorias</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {suggestions.categories.map((category, idx) => (
                  <Badge
                    key={idx}
                    variant="outline"
                    className="cursor-pointer hover:bg-orange-50 hover:border-orange-300 transition-colors"
                    onClick={() => {
                      onChange(category);
                      setShowSuggestions(false);
                    }}
                  >
                    <Tag className="w-3 h-3 mr-1" />
                    {category}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}