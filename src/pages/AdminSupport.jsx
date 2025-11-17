import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { MessageSquare, Search, Filter, CheckCircle2, Clock, AlertCircle, Mail, User, Calendar, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";

const categoryLabels = {
  tecnico: "Técnico",
  financeiro: "Financeiro",
  evento: "Evento",
  ingresso: "Ingresso",
  outro: "Outro",
};

const statusColors = {
  pendente: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  em_andamento: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  resolvido: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  fechado: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
};

const priorityColors = {
  baixa: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
  media: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  alta: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
};

export default function AdminSupport() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    base44.auth.me().then((u) => {
      if (u.role !== "admin") {
        navigate(createPageUrl("Home"));
        toast.error("Acesso negado");
      } else {
        setUser(u);
      }
    }).catch(() => {
      navigate(createPageUrl("Home"));
    });
  }, []);

  const { data: messages = [], isLoading } = useQuery({
    queryKey: ["support-messages"],
    queryFn: () => base44.entities.SupportMessage.list("-created_date"),
    enabled: !!user,
    initialData: [],
  });

  const updateMessageMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.SupportMessage.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["support-messages"] });
      toast.success("Mensagem atualizada!");
      setShowDetails(false);
    },
  });

  const filteredMessages = messages.filter((msg) => {
    const matchesSearch = 
      !searchTerm ||
      msg.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.message?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.user_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.user_email?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus === "all" || msg.status === filterStatus;
    const matchesCategory = filterCategory === "all" || msg.category === filterCategory;
    const matchesPriority = filterPriority === "all" || msg.priority === filterPriority;

    return matchesSearch && matchesStatus && matchesCategory && matchesPriority;
  });

  const messagesByStatus = {
    pendente: messages.filter(m => m.status === "pendente").length,
    em_andamento: messages.filter(m => m.status === "em_andamento").length,
    resolvido: messages.filter(m => m.status === "resolvido").length,
    fechado: messages.filter(m => m.status === "fechado").length,
  };

  const handleUpdateStatus = (status) => {
    if (!selectedMessage) return;
    updateMessageMutation.mutate({
      id: selectedMessage.id,
      data: { status },
    });
  };

  const handleUpdatePriority = (priority) => {
    if (!selectedMessage) return;
    updateMessageMutation.mutate({
      id: selectedMessage.id,
      data: { priority },
    });
  };

  if (!user || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-purple-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Gerenciar Suporte
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Visualize e responda mensagens de suporte dos usuários
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="border-none shadow-lg dark:bg-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Pendentes</p>
                  <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">
                    {messagesByStatus.pendente}
                  </p>
                </div>
                <Clock className="w-10 h-10 text-yellow-600 dark:text-yellow-400 opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg dark:bg-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Em Andamento</p>
                  <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                    {messagesByStatus.em_andamento}
                  </p>
                </div>
                <AlertCircle className="w-10 h-10 text-blue-600 dark:text-blue-400 opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg dark:bg-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Resolvidos</p>
                  <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                    {messagesByStatus.resolvido}
                  </p>
                </div>
                <CheckCircle2 className="w-10 h-10 text-green-600 dark:text-green-400 opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg dark:bg-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {messages.length}
                  </p>
                </div>
                <MessageSquare className="w-10 h-10 text-gray-400 dark:text-gray-600 opacity-50" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="border-none shadow-lg mb-6 dark:bg-gray-800">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Buscar mensagens..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 dark:bg-gray-700 dark:border-gray-600"
                />
              </div>

              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Status</SelectItem>
                  <SelectItem value="pendente">Pendente</SelectItem>
                  <SelectItem value="em_andamento">Em Andamento</SelectItem>
                  <SelectItem value="resolvido">Resolvido</SelectItem>
                  <SelectItem value="fechado">Fechado</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600">
                  <SelectValue placeholder="Categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as Categorias</SelectItem>
                  <SelectItem value="tecnico">Técnico</SelectItem>
                  <SelectItem value="financeiro">Financeiro</SelectItem>
                  <SelectItem value="evento">Evento</SelectItem>
                  <SelectItem value="ingresso">Ingresso</SelectItem>
                  <SelectItem value="outro">Outro</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterPriority} onValueChange={setFilterPriority}>
                <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600">
                  <SelectValue placeholder="Prioridade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as Prioridades</SelectItem>
                  <SelectItem value="baixa">Baixa</SelectItem>
                  <SelectItem value="media">Média</SelectItem>
                  <SelectItem value="alta">Alta</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {(searchTerm || filterStatus !== "all" || filterCategory !== "all" || filterPriority !== "all") && (
              <div className="mt-4 flex items-center gap-2">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {filteredMessages.length} mensagens encontradas
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSearchTerm("");
                    setFilterStatus("all");
                    setFilterCategory("all");
                    setFilterPriority("all");
                  }}
                  className="text-xs"
                >
                  Limpar filtros
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Messages List */}
        <div className="space-y-4">
          {filteredMessages.length > 0 ? (
            filteredMessages.map((message) => (
              <Card
                key={message.id}
                className="border-none shadow-lg hover:shadow-xl transition-all cursor-pointer dark:bg-gray-800"
                onClick={() => {
                  setSelectedMessage(message);
                  setShowDetails(true);
                }}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <Badge className={statusColors[message.status]}>
                          {message.status === "pendente" && "Pendente"}
                          {message.status === "em_andamento" && "Em Andamento"}
                          {message.status === "resolvido" && "Resolvido"}
                          {message.status === "fechado" && "Fechado"}
                        </Badge>
                        <Badge className={priorityColors[message.priority]}>
                          Prioridade {message.priority}
                        </Badge>
                        <Badge variant="outline" className="dark:border-gray-600">
                          {categoryLabels[message.category]}
                        </Badge>
                      </div>

                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                        {message.subject}
                      </h3>

                      <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                        {message.message}
                      </p>

                      <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          <span>{message.user_name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          <span>{message.user_email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>
                            {format(new Date(message.created_date), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                          </span>
                        </div>
                      </div>
                    </div>

                    <Button variant="outline" size="sm" className="dark:border-gray-600">
                      Ver Detalhes
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="border-none shadow-lg dark:bg-gray-800">
              <CardContent className="p-12 text-center">
                <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Nenhuma mensagem encontrada
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Ajuste os filtros para ver mais resultados
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Message Details Dialog */}
        <Dialog open={showDetails} onOpenChange={setShowDetails}>
          <DialogContent className="max-w-3xl dark:bg-gray-800">
            <DialogHeader>
              <DialogTitle className="dark:text-white">Detalhes da Mensagem</DialogTitle>
            </DialogHeader>

            {selectedMessage && (
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <Badge className={statusColors[selectedMessage.status]}>
                    {selectedMessage.status === "pendente" && "Pendente"}
                    {selectedMessage.status === "em_andamento" && "Em Andamento"}
                    {selectedMessage.status === "resolvido" && "Resolvido"}
                    {selectedMessage.status === "fechado" && "Fechado"}
                  </Badge>
                  <Badge className={priorityColors[selectedMessage.priority]}>
                    Prioridade {selectedMessage.priority}
                  </Badge>
                  <Badge variant="outline" className="dark:border-gray-600">
                    {categoryLabels[selectedMessage.category]}
                  </Badge>
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Assunto</Label>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white mt-1">
                    {selectedMessage.subject}
                  </p>
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Mensagem</Label>
                  <div className="mt-2 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                      {selectedMessage.message}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Nome</Label>
                    <p className="text-gray-900 dark:text-white mt-1">{selectedMessage.user_name}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email</Label>
                    <p className="text-gray-900 dark:text-white mt-1">{selectedMessage.user_email}</p>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Data</Label>
                  <p className="text-gray-900 dark:text-white mt-1">
                    {format(new Date(selectedMessage.created_date), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR })}
                  </p>
                </div>

                <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Ações</h4>
                  
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                        Alterar Status
                      </Label>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant={selectedMessage.status === "pendente" ? "default" : "outline"}
                          onClick={() => handleUpdateStatus("pendente")}
                          className="dark:border-gray-600"
                        >
                          Pendente
                        </Button>
                        <Button
                          size="sm"
                          variant={selectedMessage.status === "em_andamento" ? "default" : "outline"}
                          onClick={() => handleUpdateStatus("em_andamento")}
                          className="dark:border-gray-600"
                        >
                          Em Andamento
                        </Button>
                        <Button
                          size="sm"
                          variant={selectedMessage.status === "resolvido" ? "default" : "outline"}
                          onClick={() => handleUpdateStatus("resolvido")}
                          className="dark:border-gray-600"
                        >
                          Resolvido
                        </Button>
                        <Button
                          size="sm"
                          variant={selectedMessage.status === "fechado" ? "default" : "outline"}
                          onClick={() => handleUpdateStatus("fechado")}
                          className="dark:border-gray-600"
                        >
                          Fechado
                        </Button>
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                        Alterar Prioridade
                      </Label>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant={selectedMessage.priority === "baixa" ? "default" : "outline"}
                          onClick={() => handleUpdatePriority("baixa")}
                          className="dark:border-gray-600"
                        >
                          Baixa
                        </Button>
                        <Button
                          size="sm"
                          variant={selectedMessage.priority === "media" ? "default" : "outline"}
                          onClick={() => handleUpdatePriority("media")}
                          className="dark:border-gray-600"
                        >
                          Média
                        </Button>
                        <Button
                          size="sm"
                          variant={selectedMessage.priority === "alta" ? "default" : "outline"}
                          onClick={() => handleUpdatePriority("alta")}
                          className="dark:border-gray-600"
                        >
                          Alta
                        </Button>
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                        Responder por Email
                      </Label>
                      <Button
                        variant="outline"
                        className="w-full dark:border-gray-600"
                        onClick={() => {
                          window.location.href = `mailto:${selectedMessage.user_email}?subject=Re: ${selectedMessage.subject}`;
                        }}
                      >
                        <Mail className="w-4 h-4 mr-2" />
                        Abrir Cliente de Email
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}