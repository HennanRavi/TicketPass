
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
  Calendar,
  Shield,
  TrendingUp,
  Users,
  Zap,
  Search,
  ChevronLeft,
  ChevronRight,
  Star,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const testimonials = [
  {
    name: "Maria Silva",
    role: "Organizadora de Eventos",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400",
    rating: 5,
    text: "A plataforma revolucionou a forma como organizo meus eventos. Interface simples e pagamentos seguros!",
  },
  {
    name: "João Santos",
    role: "Produtor Musical",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
    rating: 5,
    text: "Consegui aumentar minhas vendas em 300% desde que comecei a usar. O dashboard é incrível!",
  },
  {
    name: "Ana Costa",
    role: "Participante Frequente",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400",
    rating: 5,
    text: "Comprar ingressos nunca foi tão fácil. Recebo tudo por email e posso acessar de qualquer lugar!",
  },
  {
    name: "Carlos Oliveira",
    role: "Organizador de Conferências",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400",
    rating: 5,
    text: "Excelente suporte e recursos avançados. Perfeito para eventos corporativos e conferências.",
  },
];

const features = [
  {
    icon: Calendar,
    title: "Gestão Completa",
    description: "Crie, edite e gerencie seus eventos com facilidade total",
  },
  {
    icon: Shield,
    title: "Pagamentos Seguros",
    description: "Processamento seguro com garantia de reembolso em 7 dias",
  },
  {
    icon: TrendingUp,
    title: "Dashboard Intuitivo",
    description: "Acompanhe vendas, receitas e métricas em tempo real",
  },
  {
    icon: Users,
    title: "Sem Limites",
    description: "Gerencie quantos eventos quiser sem restrições",
  },
  {
    icon: Zap,
    title: "Entrega Instantânea",
    description: "Ingressos entregues automaticamente por email",
  },
  {
    icon: Search,
    title: "Visibilidade Máxima",
    description: "Seus eventos aparecem para milhares de potenciais clientes",
  },
];

