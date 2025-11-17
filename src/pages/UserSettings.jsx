import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate }
 from "react-router-dom";
import { createPageUrl } from "@/utils";
import { User, Mail, Phone, Camera, Save, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import OrganizerTermsDialog from "../components/organizer/OrganizerTermsDialog";
import PushNotificationManager from "../components/notifications/PushNotificationManager";
import NotificationPreferences from "../components/notifications/NotificationPreferences";

export default function UserSettings() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [user, setUser] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingData, setPendingData] = useState(null);
  const [isValidating, setIsValidating] = useState(false);
  const [formData, setFormData] = useState({
    display_name: "",
    email: "",
    phone: "",
    profile_image: "",
    user_type: "",
  });
  const [showTermsDialog, setShowTermsDialog] = useState(false);
  const [pendingOrganizerChange, setPendingOrganizerChange] = useState(false);

  useEffect(() => {
    base44.auth
      .me()
      .then((u) => {
        setUser(u);
        setFormData({
          display_name: u.display_name || u.full_name || "",
          email: u.email || "",
          phone: u.phone || "",
          profile_image: u.profile_image || "",
          user_type: u.user_type || "participante",
        });
      })
      .catch(() => {
        base44.auth.redirectToLogin(window.location.href);
      });
  }, []);

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Por favor, selecione uma imagem válida");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("A imagem deve ter no máximo 5MB");
      return;
    }

    setIsUploading(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });

      const validation = await base44.integrations.Core.InvokeLLM({
        prompt: `Analyze this image and determine if it's appropriate for a user profile picture. 
        Check if it contains: inappropriate content, violence, nudity, hate symbols, or anything offensive.
        Also verify if it's actually a photo (not a random object or inappropriate content).
        Return a simple JSON with: {"appropriate": true/false, "reason": "brief explanation"}`,
        file_urls: [file_url],
        response_json_schema: {
          type: "object",
          properties: {
            appropriate: { type: "boolean" },
            reason: { type: "string" }
          }
        }
      });

      if (!validation.appropriate) {
        toast.error(`Imagem não apropriada: ${validation.reason}`);
        setIsUploading(false);
        return;
      }

      setFormData({ ...formData, profile_image: file_url });
      toast.success("Imagem enviada com sucesso!");
    } catch (error) {
      toast.error("Erro ao enviar imagem");
      console.error(error);
    }
    setIsUploading(false);
  };

  const updateUserMutation = useMutation({
    mutationFn: async (data) => {
      const updateData = {
        display_name: data.display_name,
        phone: data.phone,
        profile_image: data.profile_image,
        user_type: data.user_type,
      };

      if (data.user_type === "organizador" && data.acceptedTerms) {
        updateData.organizer_terms_accepted = true;
        updateData.organizer_terms_accepted_date = new Date().toISOString();
      }

      await base44.auth.updateMe(updateData);
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      setShowConfirmDialog(false);
      setPendingData(null);
      setPendingOrganizerChange(false);
      
      toast.success("✅ Perfil atualizado com sucesso!", {
        description: "Suas alterações foram salvas.",
        duration: 4000,
      });
      
      setTimeout(() => {
        base44.auth.me().then((updatedUser) => {
          setUser(updatedUser);
          setFormData({
            display_name: updatedUser.display_name || updatedUser.full_name || "",
            email: updatedUser.email || "",
            phone: updatedUser.phone || "",
            profile_image: updatedUser.profile_image || "",
            user_type: updatedUser.user_type || "participante",
          });
        });
      }, 500);
    },
    onError: (error) => {
      console.error("Error updating user:", error);
      toast.error("Erro ao atualizar perfil. Tente novamente.");
      setShowConfirmDialog(false);
      setPendingData(null);
      setPendingOrganizerChange(false);
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.display_name.trim().length < 3) {
      toast.error("Nome deve ter pelo menos 3 caracteres");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Email inválido");
      return;
    }

    if (formData.phone && formData.phone.trim()) {
      const numbersOnly = formData.phone.replace(/\D/g, '');
      
      if (numbersOnly.length < 10 || numbersOnly.length > 11) {
        toast.error("Telefone deve ter 10 ou 11 dígitos. Ex: (11) 98765-4321");
        return;
      }
    }

    const nameChanged = formData.display_name !== (user.display_name || user.full_name);
    const imageChanged = formData.profile_image !== user.profile_image;
    const phoneChanged = formData.phone !== user.phone;
    const userTypeChanged = formData.user_type !== user.user_type;

    const changingToOrganizer = userTypeChanged && formData.user_type === "organizador";
    if (changingToOrganizer && !user.organizer_terms_accepted) {
      setPendingOrganizerChange(true);
      setPendingData({
        display_name: formData.display_name,
        phone: formData.phone,
        profile_image: formData.profile_image,
        user_type: formData.user_type,
      });
      setShowTermsDialog(true);
      return;
    }

    if (!nameChanged && !imageChanged && (phoneChanged || userTypeChanged)) {
      updateUserMutation.mutate({
        display_name: formData.display_name,
        phone: formData.phone,
        profile_image: formData.profile_image,
        user_type: formData.user_type,
        acceptedTerms: user.organizer_terms_accepted && formData.user_type === "organizador"
      });
      return;
    }
    
    if (!nameChanged && !imageChanged && !phoneChanged && !userTypeChanged) {
      toast.info("Nenhuma alteração foi feita");
      return;
    }

    if (nameChanged) {
      setIsValidating(true);
      try {
        const validation = await base44.integrations.Core.InvokeLLM({
          prompt: `Analise este nome e determine se ele contém palavras de baixo calão, palavrões, ofensas, termos inapropriados ou vulgares em português.
          Nome: "${formData.display_name}"
          
          Retorne um JSON com:
          - "appropriate": true se o nome é apropriado, false se contém palavrões ou termos inadequados
          - "reason": explicação breve em português do motivo (se inapropriado)`,
          response_json_schema: {
            type: "object",
            properties: {
              appropriate: { type: "boolean" },
              reason: { type: "string" }
            }
          }
        });

        if (!validation.appropriate) {
          toast.error(`Nome não permitido: ${validation.reason}`);
          setIsValidating(false);
          return;
        }
      } catch (error) {
        toast.error("Erro ao validar nome");
        console.error(error);
        setIsValidating(false);
        return;
      }
      setIsValidating(false);
    }

    setPendingData({
      display_name: formData.display_name,
      phone: formData.phone,
      profile_image: formData.profile_image,
      user_type: formData.user_type,
      acceptedTerms: user.organizer_terms_accepted && formData.user_type === "organizador"
    });
    setShowConfirmDialog(true);
  };

  const handleConfirmUpdate = () => {
    if (pendingData) {
      updateUserMutation.mutate(pendingData);
    }
  };

  const handleAcceptOrganizerTerms = () => {
    setShowTermsDialog(false);
    if (pendingData) {
      updateUserMutation.mutate({
        ...pendingData,
        acceptedTerms: true,
      });
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
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Configurações do Perfil</h1>
          <p className="text-gray-600 dark:text-gray-400">Gerencie suas informações pessoais</p>
        </div>

        {/* Notifications Section */}
        <div className="space-y-6 mb-8">
          <PushNotificationManager user={user} />
          <NotificationPreferences user={user} />
        </div>

        <Card className="border-none shadow-xl bg-white dark:bg-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
              <User className="w-5 h-5" />
              Informações Pessoais
            </CardTitle>
            <div className="mt-2">
              <Badge className={
                user?.role === "admin" 
                  ? "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300" 
                  : user?.user_type === "organizador"
                    ? "bg-blue-100 text-blue-700 dark:bg-indigo-900/40 dark:text-indigo-300" 
                    : "bg-green-100 text-green-700 dark:bg-orange-900/40 dark:text-orange-300"
              }>
                {user?.role === "admin" 
                  ? "👑 Administrador" 
                  : user?.user_type === "organizador" 
                    ? "👔 Organizador" 
                    : "🎉 Participante"}
              </Badge>
            </div>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              Atualize seus dados e foto de perfil
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Profile Image */}
              <div className="flex flex-col items-center gap-4 pb-6 border-b border-gray-200 dark:border-gray-700">
                <div className="relative">
                  {formData.profile_image ? (
                    <img
                      src={formData.profile_image}
                      alt="Profile"
                      className="w-32 h-32 rounded-full object-cover border-4 border-blue-100 dark:border-purple-800"
                    />
                  ) : (
                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 dark:from-purple-700 dark:to-indigo-800 flex items-center justify-center">
                      <User className="w-16 h-16 text-white" />
                    </div>
                  )}
                  <label className="absolute bottom-0 right-0 w-10 h-10 bg-blue-600 dark:bg-purple-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-700 dark:hover:bg-purple-700 transition-colors shadow-lg">
                    {isUploading ? (
                      <Loader2 className="w-5 h-5 text-white animate-spin" />
                    ) : (
                      <Camera className="w-5 h-5 text-white" />
                    )}
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={isUploading}
                    />
                  </label>
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{user.display_name || user.full_name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
                </div>
              </div>

              <Alert className="bg-blue-50 border-blue-200 dark:bg-purple-900/20 dark:border-purple-800">
                <AlertCircle className="h-4 w-4 text-blue-600 dark:text-purple-400" />
                <AlertDescription className="text-xs text-blue-900 dark:text-purple-300">
                  Sua foto de perfil será validada automaticamente. Imagens inapropriadas serão rejeitadas.
                </AlertDescription>
              </Alert>

              {/* Display Name */}
              <div>
                <Label htmlFor="display_name" className="flex items-center gap-2 mb-2 text-gray-700 dark:text-gray-300">
                  <User className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  Nome de Exibição *
                </Label>
                <Input
                  id="display_name"
                  value={formData.display_name}
                  onChange={(e) =>
                    setFormData({ ...formData, display_name: e.target.value })
                  }
                  required
                  placeholder="Como você quer ser chamado"
                  className="bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Este nome será exibido em todo o sistema
                </p>
              </div>

              {/* Email (readonly) */}
              <div>
                <Label htmlFor="email" className="flex items-center gap-2 mb-2 text-gray-700 dark:text-gray-300">
                  <Mail className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  disabled
                  className="bg-gray-100 dark:bg-gray-900 border-gray-300 dark:border-gray-700 text-gray-500 dark:text-gray-400"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  O email não pode ser alterado
                </p>
              </div>

              {/* Phone */}
              <div>
                <Label htmlFor="phone" className="flex items-center gap-2 mb-2 text-gray-700 dark:text-gray-300">
                  <Phone className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  Telefone (opcional)
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  placeholder="(11) 98765-4321 ou 11987654321"
                  className="bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Aceita vários formatos: (11) 98765-4321, 11987654321, etc.
                </p>
              </div>

              {/* Type Selection for non-admin users */}
              {user.role !== "admin" && (
                <div>
                  <Label htmlFor="user_type" className="flex items-center gap-2 mb-2 text-gray-700 dark:text-gray-300">
                    <User className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    Tipo de Perfil
                  </Label>
                  <select
                    id="user_type"
                    value={formData.user_type || "participante"}
                    onChange={(e) =>
                      setFormData({ ...formData, user_type: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-purple-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                  >
                    <option value="participante">🎉 Participante - Comprar ingressos e participar de eventos</option>
                    <option value="organizador">👔 Organizador - Criar e gerenciar eventos</option>
                  </select>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {formData.user_type === "organizador" 
                      ? "Como organizador, você pode criar e gerenciar eventos" 
                      : "Como participante, você pode comprar ingressos e participar de eventos"}
                  </p>
                </div>
              )}

              {/* Admin Badge */}
              {user.role === "admin" && (
                <Alert className="bg-purple-50 border-purple-200 dark:bg-purple-900/20 dark:border-purple-800">
                  <AlertDescription className="text-sm text-purple-900 dark:text-purple-300">
                    👑 Você é o <strong>Administrador</strong> da plataforma
                  </AlertDescription>
                </Alert>
              )}

              {/* Submit Button */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(createPageUrl("Home"))}
                  className="flex-1 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={updateUserMutation.isPending || isValidating || pendingOrganizerChange}
                  className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 dark:from-orange-500 dark:to-orange-600 dark:hover:from-orange-600 dark:hover:to-orange-700 text-white"
                >
                  {isValidating ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Validando...
                    </>
                  ) : updateUserMutation.isPending || pendingOrganizerChange ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Salvar Alterações
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Confirmation Dialog */}
        <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
          <DialogContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                <CheckCircle2 className="w-5 h-5 text-blue-600 dark:text-purple-400" />
                Confirmar Alterações
              </DialogTitle>
              <DialogDescription className="text-gray-600 dark:text-gray-400">
                Deseja confirmar as alterações no seu perfil?
              </DialogDescription>
            </DialogHeader>
            
            {pendingData && (
              <div className="py-4 space-y-4">
                {pendingData.display_name !== (user.display_name || user.full_name) && (
                  <div className="bg-blue-50 dark:bg-purple-900/20 rounded-lg p-4 border border-blue-200 dark:border-purple-800">
                    <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">Nome:</p>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-gray-500 dark:text-gray-400 line-through">{user.display_name || user.full_name}</span>
                      <span className="text-gray-400">→</span>
                      <span className="text-blue-600 dark:text-purple-400 font-medium">{pendingData.display_name}</span>
                    </div>
                  </div>
                )}

                {pendingData.profile_image !== user.profile_image && (
                  <div className="bg-blue-50 dark:bg-purple-900/20 rounded-lg p-4 border border-blue-200 dark:border-purple-800">
                    <p className="text-sm font-medium text-gray-900 dark:text-white mb-3">Foto de Perfil:</p>
                    <div className="flex items-center gap-4">
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Anterior</p>
                        {user.profile_image ? (
                          <img
                            src={user.profile_image}
                            alt="Anterior"
                            className="w-16 h-16 rounded-full object-cover border-2 border-gray-300 dark:border-gray-600"
                          />
                        ) : (
                          <div className="w-16 h-16 rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center">
                            <User className="w-8 h-8 text-gray-500 dark:text-gray-400" />
                          </div>
                        )}
                      </div>
                      <span className="text-gray-400">→</span>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Nova</p>
                        <img
                          src={pendingData.profile_image}
                          alt="Nova"
                          className="w-16 h-16 rounded-full object-cover border-2 border-blue-600 dark:border-purple-600"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {pendingData.phone !== user.phone && (
                  <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
                    <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">Telefone:</p>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-gray-500 dark:text-gray-400">{user.phone || "(não definido)"}</span>
                      <span className="text-gray-400">→</span>
                      <span className="text-green-700 dark:text-green-400 font-medium">{pendingData.phone || "(não definido)"}</span>
                    </div>
                  </div>
                )}

                {pendingData.user_type !== user.user_type && (
                  <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
                    <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">Tipo de Perfil:</p>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-gray-500 dark:text-gray-400">
                        {user.user_type === "organizador" ? "👔 Organizador" : "🎉 Participante"}
                      </span>
                      <span className="text-gray-400">→</span>
                      <span className="text-purple-700 dark:text-purple-400 font-medium">
                        {pendingData.user_type === "organizador" ? "👔 Organizador" : "🎉 Participante"}
                      </span>
                    </div>
                  </div>
                )}

                <Alert className="bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800">
                  <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                  <AlertDescription className="text-sm text-yellow-900 dark:text-yellow-300">
                    Após confirmar, as alterações serão aplicadas imediatamente.
                  </AlertDescription>
                </Alert>
              </div>
            )}

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setShowConfirmDialog(false);
                  setPendingData(null);
                }}
                disabled={updateUserMutation.isPending}
                className="border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleConfirmUpdate}
                disabled={updateUserMutation.isPending}
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 dark:from-orange-500 dark:to-orange-600 dark:hover:from-orange-600 dark:hover:to-orange-700 text-white"
              >
                {updateUserMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Confirmar Alterações
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Organizer Terms Dialog */}
        <OrganizerTermsDialog
          open={showTermsDialog}
          onOpenChange={setShowTermsDialog}
          onAccept={handleAcceptOrganizerTerms}
          isLoading={updateUserMutation.isPending}
        />
      </div>
    </div>
  );
}