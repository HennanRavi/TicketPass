import React, { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Bell, BellOff, Check, AlertCircle } from "lucide-react";
import { toast } from "sonner";

export default function PushNotificationManager({ user }) {
  const [permission, setPermission] = useState(Notification.permission);
  const [isSupported, setIsSupported] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check if browser supports notifications
    setIsSupported('Notification' in window && 'serviceWorker' in navigator);
    setPermission(Notification.permission);
  }, []);

  const requestPermission = async () => {
    if (!isSupported) {
      toast.error("Seu navegador não suporta notificações");
      return;
    }

    setIsLoading(true);

    try {
      const result = await Notification.requestPermission();
      setPermission(result);

      if (result === "granted") {
        toast.success("Notificações ativadas com sucesso!");
        
        // Save preference to user
        await base44.auth.updateMe({
          notification_preferences: {
            push_enabled: true,
            new_events: true,
            ticket_reminders: true,
            sales_updates: true,
            event_updates: true,
          }
        });

        // Send a test notification
        new Notification("TicketPass", {
          body: "Você está pronto para receber notificações!",
          icon: "/favicon.ico",
          badge: "/favicon.ico",
        });
      } else if (result === "denied") {
        toast.error("Você negou as notificações. Ative nas configurações do navegador.");
      }
    } catch (error) {
      console.error("Error requesting notification permission:", error);
      toast.error("Erro ao solicitar permissão");
    } finally {
      setIsLoading(false);
    }
  };

  const disableNotifications = async () => {
    try {
      await base44.auth.updateMe({
        notification_preferences: {
          push_enabled: false,
          new_events: false,
          ticket_reminders: false,
          sales_updates: false,
          event_updates: false,
        }
      });
      toast.success("Notificações desativadas");
    } catch (error) {
      toast.error("Erro ao desativar notificações");
    }
  };

  if (!isSupported) {
    return (
      <Card className="border-orange-200 dark:border-orange-900 bg-orange-50 dark:bg-orange-950/20">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            <CardTitle className="text-orange-900 dark:text-orange-200">Notificações não suportadas</CardTitle>
          </div>
          <CardDescription className="text-orange-700 dark:text-orange-300">
            Seu navegador não suporta notificações push. Tente usar Chrome, Firefox ou Edge.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (permission === "granted") {
    return (
      <Card className="border-green-200 dark:border-green-900 bg-green-50 dark:bg-green-950/20">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Check className="w-5 h-5 text-green-600 dark:text-green-400" />
            <CardTitle className="text-green-900 dark:text-green-200">Notificações Ativadas</CardTitle>
          </div>
          <CardDescription className="text-green-700 dark:text-green-300">
            Você receberá alertas sobre eventos, vendas e atualizações importantes.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            variant="outline"
            size="sm"
            onClick={disableNotifications}
            className="border-green-600 text-green-700 hover:bg-green-100 dark:border-green-700 dark:text-green-300 dark:hover:bg-green-950"
          >
            <BellOff className="w-4 h-4 mr-2" />
            Desativar Notificações
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (permission === "denied") {
    return (
      <Card className="border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/20">
        <CardHeader>
          <div className="flex items-center gap-2">
            <BellOff className="w-5 h-5 text-red-600 dark:text-red-400" />
            <CardTitle className="text-red-900 dark:text-red-200">Notificações Bloqueadas</CardTitle>
          </div>
          <CardDescription className="text-red-700 dark:text-red-300">
            As notificações foram bloqueadas. Para ativar, acesse as configurações do seu navegador e permita notificações para este site.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="border-blue-200 dark:border-purple-900 bg-blue-50 dark:bg-purple-950/20">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-blue-600 dark:text-purple-400" />
          <CardTitle className="text-blue-900 dark:text-purple-200">Ativar Notificações Push</CardTitle>
        </div>
        <CardDescription className="text-blue-700 dark:text-purple-300">
          Receba alertas em tempo real sobre:
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <ul className="space-y-2 text-sm text-blue-800 dark:text-purple-200">
          <li className="flex items-center gap-2">
            <Check className="w-4 h-4 text-blue-600 dark:text-purple-400" />
            Novos eventos que você possa gostar
          </li>
          <li className="flex items-center gap-2">
            <Check className="w-4 h-4 text-blue-600 dark:text-purple-400" />
            Lembretes de ingressos antes dos eventos
          </li>
          <li className="flex items-center gap-2">
            <Check className="w-4 h-4 text-blue-600 dark:text-purple-400" />
            Atualizações importantes sobre seus eventos
          </li>
          {user?.user_type === "organizador" && (
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-blue-600 dark:text-purple-400" />
              Notificações de vendas em tempo real
            </li>
          )}
        </ul>
        <Button
          onClick={requestPermission}
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-purple-600 dark:hover:bg-purple-700"
        >
          {isLoading ? (
            "Solicitando permissão..."
          ) : (
            <>
              <Bell className="w-4 h-4 mr-2" />
              Ativar Notificações
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}