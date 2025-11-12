import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Cookie, Shield, BarChart3, Target, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const cookieTypes = [
  {
    icon: Shield,
    title: "Cookies Necessários",
    color: "blue",
    description: "Esses cookies são essenciais para o funcionamento do site e não podem ser desativados.",
    examples: [
      "Autenticação e segurança",
      "Preferências de idioma",
      "Carrinho de compras",
      "Sessão do usuário"
    ]
  },
  {
    icon: BarChart3,
    title: "Cookies de Análise",
    color: "green",
    description: "Ajudam-nos a entender como os visitantes interagem com o site, coletando informações de forma anônima.",
    examples: [
      "Páginas mais visitadas",
      "Tempo de permanência",
      "Taxa de rejeição",
      "Origem do tráfego"
    ]
  },
  {
    icon: Target,
    title: "Cookies de Marketing",
    color: "purple",
    description: "Usados para rastrear visitantes em sites e exibir anúncios relevantes e personalizados.",
    examples: [
      "Anúncios personalizados",
      "Remarketing",
      "Medição de campanhas",
      "Preferências de conteúdo"
    ]
  }
];

export default function PoliticaCookies() {
  const handleManageCookies = () => {
    localStorage.removeItem("cookieConsent");
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-2xl mb-6">
            <Cookie className="w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Política de Cookies
          </h1>
          <p className="text-xl text-blue-100">
            Última atualização: {new Date().toLocaleDateString('pt-BR')}
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Introduction */}
        <Card className="border-none shadow-lg mb-8">
          <CardContent className="p-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                  O que são cookies?
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Cookies são pequenos arquivos de texto que são armazenados no seu dispositivo quando você visita um site. Eles são amplamente utilizados para fazer os sites funcionarem de forma mais eficiente, bem como para fornecer informações aos proprietários do site.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  No TicketPass, utilizamos cookies para melhorar sua experiência, personalizar conteúdo, analisar o tráfego e fornecer recursos de mídia social. Você tem controle sobre quais cookies deseja aceitar.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cookie Types */}
        <div className="space-y-6 mb-8">
          <h2 className="text-3xl font-bold text-gray-900">
            Tipos de Cookies que Utilizamos
          </h2>

          {cookieTypes.map((type, index) => {
            const Icon = type.icon;
            return (
              <Card key={index} className="border-none shadow-lg">
                <CardHeader className={`bg-gradient-to-r from-${type.color}-50 to-white`}>
                  <CardTitle className="flex items-center gap-3">
                    <div className={`w-10 h-10 bg-${type.color}-100 rounded-lg flex items-center justify-center`}>
                      <Icon className={`w-5 h-5 text-${type.color}-600`} />
                    </div>
                    {type.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <p className="text-gray-700 mb-4">{type.description}</p>
                  <div>
                    <p className="text-sm font-semibold text-gray-900 mb-2">
                      Exemplos de uso:
                    </p>
                    <ul className="space-y-2">
                      {type.examples.map((example, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                          <div className={`w-1.5 h-1.5 bg-${type.color}-600 rounded-full`}></div>
                          {example}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Duration */}
        <Card className="border-none shadow-lg mb-8">
          <CardHeader>
            <CardTitle>Duração dos Cookies</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Cookies de Sessão</h3>
              <p className="text-gray-700 text-sm">
                São temporários e expiram quando você fecha o navegador. Usados principalmente para manter sua sessão ativa enquanto você navega no site.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Cookies Persistentes</h3>
              <p className="text-gray-700 text-sm">
                Permanecem no seu dispositivo por um período determinado (até 12 meses) e são ativados cada vez que você visita nosso site. Usados para lembrar suas preferências e melhorar sua experiência.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Control */}
        <Card className="border-none shadow-lg mb-8">
          <CardHeader>
            <CardTitle>Como Controlar os Cookies</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700">
              Você tem o direito de decidir se aceita ou rejeita cookies. Pode exercer suas preferências de cookies através de:
            </p>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-blue-600">1</span>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">Banner de Cookies</p>
                  <p className="text-sm text-gray-600">
                    Ao visitar nosso site pela primeira vez, você pode escolher suas preferências através do banner de cookies.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-blue-600">2</span>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">Configurações do Navegador</p>
                  <p className="text-sm text-gray-600">
                    A maioria dos navegadores permite que você recuse ou aceite cookies através das configurações.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-blue-600">3</span>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">Gerenciar Preferências</p>
                  <p className="text-sm text-gray-600 mb-2">
                    Você pode alterar suas preferências a qualquer momento clicando no botão abaixo.
                  </p>
                  <Button onClick={handleManageCookies} size="sm" className="bg-blue-600 hover:bg-blue-700">
                    <Cookie className="w-4 h-4 mr-2" />
                    Gerenciar Cookies
                  </Button>
                </div>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Third Party */}
        <Card className="border-none shadow-lg mb-8">
          <CardHeader>
            <CardTitle>Cookies de Terceiros</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-4">
              Além dos nossos próprios cookies, também podemos usar cookies de terceiros para:
            </p>
            <ul className="space-y-2">
              {[
                "Análise de tráfego (Google Analytics)",
                "Redes sociais (Facebook, Instagram)",
                "Processamento de pagamentos",
                "Suporte ao cliente"
              ].map((item, idx) => (
                <li key={idx} className="flex items-center gap-2 text-gray-700">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  {item}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Contact */}
        <Card className="border-none shadow-lg bg-gradient-to-br from-blue-50 to-white">
          <CardContent className="p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Dúvidas sobre nossa Política de Cookies?
            </h3>
            <p className="text-gray-700 mb-4">
              Se você tiver alguma dúvida sobre como usamos cookies, entre em contato conosco.
            </p>
            <div className="flex gap-3">
              <Link to={createPageUrl("Support")}>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Fale Conosco
                </Button>
              </Link>
              <Link to={createPageUrl("Home")}>
                <Button variant="outline">
                  Voltar ao Início
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}