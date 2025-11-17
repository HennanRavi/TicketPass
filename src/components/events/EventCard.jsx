import React from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Calendar, MapPin, Users, TrendingUp, Star, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const categoryColors = {
  show: "bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300",
  teatro: "bg-pink-100 dark:bg-pink-900/40 text-pink-700 dark:text-pink-300",
  esporte: "bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300",
  festival: "bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300",
  conferencia: "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300",
  workshop: "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300",
  outro: "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300",
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

export default function EventCard({ event, averageRating, reviewCount }) {
  const navigate = useNavigate();
  const availableTickets = event.capacity - (event.tickets_sold || 0);
  const occupancyPercentage = ((event.tickets_sold || 0) / event.capacity) * 100;

  return (
    <Card
      className="group overflow-hidden border-none shadow-lg hover:shadow-2xl transition-all duration-300 bg-white dark:bg-gray-800"
    >
      {/* Image */}
      <div className="relative h-48 bg-gradient-to-br from-blue-400 to-blue-600 dark:from-purple-800 dark:to-purple-900 overflow-hidden cursor-pointer"
        onClick={() => navigate(`${createPageUrl("EventDetails")}?id=${event.id}`)}
      >
        {event.image_url ? (
          <img
            src={event.image_url}
            alt={event.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Calendar className="w-16 h-16 text-white opacity-50" />
          </div>
        )}
        
        {/* Category Badge - Right Side */}
        {event.category && (
          <div className="absolute top-3 right-3">
            <Badge className={categoryColors[event.category] || categoryColors.outro}>
              {categoryLabels[event.category] || event.category}
            </Badge>
          </div>
        )}

        {/* Ocupancy Badge - Left Side */}
        {occupancyPercentage > 80 && (
          <div className="absolute top-3 left-3">
            <Badge className="bg-red-500 dark:bg-red-700 text-white">
              <TrendingUp className="w-3 h-3 mr-1" />
              Quase Esgotado
            </Badge>
          </div>
        )}

        {/* Rating */}
        {averageRating > 0 && (
          <div className="absolute bottom-3 right-3 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm rounded-lg px-2 py-1 flex items-center gap-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-semibold text-gray-900 dark:text-white">
              {averageRating.toFixed(1)}
            </span>
            {reviewCount > 0 && (
              <span className="text-xs text-gray-500 dark:text-gray-400">({reviewCount})</span>
            )}
          </div>
        )}
      </div>

      <CardContent className="p-5 bg-white dark:bg-gray-800">
        {/* Title */}
        <h3 className="font-bold text-lg mb-3 text-gray-900 dark:text-white line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-purple-400 transition-colors cursor-pointer"
          onClick={() => navigate(`${createPageUrl("EventDetails")}?id=${event.id}`)}
        >
          {event.title}
        </h3>

        {/* Date */}
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
          <Calendar className="w-4 h-4" />
          <span>
            {format(new Date(event.date), "dd 'de' MMMM, yyyy 'às' HH:mm", {
              locale: ptBR,
            })}
          </span>
        </div>

        {/* Location */}
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-3">
          <MapPin className="w-4 h-4" />
          <span className="line-clamp-1">{event.location}</span>
        </div>

        {/* Availability */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-sm mb-1">
            <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
              <Users className="w-4 h-4" />
              <span>
                {availableTickets > 0
                  ? `${availableTickets} disponíveis`
                  : "Esgotado"}
              </span>
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-500">
              {occupancyPercentage.toFixed(0)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
            <div
              className={`h-full transition-all ${
                occupancyPercentage > 80
                  ? "bg-red-500 dark:bg-red-600"
                  : occupancyPercentage > 50
                  ? "bg-orange-500 dark:bg-orange-600"
                  : "bg-blue-600 dark:bg-purple-500"
              }`}
              style={{ width: `${occupancyPercentage}%` }}
            />
          </div>
        </div>

        {/* Price and Button */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-blue-600 dark:text-purple-400">
              R$ {event.price?.toFixed(2)}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-500">por pessoa</span>
          </div>
          <Button
            onClick={() => navigate(`${createPageUrl("EventDetails")}?id=${event.id}`)}
            className="bg-blue-600 hover:bg-blue-700 dark:bg-purple-600 dark:hover:bg-purple-700 text-white gap-2"
          >
            Ver mais
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}