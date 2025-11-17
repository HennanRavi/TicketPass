import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Ticket, Calendar, MapPin, QrCode, CheckCircle2, Clock, AlertCircle, Download, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import QRCodeDisplay from "../components/tickets/QRCodeDisplay";
import WalletPass from "../components/wallet/WalletPass";
import AddToCalendar from "../components/calendar/AddToCalendar";
import { toast } from "sonner";

export default function MyTickets() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    base44.auth
      .me()
      .then(setUser)
      .catch(() => {
        base44.auth.redirectToLogin(window.location.href);
      });
  }, []);

  const { data: tickets = [], isLoading } = useQuery({
    queryKey: ["user-tickets", user?.id],
    queryFn: () => base44.entities.Ticket.filter({ buyer_id: user.id }, "-created_date"),
    enabled: !!user,
    initialData: [],
  });

  const { data: events = [] } = useQuery({
    queryKey: ["all-events"],
    queryFn: () => base44.entities.Event.list(),
    initialData: [],
  });

  const safeTickets = Array.isArray(tickets) ? tickets : [];
  const activeTickets = safeTickets.filter((t) => t.status === "ativo");
  const usedTickets = safeTickets.filter((t) => t.status === "usado");

  const getEventForTicket = (ticket) => {
    return events.find(e => e.id === ticket.event_id);
  };

  const handleDownloadQR = (ticketCode) => {
    const link = document.createElement('a');
    link.href = `https://api.qrserver.com/v1/create-qr-code/?size=800x800&data=${encodeURIComponent(ticketCode)}`;
    link.download = `ticket-${ticketCode}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("QR Code baixado!");
  };

  const handleShare = (ticket) => {
    const shareText = `Vou no evento ${ticket.event_title}! 🎉`;
    if (navigator.share) {
      navigator.share({
        title: ticket.event_title,
        text: shareText,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(shareText);
      toast.success("Texto copiado!");
    }
  };

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-purple-400"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-purple-950">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-blue-500/90 via-blue-400/80 to-white/90 dark:from-purple-900/90 dark:via-purple-800/80 dark:to-gray-900/90 backdrop-blur-3xl">
        {/* Decorative blur circles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400/30 dark:bg-purple-600/20 rounded-full blur-3xl animate-float-slow"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white/40 dark:bg-purple-900/30 rounded-full blur-3xl animate-float-reverse animate-pulse-glow"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 dark:bg-gray-800/40 backdrop-blur-md rounded-2xl mb-4 border border-white/30 dark:border-gray-700/30">
              <Ticket className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-3 text-white text-shadow-strong">
              Meus Ingressos
            </h1>
            <p className="text-lg text-white/95 max-w-2xl mx-auto text-shadow-medium">
              Gerencie seus ingressos e aproveite seus eventos
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/20 dark:bg-gray-800/40 backdrop-blur-md rounded-xl p-4 border border-white/30 dark:border-gray-700/30 shadow-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600 dark:bg-purple-600 rounded-lg flex items-center justify-center">
                  <Ticket className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white text-shadow-medium">{safeTickets.length}</p>
                  <p className="text-sm text-white/95 text-shadow-soft">Total de Ingressos</p>
                </div>
              </div>
            </div>

            <div className="bg-white/20 dark:bg-gray-800/40 backdrop-blur-md rounded-xl p-4 border border-white/30 dark:border-gray-700/30 shadow-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-600 dark:bg-orange-600 rounded-lg flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white text-shadow-medium">{activeTickets.length}</p>
                  <p className="text-sm text-white/95 text-shadow-soft">Ativos</p>
                </div>
              </div>
            </div>

            <div className="bg-white/20 dark:bg-gray-800/40 backdrop-blur-md rounded-xl p-4 border border-white/30 dark:border-gray-700/30 shadow-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-600 dark:bg-indigo-600 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white text-shadow-medium">{usedTickets.length}</p>
                  <p className="text-sm text-white/95 text-shadow-soft">Utilizados</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {safeTickets.length > 0 ? (
          <Tabs defaultValue="active" className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8 dark:bg-gray-800">
              <TabsTrigger value="active" className="gap-2 dark:data-[state=active]:bg-purple-600">
                <CheckCircle2 className="w-4 h-4" />
                Ativos ({activeTickets.length})
              </TabsTrigger>
              <TabsTrigger value="used" className="gap-2 dark:data-[state=active]:bg-purple-600">
                <Clock className="w-4 h-4" />
                Utilizados ({usedTickets.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="active" className="space-y-6">
              {activeTickets.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {activeTickets.map((ticket) => {
                    const event = getEventForTicket(ticket);
                    return (
                      <Card key={ticket.id} className="border-none shadow-xl overflow-hidden dark:bg-gray-800 hover:shadow-2xl transition-shadow">
                        <div className="bg-gradient-to-br from-blue-600 to-indigo-600 dark:from-purple-700 dark:to-indigo-700 p-6 text-white">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <h3 className="text-xl font-bold mb-2">
                                {ticket.event_title}
                              </h3>
                              <div className="space-y-1">
                                <div className="flex items-center gap-2 text-blue-100 dark:text-purple-200 text-sm">
                                  <Calendar className="w-4 h-4" />
                                  {format(new Date(ticket.event_date), "dd 'de' MMMM, yyyy 'às' HH:mm", { locale: ptBR })}
                                </div>
                                <div className="flex items-center gap-2 text-blue-100 dark:text-purple-200 text-sm">
                                  <MapPin className="w-4 h-4" />
                                  {ticket.event_location}
                                </div>
                              </div>
                            </div>
                            <Badge className="bg-green-500 dark:bg-orange-600 text-white shadow-lg">
                              Ativo
                            </Badge>
                          </div>
                        </div>

                        <CardContent className="p-6 space-y-4 dark:bg-gray-800">
                          <div className="grid grid-cols-2 gap-4 text-sm pb-4 border-b border-gray-200 dark:border-gray-700">
                            <div>
                              <p className="text-gray-500 dark:text-gray-400 mb-1">Quantidade</p>
                              <p className="font-semibold text-gray-900 dark:text-white">
                                {ticket.quantity} ingresso(s)
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-500 dark:text-gray-400 mb-1">Valor Total</p>
                              <p className="font-semibold text-gray-900 dark:text-white">
                                R$ {ticket.total_price?.toFixed(2)}
                              </p>
                            </div>
                          </div>

                          <QRCodeDisplay 
                            value={ticket.ticket_code} 
                            eventTitle={ticket.event_title}
                            size={200}
                          />

                          {event && (
                            <>
                              <WalletPass ticket={ticket} event={event} />
                              <AddToCalendar event={event} ticket={ticket} />
                            </>
                          )}

                          <div className="grid grid-cols-2 gap-2">
                            <Button
                              onClick={() => handleDownloadQR(ticket.ticket_code)}
                              variant="outline"
                              size="sm"
                              className="dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
                            >
                              <Download className="w-4 h-4 mr-2" />
                              Baixar
                            </Button>
                            <Button
                              onClick={() => handleShare(ticket)}
                              variant="outline"
                              size="sm"
                              className="dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
                            >
                              <Share2 className="w-4 h-4 mr-2" />
                              Compartilhar
                            </Button>
                          </div>

                          <Button
                            onClick={() => navigate(`${createPageUrl("RequestRefund")}?ticket=${ticket.id}`)}
                            variant="outline"
                            className="w-full dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
                            size="sm"
                          >
                            <AlertCircle className="w-4 h-4 mr-2" />
                            Solicitar Reembolso
                          </Button>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Ticket className="w-10 h-10 text-gray-400 dark:text-gray-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    Nenhum ingresso ativo
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-6">
                    Você não possui ingressos ativos no momento
                  </p>
                  <Button onClick={() => navigate(createPageUrl("Home"))} className="bg-blue-600 hover:bg-blue-700 dark:bg-purple-600 dark:hover:bg-purple-700">
                    Explorar Eventos
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="used" className="space-y-6">
              {usedTickets.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {usedTickets.map((ticket) => (
                    <Card key={ticket.id} className="border-none shadow-xl overflow-hidden opacity-75 dark:bg-gray-800">
                      <div className="bg-gradient-to-br from-gray-600 to-gray-700 dark:from-gray-800 dark:to-gray-900 p-6 text-white">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h3 className="text-xl font-bold mb-2">
                              {ticket.event_title}
                            </h3>
                            <div className="space-y-1">
                              <div className="flex items-center gap-2 text-gray-300 dark:text-gray-400 text-sm">
                                <Calendar className="w-4 h-4" />
                                {format(new Date(ticket.event_date), "dd 'de' MMMM, yyyy 'às' HH:mm", { locale: ptBR })}
                              </div>
                              <div className="flex items-center gap-2 text-gray-300 dark:text-gray-400 text-sm">
                                <MapPin className="w-4 h-4" />
                                {ticket.event_location}
                              </div>
                            </div>
                          </div>
                          <Badge className="bg-gray-500 dark:bg-gray-700 text-white">
                            Usado
                          </Badge>
                        </div>
                      </div>

                      <CardContent className="p-6 space-y-4 dark:bg-gray-800">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-gray-500 dark:text-gray-400 mb-1">Quantidade</p>
                            <p className="font-semibold text-gray-900 dark:text-white">
                              {ticket.quantity} ingresso(s)
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-500 dark:text-gray-400 mb-1">Valor Total</p>
                            <p className="font-semibold text-gray-900 dark:text-white">
                              R$ {ticket.total_price?.toFixed(2)}
                            </p>
                          </div>
                        </div>

                        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Código do Ingresso</p>
                          <p className="text-sm font-mono bg-gray-50 dark:bg-gray-900 p-2 rounded break-all text-gray-900 dark:text-gray-100">
                            {ticket.ticket_code}
                          </p>
                        </div>

                        <Button
                          onClick={() => navigate(`${createPageUrl("EventDetails")}?id=${ticket.event_id}`)}
                          variant="outline"
                          className="w-full dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
                          size="sm"
                        >
                          Avaliar Evento
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Clock className="w-10 h-10 text-gray-400 dark:text-gray-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    Nenhum ingresso utilizado
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    Você ainda não utilizou nenhum ingresso
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        ) : (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-purple-900/40 dark:to-purple-800/40 rounded-full flex items-center justify-center mx-auto mb-6">
              <Ticket className="w-12 h-12 text-blue-600 dark:text-purple-400" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
              Nenhum ingresso ainda
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto">
              Você ainda não possui ingressos. Explore nossos eventos e garanta o seu!
            </p>
            <Button
              onClick={() => navigate(createPageUrl("Home"))}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 dark:from-purple-600 dark:to-indigo-600 dark:hover:from-purple-700 dark:hover:to-indigo-700"
            >
              Explorar Eventos
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}