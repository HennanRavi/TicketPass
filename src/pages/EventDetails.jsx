import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Calendar, ArrowLeft, Star, Ticket as TicketIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import LoadingSpinner from "../components/common/LoadingSpinner";
import EmptyState from "../components/common/EmptyState";
import EventDetailsInfo from "../components/events/EventDetailsInfo";
import PurchaseCard from "../components/events/PurchaseCard";
import ReviewSection from "../components/reviews/ReviewSection";
import OrganizerRating from "../components/organizer/OrganizerRating";
import LoginModal from "../components/auth/LoginModal";

export default function EventDetails() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const urlParams = new URLSearchParams(window.location.search);
  const eventId = urlParams.get("id");

  const [user, setUser] = useState(null);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => setUser(null));
  }, []);

  const { data: event, isLoading } = useQuery({
    queryKey: ["event", eventId],
    queryFn: async () => {
      const events = await base44.entities.Event.filter({ id: eventId });
      return events[0];
    },
    enabled: !!eventId,
  });

  const { data: organizer } = useQuery({
    queryKey: ["organizer", event?.organizer_id],
    queryFn: async () => {
      if (!event?.organizer_id) return null;
      const users = await base44.entities.User.filter({ id: event.organizer_id });
      return users[0];
    },
    enabled: !!event?.organizer_id,
  });

  const { data: reviews, isLoading: reviewsLoading } = useQuery({
    queryKey: ["reviews", eventId],
    queryFn: () => base44.entities.Review.filter({ event_id: eventId }, "-created_date"),
    enabled: !!eventId,
    initialData: [],
  });

  const { data: userTickets } = useQuery({
    queryKey: ["user-tickets", user?.id, eventId],
    queryFn: () => base44.entities.Ticket.filter({ buyer_id: user.id, event_id: eventId }),
    enabled: !!user && !!eventId,
    initialData: [],
  });

  const hasAttendedEvent = userTickets.some((ticket) => ticket.status === "usado");
  const hasPurchasedTicket = userTickets.length > 0;
  const hasReviewed = reviews.some((review) => review.user_id === user?.id);
  const eventHasStarted = event ? new Date(event.date) < new Date() : false;

  const averageRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  const submitReviewMutation = useMutation({
    mutationFn: async (reviewData) => {
      return await base44.entities.Review.create({
        ...reviewData,
        event_id: eventId,
        event_title: event.title,
        user_id: user.id,
        user_name: user.full_name,
        user_profile_image: user.profile_image || "",
        attended: hasAttendedEvent,
      });
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["reviews", eventId] });
      toast.success("Avaliação enviada com sucesso!");

      if (event.organizer_id) {
        try {
          const organizerEvents = await base44.entities.Event.filter({ 
            organizer_id: event.organizer_id 
          });
          
          const allReviews = await base44.entities.Review.list();
          const organizerReviews = allReviews.filter(review => 
            organizerEvents.some(e => e.id === review.event_id)
          );

          if (organizerReviews.length > 0) {
            const totalRating = organizerReviews.reduce((sum, r) => sum + r.rating, 0);
            const avgRating = totalRating / organizerReviews.length;

            await base44.auth.updateMe({
              organizer_rating: avgRating,
              organizer_reviews_count: organizerReviews.length,
              organizer_events_count: organizerEvents.length
            });
          }
        } catch (error) {
          console.error("Error updating organizer rating:", error);
        }

        base44.entities.Notification.create({
          user_id: event.organizer_id,
          title: "Nova Avaliação! ⭐",
          message: `${user.full_name} avaliou o evento "${event.title}"`,
          type: "info",
          category: "event",
          link: `${createPageUrl("EventDetails")}?id=${eventId}`,
        });
      }
    },
    onError: () => {
      toast.error("Erro ao enviar avaliação");
    },
  });

  const purchaseTicket = async (quantity) => {
    if (!user) {
      // Abrir modal de login ao invés de redirecionar
      setShowLoginModal(true);
      return;
    }

    // Redirect to checkout page
    navigate(`${createPageUrl("Checkout")}?event=${eventId}&quantity=${quantity}`);
  };

  const handleLoginSuccess = () => {
    setShowLoginModal(false);
    // Recarregar dados do usuário
    base44.auth.me().then(setUser).catch(() => setUser(null));
    toast.success("Login realizado com sucesso!");
  };

  if (isLoading) {
    return <LoadingSpinner text="Carregando evento..." />;
  }

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50 dark:bg-gray-950">
        <EmptyState
          icon={TicketIcon}
          title="Evento não encontrado"
          description="O evento que você está procurando não existe ou foi removido."
          action={() => navigate(createPageUrl("Home"))}
          actionLabel="Voltar para Eventos"
        />
      </div>
    );
  }

  const availableTickets = event.capacity - (event.tickets_sold || 0);

  return (
    <div className="min-h-screen py-8 bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-purple-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Button
          variant="ghost"
          className="mb-6 dark:text-gray-300 dark:hover:bg-gray-800"
          onClick={() => navigate(createPageUrl("Home"))}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image */}
            <div className="relative h-96 rounded-3xl overflow-hidden bg-gradient-to-br from-blue-400 to-blue-600 dark:from-purple-800 dark:to-purple-900 shadow-2xl">
              {event.image_url ? (
                <img
                  src={event.image_url}
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Calendar className="w-32 h-32 text-white opacity-50" />
                </div>
              )}
              
              {/* Rating Badge */}
              {averageRating > 0 && (
                <div className="absolute top-6 left-6 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm rounded-xl px-4 py-2 flex items-center gap-2 shadow-lg">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span className="text-lg font-bold text-gray-900 dark:text-white">
                    {averageRating.toFixed(1)}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">({reviews.length})</span>
                </div>
              )}
            </div>

            {/* Organizer Rating */}
            {organizer && organizer.organizer_reviews_count > 0 && (
              <OrganizerRating organizer={organizer} />
            )}

            {/* Tabs */}
            <Tabs defaultValue="info" className="w-full">
              <TabsList className="w-full grid grid-cols-2 dark:bg-gray-800">
                <TabsTrigger value="info" className="dark:data-[state=active]:bg-purple-600">Informações</TabsTrigger>
                <TabsTrigger value="reviews" className="dark:data-[state=active]:bg-purple-600">
                  Avaliações ({reviews.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="info" className="space-y-6 mt-6">
                <EventDetailsInfo 
                  event={event} 
                  organizer={organizer}
                  availableTickets={availableTickets}
                />

                {/* Description */}
                <Card className="border-none shadow-lg dark:bg-gray-800">
                  <CardHeader>
                    <CardTitle className="dark:text-white">Sobre o Evento</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                      {event.description}
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reviews" className="space-y-6 mt-6">
                <ReviewSection
                  reviews={reviews}
                  user={user}
                  hasPurchasedTicket={hasPurchasedTicket}
                  hasReviewed={hasReviewed}
                  eventHasStarted={eventHasStarted}
                  event={event}
                  onSubmitReview={(data) => submitReviewMutation.mutate(data)}
                  isSubmitting={submitReviewMutation.isPending}
                />
              </TabsContent>
            </Tabs>
          </div>

          {/* Purchase Card */}
          <div className="lg:col-span-1">
            <PurchaseCard
              event={event}
              availableTickets={availableTickets}
              user={user}
              isPurchasing={isPurchasing}
              onPurchase={purchaseTicket}
            />
          </div>
        </div>
      </div>

      {/* Login Modal */}
      <LoginModal
        open={showLoginModal}
        onOpenChange={setShowLoginModal}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
}