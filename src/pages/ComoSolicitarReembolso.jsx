import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { ArrowLeft, RefreshCw, Mail, Phone, AlertTriangle, CheckCircle2, XCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function ComoSolicitarReembolso() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link to={createPageUrl("Support")}>
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar ao Suporte
          </Button>
        </Link>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-600 to-red-600 rounded-2xl mb-4 shadow-lg">
            <RefreshCw className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Como Solicitar Reembolso?
          </h1>
          <p className="text-lg text-gray-600">
            Entenda quando e como solicitar o reembolso dos seus ingressos
          </p>
        </div>

        {/* Important Alert */}
        <Alert className="mb-8 bg-orange-50 border-orange-300">
          <AlertTriangle className="h-5 w-5 text-orange-600" />
          <AlertDescription className="text-orange-900">
            <strong>Importante:</strong> Leia atentamente nossa <Link to={createPageUrl("PoliticaReembolso")} className="text-orange-700 underline font-semibold">Política de Reembolso</Link> completa antes de fazer a solicitação.
          </AlertDescription>
        </Alert>

        {/* Eligible Cases */}
        <Card className="border-none shadow-xl mb-6">
          <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-t-xl">
            <CardTitle className="flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6" />
              Quando Posso Solicitar Reembolso?
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <p className="text-gray-600 mb-4">Você tem direito ao reembolso nas seguintes situações:</p>
            
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-green-900">Evento Cancelado pelo Organizador</h4>
                  <p className="text-sm text-green-800">Reembolso total garantido em até 30 dias</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-green-900">Cancelamento Antecipado</h4>
                  <p className="text-sm text-green-800">Até 7 dias antes do evento (desconto de 10% de taxa)</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-green-900">Problemas Técnicos Graves</h4>
                  <p className="text-sm text-green-800">Falhas que impossibilitem o acesso ao evento</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-blue-900">Mudanças Significativas</h4>
                  <p className="text-sm text-blue-800">Data, local ou características fundamentais alteradas</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Non-Eligible Cases */}
        <Card className="border-none shadow-xl mb-6">
          <CardHeader className="bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-t-xl">
            <CardTitle className="flex items-center gap-3">
              <XCircle className="w-6 h-6" />
              Quando NÃO é Possível Reembolso?
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg border border-red-200">
                <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-red-900">Desistência do Comprador</h4>
                  <p className="text-sm text-red-800">Mudança de ideia ou impossibilidade de comparecimento</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg border border-red-200">
                <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-red-900">Ingresso Já Utilizado</h4>
                  <p className="text-sm text-red-800">QR Code já validado na entrada do evento</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg border border-red-200">
                <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-red-900">Solicitação Fora do Prazo</h4>
                  <p className="text-sm text-red-800">Menos de 7 dias antes do evento (sem motivo justificado)</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg border border-red-200">
                <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-red-900">Após o Evento</h4>
                  <p className="text-sm text-red-800">Solicitações feitas depois da data do evento</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* How to Request */}
        <Card className="border-none shadow-xl mb-6">
          <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-t-xl">
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
                  <h4 className="font-semibold text-gray-900 mb-2">Entre em Contato por Email</h4>
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Mail className="w-5 h-5 text-blue-600" />
                      <a href="mailto:consult.dev.hr@gmail.com" className="text-blue-700 font-semibold hover:text-blue-800">
                        consult.dev.hr@gmail.com
                      </a>
                    </div>
                    <p className="text-sm text-blue-800">
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
                  <h4 className="font-semibold text-gray-900 mb-2">Inclua as Seguintes Informações</h4>
                  <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                    <ul className="space-y-2 text-sm text-purple-900">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-purple-600" />
                        <strong>Nome completo</strong> do comprador
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-purple-600" />
                        <strong>Email</strong> usado na compra
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-purple-600" />
                        <strong>Nome do evento</strong> e <strong>data</strong>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-purple-600" />
                        <strong>Código(s) do(s) ingresso(s)</strong>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-purple-600" />
                        <strong>Motivo detalhado</strong> da solicitação
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-purple-600" />
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
                  <h4 className="font-semibold text-gray-900 mb-2">Aguarde a Análise</h4>
                  <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="w-5 h-5 text-green-600" />
                      <p className="text-sm text-green-900">
                        <strong>Prazo de resposta:</strong> até 5 dias úteis
                      </p>
                    </div>
                    <p className="text-sm text-green-800">
                      Nossa equipe analisará seu caso e enviará a resposta por email
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Processing Time */}
        <Card className="border-none shadow-xl mb-6">
          <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-t-xl">
            <CardTitle className="flex items-center gap-3">
              <Clock className="w-6 h-6" />
              Prazo de Reembolso
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-3">
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border-2 border-purple-200">
                <h4 className="font-semibold text-purple-900 mb-3">⏰ Tempo de Processamento:</h4>
                <ul className="space-y-2 text-sm text-purple-800">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-purple-600" />
                    <strong>Análise da solicitação:</strong> até 5 dias úteis
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-purple-600" />
                    <strong>Processamento do reembolso:</strong> até 30 dias úteis
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-purple-600" />
                    <strong>Crédito na conta:</strong> conforme meio de pagamento original
                  </li>
                </ul>
              </div>

              <Alert className="bg-blue-50 border-blue-200">
                <AlertTriangle className="h-5 w-5 text-blue-600" />
                <AlertDescription className="text-blue-900 text-sm">
                  O prazo pode variar dependendo da instituição financeira e forma de pagamento utilizada.
                </AlertDescription>
              </Alert>
            </div>
          </CardContent>
        </Card>

        {/* Contact Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Email Card */}
          <Card className="border-none shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Mail className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-bold text-lg text-gray-900">Email</h3>
              </div>
              <p className="text-gray-600 text-sm mb-3">
                Envie sua solicitação formal de reembolso
              </p>
              <a
                href="mailto:consult.dev.hr@gmail.com"
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                consult.dev.hr@gmail.com
              </a>
            </CardContent>
          </Card>

          {/* WhatsApp Card */}
          <Card className="border-none shadow-lg bg-gradient-to-br from-green-500 to-emerald-600 text-white">
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
        <Card className="border-none shadow-xl">
          <CardHeader>
            <CardTitle className="text-xl">Dúvidas Frequentes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">❓ Posso transferir meu ingresso ao invés de pedir reembolso?</h3>
              <p className="text-sm text-gray-600">Entre em contato conosco para verificar essa possibilidade. Pode ser uma alternativa mais rápida.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">💳 O reembolso volta para qual conta?</h3>
              <p className="text-sm text-gray-600">O valor será estornado para o mesmo meio de pagamento usado na compra original.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">⏰ Comprei hoje, posso cancelar?</h3>
              <p className="text-sm text-gray-600">Sim! Se o evento for em mais de 7 dias, você pode solicitar reembolso (com desconto de 10% de taxa administrativa).</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">📄 Preciso de algum documento especial?</h3>
              <p className="text-sm text-gray-600">Não necessariamente. Mas se tiver comprovantes que justifiquem seu pedido (atestado médico, etc), inclua no email.</p>
            </div>
          </CardContent>
        </Card>

        {/* CTA */}
        <div className="mt-8 text-center space-y-4">
          <Link to={createPageUrl("PoliticaReembolso")}>
            <Button size="lg" variant="outline" className="border-orange-300 text-orange-700 hover:bg-orange-50">
              <RefreshCw className="w-5 h-5 mr-2" />
              Ver Política Completa
            </Button>
          </Link>
          <p className="text-sm text-gray-500">
            Ainda tem dúvidas? <Link to={createPageUrl("Support")} className="text-orange-600 hover:text-orange-700 font-medium">Entre em contato</Link>
          </p>
        </div>
      </div>
    </div>
  );
}