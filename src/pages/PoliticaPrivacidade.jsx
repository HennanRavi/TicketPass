import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Shield, Eye, Lock, UserCheck, Database, Mail } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function PoliticaPrivacidade() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-white/20 rounded-xl mb-4">
            <Shield className="w-6 h-6" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            Política de Privacidade
          </h1>
          <p className="text-base text-blue-100">
            Última atualização: {new Date().toLocaleDateString('pt-BR')}
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Introduction */}
        <Card className="border-none shadow-lg mb-6">
          <CardContent className="p-6">
            <p className="text-sm text-gray-700 leading-relaxed mb-3">
              A TicketPass ("nós", "nosso" ou "nossa") está comprometida em proteger sua privacidade. Esta Política de Privacidade explica como coletamos, usamos, divulgamos e protegemos suas informações quando você usa nossa plataforma de venda de ingressos.
            </p>
            <p className="text-sm text-gray-700 leading-relaxed">
              Ao usar nossos serviços, você concorda com a coleta e uso de informações de acordo com esta política.
            </p>
          </CardContent>
        </Card>

        {/* Information Collection */}
        <Card className="border-none shadow-lg mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Database className="w-5 h-5 text-blue-600" />
              Informações que Coletamos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-2">1. Informações Pessoais</h3>
              <p className="text-sm text-gray-700 mb-2">
                Coletamos informações que você nos fornece diretamente, incluindo:
              </p>
              <ul className="space-y-1 ml-4">
                <li className="text-sm text-gray-700 flex items-start gap-2">
                  <span className="w-1 h-1 bg-blue-600 rounded-full mt-1.5"></span>
                  Nome completo e dados de contato (e-mail, telefone)
                </li>
                <li className="text-sm text-gray-700 flex items-start gap-2">
                  <span className="w-1 h-1 bg-blue-600 rounded-full mt-1.5"></span>
                  Informações de pagamento (processadas por terceiros seguros)
                </li>
                <li className="text-sm text-gray-700 flex items-start gap-2">
                  <span className="w-1 h-1 bg-blue-600 rounded-full mt-1.5"></span>
                  Dados de conta e preferências
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-2">2. Informações Automáticas</h3>
              <p className="text-sm text-gray-700 mb-2">
                Coletamos automaticamente certas informações quando você usa nossa plataforma:
              </p>
              <ul className="space-y-1 ml-4">
                <li className="text-sm text-gray-700 flex items-start gap-2">
                  <span className="w-1 h-1 bg-blue-600 rounded-full mt-1.5"></span>
                  Endereço IP e dados de localização
                </li>
                <li className="text-sm text-gray-700 flex items-start gap-2">
                  <span className="w-1 h-1 bg-blue-600 rounded-full mt-1.5"></span>
                  Tipo de dispositivo, sistema operacional e navegador
                </li>
                <li className="text-sm text-gray-700 flex items-start gap-2">
                  <span className="w-1 h-1 bg-blue-600 rounded-full mt-1.5"></span>
                  Páginas visitadas e tempo de navegação
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* How We Use Information */}
        <Card className="border-none shadow-lg mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Eye className="w-5 h-5 text-blue-600" />
              Como Usamos Suas Informações
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-700 mb-3">
              Utilizamos as informações coletadas para:
            </p>
            <ul className="space-y-2">
              {[
                "Processar transações e enviar confirmações de compra",
                "Fornecer suporte ao cliente e responder às suas solicitações",
                "Melhorar e personalizar sua experiência na plataforma",
                "Enviar notificações sobre eventos, atualizações e promoções",
                "Prevenir fraudes e garantir a segurança da plataforma",
                "Cumprir obrigações legais e regulatórias"
              ].map((item, idx) => (
                <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                  <span className="w-1 h-1 bg-blue-600 rounded-full mt-1.5 flex-shrink-0"></span>
                  {item}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Data Sharing */}
        <Card className="border-none shadow-lg mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <UserCheck className="w-5 h-5 text-blue-600" />
              Compartilhamento de Dados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-700 mb-3">
              Não vendemos suas informações pessoais. Podemos compartilhar seus dados apenas nas seguintes situações:
            </p>
            <ul className="space-y-2">
              {[
                "Com organizadores de eventos para processamento de ingressos",
                "Com processadores de pagamento para completar transações",
                "Com prestadores de serviços que nos auxiliam nas operações",
                "Quando exigido por lei ou para proteger direitos legais",
                "Em caso de fusão, aquisição ou venda de ativos"
              ].map((item, idx) => (
                <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                  <span className="w-1 h-1 bg-blue-600 rounded-full mt-1.5 flex-shrink-0"></span>
                  {item}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Data Security */}
        <Card className="border-none shadow-lg mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Lock className="w-5 h-5 text-blue-600" />
              Segurança dos Dados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-700 mb-3">
              Implementamos medidas de segurança técnicas e organizacionais para proteger suas informações:
            </p>
            <ul className="space-y-2">
              {[
                "Criptografia SSL/TLS para transmissão de dados",
                "Armazenamento seguro em servidores protegidos",
                "Acesso restrito a informações pessoais",
                "Monitoramento regular de vulnerabilidades",
                "Políticas de privacidade para funcionários e parceiros"
              ].map((item, idx) => (
                <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                  <span className="w-1 h-1 bg-blue-600 rounded-full mt-1.5 flex-shrink-0"></span>
                  {item}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Your Rights */}
        <Card className="border-none shadow-lg mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Seus Direitos (LGPD)</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-700 mb-3">
              De acordo com a Lei Geral de Proteção de Dados (LGPD), você tem direito a:
            </p>
            <ul className="space-y-2">
              {[
                "Confirmar a existência de tratamento de dados",
                "Acessar seus dados pessoais",
                "Corrigir dados incompletos, inexatos ou desatualizados",
                "Solicitar a anonimização, bloqueio ou eliminação de dados",
                "Revogar consentimento",
                "Solicitar portabilidade dos dados",
                "Obter informações sobre compartilhamento de dados"
              ].map((item, idx) => (
                <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                  <span className="w-1 h-1 bg-blue-600 rounded-full mt-1.5 flex-shrink-0"></span>
                  {item}
                </li>
              ))}
            </ul>
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
                  Dúvidas sobre Privacidade?
                </h3>
                <p className="text-sm text-gray-700 mb-3">
                  Se você tiver alguma dúvida sobre esta Política de Privacidade ou quiser exercer seus direitos, entre em contato conosco:
                </p>
                <div className="space-y-1 mb-4">
                  <p className="text-sm text-gray-700">
                    <strong>E-mail:</strong> privacidade@ticketpass.com
                  </p>
                  <p className="text-sm text-gray-700">
                    <strong>Telefone:</strong> (11) 1234-5678
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