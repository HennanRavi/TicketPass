import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { RefreshCw, CheckCircle, XCircle, Clock, Mail, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function PoliticaReembolso() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-white/20 rounded-xl mb-4">
            <RefreshCw className="w-6 h-6" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            Política de Reembolso
          </h1>
          <p className="text-base text-blue-100">
            Última atualização: {new Date().toLocaleDateString('pt-BR')}
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Introduction */}
        <Alert className="mb-6 bg-blue-50 border-blue-200">
          <AlertCircle className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-sm text-blue-900">
            Esta política se aplica a compras feitas através da plataforma TicketPass. 
            Os organizadores de eventos podem ter políticas adicionais específicas.
          </AlertDescription>
        </Alert>

        {/* General Policy */}
        <Card className="border-none shadow-lg mb-6">
          <CardContent className="p-6">
            <h2 className="text-base font-bold text-gray-900 mb-3">Política Geral</h2>
            <p className="text-sm text-gray-700 leading-relaxed mb-3">
              Na TicketPass, entendemos que planos podem mudar. Por isso, oferecemos opções de reembolso 
              dependendo das circunstâncias e do tempo até o evento.
            </p>
            <p className="text-sm text-gray-700 leading-relaxed">
              É importante ler atentamente esta política antes de realizar uma compra, pois as condições 
              de reembolso variam de acordo com o tipo de evento e a data da solicitação.
            </p>
          </CardContent>
        </Card>

        {/* Eligible for Refund */}
        <Card className="border-none shadow-lg mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <CheckCircle className="w-5 h-5 text-green-600" />
              Quando Você Pode Solicitar Reembolso
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-2">1. Evento Cancelado</h3>
              <p className="text-sm text-gray-700">
                Se o evento for cancelado pelo organizador, você tem direito a reembolso total, 
                incluindo taxas de serviço. O reembolso será processado automaticamente em até 10 dias úteis.
              </p>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-2">2. Cancelamento Antecipado (7+ dias)</h3>
              <p className="text-sm text-gray-700">
                Solicitações feitas com 7 ou mais dias de antecedência do evento podem receber 
                reembolso de 90% do valor do ingresso. Taxa de serviço não é reembolsável.
              </p>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-2">3. Cancelamento com 3-6 dias</h3>
              <p className="text-sm text-gray-700">
                Solicitações feitas entre 3 e 6 dias antes do evento podem receber reembolso de 50% 
                do valor do ingresso, a critério do organizador.
              </p>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-2">4. Problemas Técnicos</h3>
              <p className="text-sm text-gray-700">
                Se você teve problemas técnicos que impediram o acesso ao evento (online) ou 
                recebeu ingressos inválidos, entre em contato imediatamente para resolução.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Not Eligible */}
        <Card className="border-none shadow-lg mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <XCircle className="w-5 h-5 text-red-600" />
              Quando NÃO é Possível Reembolso
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {[
                "Solicitações feitas com menos de 48 horas do evento",
                "Eventos já realizados",
                "Mudança de planos pessoais",
                "Ingressos já utilizados ou validados",
                "Eventos remarcados (exceto se o novo horário for incompatível)",
                "Insatisfação com o evento após comparecimento",
                "Perda ou roubo de ingressos (verifique seguro de ingresso)"
              ].map((item, idx) => (
                <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                  <span className="w-1 h-1 bg-red-600 rounded-full mt-1.5 flex-shrink-0"></span>
                  {item}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* How to Request */}
        <Card className="border-none shadow-lg mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Clock className="w-5 h-5 text-blue-600" />
              Como Solicitar Reembolso
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-blue-600">1</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">Acesse sua Conta</p>
                  <p className="text-sm text-gray-600">
                    Faça login e vá para "Meus Ingressos"
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-blue-600">2</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">Entre em Contato</p>
                  <p className="text-sm text-gray-600">
                    Use o formulário de suporte ou envie um e-mail para reembolso@ticketpass.com
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-blue-600">3</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">Forneça Informações</p>
                  <p className="text-sm text-gray-600">
                    Inclua número do pedido, motivo da solicitação e dados de contato
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-blue-600">4</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">Aguarde Análise</p>
                  <p className="text-sm text-gray-600">
                    Analisaremos em até 3 dias úteis e notificaremos sobre a decisão
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Processing Time */}
        <Card className="border-none shadow-lg mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Prazo de Processamento</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-700 mb-3">
              Uma vez aprovado o reembolso:
            </p>
            <ul className="space-y-2">
              <li className="text-sm text-gray-700 flex items-start gap-2">
                <span className="w-1 h-1 bg-blue-600 rounded-full mt-1.5"></span>
                <span><strong>Cartão de Crédito:</strong> 5 a 10 dias úteis (depende do banco)</span>
              </li>
              <li className="text-sm text-gray-700 flex items-start gap-2">
                <span className="w-1 h-1 bg-blue-600 rounded-full mt-1.5"></span>
                <span><strong>Cartão de Débito:</strong> 3 a 7 dias úteis</span>
              </li>
              <li className="text-sm text-gray-700 flex items-start gap-2">
                <span className="w-1 h-1 bg-blue-600 rounded-full mt-1.5"></span>
                <span><strong>PIX:</strong> até 2 dias úteis</span>
              </li>
            </ul>
            <p className="text-sm text-gray-600 mt-3">
              O reembolso será feito no mesmo método de pagamento utilizado na compra.
            </p>
          </CardContent>
        </Card>

        {/* Special Cases */}
        <Card className="border-none shadow-lg mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Casos Especiais</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-1">Eventos Remarcados</h3>
                <p className="text-sm text-gray-700">
                  Se o evento for remarcado, seus ingressos continuam válidos para a nova data. 
                  Reembolso só é possível se você não puder comparecer na nova data e solicitar com antecedência.
                </p>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-1">Emergências</h3>
                <p className="text-sm text-gray-700">
                  Em casos de emergência médica ou familiar, entre em contato conosco. 
                  Analisaremos cada caso individualmente mediante comprovação.
                </p>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-1">Seguro de Ingresso</h3>
                <p className="text-sm text-gray-700">
                  Alguns eventos oferecem seguro opcional que garante reembolso em diversas situações. 
                  Verifique durante a compra se esta opção está disponível.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact */}
        <Card className="border-none shadow-lg bg-gradient-to-br from-blue-50 to-white">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Mail className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-base font-bold text-gray-900 mb-2">
                  Precisa de Ajuda?
                </h3>
                <p className="text-sm text-gray-700 mb-3">
                  Nossa equipe está pronta para ajudar com sua solicitação de reembolso:
                </p>
                <div className="space-y-1 mb-4">
                  <p className="text-sm text-gray-700">
                    <strong>E-mail:</strong> reembolso@ticketpass.com
                  </p>
                  <p className="text-sm text-gray-700">
                    <strong>Telefone:</strong> (11) 1234-5678
                  </p>
                  <p className="text-sm text-gray-700">
                    <strong>Horário:</strong> Seg - Sex: 9h às 18h
                  </p>
                </div>
                <div className="flex gap-2">
                  <Link to={createPageUrl("Support")}>
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                      Fale Conosco
                    </Button>
                  </Link>
                  <Link to={createPageUrl("Home")}>
                    <Button size="sm" variant="outline">
                      Voltar ao Início
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}