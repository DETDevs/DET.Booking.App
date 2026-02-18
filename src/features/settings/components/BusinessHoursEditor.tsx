import { useState } from "react";
import { useTenant } from "@/entities/tenant/TenantContext";
import { Clock, ToggleLeft, ToggleRight } from "lucide-react";
import { Tooltip } from "@/shared/ui/Tooltip";

interface DaySchedule {
  open: string;
  close: string;
  enabled: boolean;
}

const DAY_LABELS = [
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
  "Domingo",
];
const DAY_SHORT = ["L", "M", "X", "J", "V", "S", "D"];
const DAY_TIPS = [
  "Configurá el horario del lunes, normalmente el día más activo de la semana.",
  "Martes suele tener un flujo constante de citas.",
  "Miércoles, a medio camino de la semana laboral.",
  "Jueves, ideal para agendar citas de seguimiento.",
  "Viernes puede tener horario especial si el negocio cierra temprano.",
  "El sábado suele tener un horario reducido en muchos negocios.",
  "El domingo generalmente está cerrado, pero podés habilitarlo.",
];

const DEFAULT_SCHEDULES: Record<string, DaySchedule[]> = {
  clinic: [
    { open: "08:00", close: "17:00", enabled: true },
    { open: "08:00", close: "17:00", enabled: true },
    { open: "08:00", close: "17:00", enabled: true },
    { open: "08:00", close: "17:00", enabled: true },
    { open: "08:00", close: "17:00", enabled: true },
    { open: "08:00", close: "12:00", enabled: true },
    { open: "08:00", close: "12:00", enabled: false },
  ],
  barbershop: [
    { open: "09:00", close: "19:00", enabled: true },
    { open: "09:00", close: "19:00", enabled: true },
    { open: "09:00", close: "19:00", enabled: true },
    { open: "09:00", close: "19:00", enabled: true },
    { open: "09:00", close: "19:00", enabled: true },
    { open: "09:00", close: "17:00", enabled: true },
    { open: "09:00", close: "17:00", enabled: false },
  ],
  restaurant: [
    { open: "11:00", close: "22:00", enabled: true },
    { open: "11:00", close: "22:00", enabled: true },
    { open: "11:00", close: "22:00", enabled: true },
    { open: "11:00", close: "22:00", enabled: true },
    { open: "11:00", close: "23:00", enabled: true },
    { open: "11:00", close: "23:00", enabled: true },
    { open: "11:00", close: "20:00", enabled: true },
  ],
};

