import React, { useEffect, useRef, useState } from "react";
import { Camera, X, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { base44 } from "@/api/base44Client";

export default function QRScanner({ onScan, onClose }) {
  const fileInputRef = useRef(null);
  const [error, setError] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Detect if device is mobile
    const checkMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    setIsMobile(checkMobile);
    
    if (!checkMobile) {
      setError("O leitor de QR Code está disponível apenas em dispositivos móveis. Use um celular ou tablet para escanear.");
    }
  }, []);



  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      processImage(file);
    }
  };

  const processImage = async (imageBlob) => {
    setIsScanning(true);
    setError(null);
    
    try {
      // Upload image
      const { file_url } = await base44.integrations.Core.UploadFile({ 
        file: imageBlob 
      });

      // Use LLM to extract QR code text from image
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Analise esta imagem de um QR Code de ingresso e extraia o código do ingresso.

O código do ingresso segue o padrão: TICKET-[timestamp]-[código alfanumérico]-[número]
Exemplo: TICKET-1234567890-abc123xyz-1

INSTRUÇÕES:
1. Identifique o QR Code na imagem
2. Extraia APENAS o código completo do ingresso
3. Retorne SOMENTE o código, sem explicações ou texto adicional
4. Se não conseguir identificar um código válido, retorne apenas a palavra "ERRO"

IMPORTANTE: Retorne apenas o código ou "ERRO", nada mais.`,
        file_urls: [file_url],
        response_json_schema: {
          type: "object",
          properties: {
            code: { type: "string" },
            success: { type: "boolean" }
          }
        }
      });

      if (result.success && result.code && result.code !== "ERRO" && result.code.includes("TICKET")) {
        onScan(result.code);
      } else {
        setError("Não foi possível ler o QR Code. Verifique se:\n• O QR Code está visível e focado\n• Há boa iluminação\n• A imagem não está tremida\n\nOu digite o código manualmente.");
        setIsScanning(false);
      }
    } catch (err) {
      setError("Erro ao processar a imagem. Tente novamente ou digite o código manualmente.");
      console.error("Process error:", err);
      setIsScanning(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <Smartphone className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-white font-bold text-lg">Escanear QR Code</h3>
              <p className="text-blue-100 text-xs">
                {isMobile ? "Tire uma foto do QR Code do ingresso" : "Disponível apenas em celulares"}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-white hover:bg-white/20"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Scanner Area */}
        <div className="relative bg-gradient-to-br from-gray-900 to-black min-h-[400px]">
          {!isMobile ? (
            <div className="p-8 flex flex-col items-center justify-center h-full min-h-[400px]">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
                <Smartphone className="w-10 h-10 text-red-600" />
              </div>
              <h3 className="text-white text-xl font-bold mb-3">Dispositivo Não Compatível</h3>
              <p className="text-white/80 text-center max-w-md mb-6">
                O leitor de QR Code está disponível apenas em dispositivos móveis (celulares e tablets).
              </p>
              <div className="bg-blue-900/30 border border-blue-500/50 rounded-lg p-4 max-w-md">
                <p className="text-blue-200 text-sm text-center">
                  💡 <strong>Dica:</strong> Abra esta página em seu celular ou digite o código do ingresso manualmente no campo acima.
                </p>
              </div>
            </div>
          ) : error ? (
            <div className="p-6">
              <Alert className="bg-red-50 border-red-200">
                <AlertDescription className="text-red-800 whitespace-pre-line">
                  {error}
                </AlertDescription>
              </Alert>
              {isMobile && (
                <Button
                  onClick={() => {
                    setError(null);
                    fileInputRef.current?.click();
                  }}
                  className="w-full mt-4 bg-blue-600 hover:bg-blue-700"
                >
                  <Camera className="w-5 h-5 mr-2" />
                  Tentar Novamente
                </Button>
              )}
            </div>
          ) : isScanning ? (
            <div className="p-12 flex flex-col items-center justify-center min-h-[400px]">
              <div className="relative mb-6">
                <div className="animate-spin rounded-full h-20 w-20 border-4 border-white/20 border-t-white"></div>
                <Smartphone className="w-8 h-8 text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
              </div>
              <p className="text-white text-xl font-semibold mb-2">Processando QR Code...</p>
              <p className="text-white/70 text-sm">Extraindo código do ingresso</p>
            </div>
          ) : (
            <div className="p-8 space-y-6">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Camera className="w-10 h-10 text-blue-400" />
                </div>
                <h3 className="text-white text-xl font-bold mb-2">Escanear Ingresso</h3>
                <p className="text-white/70">Tire uma foto clara do QR Code</p>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleFileSelect}
                className="hidden"
              />

              <Button
                onClick={() => fileInputRef.current?.click()}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 py-8 text-lg font-semibold shadow-xl"
                disabled={isScanning}
              >
                <Camera className="w-7 h-7 mr-3" />
                Abrir Câmera e Capturar
              </Button>

              <div className="bg-blue-900/30 border border-blue-500/50 rounded-xl p-6 space-y-3">
                <h4 className="text-white font-semibold flex items-center gap-2">
                  💡 Dicas para melhor leitura:
                </h4>
                <ul className="space-y-2 text-white/80 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-400 mt-1">•</span>
                    <span>Certifique-se de que o QR Code está completamente visível</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-400 mt-1">•</span>
                    <span>Use boa iluminação (evite sombras)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-400 mt-1">•</span>
                    <span>Mantenha a câmera estável ao tirar a foto</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-400 mt-1">•</span>
                    <span>Foque bem o QR Code antes de capturar</span>
                  </li>
                </ul>
              </div>

              <div className="text-center">
                <Button
                  onClick={onClose}
                  variant="ghost"
                  className="text-white/70 hover:text-white hover:bg-white/10"
                >
                  Digitar código manualmente
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}