import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, Calendar, Ticket as TicketIcon, CheckCircle2 } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { base44 } from "@/api/base44Client";
import ReviewForm from "./ReviewForm";
import ReviewList from "./ReviewList";
import ReviewStats from "./ReviewStats";

export default function ReviewSection({
  reviews,
  user,
  hasPurchasedTicket,
  hasReviewed,
  eventHasStarted,
  event,
  onSubmitReview,
  isSubmitting,
}) {
  const averageRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  const renderReviewPrompt = () => {
    // Not logged in
    if (!user) {
      return (
        <Card className="border-none shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 dark:bg-gray-800">
          <CardContent className="p-8 text-center">
            <div className="w-20 h-20 bg-blue-100 dark:bg-purple-900/40 rounded-full flex items-center justify-center mx-auto mb-4">
              <Star className="w-10 h-10 text-blue-600 dark:text-purple-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              Faça login para avaliar
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Entre na sua conta para compartilhar sua experiência sobre este evento
            </p>
            <Button 
              onClick={() => base44.auth.redirectToLogin(window.location.href)}
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 dark:bg-purple-600 dark:hover:bg-purple-700"
            >
              Fazer Login
            </Button>
          </CardContent>
        </Card>
      );
    }

    // Event hasn't started yet
    if (!eventHasStarted) {
      return (
        <Card className="border-none shadow-lg bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 dark:bg-gray-800">
          <CardContent className="p-8 text-center">
            <div className="w-20 h-20 bg-orange-100 dark:bg-orange-900/40 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-10 h-10 text-orange-600 dark:text-orange-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              Evento ainda não aconteceu
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Você poderá avaliar este evento após sua realização
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 dark:bg-orange-900/40 rounded-lg">
              <Calendar className="w-4 h-4 text-orange-600 dark:text-orange-400" />
              <span className="text-sm font-semibold text-orange-900 dark:text-orange-300">
                {format(new Date(event.date), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
              </span>
            </div>
          </CardContent>
        </Card>
      );
    }

    // Hasn't purchased ticket
    if (!hasPurchasedTicket) {
      return (
        <Card className="border-none shadow-lg bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 dark:bg-gray-800">
          <CardContent className="p-8 text-center">
            <div className="w-20 h-20 bg-purple-100 dark:bg-purple-900/40 rounded-full flex items-center justify-center mx-auto mb-4">
              <TicketIcon className="w-10 h-10 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              Compre um ingresso para avaliar
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Apenas participantes que compraram ingressos podem avaliar este evento
            </p>
            <p className="text-sm text-purple-600 dark:text-purple-400 font-medium">
              💡 Compartilhe sua experiência após participar do evento!
            </p>
          </CardContent>
        </Card>
      );
    }

    // Already reviewed
    if (hasReviewed) {
      return (
        <Card className="border-none shadow-lg bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 dark:bg-gray-800">
          <CardContent className="p-8 text-center">
            <div className="w-20 h-20 bg-green-100 dark:bg-green-900/40 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-10 h-10 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              Obrigado pela sua avaliação!
            </h3>
            <p className="text-green-700 dark:text-green-400 font-medium mb-2">
              Sua opinião foi registrada com sucesso
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Você pode ver sua avaliação na lista abaixo
            </p>
          </CardContent>
        </Card>
      );
    }

    // Can review - show form
    return (
      <ReviewForm
        onSubmit={onSubmitReview}
        isSubmitting={isSubmitting}
      />
    );
  };

  return (
    <div className="space-y-6">
      {/* Review Stats */}
      <ReviewStats reviews={reviews} />

      {/* Review Form / Prompt */}
      {renderReviewPrompt()}

      {/* Reviews List */}
      <Card className="border-none shadow-lg dark:bg-gray-800">
        <CardHeader>
          <CardTitle className="text-xl dark:text-white">Avaliações dos Participantes</CardTitle>
          {averageRating > 0 && (
            <div className="flex items-center gap-3 mt-3 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-6 h-6 ${
                      star <= Math.round(averageRating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300 dark:text-gray-600"
                    }`}
                  />
                ))}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                  {averageRating.toFixed(1)}
                </span>
                <div className="text-left">
                  <p className="text-xs text-gray-500 dark:text-gray-400">de 5.0</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {reviews.length} {reviews.length === 1 ? "avaliação" : "avaliações"}
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardHeader>
        <CardContent>
          <ReviewList reviews={reviews} />
        </CardContent>
      </Card>
    </div>
  );
}