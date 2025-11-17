import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Download, Maximize2, QrCode as QrCodeIcon, Eye, EyeOff } from "lucide-react";

export default function QRCodeDisplay({ value, ticketCode, eventTitle, size = 200 }) {
  const [showFullscreen, setShowFullscreen] = useState(false);
  const [showCode, setShowCode] = useState(false);
  
  const code = value || ticketCode || "";
  
  if (!code) {
    return null;
  }
  
  const getQRCodeUrl = (codeSize) => {
    return `https://api.qrserver.com/v1/create-qr-code/?size=${codeSize}x${codeSize}&data=${encodeURIComponent(code)}`;
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = getQRCodeUrl(800);
    link.download = `ticket-${code}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <Card className="border-none shadow-md hover:shadow-lg transition-shadow dark:bg-gray-800 bg-white">
        <CardContent className="p-4">
          <div className="flex flex-col items-center gap-3">
            <div className="relative bg-white p-2 rounded-lg">
              <img
                src={getQRCodeUrl(size)}
                alt="QR Code do Ingresso"
                className="w-full h-full rounded-lg"
              />
            </div>
            
            <div className="w-full space-y-2">
              <div className="text-center">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Código do Ingresso</p>
                <div className="flex items-center justify-center gap-2">
                  <p className="text-sm font-mono font-semibold text-gray-900 dark:text-white break-all">
                    {showCode ? code : "•".repeat(Math.min(code.length, 30))}
                  </p>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 dark:hover:bg-gray-700"
                    onClick={() => setShowCode(!showCode)}
                  >
                    {showCode ? (
                      <EyeOff className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    ) : (
                      <Eye className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    )}
                  </Button>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
                  onClick={() => setShowFullscreen(true)}
                >
                  <Maximize2 className="w-4 h-4 mr-2" />
                  Ver Maior
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
                  onClick={handleDownload}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Baixar
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Fullscreen Dialog */}
      <Dialog open={showFullscreen} onOpenChange={setShowFullscreen}>
        <DialogContent className="max-w-lg dark:bg-gray-800 dark:border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-center dark:text-white">
              <div className="flex items-center justify-center gap-2">
                <QrCodeIcon className="w-5 h-5" />
                QR Code do Ingresso
              </div>
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center gap-4 py-4">
            {eventTitle && (
              <div className="text-center mb-2">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Evento</p>
                <p className="font-semibold text-gray-900 dark:text-white">{eventTitle}</p>
              </div>
            )}
            <div className="bg-white p-4 rounded-lg">
              <img
                src={getQRCodeUrl(400)}
                alt="QR Code do Ingresso"
                className="w-full max-w-md rounded-lg"
              />
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Código</p>
              <div className="flex items-center justify-center gap-2">
                <p className="text-sm font-mono font-semibold text-gray-900 dark:text-white break-all">
                  {showCode ? code : "•".repeat(Math.min(code.length, 30))}
                </p>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 dark:hover:bg-gray-700"
                  onClick={() => setShowCode(!showCode)}
                >
                  {showCode ? (
                    <EyeOff className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  ) : (
                    <Eye className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  )}
                </Button>
              </div>
            </div>
            <p className="text-xs text-center text-gray-500 dark:text-gray-400 max-w-md">
              Apresente este QR Code na entrada do evento para validação
            </p>
            <Button onClick={handleDownload} className="w-full dark:bg-purple-600 dark:hover:bg-purple-700">
              <Download className="w-4 h-4 mr-2" />
              Baixar QR Code
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}