import { useTenant } from "@/entities/tenant/TenantContext";

interface LegendItem {
  color: string;
  label: string;
}

interface StatusLegendProps {
  items: LegendItem[];
  title?: string;
}

export const StatusLegend = ({ items, title = "Leyenda" }: StatusLegendProps) => {
  const tenant = useTenant();
  const primaryColor = tenant.branding?.primaryColor ?? "#6366f1";

  return (
    <div className="bg-white dark:bg-neutral-800 rounded-xl border border-gray-100 dark:border-neutral-700 p-4 shadow-sm">
      <h4
        className="text-[11px] font-semibold uppercase tracking-wider mb-3"
        style={{ color: primaryColor }}
      >
        {title}
      </h4>
      <div className="flex flex-wrap gap-x-5 gap-y-2">
        {items.map((item) => (
          <div key={item.label} className="flex items-center gap-2">
            <span
              className="w-3 h-3 rounded-full shrink-0"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-xs text-gray-600 dark:text-neutral-400">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Preset legends
export const BOOKING_STATUS_LEGEND: LegendItem[] = [
  { color: "#f59e0b", label: "Pendiente — Esperando confirmación" },
  { color: "#6366f1", label: "Confirmada — Lista para atención" },
  { color: "#10b981", label: "Completada — Servicio terminado" },
  { color: "#ef4444", label: "Cancelada — No se realizará" },
];

export const STAFF_STATUS_LEGEND: LegendItem[] = [
  { color: "#f59e0b", label: "Pendiente — Sin confirmar" },
  { color: "#6366f1", label: "Confirmada — Próxima en atender" },
  { color: "#8b5cf6", label: "En atención — En proceso ahora" },
  { color: "#10b981", label: "Completada — Finalizada" },
  { color: "#ef4444", label: "Cancelada — Eliminada" },
];

export const TABLE_STATUS_LEGEND: LegendItem[] = [
  { color: "#f59e0b", label: "Reservada — Cliente por llegar" },
  { color: "#6366f1", label: "Confirmada — Reserva validada" },
  { color: "#10b981", label: "Ocupada — Cliente en mesa" },
  { color: "#94a3b8", label: "Libre — Mesa disponible" },
  { color: "#ef4444", label: "No llegó — No-show" },
];

export const CALENDAR_STATUS_LEGEND: LegendItem[] = [
  { color: "#10b981", label: "Confirmada" },
  { color: "#f59e0b", label: "Pendiente" },
  { color: "#ef4444", label: "Cancelada" },
  { color: "#8b5cf6", label: "Completada" },
];
