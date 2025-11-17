
import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
  RefreshCw,
  Send,
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Clock,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function RequestRefund() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const urlParams = new URLSearchParams(window.location.search);
  const ticketId = urlParams.get("ticket");

  const [user, setUser] = useState(null);
  const [reason, setReason] = useState("");

  useEffect(() => {
    base44.auth
      .me()
      .then(setUser)
      .catch(() => {
        base44.auth.redirectToLogin(window.location.href);
      });
  }, []);

  const { data: ticket, isLoading } = useQuery({
    queryKey: ["ticket", ticketId],
    queryFn: async () => {
      const tickets = await base44.entities.Ticket.filter({ id: ticketId });
      return tickets[0];
    },
    enabled: !!ticketId && !!user,
  });

  const { data: existingRefund } = useQuery({
    queryKey: ["refund-request", ticketId],
    queryFn: async () => {
      const refunds = await base44.entities.RefundRequest.filter({ ticket_id: ticketId });
      return refunds[0];
    },
    enabled: !!ticketId && !!user,
  });

  const requestRefundMutation = useMutation({
    mutationFn: async (data) => {
      return await base44.entities.RefundRequest.create(data);
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["refund-request"] });
      queryClient.invalidateQueries({ queryKey: ["user-tickets"] });

      // Notify organizer
      await base44.entities.Notification.create({
        user_id: ticket.event_id,
        title: "Solicitação de Reembolso 💰",
        message: `${user.full_name} solicitou reembolso para o evento "${ticket.event_title}"`,
        type: "warning",
        category: "payment",
        link: createPageUrl("AdminRefunds"),
      });

      toast.success("Solicitação enviada com sucesso!", {
        description: "Você receberá uma notificação quando o reembolso for processado.",
      });
      navigate(createPageUrl("MyTickets"));
    },
    onError: () => {
      toast.error("Erro ao solicitar reembolso");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!reason.trim() || reason.trim().length < 10) {
      toast.error("Por favor, explique o motivo do reembolso (mínimo 10 caracteres)");
      return;
    }

    // Check if within 7 days
    const purchaseDate = new Date(ticket.purchase_date);
    const now = new Date();
    const daysDiff = (now - purchaseDate) / (1000 * 60 * 60 * 24);

    if (daysDiff > 7) {
      toast.error("O prazo de 7 dias para solicitar reembolso expirou");
      return;
    }

    requestRefundMutation.mutate({
      ticket_id: ticket.id,
      event_id: ticket.event_id,
      event_title: ticket.event_title,
      buyer_id: user.id,
      buyer_name: user.full_name,
      buyer_email: user.email,
      organizer_id: ticket.event_id,
      refund_amount: ticket.total_price,
      reason: reason.trim(),
      request_date: new Date().toISOString(),
      purchase_date: ticket.purchase_date,
      status: "pendente",
    });
  };

  if (!user || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <Card className="max-w-md">
          <CardContent className="p-8 text-center">
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">Ingresso não encontrado</h2>
            <p className="text-gray-600 mb-4">O ingresso que você está tentando reembolsar não existe.</p>
            <Button onClick={() => navigate(createPageUrl("MyTickets"))}>
              Voltar para Meus Ingressos
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (ticket.buyer_id !== user.id) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <Card className="max-w-md">
          <CardContent className="p-8 text-center">
            <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">Acesso negado</h2>
            <p className="text-gray-600 mb-4">Este ingresso não pertence a você.</p>
            <Button onClick={() => navigate(createPageUrl("MyTickets"))}>
              Voltar para Meus Ingressos
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (existingRefund) {
    return (
      <div className="min-h-screen py-8 bg-gray-50 dark:bg-gray-950">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <Button
            variant="ghost"
            className="mb-6 dark:text-gray-300 dark:hover:bg-gray-800"
            onClick={() => navigate(createPageUrl("MyTickets"))}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>

          <Card className="border-none shadow-xl dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 dark:text-white">
                <CheckCircle2 className="w-6 h-6 text-blue-600 dark:text-purple-400" />
                Solicitação Existente
              </CardTitle>
              <CardDescription className="dark:text-gray-400">
                Você já solicitou reembolso para este ingresso
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-blue-50 dark:bg-purple-900/20 rounded-lg p-6 border border-blue-200 dark:border-purple-800">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Status</span>
                  <Badge
                    className={
                      existingRefund.status === "aprovado"
                        ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400"
                        : existingRefund.status === "pendente"
                        ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400"
                        : existingRefund.status === "processado"
                        ? "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400"
                        : "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400"
                    }
                  >
                    {existingRefund.status === "aprovado" && "✓ Aprovado"}
                    {existingRefund.status === "pendente" && "⏳ Em Análise"}
                    {existingRefund.status === "processado" && "✓ Processado"}
                    {existingRefund.status === "rejeitado" && "✗ Rejeitado"}
                  </Badge>
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Evento</p>
                    <p className="font-semibold text-gray-900 dark:text-white">{existingRefund.event_title}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Valor do Reembolso</p>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      R$ {existingRefund.refund_amount.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Data da Solicitação</p>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {format(new Date(existingRefund.request_date), "dd 'de' MMMM, yyyy 'às' HH:mm", {
                        locale: ptBR,
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Motivo</p>
                    <p className="text-gray-900 dark:text-white">{existingRefund.reason}</p>
                  </div>

                  {existingRefund.status === "rejeitado" && existingRefund.rejection_reason && (
                    <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 border border-red-200 dark:border-red-800 mt-4">
                      <p className="text-sm text-red-600 dark:text-red-400 font-medium mb-1">Motivo da Rejeição</p>
                      <p className="text-sm text-red-800 dark:text-red-300">{existingRefund.rejection_reason}</p>
                    </div>
                  )}
                </div>
              </div>

              <Alert className="bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800">
                <Clock className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                <AlertDescription className="text-sm text-yellow-900 dark:text-yellow-300">
                  {existingRefund.status === "pendente" &&
                    "Sua solicitação está sendo analisada. Você será notificado quando houver uma resposta."}
                  {existingRefund.status === "aprovado" &&
                    "Seu reembolso foi aprovado e está sendo processado."}
                  {existingRefund.status === "processado" &&
                    "Seu reembolso foi processado e o valor deve aparecer em sua conta em breve."}
                  {existingRefund.status === "rejeitado" &&
                    "Infelizmente seu pedido de reembolso foi rejeitado."}
                </AlertDescription>
              </Alert>

              <Button
                onClick={() => navigate(createPageUrl("MyTickets"))}
                className="w-full dark:bg-purple-600 dark:hover:bg-purple-700"
              >
                Voltar para Meus Ingressos
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Check if within 7 days
  const purchaseDate = new Date(ticket.purchase_date);
  const now = new Date();
  const daysDiff = (now - purchaseDate) / (1000 * 60 * 60 * 24);
  const daysRemaining = Math.max(0, 7 - Math.floor(daysDiff));

  if (daysDiff > 7) {
    return (
      <div className="min-h-screen py-8 bg-gray-50 dark:bg-gray-950">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <Button
            variant="ghost"
            className="mb-6 dark:text-gray-300 dark:hover:bg-gray-800"
            onClick={() => navigate(createPageUrl("MyTickets"))}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>

          <Card className="border-none shadow-xl dark:bg-gray-800">
            <CardContent className="p-8 text-center">
              <XCircle className="w-16 h-16 text-red-500 dark:text-red-400 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Prazo Expirado</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                O prazo de 7 dias para solicitar reembolso deste ingresso já expirou.
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500 mb-6">
                Comprado em: {format(purchaseDate, "dd 'de' MMMM, yyyy", { locale: ptBR })}
              </p>
              <Button onClick={() => navigate(createPageUrl("MyTickets"))} className="dark:bg-purple-600 dark:hover:bg-purple-700">
                Voltar para Meus Ingressos
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 bg-gray-50 dark:bg-gray-950">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <Button
          variant="ghost"
          className="mb-6 dark:text-gray-300 dark:hover:bg-gray-800"
          onClick={() => navigate(createPageUrl("MyTickets"))}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Solicitar Reembolso</h1>
          <p className="text-gray-600 dark:text-gray-400">Preencha o formulário para solicitar o reembolso do seu ingresso</p>
        </div>

        {/* Ticket Info */}
        <Card className="mb-6 border-none shadow-lg dark:bg-gray-800">
          <CardContent className="p-6">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Informações do Ingresso</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Evento</span>
                <span className="font-semibold text-gray-900 dark:text-white">{ticket.event_title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Data do Evento</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {format(new Date(ticket.event_date), "dd 'de' MMMM, yyyy", { locale: ptBR })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Data da Compra</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {format(purchaseDate, "dd 'de' MMMM, yyyy", { locale: ptBR })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Valor Pago</span>
                <span className="font-semibold text-green-600 dark:text-green-400">
                  R$ {ticket.total_price.toFixed(2)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Warning Alert */}
        <Alert className="mb-6 bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800">
          <Clock className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
          <AlertDescription className="text-sm text-yellow-900 dark:text-yellow-300">
            <strong>Atenção:</strong> Você tem {daysRemaining} {daysRemaining === 1 ? "dia" : "dias"} restantes 
            para solicitar o reembolso. Após esse período, não será mais possível.
          </AlertDescription>
        </Alert>

        {/* Refund Form */}
        <Card className="border-none shadow-xl dark:bg-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 dark:text-white">
              <RefreshCw className="w-5 h-5" />
              Formulário de Reembolso
            </CardTitle>
            <CardDescription className="dark:text-gray-400">
              Explique o motivo da sua solicitação
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="reason" className="dark:text-gray-300">Motivo do Reembolso *</Label>
                <Textarea
                  id="reason"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Explique detalhadamente o motivo da solicitação de reembolso..."
                  rows={6}
                  required
                  className="mt-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Mínimo de 10 caracteres. Seja claro e objetivo.
                </p>
              </div>

              <Alert className="bg-blue-50 border-blue-200 dark:bg-purple-900/20 dark:border-purple-800">
                <AlertCircle className="h-4 w-4 text-blue-600 dark:text-purple-400" />
                <AlertDescription className="text-sm text-blue-900 dark:text-purple-300">
                  <strong>Como funciona:</strong>
                  <ul className="list-disc ml-4 mt-2 space-y-1">
                    <li>Sua solicitação será analisada pela equipe</li>
                    <li>Você receberá uma notificação sobre a decisão</li>
                    <li>Se aprovado, o reembolso será processado em até 5 dias úteis</li>
                    <li>O valor será devolvido na forma de pagamento original</li>
                  </ul>
                </AlertDescription>
              </Alert>

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(createPageUrl("MyTickets"))}
                  className="flex-1 dark:border-gray-700 dark:text-gray-300"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={requestRefundMutation.isPending}
                  className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
                >
                  {requestRefundMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Solicitar Reembolso
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
