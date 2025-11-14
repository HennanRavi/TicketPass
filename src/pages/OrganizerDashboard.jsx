import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate, Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
  TrendingUp,
  DollarSign,
  Users,
  Calendar,
  Plus,
  Edit,
  Star,
  BarChart3,
  Download,
  Trash2,
  AlertTriangle,
  Landmark,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";
import SalesChart from "../components/dashboard/SalesChart";
import OccupancyChart from "../components/dashboard/OccupancyChart";
import RevenueChart from "../components/dashboard/RevenueChart";

// OrganizerRating Component
const OrganizerRating = ({ organizer }) => {
  if (!organizer || organizer.organizer_reviews_count === 0) {
    return null;
  }

  const averageRating = organizer.organizer_average_rating || 0;
  const reviewsCount = organizer.organizer_reviews_count || 0;

  return (
    <Card className="border-none shadow-lg dark:bg-gray-800">
      <CardContent className="p-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/40 rounded-xl flex items-center justify-center">
            <Star className="w-6 h-6 text-yellow-500 dark:text-yellow-400" fill="currentColor" />
          </div>
          <div>
            <p className="text-xl font-bold text-gray-900 dark:text-white">
              {averageRating.toFixed(1)} / 5.0
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Média de Avaliações</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xl font-bold text-gray-900 dark:text-white">{reviewsCount}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Avaliações Recebidas</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default function OrganizerDashboard() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [user, setUser] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);

  useEffect(() => {
    base44.auth
      .me()
      .then((u) => {
        if (u.role !== "admin" && u.user_type !== "organizador") {
          navigate(createPageUrl("Home"));
          toast.error("Apenas organizadores podem acessar esta página");
          return;
        }
        setUser(u);
      })
      .catch(() => {
        base44.auth.redirectToLogin(window.location.href);
      });
  }, []);

  const { data: events, isLoading } = useQuery({
    queryKey: ["organizer-events", user?.id],
    queryFn: () => base44.entities.Event.filter({ organizer_id: user.id }, "-created_date"),
    enabled: !!user,
    initialData: [],
  });

  const { data: allTickets } = useQuery({
    queryKey: ["organizer-tickets", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const eventIds = events.map((e) => e.id);
      if (eventIds.length === 0) return [];
      const allTickets = await base44.entities.Ticket.list();
      return allTickets.filter((t) => eventIds.includes(t.event_id));
    },
    enabled: !!user && events.length > 0,
    initialData: [],
  });

  const deleteEventMutation = useMutation({
    mutationFn: async (eventId) => {
      await base44.entities.Event.delete(eventId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organizer-events"] });
      queryClient.invalidateQueries({ queryKey: ["events"] });
      toast.success("Evento deletado com sucesso!");
      setDeleteDialogOpen(false);
      setEventToDelete(null);
    },
    onError: () => {
      toast.error("Erro ao deletar evento");
    },
  });

  const handleDeleteClick = (event) => {
    setEventToDelete(event);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (eventToDelete) {
      deleteEventMutation.mutate(eventToDelete.id);
    }
  };

  const exportToCSV = () => {
    const csvRows = [];
    
    // Header
    csvRows.push([
      'Evento',
      'Local',
      'Cidade',
      'Estado',
      'Data',
      'Categoria',
      'Capacidade',
      'Ingressos Vendidos',
      'Taxa de Ocupação (%)',
      'Preço Unitário (R$)',
      'Receita Total (R$)',
      'Status'
    ].join(','));

    // Data
    events.forEach(event => {
      const eventTickets = allTickets.filter(t => t.event_id === event.id);
      const eventRevenue = eventTickets.reduce((sum, t) => sum + (t.total_price || 0), 0);
      const occupancyRate = ((event.tickets_sold || 0) / event.capacity * 100).toFixed(2);

      csvRows.push([
        `"${event.title}"`,
        `"${event.location}"`,
        event.city,
        event.state,
        format(new Date(event.date), 'dd/MM/yyyy HH:mm'),
        event.category,
        event.capacity,
        event.tickets_sold || 0,
        occupancyRate,
        event.price.toFixed(2),
        eventRevenue.toFixed(2),
        event.status
      ].join(','));
    });

    // Create and download file
    const csvContent = csvRows.join('\n');
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `relatorio-eventos-${format(new Date(), 'yyyy-MM-dd')}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success("Relatório exportado com sucesso!");
  };

  const totalRevenue = allTickets.reduce((sum, t) => sum + (t.total_price || 0), 0);
  const totalTicketsSold = allTickets.reduce((sum, t) => sum + (t.quantity || 0), 0);
  const activeEvents = events.filter((e) => e.status === "ativo").length;
  const isAdmin = user?.role === "admin";

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-purple-400"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-purple-950">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-blue-500/90 via-blue-400/80 to-white/90 dark:from-purple-900/90 dark:via-purple-800/80 dark:to-gray-900/90 backdrop-blur-3xl">
        {/* Decorative blur circles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400/30 dark:bg-purple-600/20 rounded-full blur-3xl animate-float-slow"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white/40 dark:bg-purple-900/30 rounded-full blur-3xl animate-float-reverse animate-pulse-glow"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 text-shadow-strong">
                Dashboard do Organizador
              </h1>
              <p className="text-white/95 text-shadow-medium">Gerencie seus eventos e acompanhe vendas</p>
            </div>
            <div className="flex gap-3 flex-wrap">
              {isAdmin && (
                <Link to={createPageUrl("AdminBankSetup")}>
                  <Button variant="outline" className="bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20">
                    <Landmark className="w-4 h-4 mr-2" />
                    Conta da Plataforma
                  </Button>
                </Link>
              )}
              <Link to={createPageUrl("FinancialDashboard")}>
                <Button variant="outline" className="bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20">
                  <DollarSign className="w-4 h-4 mr-2" />
                  Financeiro
                </Button>
              </Link>
              {events.length > 0 && (
                <Button 
                  variant="outline"
                  onClick={exportToCSV}
                  className="bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Exportar CSV
                </Button>
              )}
              <Link to={createPageUrl("CreateEvent")}>
                <Button className="bg-white text-green-600 hover:bg-gray-50 dark:text-orange-600 shadow-lg">
                  <Plus className="w-4 h-4 mr-2" />
                  Criar Novo Evento
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white/20 dark:bg-gray-800/40 backdrop-blur-md rounded-xl p-4 border border-white/30 dark:border-gray-700/30 shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="w-10 h-10 bg-orange-600 dark:bg-pink-600 rounded-xl flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <p className="text-3xl font-bold text-white mb-1 text-shadow-medium">{events.length}</p>
              <p className="text-sm text-white/95 text-shadow-soft">Total de Eventos</p>
              <p className="text-xs text-white/90 mt-2 text-shadow-soft">{activeEvents} ativos</p>
            </div>

            <div className="bg-white/20 dark:bg-gray-800/40 backdrop-blur-md rounded-xl p-4 border border-white/30 dark:border-gray-700/30 shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="w-10 h-10 bg-green-600 dark:bg-orange-600 rounded-xl flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-white" />
                </div>
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <p className="text-3xl font-bold text-white mb-1 text-shadow-medium">
                R$ {totalRevenue.toFixed(2)}
              </p>
              <p className="text-sm text-white/95 text-shadow-soft">Receita Total</p>
            </div>

            <div className="bg-white/20 dark:bg-gray-800/40 backdrop-blur-md rounded-xl p-4 border border-white/30 dark:border-gray-700/30 shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="w-10 h-10 bg-purple-600 dark:bg-indigo-600 rounded-xl flex items-center justify-center">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <p className="text-3xl font-bold text-white mb-1 text-shadow-medium">{totalTicketsSold}</p>
              <p className="text-sm text-white/95 text-shadow-soft">Ingressos Vendidos</p>
            </div>

            <div className="bg-white/20 dark:bg-gray-800/40 backdrop-blur-md rounded-xl p-4 border border-white/30 dark:border-gray-700/30 shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="w-10 h-10 bg-blue-600 dark:bg-purple-600 rounded-xl flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-white" />
                </div>
              </div>
              <p className="text-3xl font-bold text-white mb-1 text-shadow-medium">
                {events.length > 0
                  ? `R$ ${(totalRevenue / events.length).toFixed(2)}`
                  : "R$ 0,00"}
              </p>
              <p className="text-sm text-white/95 text-shadow-soft">Média por Evento</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Organizer Rating */}
        {user && user.organizer_reviews_count > 0 && (
          <div className="mb-8">
            <OrganizerRating organizer={user} />
          </div>
        )}

        {/* Charts */}
        {events.length > 0 && allTickets.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <SalesChart events={events} tickets={allTickets} />
            <RevenueChart events={events} tickets={allTickets} />
          </div>
        )}

        {events.length > 0 && (
          <div className="mb-8">
            <OccupancyChart events={events} />
          </div>
        )}

        {/* Events Table */}
        <Card className="border-none shadow-lg dark:bg-gray-800">
          <CardHeader>
            <CardTitle className="dark:text-white">Meus Eventos</CardTitle>
          </CardHeader>
          <CardContent>
            {events.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="dark:border-gray-700">
                      <TableHead className="dark:text-gray-300">Evento</TableHead>
                      <TableHead className="dark:text-gray-300">Data</TableHead>
                      <TableHead className="dark:text-gray-300">Vendidos</TableHead>
                      <TableHead className="dark:text-gray-300">Receita</TableHead>
                      <TableHead className="dark:text-gray-300">Status</TableHead>
                      <TableHead className="text-right dark:text-gray-300">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {events.map((event) => {
                      const eventTickets = allTickets.filter(
                        (t) => t.event_id === event.id
                      );
                      const eventRevenue = eventTickets.reduce(
                        (sum, t) => sum + (t.total_price || 0),
                        0
                      );

                      return (
                        <TableRow key={event.id} className="dark:border-gray-700">
                          <TableCell className="font-medium">
                            <div>
                              <p className="font-semibold dark:text-white">{event.title}</p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">{event.location}</p>
                            </div>
                          </TableCell>
                          <TableCell className="dark:text-gray-300">
                            {format(new Date(event.date), "dd/MM/yyyy HH:mm")}
                          </TableCell>
                          <TableCell className="dark:text-gray-300">
                            {event.tickets_sold || 0} / {event.capacity}
                          </TableCell>
                          <TableCell className="font-semibold dark:text-white">
                            R$ {eventRevenue.toFixed(2)}
                          </TableCell>
                          <TableCell>
                            <Badge
                              className={
                                event.status === "ativo"
                                  ? "bg-green-100 dark:bg-orange-900/40 text-green-700 dark:text-orange-400"
                                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                              }
                            >
                              {event.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() =>
                                  navigate(
                                    `${createPageUrl("CreateEvent")}?id=${event.id}`
                                  )
                                }
                                className="dark:hover:bg-gray-700"
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              {isAdmin && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleDeleteClick(event)}
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-12">
                <Calendar className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Nenhum evento criado
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  Comece criando seu primeiro evento
                </p>
                <Link to={createPageUrl("CreateEvent")}>
                  <Button className="bg-blue-600 hover:bg-blue-700 dark:bg-purple-600 dark:hover:bg-purple-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Criar Evento
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="dark:bg-gray-800 dark:border-gray-700">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600 dark:text-red-400">
              <AlertTriangle className="w-5 h-5" />
              Confirmar Exclusão
            </DialogTitle>
            <DialogDescription className="dark:text-gray-400">
              Tem certeza que deseja deletar este evento? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          
          {eventToDelete && (
            <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 border border-red-200 dark:border-red-800">
              <p className="font-semibold text-gray-900 dark:text-white">{eventToDelete.title}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {format(new Date(eventToDelete.date), "dd/MM/yyyy 'às' HH:mm")}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{eventToDelete.location}</p>
              {eventToDelete.tickets_sold > 0 && (
                <div className="mt-3 pt-3 border-t border-red-300 dark:border-red-800">
                  <p className="text-sm text-red-700 dark:text-red-400 font-semibold">
                    ⚠️ Atenção: Este evento possui {eventToDelete.tickets_sold} ingresso(s) vendido(s)!
                  </p>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setDeleteDialogOpen(false);
                setEventToDelete(null);
              }}
              disabled={deleteEventMutation.isPending}
              className="dark:border-gray-700 dark:text-gray-300"
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
              disabled={deleteEventMutation.isPending}
              className="bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800"
            >
              {deleteEventMutation.isPending ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Deletando...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Deletar Evento
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}