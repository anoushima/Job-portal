import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bell, Briefcase, ClipboardList, Building2, ShieldCheck, Check,
} from "lucide-react";
 import { useNotifications } from "../hooks/useNotifications";
import type { NotificationItem } from "../services/notificationService";

function iconFor(type: NotificationItem["type"]) {
  switch (type) {
    case "application_update": return { Icon: ClipboardList, color: "bg-green-50 text-green-600" };
    case "job_match":          return { Icon: Briefcase, color: "bg-red-50 text-red-600" };
    case "new_applicant":      return { Icon: ClipboardList, color: "bg-blue-50 text-blue-600" };
    case "company_registered": return { Icon: Building2, color: "bg-purple-50 text-purple-600" };
    default:                   return { Icon: Bell, color: "bg-gray-50 text-gray-600" };
  }
}

function timeAgo(isoString: string): string {
  const diff = (Date.now() - new Date(isoString).getTime()) / 1000;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hr ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export default function NotificationBell() {
  const { notifications, unreadCount, markRead, markAllRead } = useNotifications();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleItemClick = (n: NotificationItem) => {
    if (!n.is_read) markRead(n.id);
    setOpen(false);
    if (n.link) navigate(n.link);
  };

  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="relative p-2 rounded-lg hover:bg-gray-100 transition"
      >
        <Bell size={20} className="text-gray-600" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 min-w-[16px] h-4 px-1 flex items-center justify-center bg-red-500 text-white text-[10px] font-semibold rounded-full">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl border border-gray-100 shadow-lg z-50 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <h3 className="text-sm font-bold text-gray-900">Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="flex items-center gap-1 text-xs text-red-600 font-medium hover:underline"
              >
                <Check size={12} /> Mark all read
              </button>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="px-4 py-10 text-center">
                <ShieldCheck size={24} className="mx-auto text-gray-300 mb-2" />
                <p className="text-sm text-gray-400">No notifications yet.</p>
              </div>
            ) : (
              notifications.map((n) => {
                const { Icon, color } = iconFor(n.type);
                return (
                  <button
                    key={n.id}
                    onClick={() => handleItemClick(n)}
                    className={`w-full text-left flex items-start gap-3 px-4 py-3 border-b border-gray-50 last:border-b-0 hover:bg-gray-50 transition ${
                      n.is_read ? "" : "bg-red-50/30"
                    }`}
                  >
                    <div className={`p-2 rounded-lg shrink-0 ${color}`}>
                      <Icon size={14} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className={`text-xs leading-snug ${n.is_read ? "text-gray-600" : "text-gray-900 font-medium"}`}>
                        {n.message}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">{timeAgo(n.created_at)}</p>
                    </div>
                    {!n.is_read && (
                      <span className="w-2 h-2 rounded-full bg-red-500 shrink-0 mt-1.5" />
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
