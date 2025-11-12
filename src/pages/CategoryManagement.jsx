import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
  FolderTree,
  Plus,
  Edit,
  Trash2,
  Search,
  ArrowUpDown,
  Check,
  X,
  AlertTriangle,
  Tag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";

export default function CategoryManagement() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("name");
  
  // Dialog states
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  
  // Form states
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    icon: "",
    color: "#3B82F6",
    active: true,
    order: 0,
  });

  useEffect(() => {
    base44.auth
      .me()
      .then((u) => {
        if (u.role !== "admin") {
          toast.error("Acesso negado. Apenas administradores podem gerenciar categorias.");
          navigate(createPageUrl("Home"));
        }
        setUser(u);
      })
      .catch(() => {
        base44.auth.redirectToLogin(window.location.href);
      });
  }, []);

  const { data: categories, isLoading } = useQuery({
    queryKey: ["event-categories"],
    queryFn: () => base44.entities.EventCategory.list(),
    enabled: !!user,
    initialData: [],
  });

  const { data: events } = useQuery({
    queryKey: ["all-events"],
    queryFn: () => base44.entities.Event.list(),
    enabled: !!user,
    initialData: [],
  });

  const createCategoryMutation = useMutation({
    mutationFn: (categoryData) => base44.entities.EventCategory.create(categoryData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["event-categories"] });
      toast.success("Categoria criada com sucesso!");
      setShowCreateDialog(false);
      resetForm();
    },
    onError: (error) => {
      toast.error("Erro ao criar categoria");
      console.error(error);
    },
  });

  const updateCategoryMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.EventCategory.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["event-categories"] });
      toast.success("Categoria atualizada com sucesso!");
      setShowEditDialog(false);
      setSelectedCategory(null);
      resetForm();
    },
    onError: (error) => {
      toast.error("Erro ao atualizar categoria");
      console.error(error);
    },
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: (id) => base44.entities.EventCategory.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["event-categories"] });
      toast.success("Categoria excluída com sucesso!");
      setShowDeleteDialog(false);
      setSelectedCategory(null);
    },
    onError: (error) => {
      toast.error("Erro ao excluir categoria");
      console.error(error);
    },
  });

  const resetForm = () => {
    setFormData({
      name: "",
      slug: "",
      description: "",
      icon: "",
      color: "#3B82F6",
      active: true,
      order: 0,
    });
  };

  const handleCreate = () => {
    if (!formData.name || !formData.slug) {
      toast.error("Nome e slug são obrigatórios");
      return;
    }

    // Check for duplicate slug
    if (categories.some((cat) => cat.slug === formData.slug)) {
      toast.error("Já existe uma categoria com este slug");
      return;
    }

    createCategoryMutation.mutate(formData);
  };

  const handleEdit = () => {
    if (!formData.name || !formData.slug) {
      toast.error("Nome e slug são obrigatórios");
      return;
    }

    // Check for duplicate slug (excluding current category)
    if (
      categories.some(
        (cat) => cat.slug === formData.slug && cat.id !== selectedCategory.id
      )
    ) {
      toast.error("Já existe uma categoria com este slug");
      return;
    }

    updateCategoryMutation.mutate({
      id: selectedCategory.id,
      data: formData,
    });
  };

  const handleDelete = () => {
    if (!selectedCategory) return;

    // Check if category has associated events
    const associatedEvents = events.filter(
      (event) => event.category === selectedCategory.slug
    );

    if (associatedEvents.length > 0) {
      toast.error(
        `Não é possível excluir. Existem ${associatedEvents.length} evento(s) associado(s) a esta categoria.`
      );
      return;
    }

    deleteCategoryMutation.mutate(selectedCategory.id);
  };

  const openEditDialog = (category) => {
    setSelectedCategory(category);
    setFormData({
      name: category.name || "",
      slug: category.slug || "",
      description: category.description || "",
      icon: category.icon || "",
      color: category.color || "#3B82F6",
      active: category.active !== undefined ? category.active : true,
      order: category.order || 0,
    });
    setShowEditDialog(true);
  };

  const openDeleteDialog = (category) => {
    setSelectedCategory(category);
    setShowDeleteDialog(true);
  };

  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleNameChange = (name) => {
    setFormData({
      ...formData,
      name,
      slug: generateSlug(name),
    });
  };

  const filteredCategories = categories
    .filter((cat) =>
      cat.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cat.slug?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cat.description?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortOrder === "name") {
        return (a.name || "").localeCompare(b.name || "");
      } else if (sortOrder === "order") {
        return (a.order || 0) - (b.order || 0);
      } else if (sortOrder === "created") {
        return new Date(b.created_date) - new Date(a.created_date);
      }
      return 0;
    });

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const getEventsCount = (categorySlug) => {
    return events.filter((event) => event.category === categorySlug).length;
  };

  return (
    <div className="min-h-screen py-8 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                <FolderTree className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Gerenciar Categorias
                </h1>
                <p className="text-gray-600">
                  Organize as categorias de eventos da plataforma
                </p>
              </div>
            </div>
            <Button
              onClick={() => {
                resetForm();
                setShowCreateDialog(true);
              }}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nova Categoria
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-none shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Tag className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">
                      {categories.length}
                    </p>
                    <p className="text-sm text-gray-600">Total de Categorias</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Check className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">
                      {categories.filter((c) => c.active).length}
                    </p>
                    <p className="text-sm text-gray-600">Categorias Ativas</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <FolderTree className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">
                      {events.length}
                    </p>
                    <p className="text-sm text-gray-600">Eventos Cadastrados</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Filters */}
        <Card className="border-none shadow-lg mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Buscar categorias..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant={sortOrder === "name" ? "default" : "outline"}
                  onClick={() => setSortOrder("name")}
                  size="sm"
                >
                  <ArrowUpDown className="w-4 h-4 mr-2" />
                  Nome
                </Button>
                <Button
                  variant={sortOrder === "order" ? "default" : "outline"}
                  onClick={() => setSortOrder("order")}
                  size="sm"
                >
                  <ArrowUpDown className="w-4 h-4 mr-2" />
                  Ordem
                </Button>
                <Button
                  variant={sortOrder === "created" ? "default" : "outline"}
                  onClick={() => setSortOrder("created")}
                  size="sm"
                >
                  <ArrowUpDown className="w-4 h-4 mr-2" />
                  Recentes
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Categories Table */}
        <Card className="border-none shadow-lg">
          <CardContent className="p-0">
            {filteredCategories.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Categoria</TableHead>
                      <TableHead>Slug</TableHead>
                      <TableHead>Descrição</TableHead>
                      <TableHead className="text-center">Eventos</TableHead>
                      <TableHead className="text-center">Status</TableHead>
                      <TableHead className="text-center">Ordem</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCategories.map((category) => (
                      <TableRow key={category.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {category.icon && (
                              <span className="text-2xl">{category.icon}</span>
                            )}
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: category.color || "#3B82F6" }}
                            ></div>
                            <span className="font-medium">{category.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                            {category.slug}
                          </code>
                        </TableCell>
                        <TableCell className="max-w-xs truncate">
                          {category.description || "-"}
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant="outline">
                            {getEventsCount(category.slug)} eventos
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          {category.active ? (
                            <Badge className="bg-green-100 text-green-700">
                              Ativa
                            </Badge>
                          ) : (
                            <Badge className="bg-gray-100 text-gray-700">
                              Inativa
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-center">
                          {category.order || 0}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openEditDialog(category)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openDeleteDialog(category)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-12">
                <FolderTree className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Nenhuma categoria encontrada
                </h3>
                <p className="text-gray-500 mb-4">
                  {searchTerm
                    ? "Tente ajustar sua busca"
                    : "Comece criando sua primeira categoria"}
                </p>
                {!searchTerm && (
                  <Button onClick={() => setShowCreateDialog(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Nova Categoria
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Create Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Criar Nova Categoria</DialogTitle>
            <DialogDescription>
              Preencha os dados para criar uma nova categoria de eventos
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="create-name">Nome da Categoria *</Label>
              <Input
                id="create-name"
                value={formData.name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="Ex: Shows"
              />
            </div>
            <div>
              <Label htmlFor="create-slug">Slug *</Label>
              <Input
                id="create-slug"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="Ex: shows"
              />
              <p className="text-xs text-gray-500 mt-1">
                Gerado automaticamente a partir do nome
              </p>
            </div>
            <div>
              <Label htmlFor="create-description">Descrição</Label>
              <Textarea
                id="create-description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Descreva esta categoria..."
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="create-icon">Ícone (Emoji)</Label>
                <Input
                  id="create-icon"
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  placeholder="🎵"
                />
              </div>
              <div>
                <Label htmlFor="create-color">Cor</Label>
                <div className="flex gap-2">
                  <Input
                    id="create-color"
                    type="color"
                    value={formData.color}
                    onChange={(e) =>
                      setFormData({ ...formData, color: e.target.value })
                    }
                    className="w-20 h-10"
                  />
                  <Input
                    value={formData.color}
                    onChange={(e) =>
                      setFormData({ ...formData, color: e.target.value })
                    }
                    placeholder="#3B82F6"
                  />
                </div>
              </div>
            </div>
            <div>
              <Label htmlFor="create-order">Ordem de Exibição</Label>
              <Input
                id="create-order"
                type="number"
                value={formData.order}
                onChange={(e) =>
                  setFormData({ ...formData, order: parseInt(e.target.value) || 0 })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
              Cancelar
            </Button>
            <Button
              onClick={handleCreate}
              disabled={createCategoryMutation.isPending}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
            >
              {createCategoryMutation.isPending ? "Criando..." : "Criar Categoria"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Editar Categoria</DialogTitle>
            <DialogDescription>
              Atualize as informações da categoria
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="edit-name">Nome da Categoria *</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ex: Shows"
              />
            </div>
            <div>
              <Label htmlFor="edit-slug">Slug *</Label>
              <Input
                id="edit-slug"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="Ex: shows"
              />
            </div>
            <div>
              <Label htmlFor="edit-description">Descrição</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Descreva esta categoria..."
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-icon">Ícone (Emoji)</Label>
                <Input
                  id="edit-icon"
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  placeholder="🎵"
                />
              </div>
              <div>
                <Label htmlFor="edit-color">Cor</Label>
                <div className="flex gap-2">
                  <Input
                    id="edit-color"
                    type="color"
                    value={formData.color}
                    onChange={(e) =>
                      setFormData({ ...formData, color: e.target.value })
                    }
                    className="w-20 h-10"
                  />
                  <Input
                    value={formData.color}
                    onChange={(e) =>
                      setFormData({ ...formData, color: e.target.value })
                    }
                    placeholder="#3B82F6"
                  />
                </div>
              </div>
            </div>
            <div>
              <Label htmlFor="edit-order">Ordem de Exibição</Label>
              <Input
                id="edit-order"
                type="number"
                value={formData.order}
                onChange={(e) =>
                  setFormData({ ...formData, order: parseInt(e.target.value) || 0 })
                }
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="edit-active"
                checked={formData.active}
                onChange={(e) =>
                  setFormData({ ...formData, active: e.target.checked })
                }
                className="w-4 h-4"
              />
              <Label htmlFor="edit-active">Categoria ativa</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancelar
            </Button>
            <Button
              onClick={handleEdit}
              disabled={updateCategoryMutation.isPending}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {updateCategoryMutation.isPending ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              Confirmar Exclusão
            </DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir esta categoria?
            </DialogDescription>
          </DialogHeader>
          {selectedCategory && (
            <div className="py-4">
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <div className="flex items-center gap-2 mb-2">
                  {selectedCategory.icon && (
                    <span className="text-2xl">{selectedCategory.icon}</span>
                  )}
                  <p className="font-semibold text-gray-900">
                    {selectedCategory.name}
                  </p>
                </div>
                <p className="text-sm text-gray-600">
                  Slug: <code className="bg-white px-2 py-1 rounded">{selectedCategory.slug}</code>
                </p>
              </div>

              {getEventsCount(selectedCategory.slug) > 0 ? (
                <Alert className="bg-red-50 border-red-200">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800">
                    Esta categoria possui{" "}
                    <strong>{getEventsCount(selectedCategory.slug)} evento(s)</strong>{" "}
                    associado(s). Não é possível excluí-la.
                  </AlertDescription>
                </Alert>
              ) : (
                <Alert>
                  <AlertDescription>
                    Esta ação não pode ser desfeita. A categoria será removida
                    permanentemente.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancelar
            </Button>
            <Button
              onClick={handleDelete}
              disabled={
                deleteCategoryMutation.isPending ||
                (selectedCategory && getEventsCount(selectedCategory.slug) > 0)
              }
              className="bg-red-600 hover:bg-red-700"
            >
              {deleteCategoryMutation.isPending ? "Excluindo..." : "Excluir Categoria"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}