import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { QrCode, CheckCircle2, XCircle, Scan, AlertCircle, Ticket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import QRScanner from "../components/scanner/QRScanner";

export default function ValidateTicket() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [user, setUser] = useState(null);
  const [ticketCode, setTicketCode] = useState("");
  const [validationResult, setValidationResult] = useState(null);
  const [showScanner, setShowScanner] = useState(false);

  useEffect(() => {
    base44.auth
      .me()
      .then((u) => {
        if (u.role !== "admin") {
          navigate(createPageUrl("Home"));
          toast.error("Apenas administradores podem validar ingressos");
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
      const tickets = await base44.entities.Ticket.filter({ ticket_code: code });
      
      if (tickets.length === 0) {
        throw new Error("Ingresso não encontrado");
      }

      const ticket = tickets[0];

      if (!ticket.event_id) {
        throw new Error("Ingresso inválido");
      }

      const events = await base44.entities.Event.filter({ id: ticket.event_id });
      const event = events[0];

      if (!event) {
        throw new Error("Evento não encontrado");
      }

      if (ticket.status === "usado") {
        return {
          valid: false,
          message: "Este ingresso já foi utilizado",
          ticket,
          event,
        };
      }

      if (ticket.status === "cancelado") {
        return {
          valid: false,
          message: "Este ingresso foi cancelado",
          ticket,
          event,
        };
      }

      await base44.entities.Ticket.update(ticket.id, { status: "usado" });

      await base44.entities.Notification.create({
        user_id: ticket.buyer_id,
        title: "Ingresso Validado ✅",
        message: `Seu ingresso para "${event.title}" foi validado com sucesso!`,
        type: "success",
        category: "ticket",
      });

      return {
        valid: true,
        message: "Ingresso validado com sucesso!",
        ticket,
        event,
      };
    },
    onSuccess: (result) => {
      setValidationResult(result);
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
      
      if (result.valid) {
        toast.success("Ingresso validado com sucesso!");
      } else {
        toast.error(result.message);
      }
    },
    onError: (error) => {
      setValidationResult({
        valid: false,
        message: error.message || "Erro ao validar ingresso",
      });
      toast.error(error.message || "Erro ao validar ingresso");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!ticketCode.trim()) {
      toast.error("Digite o código do ingresso");
      return;
    }
    validateTicketMutation.mutate(ticketCode.trim());
  };

  const handleReset = () => {
    setTicketCode("");
    setValidationResult(null);
  };

  const handleScan = (code) => {
    setShowScanner(false);
    setTicketCode(code);
    validateTicketMutation.mutate(code);
  };

  if (!user) {
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
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 dark:bg-gray-800/40 backdrop-blur-md rounded-2xl mb-4 border border-white/30 dark:border-gray-700/30">
              <CheckCircle2 className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-3 text-white text-shadow-strong">
              Validar Ingresso
            </h1>
            <p className="text-lg text-white/95 max-w-2xl mx-auto text-shadow-medium">
              Escaneie ou digite o código do ingresso para validar a entrada
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="border-none shadow-xl mb-8 dark:bg-gray-800">
          <CardHeader>
            <CardTitle className="dark:text-white">Validação de Ingresso</CardTitle>
          </CardHeader>
          <CardContent>
            {!validationResult ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Código do Ingresso
                  </label>
                  <div className="flex gap-3">
                    <Input
                      value={ticketCode}
                      onChange={(e) => setTicketCode(e.target.value)}
                      placeholder="Digite ou escaneie o código"
                      className="flex-1 dark:bg-gray-900 dark:border-gray-700 dark:text-white"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowScanner(true)}
                      className="gap-2 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
                    >
                      <Scan className="w-4 h-4" />
                      Escanear QR
                    </Button>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={validateTicketMutation.isPending}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 dark:from-orange-500 dark:to-orange-600 dark:hover:from-orange-600 dark:hover:to-orange-700"
                >
                  {validateTicketMutation.isPending ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Validando...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Validar Ingresso
                    </>
                  )}
                </Button>
              </form>
            ) : (
              <div className="space-y-6">
                <Alert
                  className={
                    validationResult.valid
                      ? "bg-green-50 border-green-200 dark:bg-orange-900/20 dark:border-orange-800"
                      : "bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800"
                  }
                >
                  <div className="flex items-center gap-3">
                    {validationResult.valid ? (
                      <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-orange-400" />
                    ) : (
                      <XCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
                    )}
                    <div>
                      <AlertDescription
                        className={
                          validationResult.valid
                            ? "text-green-900 dark:text-orange-300 font-semibold"
                            : "text-red-900 dark:text-red-300 font-semibold"
                        }
                      >
                        {validationResult.message}
                      </AlertDescription>
                    </div>
                  </div>
                </Alert>

                {validationResult.ticket && validationResult.event && (
                  <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6 space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Detalhes do Ingresso
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Evento</p>
                          <p className="font-semibold text-gray-900 dark:text-white">
                            {validationResult.event.title}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Data</p>
                          <p className="font-semibold text-gray-900 dark:text-white">
                            {format(
                              new Date(validationResult.event.date),
                              "dd/MM/yyyy 'às' HH:mm",
                              { locale: ptBR }
                            )}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Comprador</p>
                          <p className="font-semibold text-gray-900 dark:text-white">
                            {validationResult.ticket.buyer_name}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Quantidade</p>
                          <p className="font-semibold text-gray-900 dark:text-white">
                            {validationResult.ticket.quantity} ingresso(s)
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Valor</p>
                          <p className="font-semibold text-gray-900 dark:text-white">
                            R$ {validationResult.ticket.total_price?.toFixed(2)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Código</p>
                          <p className="font-mono text-sm text-gray-900 dark:text-white">
                            {validationResult.ticket.ticket_code}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <Button
                  onClick={handleReset}
                  variant="outline"
                  className="w-full dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  Validar Outro Ingresso
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card className="border-none shadow-lg dark:bg-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 dark:text-white">
              <AlertCircle className="w-5 h-5 text-blue-600 dark:text-purple-400" />
              Como Validar Ingressos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="space-y-3 text-gray-700 dark:text-gray-300">
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-purple-900/40 text-blue-600 dark:text-purple-400 rounded-full flex items-center justify-center text-sm font-semibold">
                  1
                </span>
                <span>
                  <strong>Solicite o ingresso:</strong> Peça ao participante para apresentar o
                  QR Code ou código do ingresso
                </span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-purple-900/40 text-blue-600 dark:text-purple-400 rounded-full flex items-center justify-center text-sm font-semibold">
                  2
                </span>
                <span>
                  <strong>Escaneie ou digite:</strong> Use a câmera para escanear o QR Code
                  ou digite o código manualmente
                </span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-purple-900/40 text-blue-600 dark:text-purple-400 rounded-full flex items-center justify-center text-sm font-semibold">
                  3
                </span>
                <span>
                  <strong>Verifique o resultado:</strong> Aguarde a validação e confira se
                  o ingresso é válido
                </span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-purple-900/40 text-blue-600 dark:text-purple-400 rounded-full flex items-center justify-center text-sm font-semibold">
                  4
                </span>
                <span>
                  <strong>Libere a entrada:</strong> Se o ingresso for válido, permita a
                  entrada do participante
                </span>
              </li>
            </ol>

            <Alert className="mt-6 bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800">
              <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
              <AlertDescription className="text-sm text-yellow-900 dark:text-yellow-300">
                <strong>Importante:</strong> Cada ingresso só pode ser validado uma vez.
                Após a validação, ele não poderá ser usado novamente.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>

      {/* QR Scanner */}
      {showScanner && (
        <QRScanner
          onScan={handleScan}
          onClose={() => setShowScanner(false)}
        />
      )}
    </div>
  );
}