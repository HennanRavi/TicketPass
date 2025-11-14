import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Bell, Check, Trash2, Filter, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const notificationIcons = {
  ticket: "🎫",
  event: "📅",
  payment: "💰",
  system: "ℹ️",
};

const categoryLabels = {
  all: "Todas",
  ticket: "Ingressos",
  event: "Eventos",
  payment: "Pagamentos",
  system: "Sistema",
};

export default function Notifications() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [user, setUser] = useState(null);
  const [filter, setFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    base44.auth
      .me()
      .then(setUser)
      .catch(() => {
        base44.auth.redirectToLogin(window.location.href);
      });
  }, []);

  const { data: notifications, isLoading } = useQuery({
    queryKey: ["notifications", user?.id],
    queryFn: () => base44.entities.Notification.filter({ user_id: user.id }, "-created_date"),
    enabled: !!user,
    initialData: [],
  });

  const filteredNotifications = notifications.filter((n) => {
    const matchesCategory = filter === "all" || n.category === filter;
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "unread" && !n.read) ||
      (statusFilter === "read" && n.read);
    return matchesCategory && matchesStatus;
  });

  const markAsReadMutation = useMutation({
    mutationFn: (notificationId) =>
      base44.entities.Notification.update(notificationId, { read: true }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications", user?.id] });
    },
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: async () => {
      const unreadNotifications = notifications.filter((n) => !n.read);
      await Promise.all(
        unreadNotifications.map((n) =>
          base44.entities.Notification.update(n.id, { read: true })
        )
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications", user?.id] });
    },
  });

  const deleteNotificationMutation = useMutation({
    mutationFn: (notificationId) =>
      base44.entities.Notification.delete(notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications", user?.id] });
    },
  });

  const handleNotificationClick = (notification) => {
    if (!notification.read) {
      markAsReadMutation.mutate(notification.id);
    }
    if (notification.link) {
      navigate(notification.link);
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-purple-400"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-purple-950 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Notificações
              </h1>
              {unreadCount > 0 && (
                <p className="text-gray-600 dark:text-gray-400">
                  Você tem {unreadCount} notificação(ões) não lida(s)
                </p>
              )}
            </div>
            {unreadCount > 0 && (
              <Button
                onClick={() => markAllAsReadMutation.mutate()}
                disabled={markAllAsReadMutation.isPending}
                className="bg-blue-600 hover:bg-blue-700 dark:bg-purple-600 dark:hover:bg-purple-700"
              >
                <Check className="w-4 h-4 mr-2" />
                Marcar todas como lidas
              </Button>
            )}
          </div>

          {/* Filters */}
          <Card className="border-none shadow-lg dark:bg-gray-800">
            <CardContent className="p-4">
              <div className="flex flex-wrap gap-4 items-center">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Filtros:</span>
                </div>

                <Select value={filter} onValueChange={setFilter}>
                  <SelectTrigger className="w-40 dark:bg-gray-900 dark:border-gray-700 dark:text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="dark:bg-gray-900 dark:border-gray-700">
                    {Object.entries(categoryLabels).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40 dark:bg-gray-900 dark:border-gray-700 dark:text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="dark:bg-gray-900 dark:border-gray-700">
                    <SelectItem value="all">Todas</SelectItem>
                    <SelectItem value="unread">Não lidas</SelectItem>
                    <SelectItem value="read">Lidas</SelectItem>
                  </SelectContent>
                </Select>

                {(filter !== "all" || statusFilter !== "all") && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setFilter("all");
                      setStatusFilter("all");
                    }}
                    className="dark:hover:bg-gray-700 dark:text-gray-300"
                  >
                    Limpar filtros
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Notifications List */}
        {filteredNotifications.length > 0 ? (
          <div className="space-y-4">
            {filteredNotifications.map((notification) => (
              <Card
                key={notification.id}
                className={`border-none shadow-lg hover:shadow-xl transition-all cursor-pointer dark:bg-gray-800 ${
                  !notification.read 
                    ? "bg-blue-50/50 border-l-4 border-l-blue-600 dark:bg-purple-900/20 dark:border-l-purple-600" 
                    : ""
                }`}
                onClick={() => handleNotificationClick(notification)}
              >
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 text-4xl">
                      {notificationIcons[notification.category] || "📢"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-1">
                            {notification.title}
                          </h3>
                          <p className="text-gray-700 dark:text-gray-300 mb-3">
                            {notification.message}
                          </p>
                          <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {format(
                                new Date(notification.created_date),
                                "dd/MM/yyyy 'às' HH:mm",
                                { locale: ptBR }
                              )}
                            </div>
                            <Badge variant="outline" className="dark:border-gray-700 dark:text-gray-300">
                              {categoryLabels[notification.category]}
                            </Badge>
                            {!notification.read && (
                              <Badge className="bg-blue-600 dark:bg-purple-600">Nova</Badge>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          {!notification.read && (
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={(e) => {
                                e.stopPropagation();
                                markAsReadMutation.mutate(notification.id);
                              }}
                              className="flex-shrink-0 dark:border-gray-700 dark:hover:bg-gray-700"
                            >
                              <Check className="w-4 h-4" />
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteNotificationMutation.mutate(notification.id);
                            }}
                            className="flex-shrink-0 hover:bg-red-50 hover:border-red-300 dark:border-gray-700 dark:hover:bg-red-900/20 dark:hover:border-red-800"
                          >
                            <Trash2 className="w-4 h-4 text-red-600 dark:text-red-500" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bell className="w-10 h-10 text-gray-400 dark:text-gray-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Nenhuma notificação encontrada
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              {filter !== "all" || statusFilter !== "all"
                ? "Tente ajustar os filtros"
                : "Você não tem notificações no momento"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}