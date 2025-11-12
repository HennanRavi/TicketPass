import React, { useState } from "react";
import { Star, User, ThumbsUp, Flag, ChevronDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

function StarRating({ rating }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-4 h-4 ${
            star <= rating
              ? "fill-yellow-400 text-yellow-400"
              : "text-gray-300"
          }`}
        />
      ))}
    </div>
  );
}

export default function ReviewList({ reviews }) {
  const [sortBy, setSortBy] = useState("recent");
  const [showAll, setShowAll] = useState(false);

  if (reviews.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Star className="w-8 h-8 text-gray-300" />
        </div>
        <p className="text-gray-500 font-medium">Nenhuma avaliação ainda</p>
        <p className="text-sm text-gray-400 mt-2">
          Seja o primeiro a avaliar este evento!
        </p>
      </div>
    );
  }

  // Sort reviews
  const sortedReviews = [...reviews].sort((a, b) => {
    if (sortBy === "recent") {
      return new Date(b.created_date) - new Date(a.created_date);
    } else if (sortBy === "oldest") {
      return new Date(a.created_date) - new Date(b.created_date);
    } else if (sortBy === "highest") {
      return b.rating - a.rating;
    } else if (sortBy === "lowest") {
      return a.rating - b.rating;
    }
    return 0;
  });

  // Show only 5 reviews initially
  const displayedReviews = showAll ? sortedReviews : sortedReviews.slice(0, 5);

  // Calculate rating distribution
  const ratingDistribution = [5, 4, 3, 2, 1].map(rating => ({
    stars: rating,
    count: reviews.filter(r => r.rating === rating).length,
    percentage: (reviews.filter(r => r.rating === rating).length / reviews.length) * 100
  }));

  const averageRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Average Rating */}
        <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl p-6 border border-blue-100">
          <div className="text-center">
            <div className="text-5xl font-bold text-gray-900 mb-2">
              {averageRating.toFixed(1)}
            </div>
            <div className="flex justify-center mb-2">
              <StarRating rating={Math.round(averageRating)} />
            </div>
            <p className="text-sm text-gray-600">
              Baseado em {reviews.length} {reviews.length === 1 ? 'avaliação' : 'avaliações'}
            </p>
          </div>
        </div>

        {/* Rating Distribution */}
        <div className="space-y-2">
          {ratingDistribution.map(({ stars, count, percentage }) => (
            <div key={stars} className="flex items-center gap-3">
              <div className="flex items-center gap-1 w-12">
                <span className="text-sm font-medium text-gray-700">{stars}</span>
                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              </div>
              <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-yellow-400 rounded-full transition-all"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <span className="text-xs text-gray-500 w-8">{count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Sort Controls */}
      <div className="flex items-center justify-between border-t border-gray-200 pt-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Todas as Avaliações
        </h3>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recent">Mais Recentes</SelectItem>
            <SelectItem value="oldest">Mais Antigas</SelectItem>
            <SelectItem value="highest">Maior Nota</SelectItem>
            <SelectItem value="lowest">Menor Nota</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {displayedReviews.map((review) => (
          <Card key={review.id} className="border-none shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                {/* Avatar */}
                {review.user_profile_image ? (
                  <img
                    src={review.user_profile_image}
                    alt={review.user_name || "Usuário"}
                    className="w-12 h-12 rounded-full object-cover flex-shrink-0 border-2 border-gray-200"
                  />
                ) : (
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-6 h-6 text-white" />
                  </div>
                )}

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-gray-900">
                          {review.user_name || "Usuário Anônimo"}
                        </h4>
                        {review.attended && (
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-xs">
                            ✓ Participou
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <StarRating rating={review.rating} />
                        <span className="text-xs text-gray-500">
                          {format(
                            new Date(review.created_date),
                            "dd 'de' MMMM, yyyy",
                            { locale: ptBR }
                          )}
                        </span>
                      </div>
                    </div>
                  </div>

                  {review.comment && (
                    <p className="text-gray-700 text-sm leading-relaxed mb-3">
                      {review.comment}
                    </p>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
                    <button className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-blue-600 transition-colors">
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span>Útil</span>
                    </button>
                    <button className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-red-600 transition-colors">
                      <Flag className="w-3.5 h-3.5" />
                      <span>Reportar</span>
                    </button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Show More Button */}
      {reviews.length > 5 && !showAll && (
        <div className="text-center pt-4">
          <Button
            variant="outline"
            onClick={() => setShowAll(true)}
            className="gap-2"
          >
            Ver Todas as {reviews.length} Avaliações
            <ChevronDown className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
}