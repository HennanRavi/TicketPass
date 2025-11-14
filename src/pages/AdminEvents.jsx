import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
  Calendar,
  ArrowLeft,
  Search,
  Filter,
  Trash2,
  Ban,
  Eye,
  MoreVertical,
  CheckCircle2,
  XCircle,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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

export default function AdminEvents() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [actionDialog, setActionDialog] = useState(null); // 'delete', 'cancel', 'reactivate'

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

  const { data: events, isLoading } = useQuery({
    queryKey: ["admin-all-events"],
    queryFn: () => base44.entities.Event.list("-created_date"),
    enabled: !!user,
    initialData: [],
  });

  const updateEventMutation = useMutation({
    mutationFn: async ({ eventId, data }) => {
      return await base44.entities.Event.update(eventId, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-all-events"] });
      toast.success("Evento atualizado com sucesso!");
      setActionDialog(null);
      setSelectedEvent(null);
    },
    onError: () => {
      toast.error("Erro ao atualizar evento");
    },
  });

  const deleteEventMutation = useMutation({
    mutationFn: async (eventId) => {
      return await base44.entities.Event.delete(eventId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-all-events"] });
      toast.success("Evento deletado com sucesso!");
      setActionDialog(null);
      setSelectedEvent(null);
    },
    onError: () => {
      toast.error("Erro ao deletar evento");
    },
  });

  const filteredEvents = events.filter((e) => {
    const matchesSearch =
      !searchTerm ||
      e.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.organizer_name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus =
      statusFilter === "all" || e.status === statusFilter;

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
            <Calendar className="w-8 h-8 text-green-600" />
            Gerenciamento de Eventos
          </h1>
          <p className="text-gray-600">
            Visualize e modere todos os eventos da plataforma
          </p>
        </div>

        {/* Filters */}
        <Card className="border-none shadow-xl mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Buscar por título, local ou organizador..."
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
                  <SelectItem value="ativo">Ativos</SelectItem>
                  <SelectItem value="cancelado">Cancelados</SelectItem>
                  <SelectItem value="encerrado">Encerrados</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="border-none shadow-lg">
            <CardContent className="p-4">
              <p className="text-2xl font-bold text-gray-900">{events.length}</p>
              <p className="text-sm text-gray-600">Total de Eventos</p>
            </CardContent>
          </Card>
          <Card className="border-none shadow-lg bg-green-50">
            <CardContent className="p-4">
              <p className="text-2xl font-bold text-green-700">
                {events.filter(e => e.status === "ativo").length}
              </p>
              <p className="text-sm text-green-600">Ativos</p>
            </CardContent>
          </Card>
          <Card className="border-none shadow-lg bg-red-50">
            <CardContent className="p-4">
              <p className="text-2xl font-bold text-red-700">
                {events.filter(e => e.status === "cancelado").length}
              </p>
              <p className="text-sm text-red-600">Cancelados</p>
            </CardContent>
          </Card>
          <Card className="border-none shadow-lg bg-gray-50">
            <CardContent className="p-4">
              <p className="text-2xl font-bold text-gray-700">
                {events.filter(e => e.status === "encerrado").length}
              </p>
              <p className="text-sm text-gray-600">Encerrados</p>
            </CardContent>
          </Card>
        </div>

        {/* Events Table */}
        <Card className="border-none shadow-xl">
          <CardHeader>
            <CardTitle>Lista de Eventos ({filteredEvents.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
              </div>
            ) : filteredEvents.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Nenhum evento encontrado</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Evento</TableHead>
                      <TableHead>Organizador</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead>Ingressos</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredEvents.map((event) => (
                      <TableRow key={event.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            {event.image_url ? (
                              <img
                                src={event.image_url}
                                alt={event.title}
                                className="w-16 h-16 rounded-lg object-cover"
                              />
                            ) : (
                              <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center">
                                <Calendar className="w-8 h-8 text-green-600" />
                              </div>
                            )}
                            <div>
                              <p className="font-medium text-gray-900 line-clamp-1">
                                {event.title}
                              </p>
                              <p className="text-xs text-gray-500">{event.location}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <p className="text-sm text-gray-900">{event.organizer_name}</p>
                          <p className="text-xs text-gray-500">ID: {event.organizer_id?.slice(0, 8)}</p>
                        </TableCell>
                        <TableCell className="text-sm text-gray-600">
                          {format(new Date(event.date), "dd/MM/yyyy HH:mm")}
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <p className="font-semibold text-gray-900">
                              {event.tickets_sold || 0} / {event.capacity}
                            </p>
                            <p className="text-xs text-gray-500">
                              {Math.round(((event.tickets_sold || 0) / event.capacity) * 100)}% ocupação
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={
                              event.status === "ativo"
                                ? "bg-green-100 text-green-700"
                                : event.status === "cancelado"
                                ? "bg-red-100 text-red-700"
                                : "bg-gray-100 text-gray-700"
                            }
                          >
                            {event.status === "ativo" && <CheckCircle2 className="w-3 h-3 mr-1" />}
                            {event.status === "cancelado" && <XCircle className="w-3 h-3 mr-1" />}
                            {event.status === "ativo" ? "Ativo" :
                             event.status === "cancelado" ? "Cancelado" : "Encerrado"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => navigate(`${createPageUrl("EventDetails")}?id=${event.id}`)}
                              >
                                <Eye className="w-4 h-4 mr-2" />
                                Ver Detalhes
                              </DropdownMenuItem>
                              {event.status === "ativo" && (
                                <DropdownMenuItem
                                  onClick={() => {
                                    setSelectedEvent(event);
                                    setActionDialog("cancel");
                                  }}
                                  className="text-orange-600"
                                >
                                  <Ban className="w-4 h-4 mr-2" />
                                  Cancelar Evento
                                </DropdownMenuItem>
                              )}
                              {event.status === "cancelado" && (
                                <DropdownMenuItem
                                  onClick={() => {
                                    setSelectedEvent(event);
                                    setActionDialog("reactivate");
                                  }}
                                  className="text-green-600"
                                >
                                  <CheckCircle2 className="w-4 h-4 mr-2" />
                                  Reativar Evento
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedEvent(event);
                                  setActionDialog("delete");
                                }}
                                className="text-red-600"
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Deletar Evento
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Cancel Event Dialog */}
        <Dialog open={actionDialog === "cancel"} onOpenChange={() => setActionDialog(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-orange-600" />
                Cancelar Evento
              </DialogTitle>
              <DialogDescription>
                Tem certeza que deseja cancelar este evento? Esta ação afetará todos os compradores de ingressos.
              </DialogDescription>
            </DialogHeader>
            {selectedEvent && (
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="font-semibold text-gray-900">{selectedEvent.title}</p>
                <p className="text-sm text-gray-600">{selectedEvent.location}</p>
                <p className="text-xs text-orange-600 mt-2">
                  ⚠️ {selectedEvent.tickets_sold || 0} ingresso(s) vendido(s)
                </p>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setActionDialog(null)}>
                Cancelar
              </Button>
              <Button
                onClick={() => {
                  if (selectedEvent) {
                    updateEventMutation.mutate({
                      eventId: selectedEvent.id,
                      data: { status: "cancelado" },
                    });
                  }
                }}
                className="bg-orange-600 hover:bg-orange-700"
              >
                Cancelar Evento
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Reactivate Event Dialog */}
        <Dialog open={actionDialog === "reactivate"} onOpenChange={() => setActionDialog(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                Reativar Evento
              </DialogTitle>
              <DialogDescription>
                Deseja reativar este evento? Ele voltará a ficar disponível para compra de ingressos.
              </DialogDescription>
            </DialogHeader>
            {selectedEvent && (
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="font-semibold text-gray-900">{selectedEvent.title}</p>
                <p className="text-sm text-gray-600">{selectedEvent.location}</p>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setActionDialog(null)}>
                Cancelar
              </Button>
              <Button
                onClick={() => {
                  if (selectedEvent) {
                    updateEventMutation.mutate({
                      eventId: selectedEvent.id,
                      data: { status: "ativo" },
                    });
                  }
                }}
                className="bg-green-600 hover:bg-green-700"
              >
                Reativar Evento
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Event Dialog */}
        <Dialog open={actionDialog === "delete"} onOpenChange={() => setActionDialog(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-red-600">
                <Trash2 className="w-5 h-5" />
                Deletar Evento
              </DialogTitle>
              <DialogDescription>
                Esta ação é IRREVERSÍVEL! O evento e todos os dados relacionados serão permanentemente deletados.
              </DialogDescription>
            </DialogHeader>
            {selectedEvent && (
              <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                <p className="font-semibold text-gray-900">{selectedEvent.title}</p>
                <p className="text-sm text-gray-600">{selectedEvent.location}</p>
                {selectedEvent.tickets_sold > 0 && (
                  <p className="text-sm text-red-700 font-semibold mt-2">
                    ⚠️ Este evento possui {selectedEvent.tickets_sold} ingresso(s) vendido(s)!
                  </p>
                )}
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setActionDialog(null)}>
                Cancelar
              </Button>
              <Button
                onClick={() => {
                  if (selectedEvent) {
                    deleteEventMutation.mutate(selectedEvent.id);
                  }
                }}
                variant="destructive"
                className="bg-red-600 hover:bg-red-700"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Deletar Permanentemente
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}