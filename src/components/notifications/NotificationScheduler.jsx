import { useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { sendPushNotification } from "./usePushNotifications";

export function useNotificationScheduler(user) {
  useEffect(() => {
    if (!user || !user.notification_preferences?.push_enabled) return;
    if (Notification.permission !== "granted") return;

    let ticketReminderInterval;

    const checkUpcomingEvents = async () => {
      try {
        // Get user's active tickets
        const tickets = await base44.entities.Ticket.filter({
          buyer_id: user.id,
          status: "ativo"
        });

        const now = new Date();
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);

        tickets.forEach(async (ticket) => {
          const eventDate = new Date(ticket.event_date);
          const timeDiff = eventDate - now;
          const hoursDiff = timeDiff / (1000 * 60 * 60);

          // Send reminder 24 hours before event
          if (hoursDiff > 23 && hoursDiff < 25) {
            const reminderKey = `reminder_sent_${ticket.id}_24h`;
            
            if (!localStorage.getItem(reminderKey)) {
              // Create notification in database
              await base44.entities.Notification.create({
                user_id: user.id,
                title: "Lembrete de Evento 🎉",
                message: `Seu evento "${ticket.event_title}" acontece amanhã às ${new Date(ticket.event_date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}!`,
                type: "info",
                category: "ticket",
                link: `/MyTickets`,
              });

              // Send push notification
              if (user.notification_preferences?.ticket_reminders) {
                sendPushNotification(
                  "Lembrete de Evento 🎉",
                  `Seu evento "${ticket.event_title}" acontece amanhã!`,
                  { requireInteraction: false }
                );
              }

              localStorage.setItem(reminderKey, "true");
            }
          }

          // Send reminder 2 hours before event
          if (hoursDiff > 1.5 && hoursDiff < 2.5) {
            const reminderKey = `reminder_sent_${ticket.id}_2h`;
            
            if (!localStorage.getItem(reminderKey)) {
              await base44.entities.Notification.create({
                user_id: user.id,
                title: "Evento em Breve! ⏰",
                message: `O evento "${ticket.event_title}" começa em 2 horas!`,
                type: "warning",
                category: "ticket",
                link: `/MyTickets`,
              });

              if (user.notification_preferences?.ticket_reminders) {
                sendPushNotification(
                  "Evento em Breve! ⏰",
                  `O evento "${ticket.event_title}" começa em 2 horas!`,
                  { requireInteraction: true }
                );
              }

              localStorage.setItem(reminderKey, "true");
            }
          }
        });
      } catch (error) {
        console.error("Error checking upcoming events:", error);
      }
    };

    // Check immediately
    checkUpcomingEvents();

    // Check every hour
    ticketReminderInterval = setInterval(checkUpcomingEvents, 60 * 60 * 1000);

    return () => {
      if (ticketReminderInterval) clearInterval(ticketReminderInterval);
    };
  }, [user]);
}