export default function SaibaMais() {
  const navigate = useNavigate();
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) =>
      prev === 0 ? testimonials.length - 1 : prev - 1
    );
  };

  const getVisibleTestimonials = () => {
    const visible = [];
    for (let i = -1; i <= 1; i++) {
      const index =
        (currentTestimonial + i + testimonials.length) % testimonials.length;
      visible.push({ ...testimonials[index], offset: i });
    }
    return visible;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-purple-950">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-blue-500/90 via-blue-400/80 to-white/90 dark:from-purple-900/90 dark:via-purple-800/80 dark:to-gray-900/90 backdrop-blur-3xl">
        {/* Decorative blur circles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400/30 dark:bg-purple-600/20 rounded-full blur-3xl animate-float-slow"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white/40 dark:bg-purple-900/30 rounded-full blur-3xl animate-float-reverse animate-pulse-glow"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white text-shadow-strong">
            A Plataforma Completa para Seus Eventos
          </h1>
          <p className="text-xl text-white/95 max-w-3xl mx-auto mb-8 text-shadow-medium">
            Organize, venda e gerencie ingressos de forma simples e profissional. 
            Tudo o que você precisa em um só lugar.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => navigate(createPageUrl("CreateEvent"))}
              className="bg-white text-blue-600 hover:bg-gray-50 dark:text-purple-600 shadow-2xl text-lg px-8 py-6"
            >
              Criar Meu Evento
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate(createPageUrl("Home"))}
              className="bg-white/50 backdrop-blur-sm border-white text-gray-900 hover:bg-white/70 dark:bg-white/10 dark:border-white/30 dark:text-white dark:hover:bg-white/20 text-lg px-8 py-6 shadow-xl"
            >
              <Search className="w-5 h-5 mr-2" />
              Buscar Eventos
            </Button>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Por Que Escolher a TicketPass?
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Recursos poderosos para tornar seus eventos um sucesso absoluto
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="border-none shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 dark:bg-gray-800"
            >
              <CardContent className="p-6">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 dark:from-purple-600 dark:to-indigo-700 rounded-2xl flex items-center justify-center mb-4">
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Payment Benefits */}
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-orange-950/40 dark:to-orange-900/40 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Pagamentos Simples e Seguros
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Processamento transparente com proteção para compradores e organizadores
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-green-100 dark:bg-orange-900/40 rounded-xl flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-orange-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                    Retenção de 7 Dias
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    O dinheiro fica retido por 7 dias após a compra, garantindo segurança para reembolsos.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-12 h-12 bg-blue-100 dark:bg-purple-900/40 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Shield className="w-6 h-6 text-blue-600 dark:text-purple-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                    Taxa Justa de 5%
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Apenas 5% de taxa da plataforma. Organizadores recebem 95% do valor.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-12 h-12 bg-purple-100 dark:bg-indigo-900/40 rounded-xl flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-6 h-6 text-purple-600 dark:text-indigo-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                    Transferência Automática
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Após 7 dias, o valor é automaticamente transferido para sua conta.
                  </p>
                </div>
              </div>
            </div>

            <Card className="border-none shadow-2xl dark:bg-gray-800">
              <CardContent className="p-8">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                  Exemplo de Transação
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-3 border-b border-gray-200 dark:border-gray-700">
                    <span className="text-gray-600 dark:text-gray-400">Ingresso vendido</span>
                    <span className="font-semibold text-gray-900 dark:text-white">R$ 100,00</span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-gray-200 dark:border-gray-700">
                    <span className="text-gray-600 dark:text-gray-400">Taxa da plataforma (5%)</span>
                    <span className="font-semibold text-red-600 dark:text-red-400">- R$ 5,00</span>
                  </div>
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-lg font-bold text-gray-900 dark:text-white">
                      Você recebe
                    </span>
                    <span className="text-2xl font-bold text-green-600 dark:text-orange-500">
                      R$ 95,00
                    </span>
                  </div>
                </div>
                <div className="mt-6 bg-blue-50 dark:bg-purple-900/20 rounded-lg p-4 border border-blue-200 dark:border-purple-800">
                  <p className="text-sm text-blue-900 dark:text-purple-300">
                    💡 <strong>Pagamento liberado após 7 dias</strong> do evento ou da compra, 
                    o que ocorrer primeiro.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              O Que Nossos Usuários Dizem
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Histórias reais de quem usa a TicketPass todos os dias
            </p>
          </div>

          {/* Carousel */}
          <div className="relative">
            <div className="flex items-center justify-center gap-8">
              <Button
                variant="ghost"
                size="icon"
                onClick={prevTestimonial}
                className="hidden md:flex w-12 h-12 rounded-full bg-white dark:bg-gray-800 shadow-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                aria-label="Avaliação anterior"
              >
                <ChevronLeft className="w-6 h-6" />
              </Button>

              <div className="flex-1 max-w-4xl relative overflow-hidden">
                <div className="flex items-center justify-center gap-6">
                  {getVisibleTestimonials().map((testimonial, idx) => (
                    <Card
                      key={idx}
                      className={`transition-all duration-500 border-none dark:bg-gray-800 ${
                        testimonial.offset === 0
                          ? "shadow-2xl scale-100 opacity-100 z-10"
                          : "shadow-lg scale-90 opacity-40 hidden md:block"
                      }`}
                      style={{
                        transform: `translateX(${testimonial.offset * 20}px)`,
                      }}
                    >
                      <CardContent className="p-8">
                        <div className="flex items-center gap-4 mb-6">
                          <img
                            src={testimonial.image}
                            alt={testimonial.name}
                            className="w-16 h-16 rounded-full object-cover border-4 border-blue-100 dark:border-purple-900/40"
                          />
                          <div>
                            <h4 className="font-bold text-gray-900 dark:text-white">
                              {testimonial.name}
                            </h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{testimonial.role}</p>
                            <div className="flex gap-1 mt-1">
                              {[...Array(testimonial.rating)].map((_, i) => (
                                <Star
                                  key={i}
                                  className="w-4 h-4 fill-yellow-400 text-yellow-400"
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                          "{testimonial.text}"
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={nextTestimonial}
                className="hidden md:flex w-12 h-12 rounded-full bg-white dark:bg-gray-800 shadow-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                aria-label="Próxima avaliação"
              >
                <ChevronRight className="w-6 h-6" />
              </Button>
            </div>

            {/* Mobile Navigation */}
            <div className="flex md:hidden justify-center gap-3 mt-6">
              <Button
                variant="ghost"
                size="icon"
                onClick={prevTestimonial}
                className="w-10 h-10 rounded-full bg-white dark:bg-gray-800 shadow-lg"
                aria-label="Avaliação anterior (mobile)"
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={nextTestimonial}
                className="w-10 h-10 rounded-full bg-white dark:bg-gray-800 shadow-lg"
                aria-label="Próxima avaliação (mobile)"
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>

            {/* Indicators */}
            <div className="flex justify-center gap-2 mt-8">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentTestimonial
                      ? "bg-blue-600 dark:bg-purple-600 w-8"
                      : "bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600"
                  }`}
                  aria-label={`Ir para avaliação ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 dark:from-purple-900 dark:to-indigo-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center text-white">
            <div>
              <p className="text-5xl font-bold mb-2 text-shadow-strong">10,000+</p>
              <p className="text-blue-100 dark:text-purple-200 text-shadow-soft">Eventos Realizados</p>
            </div>
            <div>
              <p className="text-5xl font-bold mb-2 text-shadow-strong">50,000+</p>
              <p className="text-blue-100 dark:text-purple-200 text-shadow-soft">Ingressos Vendidos</p>
            </div>
            <div>
              <p className="text-5xl font-bold mb-2 text-shadow-strong">98%</p>
              <p className="text-blue-100 dark:text-purple-200 text-shadow-soft">Satisfação dos Clientes</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Final */}
      <div className="py-20 bg-white dark:bg-gray-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Pronto para Começar?
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
            Junte-se a milhares de organizadores que confiam na TicketPass
          </p>
          <Button
            size="lg"
            onClick={() => navigate(createPageUrl("Home"))}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 dark:from-purple-600 dark:to-indigo-600 dark:hover:from-purple-700 dark:hover:to-indigo-700 shadow-xl text-lg px-10 py-6"
          >
            Explorar Eventos Agora
          </Button>
        </div>
      </div>
    </div>
  );
}
