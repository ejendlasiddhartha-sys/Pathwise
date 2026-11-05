import { useState } from "react";
import {
  Bell,
  CheckCircle2,
  Trash2,
  Sparkles,
  Award,
  Clock,
  ShieldCheck,
  Check,
  Inbox,
  Filter,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function NotificationsView() {
  const { notifications, markAsRead, markAllAsRead, deleteNotification, unreadCount } = useAuth();
  const [activeFilter, setActiveFilter] = useState("all"); // "all" | "unread" | "certification" | "reminder" | "update"

  const filteredNotifications = notifications.filter((item) => {
    if (activeFilter === "unread") return !item.read;
    if (activeFilter === "certification") return item.type === "certification";
    if (activeFilter === "reminder") return item.type === "reminder";
    if (activeFilter === "update") return item.type === "update";
    return true;
  });

  const getIconForType = (type) => {
    switch (type) {
      case "certification":
        return <Award className="h-5 w-5 text-pink-600" />;
      case "reminder":
        return <Clock className="h-5 w-5 text-sky-600" />;
      case "update":
        return <Sparkles className="h-5 w-5 text-amber-600" />;
      default:
        return <ShieldCheck className="h-5 w-5 text-emerald-600" />;
    }
  };

  const getBadgeStyle = (type) => {
    switch (type) {
      case "certification":
        return "bg-pink-50 text-pink-700 border-pink-200/80";
      case "reminder":
        return "bg-sky-50 text-sky-700 border-sky-200/80";
      case "update":
        return "bg-amber-50 text-amber-700 border-amber-200/80";
      default:
        return "bg-emerald-50 text-emerald-700 border-emerald-200/80";
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header with Title and Global Action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Notifications & Updates
            </h1>
            {unreadCount > 0 && (
              <span className="rounded-full bg-pink-100 px-2.5 py-0.5 text-xs font-bold text-pink-700 border border-pink-200">
                {unreadCount} new
              </span>
            )}
          </div>
          <p className="mt-1 text-sm text-slate-600">
            Keep track of learning milestones, certification updates, and diagnostic alerts.
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            type="button"
            onClick={markAllAsRead}
            className="inline-flex items-center gap-1.5 rounded-xl border border-sky-200 bg-sky-50 px-4 py-2 text-xs font-bold text-sky-700 shadow-xs transition hover:bg-sky-100 active:scale-95"
          >
            <Check className="h-4 w-4" />
            Mark All as Read
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {[
          { id: "all", label: "All Notifications", count: notifications.length },
          { id: "unread", label: "Unread", count: unreadCount },
          { id: "certification", label: "Certifications" },
          { id: "reminder", label: "Reminders" },
          { id: "update", label: "System Updates" },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveFilter(tab.id)}
            className={`rounded-xl px-3.5 py-2 text-xs font-semibold transition ${
              activeFilter === tab.id
                ? "bg-sky-500 text-white shadow-xs"
                : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            {tab.label}
            {typeof tab.count === "number" && tab.count > 0 && (
              <span
                className={`ml-1.5 rounded-full px-1.5 py-0.2 text-[10px] font-bold ${
                  activeFilter === tab.id ? "bg-white/20 text-white" : "bg-slate-100 text-slate-700"
                }`}
              >
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      {filteredNotifications.length === 0 ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-xs">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-50 text-sky-500">
            <Inbox className="h-7 w-7" />
          </div>
          <h3 className="mt-4 text-base font-bold text-slate-800">No notifications found</h3>
          <p className="mt-1 text-xs text-slate-500">
            You are all caught up! New diagnostic benchmarks and updates will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredNotifications.map((n) => (
            <div
              key={n.id}
              className={`relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-2xl border p-4 sm:p-5 transition ${
                n.read
                  ? "border-slate-200/90 bg-white"
                  : "border-sky-300 bg-sky-50/40 shadow-xs ring-1 ring-sky-200"
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white border border-slate-200 shadow-xs">
                  {getIconForType(n.type)}
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-sm font-bold text-slate-900">{n.title}</h2>
                    <span
                      className={`rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${getBadgeStyle(
                        n.type
                      )}`}
                    >
                      {n.type}
                    </span>
                    {!n.read && (
                      <span className="h-2 w-2 rounded-full bg-pink-500 animate-pulse" />
                    )}
                  </div>
                  <p className="mt-1 text-xs text-slate-600 leading-relaxed max-w-2xl">
                    {n.message}
                  </p>
                  <span className="mt-2 text-[11px] font-medium text-slate-400 block">
                    {n.timestamp}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 self-end sm:self-center">
                {!n.read && (
                  <button
                    type="button"
                    onClick={() => markAsRead(n.id)}
                    className="inline-flex items-center gap-1 rounded-lg border border-sky-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-sky-700 shadow-xs hover:bg-sky-50"
                    title="Mark as read"
                  >
                    <Check className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Read</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => deleteNotification(n.id)}
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 transition"
                  title="Delete notification"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
