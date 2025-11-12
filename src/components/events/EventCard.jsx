import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Calendar, MapPin, Users, Star, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const categoryColors = {
  show: "bg-purple-100 text-purple-700 border-purple-200",
  teatro: "bg-pink-100 text-pink-700 border-pink-200",
  esporte: "bg-blue-100 text-blue-700 border-blue-200",
  festival: "bg-orange-100 text-orange-700 border-orange-200",
  conferencia: "bg-green-100 text-green-700 border-green-200",
  workshop: "bg-yellow-100 text-yellow-700 border-yellow-200",
  outro: "bg-gray-100 text-gray-700 border-gray-200",
};

const categoryLabels = {
  show: "Show",
  teatro: "Teatro",
  esporte: "Esporte",
  festival: "Festival",
  conferencia: "Conferência",
  workshop: "Workshop",
  outro: "Outro",
};

export default function EventCard({ event, averageRating, reviewCount, recommendedBadge }) {
  const availableTickets = event.capacity - (event.tickets_sold || 0);
  const percentageSold = ((event.tickets_sold || 0) / event.capacity) * 100;

  return (
    <Link 
      to={`${createPageUrl("EventDetails")}?id=${event.id}`}
      className="block group bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 cursor-pointer"
    >
      {/* Image */}
      <div className="relative h-40 overflow-hidden bg-gradient-to-br from-blue-400 to-blue-600">
        {event.image_url ? (
          <img
            src={event.image_url}
            alt={event.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Calendar className="w-12 h-12 text-white opacity-50" />
          </div>
        )}
        
        {/* Top Left - Rating or Recommended Badge */}
        <div className="absolute top-2 left-2 flex flex-col gap-1.5 pointer-events-none">
          {recommendedBadge && (
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xs px-2.5 py-1 rounded-lg shadow-lg flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              <span className="font-semibold">Para você</span>
            </div>
          )}
          {averageRating > 0 && (
            <div className="bg-white/95 backdrop-blur-sm rounded-lg px-2 py-1 flex items-center gap-1">
              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              <span className="text-xs font-semibold text-gray-900">
                {averageRating.toFixed(1)}
              </span>
              <span className="text-xs text-gray-500">({reviewCount})</span>
            </div>
          )}
        </div>

        {/* Top Right - Category Badge */}
        {event.category && (
          <Badge
            className={`absolute top-2 right-2 text-xs font-semibold pointer-events-none ${
              categoryColors[event.category]
            } border`}
          >
            {categoryLabels[event.category]}
          </Badge>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-base font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {event.title}
        </h3>

        <div className="space-y-1.5 mb-3">
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <Calendar className="w-3.5 h-3.5 text-blue-500" />
            <span>
              {format(new Date(event.date), "dd 'de' MMMM, yyyy 'às' HH:mm", {
                locale: ptBR,
              })}
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <MapPin className="w-3.5 h-3.5 text-blue-500" />
            <span className="line-clamp-1">{event.location}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <Users className="w-3.5 h-3.5 text-blue-500" />
            <span>
              {availableTickets} ingressos disponíveis
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        {percentageSold > 0 && (
          <div className="mb-3">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>{Math.round(percentageSold)}% vendido</span>
              <span>{event.tickets_sold} / {event.capacity}</span>
            </div>
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all"
                style={{ width: `${percentageSold}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Price */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div>
            <p className="text-xs text-gray-500">A partir de</p>
            <p className="text-lg font-bold text-gray-900">
              R$ {event.price?.toFixed(2)}
            </p>
          </div>
          <div className="px-3 py-1.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg text-sm font-medium group-hover:shadow-lg transition-shadow">
            Ver Mais
          </div>
        </div>
      </div>
    </Link>
  );
}