import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Wallet, Download, Share2, Calendar, MapPin, Clock, Ticket as TicketIcon } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";

export default function WalletPass({ ticket, event }) {
  const [showPass, setShowPass] = useState(false);

  const handleDownloadPass = () => {
    const link = document.createElement('a');
    link.href = `https://api.qrserver.com/v1/create-qr-code/?size=800x800&data=${encodeURIComponent(ticket.ticket_code)}`;
    link.download = `ingresso-${ticket.ticket_code}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success("QR Code salvo! Adicione manualmente à sua carteira digital");
  };

  const handleShare = async () => {
    const shareText = `Meu ingresso para ${event.title} 🎉`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: event.title,
          text: shareText,
        });
      } catch (error) {
        if (error.name !== 'AbortError') {
          toast.error("Erro ao compartilhar");
        }
      }
    } else {
      navigator.clipboard.writeText(shareText);
      toast.success("Texto copiado!");
    }
  };

  return (
    <>
      <Button
        onClick={() => setShowPass(true)}
        className="w-full bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 dark:from-gray-700 dark:to-gray-600 text-white"
      >
        <Wallet className="w-4 h-4 mr-2" />
        Adicionar à Carteira
      </Button>

      <Dialog open={showPass} onOpenChange={setShowPass}>
        <DialogContent className="max-w-3xl dark:bg-gray-800">
          <DialogHeader>
            <DialogTitle className="dark:text-white">Passe Digital do Ingresso</DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Visual Pass Card */}
            <Card className="border-none shadow-2xl overflow-hidden bg-gradient-to-br from-blue-600 to-blue-800 dark:from-purple-700 dark:to-purple-900">
              <div className="p-8 text-white">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                        <TicketIcon className="w-6 h-6" />
                      </div>
                      <span className="text-sm font-medium opacity-90">TicketPass</span>
                    </div>
                    <h3 className="text-2xl font-bold mb-4">{event.title}</h3>
                    
                    <div className="space-y-2 text-white/90">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm">
                          {format(new Date(event.date), "dd 'de' MMMM, yyyy", { locale: ptBR })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm">
                          {format(new Date(event.date), "HH:mm", { locale: ptBR })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm">{event.location}</span>
                      </div>
                    </div>
                  </div>

                  {/* QR Code */}
                  <div className="bg-white p-4 rounded-xl">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(ticket.ticket_code)}`}
                      alt="QR Code"
                      className="w-36 h-36"
                    />
                  </div>
                </div>

                {/* Ticket Info */}
                <div className="pt-6 border-t border-white/20 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="opacity-75">Quantidade</span>
                    <span className="font-semibold">{ticket.quantity} ingresso(s)</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="opacity-75">Comprador</span>
                    <span className="font-semibold">{ticket.buyer_name}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="opacity-75">Código</span>
                    <span className="font-mono font-semibold text-xs">{ticket.ticket_code}</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Instructions */}
            <div className="bg-blue-50 dark:bg-gray-700 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                Como adicionar à sua carteira digital:
              </h4>
              <ol className="text-sm text-gray-700 dark:text-gray-300 space-y-1 list-decimal list-inside">
                <li>Baixe o QR Code clicando no botão "Baixar QR Code"</li>
                <li><strong>iPhone:</strong> Salve a imagem e adicione ao Apple Wallet usando um app compatível</li>
                <li><strong>Android:</strong> Abra o Google Pay e adicione o passe manualmente usando a imagem</li>
                <li>Ou tire um screenshot deste passe e salve em suas fotos para fácil acesso</li>
              </ol>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={handleDownloadPass}
                variant="outline"
                className="dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                <Download className="w-4 h-4 mr-2" />
                Baixar QR Code
              </Button>
              <Button
                onClick={handleShare}
                variant="outline"
                className="dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Compartilhar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}