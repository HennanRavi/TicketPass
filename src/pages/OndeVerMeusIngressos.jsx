import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { ArrowLeft, Ticket, QrCode, Download, Smartphone, AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function OndeVerMeusIngressos() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-950 dark:via-gray-900 dark:to-green-950 py-8">
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
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-600 to-emerald-600 dark:from-green-500 dark:to-emerald-500 rounded-2xl mb-4 shadow-lg">
            <Ticket className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Onde Vejo Meus Ingressos?
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Acesse e gerencie todos os seus ingressos em um só lugar
          </p>
        </div>

        {/* Quick Access */}
        <Alert className="mb-8 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
          <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
          <AlertDescription className="text-green-900 dark:text-green-300">
            <strong>Acesso Rápido:</strong> Clique no menu superior em <strong>"Meus Ingressos"</strong> para ver todos os seus ingressos comprados!
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
                Acesse "Meus Ingressos"
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-gray-600 dark:text-gray-400 mb-4">Existem <strong>3 formas</strong> de acessar seus ingressos:</p>
              
              <div className="space-y-4">
                {/* Option A */}
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                  <h4 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">📱 Opção A - Menu Superior</h4>
                  <p className="text-sm text-blue-800 dark:text-blue-400">
                    No menu de navegação superior, clique em <strong>"Meus Ingressos"</strong>
                  </p>
                </div>

                {/* Option B */}
                <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
                  <h4 className="font-semibold text-purple-900 dark:text-purple-300 mb-2">👤 Opção B - Menu do Perfil</h4>
                  <p className="text-sm text-purple-800 dark:text-purple-400 mb-2">
                    Clique na sua foto de perfil (canto superior direito) e selecione <strong>"Meus Ingressos"</strong>
                  </p>
                </div>

                {/* Option C */}
                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
                  <h4 className="font-semibold text-green-900 dark:text-green-300 mb-2">📲 Opção C - Menu Mobile</h4>
                  <p className="text-sm text-green-800 dark:text-green-400">
                    No celular, abra o menu hambúrguer (☰) e toque em <strong>"Meus Ingressos"</strong>
                  </p>
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
                Visualize Seus Ingressos
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Na página "Meus Ingressos" você encontrará:
              </p>
              
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-900/40 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Ticket className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Abas de Organização</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      <strong>Ingressos Ativos:</strong> Eventos futuros que você vai participar<br/>
                      <strong>Ingressos Utilizados:</strong> Histórico de eventos passados
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/40 rounded-lg flex items-center justify-center flex-shrink-0">
                    <QrCode className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Cards dos Ingressos</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Cada card mostra: título do evento, data, local, quantidade e o QR Code para entrada
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/40 rounded-lg flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Estatísticas</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Total de ingressos, ingressos ativos e utilizados em cards no topo
                    </p>
                  </div>
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
                Use o QR Code no Evento
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/40 rounded-lg flex items-center justify-center flex-shrink-0">
                    <QrCode className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Como Usar no Dia do Evento</h3>
                    <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
                        Abra a página "Meus Ingressos"
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
                        Localize o ingresso do evento
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
                        Clique em <strong>"Ver QR Code em Tela Cheia"</strong>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
                        Apresente o QR Code na entrada do evento
                      </li>
                    </ul>
                  </div>
                </div>

                <Alert className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                  <Smartphone className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  <AlertDescription className="text-blue-900 dark:text-blue-300 text-sm">
                    <strong>Dica:</strong> Você pode aumentar o brilho da tela para facilitar a leitura do QR Code!
                  </AlertDescription>
                </Alert>

                <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg p-4 border-2 border-purple-200 dark:border-purple-800">
                  <h4 className="font-semibold text-purple-900 dark:text-purple-300 mb-3">🔐 Recursos Disponíveis:</h4>
                  <ul className="space-y-2 text-sm text-purple-800 dark:text-purple-400">
                    <li className="flex items-center gap-2">
                      <Download className="w-4 h-4" />
                      <strong>Baixar QR Code:</strong> Salve como imagem no seu celular
                    </li>
                    <li className="flex items-center gap-2">
                      <QrCode className="w-4 h-4" />
                      <strong>Tela Cheia:</strong> Amplie o QR Code para melhor visualização
                    </li>
                    <li className="flex items-center gap-2">
                      <Ticket className="w-4 h-4" />
                      <strong>Código Oculto:</strong> Por segurança, o código do ingresso fica parcialmente oculto
                    </li>
                  </ul>
                </div>
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
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">❓ Meus ingressos não aparecem, o que fazer?</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Verifique se está logado com a mesma conta que usou para comprar. Se o problema persistir, entre em contato com o suporte.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">📱 Posso acessar offline no dia do evento?</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Recomendamos baixar o QR Code antes do evento. Você pode salvá-lo como imagem usando o botão "Baixar QR Code".</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">👥 Comprei vários ingressos, cada um tem seu QR Code?</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Sim! Cada ingresso tem um QR Code único e individual, mesmo que tenham sido comprados juntos.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">🔒 É seguro usar o QR Code?</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Sim, muito seguro! Cada QR Code é único e vinculado ao seu CPF/email. Não compartilhe seu QR Code com outras pessoas.</p>
            </div>
          </CardContent>
        </Card>

        {/* CTA */}
        <div className="mt-8 text-center space-y-4">
          <Link to={createPageUrl("MyTickets")}>
            <Button size="lg" className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 dark:from-green-500 dark:to-emerald-500">
              <Ticket className="w-5 h-5 mr-2" />
              Acessar Meus Ingressos
            </Button>
          </Link>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Ainda tem dúvidas? <Link to={createPageUrl("Support")} className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 font-medium">Entre em contato</Link>
          </p>
        </div>
      </div>
    </div>
  );
}