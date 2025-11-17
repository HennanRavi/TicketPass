import { useEffect } from "react";
import { base44 } from "@/api/base44Client";

export function usePushNotifications(user) {
  useEffect(() => {
    if (!user || !('Notification' in window)) return;

    const checkAndSendNotifications = async () => {
      // Only proceed if user has enabled push notifications
      if (!user.notification_preferences?.push_enabled) return;
      if (Notification.permission !== "granted") return;

      try {
        // Fetch unread notifications
        const notifications = await base44.entities.Notification.filter(
          { user_id: user.id, read: false },
          "-created_date",
          5
        );

        // Send browser notifications for new items
        notifications.forEach((notification) => {
          // Check if we already sent this notification
          const sentKey = `notification_sent_${notification.id}`;
          if (localStorage.getItem(sentKey)) return;

          // Determine notification settings based on category
          const prefs = user.notification_preferences;
          let shouldSend = false;

          switch (notification.category) {
            case "ticket":
              shouldSend = prefs.ticket_reminders;
              break;
            case "event":
              shouldSend = prefs.event_updates || prefs.new_events;
              break;
            case "payment":
              shouldSend = prefs.sales_updates;
              break;
            case "system":
              shouldSend = true; // Always send system notifications
              break;
            default:
              shouldSend = true;
          }

          if (!shouldSend) return;

          // Send the notification
          new Notification(notification.title, {
            body: notification.message,
            icon: "/favicon.ico",
            badge: "/favicon.ico",
            tag: notification.id,
            requireInteraction: notification.type === "error" || notification.type === "warning",
          });

          // Mark as sent
          localStorage.setItem(sentKey, "true");
        });
      } catch (error) {
        console.error("Error checking notifications:", error);
      }
    };

    // Check immediately
    checkAndSendNotifications();

    // Check every 30 seconds
    const interval = setInterval(checkAndSendNotifications, 30000);

    return () => clearInterval(interval);
  }, [user]);
}

export function sendPushNotification(title, message, options = {}) {
  if ('Notification' in window && Notification.permission === "granted") {
    new Notification(title, {
      body: message,
      icon: "/favicon.ico",
      badge: "/favicon.ico",
      ...options,
    });
  }
}