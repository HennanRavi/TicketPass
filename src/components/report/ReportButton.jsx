import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Flag, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const reasonOptions = [
  { value: "inappropriate_content", label: "Conteúdo Inapropriado" },
  { value: "spam", label: "Spam" },
  { value: "fraud", label: "Fraude" },
  { value: "violence", label: "Violência" },
  { value: "hate_speech", label: "Discurso de Ódio" },
  { value: "fake_event", label: "Evento Falso" },
  { value: "scam", label: "Golpe" },
  { value: "other", label: "Outro" },
];

export default function ReportButton({
  reportType,
  reportedItemId,
  reportedItemTitle,
  variant = "outline",
  size = "sm",
  className = "",
}) {
  const queryClient = useQueryClient();
  const [user, setUser] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => setUser(null));
  }, []);

  const createReportMutation = useMutation({
    mutationFn: async (reportData) => {
      return await base44.entities.Report.create(reportData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-all-reports"] });
      toast.success("Denúncia enviada com sucesso!");
      toast.info("Nossa equipe analisará em breve.");
      setDialogOpen(false);
      setReason("");
      setDescription("");
    },
    onError: () => {
      toast.error("Erro ao enviar denúncia");
    },
  });

  const handleSubmit = () => {
    if (!user) {
      toast.error("Faça login para denunciar");
      base44.auth.redirectToLogin(window.location.href);
      return;
    }

    if (!reason || !description.trim()) {
      toast.error("Preencha todos os campos");
      return;
    }

    createReportMutation.mutate({
      report_type: reportType,
      reported_item_id: reportedItemId,
      reported_item_title: reportedItemTitle,
      reporter_id: user.id,
      reporter_name: user.full_name,
      reporter_email: user.email,
      reason: reason,
      description: description.trim(),
      status: "pending",
      priority: reason === "violence" || reason === "fraud" ? "high" : "medium",
    });
  };

  return (
    <>
      <Button
        variant={variant}
        size={size}
        className={className}
        onClick={() => setDialogOpen(true)}
      >
        <Flag className="w-4 h-4 mr-2" />
        Denunciar
      </Button>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Flag className="w-5 h-5 text-red-600" />
              Denunciar Conteúdo Inapropriado
            </DialogTitle>
            <DialogDescription>
              Ajude-nos a manter a plataforma segura. Denúncias são anônimas e analisadas pela nossa equipe.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-sm font-medium text-gray-900">
                Você está denunciando:
              </p>
              <p className="text-sm text-gray-700 mt-1">{reportedItemTitle}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Motivo da Denúncia *
              </label>
              <Select value={reason} onValueChange={setReason}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o motivo" />
                </SelectTrigger>
                <SelectContent>
                  {reasonOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Descrição Detalhada *
              </label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Descreva o problema em detalhes..."
                rows={4}
              />
              <p className="text-xs text-gray-500 mt-1">
                Quanto mais detalhes, mais rápido conseguimos analisar
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setDialogOpen(false);
                setReason("");
                setDescription("");
              }}
              disabled={createReportMutation.isPending}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={createReportMutation.isPending || !reason || !description.trim()}
              className="bg-red-600 hover:bg-red-700"
            >
              {createReportMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <Flag className="w-4 h-4 mr-2" />
                  Enviar Denúncia
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}