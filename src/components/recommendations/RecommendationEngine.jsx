import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Sparkles, TrendingUp, Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import EventCard from "../events/EventCard";

export default function RecommendationEngine({ user, allEvents, allReviews }) {
  const [recommendations, setRecommendations] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [lastGenerated, setLastGenerated] = useState(null);
  const [hasGenerated, setHasGenerated] = useState(false);

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
  const eventRatings = React.useMemo(() => {
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

  const generateRecommendations = async () => {
    if (!user || allEvents.length === 0 || isGenerating) return;

    setIsGenerating(true);

    try {
      // Prepare user behavior data
      const purchasedEventIds = userTickets.map(t => t.event_id);
      const purchasedEvents = allEvents.filter(e => purchasedEventIds.includes(e.id));
      
      const reviewedEvents = userReviews.map(r => ({
        event_id: r.event_id,
        event_title: r.event_title,
        rating: r.rating,
        comment: r.comment
      }));

      // Calculate trending events (most tickets sold recently)
      const trendingEvents = allEvents
        .filter(e => e.status === "ativo" && new Date(e.date) > new Date())
        .sort((a, b) => (b.tickets_sold || 0) - (a.tickets_sold || 0))
        .slice(0, 10);

      // Get high-rated events
      const highRatedEvents = allEvents
        .filter(e => e.status === "ativo" && new Date(e.date) > new Date())
        .filter(e => eventRatings[e.id] && eventRatings[e.id].average >= 4)
        .slice(0, 10);

      // Call AI for personalized recommendations
      const aiResponse = await base44.integrations.Core.InvokeLLM({
        prompt: `Você é um sistema de recomendação de eventos inteligente. Analise o histórico e preferências do usuário e recomende os melhores eventos.

DADOS DO USUÁRIO:
Nome: ${user.full_name}
Email: ${user.email}

HISTÓRICO DE COMPRAS (${purchasedEvents.length} eventos):
${purchasedEvents.length > 0 ? purchasedEvents.map(e => 
  `- ${e.title} (Categoria: ${e.category}, Cidade: ${e.city}, Preço: R$ ${e.price})`
).join('\n') : 'Nenhuma compra anterior'}

AVALIAÇÕES DO USUÁRIO (${userReviews.length} reviews):
${userReviews.length > 0 ? reviewedEvents.map(r => 
  `- ${r.event_title}: ${r.rating}/5 estrelas ${r.comment ? `- "${r.comment}"` : ''}`
).join('\n') : 'Nenhuma avaliação feita'}

PREFERÊNCIAS SALVAS:
${userPreferences ? `
- Categorias favoritas: ${userPreferences.favorite_categories?.join(', ') || 'não definido'}
- Cidades preferidas: ${userPreferences.preferred_cities?.join(', ') || 'não definido'}
- Faixa de preço: R$ ${userPreferences.price_range_min || 0} - R$ ${userPreferences.price_range_max || 1000}
` : 'Nenhuma preferência salva'}

EVENTOS DISPONÍVEIS (${allEvents.filter(e => e.status === "ativo").length} ativos):
${allEvents.filter(e => e.status === "ativo" && new Date(e.date) > new Date()).slice(0, 50).map((e, i) => 
  `${i + 1}. ID: ${e.id}
   Título: ${e.title}
   Categoria: ${e.category}
   Cidade: ${e.city}, ${e.state}
   Data: ${e.date}
   Preço: R$ ${e.price}
   Ingressos vendidos: ${e.tickets_sold || 0}/${e.capacity}
   Avaliação média: ${eventRatings[e.id] ? eventRatings[e.id].average.toFixed(1) : 'N/A'} (${eventRatings[e.id]?.count || 0} reviews)
   Descrição: ${e.description.substring(0, 100)}...`
).join('\n\n')}

EVENTOS EM TENDÊNCIA (mais vendidos):
${trendingEvents.map(e => `- ${e.title} (${e.tickets_sold} vendidos)`).join('\n')}

EVENTOS BEM AVALIADOS (4+ estrelas):
${highRatedEvents.map(e => `- ${e.title} (${eventRatings[e.id].average.toFixed(1)}/5)`).join('\n')}

TAREFA:
1. Analise o perfil do usuário (histórico, avaliações, preferências)
2. Identifique padrões de comportamento e gostos
3. Considere eventos em tendência e bem avaliados
4. Recomende os TOP 6 eventos mais relevantes para este usuário
5. Priorize eventos que:
   - Sejam similares aos que o usuário gostou (avaliou bem)
   - Estejam nas categorias/cidades preferidas
   - Tenham boa avaliação geral
   - Estejam em tendência
   - Não tenha comprado antes (evite duplicatas)

IMPORTANTE: 
- Se o usuário nunca comprou nada, foque em eventos populares e bem avaliados
- Considere a diversidade (não recomende apenas uma categoria)
- Retorne APENAS IDs de eventos que existem na lista de EVENTOS DISPONÍVEIS

Retorne um JSON com:
{
  "recommended_event_ids": ["id1", "id2", "id3", "id4", "id5", "id6"],
  "reasoning": {
    "id1": "motivo da recomendação em português",
    "id2": "motivo da recomendação em português",
    ...
  },
  "user_profile_summary": "breve resumo do perfil do usuário em português"
}`,
        response_json_schema: {
          type: "object",
          properties: {
            recommended_event_ids: {
              type: "array",
              items: { type: "string" }
            },
            reasoning: {
              type: "object",
              additionalProperties: { type: "string" }
            },
            user_profile_summary: { type: "string" }
          }
        }
      });

      // Filter valid recommendations
      const recommendedEvents = allEvents.filter(e => 
        aiResponse.recommended_event_ids.includes(e.id) &&
        e.status === "ativo" &&
        new Date(e.date) > new Date()
      );

      setRecommendations(recommendedEvents);
      setLastGenerated(new Date());
      setHasGenerated(true);
      
      console.log("🎯 AI Recommendations:", {
        user_profile: aiResponse.user_profile_summary,
        recommended_count: recommendedEvents.length,
        reasoning: aiResponse.reasoning
      });

      if (recommendedEvents.length > 0) {
        toast.success(`${recommendedEvents.length} eventos recomendados para você!`, {
          description: aiResponse.user_profile_summary,
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
  }, [user?.id, allEvents.length, hasGenerated, isGenerating]);

  if (!user) return null;

  return (
    <div className="mb-12">
      <Card className="border-none shadow-xl bg-gradient-to-br from-purple-50 to-blue-50 overflow-hidden">
        <CardHeader className="relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-200 rounded-full filter blur-3xl opacity-30 -mr-32 -mt-32"></div>
          <div className="relative z-10">
            <CardTitle className="flex items-center gap-3 text-2xl">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              Recomendado Para Você
            </CardTitle>
            <p className="text-sm text-gray-600 mt-2">
              Eventos selecionados especialmente com base no seu perfil e preferências
            </p>
          </div>
          <Button
            onClick={generateRecommendations}
            disabled={isGenerating}
            size="sm"
            variant="outline"
            className="absolute top-6 right-6 z-10"
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
              <Loader2 className="w-12 h-12 text-purple-600 animate-spin mx-auto mb-4" />
              <p className="text-gray-600">Analisando suas preferências...</p>
              <p className="text-sm text-gray-500 mt-2">
                Estamos usando IA para encontrar os melhores eventos para você
              </p>
            </div>
          ) : recommendations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {recommendations.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  averageRating={eventRatings[event.id]?.average || 0}
                  reviewCount={eventRatings[event.id]?.count || 0}
                  recommendedBadge={true}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Comece a Explorar!
              </h3>
              <p className="text-gray-600 mb-4">
                Compre ingressos e avalie eventos para receber recomendações personalizadas
              </p>
              <Button onClick={generateRecommendations} variant="outline">
                <Sparkles className="w-4 h-4 mr-2" />
                Gerar Recomendações
              </Button>
            </div>
          )}
          
          {lastGenerated && recommendations.length > 0 && (
            <p className="text-xs text-gray-500 text-center mt-6">
              Última atualização: {lastGenerated.toLocaleString('pt-BR')}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}