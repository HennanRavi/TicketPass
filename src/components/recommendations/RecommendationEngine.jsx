import React, { useState, useEffect, useMemo } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Sparkles, TrendingUp, Loader2, RefreshCw, Eye, ShoppingBag, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import EventCard from "../events/EventCard";

// Utility to get viewed events from localStorage
const getViewedEvents = () => {
  try {
    const viewed = localStorage.getItem('viewedEvents');
    return viewed ? JSON.parse(viewed) : {};
  } catch {
    return {};
  }
};

// Utility to calculate similarity between two events
const calculateEventSimilarity = (event1, event2) => {
  let score = 0;
  
  // Category match (highest weight)
  if (event1.category === event2.category) score += 40;
  
  // City match
  if (event1.city === event2.city) score += 20;
  
  // State match
  if (event1.state === event2.state) score += 10;
  
  // Price similarity (within 30% range)
  const priceDiff = Math.abs(event1.price - event2.price) / Math.max(event1.price, event2.price);
  if (priceDiff <= 0.3) score += 30;
  
  return score;
};

export default function RecommendationEngine({ user, allEvents, allReviews }) {
  const [recommendations, setRecommendations] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [lastGenerated, setLastGenerated] = useState(null);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [viewedEvents, setViewedEvents] = useState({});

  useEffect(() => {
    setViewedEvents(getViewedEvents());
  }, []);

  // Fetch user's purchase history
  const { data: userTickets } = useQuery({
    queryKey: ["user-tickets", user?.id],
    queryFn: () => base44.entities.Ticket.filter({ buyer_id: user.id }),
    enabled: !!user,
    initialData: [],
  });

  // Fetch user's reviews
  const { data: userReviews } = useQuery({
    queryKey: ["user-reviews", user?.id],
    queryFn: () => base44.entities.Review.filter({ user_id: user.id }),
    enabled: !!user,
    initialData: [],
  });

  // Fetch user preferences
  const { data: userPreferences } = useQuery({
    queryKey: ["user-preferences", user?.id],
    queryFn: async () => {
      const prefs = await base44.entities.UserPreference.filter({ user_id: user.id });
      return prefs[0] || null;
    },
    enabled: !!user,
  });

  // Calculate event ratings
  const eventRatings = useMemo(() => {
    const ratings = {};
    allReviews.forEach((review) => {
      if (!ratings[review.event_id]) {
        ratings[review.event_id] = { sum: 0, count: 0 };
      }
      ratings[review.event_id].sum += review.rating;
      ratings[review.event_id].count += 1;
    });
    
    Object.keys(ratings).forEach((eventId) => {
      ratings[eventId].average = ratings[eventId].sum / ratings[eventId].count;
    });
    
    return ratings;
  }, [allReviews]);

  // Get user behavior insights
  const userBehavior = useMemo(() => {
    const purchasedEventIds = userTickets.map(t => t.event_id);
    const purchasedEvents = allEvents.filter(e => purchasedEventIds.includes(e.id));
    
    const viewedEventIds = Object.keys(viewedEvents);
    const recentlyViewedEvents = allEvents
      .filter(e => viewedEventIds.includes(e.id))
      .map(e => ({ ...e, viewCount: viewedEvents[e.id].count, lastViewed: viewedEvents[e.id].lastViewed }))
      .sort((a, b) => new Date(b.lastViewed) - new Date(a.lastViewed))
      .slice(0, 10);

    // Extract preferences from behavior
    const categoryFrequency = {};
    const cityFrequency = {};
    const avgPrice = { sum: 0, count: 0 };

    [...purchasedEvents, ...recentlyViewedEvents].forEach(event => {
      categoryFrequency[event.category] = (categoryFrequency[event.category] || 0) + 1;
      cityFrequency[event.city] = (cityFrequency[event.city] || 0) + 1;
      avgPrice.sum += event.price;
      avgPrice.count++;
    });

    const topCategories = Object.entries(categoryFrequency)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([cat]) => cat);

    const topCities = Object.entries(cityFrequency)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([city]) => city);

    return {
      purchasedEvents,
      recentlyViewedEvents,
      topCategories,
      topCities,
      avgPrice: avgPrice.count > 0 ? avgPrice.sum / avgPrice.count : null,
      hasActivity: purchasedEvents.length > 0 || recentlyViewedEvents.length > 0
    };
  }, [userTickets, allEvents, viewedEvents]);

  const generateRecommendations = async () => {
    if (!user || allEvents.length === 0 || isGenerating) return;

    setIsGenerating(true);

    try {
      const activeEvents = allEvents.filter(e => e.status === "ativo" && new Date(e.date) > new Date());
      
      // Already purchased/viewed event IDs to avoid
      const excludeIds = [
        ...userBehavior.purchasedEvents.map(e => e.id),
      ];

      // Score-based recommendation system
      const scoredEvents = activeEvents
        .filter(e => !excludeIds.includes(e.id))
        .map(event => {
          let score = 0;
          const reasons = [];

          // 1. Category preference (from purchases & views)
          if (userBehavior.topCategories.includes(event.category)) {
            const categoryIndex = userBehavior.topCategories.indexOf(event.category);
            score += (3 - categoryIndex) * 15;
            reasons.push(`Categoria ${event.category} é uma das suas favoritas`);
          }

          // 2. City preference
          if (userBehavior.topCities.includes(event.city)) {
            const cityIndex = userBehavior.topCities.indexOf(event.city);
            score += (3 - cityIndex) * 12;
            reasons.push(`Você costuma ver eventos em ${event.city}`);
          }

          // 3. User preferences entity
          if (userPreferences) {
            if (userPreferences.favorite_categories?.includes(event.category)) {
              score += 20;
              reasons.push("Está nas suas categorias favoritas salvas");
            }
            if (userPreferences.preferred_cities?.includes(event.city)) {
              score += 15;
              reasons.push("Está nas suas cidades preferidas");
            }
            // Price range preference
            const minPrice = userPreferences.price_range_min || 0;
            const maxPrice = userPreferences.price_range_max || 10000;
            if (event.price >= minPrice && event.price <= maxPrice) {
              score += 10;
              reasons.push("Preço dentro do seu orçamento preferido");
            }
          }

          // 4. Similar to purchased events (collaborative filtering)
          if (userBehavior.purchasedEvents.length > 0) {
            const similarities = userBehavior.purchasedEvents.map(pe => 
              calculateEventSimilarity(event, pe)
            );
            const maxSimilarity = Math.max(...similarities);
            score += maxSimilarity * 0.3;
            if (maxSimilarity > 50) {
              reasons.push("Similar a eventos que você comprou");
            }
          }

          // 5. Similar to highly viewed events
          const highlyViewed = userBehavior.recentlyViewedEvents.filter(e => e.viewCount >= 3);
          if (highlyViewed.length > 0) {
            const viewSimilarities = highlyViewed.map(ve => 
              calculateEventSimilarity(event, ve)
            );
            const maxViewSimilarity = Math.max(...viewSimilarities);
            score += maxViewSimilarity * 0.25;
            if (maxViewSimilarity > 50) {
              reasons.push("Similar a eventos que você visualizou várias vezes");
            }
          }

          // 6. High ratings boost
          if (eventRatings[event.id]) {
            const rating = eventRatings[event.id].average;
            const reviewCount = eventRatings[event.id].count;
            if (rating >= 4.5 && reviewCount >= 5) {
              score += 15;
              reasons.push(`Muito bem avaliado (${rating.toFixed(1)}/5)`);
            } else if (rating >= 4 && reviewCount >= 3) {
              score += 10;
              reasons.push(`Bem avaliado (${rating.toFixed(1)}/5)`);
            }
          }

          // 7. Popularity boost (trending)
          const salesRate = (event.tickets_sold || 0) / event.capacity;
          if (salesRate > 0.5 && salesRate < 0.9) {
            score += 10;
            reasons.push("Evento popular com ingressos disponíveis");
          }

          // 8. User's positive reviews influence
          const positiveReviews = userReviews.filter(r => r.rating >= 4);
          const reviewedEventIds = positiveReviews.map(r => r.event_id);
          const reviewedEvents = allEvents.filter(e => reviewedEventIds.includes(e.id));
          
          reviewedEvents.forEach(reviewedEvent => {
            const similarity = calculateEventSimilarity(event, reviewedEvent);
            if (similarity > 50) {
              score += 12;
              reasons.push("Similar a eventos que você avaliou positivamente");
            }
          });

          // 9. New user boost - show popular and well-rated events
          if (!userBehavior.hasActivity) {
            if (eventRatings[event.id]?.average >= 4) {
              score += 25;
              reasons.push("Recomendado para novos usuários");
            }
            if ((event.tickets_sold || 0) > 50) {
              score += 15;
              reasons.push("Popular entre outros usuários");
            }
          }

          return {
            ...event,
            recommendationScore: score,
            recommendationReasons: reasons
          };
        })
        .sort((a, b) => b.recommendationScore - a.recommendationScore)
        .slice(0, 6);

      setRecommendations(scoredEvents);
      setLastGenerated(new Date());
      setHasGenerated(true);
      
      console.log("🎯 Smart Recommendations:", {
        user_behavior: userBehavior,
        top_recommendations: scoredEvents.map(e => ({
          title: e.title,
          score: e.recommendationScore,
          reasons: e.recommendationReasons
        }))
      });

      if (scoredEvents.length > 0) {
        toast.success(`${scoredEvents.length} eventos recomendados para você!`, {
          description: userBehavior.hasActivity 
            ? "Baseado no seu histórico e preferências" 
            : "Eventos populares e bem avaliados",
          duration: 5000,
        });
      } else {
        toast.info("Nenhuma recomendação disponível no momento");
      }

    } catch (error) {
      console.error("Erro ao gerar recomendações:", error);
      toast.error("Erro ao gerar recomendações personalizadas");
    }

    setIsGenerating(false);
  };

  // Auto-generate on mount if user is logged in
  useEffect(() => {
    if (user && allEvents.length > 0 && !hasGenerated && !isGenerating) {
      generateRecommendations();
    }
  }, [user?.id, allEvents.length]);

  if (!user) return null;

  return (
    <div className="mb-12">
      <Card className="border-none shadow-xl bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 overflow-hidden">
        <CardHeader className="relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-200 dark:bg-purple-800/30 rounded-full filter blur-3xl opacity-30 -mr-32 -mt-32"></div>
          <div className="relative z-10">
            <CardTitle className="flex items-center gap-3 text-2xl text-gray-900 dark:text-white">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 dark:from-purple-500 dark:to-blue-500 rounded-xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              Recomendado Para Você
            </CardTitle>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              Eventos selecionados com base no seu perfil e preferências
            </p>
            
            {/* User Activity Badges */}
            {userBehavior.hasActivity && (
              <div className="flex flex-wrap gap-2 mt-3">
                {userBehavior.purchasedEvents.length > 0 && (
                  <Badge variant="secondary" className="text-xs dark:bg-gray-700 dark:text-gray-300">
                    <ShoppingBag className="w-3 h-3 mr-1" />
                    {userBehavior.purchasedEvents.length} compras
                  </Badge>
                )}
                {userBehavior.recentlyViewedEvents.length > 0 && (
                  <Badge variant="secondary" className="text-xs dark:bg-gray-700 dark:text-gray-300">
                    <Eye className="w-3 h-3 mr-1" />
                    {userBehavior.recentlyViewedEvents.length} visualizados
                  </Badge>
                )}
                {userReviews.length > 0 && (
                  <Badge variant="secondary" className="text-xs dark:bg-gray-700 dark:text-gray-300">
                    <Heart className="w-3 h-3 mr-1" />
                    {userReviews.length} avaliações
                  </Badge>
                )}
              </div>
            )}
          </div>
          <Button
            onClick={generateRecommendations}
            disabled={isGenerating}
            size="sm"
            variant="outline"
            className="absolute top-6 right-6 z-10 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Gerando...
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4 mr-2" />
                Atualizar
              </>
            )}
          </Button>
        </CardHeader>
        <CardContent>
          {isGenerating && recommendations.length === 0 ? (
            <div className="text-center py-12">
              <Loader2 className="w-12 h-12 text-purple-600 dark:text-purple-400 animate-spin mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">Analisando suas preferências...</p>
              <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                Estamos encontrando os melhores eventos para você
              </p>
            </div>
          ) : recommendations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {recommendations.map((event) => (
                <div key={event.id} className="relative">
                  <Badge className="absolute top-4 left-4 z-10 bg-gradient-to-r from-purple-500 to-blue-500 text-white border-none shadow-lg">
                    <Sparkles className="w-3 h-3 mr-1" fill="currentColor" />
                    {event.recommendationScore.toFixed(0)} pts
                  </Badge>
                  <EventCard
                    event={event}
                    averageRating={eventRatings[event.id]?.average || 0}
                    reviewCount={eventRatings[event.id]?.count || 0}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/40 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Comece a Explorar!
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Compre ingressos e visualize eventos para receber recomendações personalizadas
              </p>
              <Button onClick={generateRecommendations} variant="outline" className="dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600">
                <Sparkles className="w-4 h-4 mr-2" />
                Gerar Recomendações
              </Button>
            </div>
          )}
          
          {lastGenerated && recommendations.length > 0 && (
            <p className="text-xs text-gray-500 dark:text-gray-500 text-center mt-6">
              Última atualização: {lastGenerated.toLocaleString('pt-BR')}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}