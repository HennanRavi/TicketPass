import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { User, Ticket, Calendar, PartyPopper, Briefcase, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export default function Onboarding() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    base44.auth
      .me()
      .then((u) => {
        setUser(u);
        setIsLoading(false);
        
        // If user already has a type set, redirect to home
        if (u.user_type) {
          navigate(createPageUrl("Home"));
        }
      })
      .catch(() => {
        base44.auth.redirectToLogin(window.location.href);
      });
  }, []);

  const completeOnboardingMutation = useMutation({
    mutationFn: async (userType) => {
      await base44.auth.updateMe({
        user_type: userType,
      });
    },
    onSuccess: () => {
      toast.success("✅ Perfil configurado com sucesso!", {
        description: "Bem-vindo à plataforma TicketPass!",
      });
      navigate(createPageUrl("Home"));
    },
    onError: () => {
      toast.error("Erro ao salvar configurações. Tente novamente.");
    },
  });

  const handleSelectType = (type) => {
    setSelectedType(type);
  };

  const handleContinue = () => {
    if (!selectedType) {
      toast.error("Por favor, selecione um tipo de perfil");
      return;
    }
    completeOnboardingMutation.mutate(selectedType);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-3xl mb-6 shadow-xl">
            <Ticket className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Bem-vindo ao TicketPass! 🎉
          </h1>
          <p className="text-xl text-gray-600">
            {user?.display_name || user?.full_name || "Olá"}! Como você deseja usar a plataforma?
          </p>
        </div>

        {/* Type Selection Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Participant Card */}
          <Card
            className={`cursor-pointer transition-all duration-300 border-2 ${
              selectedType === "participante"
                ? "border-green-600 shadow-xl scale-105 bg-gradient-to-br from-green-50 to-emerald-50"
                : "border-gray-200 hover:border-green-400 hover:shadow-lg"
            }`}
            onClick={() => handleSelectType("participante")}
          >
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                <PartyPopper className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl mb-2">🎉 Participante</CardTitle>
              <CardDescription className="text-base">
                Descubra e participe de eventos incríveis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  </div>
                  <span className="text-sm text-gray-700">
                    Pesquise e encontre eventos próximos a você
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  </div>
                  <span className="text-sm text-gray-700">
                    Compre ingressos online de forma rápida e segura
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  </div>
                  <span className="text-sm text-gray-700">
                    Gerencie seus ingressos em um só lugar
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  </div>
                  <span className="text-sm text-gray-700">
                    Avalie eventos e compartilhe sua experiência
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  </div>
                  <span className="text-sm text-gray-700">
                    Receba recomendações personalizadas
                  </span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Organizer Card */}
          <Card
            className={`cursor-pointer transition-all duration-300 border-2 ${
              selectedType === "organizador"
                ? "border-blue-600 shadow-xl scale-105 bg-gradient-to-br from-blue-50 to-indigo-50"
                : "border-gray-200 hover:border-blue-400 hover:shadow-lg"
            }`}
            onClick={() => handleSelectType("organizador")}
          >
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                <Briefcase className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl mb-2">👔 Organizador</CardTitle>
              <CardDescription className="text-base">
                Crie e gerencie seus próprios eventos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  </div>
                  <span className="text-sm text-gray-700">
                    Crie eventos personalizados com facilidade
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  </div>
                  <span className="text-sm text-gray-700">
                    Venda ingressos e gerencie participantes
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  </div>
                  <span className="text-sm text-gray-700">
                    Acompanhe vendas e métricas em tempo real
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  </div>
                  <span className="text-sm text-gray-700">
                    Receba avaliações e construa sua reputação
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  </div>
                  <span className="text-sm text-gray-700">
                    Dashboard completo com relatórios detalhados
                  </span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Info Alert */}
        <Card className="border-none shadow-lg bg-gradient-to-r from-yellow-50 to-orange-50 mb-8">
          <CardContent className="p-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-yellow-700" />
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  💡 Você pode mudar depois!
                </h3>
                <p className="text-sm text-gray-700">
                  Não se preocupe com sua escolha agora. Você pode alternar entre Participante e Organizador 
                  a qualquer momento nas suas configurações de perfil.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Continue Button */}
        <div className="flex justify-center">
          <Button
            size="lg"
            onClick={handleContinue}
            disabled={!selectedType || completeOnboardingMutation.isPending}
            className={`px-8 py-6 text-lg font-semibold shadow-xl transition-all duration-300 ${
              selectedType
                ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 scale-100"
                : "bg-gray-300 cursor-not-allowed"
            }`}
          >
            {completeOnboardingMutation.isPending ? (
              <>
                <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                Configurando...
              </>
            ) : (
              <>
                Continuar
                <ArrowRight className="w-5 h-5 ml-3" />
              </>
            )}
          </Button>
        </div>

        {/* Skip Link */}
        <div className="text-center mt-6">
          <button
            onClick={() => navigate(createPageUrl("Home"))}
            className="text-sm text-gray-500 hover:text-gray-700 underline"
          >
            Pular por agora (posso escolher depois)
          </button>
        </div>
      </div>
    </div>
  );
}