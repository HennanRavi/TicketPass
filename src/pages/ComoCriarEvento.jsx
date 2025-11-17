
import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { ArrowLeft, Plus, Upload, Calendar, MapPin, Users, DollarSign, CheckCircle2, AlertCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function ComoCriarEvento() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-purple-950 py-8">
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
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 dark:from-indigo-500 dark:to-purple-500 rounded-2xl mb-4 shadow-lg">
            <Plus className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Como Criar um Evento?
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Guia completo para organizadores criarem e gerenciarem eventos
          </p>
        </div>

        {/* Requirements Alert */}
        <Alert className="mb-8 bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800">
          <AlertCircle className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          <AlertDescription className="text-purple-900 dark:text-purple-300">
            <strong>Pré-requisito:</strong> Você precisa ter uma conta de <strong>Organizador</strong> para criar eventos. Altere o tipo de perfil em "Configurações".
          </AlertDescription>
        </Alert>

        {/* Steps */}
        <div className="space-y-6">
          {/* Step 0 - Account Setup */}
          <Card className="border-none shadow-xl dark:bg-gray-800">
            <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-600 dark:from-purple-600 dark:to-pink-700 text-white rounded-t-xl">
              <CardTitle className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center font-bold">
                  0
                </div>
                Configure sua Conta como Organizador
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <p className="text-gray-600 dark:text-gray-400">
                  Antes de criar eventos, você precisa ter uma conta de organizador:
                </p>
                
                <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
                  <h4 className="font-semibold text-purple-900 dark:text-purple-300 mb-3">📝 Como se tornar Organizador:</h4>
                  <ol className="space-y-2 text-sm text-purple-800 dark:text-purple-400 list-decimal list-inside">
                    <li>Acesse <strong>Configurações</strong> no menu do seu perfil</li>
                    <li>Em "Tipo de Perfil", selecione <strong>"Organizador"</strong></li>
                    <li>Clique em <strong>"Salvar Alterações"</strong></li>
                    <li>Pronto! O botão <strong>"Criar Evento"</strong> aparecerá no menu</li>
                  </ol>
                </div>

                <Alert className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                  <CheckCircle2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  <AlertDescription className="text-blue-900 dark:text-blue-300 text-sm">
                    Como organizador, você terá acesso ao <strong>Dashboard do Organizador</strong> para gerenciar todos os seus eventos e ver estatísticas de vendas.
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>

          {/* Step 1 */}
          <Card className="border-none shadow-xl dark:bg-gray-800">
            <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-600 dark:from-blue-600 dark:to-indigo-700 text-white rounded-t-xl">
              <CardTitle className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center font-bold">
                  1
                </div>
                Acesse "Criar Evento"
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Após se tornar organizador, você verá o botão <strong>"Criar Evento"</strong> em dois lugares:
              </p>
              
              <div className="space-y-3">
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                  <h4 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">🎯 Menu de Navegação</h4>
                  <p className="text-sm text-blue-800 dark:text-blue-400">
                    Botão verde <strong>"Criar Evento"</strong> no canto superior direito
                  </p>
                </div>

                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
                  <h4 className="font-semibold text-green-900 dark:text-green-300 mb-2">📊 Dashboard do Organizador</h4>
                  <p className="text-sm text-green-800 dark:text-green-400">
                    Clique em <strong>"Dashboard"</strong> no menu e depois em <strong>"Criar Novo Evento"</strong>
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
                Faça Upload da Imagem do Evento
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Upload className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Escolha uma Imagem Atraente</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                    A imagem é o primeiro contato do público com seu evento. Escolha uma imagem de alta qualidade e relevante.
                  </p>
                  <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
                    <h4 className="font-semibold text-green-900 dark:text-green-300 mb-2">✨ Validação Automática por IA:</h4>
                    <ul className="space-y-2 text-sm text-green-800 dark:text-green-400">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
                        Formato aceito: PNG, JPG, GIF (máx. 10MB)
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
                        IA verifica se a imagem é apropriada
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
                        Rejeita conteúdo ofensivo automaticamente
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Step 3 */}
          <Card className="border-none shadow-xl dark:bg-gray-800">
            <CardHeader className="bg-gradient-to-r from-orange-500 to-red-600 dark:from-orange-600 dark:to-red-700 text-white rounded-t-xl">
              <CardTitle className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center font-bold">
                  3
                </div>
                Preencha as Informações do Evento
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Complete todos os campos obrigatórios do formulário:
              </p>
              
              <div className="space-y-3">
                {/* Title & Description */}
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    <h4 className="font-semibold text-blue-900 dark:text-blue-300">Título e Descrição</h4>
                  </div>
                  <ul className="space-y-1 text-sm text-blue-800 dark:text-blue-400 ml-7">
                    <li>• Título claro e atraente</li>
                    <li>• Descrição detalhada do evento</li>
                    <li>• Mencione atrações e diferenciais</li>
                  </ul>
                </div>

                {/* Location */}
                <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    <h4 className="font-semibold text-purple-900 dark:text-purple-300">Localização</h4>
                  </div>
                  <ul className="space-y-1 text-sm text-purple-800 dark:text-purple-400 ml-7">
                    <li>• Selecione o <strong>Estado</strong></li>
                    <li>• Digite a <strong>Cidade</strong></li>
                    <li>• Endereço completo do local</li>
                  </ul>
                </div>

                {/* Date */}
                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-5 h-5 text-green-600 dark:text-green-400" />
                    <h4 className="font-semibold text-green-900 dark:text-green-300">Data e Hora</h4>
                  </div>
                  <ul className="space-y-1 text-sm text-green-800 dark:text-green-400 ml-7">
                    <li>• Defina data e hora de início</li>
                    <li>• Considere fuso horário local</li>
                  </ul>
                </div>

                {/* Category */}
                <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4 border border-orange-200 dark:border-orange-800">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                    <h4 className="font-semibold text-orange-900 dark:text-orange-300">Categoria e Capacidade</h4>
                  </div>
                  <ul className="space-y-1 text-sm text-orange-800 dark:text-orange-400 ml-7">
                    <li>• Escolha a <strong>categoria</strong> (Show, Teatro, Esporte, etc)</li>
                    <li>• Defina a <strong>capacidade máxima</strong> de participantes</li>
                  </ul>
                </div>

                {/* Price */}
                <div className="bg-pink-50 dark:bg-pink-900/20 rounded-lg p-4 border border-pink-200 dark:border-pink-800">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="w-5 h-5 text-pink-600 dark:text-pink-400" />
                    <h4 className="font-semibold text-pink-900 dark:text-pink-300">Preço do Ingresso</h4>
                  </div>
                  <ul className="space-y-1 text-sm text-pink-800 dark:text-pink-400 ml-7">
                    <li>• Defina o valor em <strong>R$</strong></li>
                    <li>• Considere custos e margem</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Step 4 */}
          <Card className="border-none shadow-xl dark:bg-gray-800">
            <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-600 dark:from-indigo-600 dark:to-purple-700 text-white rounded-t-xl">
              <CardTitle className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center font-bold">
                  4
                </div>
                Publique seu Evento
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Clique em "Criar Evento"</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                      Após revisar todas as informações, clique no botão verde para publicar.
                    </p>
                    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-lg p-4 border-2 border-indigo-200 dark:border-indigo-800">
                      <h4 className="font-semibold text-indigo-900 dark:text-indigo-300 mb-2">🎉 O que acontece após publicar:</h4>
                      <ul className="space-y-2 text-sm text-indigo-800 dark:text-indigo-400">
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                          Evento fica <strong>visível para todos</strong> na plataforma
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                          Você recebe uma <strong>notificação de sucesso</strong>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                          Pode gerenciar no <strong>Dashboard</strong>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                          Usuários podem <strong>comprar ingressos imediatamente</strong>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Step 5 - Management */}
          <Card className="border-none shadow-xl dark:bg-gray-800">
            <CardHeader className="bg-gradient-to-r from-cyan-500 to-blue-600 dark:from-cyan-600 dark:to-blue-700 text-white rounded-t-xl">
              <CardTitle className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center font-bold">
                  5
                </div>
                Gerencie seu Evento
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Acesse o <strong>Dashboard do Organizador</strong> para:
              </p>
              
              <div className="grid md:grid-cols-2 gap-3">
                <div className="bg-cyan-50 dark:bg-cyan-900/20 rounded-lg p-3 border border-cyan-200 dark:border-cyan-800">
                  <h4 className="font-semibold text-cyan-900 dark:text-cyan-300 text-sm mb-1">📊 Ver Estatísticas</h4>
                  <p className="text-xs text-cyan-800 dark:text-cyan-400">Vendas, receita, ingressos vendidos</p>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 border border-blue-200 dark:border-blue-800">
                  <h4 className="font-semibold text-blue-900 dark:text-blue-300 text-sm mb-1">✏️ Editar Evento</h4>
                  <p className="text-xs text-blue-800 dark:text-blue-400">Atualizar informações, datas, preços</p>
                </div>

                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 border border-green-200 dark:border-green-800">
                  <h4 className="font-semibold text-green-900 dark:text-green-300 text-sm mb-1">💰 Acompanhar Vendas</h4>
                  <p className="text-xs text-green-800 dark:text-green-400">Notificações a cada venda realizada</p>
                </div>

                <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3 border border-purple-200 dark:border-purple-800">
                  <h4 className="font-semibold text-purple-900 dark:text-purple-300 text-sm mb-1">⭐ Ver Avaliações</h4>
                  <p className="text-xs text-purple-800 dark:text-purple-400">Feedback dos participantes</p>
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
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">❓ Posso criar quantos eventos quiser?</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Sim! Não há limite de eventos que você pode criar como organizador.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">💳 Como recebo o dinheiro das vendas?</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">O sistema processa os pagamentos. Entre em contato com o suporte para detalhes sobre repasses financeiros.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">✏️ Posso editar um evento já publicado?</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Sim! Acesse o Dashboard, encontre o evento e clique em "Editar".</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">🎫 Como valido os ingressos no dia?</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Use a página "Validar Ingresso" (disponível para organizadores) para escanear os QR Codes na entrada.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">📧 Recebo notificações das vendas?</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Sim! Você recebe uma notificação no sistema a cada venda, com detalhes do comprador e valor.</p>
            </div>
          </CardContent>
        </Card>

        {/* CTA */}
        <div className="mt-8 text-center space-y-4">
          <Link to={createPageUrl("UserSettings")}>
            <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 dark:from-purple-500 dark:to-pink-500 mr-3">
              <Users className="w-5 h-5 mr-2" />
              Tornar-me Organizador
            </Button>
          </Link>
          <Link to={createPageUrl("CreateEvent")}>
            <Button size="lg" className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 dark:from-green-500 dark:to-emerald-500">
              <Plus className="w-5 h-5 mr-2" />
              Criar Meu Primeiro Evento
            </Button>
          </Link>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Ainda tem dúvidas? <Link to={createPageUrl("Support")} className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium">Entre em contato</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
