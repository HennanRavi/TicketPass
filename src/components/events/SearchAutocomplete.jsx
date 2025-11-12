import React, { useState, useEffect, useRef } from "react";
import { Search, MapPin, Calendar, Tag, Clock, Bookmark, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function SearchAutocomplete({ 
  events, 
  value, 
  onChange, 
  onSuggestionClick,
  savedSearches = [],
  onDeleteSavedSearch,
  onApplySavedSearch 
}) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);

  useEffect(() => {
    if (value.length > 1) {
      const filtered = events.filter(event => {
        const searchLower = value.toLowerCase();
        return (
          event.title?.toLowerCase().includes(searchLower) ||
          event.description?.toLowerCase().includes(searchLower) ||
          event.city?.toLowerCase().includes(searchLower) ||
          event.location?.toLowerCase().includes(searchLower) ||
          event.category?.toLowerCase().includes(searchLower)
        );
      }).slice(0, 5);

      // Get unique cities and categories
      const cities = [...new Set(
        events
          .filter(e => e.city?.toLowerCase().includes(value.toLowerCase()))
          .map(e => e.city)
      )].slice(0, 3);

      const categories = [...new Set(
        events
          .filter(e => e.category?.toLowerCase().includes(value.toLowerCase()))
          .map(e => e.category)
      )].slice(0, 3);

      setSuggestions({
        events: filtered,
        cities,
        categories
      });
      setShowSuggestions(true);
    } else {
      setSuggestions({ events: [], cities: [], categories: [] });
      setShowSuggestions(value.length === 0 && savedSearches.length > 0);
    }
  }, [value, events, savedSearches]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target) &&
        inputRef.current &&
        !inputRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSuggestionClick = (suggestion, type) => {
    if (type === 'event') {
      onSuggestionClick?.(suggestion.id);
    } else if (type === 'city') {
      onChange(suggestion);
    } else if (type === 'category') {
      onChange(suggestion);
    }
    setShowSuggestions(false);
  };

  const hasSuggestions = 
    (suggestions.events?.length > 0 || 
     suggestions.cities?.length > 0 || 
     suggestions.categories?.length > 0);

  const showSavedSearches = value.length === 0 && savedSearches.length > 0;

  return (
    <div className="relative w-full">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <Input
          ref={inputRef}
          type="text"
          placeholder="Buscar por evento, cidade, categoria..."
          className="pl-12 pr-4 py-6 text-lg rounded-xl border-gray-300 shadow-sm"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setShowSuggestions(true)}
        />
        {value && (
          <button
            onClick={() => {
              onChange("");
              setShowSuggestions(false);
            }}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {showSuggestions && (showSavedSearches || hasSuggestions) && (
        <div
          ref={suggestionsRef}
          className="absolute z-50 w-full mt-2 bg-white rounded-xl shadow-2xl border border-gray-200 max-h-96 overflow-auto"
        >
          {/* Saved Searches */}
          {showSavedSearches && (
            <div className="p-3 border-b border-gray-100">
              <p className="text-xs font-semibold text-gray-500 mb-2 px-2">
                Buscas Salvas
              </p>
              <div className="space-y-1">
                {savedSearches.map((search) => (
                  <div
                    key={search.id}
                    className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg cursor-pointer group"
                  >
                    <div
                      className="flex items-center gap-2 flex-1"
                      onClick={() => onApplySavedSearch(search)}
                    >
                      <Bookmark className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium text-gray-900">
                        {search.name}
                      </span>
                      {search.search_term && (
                        <Badge variant="outline" className="text-xs">
                          {search.search_term}
                        </Badge>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="opacity-0 group-hover:opacity-100 h-6 w-6"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteSavedSearch(search.id);
                      }}
                    >
                      <X className="w-4 h-4 text-gray-400" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Event Suggestions */}
          {suggestions.events?.length > 0 && (
            <div className="p-3 border-b border-gray-100">
              <p className="text-xs font-semibold text-gray-500 mb-2 px-2">
                Eventos
              </p>
              <div className="space-y-1">
                {suggestions.events.map((event) => (
                  <div
                    key={event.id}
                    onClick={() => handleSuggestionClick(event, 'event')}
                    className="p-2 hover:bg-blue-50 rounded-lg cursor-pointer transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <Calendar className="w-4 h-4 text-blue-600 mt-1 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 line-clamp-1">
                          {event.title}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-gray-500">
                            {event.city}
                          </span>
                          {event.category && (
                            <>
                              <span className="text-xs text-gray-300">•</span>
                              <span className="text-xs text-gray-500">
                                {event.category}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* City Suggestions */}
          {suggestions.cities?.length > 0 && (
            <div className="p-3 border-b border-gray-100">
              <p className="text-xs font-semibold text-gray-500 mb-2 px-2">
                Cidades
              </p>
              <div className="space-y-1">
                {suggestions.cities.map((city, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleSuggestionClick(city, 'city')}
                    className="p-2 hover:bg-green-50 rounded-lg cursor-pointer transition-colors flex items-center gap-3"
                  >
                    <MapPin className="w-4 h-4 text-green-600 flex-shrink-0" />
                    <span className="text-sm text-gray-900">{city}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Category Suggestions */}
          {suggestions.categories?.length > 0 && (
            <div className="p-3">
              <p className="text-xs font-semibold text-gray-500 mb-2 px-2">
                Categorias
              </p>
              <div className="space-y-1">
                {suggestions.categories.map((category, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleSuggestionClick(category, 'category')}
                    className="p-2 hover:bg-purple-50 rounded-lg cursor-pointer transition-colors flex items-center gap-3"
                  >
                    <Tag className="w-4 h-4 text-purple-600 flex-shrink-0" />
                    <span className="text-sm text-gray-900">{category}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}