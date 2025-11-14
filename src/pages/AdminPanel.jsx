import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
  Shield,
  Users,
  Calendar,
  AlertTriangle,
  TrendingUp,
  DollarSign,
  Ticket,
  Flag,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Clock,
  ChevronRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";

export default function AdminPanel() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

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

  const { data: users } = useQuery({
    queryKey: ["all-users"],
    queryFn: () => base44.entities.User.list(),
    enabled: !!user,
    initialData: [],
  });

  const { data: events } = useQuery({
    queryKey: ["all-events"],
    queryFn: () => base44.entities.Event.list(),
    enabled: !!user,
    initialData: [],
  });

  const { data: reports } = useQuery({
    queryKey: ["all-reports"],
    queryFn: () => base44.entities.Report.list("-created_date"),
    enabled: !!user,
    initialData: [],
  });

  const { data: tickets } = useQuery({
    queryKey: ["all-tickets"],
    queryFn: () => base44.entities.Ticket.list(),
    enabled: !!user,
    initialData: [],
  });

  const { data: transactions } = useQuery({
    queryKey: ["all-transactions"],
    queryFn: () => base44.entities.Transaction.list(),
    enabled: !!user,
    initialData: [],
  });

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const pendingReports = reports.filter((r) => r.status === "pending").length;
  const activeEvents = events.filter((e) => e.status === "ativo").length;
  const totalRevenue = transactions.reduce((sum, t) => sum + (t.amount || 0), 0);
  const organizers = users.filter((u) => u.user_type === "organizador").length;
  const participants = users.filter((u) => u.user_type === "participante").length;
  const recentReports = reports.slice(0, 5);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-14 h-14 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Painel Administrativo
              </h1>
              <p className="text-gray-600">
                Bem-vindo, {user.full_name}
              </p>
            </div>
          </div>
          <Alert className="bg-purple-50 border-purple-200">
            <Shield className="h-4 w-4 text-purple-600" />
            <AlertDescription className="text-sm text-purple-900">
              <strong>🛡️ Área Restrita:</strong> Este painel contém ferramentas administrativas sensíveis. 
              Use com responsabilidade.
            </AlertDescription>
          </Alert>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-none shadow-xl bg-gradient-to-br from-blue-50 to-cyan-50 hover:shadow-2xl transition-shadow cursor-pointer" onClick={() => navigate(createPageUrl("AdminUsers"))}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <ChevronRight className="w-5 h-5 text-blue-600" />
              </div>
              <p className="text-3xl font-bold text-gray-900 mb-1">{users.length}</p>
              <p className="text-sm text-gray-600">Total de Usuários</p>
              <div className="mt-3 flex gap-2">
                <Badge className="bg-blue-100 text-blue-700 text-xs">
                  {organizers} Organizadores
                </Badge>
                <Badge className="bg-cyan-100 text-cyan-700 text-xs">
                  {participants} Participantes
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-xl bg-gradient-to-br from-green-50 to-emerald-50 hover:shadow-2xl transition-shadow cursor-pointer" onClick={() => navigate(createPageUrl("AdminEvents"))}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <ChevronRight className="w-5 h-5 text-green-600" />
              </div>
              <p className="text-3xl font-bold text-gray-900 mb-1">{events.length}</p>
              <p className="text-sm text-gray-600">Total de Eventos</p>
              <div className="mt-3">
                <Badge className="bg-green-100 text-green-700 text-xs">
                  {activeEvents} Ativos
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-xl bg-gradient-to-br from-orange-50 to-red-50 hover:shadow-2xl transition-shadow cursor-pointer" onClick={() => navigate(createPageUrl("AdminReports"))}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-orange-600 rounded-xl flex items-center justify-center">
                  <Flag className="w-6 h-6 text-white" />
                </div>
                <ChevronRight className="w-5 h-5 text-orange-600" />
              </div>
              <p className="text-3xl font-bold text-gray-900 mb-1">{reports.length}</p>
              <p className="text-sm text-gray-600">Denúncias</p>
              <div className="mt-3">
                <Badge className="bg-red-100 text-red-700 text-xs">
                  {pendingReports} Pendentes
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-xl bg-gradient-to-br from-purple-50 to-pink-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
                <TrendingUp className="w-5 h-5 text-purple-600" />
              </div>
              <p className="text-3xl font-bold text-gray-900 mb-1">
                R$ {totalRevenue.toFixed(2)}
              </p>
              <p className="text-sm text-gray-600">Receita Total</p>
              <div className="mt-3">
                <Badge className="bg-purple-100 text-purple-700 text-xs">
                  {tickets.length} Ingressos
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="border-none shadow-xl mb-8">
          <CardHeader>
            <CardTitle>Ações Rápidas</CardTitle>
            <CardDescription>Acesso rápido às principais funcionalidades</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button
                onClick={() => navigate(createPageUrl("AdminUsers"))}
                className="h-auto py-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
              >
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5" />
                  <div className="text-left">
                    <p className="font-semibold">Gerenciar Usuários</p>
                    <p className="text-xs opacity-90">Visualizar e moderar usuários</p>
                  </div>
                </div>
              </Button>

              <Button
                onClick={() => navigate(createPageUrl("AdminEvents"))}
                className="h-auto py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
              >
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5" />
                  <div className="text-left">
                    <p className="font-semibold">Gerenciar Eventos</p>
                    <p className="text-xs opacity-90">Moderar e cancelar eventos</p>
                  </div>
                </div>
              </Button>

              <Button
                onClick={() => navigate(createPageUrl("AdminReports"))}
                className="h-auto py-4 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
              >
                <div className="flex items-center gap-3">
                  <Flag className="w-5 h-5" />
                  <div className="text-left">
                    <p className="font-semibold">Ver Denúncias</p>
                    <p className="text-xs opacity-90">Analisar conteúdo denunciado</p>
                  </div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Reports */}
        <Card className="border-none shadow-xl">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Denúncias Recentes</CardTitle>
                <CardDescription>Últimas denúncias recebidas</CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(createPageUrl("AdminReports"))}
              >
                Ver Todas
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {recentReports.length === 0 ? (
              <div className="text-center py-8">
                <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-3" />
                <p className="text-gray-600">Nenhuma denúncia pendente</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentReports.map((report) => (
                  <div
                    key={report.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                    onClick={() => navigate(createPageUrl("AdminReports"))}
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        report.priority === "critical" ? "bg-red-100" :
                        report.priority === "high" ? "bg-orange-100" :
                        report.priority === "medium" ? "bg-yellow-100" :
                        "bg-blue-100"
                      }`}>
                        <Flag className={`w-5 h-5 ${
                          report.priority === "critical" ? "text-red-600" :
                          report.priority === "high" ? "text-orange-600" :
                          report.priority === "medium" ? "text-yellow-600" :
                          "text-blue-600"
                        }`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">
                          {report.reported_item_title}
                        </p>
                        <p className="text-xs text-gray-500">
                          Por {report.reporter_name} • {report.reason}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        className={
                          report.status === "pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : report.status === "under_review"
                            ? "bg-blue-100 text-blue-700"
                            : report.status === "resolved"
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-700"
                        }
                      >
                        {report.status === "pending" && <Clock className="w-3 h-3 mr-1" />}
                        {report.status === "resolved" && <CheckCircle2 className="w-3 h-3 mr-1" />}
                        {report.status === "dismissed" && <XCircle className="w-3 h-3 mr-1" />}
                        {report.status === "pending" ? "Pendente" :
                         report.status === "under_review" ? "Em Análise" :
                         report.status === "resolved" ? "Resolvida" : "Descartada"}
                      </Badge>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}