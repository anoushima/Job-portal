import { useCallback, useEffect, useRef, useState } from "react";
import {
  fetchNotifications,
  markAllNotificationsRead,
  markNotificationRead,
  type NotificationItem,
} from "../services/notificationService";

const WS_URL = "ws://127.0.0.1:8000/ws/notifications/";

/**
 * Connects to the notifications WebSocket for instant push updates, and
 * also loads notification history over REST on mount (covers anything
 * that happened while the user was offline, and acts as the source of
 * truth if the socket connection drops).
 *
 * Auto-reconnects with backoff if the socket closes unexpectedly.
 */
export function useNotifications() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [connected, setConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectAttempts = useRef(0);
  const reconnectTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  // Initial load over REST
  useEffect(() => {
    fetchNotifications()
      .then(setNotifications)
      .catch(() => {
        /* not logged in or request failed — bell just shows empty */
      });
  }, []);

  // WebSocket connection for live push
  useEffect(() => {
    const token = localStorage.getItem("access");
    if (!token) return;

    let cancelled = false;

    const connect = () => {
      if (cancelled) return;
      const socket = new WebSocket(`${WS_URL}?token=${token}`);
      wsRef.current = socket;

      socket.onopen = () => {
        reconnectAttempts.current = 0;
        setConnected(true);
      };

      socket.onmessage = (event) => {
        try {
          const incoming: NotificationItem = JSON.parse(event.data);
          setNotifications((prev) => {
            // avoid duplicates if REST + socket both deliver the same item
            if (prev.some((n) => n.id === incoming.id)) return prev;
            return [incoming, ...prev];
          });
        } catch {
          // ignore malformed payloads
        }
      };

      socket.onclose = () => {
        setConnected(false);
        if (cancelled) return;
        // simple capped exponential backoff
        const delay = Math.min(1000 * 2 ** reconnectAttempts.current, 15000);
        reconnectAttempts.current += 1;
        reconnectTimer.current = setTimeout(connect, delay);
      };

      socket.onerror = () => {
        socket.close();
      };
    };

    connect();

    return () => {
      cancelled = true;
      if (reconnectTimer.current) clearTimeout(reconnectTimer.current);
      wsRef.current?.close();
    };
  }, []);

  const markRead = useCallback(async (id: number) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
    );
    try {
      await markNotificationRead(id);
    } catch {
      // best-effort — UI already optimistically updated
    }
  }, []);

  const markAllRead = useCallback(async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    try {
      await markAllNotificationsRead();
    } catch {
      // best-effort
    }
  }, []);

  return { notifications, unreadCount, connected, markRead, markAllRead };
}
