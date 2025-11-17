import React, { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { CheckCircle2, Share2, Ticket, Calendar, MapPin, Download, Clock, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import WalletPass from "../components/wallet/WalletPass";
import AddToCalendar from "../components/calendar/AddToCalendar";

export default function PaymentConfirmation() {
  const navigate = useNavigate();
  const urlParams = new URLSearchParams(window.location.search);
  const paymentId = urlParams.get("payment");
  const [user, setUser] = useState(null);

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  const { data: recentTickets = [] } = useQuery({
    queryKey: ["recent-tickets", user?.id],
    queryFn: async () => {
      const tickets = await base44.entities.Ticket.filter({ buyer_id: user.id }, "-created_date", 10);
      return tickets;
    },
    enabled: !!user,
  });

  const firstTicket = recentTickets[0];
  const { data: event } = useQuery({
    queryKey: ["event", firstTicket?.event_id],
    queryFn: async () => {
      const events = await base44.entities.Event.filter({ id: firstTicket.event_id });
      return events[0];
    },
    enabled: !!firstTicket,
  });

  const handleShare = () => {
    const shareText = `Acabei de comprar ingressos para ${event?.title || 'um evento'} no TicketPass! 🎉`;
    if (navigator.share) {
      navigator.share({
        title: "TicketPass",
        text: shareText,
        url: window.location.origin + createPageUrl("Home"),
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(shareText + ' ' + window.location.origin);
      alert("Link copiado para a área de transferência!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 dark:from-gray-950 dark:via-purple-950 dark:to-gray-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-4 h-4 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0s', animationDuration: '3s' }}></div>
        <div className="absolute top-40 right-20 w-3 h-3 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.5s', animationDuration: '2.5s' }}></div>
        <div className="absolute top-60 left-1/4 w-5 h-5 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '1s', animationDuration: '3.5s' }}></div>
        <div className="absolute bottom-40 right-1/3 w-4 h-4 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '1.5s', animationDuration: '3s' }}></div>
        <div className="absolute bottom-20 left-20 w-3 h-3 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '2s', animationDuration: '2.5s' }}></div>
      </div>

      <div className="max-w-4xl w-full space-y-6 relative z-10">
        <Card className="border-none shadow-2xl dark:bg-gray-800">
          <CardContent className="p-8 md:p-12">
            <div className="text-center mb-8">
              <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-500 dark:from-orange-500 dark:to-orange-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce shadow-lg">
                <CheckCircle2 className="w-16 h-16 text-white" />
              </div>
              <h1 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-3">
                Pagamento Confirmado! 🎉
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-2">
                Seus ingressos foram enviados com sucesso
              </p>
              <Badge className="mt-2 bg-blue-100 dark:bg-purple-900/40 text-blue-800 dark:text-purple-300">
                ID: {paymentId}
              </Badge>
            </div>

            {event && firstTicket && (
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-purple-900/20 dark:to-gray-800 border-2 border-blue-200 dark:border-purple-600 rounded-2xl p-6 mb-8">
                <div className="flex flex-col md:flex-row gap-6">
                  {event.image_url ? (
                    <div className="w-full md:w-48 h-48 rounded-xl overflow-hidden flex-shrink-0 shadow-lg">
                      <img
                        src={event.image_url}
                        alt={event.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-full md:w-48 h-48 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 dark:from-purple-600 dark:to-purple-800 flex items-center justify-center shadow-lg">
                      <Calendar className="w-20 h-20 text-white opacity-50" />
                    </div>
                  )}

                  <div className="flex-1 space-y-4">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        {event.title}
                      </h2>
                      <div className="flex flex-wrap gap-2 mb-3">
                        <Badge className="bg-green-500 dark:bg-orange-600 text-white">
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          Confirmado
                        </Badge>
                        <Badge className="bg-blue-500 dark:bg-purple-600 text-white">
                          <Users className="w-3 h-3 mr-1" />
                          {recentTickets.filter(t => t.event_id === event.id).length} {recentTickets.filter(t => t.event_id === event.id).length === 1 ? 'ingresso' : 'ingressos'}
                        </Badge>
                      </div>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                        <Calendar className="w-4 h-4 text-blue-600 dark:text-purple-400" />
                        <span className="font-medium">
                          {format(new Date(event.date), "dd 'de' MMMM, yyyy 'às' HH:mm", { locale: ptBR })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                        <MapPin className="w-4 h-4 text-blue-600 dark:text-purple-400" />
                        <span>{event.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                        <Clock className="w-4 h-4 text-blue-600 dark:text-purple-400" />
                        <span>Comprado em {format(new Date(firstTicket.purchase_date), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}</span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-blue-200 dark:border-purple-700">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-400">Valor Total Pago</span>
                        <span className="text-2xl font-bold text-gray-900 dark:text-white">
                          R$ {firstTicket.total_price?.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800 rounded-xl p-6 mb-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/40 rounded-full flex items-center justify-center flex-shrink-0">
                  <Ticket className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3 text-lg">O que acontece agora?</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300">
                        <strong>Seus ingressos estão disponíveis</strong> - Acesse "Meus Ingressos" para visualizar os QR Codes
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300">
                        <strong>Adicione à sua carteira</strong> - Salve o ingresso no Apple Wallet ou Google Pay para fácil acesso
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300">
                        <strong>Adicione ao seu calendário</strong> - Não perca o evento! Adicione ao Google Calendar, Outlook ou iCal
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300">
                        <strong>E-mail de confirmação enviado</strong> - Verifique sua caixa de entrada em {user?.email}
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300">
                        <strong>Lembretes automáticos</strong> - Você receberá notificações 24h e 2h antes do evento
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300">
                        <strong>QR Code na entrada</strong> - Apresente o QR Code do ingresso para validação no local
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {event && firstTicket && (
              <div className="space-y-3 mb-6">
                <WalletPass ticket={firstTicket} event={event} />
                <AddToCalendar event={event} ticket={firstTicket} />
              </div>
            )}

            <div className="space-y-3">
              <Button
                onClick={() => navigate(createPageUrl("MyTickets"))}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 dark:from-purple-600 dark:to-purple-700 dark:hover:from-purple-700 dark:hover:to-purple-800"
                size="lg"
              >
                <Ticket className="w-5 h-5 mr-2" />
                Ver Meus Ingressos
              </Button>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <Button
                  onClick={() => navigate(createPageUrl("Home"))}
                  variant="outline"
                  className="dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  <Calendar className="w-5 h-5 mr-2" />
                  Explorar Eventos
                </Button>
                <Button
                  onClick={handleShare}
                  variant="outline"
                  className="dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  <Share2 className="w-5 h-5 mr-2" />
                  Compartilhar
                </Button>
                {firstTicket && (
                  <Button
                    onClick={() => {
                      const link = document.createElement('a');
                      link.href = `https://api.qrserver.com/v1/create-qr-code/?size=800x800&data=${encodeURIComponent(firstTicket.ticket_code)}`;
                      link.download = `ticket-${firstTicket.ticket_code}.png`;
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                    }}
                    variant="outline"
                    className="dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
                  >
                    <Download className="w-5 h-5 mr-2" />
                    Baixar QR Code
                  </Button>
                )}
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Precisa de ajuda? Entre em contato com nosso{" "}
                <button
                  onClick={() => navigate(createPageUrl("Support"))}
                  className="text-blue-600 dark:text-purple-400 hover:underline font-medium"
                >
                  suporte
                </button>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}