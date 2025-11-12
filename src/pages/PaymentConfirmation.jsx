import React, { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { CheckCircle2, Share2, Ticket, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function PaymentConfirmation() {
  const navigate = useNavigate();
  const urlParams = new URLSearchParams(window.location.search);
  const paymentId = urlParams.get("payment");
  const [user, setUser] = useState(null);

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-4 h-4 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0s', animationDuration: '3s' }}></div>
        <div className="absolute top-40 right-20 w-3 h-3 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.5s', animationDuration: '2.5s' }}></div>
        <div className="absolute top-60 left-1/4 w-5 h-5 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '1s', animationDuration: '3.5s' }}></div>
        <div className="absolute bottom-40 right-1/3 w-4 h-4 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '1.5s', animationDuration: '3s' }}></div>
        <div className="absolute bottom-20 left-20 w-3 h-3 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '2s', animationDuration: '2.5s' }}></div>
        <div className="absolute top-1/3 right-10 w-4 h-4 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.3s', animationDuration: '3.2s' }}></div>
        <div className="absolute bottom-1/3 left-1/3 w-3 h-3 bg-red-400 rounded-full animate-bounce" style={{ animationDelay: '1.2s', animationDuration: '2.8s' }}></div>
        <div className="absolute top-10 right-1/4 w-5 h-5 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: '0.8s', animationDuration: '3.3s' }}></div>
      </div>

      <Card className="max-w-2xl w-full border-none shadow-2xl">
        <CardContent className="p-8 md:p-12">
          {/* Success Icon */}
          <div className="text-center mb-8">
            <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
              <CheckCircle2 className="w-16 h-16 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              Pagamento Confirmado! 🎉
            </h1>
            <p className="text-lg text-gray-600 mb-2">
              Seus ingressos foram enviados com sucesso
            </p>
            <p className="text-sm text-gray-500">
              ID do Pagamento: {paymentId}
            </p>
          </div>

          {/* Success Message */}
          <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6 mb-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Ticket className="w-6 h-6 text-green-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-2">O que acontece agora?</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Seus ingressos estão disponíveis em "Meus Ingressos"</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Enviamos um e-mail de confirmação para {user?.email}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Use o QR Code do ingresso na entrada do evento</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Reembolso disponível em até 7 dias após a compra</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              onClick={() => navigate(createPageUrl("MyTickets"))}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
              size="lg"
            >
              <Ticket className="w-5 h-5 mr-2" />
              Ver Meus Ingressos
            </Button>
            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={() => navigate(createPageUrl("Home"))}
                variant="outline"
                size="lg"
              >
                <Calendar className="w-5 h-5 mr-2" />
                Explorar Eventos
              </Button>
              <Button
                onClick={() => {
                  const shareText = `Acabei de comprar ingressos no TicketPass! 🎉`;
                  if (navigator.share) {
                    navigator.share({
                      title: "TicketPass",
                      text: shareText,
                    });
                  } else {
                    navigator.clipboard.writeText(shareText);
                    alert("Link copiado para a área de transferência!");
                  }
                }}
                variant="outline"
                size="lg"
              >
                <Share2 className="w-5 h-5 mr-2" />
                Compartilhar
              </Button>
            </div>
          </div>

          {/* Footer Note */}
          <div className="mt-8 pt-6 border-t border-gray-200 text-center">
            <p className="text-sm text-gray-500">
              Precisa de ajuda? Entre em contato com nosso{" "}
              <a
                href={createPageUrl("Support")}
                className="text-blue-600 hover:underline font-medium"
              >
                suporte
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}