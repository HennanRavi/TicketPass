import React from "react";
import { Star, Award, TrendingUp, Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function OrganizerRating({ organizer, compact = false }) {
  const rating = organizer?.organizer_rating || 0;
  const reviewsCount = organizer?.organizer_reviews_count || 0;
  const eventsCount = organizer?.organizer_events_count || 0;

  if (reviewsCount === 0 && !compact) {
    return (
      <Card className="border-none shadow-lg bg-gradient-to-br from-gray-50 to-white">
        <CardContent className="p-6 text-center">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <Star className="w-6 h-6 text-gray-400" />
          </div>
          <p className="text-sm text-gray-500">Organizador ainda sem avaliações</p>
        </CardContent>
      </Card>
    );
  }

  if (reviewsCount === 0 && compact) {
    return null;
  }

  // Determine badge level
  const getBadgeInfo = () => {
    if (rating >= 4.8) return { label: "Organizador Elite", color: "from-purple-500 to-pink-500", icon: "👑" };
    if (rating >= 4.5) return { label: "Organizador Premium", color: "from-blue-500 to-purple-500", icon: "⭐" };
    if (rating >= 4.0) return { label: "Organizador Verificado", color: "from-green-500 to-emerald-500", icon: "✓" };
    return { label: "Organizador", color: "from-gray-500 to-gray-600", icon: "📋" };
  };

  const badgeInfo = getBadgeInfo();

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1 bg-gradient-to-r from-yellow-50 to-orange-50 px-3 py-1.5 rounded-lg border border-yellow-200">
          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          <span className="text-sm font-bold text-gray-900">{rating.toFixed(1)}</span>
          <span className="text-xs text-gray-600">({reviewsCount})</span>
        </div>
        {rating >= 4.0 && (
          <Badge className={`bg-gradient-to-r ${badgeInfo.color} text-white border-0 text-xs`}>
            {badgeInfo.icon} {badgeInfo.label}
          </Badge>
        )}
      </div>
    );
  }

  return (
    <Card className="border-none shadow-lg bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          {/* Rating Circle */}
          <div className="flex-shrink-0">
            <div className="relative w-20 h-20 bg-white rounded-full shadow-lg flex items-center justify-center">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span className="text-2xl font-bold text-gray-900">{rating.toFixed(1)}</span>
                </div>
              </div>
              {rating >= 4.0 && (
                <div className="absolute -top-1 -right-1 w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-lg shadow-lg">
                  {badgeInfo.icon}
                </div>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1">
            <div className="mb-3">
              <h3 className="font-bold text-gray-900 text-lg mb-1">
                {organizer?.full_name || "Organizador"}
              </h3>
              {rating >= 4.0 && (
                <Badge className={`bg-gradient-to-r ${badgeInfo.color} text-white border-0 text-xs`}>
                  {badgeInfo.icon} {badgeInfo.label}
                </Badge>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center bg-white/70 rounded-lg p-2">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Star className="w-3 h-3 text-yellow-500" />
                  <span className="text-lg font-bold text-gray-900">{reviewsCount}</span>
                </div>
                <p className="text-xs text-gray-600">Avaliações</p>
              </div>

              <div className="text-center bg-white/70 rounded-lg p-2">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Calendar className="w-3 h-3 text-blue-500" />
                  <span className="text-lg font-bold text-gray-900">{eventsCount}</span>
                </div>
                <p className="text-xs text-gray-600">Eventos</p>
              </div>

              <div className="text-center bg-white/70 rounded-lg p-2">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <TrendingUp className="w-3 h-3 text-green-500" />
                  <span className="text-lg font-bold text-gray-900">
                    {eventsCount > 0 ? (reviewsCount / eventsCount).toFixed(1) : "0"}
                  </span>
                </div>
                <p className="text-xs text-gray-600">Média/Evento</p>
              </div>
            </div>

            {/* Star Rating */}
            <div className="flex items-center justify-center gap-1 mt-3 pt-3 border-t border-white/50">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-5 h-5 ${
                    star <= Math.round(rating)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}