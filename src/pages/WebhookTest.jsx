import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  Zap, 
  ArrowLeft, 
  Play, 
  CheckCircle2, 
  XCircle, 
  Loader2,
  Code,
  AlertCircle 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";

export default function WebhookTest() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    base44.auth
      .me()
      .then((u) => {
        if (u.role !== "admin") {
          navigate(createPageUrl("Home"));
          toast.error("Apenas administradores podem acessar esta página");
          return;
        }
        setUser(u);
      })
      .catch(() => {
        base44.auth.redirectToLogin(window.location.href);
      });
  }, []);

  const { data: transactions, isLoading } = useQuery({
    queryKey: ["payment-transactions"],
    queryFn: () => base44.entities.PaymentTransaction.list("-created_date"),
    enabled: !!user,
    initialData: [],
  });

  const handleTestWebhook = async (transactionId, status) => {
    setIsExecuting(true);
    setResult(null);

    try {
      toast.info("Executando teste de webhook...");

      // Simular chamada ao webhook (em produção, seria via fetch para a função)
      const mockNotification = {
        id: `PAGBANK-${Date.now()}`,
        status: status,
        reference_id: transactionId,
        created_at: new Date().toISOString(),
        paid_at: status === "PAID" ? new Date().toISOString() : null,
      };

      // Aqui você chamaria a função real:
      // const response = await fetch('/functions/PagBankWebhook', {
      //   method: 'POST',
      //   body: JSON.stringify(mockNotification)
      // });

      // Por ora, vamos atualizar diretamente
      const tx = transactions.find(t => t.id === transactionId);
      
      const statusMap = {
        'PAID': 'paid',
        'CANCELED': 'cancelled',
        'DECLINED': 'failed',
      };

      await base44.entities.PaymentTransaction.update(transactionId, {
        status: statusMap[status],
        paid_at: status === 'PAID' ? new Date().toISOString() : null,
      });

      if (status === 'PAID') {
        // Buscar evento
        const events = await base44.entities.Event.filter({ id: tx.event_id });
        const event = events[0];

        // Criar tickets
        for (let i = 0; i < tx.quantity; i++) {
          const ticketCode = `TICKET-${Date.now()}-${Math.random().toString(36).substr(2, 9)}-${i + 1}`;
          
          await base44.entities.Ticket.create({
            event_id: event.id,
            event_title: event.title,
            event_date: event.date,
            event_location: event.location,
            buyer_id: tx.buyer_id,
            buyer_name: user.full_name,
            buyer_email: user.email,
            quantity: 1,
            total_price: event.price,
            purchase_date: new Date().toISOString(),
            ticket_code: ticketCode,
            status: 'ativo',
          });
        }

        // Atualizar evento
        await base44.entities.Event.update(event.id, {
          tickets_sold: (event.tickets_sold || 0) + tx.quantity,
        });

        // Notificação
        await base44.entities.Notification.create({
          user_id: tx.buyer_id,
          title: "🧪 Teste: Pagamento Confirmado!",
          message: `(TESTE) Seu pagamento de R$ ${tx.amount.toFixed(2)} foi confirmado.`,
          type: "success",
          category: "payment",
        });
      }

      setResult({
        success: true,
        status: statusMap[status],
        notification: mockNotification,
      });

      toast.success("Webhook executado com sucesso!");

    } catch (error) {
      console.error(error);
      setResult({
        success: false,
        error: error.message,
      });
      toast.error("Erro ao executar webhook");
    }

    setIsExecuting(false);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => navigate(createPageUrl("AdminBankSetup"))}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>

        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Teste de Webhook PagBank
              </h1>
              <p className="text-gray-600">
                Simule notificações de pagamento para testar o fluxo
              </p>
            </div>
          </div>

          <Alert className="bg-yellow-50 border-yellow-200">
            <AlertCircle className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="text-sm text-yellow-900">
              <strong>⚠️ Ambiente de Testes:</strong> Esta página permite testar o webhook manualmente.
              Use apenas em desenvolvimento. Em produção, o PagBank chama automaticamente.
            </AlertDescription>
          </Alert>
        </div>

        {/* Instructions */}
        <Card className="border-none shadow-xl mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="w-5 h-5 text-blue-600" />
              Como Usar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="list-decimal ml-4 space-y-2 text-sm text-gray-700">
              <li>Encontre uma transação com status "pending" na lista abaixo</li>
              <li>Clique em "Simular Pagamento Aprovado" para testar o webhook</li>
              <li>O sistema irá:
                <ul className="list-disc ml-6 mt-1 space-y-1">
                  <li>Atualizar o status da transação para "paid"</li>
                  <li>Criar os tickets automaticamente</li>
                  <li>Atualizar o contador de ingressos vendidos</li>
                  <li>Enviar notificações</li>
                </ul>
              </li>
              <li>Verifique os tickets criados em "Meus Ingressos"</li>
            </ol>
          </CardContent>
        </Card>

        {/* Transactions List */}
        <Card className="border-none shadow-xl">
          <CardHeader>
            <CardTitle>Transações de Pagamento</CardTitle>
            <CardDescription>
              Selecione uma transação para testar o webhook
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto" />
              </div>
            ) : transactions.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Nenhuma transação encontrada</p>
              </div>
            ) : (
              <div className="space-y-4">
                {transactions.map((tx) => (
                  <Card
                    key={tx.id}
                    className={`border-2 ${
                      selectedTransaction === tx.id
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200"
                    }`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <p className="font-semibold text-gray-900">
                              Transação #{tx.id.slice(0, 8)}
                            </p>
                            <Badge
                              className={
                                tx.status === "paid"
                                  ? "bg-green-100 text-green-700"
                                  : tx.status === "pending"
                                  ? "bg-yellow-100 text-yellow-700"
                                  : "bg-red-100 text-red-700"
                              }
                            >
                              {tx.status}
                            </Badge>
                            <Badge variant="outline">{tx.payment_method}</Badge>
                          </div>
                          <div className="text-sm text-gray-600 space-y-1">
                            <p>Evento: {tx.event_id}</p>
                            <p>Quantidade: {tx.quantity} ingresso(s)</p>
                            <p>Valor: R$ {tx.amount.toFixed(2)}</p>
                            <p>Gateway: {tx.gateway}</p>
                          </div>
                        </div>

                        <div className="flex flex-col gap-2">
                          {tx.status === "pending" && (
                            <>
                              <Button
                                size="sm"
                                onClick={() => handleTestWebhook(tx.id, "PAID")}
                                disabled={isExecuting}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                {isExecuting ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <CheckCircle2 className="w-4 h-4 mr-2" />
                                )}
                                Aprovar
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleTestWebhook(tx.id, "DECLINED")}
                                disabled={isExecuting}
                                className="border-red-200 text-red-600 hover:bg-red-50"
                              >
                                <XCircle className="w-4 h-4 mr-2" />
                                Rejeitar
                              </Button>
                            </>
                          )}
                          {tx.status === "paid" && (
                            <Badge className="bg-green-100 text-green-700">
                              ✓ Processado
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Result */}
        {result && (
          <Card className="border-none shadow-xl mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {result.success ? (
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-600" />
                )}
                Resultado do Teste
              </CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-xs">
                {JSON.stringify(result, null, 2)}
              </pre>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}