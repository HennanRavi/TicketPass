import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Scan, CheckCircle2, XCircle, AlertCircle, Ticket as TicketIcon, Calendar, MapPin, User, QrCode, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";
import QRScanner from "../components/scanner/QRScanner";

export default function ValidateTicket() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [user, setUser] = useState(null);
  const [ticketCode, setTicketCode] = useState("");
  const [validationResult, setValidationResult] = useState(null);
  const [isValidating, setIsValidating] = useState(false);
  const [showScanner, setShowScanner] = useState(false);

  useEffect(() => {
    base44.auth
      .me()
      .then((u) => {
        if (u.role !== "admin") {
          toast.error("Apenas o administrador pode validar ingressos");
          navigate(createPageUrl("Home"));
          return;
        }
        setUser(u);
      })
      .catch(() => {
        base44.auth.redirectToLogin(window.location.href);
      });
  }, []);

  const validateTicketMutation = useMutation({
    mutationFn: async (code) => {
      setIsValidating(true);
      const tickets = await base44.entities.Ticket.filter({ ticket_code: code });
      
      if (tickets.length === 0) {
        return { success: false, error: "Ingresso não encontrado" };
      }

      const ticket = tickets[0];

      // Check if ticket belongs to organizer's event
      const events = await base44.entities.Event.filter({ id: ticket.event_id });
      if (events.length === 0) {
        return { success: false, error: "Evento não encontrado" };
      }

      const event = events[0];
      if (event.organizer_id !== user.id) {
        return { success: false, error: "Este ingresso não pertence aos seus eventos" };
      }

      if (ticket.status === "usado") {
        return { success: false, error: "Ingresso já foi utilizado", ticket, event };
      }

      if (ticket.status === "cancelado") {
        return { success: false, error: "Ingresso foi cancelado", ticket, event };
      }

      // Validate ticket
      await base44.entities.Ticket.update(ticket.id, { status: "usado" });

      // Create notification for buyer
      await base44.entities.Notification.create({
        user_id: ticket.buyer_id,
        title: "Ingresso Validado ✓",
        message: `Seu ingresso para ${event.title} foi validado com sucesso!`,
        type: "success",
        category: "ticket",
        link: createPageUrl("MyTickets"),
      });

      return { success: true, ticket, event };
    },
    onSuccess: (result) => {
      setValidationResult(result);
      setIsValidating(false);
      if (result.success) {
        toast.success("Ingresso validado com sucesso!");
        queryClient.invalidateQueries({ queryKey: ["tickets"] });
      } else {
        toast.error(result.error);
      }
    },
    onError: () => {
      setIsValidating(false);
      toast.error("Erro ao validar ingresso");
    },
  });

  const handleValidate = (e) => {
    e.preventDefault();
    if (!ticketCode.trim()) {
      toast.error("Digite o código do ingresso");
      return;
    }
    setValidationResult(null);
    validateTicketMutation.mutate(ticketCode.trim());
  };

  const handleReset = () => {
    setTicketCode("");
    setValidationResult(null);
  };

  const handleScan = (scannedCode) => {
    setShowScanner(false);
    setTicketCode(scannedCode);
    setValidationResult(null);
    validateTicketMutation.mutate(scannedCode.trim());
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4">
            <Scan className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Validar Ingresso
          </h1>
          <p className="text-lg text-gray-600">
            Digite ou escaneie o código do ingresso para validar a entrada
          </p>
        </div>

        {/* Validation Form */}
        <Card className="border-none shadow-2xl mb-6">
          <CardHeader>
            <CardTitle>Código do Ingresso</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleValidate} className="space-y-4">
              <div>
                <Label htmlFor="ticketCode">
                  Digite o código ou escaneie o QR Code
                </Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    id="ticketCode"
                    placeholder="TICKET-1234567890-XXXXX"
                    value={ticketCode}
                    onChange={(e) => setTicketCode(e.target.value)}
                    className="font-mono text-lg flex-1"
                    autoFocus
                    disabled={isValidating}
                  />
                  <Button
                    type="button"
                    onClick={() => setShowScanner(true)}
                    variant="outline"
                    className="px-4"
                    disabled={isValidating}
                  >
                    <Camera className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isValidating}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 py-6 text-lg font-semibold"
              >
                {isValidating ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Validando...
                  </>
                ) : (
                  <>
                    <QrCode className="w-5 h-5 mr-2" />
                    Validar Ingresso
                  </>
                )}
              </Button>
              {validationResult && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleReset}
                  className="w-full mt-2"
                >
                  Limpar
                </Button>
              )}
            </form>
          </CardContent>
        </Card>

        {/* Validation Result */}
        {validationResult && (
          <Card
            className={`border-none shadow-2xl ${
              validationResult.success
                ? "bg-gradient-to-br from-green-50 to-emerald-50"
                : "bg-gradient-to-br from-red-50 to-orange-50"
            }`}
          >
            <CardContent className="p-8">
              <div className="text-center mb-6">
                {validationResult.success ? (
                  <>
                    <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle2 className="w-10 h-10 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-green-900 mb-2">
                      Ingresso Válido!
                    </h2>
                    <p className="text-green-700">
                      O ingresso foi validado com sucesso
                    </p>
                  </>
                ) : (
                  <>
                    <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <XCircle className="w-10 h-10 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-red-900 mb-2">
                      Ingresso Inválido
                    </h2>
                    <p className="text-red-700">{validationResult.error}</p>
                  </>
                )}
              </div>

              {validationResult.ticket && validationResult.event && (
                <div className="space-y-4 mt-6">
                  <div className="bg-white rounded-xl p-6 shadow-md space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <TicketIcon className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-500">Evento</p>
                        <p className="font-semibold text-gray-900">
                          {validationResult.event.title}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-500">Data do Evento</p>
                        <p className="font-medium text-gray-900">
                          {format(
                            new Date(validationResult.event.date),
                            "dd/MM/yyyy 'às' HH:mm",
                            { locale: ptBR }
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <User className="w-5 h-5 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-500">Comprador</p>
                        <p className="font-medium text-gray-900">
                          {validationResult.ticket.buyer_name}
                        </p>
                        <p className="text-sm text-gray-600">
                          {validationResult.ticket.buyer_email}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                        <TicketIcon className="w-5 h-5 text-orange-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-500">Quantidade</p>
                        <p className="font-semibold text-gray-900">
                          {validationResult.ticket.quantity} ingresso(s)
                        </p>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-gray-200">
                      <p className="text-xs text-gray-500 mb-1">Código do Ingresso</p>
                      <p className="text-sm font-mono font-semibold text-gray-900 break-all">
                        {validationResult.ticket.ticket_code}
                      </p>
                    </div>

                    {!validationResult.success && (
                      <Alert className="bg-red-50 border-red-200">
                        <AlertCircle className="h-4 w-4 text-red-600" />
                        <AlertDescription className="text-red-800">
                          {validationResult.error}
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Instructions */}
        <Card className="border-none shadow-lg mt-6 bg-blue-50">
          <CardContent className="p-6">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-blue-600" />
              Instruções
            </h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-blue-600">•</span>
                <span>Digite o código do ingresso manualmente ou clique no ícone da câmera para escanear o QR Code</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600">•</span>
                <span>Cada ingresso só pode ser validado uma vez</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600">•</span>
                <span>Você só pode validar ingressos dos seus próprios eventos</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600">•</span>
                <span>O comprador receberá uma notificação quando o ingresso for validado</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* QR Scanner Modal */}
      {showScanner && (
        <QRScanner
          onScan={handleScan}
          onClose={() => setShowScanner(false)}
        />
      )}
    </div>
  );
}