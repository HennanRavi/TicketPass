import React from "react";
import { Star, TrendingUp, Award, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function ReviewStats({ reviews }) {
  if (!reviews || reviews.length === 0) {
    return null;
  }

  const averageRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  
  const ratingDistribution = [5, 4, 3, 2, 1].map(rating => ({
    stars: rating,
    count: reviews.filter(r => r.rating === rating).length,
    percentage: (reviews.filter(r => r.rating === rating).length / reviews.length) * 100
  }));

  const attendedCount = reviews.filter(r => r.attended).length;
  const withCommentCount = reviews.filter(r => r.comment && r.comment.trim()).length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      {/* Average Rating */}
      <Card className="border-none shadow-lg bg-gradient-to-br from-yellow-50 to-orange-50">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Star className="w-5 h-5 text-yellow-600 fill-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {averageRating.toFixed(1)}
              </p>
              <p className="text-xs text-gray-600">Avaliação Média</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Total Reviews */}
      <Card className="border-none shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {reviews.length}
              </p>
              <p className="text-xs text-gray-600">
                {reviews.length === 1 ? 'Avaliação' : 'Avaliações'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Attended */}
      <Card className="border-none shadow-lg bg-gradient-to-br from-green-50 to-emerald-50">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Award className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {attendedCount}
              </p>
              <p className="text-xs text-gray-600">Participantes</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* With Comments */}
      <Card className="border-none shadow-lg bg-gradient-to-br from-purple-50 to-pink-50">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {withCommentCount}
              </p>
              <p className="text-xs text-gray-600">Com Comentários</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}