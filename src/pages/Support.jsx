import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { MessageSquare, Send, Mail, Phone, Loader2, CheckCircle2, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

export default function Support() {
  const [user, setUser] = useState(null);
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    subject: "",
    message: "",
    category: "tecnico",
  });

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => setUser(null));
  }, []);

  const submitSupportMutation = useMutation({
    mutationFn: async (data) => {
      return await base44.entities.SupportMessage.create({
        ...data,
        user_name: user?.full_name || user?.display_name || "Anônimo",
        user_email: user?.email || data.email,
        user_id: user?.id || null,
        status: "pendente",
        priority: data.category === "tecnico" ? "alta" : "media",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["support-messages"] });
      toast.success("Mensagem enviada com sucesso! Entraremos em contato em breve.");
      setFormData({
        subject: "",
        message: "",
        category: "tecnico",
      });
    },
    onError: () => {
      toast.error("Erro ao enviar mensagem. Tente novamente.");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.subject.trim() || !formData.message.trim()) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    submitSupportMutation.mutate(formData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl mb-4 shadow-lg">
            <MessageSquare className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Central de Suporte
          </h1>
          <p className="text-lg text-gray-600">
            Estamos aqui para ajudar você
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="border-none shadow-2xl">
              <CardHeader>
                <CardTitle>Envie sua Mensagem</CardTitle>
                <CardDescription>
                  Preencha o formulário e nossa equipe entrará em contato
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Category */}
                  <div>
                    <Label htmlFor="category">Categoria *</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) =>
                        setFormData({ ...formData, category: value })
                      }
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tecnico">🔧 Suporte Técnico</SelectItem>
                        <SelectItem value="financeiro">💳 Financeiro / Pagamento</SelectItem>
                        <SelectItem value="evento">🎫 Dúvidas sobre Eventos</SelectItem>
                        <SelectItem value="ingresso">🎟️ Problemas com Ingresso</SelectItem>
                        <SelectItem value="outro">💬 Outro Assunto</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Subject */}
                  <div>
                    <Label htmlFor="subject">Assunto *</Label>
                    <Input
                      id="subject"
                      placeholder="Descreva brevemente o assunto"
                      value={formData.subject}
                      onChange={(e) =>
                        setFormData({ ...formData, subject: e.target.value })
                      }
                      required
                      className="mt-2"
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <Label htmlFor="message">Mensagem *</Label>
                    <Textarea
                      id="message"
                      placeholder="Descreva detalhadamente sua dúvida ou problema..."
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      required
                      rows={8}
                      className="mt-2"
                    />
                  </div>

                  {/* User Info Display */}
                  {user && (
                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                      <p className="text-sm text-blue-900">
                        <strong>Enviando como:</strong> {user.display_name || user.full_name}
                      </p>
                      <p className="text-xs text-blue-700">{user.email}</p>
                    </div>
                  )}

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={submitSupportMutation.isPending}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 py-6 text-lg font-semibold"
                  >
                    {submitSupportMutation.isPending ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Enviando...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5 mr-2" />
                        Enviar Mensagem
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Contact Info Sidebar */}
          <div className="space-y-6">
            {/* WhatsApp Card */}
            <Card className="border-none shadow-lg bg-gradient-to-br from-green-500 to-emerald-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <Phone className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-xl">WhatsApp</h3>
                </div>
                <p className="text-green-50 text-sm mb-4">
                  Precisa de uma resposta rápida? Fale conosco pelo WhatsApp!
                </p>
                <a
                  href="https://wa.me/5587991675203"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="secondary" size="sm" className="w-full bg-white text-green-600 hover:bg-green-50">
                    💬 Abrir WhatsApp
                  </Button>
                </a>
                <p className="text-green-50 text-xs mt-3 text-center">
                  +55 (87) 9 9167-5203
                </p>
              </CardContent>
            </Card>

            {/* Email Card */}
            <Card className="border-none shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Mail className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="font-bold text-lg text-gray-900">Email</h3>
                </div>
                <p className="text-gray-600 text-sm mb-4">
                  Envie um email para suporte formal
                </p>
                <a
                  href="mailto:consult.dev.hr@gmail.com"
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  consult.dev.hr@gmail.com
                </a>
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-xs text-gray-500">
                    <strong>Horário:</strong> Seg-Sex, 9h às 18h
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    <strong>Resposta em:</strong> 12-24 horas úteis
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* FAQ Hints */}
            <Card className="border-none shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <HelpCircle className="w-5 h-5 text-blue-600" />
                  <h3 className="font-bold text-gray-900">Dúvidas Frequentes</h3>
                </div>
                <div className="space-y-3 text-sm">
                  <Link 
                    to={createPageUrl("ComoComprarIngressos")}
                    className="flex items-start gap-2 text-gray-600 hover:text-blue-600 transition-colors group"
                  >
                    <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 group-hover:text-blue-600" />
                    <span>Como comprar ingressos?</span>
                  </Link>
                  <Link 
                    to={createPageUrl("OndeVerMeusIngressos")}
                    className="flex items-start gap-2 text-gray-600 hover:text-blue-600 transition-colors group"
                  >
                    <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 group-hover:text-blue-600" />
                    <span>Onde vejo meus ingressos?</span>
                  </Link>
                  <Link 
                    to={createPageUrl("ComoSolicitarReembolso")}
                    className="flex items-start gap-2 text-gray-600 hover:text-blue-600 transition-colors group"
                  >
                    <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 group-hover:text-blue-600" />
                    <span>Como solicitar reembolso?</span>
                  </Link>
                  <Link 
                    to={createPageUrl("ComoCriarEvento")}
                    className="flex items-start gap-2 text-gray-600 hover:text-blue-600 transition-colors group"
                  >
                    <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 group-hover:text-blue-600" />
                    <span>Como criar um evento?</span>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}