export const BusinessHoursEditor = () => {
  const tenant = useTenant();
  const primaryColor = tenant.branding?.primaryColor ?? "#6366f1";
  const defaults = DEFAULT_SCHEDULES[tenant.type] ?? DEFAULT_SCHEDULES.clinic;
  const [schedule, setSchedule] = useState<DaySchedule[]>(defaults);

  const toggle = (i: number) => {
    setSchedule((prev) =>
      prev.map((d, idx) => (idx === i ? { ...d, enabled: !d.enabled } : d)),
    );
  };

  const update = (i: number, field: "open" | "close", value: string) => {
    setSchedule((prev) =>
      prev.map((d, idx) => (idx === i ? { ...d, [field]: value } : d)),
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2.5 mb-1">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: `${primaryColor}15` }}
        >
          <Clock size={16} style={{ color: primaryColor }} />
        </div>
        <div className="flex items-center gap-2">
          <div>
            <h2 className="text-base font-semibold text-gray-900 dark:text-white">
              Horarios de Atención
            </h2>
            <p className="text-xs text-gray-400 dark:text-neutral-500">
              Definí cuándo está abierto el negocio
            </p>
          </div>
          <Tooltip text="Configurá las horas de apertura y cierre para cada día de la semana. Los días desactivados se marcarán como 'Cerrado' y no aparecerán disponibles en el calendario." />
        </div>
      </div>

      <div className="bg-white dark:bg-neutral-800 rounded-2xl border border-gray-100 dark:border-neutral-700 shadow-sm overflow-hidden">
        <div className="hidden sm:grid grid-cols-[1fr_5rem_5rem_3rem] gap-3 px-5 py-3 bg-gray-50 dark:bg-neutral-750 border-b border-gray-100 dark:border-neutral-700">
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-neutral-500">
            Día
          </span>
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-neutral-500 text-center flex items-center justify-center gap-1">
            Apertura
            <Tooltip
              text="Hora a la que empieza a operar el negocio este día."
              size={12}
            />
          </span>
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-neutral-500 text-center flex items-center justify-center gap-1">
            Cierre
            <Tooltip
              text="Hora a la que deja de aceptar citas este día."
              size={12}
            />
          </span>
          <span />
        </div>

        {schedule.map((day, i) => (
          <div
            key={i}
            className={`grid grid-cols-[1fr_5rem_5rem_3rem] gap-3 items-center px-5 py-3 transition-colors ${
              !day.enabled ? "opacity-40" : ""
            } ${i < 6 ? "border-b border-gray-50 dark:border-neutral-700/50" : ""}`}
          >
            <div className="flex items-center gap-3">
              <span
                className="w-7 h-7 rounded-lg text-xs font-bold flex items-center justify-center text-white shrink-0"
                style={{
                  backgroundColor: day.enabled ? primaryColor : "#9ca3af",
                }}
              >
                {DAY_SHORT[i]}
              </span>
              <span
                className={`text-sm font-medium ${day.enabled ? "text-gray-900 dark:text-white" : "text-gray-400 dark:text-neutral-500"}`}
              >
                {DAY_LABELS[i]}
              </span>
              <Tooltip text={DAY_TIPS[i]} size={13} />
              {!day.enabled && (
                <span className="text-[10px] font-semibold uppercase tracking-wider text-red-400 dark:text-red-500 bg-red-50 dark:bg-red-900/20 px-2 py-0.5 rounded-md">
                  Cerrado
                </span>
              )}
            </div>

            <input
              type="time"
              value={day.open}
              onChange={(e) => update(i, "open", e.target.value)}
              disabled={!day.enabled}
              className="text-center text-xs font-medium px-2 py-1.5 rounded-lg border border-gray-200 dark:border-neutral-600 bg-gray-50/50 dark:bg-neutral-700 text-gray-700 dark:text-neutral-300 disabled:opacity-30 focus:outline-none focus:ring-2 transition-all"
              style={{ "--tw-ring-color": primaryColor } as React.CSSProperties}
            />
            <input
              type="time"
              value={day.close}
              onChange={(e) => update(i, "close", e.target.value)}
              disabled={!day.enabled}
              className="text-center text-xs font-medium px-2 py-1.5 rounded-lg border border-gray-200 dark:border-neutral-600 bg-gray-50/50 dark:bg-neutral-700 text-gray-700 dark:text-neutral-300 disabled:opacity-30 focus:outline-none focus:ring-2 transition-all"
              style={{ "--tw-ring-color": primaryColor } as React.CSSProperties}
            />

            <button
              onClick={() => toggle(i)}
              className="flex items-center justify-center cursor-pointer"
              title={day.enabled ? "Desactivar día" : "Activar día"}
            >
              {day.enabled ? (
                <ToggleRight size={24} style={{ color: primaryColor }} />
              ) : (
                <ToggleLeft
                  size={24}
                  className="text-gray-300 dark:text-neutral-600"
                />
              )}
            </button>
          </div>
        ))}
      </div>

      <div className="flex justify-end">
        <button
          onClick={() => console.log("Horarios guardados:", schedule)}
          className="px-5 py-2.5 text-sm font-semibold text-white rounded-xl hover:opacity-90 hover:shadow-lg transition-all cursor-pointer"
          style={{
            backgroundColor: primaryColor,
            boxShadow: `0 4px 14px ${primaryColor}40`,
          }}
        >
          Guardar horarios
        </button>
      </div>
    </div>
  );
};
