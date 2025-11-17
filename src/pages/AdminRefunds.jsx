import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
  RefreshCw,
  CheckCircle2,
  XCircle,
  ArrowLeft,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";

export default function AdminRefunds() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [user, setUser] = useState(null);
  const [selectedRefund, setSelectedRefund] = useState(null);
  const [actionType, setActionType] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");

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

  const { data: refundRequests, isLoading } = useQuery({
    queryKey: ["refund-requests"],
    queryFn: () => base44.entities.RefundRequest.list("-created_date"),
    enabled: !!user,
    initialData: [],
  });

  const processRefundMutation = useMutation({
    mutationFn: async ({ refundId, action, reason }) => {
      const refund = refundRequests.find((r) => r.id === refundId);
      
      if (action === "approve") {
        // Aprovar reembolso
        await base44.entities.RefundRequest.update(refundId, {
          status: "aprovado",
          response_date: new Date().toISOString(),
        });

        // Atualizar transação para reembolsado
        const transactions = await base44.entities.Transaction.filter({
          ticket_id: refund.ticket_id,
        });
        
        if (transactions.length > 0) {
          await base44.entities.Transaction.update(transactions[0].id, {
            status: "reembolsado",
          });
        }

        // Atualizar status do ticket
        await base44.entities.Ticket.update(refund.ticket_id, {
          status: "cancelado",
        });

        // Notificar comprador
        await base44.entities.Notification.create({
          user_id: refund.buyer_id,
          title: "Reembolso Aprovado! ✅",
          message: `Seu reembolso de R$ ${refund.refund_amount.toFixed(2)} para ${refund.event_title} foi aprovado.`,
          type: "success",
          category: "payment",
          link: createPageUrl("MyTickets"),
        });
      } else {
        // Rejeitar reembolso
        await base44.entities.RefundRequest.update(refundId, {
          status: "rejeitado",
          rejection_reason: reason,
          response_date: new Date().toISOString(),
        });

        // Notificar comprador
        await base44.entities.Notification.create({
          user_id: refund.buyer_id,
          title: "Reembolso Rejeitado",
          message: `Seu pedido de reembolso para ${refund.event_title} foi rejeitado. Motivo: ${reason}`,
          type: "error",
          category: "payment",
          link: createPageUrl("MyTickets"),
        });
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["refund-requests"] });
      toast.success(
        variables.action === "approve"
          ? "Reembolso aprovado com sucesso!"
          : "Reembolso rejeitado"
      );
      setSelectedRefund(null);
      setActionType(null);
      setRejectionReason("");
    },
    onError: () => {
      toast.error("Erro ao processar reembolso");
    },
  });

  const handleAction = (refund, action) => {
    setSelectedRefund(refund);
    setActionType(action);
  };

  const handleConfirm = () => {
    if (actionType === "reject" && !rejectionReason.trim()) {
      toast.error("Por favor, informe o motivo da rejeição");
      return;
    }

    processRefundMutation.mutate({
      refundId: selectedRefund.id,
      action: actionType,
      reason: rejectionReason,
    });
  };

  const pendingRefunds = refundRequests.filter((r) => r.status === "pendente");
  const processedRefunds = refundRequests.filter((r) => r.status !== "pendente");

  if (!user || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center dark:bg-gray-950">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 bg-gray-50 dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Button
          variant="ghost"
          className="mb-6 dark:text-gray-300 dark:hover:bg-gray-800"
          onClick={() => navigate(createPageUrl("OrganizerDashboard"))}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Solicitações de Reembolso
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Gerencie pedidos de reembolso dos participantes
          </p>
        </div>

        <Card className="border-none shadow-lg dark:bg-gray-800">
          <CardHeader>
            <CardTitle className="dark:text-white">Pedidos de Reembolso</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="pending">
              <TabsList className="grid w-full grid-cols-2 mb-6 dark:bg-gray-700">
                <TabsTrigger value="pending" className="dark:data-[state=active]:bg-purple-600">
                  Pendentes ({pendingRefunds.length})
                </TabsTrigger>
                <TabsTrigger value="processed" className="dark:data-[state=active]:bg-purple-600">
                  Processados ({processedRefunds.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="pending">
                <RefundTable
                  refunds={pendingRefunds}
                  onApprove={(refund) => handleAction(refund, "approve")}
                  onReject={(refund) => handleAction(refund, "reject")}
                  showActions
                />
              </TabsContent>

              <TabsContent value="processed">
                <RefundTable refunds={processedRefunds} showActions={false} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Action Dialog */}
      <Dialog
        open={!!selectedRefund}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedRefund(null);
            setActionType(null);
            setRejectionReason("");
          }
        }}
      >
        <DialogContent className="dark:bg-gray-800 dark:border-gray-700">
          <DialogHeader>
            <DialogTitle className="dark:text-white">
              {actionType === "approve" ? "Aprovar Reembolso" : "Rejeitar Reembolso"}
            </DialogTitle>
            <DialogDescription className="dark:text-gray-400">
              {actionType === "approve"
                ? "Confirme a aprovação do reembolso"
                : "Informe o motivo da rejeição"}
            </DialogDescription>
          </DialogHeader>

          {selectedRefund && (
            <div className="space-y-4">
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Evento</p>
                <p className="font-semibold text-gray-900 dark:text-white">{selectedRefund.event_title}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-3 mb-1">Comprador</p>
                <p className="text-gray-900 dark:text-white">{selectedRefund.buyer_name}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-3 mb-1">Valor</p>
                <p className="text-lg font-bold text-green-600 dark:text-green-400">
                  R$ {selectedRefund.refund_amount.toFixed(2)}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-3 mb-1">Motivo</p>
                <p className="text-sm text-gray-900 dark:text-gray-300">{selectedRefund.reason}</p>
              </div>

              {actionType === "reject" && (
                <div>
                  <Label htmlFor="rejection_reason" className="dark:text-gray-300">Motivo da Rejeição *</Label>
                  <Textarea
                    id="rejection_reason"
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="Explique o motivo da rejeição..."
                    rows={4}
                    className="mt-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setSelectedRefund(null);
                setActionType(null);
                setRejectionReason("");
              }}
              disabled={processRefundMutation.isPending}
              className="dark:border-gray-700 dark:text-gray-300"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={processRefundMutation.isPending}
              className={
                actionType === "approve"
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-red-600 hover:bg-red-700"
              }
            >
              {processRefundMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processando...
                </>
              ) : actionType === "approve" ? (
                <>
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Aprovar
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4 mr-2" />
                  Rejeitar
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function RefundTable({ refunds, onApprove, onReject, showActions }) {
  if (refunds.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500 dark:text-gray-400">
        Nenhuma solicitação encontrada
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="dark:border-gray-700">
            <TableHead className="dark:text-gray-300">Data</TableHead>
            <TableHead className="dark:text-gray-300">Evento</TableHead>
            <TableHead className="dark:text-gray-300">Comprador</TableHead>
            <TableHead className="dark:text-gray-300">Valor</TableHead>
            <TableHead className="dark:text-gray-300">Motivo</TableHead>
            <TableHead className="dark:text-gray-300">Status</TableHead>
            {showActions && <TableHead className="text-right dark:text-gray-300">Ações</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {refunds.map((refund) => (
            <TableRow key={refund.id} className="dark:border-gray-700">
              <TableCell className="text-sm dark:text-gray-300">
                {format(new Date(refund.request_date), "dd/MM/yyyy HH:mm")}
              </TableCell>
              <TableCell className="font-medium dark:text-white">{refund.event_title}</TableCell>
              <TableCell className="dark:text-gray-300">
                <div>
                  <p className="font-medium dark:text-white">{refund.buyer_name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{refund.buyer_email}</p>
                </div>
              </TableCell>
              <TableCell className="font-bold text-green-600 dark:text-green-400">
                R$ {refund.refund_amount.toFixed(2)}
              </TableCell>
              <TableCell className="max-w-xs">
                <p className="text-sm text-gray-700 dark:text-gray-300 truncate" title={refund.reason}>
                  {refund.reason}
                </p>
              </TableCell>
              <TableCell>
                <Badge
                  className={
                    refund.status === "aprovado"
                      ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400"
                      : refund.status === "rejeitado"
                      ? "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400"
                      : refund.status === "processado"
                      ? "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400"
                      : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400"
                  }
                >
                  {refund.status === "pendente" && "⏳ Pendente"}
                  {refund.status === "aprovado" && "✓ Aprovado"}
                  {refund.status === "rejeitado" && "✗ Rejeitado"}
                  {refund.status === "processado" && "✓ Processado"}
                </Badge>
              </TableCell>
              {showActions && (
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      size="sm"
                      onClick={() => onApprove(refund)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => onReject(refund)}
                    >
                      <XCircle className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}