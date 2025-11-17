import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Bell, Save, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function NotificationPreferences({ user }) {
  const [preferences, setPreferences] = useState({
    push_enabled: false,
    new_events: true,
    ticket_reminders: true,
    sales_updates: true,
    event_updates: true,
    price_alerts: true,
    recommendations: true,
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user?.notification_preferences) {
      setPreferences({
        ...preferences,
        ...user.notification_preferences,
      });
    }
  }, [user]);

  const handleToggle = (key) => {
    setPreferences({
      ...preferences,
      [key]: !preferences[key],
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await base44.auth.updateMe({
        notification_preferences: preferences,
      });
      toast.success("Preferências salvas com sucesso!");
    } catch (error) {
      toast.error("Erro ao salvar preferências");
    } finally {
      setIsSaving(false);
    }
  };

  const isOrganizer = user?.user_type === "organizador" || user?.role === "admin";

  return (
    <Card className="dark:bg-gray-800">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-blue-600 dark:text-purple-400" />
          <CardTitle className="dark:text-white">Preferências de Notificações</CardTitle>
        </div>
        <CardDescription className="dark:text-gray-400">
          Escolha quais tipos de notificações você deseja receber
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* General Notifications */}
        <div className="space-y-4">
          <h3 className="font-semibold text-sm text-gray-900 dark:text-white">Geral</h3>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="new_events" className="dark:text-gray-300">Novos Eventos</Label>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Receba notificações sobre novos eventos que possam te interessar
              </p>
            </div>
            <Switch
              id="new_events"
              checked={preferences.new_events}
              onCheckedChange={() => handleToggle("new_events")}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="recommendations" className="dark:text-gray-300">Recomendações</Label>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Eventos recomendados baseados nas suas preferências
              </p>
            </div>
            <Switch
              id="recommendations"
              checked={preferences.recommendations}
              onCheckedChange={() => handleToggle("recommendations")}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="price_alerts" className="dark:text-gray-300">Alertas de Preço</Label>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Notificações sobre promoções e descontos
              </p>
            </div>
            <Switch
              id="price_alerts"
              checked={preferences.price_alerts}
              onCheckedChange={() => handleToggle("price_alerts")}
            />
          </div>
        </div>

        {/* Ticket Notifications */}
        <div className="space-y-4 pt-4 border-t dark:border-gray-700">
          <h3 className="font-semibold text-sm text-gray-900 dark:text-white">Meus Ingressos</h3>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="ticket_reminders" className="dark:text-gray-300">Lembretes de Eventos</Label>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Lembre-me sobre eventos com 24h de antecedência
              </p>
            </div>
            <Switch
              id="ticket_reminders"
              checked={preferences.ticket_reminders}
              onCheckedChange={() => handleToggle("ticket_reminders")}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="event_updates" className="dark:text-gray-300">Atualizações de Eventos</Label>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Mudanças de horário, local ou cancelamentos
              </p>
            </div>
            <Switch
              id="event_updates"
              checked={preferences.event_updates}
              onCheckedChange={() => handleToggle("event_updates")}
            />
          </div>
        </div>

        {/* Organizer Notifications */}
        {isOrganizer && (
          <div className="space-y-4 pt-4 border-t dark:border-gray-700">
            <h3 className="font-semibold text-sm text-gray-900 dark:text-white">Organizador</h3>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="sales_updates" className="dark:text-gray-300">Vendas em Tempo Real</Label>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Notificações sempre que houver uma nova venda
                </p>
              </div>
              <Switch
                id="sales_updates"
                checked={preferences.sales_updates}
                onCheckedChange={() => handleToggle("sales_updates")}
              />
            </div>
          </div>
        )}

        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-purple-600 dark:hover:bg-purple-700"
        >
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Salvando...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Salvar Preferências
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}