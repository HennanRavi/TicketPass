import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { DollarSign, Star, Quote, Calendar, Search, ArrowRight, Check, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const testimonials = [
  {
    name: "Maria Silva",
    role: "Organizadora de Shows",
    company: "MS Eventos",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80",
    rating: 5,
    text: "A plataforma transformou completamente a forma como gerencio meus eventos. O sistema de antecipação de pagamentos é simplesmente perfeito!"
  },
  {
    name: "João Santos",
    role: "Produtor Cultural",
    company: "Cultura Viva",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80",
    rating: 5,
    text: "Excelente custo-benefício! As taxas são justas e o suporte é sempre muito atencioso. Recomendo para todos os organizadores."
  },
  {
    name: "Ana Paula Costa",
    role: "Gestora de Teatro",
    company: "Teatro Municipal",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80",
    rating: 5,
    text: "Facilidade incrível para vender ingressos online. Meus clientes adoram a praticidade e eu adoro os relatórios detalhados!"
  },
  {
    name: "Carlos Mendes",
    role: "Organizador de Festivais",
    company: "Festival Brasil",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80",
    rating: 5,
    text: "Melhor plataforma que já usei! A interface é intuitiva e as ferramentas de gestão são muito completas. Vale cada centavo!"
  },
  {
    name: "Patricia Lima",
    role: "Coordenadora de Eventos",
    company: "EventPro",
    image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=200&q=80",
    rating: 5,
    text: "Sistema robusto e confiável. Já organizei mais de 50 eventos pela plataforma e nunca tive problemas. Recomendo!"
  },
  {
    name: "Roberto Alves",
    role: "Produtor de Festivais",
    company: "Mega Eventos",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80",
    rating: 5,
    text: "Atendimento excepcional e recursos completos. A antecipação de valores faz toda a diferença no fluxo de caixa."
  }
];

const features = [
  {
    title: "Sistema completo de gestão de eventos",
    description: "Crie, edite e gerencie seus eventos com facilidade"
  },
  {
    title: "Antecipação de pagamentos",
    description: "Receba antes do evento acontecer"
  },
  {
    title: "QR Codes para validação",
    description: "Valide ingressos na entrada de forma rápida e segura"
  },
  {
    title: "Relatórios em tempo real",
    description: "Acompanhe vendas e métricas importantes"
  },
  {
    title: "Suporte dedicado 24/7",
    description: "Nossa equipe sempre pronta para ajudar"
  },
  {
    title: "Zero custo para criar",
    description: "Crie eventos gratuitamente, pague apenas ao vender"
  }
];

export default function SaibaMais() {
  const [currentTestimonial, setCurrentTestimonial] = React.useState(0);

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const getVisibleTestimonials = () => {
    const visible = [];
    for (let i = 0; i < 4; i++) {
      visible.push(testimonials[(currentTestimonial + i) % testimonials.length]);
    }
    return visible;
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-50/70 via-blue-100/70 to-blue-50/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            {/* Left Content */}
            <div className="space-y-6">
              <div className="space-y-4">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                  Muito além da venda de ingressos online
                </h1>
                <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
                  Organize seu evento na melhor plataforma de eventos da região!
                </p>
                <p className="text-base text-gray-600">
                  Venda mais com nossas várias ferramentas de criação e tenha muito menos trabalho para gerenciar seu evento e vender ingressos online
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link to={createPageUrl("CreateEvent")}>
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white px-6 h-9">
                    Crie seu evento
                  </Button>
                </Link>
                <Link to={createPageUrl("Home")}>
                  <Button size="sm" variant="outline" className="border-2 border-gray-300 hover:bg-white px-6 h-9">
                    <Search className="w-4 h-4 mr-2" />
                    Buscar eventos
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right Image */}
            <div className="relative hidden lg:block">
              <div className="relative">
                <div className="relative rounded-2xl overflow-hidden shadow-xl border-4 border-white">
                  <img
                    src="https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800&q=80"
                    alt="Professional working"
                    className="w-full h-[300px] object-cover"
                  />
                </div>

                <div className="absolute -bottom-4 -left-4 bg-white rounded-xl shadow-lg p-4 border border-gray-100">
                  <div className="flex items-end gap-2 h-24 mb-2">
                    <div className="w-6 bg-blue-200 rounded-t" style={{ height: '40%' }}></div>
                    <div className="w-6 bg-blue-300 rounded-t" style={{ height: '50%' }}></div>
                    <div className="w-6 bg-blue-400 rounded-t" style={{ height: '65%' }}></div>
                    <div className="w-6 bg-blue-500 rounded-t" style={{ height: '75%' }}></div>
                    <div className="w-6 bg-blue-600 rounded-t relative" style={{ height: '90%' }}>
                      <div className="absolute -top-6 -right-2 bg-green-500 text-white text-xs font-bold px-2 py-0.5 rounded">
                        +23%
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>Seg</span>
                    <span>Ter</span>
                    <span>Qua</span>
                    <span>Qui</span>
                    <span>Sex</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
              Tudo que você precisa em um só lugar
            </h2>
            <p className="text-base text-gray-600 max-w-2xl mx-auto">
              Uma plataforma completa para gerenciar seus eventos do início ao fim
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-blue-50 to-white rounded-xl p-4 border border-blue-100 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start gap-2">
                  <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-1">{feature.title}</h3>
                    <p className="text-xs text-gray-600">{feature.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Payment Benefits Section */}
      <div className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 items-start">
            {/* Transaction Table */}
            <div>
              <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden mb-6">
                <div className="grid grid-cols-4 gap-2 px-3 py-2 bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-600">
                  <div>ID</div>
                  <div>Data e hora</div>
                  <div>Atividades da carteira</div>
                  <div className="text-right">Valor</div>
                </div>

                <div className="divide-y divide-gray-100">
                  {[
                    { id: 'ABCDE01', date: '07/11/23 09:00', desc: 'Saída por saque', value: 'R$80.500,00' },
                    { id: '1234XYZ', date: '07/11/23 14:30', desc: 'Repasse 50% receita evento', value: 'R$117.900,00' },
                    { id: 'WXYZ89', date: '06/10/23 16:15', desc: 'Saída por saque', value: 'R$35.785,00' },
                    { id: '45R7NLIM', date: '05/11/23 10:45', desc: 'Repasse 70% receita', value: 'R$16.354,00' },
                    { id: 'UVWXYZ12', date: '28/10/23 13:20', desc: 'Repasse 70% receita', value: 'R$18.785,00' },
                  ].map((transaction, idx) => (
                    <div key={idx} className="grid grid-cols-4 gap-2 px-3 py-2 text-xs hover:bg-gray-50 transition-colors">
                      <div className="font-mono text-gray-700">{transaction.id}</div>
                      <div className="text-gray-600">{transaction.date}</div>
                      <div className="text-gray-700">{transaction.desc}</div>
                      <div className="text-right font-semibold text-green-600">{transaction.value}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Badge movida para baixo da tabela */}
              <div className="bg-white rounded-xl shadow-xl p-4 border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-0.5">Disponível para saque</p>
                    <p className="text-xl font-bold text-gray-900">R$809.636,90</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Pricing Info */}
            <div className="space-y-6">
              <div className="space-y-3">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
                  Crie seu evento de graça e pague somente quando vender o ingresso.
                </h2>
                <p className="text-base text-gray-700 leading-relaxed">
                  Não espere seu evento finalizar para receber! Fazemos antecipação da maior parte dos valores do seu evento.{' '}
                  <span className="font-semibold text-gray-900">(Consulte condições)</span>
                </p>
              </div>

              <div className="space-y-3">
                <div className="inline-block">
                  <div className="bg-yellow-400 text-black font-bold px-3 py-1.5 rounded-lg text-xs">
                    taxas a partir
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-baseline gap-1">
                    <span className="text-5xl font-bold text-gray-900">7,99</span>
                    <span className="text-3xl font-bold text-gray-900">%</span>
                  </div>
                  <p className="text-base font-semibold text-gray-700">
                    Isso sim é o melhor custo benefício!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center gap-2 bg-blue-100 text-blue-700 px-3 py-1.5 rounded-full text-xs font-semibold mb-3">
              <Star className="w-3.5 h-3.5 fill-current" />
              Avaliações
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
              O que dizem nossos clientes
            </h2>
            <p className="text-base text-gray-600 max-w-2xl mx-auto">
              Milhares de organizadores confiam na TicketPass para gerenciar seus eventos
            </p>
          </div>

          {/* Carousel */}
          <div className="relative">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {getVisibleTestimonials().map((testimonial, index) => (
                <div
                  key={`${currentTestimonial}-${index}`}
                  className="bg-gray-50 rounded-xl p-4 hover:shadow-lg transition-all duration-300 border border-gray-100 relative animate-in fade-in slide-in-from-right-4 duration-500"
                >
                  <Quote className="absolute top-3 right-3 w-6 h-6 text-blue-100" />
                  
                  <div className="flex gap-1 mb-3">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>

                  <p className="text-gray-700 text-xs mb-4 leading-relaxed line-clamp-4">
                    "{testimonial.text}"
                  </p>

                  <div className="flex items-center gap-2 pt-3 border-t border-gray-200">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-semibold text-gray-900 text-xs">
                        {testimonial.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {testimonial.role}
                      </p>
                      <p className="text-xs text-blue-600 font-medium">
                        {testimonial.company}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Navigation Buttons */}
            <button
              onClick={prevTestimonial}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors border border-gray-200"
              aria-label="Anterior"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <button
              onClick={nextTestimonial}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors border border-gray-200"
              aria-label="Próximo"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>

            {/* Indicators */}
            <div className="flex justify-center gap-2 mt-6">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentTestimonial
                      ? "bg-blue-600 w-6"
                      : "bg-gray-300 hover:bg-gray-400"
                  }`}
                  aria-label={`Ir para avaliação ${index + 1}`}
                />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-600 mb-1">4.9/5</p>
              <p className="text-xs text-gray-600">Avaliação média</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-600 mb-1">2.500+</p>
              <p className="text-xs text-gray-600">Avaliações</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-600 mb-1">98%</p>
              <p className="text-xs text-gray-600">Satisfação</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-600 mb-1">5.000+</p>
              <p className="text-xs text-gray-600">Organizadores</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-700 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-6">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-white/20 rounded-xl mb-3">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
              Pronto para descobrir eventos incríveis?
            </h2>
            <p className="text-base text-blue-100 max-w-2xl mx-auto mb-8">
              Milhares de eventos esperando por você. Shows, festivais, workshops e muito mais!
            </p>
            <div className="pt-4">
              <Link to={createPageUrl("Home")}>
                <Button size="sm" className="bg-white text-blue-600 hover:bg-gray-100 px-6 h-9">
                  <Search className="w-4 h-4 mr-2" />
                  Explorar Eventos
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}