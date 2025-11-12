import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, User, Users } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import OrganizerRating from "../organizer/OrganizerRating";

const categoryLabels = {
  show: "Show",
  teatro: "Teatro",
  esporte: "Esporte",
  festival: "Festival",
  conferencia: "Conferência",
  workshop: "Workshop",
  outro: "Outro",
};

export default function EventDetailsInfo({ event, organizer, availableTickets }) {
  return (
    <Card className="border-none shadow-lg">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-3xl mb-2">{event.title}</CardTitle>
            {event.category && (
              <Badge className="bg-blue-100 text-blue-700">
                {categoryLabels[event.category] || event.category}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-3 text-gray-700">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <Calendar className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Data e Hora</p>
            <p className="font-medium">
              {format(new Date(event.date), "dd 'de' MMMM, yyyy 'às' HH:mm", {
                locale: ptBR,
              })}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-gray-700">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <MapPin className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Localização</p>
            <p className="font-medium">{event.location}</p>
            <p className="text-sm text-gray-600">{event.city}, {event.state}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-gray-700">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <User className="w-5 h-5 text-blue-600" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-gray-500">Organizador</p>
            <div className="flex items-center gap-2">
              <p className="font-medium">{event.organizer_name || "Não informado"}</p>
              {organizer && organizer.organizer_reviews_count > 0 && (
                <OrganizerRating organizer={organizer} compact />
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 text-gray-700">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <Users className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Disponibilidade</p>
            <p className="font-medium">
              {availableTickets} de {event.capacity} ingressos disponíveis
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all"
                style={{ width: `${((event.tickets_sold || 0) / event.capacity) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}