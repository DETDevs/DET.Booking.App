import { useTenant } from "@/entities/tenant/TenantContext";
import { Tooltip } from "@/shared/ui/Tooltip";
import {
  CalendarCheck,
  Clock,
  Users,
  TrendingUp,
  TrendingDown,
  type LucideIcon,
} from "lucide-react";

interface Props {
  label: string;
  value: number;
  delta: number;
  icon?: LucideIcon;
}

const DEFAULT_ICONS: Record<string, LucideIcon> = {
  "Total Reservas": CalendarCheck,
  "Total Citas": CalendarCheck,
  "Total Reservaciones": CalendarCheck,
  "Por confirmar": Clock,
  Hoy: TrendingUp,
  Clientes: Users,
  Pacientes: Users,
};

export const StatCard = ({ label, value, delta, icon }: Props) => {
  const tenant = useTenant();
  const primaryColor = tenant.branding?.primaryColor ?? "#6366f1";
  const Icon = icon ?? DEFAULT_ICONS[label] ?? CalendarCheck;
  const isPositive = delta >= 0;

  return (
    <div className="rounded-2xl border border-gray-100 dark:border-neutral-700 bg-white dark:bg-neutral-800 p-5 shadow-sm hover:shadow-md transition-all duration-300">
      <div className="flex items-center justify-between mb-3">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: `${primaryColor}12` }}
        >
          <Icon size={18} style={{ color: primaryColor }} />
        </div>
        <Tooltip text={`Comparado con la semana anterior: ${isPositive ? "+" : ""}${delta}%`} />
      </div>
      <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-neutral-500 mb-1">
        {label}
      </p>
      <p className="text-3xl font-bold text-gray-900 dark:text-white">
        {value.toLocaleString()}
      </p>
      <div className="flex items-center gap-1 mt-1.5">
        {isPositive ? (
          <TrendingUp size={14} className="text-emerald-500" />
        ) : (
          <TrendingDown size={14} className="text-red-400" />
        )}
        <p
          className={`text-sm font-medium ${isPositive ? "text-emerald-500" : "text-red-400"}`}
        >
          {isPositive ? "+" : ""}{delta}%
        </p>
        <span className="text-xs text-gray-400 dark:text-neutral-500 ml-1">
          vs. sem. anterior
        </span>
      </div>
    </div>
  );
};
