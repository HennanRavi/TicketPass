import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, DollarSign, Users, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import "leaflet/dist/leaflet.css";

// Fix for default marker icons
if (typeof window !== 'undefined') {
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  });
}

// Custom marker for user location
const userIcon = typeof window !== 'undefined' ? new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="rgb(37, 99, 235)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="10" fill="rgb(59, 130, 246)" opacity="0.3"/>
      <circle cx="12" cy="12" r="3" fill="rgb(37, 99, 235)"/>
    </svg>
  `),
  iconSize: [32, 32],
  iconAnchor: [16, 16],
}) : null;

function MapController({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, zoom || map.getZoom());
    }
  }, [center, zoom, map]);
  return null;
}

export default function EventMapView({ events, userLocation, onClose }) {
  const navigate = useNavigate();
  const [selectedEvent, setSelectedEvent] = useState(null);
  
  const cityCoordinates = {
    "São Paulo": [-23.5505, -46.6333],
    "Rio de Janeiro": [-22.9068, -43.1729],
    "Brasília": [-15.8267, -47.9218],
    "Salvador": [-12.9714, -38.5014],
    "Fortaleza": [-3.7172, -38.5433],
    "Belo Horizonte": [-19.9167, -43.9345],
    "Manaus": [-3.1190, -60.0217],
    "Curitiba": [-25.4284, -49.2733],
    "Recife": [-8.0476, -34.8770],
    "Porto Alegre": [-30.0346, -51.2177],
  };

  // Get center point
  const defaultCenter = userLocation 
    ? [userLocation.lat, userLocation.lon] 
    : [-15.7942, -47.8822]; // Brasília

  const eventMarkers = events
    .map(event => ({
      ...event,
      position: cityCoordinates[event.city]
    }))
    .filter(e => e.position);

  const handleEventClick = (event) => {
    setSelectedEvent(event);
  };

  const availableTickets = (event) => event.capacity - (event.tickets_sold || 0);

  return (
    <Card className="border-none shadow-2xl overflow-hidden dark:bg-gray-800">
      <div className="relative">
        <div style={{ height: "600px", width: "100%" }}>
          <MapContainer
            center={defaultCenter}
            zoom={userLocation ? 12 : 5}
            style={{ height: "100%", width: "100%" }}
            className="z-0"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            {/* User location marker */}
            {userLocation && (
              <Marker position={[userLocation.lat, userLocation.lon]} icon={userIcon}>
                <Popup>
                  <div className="p-2">
                    <p className="font-semibold text-sm">📍 Sua Localização</p>
                  </div>
                </Popup>
              </Marker>
            )}

            {/* Event markers */}
            {eventMarkers.map((event) => (
              <Marker 
                key={event.id} 
                position={event.position}
                eventHandlers={{
                  click: () => handleEventClick(event),
                }}
              >
                <Popup>
                  <div className="p-2 min-w-[200px]">
                    <h3 className="font-bold text-sm mb-2">{event.title}</h3>
                    <div className="space-y-1 text-xs text-gray-600 dark:text-gray-400 mb-3">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {format(new Date(event.date), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {event.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-3 h-3" />
                        R$ {event.price?.toFixed(2)}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {availableTickets(event)} disponíveis
                      </div>
                    </div>
                    <Button
                      size="sm"
                      className="w-full"
                      onClick={() => navigate(`${createPageUrl("EventDetails")}?id=${event.id}`)}
                    >
                      Ver Detalhes
                    </Button>
                  </div>
                </Popup>
              </Marker>
            ))}
            
            <MapController 
              center={selectedEvent ? selectedEvent.position : defaultCenter}
              zoom={selectedEvent ? 14 : undefined}
            />
          </MapContainer>
        </div>

        {/* Close button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 z-[1000] bg-white dark:bg-gray-800 shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          onClick={onClose}
        >
          <X className="w-5 h-5" />
        </Button>

        {/* Info badge */}
        <div className="absolute bottom-4 left-4 z-[1000]">
          <Badge className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm text-gray-900 dark:text-white shadow-lg">
            <MapPin className="w-3 h-3 mr-1" />
            {eventMarkers.length} eventos no mapa
          </Badge>
        </div>
      </div>

      {/* Selected event preview */}
      {selectedEvent && (
        <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 border-t dark:border-gray-600">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h3 className="font-bold text-gray-900 dark:text-white mb-1">
                {selectedEvent.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                {selectedEvent.city}, {selectedEvent.state}
              </p>
              <div className="flex items-center gap-3 text-xs text-gray-600 dark:text-gray-400">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {format(new Date(selectedEvent.date), "dd/MM/yyyy", { locale: ptBR })}
                </span>
                <span className="flex items-center gap-1 font-semibold text-blue-600 dark:text-purple-400">
                  <DollarSign className="w-3 h-3" />
                  R$ {selectedEvent.price?.toFixed(2)}
                </span>
              </div>
            </div>
            <Button
              size="sm"
              onClick={() => navigate(`${createPageUrl("EventDetails")}?id=${selectedEvent.id}`)}
              className="bg-blue-600 hover:bg-blue-700 dark:bg-purple-600 dark:hover:bg-purple-700"
            >
              Ver Detalhes
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}