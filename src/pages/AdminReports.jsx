import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
  Flag,
  ArrowLeft,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Eye,
  AlertTriangle,
  Clock,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { toast } from "sonner";
import { format } from "date-fns";

const reasonLabels = {
  inappropriate_content: "Conteúdo Inapropriado",
  spam: "Spam",
  fraud: "Fraude",
  violence: "Violência",
  hate_speech: "Discurso de Ódio",
  fake_event: "Evento Falso",
  scam: "Golpe",
  other: "Outro",
};

export default function AdminReports() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedReport, setSelectedReport] = useState(null);
  const [detailsDialog, setDetailsDialog] = useState(false);
  const [adminNotes, setAdminNotes] = useState("");
  const [actionTaken, setActionTaken] = useState("");

  useEffect(() => {
    base44.auth
      .me()
      .then((u) => {
        if (u.role !== "admin") {
          navigate(createPageUrl("Home"));
          toast.error("Acesso restrito a administradores");
          return;
        }
        setUser(u);
      })
      .catch(() => {
        base44.auth.redirectToLogin(window.location.href);
      });
  }, []);

  const { data: reports, isLoading } = useQuery({
    queryKey: ["admin-all-reports"],
    queryFn: () => base44.entities.Report.list("-created_date"),
    enabled: !!user,
    initialData: [],
  });

  const updateReportMutation = useMutation({
    mutationFn: async ({ reportId, data }) => {
      return await base44.entities.Report.update(reportId, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-all-reports"] });
      toast.success("Denúncia atualizada com sucesso!");
      setDetailsDialog(false);
      setSelectedReport(null);
      setAdminNotes("");
      setActionTaken("");
    },
    onError: () => {
      toast.error("Erro ao atualizar denúncia");
    },
  });

  const handleResolve = () => {
    if (!selectedReport) return;
    
    updateReportMutation.mutate({
      reportId: selectedReport.id,
      data: {
        status: "resolved",
        admin_notes: adminNotes,
        action_taken: actionTaken,
        resolved_by: user.id,
        resolved_date: new Date().toISOString(),
      },
    });
  };

  const handleDismiss = () => {
    if (!selectedReport) return;
    
    updateReportMutation.mutate({
      reportId: selectedReport.id,
      data: {
        status: "dismissed",
        admin_notes: adminNotes,
        resolved_by: user.id,
        resolved_date: new Date().toISOString(),
      },
    });
  };

  const filteredReports = reports.filter((r) => {
    const matchesSearch =
      !searchTerm ||
      r.reported_item_title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.reporter_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus =
      statusFilter === "all" || r.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => navigate(createPageUrl("AdminPanel"))}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar ao Painel
        </Button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
            <Flag className="w-8 h-8 text-orange-600" />
            Gerenciamento de Denúncias
          </h1>
          <p className="text-gray-600">
            Analise e resolva denúncias de conteúdo inapropriado
          </p>
        </div>

        {/* Filters */}
        <Card className="border-none shadow-xl mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Buscar por título, denunciante ou descrição..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Status</SelectItem>
                  <SelectItem value="pending">Pendentes</SelectItem>
                  <SelectItem value="under_review">Em Análise</SelectItem>
                  <SelectItem value="resolved">Resolvidas</SelectItem>
                  <SelectItem value="dismissed">Descartadas</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="border-none shadow-lg">
            <CardContent className="p-4">
              <p className="text-2xl font-bold text-gray-900">{reports.length}</p>
              <p className="text-sm text-gray-600">Total de Denúncias</p>
            </CardContent>
          </Card>
          <Card className="border-none shadow-lg bg-yellow-50">
            <CardContent className="p-4">
              <p className="text-2xl font-bold text-yellow-700">
                {reports.filter(r => r.status === "pending").length}
              </p>
              <p className="text-sm text-yellow-600">Pendentes</p>
            </CardContent>
          </Card>
          <Card className="border-none shadow-lg bg-green-50">
            <CardContent className="p-4">
              <p className="text-2xl font-bold text-green-700">
                {reports.filter(r => r.status === "resolved").length}
              </p>
              <p className="text-sm text-green-600">Resolvidas</p>
            </CardContent>
          </Card>
          <Card className="border-none shadow-lg bg-gray-50">
            <CardContent className="p-4">
              <p className="text-2xl font-bold text-gray-700">
                {reports.filter(r => r.status === "dismissed").length}
              </p>
              <p className="text-sm text-gray-600">Descartadas</p>
            </CardContent>
          </Card>
        </div>

        {/* Reports Table */}
        <Card className="border-none shadow-xl">
          <CardHeader>
            <CardTitle>Lista de Denúncias ({filteredReports.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto"></div>
              </div>
            ) : filteredReports.length === 0 ? (
              <div className="text-center py-8">
                <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-3" />
                <p className="text-gray-600">Nenhuma denúncia encontrada</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item Denunciado</TableHead>
                      <TableHead>Denunciante</TableHead>
                      <TableHead>Motivo</TableHead>
                      <TableHead>Prioridade</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredReports.map((report) => (
                      <TableRow key={report.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium text-gray-900 line-clamp-1">
                              {report.reported_item_title}
                            </p>
                            <Badge variant="outline" className="mt-1">
                              {report.report_type === "event" ? "Evento" :
                               report.report_type === "user" ? "Usuário" :
                               report.report_type === "review" ? "Avaliação" : "Outro"}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <p className="text-sm text-gray-900">{report.reporter_name}</p>
                          <p className="text-xs text-gray-500">{report.reporter_email}</p>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {reasonLabels[report.reason] || report.reason}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={
                              report.priority === "critical" ? "bg-red-100 text-red-700" :
                              report.priority === "high" ? "bg-orange-100 text-orange-700" :
                              report.priority === "medium" ? "bg-yellow-100 text-yellow-700" :
                              "bg-blue-100 text-blue-700"
                            }
                          >
                            <AlertTriangle className="w-3 h-3 mr-1" />
                            {report.priority === "critical" ? "Crítica" :
                             report.priority === "high" ? "Alta" :
                             report.priority === "medium" ? "Média" : "Baixa"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-gray-600">
                          {format(new Date(report.created_date), "dd/MM/yyyy HH:mm")}
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={
                              report.status === "pending" ? "bg-yellow-100 text-yellow-700" :
                              report.status === "under_review" ? "bg-blue-100 text-blue-700" :
                              report.status === "resolved" ? "bg-green-100 text-green-700" :
                              "bg-gray-100 text-gray-700"
                            }
                          >
                            {report.status === "pending" && <Clock className="w-3 h-3 mr-1" />}
                            {report.status === "resolved" && <CheckCircle2 className="w-3 h-3 mr-1" />}
                            {report.status === "dismissed" && <XCircle className="w-3 h-3 mr-1" />}
                            {report.status === "pending" ? "Pendente" :
                             report.status === "under_review" ? "Em Análise" :
                             report.status === "resolved" ? "Resolvida" : "Descartada"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedReport(report);
                              setAdminNotes(report.admin_notes || "");
                              setActionTaken(report.action_taken || "");
                              setDetailsDialog(true);
                            }}
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            Detalhes
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Report Details Dialog */}
        <Dialog open={detailsDialog} onOpenChange={setDetailsDialog}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Flag className="w-5 h-5 text-orange-600" />
                Detalhes da Denúncia
              </DialogTitle>
            </DialogHeader>
            {selectedReport && (
              <div className="space-y-6">
                {/* Report Info */}
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Item Denunciado</p>
                    <p className="font-semibold text-gray-900">{selectedReport.reported_item_title}</p>
                    <Badge variant="outline" className="mt-1">
                      {selectedReport.report_type === "event" ? "Evento" :
                       selectedReport.report_type === "user" ? "Usuário" :
                       selectedReport.report_type === "review" ? "Avaliação" : "Outro"}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Denunciante</p>
                      <p className="text-sm font-medium">{selectedReport.reporter_name}</p>
                      <p className="text-xs text-gray-600">{selectedReport.reporter_email}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Motivo</p>
                      <Badge variant="outline">
                        {reasonLabels[selectedReport.reason] || selectedReport.reason}
                      </Badge>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500 mb-1">Descrição</p>
                    <p className="text-sm text-gray-700 bg-white p-3 rounded">
                      {selectedReport.description}
                    </p>
                  </div>

                  <div className="flex gap-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Prioridade</p>
                      <Badge
                        className={
                          selectedReport.priority === "critical" ? "bg-red-100 text-red-700" :
                          selectedReport.priority === "high" ? "bg-orange-100 text-orange-700" :
                          selectedReport.priority === "medium" ? "bg-yellow-100 text-yellow-700" :
                          "bg-blue-100 text-blue-700"
                        }
                      >
                        {selectedReport.priority === "critical" ? "Crítica" :
                         selectedReport.priority === "high" ? "Alta" :
                         selectedReport.priority === "medium" ? "Média" : "Baixa"}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Data</p>
                      <p className="text-sm text-gray-700">
                        {format(new Date(selectedReport.created_date), "dd/MM/yyyy 'às' HH:mm")}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Admin Actions */}
                {(selectedReport.status === "pending" || selectedReport.status === "under_review") && (
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">
                        Notas do Administrador
                      </label>
                      <Textarea
                        value={adminNotes}
                        onChange={(e) => setAdminNotes(e.target.value)}
                        placeholder="Adicione observações sobre esta denúncia..."
                        rows={3}
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">
                        Ação Tomada
                      </label>
                      <Textarea
                        value={actionTaken}
                        onChange={(e) => setActionTaken(e.target.value)}
                        placeholder="Descreva a ação tomada (ex: conteúdo removido, usuário advertido, etc)..."
                        rows={3}
                      />
                    </div>
                  </div>
                )}

                {/* Previous Admin Notes */}
                {selectedReport.admin_notes && (
                  <div className="bg-blue-50 rounded-lg p-4">
                    <p className="text-xs font-medium text-blue-900 mb-2 flex items-center gap-2">
                      <MessageSquare className="w-4 h-4" />
                      Notas Anteriores
                    </p>
                    <p className="text-sm text-blue-800">{selectedReport.admin_notes}</p>
                    {selectedReport.action_taken && (
                      <>
                        <p className="text-xs font-medium text-blue-900 mt-3 mb-1">Ação Tomada:</p>
                        <p className="text-sm text-blue-800">{selectedReport.action_taken}</p>
                      </>
                    )}
                    {selectedReport.resolved_date && (
                      <p className="text-xs text-blue-700 mt-2">
                        Resolvida em {format(new Date(selectedReport.resolved_date), "dd/MM/yyyy 'às' HH:mm")}
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}
            <DialogFooter>
              {selectedReport && (selectedReport.status === "pending" || selectedReport.status === "under_review") && (
                <>
                  <Button
                    variant="outline"
                    onClick={handleDismiss}
                    disabled={updateReportMutation.isPending}
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Descartar
                  </Button>
                  <Button
                    onClick={handleResolve}
                    disabled={updateReportMutation.isPending}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Resolver Denúncia
                  </Button>
                </>
              )}
              {selectedReport && (selectedReport.status === "resolved" || selectedReport.status === "dismissed") && (
                <Button variant="outline" onClick={() => setDetailsDialog(false)}>
                  Fechar
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}