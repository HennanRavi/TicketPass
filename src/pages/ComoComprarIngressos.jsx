import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { ArrowLeft, Search, CreditCard, Ticket, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function ComoComprarIngressos() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-950 dark:via-gray-900 dark:to-blue-950 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link to={createPageUrl("Support")}>
          <Button variant="ghost" className="mb-6 dark:text-gray-300 dark:hover:bg-gray-800">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar ao Suporte
          </Button>
        </Link>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500 rounded-2xl mb-4 shadow-lg">
            <Ticket className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Como Comprar Ingressos?
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Passo a passo completo para adquirir seus ingressos
          </p>
        </div>

        {/* Alert */}
        <Alert className="mb-8 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
          <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          <AlertDescription className="text-blue-900 dark:text-blue-300">
            <strong>Importante:</strong> Você precisa estar logado para comprar ingressos. Se ainda não tem uma conta, crie uma gratuitamente!
          </AlertDescription>
        </Alert>

        {/* Steps */}
        <div className="space-y-6">
          {/* Step 1 */}
          <Card className="border-none shadow-xl dark:bg-gray-800">
            <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-600 dark:from-blue-600 dark:to-indigo-700 text-white rounded-t-xl">
              <CardTitle className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center font-bold">
                  1
                </div>
                Encontre o Evento
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/40 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Search className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Busque o Evento Desejado</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                    Navegue pela página inicial ou use a barra de busca para encontrar o evento que você deseja participar.
                  </p>
                  <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
                      Use filtros por estado, cidade e categoria
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
                      Veja avaliações e comentários de outros participantes
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
                      Confira disponibilidade de ingressos
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Step 2 */}
          <Card className="border-none shadow-xl dark:bg-gray-800">
            <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-600 dark:from-green-600 dark:to-emerald-700 text-white rounded-t-xl">
              <CardTitle className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center font-bold">
                  2
                </div>
                Acesse os Detalhes do Evento
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-gray-600 dark:text-gray-400 mb-3">
                Clique no card do evento para ver todas as informações:
              </p>
              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
                  <span className="text-gray-700 dark:text-gray-300">Data, horário e localização</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
                  <span className="text-gray-700 dark:text-gray-300">Descrição completa do evento</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
                  <span className="text-gray-700 dark:text-gray-300">Informações do organizador</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
                  <span className="text-gray-700 dark:text-gray-300">Avaliações de participantes anteriores</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
                  <span className="text-gray-700 dark:text-gray-300">Preço e disponibilidade</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Step 3 */}
          <Card className="border-none shadow-xl dark:bg-gray-800">
            <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-600 dark:from-purple-600 dark:to-pink-700 text-white rounded-t-xl">
              <CardTitle className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center font-bold">
                  3
                </div>
                Selecione a Quantidade
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                No card lateral direito da página do evento:
              </p>
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg p-4 border-2 border-purple-200 dark:border-purple-800">
                <p className="text-sm font-semibold text-gray-900 dark:text-white mb-3">📋 Selecione quantos ingressos deseja:</p>
                <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                  <li className="flex items-center gap-2">
                    <span className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs">-</span>
                    Use os botões <strong>+ e -</strong> para ajustar a quantidade
                  </li>
                  <li className="flex items-center gap-2">
                    <Ticket className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    Cada ingresso terá seu próprio <strong>QR Code único</strong>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                    O valor total será calculado automaticamente
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Step 4 */}
          <Card className="border-none shadow-xl dark:bg-gray-800">
            <CardHeader className="bg-gradient-to-r from-orange-500 to-red-600 dark:from-orange-600 dark:to-red-700 text-white rounded-t-xl">
              <CardTitle className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center font-bold">
                  4
                </div>
                Finalize a Compra
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/40 rounded-lg flex items-center justify-center flex-shrink-0">
                    <CreditCard className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Clique em "Comprar Agora"</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                      Após clicar, a compra será processada instantaneamente e você receberá:
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
                        <span className="text-gray-700 dark:text-gray-300"><strong>Notificação</strong> no sistema com códigos dos ingressos</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
                        <span className="text-gray-700 dark:text-gray-300">Ingressos disponíveis em <strong>"Meus Ingressos"</strong></span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
                        <span className="text-gray-700 dark:text-gray-300"><strong>QR Codes únicos</strong> para cada ingresso</span>
                      </div>
                    </div>
                  </div>
                </div>

                <Alert className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
                  <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                  <AlertDescription className="text-green-900 dark:text-green-300 text-sm">
                    <strong>Pronto!</strong> Seus ingressos estão confirmados e você receberá uma notificação de confirmação instantaneamente.
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* FAQ */}
        <Card className="border-none shadow-xl mt-8 dark:bg-gray-800">
          <CardHeader>
            <CardTitle className="text-xl dark:text-white">Dúvidas Frequentes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">❓ Preciso ter uma conta para comprar?</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Sim, você precisa estar logado. Se não tiver conta, será redirecionado para criar uma.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">💳 Quais formas de pagamento são aceitas?</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">A compra é processada instantaneamente pelo sistema. Entre em contato com o suporte para mais detalhes sobre pagamento.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">🎫 Posso comprar múltiplos ingressos?</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Sim! Cada ingresso terá seu próprio QR Code único para validação na entrada do evento.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">📱 Como uso meu ingresso no dia do evento?</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Acesse "Meus Ingressos" e apresente o QR Code na entrada. Você pode ampliar para facilitar a leitura.</p>
            </div>
          </CardContent>
        </Card>

        {/* CTA */}
        <div className="mt-8 text-center space-y-4">
          <Link to={createPageUrl("Home")}>
            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 dark:from-blue-500 dark:to-indigo-500">
              <Search className="w-5 h-5 mr-2" />
              Explorar Eventos Agora
            </Button>
          </Link>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Ainda tem dúvidas? <Link to={createPageUrl("Support")} className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium">Entre em contato</Link>
          </p>
        </div>
      </div>
    </div>
  );
}