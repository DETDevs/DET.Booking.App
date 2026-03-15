import { useState, useMemo } from "react";
import { useTenant } from "@/entities/tenant/TenantContext";
import { PageHeader } from "@/shared/ui/PageHeader";
import {
  History,
  Check,
  X,
  RotateCcw,
  UserPlus,
  Settings,
  Calendar,
  Play,
} from "lucide-react";
import {
  useActivityStore,
  relativeTime,
} from "@/entities/activity/useActivityStore";
import type { ActivityAction } from "@/entities/activity/useActivityStore";

// Neutral icon config — small dot color + neutral badge
const actionConfig: Record<
  ActivityAction,
  { icon: typeof Check; dot: string; label: string }
> = {
  confirm: { icon: Check, dot: "bg-emerald-400", label: "Confirmación" },
  cancel: { icon: X, dot: "bg-red-400", label: "Cancelación" },
  reschedule: { icon: RotateCcw, dot: "bg-amber-400", label: "Reprogramación" },
  create: { icon: UserPlus, dot: "bg-sky-400", label: "Creación" },
  settings: { icon: Settings, dot: "bg-gray-400", label: "Configuración" },
  complete: { icon: Calendar, dot: "bg-gray-400 dark:bg-neutral-500", label: "Completada" },
  start: { icon: Play, dot: "bg-sky-400", label: "En atención" },
};

const FILTERS: { key: string; label: string }[] = [
  { key: "all", label: "Todas" },
  { key: "confirm", label: "Confirmaciones" },
  { key: "cancel", label: "Cancelaciones" },
  { key: "create", label: "Creaciones" },
  { key: "reschedule", label: "Reprogramaciones" },
  { key: "complete", label: "Completadas" },
  { key: "start", label: "En atención" },
  { key: "settings", label: "Configuración" },
];

const AuditLogPage = () => {
  const tenant = useTenant();
  const primaryColor = tenant.branding?.primaryColor ?? "#6366f1";
  const [filter, setFilter] = useState<string>("all");

  // Read entries from activity store (reactive)
  const allEntries = useActivityStore((s) => s.entries);

  // Filter by tenant + action type
  const filtered = useMemo(() => {
    let entries = allEntries.filter((e) => e.tenant === tenant.type);
    if (filter !== "all") {
      entries = entries.filter((e) => e.action === filter);
    }
    return entries;
  }, [allEntries, tenant.type, filter]);

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <PageHeader
        icon={History}
        title={tenant.features.auditLog?.label ?? "Historial"}
        subtitle="Registro de todas las acciones del sistema"
      />

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {FILTERS.map((f) => (
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
                ? { backgroundColor: primaryColor }
                : undefined
            }
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Timeline */}
      <div className="space-y-1">
        {filtered.map((entry) => {
          const cfg = actionConfig[entry.action] ?? actionConfig.confirm;
          const Icon = cfg.icon;
          return (
            <div
              key={entry.id}
              className="flex gap-4 p-4 bg-white dark:bg-neutral-800 rounded-xl border border-gray-100 dark:border-neutral-700"
            >
              {/* Neutral icon container */}
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-gray-100 dark:bg-neutral-700">
                <Icon
                  size={18}
                  className="text-gray-500 dark:text-neutral-400"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <div className="text-sm text-gray-900 dark:text-white">
                    <span className="font-semibold">{entry.user}</span>
                    <span className="text-gray-400 dark:text-neutral-500">
                      {" "}
                      →{" "}
                    </span>
                    <span className="font-medium">{entry.target}</span>
                  </div>
                  <span className="text-[10px] text-gray-400 dark:text-neutral-500 shrink-0">
                    {relativeTime(entry.timestamp)}
                  </span>
                </div>
                <p className="text-xs text-gray-500 dark:text-neutral-400 mt-0.5">
                  {entry.details}
                </p>
                {/* Neutral badge with dot */}
                <span className="inline-flex items-center gap-1.5 mt-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-gray-50 dark:bg-neutral-700 text-gray-600 dark:text-neutral-300">
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`}
                  />
                  {cfg.label}
                </span>
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-400 dark:text-neutral-500">
            <History size={32} className="mx-auto mb-2 opacity-30" />
            <p className="text-sm">No hay registros para este filtro</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuditLogPage;
