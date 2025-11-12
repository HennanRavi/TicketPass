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
    <Card className="border-none shadow-lg">
      <CardContent className="p-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
            <Star className="w-6 h-6 text-yellow-500" fill="currentColor" />
          </div>
          <div>
            <p className="text-xl font-bold text-gray-900">
              {averageRating.toFixed(1)} / 5.0
            </p>
            <p className="text-sm text-gray-600">Média de Avaliações</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xl font-bold text-gray-900">{reviewsCount}</p>
          <p className="text-sm text-gray-600">Avaliações Recebidas</p>
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Dashboard do Organizador
            </h1>
            <p className="text-gray-600">Gerencie seus eventos e acompanhe vendas</p>
          </div>
          <div className="flex gap-3 flex-wrap">
            {isAdmin && (
              <Link to={createPageUrl("AdminBankSetup")}>
                <Button variant="outline" className="bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200 hover:bg-purple-100">
                  <Landmark className="w-4 h-4 mr-2" />
                  Conta da Plataforma
                </Button>
              </Link>
            )}
            <Link to={createPageUrl("FinancialDashboard")}>
              <Button variant="outline" className="bg-white">
                <DollarSign className="w-4 h-4 mr-2" />
                Financeiro
              </Button>
            </Link>
            {events.length > 0 && (
              <Button 
                variant="outline"
                onClick={exportToCSV}
                className="bg-white"
              >
                <Download className="w-4 h-4 mr-2" />
                Exportar CSV
              </Button>
            )}
            <Link to={createPageUrl("CreateEvent")}>
              <Button className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700">
                <Plus className="w-4 h-4 mr-2" />
                Criar Novo Evento
              </Button>
            </Link>
          </div>
        </div>

        {/* Organizer Rating */}
        {user && user.organizer_reviews_count > 0 && (
          <div className="mb-8">
            <OrganizerRating organizer={user} />
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-none shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-orange-600" />
                </div>
                <TrendingUp className="w-5 h-5 text-green-500" />
              </div>
              <p className="text-3xl font-bold text-gray-900 mb-1">{events.length}</p>
              <p className="text-sm text-gray-600">Total de Eventos</p>
              <p className="text-xs text-green-600 mt-2">{activeEvents} ativos</p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
                <BarChart3 className="w-5 h-5 text-green-500" />
              </div>
              <p className="text-3xl font-bold text-gray-900 mb-1">
                R$ {totalRevenue.toFixed(2)}
              </p>
              <p className="text-sm text-gray-600">Receita Total</p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
                <TrendingUp className="w-5 h-5 text-green-500" />
              </div>
              <p className="text-3xl font-bold text-gray-900 mb-1">{totalTicketsSold}</p>
              <p className="text-sm text-gray-600">Ingressos Vendidos</p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900 mb-1">
                {events.length > 0
                  ? `R$ ${(totalRevenue / events.length).toFixed(2)}`
                  : "R$ 0,00"}
              </p>
              <p className="text-sm text-gray-600">Média por Evento</p>
            </CardContent>
          </Card>
        </div>

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
        <Card className="border-none shadow-lg">
          <CardHeader>
            <CardTitle>Meus Eventos</CardTitle>
          </CardHeader>
          <CardContent>
            {events.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Evento</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead>Vendidos</TableHead>
                      <TableHead>Receita</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
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
                        <TableRow key={event.id}>
                          <TableCell className="font-medium">
                            <div>
                              <p className="font-semibold">{event.title}</p>
                              <p className="text-sm text-gray-500">{event.location}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            {format(new Date(event.date), "dd/MM/yyyy HH:mm")}
                          </TableCell>
                          <TableCell>
                            {event.tickets_sold || 0} / {event.capacity}
                          </TableCell>
                          <TableCell className="font-semibold">
                            R$ {eventRevenue.toFixed(2)}
                          </TableCell>
                          <TableCell>
                            <Badge
                              className={
                                event.status === "ativo"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-gray-100 text-gray-700"
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
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              {isAdmin && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleDeleteClick(event)}
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
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
                <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Nenhum evento criado
                </h3>
                <p className="text-gray-500 mb-4">
                  Comece criando seu primeiro evento
                </p>
                <Link to={createPageUrl("CreateEvent")}>
                  <Button>
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="w-5 h-5" />
              Confirmar Exclusão
            </DialogTitle>
            <DialogDescription>
              Tem certeza que deseja deletar este evento? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          
          {eventToDelete && (
            <div className="bg-red-50 rounded-lg p-4 border border-red-200">
              <p className="font-semibold text-gray-900">{eventToDelete.title}</p>
              <p className="text-sm text-gray-600 mt-1">
                {format(new Date(eventToDelete.date), "dd/MM/yyyy 'às' HH:mm")}
              </p>
              <p className="text-sm text-gray-600">{eventToDelete.location}</p>
              {eventToDelete.tickets_sold > 0 && (
                <div className="mt-3 pt-3 border-t border-red-300">
                  <p className="text-sm text-red-700 font-semibold">
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
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
              disabled={deleteEventMutation.isPending}
              className="bg-red-600 hover:bg-red-700"
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