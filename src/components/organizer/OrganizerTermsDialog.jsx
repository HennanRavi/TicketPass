import React, { useState } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Shield, DollarSign, RefreshCw, FileText, AlertCircle } from "lucide-react";

export default function OrganizerTermsDialog({ open, onOpenChange, onAccept, isLoading }) {
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [agreedToRefundPolicy, setAgreedToRefundPolicy] = useState(false);
  const [agreedToFees, setAgreedToFees] = useState(false);

  const handleAccept = () => {
    if (agreedToTerms && agreedToRefundPolicy && agreedToFees) {
      onAccept();
    }
  };

  const allAgreed = agreedToTerms && agreedToRefundPolicy && agreedToFees;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] dark:bg-gray-800 dark:border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-2xl dark:text-white">
            Termos para Organizadores
          </DialogTitle>
          <DialogDescription className="dark:text-gray-400">
            Leia atentamente e aceite os termos para se tornar um organizador
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-[50vh] pr-4">
          <div className="space-y-6">
            {/* General Terms */}
            <div className="border rounded-lg p-5 dark:border-gray-700">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-blue-100 dark:bg-purple-900/40 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-blue-600 dark:text-purple-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Termos de Uso para Organizadores
                </h3>
              </div>
              <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
                <p>
                  Ao se tornar um organizador na plataforma TicketPass, você concorda em:
                </p>
                <ul className="space-y-2 ml-4 list-disc">
                  <li>Fornecer informações precisas e atualizadas sobre seus eventos</li>
                  <li>Cumprir todas as leis e regulamentos locais aplicáveis</li>
                  <li>Não promover eventos ilegais, fraudulentos ou prejudiciais</li>
                  <li>Manter a segurança e bem-estar dos participantes</li>
                  <li>Responder prontamente a dúvidas e problemas dos participantes</li>
                  <li>Garantir que o evento ocorra conforme anunciado</li>
                </ul>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
                  Para mais detalhes, consulte nossos{" "}
                  <Link 
                    to={createPageUrl("TermosUso")} 
                    className="text-blue-600 dark:text-purple-400 hover:underline"
                    target="_blank"
                  >
                    Termos de Uso completos
                  </Link>
                </p>
              </div>
            </div>

            {/* Refund Policy */}
            <div className="border rounded-lg p-5 dark:border-gray-700">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/40 rounded-lg flex items-center justify-center">
                  <RefreshCw className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Política de Reembolso
                </h3>
              </div>
              <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
                <p>
                  Como organizador, você está ciente de que:
                </p>
                <ul className="space-y-2 ml-4 list-disc">
                  <li>
                    <strong>Participantes podem solicitar reembolso em até 7 dias</strong> após a compra do ingresso
                  </li>
                  <li>
                    Os pagamentos ficam <strong>retidos por 7 dias</strong> antes de serem transferidos para sua conta
                  </li>
                  <li>
                    Durante este período, reembolsos podem ser aprovados pelos administradores
                  </li>
                  <li>
                    Se um reembolso for aprovado, o valor será devolvido ao participante
                  </li>
                  <li>
                    Após 7 dias, os fundos são liberados e transferidos para sua conta bancária
                  </li>
                  <li>
                    Cancelamento de eventos pode resultar em reembolso total aos participantes
                  </li>
                </ul>
                <Alert className="mt-3 bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800">
                  <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                  <AlertDescription className="text-xs text-yellow-900 dark:text-yellow-300">
                    É sua responsabilidade garantir que o evento ocorra conforme anunciado para evitar reembolsos.
                  </AlertDescription>
                </Alert>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
                  Leia a{" "}
                  <Link 
                    to={createPageUrl("PoliticaReembolso")} 
                    className="text-orange-600 dark:text-orange-400 hover:underline"
                    target="_blank"
                  >
                    Política de Reembolso completa
                  </Link>
                </p>
              </div>
            </div>

            {/* Platform Fees */}
            <div className="border rounded-lg p-5 dark:border-gray-700">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-green-100 dark:bg-green-900/40 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Taxas da Plataforma
                </h3>
              </div>
              <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
                <p>
                  A TicketPass cobra uma taxa de serviço sobre cada ingresso vendido:
                </p>
                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-gray-900 dark:text-white">Taxa da Plataforma:</span>
                    <span className="text-2xl font-bold text-green-600 dark:text-green-400">5%</span>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Sobre cada ingresso vendido
                  </p>
                </div>
                <ul className="space-y-2 ml-4 list-disc">
                  <li>
                    <strong>Você recebe 95%</strong> do valor de cada ingresso vendido
                  </li>
                  <li>
                    <strong>A plataforma retém 5%</strong> como taxa de serviço
                  </li>
                  <li>
                    As taxas cobrem: processamento de pagamentos, hospedagem, suporte e manutenção
                  </li>
                  <li>
                    Os valores são calculados automaticamente em cada transação
                  </li>
                </ul>
                <div className="bg-gray-50 dark:bg-gray-900/40 rounded-lg p-4 border border-gray-200 dark:border-gray-700 mt-3">
                  <p className="text-xs font-semibold text-gray-900 dark:text-white mb-2">Exemplo:</p>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Preço do ingresso:</span>
                      <span className="font-medium dark:text-white">R$ 100,00</span>
                    </div>
                    <div className="flex justify-between text-red-600 dark:text-red-400">
                      <span>Taxa da plataforma (5%):</span>
                      <span className="font-medium">- R$ 5,00</span>
                    </div>
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-1 mt-1"></div>
                    <div className="flex justify-between text-green-600 dark:text-green-400 font-bold">
                      <span>Você recebe:</span>
                      <span>R$ 95,00</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Security Notice */}
            <Alert className="bg-blue-50 dark:bg-purple-900/20 border-blue-200 dark:border-purple-800">
              <Shield className="h-4 w-4 text-blue-600 dark:text-purple-400" />
              <AlertDescription className="text-sm text-blue-900 dark:text-purple-300">
                <strong>Segurança:</strong> Todos os pagamentos são processados de forma segura. 
                Seus dados bancários serão verificados antes de você poder receber pagamentos.
              </AlertDescription>
            </Alert>
          </div>
        </ScrollArea>

        <div className="space-y-3 pt-4 border-t dark:border-gray-700">
          {/* Checkboxes */}
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Checkbox
                id="terms"
                checked={agreedToTerms}
                onCheckedChange={setAgreedToTerms}
                className="mt-0.5"
              />
              <label htmlFor="terms" className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer leading-relaxed">
                Li e aceito os <strong>Termos de Uso</strong> para organizadores
              </label>
            </div>
            
            <div className="flex items-start gap-3">
              <Checkbox
                id="refund"
                checked={agreedToRefundPolicy}
                onCheckedChange={setAgreedToRefundPolicy}
                className="mt-0.5"
              />
              <label htmlFor="refund" className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer leading-relaxed">
                Entendo e aceito a <strong>Política de Reembolso</strong> (7 dias de retenção e possibilidade de reembolso)
              </label>
            </div>
            
            <div className="flex items-start gap-3">
              <Checkbox
                id="fees"
                checked={agreedToFees}
                onCheckedChange={setAgreedToFees}
                className="mt-0.5"
              />
              <label htmlFor="fees" className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer leading-relaxed">
                Concordo com a <strong>taxa de 5%</strong> sobre cada ingresso vendido
              </label>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
            className="dark:border-gray-700 dark:text-gray-300"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleAccept}
            disabled={!allAgreed || isLoading}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 dark:from-purple-600 dark:to-purple-700 dark:hover:from-purple-700 dark:hover:to-purple-800"
          >
            {isLoading ? "Salvando..." : "Aceitar e Continuar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}