import React, { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Navigation, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import "leaflet/dist/leaflet.css";

// Fix for default marker icons in react-leaflet
if (typeof window !== 'undefined') {
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  });
}

// Component to recenter map
function RecenterMap({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, map.getZoom());
    }
  }, [center, map]);
  return null;
}

export default function EventMap({ event, height = "400px", showDirections = true }) {
  const navigate = useNavigate();
  
  // Approximate coordinates based on city (you can enhance this with a geocoding API)
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

  const position = cityCoordinates[event.city] || [-15.7942, -47.8822]; // Default to Brasília

  const handleDirections = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${position[0]},${position[1]}`;
    window.open(url, '_blank');
  };

  return (
    <Card className="overflow-hidden border-none shadow-lg dark:bg-gray-800">
      <div style={{ height }}>
        <MapContainer
          center={position}
          zoom={13}
          style={{ height: "100%", width: "100%" }}
          className="z-0"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={position}>
            <Popup>
              <div className="p-2">
                <h3 className="font-bold text-sm mb-1">{event.title}</h3>
                <p className="text-xs text-gray-600 mb-2">
                  <MapPin className="w-3 h-3 inline mr-1" />
                  {event.location}
                </p>
                <p className="text-xs text-gray-500 mb-2">
                  {event.city}, {event.state}
                </p>
                {showDirections && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full text-xs"
                    onClick={handleDirections}
                  >
                    <Navigation className="w-3 h-3 mr-1" />
                    Ver Rotas
                  </Button>
                )}
              </div>
            </Popup>
          </Marker>
          <RecenterMap center={position} />
        </MapContainer>
      </div>
      {showDirections && (
        <div className="p-4 bg-white dark:bg-gray-800 border-t dark:border-gray-700">
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-blue-600 dark:text-purple-400 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="font-medium text-gray-900 dark:text-white text-sm mb-1">
                {event.location}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {event.city}, {event.state}
              </p>
            </div>
            <Button
              size="sm"
              onClick={handleDirections}
              className="bg-blue-600 hover:bg-blue-700 dark:bg-purple-600 dark:hover:bg-purple-700"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Rotas
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}