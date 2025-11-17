import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { ArrowLeft, RefreshCw, Mail, Phone, AlertTriangle, CheckCircle2, XCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function ComoSolicitarReembolso() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 dark:from-gray-950 dark:via-gray-900 dark:to-orange-950 py-8">
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
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-600 to-red-600 dark:from-orange-500 dark:to-red-500 rounded-2xl mb-4 shadow-lg">
            <RefreshCw className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Como Solicitar Reembolso?
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Entenda quando e como solicitar o reembolso dos seus ingressos
          </p>
        </div>

        {/* Important Alert */}
        <Alert className="mb-8 bg-orange-50 dark:bg-orange-900/20 border-orange-300 dark:border-orange-800">
          <AlertTriangle className="h-5 w-5 text-orange-600 dark:text-orange-400" />
          <AlertDescription className="text-orange-900 dark:text-orange-300">
            <strong>Importante:</strong> Leia atentamente nossa <Link to={createPageUrl("PoliticaReembolso")} className="text-orange-700 dark:text-orange-400 underline font-semibold">Política de Reembolso</Link> completa antes de fazer a solicitação.
          </AlertDescription>
        </Alert>

        {/* Eligible Cases */}
        <Card className="border-none shadow-xl mb-6 dark:bg-gray-800">
          <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-600 dark:from-green-600 dark:to-emerald-700 text-white rounded-t-xl">
            <CardTitle className="flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6" />
              Quando Posso Solicitar Reembolso?
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <p className="text-gray-600 dark:text-gray-400 mb-4">Você tem direito ao reembolso nas seguintes situações:</p>
            
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-green-900 dark:text-green-300">Evento Cancelado pelo Organizador</h4>
                  <p className="text-sm text-green-800 dark:text-green-400">Reembolso total garantido em até 30 dias</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-green-900 dark:text-green-300">Cancelamento Antecipado</h4>
                  <p className="text-sm text-green-800 dark:text-green-400">Até 7 dias antes do evento (desconto de 10% de taxa)</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-green-900 dark:text-green-300">Problemas Técnicos Graves</h4>
                  <p className="text-sm text-green-800 dark:text-green-400">Falhas que impossibilitem o acesso ao evento</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <CheckCircle2 className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-blue-900 dark:text-blue-300">Mudanças Significativas</h4>
                  <p className="text-sm text-blue-800 dark:text-blue-400">Data, local ou características fundamentais alteradas</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Non-Eligible Cases */}
        <Card className="border-none shadow-xl mb-6 dark:bg-gray-800">
          <CardHeader className="bg-gradient-to-r from-red-500 to-rose-600 dark:from-red-600 dark:to-rose-700 text-white rounded-t-xl">
            <CardTitle className="flex items-center gap-3">
              <XCircle className="w-6 h-6" />
              Quando NÃO é Possível Reembolso?
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                <XCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-red-900 dark:text-red-300">Desistência do Comprador</h4>
                  <p className="text-sm text-red-800 dark:text-red-400">Mudança de ideia ou impossibilidade de comparecimento</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                <XCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-red-900 dark:text-red-300">Ingresso Já Utilizado</h4>
                  <p className="text-sm text-red-800 dark:text-red-400">QR Code já validado na entrada do evento</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                <XCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-red-900 dark:text-red-300">Solicitação Fora do Prazo</h4>
                  <p className="text-sm text-red-800 dark:text-red-400">Menos de 7 dias antes do evento (sem motivo justificado)</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                <XCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-red-900 dark:text-red-300">Após o Evento</h4>
                  <p className="text-sm text-red-800 dark:text-red-400">Solicitações feitas depois da data do evento</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* How to Request */}
        <Card className="border-none shadow-xl mb-6 dark:bg-gray-800">
          <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-600 dark:from-blue-600 dark:to-indigo-700 text-white rounded-t-xl">
            <CardTitle className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                📝
              </div>
              Como Solicitar o Reembolso?
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {/* Step 1 */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                  1
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Entre em Contato por Email</h4>
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                    <div className="flex items-center gap-2 mb-2">
                      <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      <a href="mailto:consult.dev.hr@gmail.com" className="text-blue-700 dark:text-blue-400 font-semibold hover:text-blue-800 dark:hover:text-blue-300">
                        consult.dev.hr@gmail.com
                      </a>
                    </div>
                    <p className="text-sm text-blue-800 dark:text-blue-400">
                      Envie um email com o assunto: <strong>"Solicitação de Reembolso"</strong>
                    </p>
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-purple-500 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                  2
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Inclua as Seguintes Informações</h4>
                  <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
                    <ul className="space-y-2 text-sm text-purple-900 dark:text-purple-300">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                        <strong>Nome completo</strong> do comprador
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                        <strong>Email</strong> usado na compra
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                        <strong>Nome do evento</strong> e <strong>data</strong>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                        <strong>Código(s) do(s) ingresso(s)</strong>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                        <strong>Motivo detalhado</strong> da solicitação
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                        <strong>Comprovantes</strong> (se aplicável)
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-green-500 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                  3
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Aguarde a Análise</h4>
                  <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="w-5 h-5 text-green-600 dark:text-green-400" />
                      <p className="text-sm text-green-900 dark:text-green-300">
                        <strong>Prazo de resposta:</strong> até 5 dias úteis
                      </p>
                    </div>
                    <p className="text-sm text-green-800 dark:text-green-400">
                      Nossa equipe analisará seu caso e enviará a resposta por email
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Processing Time */}
        <Card className="border-none shadow-xl mb-6 dark:bg-gray-800">
          <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-600 dark:from-purple-600 dark:to-pink-700 text-white rounded-t-xl">
            <CardTitle className="flex items-center gap-3">
              <Clock className="w-6 h-6" />
              Prazo de Reembolso
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-3">
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg p-4 border-2 border-purple-200 dark:border-purple-800">
                <h4 className="font-semibold text-purple-900 dark:text-purple-300 mb-3">⏰ Tempo de Processamento:</h4>
                <ul className="space-y-2 text-sm text-purple-800 dark:text-purple-400">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    <strong>Análise da solicitação:</strong> até 5 dias úteis
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    <strong>Processamento do reembolso:</strong> até 30 dias úteis
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    <strong>Crédito na conta:</strong> conforme meio de pagamento original
                  </li>
                </ul>
              </div>

              <Alert className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                <AlertTriangle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <AlertDescription className="text-blue-900 dark:text-blue-300 text-sm">
                  O prazo pode variar dependendo da instituição financeira e forma de pagamento utilizada.
                </AlertDescription>
              </Alert>
            </div>
          </CardContent>
        </Card>

        {/* Contact Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Email Card */}
          <Card className="border-none shadow-lg dark:bg-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/40 rounded-full flex items-center justify-center">
                  <Mail className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="font-bold text-lg text-gray-900 dark:text-white">Email</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                Envie sua solicitação formal de reembolso
              </p>
              <a
                href="mailto:consult.dev.hr@gmail.com"
                className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
              >
                consult.dev.hr@gmail.com
              </a>
            </CardContent>
          </Card>

          {/* WhatsApp Card */}
          <Card className="border-none shadow-lg bg-gradient-to-br from-green-500 to-emerald-600 dark:from-green-600 dark:to-emerald-700 text-white">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <Phone className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-xl">WhatsApp</h3>
              </div>
              <p className="text-green-50 text-sm mb-3">
                Tire dúvidas antes de solicitar
              </p>
              <a
                href="https://wa.me/5587991675203"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="secondary" size="sm" className="w-full bg-white text-green-600 hover:bg-green-50">
                  💬 Falar no WhatsApp
                </Button>
              </a>
            </CardContent>
          </Card>
        </div>

        {/* FAQ */}
        <Card className="border-none shadow-xl dark:bg-gray-800">
          <CardHeader>
            <CardTitle className="text-xl dark:text-white">Dúvidas Frequentes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">❓ Posso transferir meu ingresso ao invés de pedir reembolso?</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Entre em contato conosco para verificar essa possibilidade. Pode ser uma alternativa mais rápida.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">💳 O reembolso volta para qual conta?</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">O valor será estornado para o mesmo meio de pagamento usado na compra original.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">⏰ Comprei hoje, posso cancelar?</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Sim! Se o evento for em mais de 7 dias, você pode solicitar reembolso (com desconto de 10% de taxa administrativa).</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">📄 Preciso de algum documento especial?</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Não necessariamente. Mas se tiver comprovantes que justifiquem seu pedido (atestado médico, etc), inclua no email.</p>
            </div>
          </CardContent>
        </Card>

        {/* CTA */}
        <div className="mt-8 text-center space-y-4">
          <Link to={createPageUrl("PoliticaReembolso")}>
            <Button size="lg" variant="outline" className="border-orange-300 dark:border-orange-700 text-orange-700 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/20">
              <RefreshCw className="w-5 h-5 mr-2" />
              Ver Política Completa
            </Button>
          </Link>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Ainda tem dúvidas? <Link to={createPageUrl("Support")} className="text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 font-medium">Entre em contato</Link>
          </p>
        </div>
      </div>
    </div>
  );
}