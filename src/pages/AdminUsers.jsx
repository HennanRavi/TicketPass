import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
  Users,
  ArrowLeft,
  Search,
  Filter,
  Ban,
  CheckCircle2,
  Mail,
  UserCog,
  Shield,
  AlertTriangle,
  MoreVertical,
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

export default function AdminUsers() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [selectedUser, setSelectedUser] = useState(null);
  const [actionDialog, setActionDialog] = useState(null); // 'ban', 'role', null

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

  const { data: users, isLoading } = useQuery({
    queryKey: ["admin-all-users"],
    queryFn: () => base44.entities.User.list("-created_date"),
    enabled: !!user,
    initialData: [],
  });

  const updateUserMutation = useMutation({
    mutationFn: async ({ userId, data }) => {
      return await base44.entities.User.update(userId, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-all-users"] });
      toast.success("Usuário atualizado com sucesso!");
      setActionDialog(null);
      setSelectedUser(null);
    },
    onError: () => {
      toast.error("Erro ao atualizar usuário");
    },
  });

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      !searchTerm ||
      u.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole =
      roleFilter === "all" ||
      (roleFilter === "admin" && u.role === "admin") ||
      (roleFilter === "organizer" && u.user_type === "organizador") ||
      (roleFilter === "participant" && u.user_type === "participante");

    return matchesSearch && matchesRole;
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
            <Users className="w-8 h-8 text-blue-600" />
            Gerenciamento de Usuários
          </h1>
          <p className="text-gray-600">
            Visualize e modere todos os usuários da plataforma
          </p>
        </div>

        {/* Filters */}
        <Card className="border-none shadow-xl mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Buscar por nome ou email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Tipos</SelectItem>
                  <SelectItem value="admin">Administradores</SelectItem>
                  <SelectItem value="organizer">Organizadores</SelectItem>
                  <SelectItem value="participant">Participantes</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="border-none shadow-lg">
            <CardContent className="p-4">
              <p className="text-2xl font-bold text-gray-900">{users.length}</p>
              <p className="text-sm text-gray-600">Total de Usuários</p>
            </CardContent>
          </Card>
          <Card className="border-none shadow-lg">
            <CardContent className="p-4">
              <p className="text-2xl font-bold text-gray-900">
                {users.filter(u => u.role === "admin").length}
              </p>
              <p className="text-sm text-gray-600">Administradores</p>
            </CardContent>
          </Card>
          <Card className="border-none shadow-lg">
            <CardContent className="p-4">
              <p className="text-2xl font-bold text-gray-900">
                {users.filter(u => u.user_type === "organizador").length}
              </p>
              <p className="text-sm text-gray-600">Organizadores</p>
            </CardContent>
          </Card>
          <Card className="border-none shadow-lg">
            <CardContent className="p-4">
              <p className="text-2xl font-bold text-gray-900">
                {users.filter(u => u.user_type === "participante").length}
              </p>
              <p className="text-sm text-gray-600">Participantes</p>
            </CardContent>
          </Card>
        </div>

        {/* Users Table */}
        <Card className="border-none shadow-xl">
          <CardHeader>
            <CardTitle>Lista de Usuários ({filteredUsers.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Nenhum usuário encontrado</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Usuário</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Cadastro</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((u) => (
                      <TableRow key={u.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            {u.profile_image ? (
                              <img
                                src={u.profile_image}
                                alt={u.full_name}
                                className="w-10 h-10 rounded-full object-cover"
                              />
                            ) : (
                              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                <span className="text-blue-600 font-semibold">
                                  {u.full_name?.charAt(0) || "?"}
                                </span>
                              </div>
                            )}
                            <div>
                              <p className="font-medium text-gray-900">{u.full_name}</p>
                              <p className="text-xs text-gray-500">ID: {u.id.slice(0, 8)}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-gray-400" />
                            <span className="text-sm">{u.email}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={
                              u.role === "admin"
                                ? "bg-purple-100 text-purple-700"
                                : u.user_type === "organizador"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-green-100 text-green-700"
                            }
                          >
                            {u.role === "admin" ? (
                              <>
                                <Shield className="w-3 h-3 mr-1" />
                                Admin
                              </>
                            ) : u.user_type === "organizador" ? (
                              "Organizador"
                            ) : (
                              "Participante"
                            )}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-gray-600">
                          {format(new Date(u.created_date), "dd/MM/yyyy")}
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={
                              u.is_banned
                                ? "bg-red-100 text-red-700"
                                : "bg-green-100 text-green-700"
                            }
                          >
                            {u.is_banned ? (
                              <>
                                <Ban className="w-3 h-3 mr-1" />
                                Banido
                              </>
                            ) : (
                              <>
                                <CheckCircle2 className="w-3 h-3 mr-1" />
                                Ativo
                              </>
                            )}
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
                                onClick={() => {
                                  setSelectedUser(u);
                                  setActionDialog("ban");
                                }}
                                className={u.is_banned ? "text-green-600" : "text-red-600"}
                              >
                                {u.is_banned ? (
                                  <>
                                    <CheckCircle2 className="w-4 h-4 mr-2" />
                                    Desbanir Usuário
                                  </>
                                ) : (
                                  <>
                                    <Ban className="w-4 h-4 mr-2" />
                                    Banir Usuário
                                  </>
                                )}
                              </DropdownMenuItem>
                              {u.role !== "admin" && (
                                <DropdownMenuItem
                                  onClick={() => {
                                    setSelectedUser(u);
                                    setActionDialog("role");
                                  }}
                                >
                                  <UserCog className="w-4 h-4 mr-2" />
                                  Alterar Tipo
                                </DropdownMenuItem>
                              )}
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

        {/* Ban/Unban Dialog */}
        <Dialog open={actionDialog === "ban"} onOpenChange={() => setActionDialog(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-orange-600" />
                {selectedUser?.is_banned ? "Desbanir Usuário" : "Banir Usuário"}
              </DialogTitle>
              <DialogDescription>
                {selectedUser?.is_banned
                  ? "Tem certeza que deseja desbanir este usuário? Ele poderá acessar a plataforma novamente."
                  : "Tem certeza que deseja banir este usuário? Ele não poderá mais acessar a plataforma."}
              </DialogDescription>
            </DialogHeader>
            {selectedUser && (
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="font-semibold text-gray-900">{selectedUser.full_name}</p>
                <p className="text-sm text-gray-600">{selectedUser.email}</p>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setActionDialog(null)}>
                Cancelar
              </Button>
              <Button
                onClick={() => {
                  if (selectedUser) {
                    updateUserMutation.mutate({
                      userId: selectedUser.id,
                      data: { is_banned: !selectedUser.is_banned },
                    });
                  }
                }}
                className={
                  selectedUser?.is_banned
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-red-600 hover:bg-red-700"
                }
              >
                {selectedUser?.is_banned ? "Desbanir" : "Banir"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Change Role Dialog */}
        <Dialog open={actionDialog === "role"} onOpenChange={() => setActionDialog(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Alterar Tipo de Usuário</DialogTitle>
              <DialogDescription>
                Altere o tipo de perfil do usuário na plataforma
              </DialogDescription>
            </DialogHeader>
            {selectedUser && (
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="font-semibold text-gray-900">{selectedUser.full_name}</p>
                  <p className="text-sm text-gray-600">{selectedUser.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Tipo de Perfil
                  </label>
                  <Select
                    defaultValue={selectedUser.user_type || "participante"}
                    onValueChange={(value) => {
                      updateUserMutation.mutate({
                        userId: selectedUser.id,
                        data: { user_type: value },
                      });
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="participante">
                        🎉 Participante
                      </SelectItem>
                      <SelectItem value="organizador">
                        👔 Organizador
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setActionDialog(null)}>
                Fechar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}