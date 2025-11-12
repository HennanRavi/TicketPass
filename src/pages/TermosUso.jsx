import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { FileText, CheckCircle, XCircle, AlertTriangle, Mail } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function TermosUso() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-white/20 rounded-xl mb-4">
            <FileText className="w-6 h-6" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            Termos de Uso
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
              Bem-vindo à TicketPass. Estes Termos de Uso ("Termos") regem o uso de nossa plataforma de venda e gerenciamento de ingressos para eventos. Ao acessar ou usar nossos serviços, você concorda em cumprir estes Termos.
            </p>
            <p className="text-sm text-gray-700 leading-relaxed">
              Se você não concordar com alguma parte destes Termos, não deve usar nossa plataforma.
            </p>
          </CardContent>
        </Card>

        {/* Account Terms */}
        <Card className="border-none shadow-lg mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <CheckCircle className="w-5 h-5 text-green-600" />
              Conta de Usuário
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-gray-700">
              Para usar determinados recursos da plataforma, você deve criar uma conta:
            </p>
            <ul className="space-y-2">
              {[
                "Você deve ter pelo menos 18 anos para criar uma conta",
                "As informações fornecidas devem ser verdadeiras e atualizadas",
                "Você é responsável por manter a segurança de sua conta",
                "Não compartilhe suas credenciais de acesso",
                "Notifique-nos imediatamente sobre qualquer uso não autorizado"
              ].map((item, idx) => (
                <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                  <span className="w-1 h-1 bg-green-600 rounded-full mt-1.5 flex-shrink-0"></span>
                  {item}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Purchase Terms */}
        <Card className="border-none shadow-lg mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <CheckCircle className="w-5 h-5 text-green-600" />
              Compra de Ingressos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-gray-700 mb-2">
              Ao comprar ingressos através da plataforma:
            </p>
            <ul className="space-y-2">
              {[
                "Os preços são definidos pelos organizadores dos eventos",
                "Todas as vendas estão sujeitas a disponibilidade",
                "Você receberá confirmação por e-mail após a compra",
                "Os ingressos são pessoais e intransferíveis, salvo acordo contrário",
                "É proibido revender ingressos por valores acima do nominal",
                "A TicketPass não se responsabiliza por eventos cancelados"
              ].map((item, idx) => (
                <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                  <span className="w-1 h-1 bg-green-600 rounded-full mt-1.5 flex-shrink-0"></span>
                  {item}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Organizer Terms */}
        <Card className="border-none shadow-lg mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <CheckCircle className="w-5 h-5 text-green-600" />
              Organizadores de Eventos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-gray-700 mb-2">
              Se você é um organizador de eventos:
            </p>
            <ul className="space-y-2">
              {[
                "Você é responsável pela precisão das informações do evento",
                "Deve cumprir todas as leis e regulamentações aplicáveis",
                "É responsável pela qualidade e realização do evento",
                "A TicketPass cobra uma taxa de serviço sobre cada venda",
                "Você deve comunicar adequadamente cancelamentos ou alterações",
                "Não pode discriminar participantes de forma ilegal"
              ].map((item, idx) => (
                <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                  <span className="w-1 h-1 bg-green-600 rounded-full mt-1.5 flex-shrink-0"></span>
                  {item}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Prohibited Uses */}
        <Card className="border-none shadow-lg mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <XCircle className="w-5 h-5 text-red-600" />
              Usos Proibidos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-gray-700 mb-2">
              Você concorda em NÃO:
            </p>
            <ul className="space-y-2">
              {[
                "Usar a plataforma para atividades ilegais ou fraudulentas",
                "Violar direitos de propriedade intelectual",
                "Interferir no funcionamento da plataforma",
                "Tentar acessar contas de outros usuários",
                "Usar bots ou scripts automatizados para comprar ingressos",
                "Publicar conteúdo ofensivo, difamatório ou inadequado",
                "Coletar dados de outros usuários sem consentimento"
              ].map((item, idx) => (
                <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                  <span className="w-1 h-1 bg-red-600 rounded-full mt-1.5 flex-shrink-0"></span>
                  {item}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Intellectual Property */}
        <Card className="border-none shadow-lg mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Propriedade Intelectual</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-700 mb-3">
              Todo o conteúdo da plataforma TicketPass, incluindo textos, gráficos, logos, ícones, imagens, código e software, é de propriedade da TicketPass ou de seus licenciadores e está protegido por leis de direitos autorais.
            </p>
            <p className="text-sm text-gray-700">
              Você não pode copiar, modificar, distribuir ou criar trabalhos derivados sem permissão prévia por escrito.
            </p>
          </CardContent>
        </Card>

        {/* Limitation of Liability */}
        <Card className="border-none shadow-lg mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
              Limitação de Responsabilidade
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-700 mb-3">
              A TicketPass atua como intermediária entre organizadores e compradores:
            </p>
            <ul className="space-y-2">
              {[
                "Não somos responsáveis pela qualidade dos eventos",
                "Não garantimos que os eventos ocorrerão conforme programado",
                "Não nos responsabilizamos por danos indiretos ou consequenciais",
                "Nossa responsabilidade está limitada ao valor pago pelo ingresso",
                "Não garantimos que a plataforma estará sempre disponível",
                "Não somos responsáveis por perdas de dados ou lucros cessantes"
              ].map((item, idx) => (
                <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                  <span className="w-1 h-1 bg-yellow-600 rounded-full mt-1.5 flex-shrink-0"></span>
                  {item}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Changes to Terms */}
        <Card className="border-none shadow-lg mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Alterações nos Termos</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-700 mb-2">
              Reservamo-nos o direito de modificar estes Termos a qualquer momento. Mudanças significativas serão comunicadas através de:
            </p>
            <ul className="space-y-1 mb-3">
              <li className="text-sm text-gray-700 flex items-start gap-2">
                <span className="w-1 h-1 bg-blue-600 rounded-full mt-1.5"></span>
                Notificação por e-mail
              </li>
              <li className="text-sm text-gray-700 flex items-start gap-2">
                <span className="w-1 h-1 bg-blue-600 rounded-full mt-1.5"></span>
                Aviso na plataforma
              </li>
            </ul>
            <p className="text-sm text-gray-700">
              O uso continuado da plataforma após as alterações constitui aceitação dos novos Termos.
            </p>
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
                  Dúvidas sobre os Termos?
                </h3>
                <p className="text-sm text-gray-700 mb-3">
                  Se você tiver alguma dúvida sobre estes Termos de Uso, entre em contato:
                </p>
                <div className="space-y-1 mb-4">
                  <p className="text-sm text-gray-700">
                    <strong>E-mail:</strong> legal@ticketpass.com
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