import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Ticket, Calendar, MapPin, QrCode } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import QRCodeDisplay from "../components/tickets/QRCodeDisplay";

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

  const { data: tickets, isLoading } = useQuery({
    queryKey: ["my-tickets", user?.id],
    queryFn: () => base44.entities.Ticket.filter({ buyer_id: user.id }, "-purchase_date"),
    enabled: !!user,
    initialData: [],
  });

  const activeTickets = tickets.filter((t) => t.status === "ativo");
  const usedTickets = tickets.filter((t) => t.status === "usado");

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Meus Ingressos</h1>
          <p className="text-gray-600">Gerencie todos os seus ingressos comprados</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-none shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center">
                  <Ticket className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-gray-900">{tickets.length}</p>
                  <p className="text-sm text-gray-600">Total de Ingressos</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg bg-gradient-to-br from-green-50 to-emerald-50">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-gray-900">{activeTickets.length}</p>
                  <p className="text-sm text-gray-600">Ativos</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg bg-gradient-to-br from-gray-50 to-slate-50">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center">
                  <QrCode className="w-6 h-6 text-gray-600" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-gray-900">{usedTickets.length}</p>
                  <p className="text-sm text-gray-600">Utilizados</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tickets Tabs */}
        <Tabs defaultValue="active" className="w-full">
          <TabsList className="w-full grid grid-cols-2">
            <TabsTrigger value="active">
              Ingressos Ativos ({activeTickets.length})
            </TabsTrigger>
            <TabsTrigger value="used">
              Ingressos Utilizados ({usedTickets.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="mt-6">
            {activeTickets.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {activeTickets.map((ticket) => (
                  <Card
                    key={ticket.id}
                    className="border-none shadow-lg hover:shadow-xl transition-shadow overflow-hidden"
                  >
                    <div className="h-2 bg-gradient-to-r from-green-500 to-emerald-600"></div>
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg line-clamp-2 mb-2">
                            {ticket.event_title}
                          </CardTitle>
                          <Badge className="bg-green-100 text-green-700 border-green-200">
                            Ativo
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="w-4 h-4 text-blue-500" />
                          <span>
                            {format(
                              new Date(ticket.event_date),
                              "dd 'de' MMMM, yyyy 'às' HH:mm",
                              { locale: ptBR }
                            )}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <MapPin className="w-4 h-4 text-blue-500" />
                          <span className="line-clamp-1">{ticket.event_location}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Ticket className="w-4 h-4 text-blue-500" />
                          <span>Quantidade: {ticket.quantity}</span>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-gray-100">
                        <div className="flex justify-between items-center mb-4">
                          <span className="text-sm text-gray-500">Total Pago</span>
                          <span className="text-xl font-bold text-gray-900">
                            R$ {ticket.total_price?.toFixed(2)}
                          </span>
                        </div>

                        {/* QR Code Display */}
                        <QRCodeDisplay
                          ticketCode={ticket.ticket_code}
                          eventTitle={ticket.event_title}
                          size={200}
                        />

                        {/* Refund Button */}
                        <Button
                          variant="outline"
                          className="w-full mt-4 text-red-600 border-red-200 hover:bg-red-50"
                          onClick={() => navigate(`${createPageUrl("RequestRefund")}?ticket=${ticket.id}`)}
                        >
                          Solicitar Reembolso
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Ticket className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Nenhum ingresso ativo
                </h3>
                <p className="text-gray-500 mb-6">
                  Você não possui ingressos ativos no momento
                </p>
                <Button onClick={() => navigate(createPageUrl("Home"))}>
                  Explorar Eventos
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="used" className="mt-6">
            {usedTickets.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {usedTickets.map((ticket) => (
                  <Card
                    key={ticket.id}
                    className="border-none shadow-lg opacity-75 overflow-hidden"
                  >
                    <div className="h-2 bg-gray-400"></div>
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-lg line-clamp-2">
                          {ticket.event_title}
                        </CardTitle>
                        <Badge className="bg-gray-100 text-gray-700">Usado</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {format(
                            new Date(ticket.event_date),
                            "dd 'de' MMMM, yyyy",
                            { locale: ptBR }
                          )}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="w-4 h-4" />
                        <span className="line-clamp-1">{ticket.event_location}</span>
                      </div>
                      <div className="pt-3 border-t border-gray-100">
                        <p className="text-xs text-gray-500 mb-1">Código do Ingresso</p>
                        <p className="text-xs font-mono text-gray-600 break-all">
                          {"•".repeat(Math.min(ticket.ticket_code.length, 20))}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <QrCode className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Nenhum ingresso utilizado
                </h3>
                <p className="text-gray-500">
                  Você ainda não utilizou nenhum ingresso
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Empty State */}
        {tickets.length === 0 && (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Ticket className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Nenhum ingresso encontrado
            </h3>
            <p className="text-gray-500 mb-6">
              Você ainda não comprou nenhum ingresso
            </p>
            <Button onClick={() => navigate(createPageUrl("Home"))}>
              Explorar Eventos
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}