import { useState } from "react";
import { useTenant } from "@/entities/tenant/TenantContext";
import { PageHeader } from "@/shared/ui/PageHeader";
import { Bell, Check, X, AlertCircle, Clock } from "lucide-react";

interface Notification {
  id: string;
  type: "confirmation" | "cancellation" | "reminder" | "system";
  title: string;
  message: string;
  time: string;
  read: boolean;
}

const MOCK_NOTIFICATIONS: Notification[] = [
  { id: "n1", type: "confirmation", title: "Reserva confirmada", message: "Carlos Rivera confirmó su cita para hoy a las 10:00", time: "Hace 5 min", read: false },
  { id: "n2", type: "cancellation", title: "Reserva cancelada", message: "Pablo Castillo canceló su cita del viernes", time: "Hace 15 min", read: false },
  { id: "n3", type: "reminder", title: "Recordatorio", message: "3 citas pendientes de confirmar para mañana", time: "Hace 1 hora", read: false },
  { id: "n4", type: "system", title: "Actualización del sistema", message: "Se ha actualizado el horario de atención para los próximos feriados", time: "Hace 2 horas", read: true },
  { id: "n5", type: "confirmation", title: "Nueva reserva", message: "Amanda Chavez reservó una cita para el martes a las 11:00", time: "Hace 3 horas", read: true },
  { id: "n6", type: "reminder", title: "Recordatorio", message: "5 reservas para el día de hoy aún sin confirmar", time: "Ayer", read: true },
  { id: "n7", type: "cancellation", title: "No-show registrado", message: "Beatrice Carrol no se presentó a su cita de las 15:00", time: "Ayer", read: true },
  { id: "n8", type: "system", title: "Nuevo staff", message: "Se ha registrado un nuevo profesional en el sistema", time: "Hace 2 días", read: true },
];

const typeConfig = {
  confirmation: { icon: Check, bg: "bg-emerald-100 dark:bg-emerald-900/30", text: "text-emerald-600 dark:text-emerald-400" },
  cancellation: { icon: X, bg: "bg-red-100 dark:bg-red-900/30", text: "text-red-600 dark:text-red-400" },
  reminder: { icon: Clock, bg: "bg-amber-100 dark:bg-amber-900/30", text: "text-amber-600 dark:text-amber-400" },
  system: { icon: AlertCircle, bg: "bg-blue-100 dark:bg-blue-900/30", text: "text-blue-600 dark:text-blue-400" },
};

const NotificationsPage = () => {
  const tenant = useTenant();
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const [filter, setFilter] = useState<string>("all");

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  };

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const filtered = filter === "all"
    ? notifications
    : filter === "unread"
      ? notifications.filter((n) => !n.read)
      : notifications.filter((n) => n.type === filter);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <PageHeader
        icon={Bell}
        title={tenant.features.notifications?.label ?? "Notificaciones"}
        subtitle={unreadCount > 0 ? `${unreadCount} sin leer` : "Todas leídas"}
        actions={
          unreadCount > 0 ? (
            <button
              onClick={markAllRead}
              className="text-sm font-medium px-4 py-2 rounded-lg border border-gray-200 dark:border-neutral-600 text-gray-700 dark:text-neutral-300 hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors cursor-pointer"
            >
              Marcar todas como leídas
            </button>
          ) : undefined
        }
      />

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {[
          { key: "all", label: "Todas" },
          { key: "unread", label: "Sin leer" },
          { key: "confirmation", label: "Confirmaciones" },
          { key: "cancellation", label: "Cancelaciones" },
          { key: "reminder", label: "Recordatorios" },
          { key: "system", label: "Sistema" },
        ].map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
              filter === f.key
                ? "text-white"
                : "text-gray-600 dark:text-neutral-400 bg-gray-100 dark:bg-neutral-800 hover:bg-gray-200 dark:hover:bg-neutral-700"
            }`}
            style={
              filter === f.key
                ? { backgroundColor: tenant.branding?.primaryColor ?? "#6366f1" }
                : undefined
            }
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Timeline */}
      <div className="space-y-2">
        {filtered.map((notification) => {
          const cfg = typeConfig[notification.type];
          const Icon = cfg.icon;
          return (
            <button
              key={notification.id}
              onClick={() => markAsRead(notification.id)}
              className={`w-full text-left flex gap-4 p-4 rounded-xl border transition-all cursor-pointer ${
                notification.read
                  ? "bg-white dark:bg-neutral-800 border-gray-100 dark:border-neutral-700 opacity-60"
                  : "bg-white dark:bg-neutral-800 border-gray-200 dark:border-neutral-600 shadow-sm hover:shadow-md"
              }`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${cfg.bg}`}>
                <Icon size={18} className={cfg.text} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                    {notification.title}
                    {!notification.read && (
                      <span className="inline-block w-2 h-2 rounded-full bg-blue-500 ml-2" />
                    )}
                  </h4>
                  <span className="text-[10px] text-gray-400 dark:text-neutral-500 shrink-0">
                    {notification.time}
                  </span>
                </div>
                <p className="text-xs text-gray-500 dark:text-neutral-400 mt-0.5 truncate">
                  {notification.message}
                </p>
              </div>
            </button>
          );
        })}
        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-400 dark:text-neutral-500">
            <Bell size={32} className="mx-auto mb-2 opacity-30" />
            <p className="text-sm">No hay notificaciones</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
