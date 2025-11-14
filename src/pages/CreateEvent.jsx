import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { ArrowLeft, Save, Upload, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";

const categories = [
  { value: "show", label: "Show" },
  { value: "teatro", label: "Teatro" },
  { value: "esporte", label: "Esporte" },
  { value: "festival", label: "Festival" },
  { value: "conferencia", label: "Conferência" },
  { value: "workshop", label: "Workshop" },
  { value: "outro", label: "Outro" },
];

const states = [
  { uf: "AC", name: "Acre" },
  { uf: "AL", name: "Alagoas" },
  { uf: "AP", name: "Amapá" },
  { uf: "AM", name: "Amazonas" },
  { uf: "BA", name: "Bahia" },
  { uf: "CE", name: "Ceará" },
  { uf: "DF", name: "Distrito Federal" },
  { uf: "ES", name: "Espírito Santo" },
  { uf: "GO", name: "Goiás" },
  { uf: "MA", name: "Maranhão" },
  { uf: "MT", name: "Mato Grosso" },
  { uf: "MS", name: "Mato Grosso do Sul" },
  { uf: "MG", name: "Minas Gerais" },
  { uf: "PA", name: "Pará" },
  { uf: "PB", name: "Paraíba" },
  { uf: "PR", name: "Paraná" },
  { uf: "PE", name: "Pernambuco" },
  { uf: "PI", name: "Piauí" },
  { uf: "RJ", name: "Rio de Janeiro" },
  { uf: "RN", name: "Rio Grande do Norte" },
  { uf: "RS", name: "Rio Grande do Sul" },
  { uf: "RO", name: "Rondônia" },
  { uf: "RR", name: "Roraima" },
  { uf: "SC", name: "Santa Catarina" },
  { uf: "SP", name: "São Paulo" },
  { uf: "SE", name: "Sergipe" },
  { uf: "TO", name: "Tocantins" },
];

export default function CreateEvent() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const urlParams = new URLSearchParams(window.location.search);
  const eventId = urlParams.get("id");

  const [user, setUser] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image_url: "",
    location: "",
    state: "",
    city: "",
    date: "",
    price: "",
    capacity: "",
    category: "show",
    status: "ativo",
  });

  useEffect(() => {
    base44.auth
      .me()
      .then((u) => {
        if (u.role !== "admin" && u.user_type !== "organizador") {
          navigate(createPageUrl("Home"));
          toast.error("Apenas organizadores podem criar eventos");
          return;
        }
        setUser(u);
      })
      .catch(() => {
        toast.info("Faça login como organizador para criar eventos");
        base44.auth.redirectToLogin(window.location.href);
      });
  }, []);

  const { data: event } = useQuery({
    queryKey: ["event", eventId],
    queryFn: async () => {
      const events = await base44.entities.Event.filter({ id: eventId });
      const event = events[0];
      if (event) {
        setFormData({
          title: event.title || "",
          description: event.description || "",
          image_url: event.image_url || "",
          location: event.location || "",
          state: event.state || "",
          city: event.city || "",
          date: event.date?.slice(0, 16) || "",
          price: event.price?.toString() || "",
          capacity: event.capacity?.toString() || "",
          category: event.category || "show",
          status: event.status || "ativo",
        });
      }
      return event;
    },
    enabled: !!eventId && !!user,
  });

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Por favor, selecione uma imagem válida");
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("A imagem deve ter no máximo 10MB");
      return;
    }

    setIsUploading(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });

      // Try AI validation, but don't block if it fails or is too restrictive
      try {
        const validation = await base44.integrations.Core.InvokeLLM({
          prompt: `Analise esta imagem RAPIDAMENTE e determine se ela contém conteúdo CLARAMENTE inapropriado.
          
          Apenas rejeite se a imagem contiver:
          - Nudez explícita
          - Violência gráfica
          - Símbolos de ódio óbvios
          - Conteúdo pornográfico
          
          IMPORTANTE: Seja PERMISSIVO. Aceite imagens de:
          - Qualquer tipo de evento (shows, esportes, festas, palestras, etc)
          - Pessoas em situações normais
          - Locais, paisagens, objetos
          - Cartazes, banners, logos
          - Qualquer imagem que possa razoavelmente ser usada para promover um evento
          
          Retorne um JSON com:
          - "appropriate": true (a menos que seja CLARAMENTE inapropriado)
          - "reason": razão APENAS se inapropriado`,
          file_urls: [file_url],
          response_json_schema: {
            type: "object",
            properties: {
              appropriate: { type: "boolean" },
              reason: { type: "string" }
            }
          }
        });

        if (validation && !validation.appropriate && validation.reason) {
          toast.error(`Imagem inapropriada: ${validation.reason}`);
          toast.info("Por favor, escolha uma imagem adequada para eventos públicos");
          setIsUploading(false);
          return;
        }
      } catch (aiError) {
        // If AI validation fails, just log it and continue
        console.warn("AI validation failed, but allowing upload:", aiError);
        toast.info("Imagem enviada (validação automática não disponível)");
      }

      setFormData({ ...formData, image_url: file_url });
      toast.success("Imagem enviada com sucesso!");
    } catch (error) {
      toast.error("Erro ao enviar imagem");
      console.error(error);
    }
    setIsUploading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) return;

    try {
      const eventData = {
        ...formData,
        price: parseFloat(formData.price),
        capacity: parseInt(formData.capacity),
        organizer_id: user.id,
        organizer_name: user.full_name,
        tickets_sold: event?.tickets_sold || 0,
      };

      if (eventId) {
        await base44.entities.Event.update(eventId, eventData);
        toast.success("Evento atualizado com sucesso!");
        
        // Create notification for event update
        await base44.entities.Notification.create({
          user_id: user.id,
          title: "Evento Atualizado ✅",
          message: `O evento "${formData.title}" foi atualizado com sucesso.`,
          type: "success",
          category: "event",
          link: `${createPageUrl("EventDetails")}?id=${eventId}`,
        });
      } else {
        const newEvent = await base44.entities.Event.create(eventData);
        toast.success("Evento criado com sucesso!");
        
        // Create notification for new event
        await base44.entities.Notification.create({
          user_id: user.id,
          title: "Evento Criado com Sucesso! 🎉",
          message: `Seu evento "${formData.title}" está no ar e pronto para vender ingressos!`,
          type: "success",
          category: "event",
          link: `${createPageUrl("EventDetails")}?id=${newEvent.id}`,
          metadata: {
            event_id: newEvent.id,
          },
        });
      }

      queryClient.invalidateQueries({ queryKey: ["events"] });
      queryClient.invalidateQueries({ queryKey: ["organizer-events"] });
      navigate(createPageUrl("Home"));
    } catch (error) {
      toast.error("Erro ao salvar evento");
      console.error(error);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-purple-400"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-purple-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Button
          variant="ghost"
          className="mb-6 dark:text-gray-300 dark:hover:bg-gray-800"
          onClick={() => navigate(createPageUrl("OrganizerDashboard"))}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>

        <Card className="border-none shadow-xl dark:bg-gray-800">
          <CardHeader>
            <CardTitle className="text-2xl dark:text-white">
              {eventId ? "Editar Evento" : "Criar Novo Evento"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Image Upload */}
              <div>
                <Label className="dark:text-gray-300">Imagem do Evento</Label>
                <Alert className="bg-blue-50 border-blue-200 dark:bg-purple-900/20 dark:border-purple-800 mt-2 mb-3">
                  <AlertCircle className="h-4 w-4 text-blue-600 dark:text-purple-400" />
                  <AlertDescription className="text-xs text-blue-900 dark:text-purple-300">
                    Use uma imagem adequada para seu evento. Conteúdo ofensivo ou explícito será rejeitado.
                  </AlertDescription>
                </Alert>
                <div className="mt-2">
                  {formData.image_url ? (
                    <div className="relative">
                      <img
                        src={formData.image_url}
                        alt="Preview"
                        className="w-full h-64 object-cover rounded-xl border-2 border-green-200 dark:border-orange-700"
                      />
                      <div className="absolute top-3 left-3 bg-green-500 dark:bg-orange-600 text-white px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-lg">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Imagem Validada
                      </div>
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        className="absolute top-3 right-3 shadow-lg dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
                        onClick={() => setFormData({ ...formData, image_url: "" })}
                      >
                        Remover
                      </Button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        {isUploading ? (
                          <>
                            <Loader2 className="w-12 h-12 text-blue-500 dark:text-purple-400 animate-spin mb-3" />
                            <p className="text-sm text-blue-600 dark:text-purple-400 font-medium mb-1">
                              Validando imagem...
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Aguarde enquanto verificamos se a imagem é apropriada
                            </p>
                          </>
                        ) : (
                          <>
                            <Upload className="w-12 h-12 text-gray-400 dark:text-gray-500 mb-3" />
                            <p className="text-sm text-gray-700 dark:text-gray-300 font-medium mb-1">
                              Clique para fazer upload da imagem
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              PNG, JPG ou GIF (máx. 10MB)
                            </p>
                          </>
                        )}
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={isUploading}
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* Title */}
              <div>
                <Label htmlFor="title" className="dark:text-gray-300">Título do Evento *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  required
                  placeholder="Ex: Show do Artista X"
                  className="dark:bg-gray-900 dark:border-gray-700 dark:text-white"
                />
              </div>

              {/* Description */}
              <div>
                <Label htmlFor="description" className="dark:text-gray-300">Descrição *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  required
                  rows={5}
                  placeholder="Descreva os detalhes do evento..."
                  className="dark:bg-gray-900 dark:border-gray-700 dark:text-white"
                />
              </div>

              {/* State and City */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="state" className="dark:text-gray-300">Estado *</Label>
                  <Select
                    value={formData.state}
                    onValueChange={(value) =>
                      setFormData({ ...formData, state: value })
                    }
                  >
                    <SelectTrigger className="dark:bg-gray-900 dark:border-gray-700 dark:text-white">
                      <SelectValue placeholder="Selecione o estado" />
                    </SelectTrigger>
                    <SelectContent className="dark:bg-gray-900 dark:border-gray-700">
                      {states.map((state) => (
                        <SelectItem key={state.uf} value={state.uf}>
                          {state.name} ({state.uf})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="city" className="dark:text-gray-300">Cidade *</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) =>
                      setFormData({ ...formData, city: e.target.value })
                    }
                    required
                    placeholder="Ex: São Paulo"
                    className="dark:bg-gray-900 dark:border-gray-700 dark:text-white"
                  />
                </div>
              </div>

              {/* Location */}
              <div>
                <Label htmlFor="location" className="dark:text-gray-300">Endereço/Local *</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  required
                  placeholder="Ex: Teatro Municipal, Av. Paulista, 1000"
                  className="dark:bg-gray-900 dark:border-gray-700 dark:text-white"
                />
              </div>

              {/* Date */}
              <div>
                <Label htmlFor="date" className="dark:text-gray-300">Data e Hora *</Label>
                <Input
                  id="date"
                  type="datetime-local"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                  required
                  className="dark:bg-gray-900 dark:border-gray-700 dark:text-white dark:[color-scheme:dark]"
                />
              </div>

              {/* Category */}
              <div>
                <Label htmlFor="category" className="dark:text-gray-300">Categoria *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) =>
                    setFormData({ ...formData, category: value })
                  }
                >
                  <SelectTrigger className="dark:bg-gray-900 dark:border-gray-700 dark:text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="dark:bg-gray-900 dark:border-gray-700">
                    {categories.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Price */}
                <div>
                  <Label htmlFor="price" className="dark:text-gray-300">Preço (R$) *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    required
                    placeholder="0.00"
                    className="dark:bg-gray-900 dark:border-gray-700 dark:text-white"
                  />
                </div>

                {/* Capacity */}
                <div>
                  <Label htmlFor="capacity" className="dark:text-gray-300">Capacidade *</Label>
                  <Input
                    id="capacity"
                    type="number"
                    min="1"
                    value={formData.capacity}
                    onChange={(e) =>
                      setFormData({ ...formData, capacity: e.target.value })
                    }
                    required
                    placeholder="Ex: 500"
                    className="dark:bg-gray-900 dark:border-gray-700 dark:text-white"
                  />
                </div>
              </div>

              {/* Status */}
              <div>
                <Label htmlFor="status" className="dark:text-gray-300">Status *</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) =>
                    setFormData({ ...formData, status: value })
                  }
                >
                  <SelectTrigger className="dark:bg-gray-900 dark:border-gray-700 dark:text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="dark:bg-gray-900 dark:border-gray-700">
                    <SelectItem value="ativo">Ativo</SelectItem>
                    <SelectItem value="cancelado">Cancelado</SelectItem>
                    <SelectItem value="encerrado">Encerrado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(createPageUrl("Home"))}
                  className="dark:border-gray-700 dark:text-gray-300"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 dark:from-orange-500 dark:to-orange-600 dark:hover:from-orange-600 dark:hover:to-orange-700"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {eventId ? "Atualizar Evento" : "Criar Evento"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}