import { useState } from "react";
import { useTenant } from "@/entities/tenant/TenantContext";
import { Shield, Clock, Timer, AlertTriangle } from "lucide-react";
import { Tooltip } from "@/shared/ui/Tooltip";

interface BookingRule {
  key: string;
  label: string;
  description: string;
  tooltip: string;
  type: "select" | "number" | "toggle";
  value: string | number | boolean;
  options?: { label: string; value: string }[];
  suffix?: string;
  icon: React.ReactNode;
}

const DEFAULT_RULES: Record<string, BookingRule[]> = {
  clinic: [
    {
      key: "defaultDuration",
      label: "Duración estándar de cita",
      description: "Tiempo por defecto que reserva cada cita",
      tooltip:
        "Define cuánto dura una cita estándar. Esto se usa para calcular los bloques en el calendario y evitar traslapes entre citas.",
      type: "select",
      value: "60",
      options: [
        { label: "30 minutos", value: "30" },
        { label: "45 minutos", value: "45" },
        { label: "1 hora", value: "60" },
        { label: "1.5 horas", value: "90" },
        { label: "2 horas", value: "120" },
      ],
      icon: <Timer size={16} />,
    },
    {
      key: "minLeadTime",
      label: "Tiempo mínimo de antelación",
      description: "Cuánto antes se debe agendar una cita",
      tooltip:
        "Evita que los pacientes agenden citas de último momento. Por ejemplo, con 2 horas de antelación, no se puede agendar una cita que inicie en menos de 2 horas.",
      type: "select",
      value: "120",
      options: [
        { label: "Sin mínimo", value: "0" },
        { label: "30 minutos", value: "30" },
        { label: "1 hora", value: "60" },
        { label: "2 horas", value: "120" },
        { label: "24 horas", value: "1440" },
        { label: "48 horas", value: "2880" },
      ],
      icon: <AlertTriangle size={16} />,
    },
    {
      key: "slotInterval",
      label: "Intervalo entre citas",
      description: "Cada cuánto se pueden agendar citas",
      tooltip:
        "Determina la grilla de horarios disponibles. Con 30 minutos, las opciones serían 8:00, 8:30, 9:00, etc. Con 15 minutos: 8:00, 8:15, 8:30, etc.",
      type: "select",
      value: "30",
      options: [
        { label: "15 minutos", value: "15" },
        { label: "30 minutos", value: "30" },
        { label: "1 hora", value: "60" },
      ],
      icon: <Clock size={16} />,
    },
    {
      key: "maxPerDay",
      label: "Máximo de citas por día",
      description: "Límite de citas que un profesional puede atender en un día",
      tooltip:
        "Protege a tus doctores de sobrecarga. Una vez alcanzado el límite, el sistema no mostrará más horas disponibles para ese profesional ese día.",
      type: "number",
      value: 12,
      suffix: "citas",
      icon: <Shield size={16} />,
    },
    {
      key: "bufferTime",
      label: "Descanso entre citas",
      description: "Tiempo obligatorio de descanso entre citas",
      tooltip:
        "Agrega un colchón entre citas para que el profesional pueda prepararse, desinfectar el área o tomar un descanso. No se podrán agendar citas durante este tiempo.",
      type: "select",
      value: "15",
      options: [
        { label: "Sin descanso", value: "0" },
        { label: "5 minutos", value: "5" },
        { label: "10 minutos", value: "10" },
        { label: "15 minutos", value: "15" },
        { label: "30 minutos", value: "30" },
      ],
      icon: <Timer size={16} />,
    },
    {
      key: "allowCancellation",
      label: "Permitir cancelaciones",
      description: "Los pacientes pueden cancelar desde el sistema",
      tooltip:
        "Si está activado, los pacientes podrán cancelar sus citas desde la plataforma. Si está desactivado, solo el personal podrá cancelar.",
      type: "toggle",
      value: true,
      icon: <Shield size={16} />,
    },
  ],
  barbershop: [
    {
      key: "defaultDuration",
      label: "Duración estándar del servicio",
      description: "Tiempo promedio de un corte o servicio",
      tooltip:
        "Define cuánto dura un servicio típico como un corte o una barba. Esto bloquea el tiempo en la agenda del barbero.",
      type: "select",
      value: "30",
      options: [
        { label: "15 minutos", value: "15" },
        { label: "30 minutos", value: "30" },
        { label: "45 minutos", value: "45" },
        { label: "1 hora", value: "60" },
      ],
      icon: <Timer size={16} />,
    },
    {
      key: "minLeadTime",
      label: "Tiempo mínimo de antelación",
      description: "Cuánto antes se debe reservar",
      tooltip:
        "Evita que los clientes reserven muy de último momento. Por ejemplo, con 1 hora de antelación no podrán agendar un turno que inicie en menos de 1 hora.",
      type: "select",
      value: "60",
      options: [
        { label: "Sin mínimo", value: "0" },
        { label: "30 minutos", value: "30" },
        { label: "1 hora", value: "60" },
        { label: "2 horas", value: "120" },
      ],
      icon: <AlertTriangle size={16} />,
    },
    {
      key: "slotInterval",
      label: "Intervalo entre turnos",
      description: "Cada cuánto abrir un slot de reserva",
      tooltip:
        "Controla cada cuántos minutos se puede agendar un turno. Con 15 minutos podés ofrecer horarios como 9:00, 9:15, 9:30, etc.",
      type: "select",
      value: "15",
      options: [
        { label: "15 minutos", value: "15" },
        { label: "30 minutos", value: "30" },
      ],
      icon: <Clock size={16} />,
    },
    {
      key: "maxPerDay",
      label: "Máximo de turnos por barbero",
      description: "Límite diario de turnos por barbero",
      tooltip:
        "Protege a tus barberos de sobrecarga. Una vez alcanzado el límite, no se mostrarán más turnos disponibles para ese barbero.",
      type: "number",
      value: 16,
      suffix: "turnos",
      icon: <Shield size={16} />,
    },
    {
      key: "allowWalkIns",
      label: "Permitir sin cita",
      description: "Aceptar clientes sin reserva previa",
      tooltip:
        "Si está activado, el negocio acepta clientes que llegan sin reserva. Se atenderán en orden de llegada si hay disponibilidad.",
      type: "toggle",
      value: true,
      icon: <Shield size={16} />,
    },
  ],
  restaurant: [
    {
      key: "defaultDuration",
      label: "Duración estándar de reserva",
      description: "Tiempo que dura una reservación de mesa",
      tooltip:
        "Cuánto tiempo se reserva la mesa para un comensal. Al finalizar este tiempo, la mesa se libera para otra reserva.",
      type: "select",
      value: "120",
      options: [
        { label: "1 hora", value: "60" },
        { label: "1.5 horas", value: "90" },
        { label: "2 horas", value: "120" },
        { label: "3 horas", value: "180" },
      ],
      icon: <Timer size={16} />,
    },
    {
      key: "minLeadTime",
      label: "Tiempo mínimo de antelación",
      description: "Cuánto antes se debe reservar mesa",
      tooltip:
        "Impide reservaciones de último momento. Con 24 horas de antelación, los comensales deben reservar al menos un día antes.",
      type: "select",
      value: "1440",
      options: [
        { label: "1 hora", value: "60" },
        { label: "2 horas", value: "120" },
        { label: "24 horas", value: "1440" },
        { label: "48 horas", value: "2880" },
      ],
      icon: <AlertTriangle size={16} />,
    },
    {
      key: "slotInterval",
      label: "Intervalo de reservas",
      description: "Cada cuánto permitir una reservación",
      tooltip:
        "Define los bloques horarios disponibles para reservaciones. Con 30 minutos, las opciones serían 19:00, 19:30, 20:00, etc.",
      type: "select",
      value: "30",
      options: [
        { label: "15 minutos", value: "15" },
        { label: "30 minutos", value: "30" },
        { label: "1 hora", value: "60" },
      ],
      icon: <Clock size={16} />,
    },
    {
      key: "maxPerSlot",
      label: "Máximo de mesas simultáneas",
      description: "Cuántas mesas se pueden reservar a la vez",
      tooltip:
        "Limita la cantidad de reservaciones simultáneas para no sobrepasar la capacidad del restaurante. Incluye todas las mesas y áreas.",
      type: "number",
      value: 8,
      suffix: "mesas",
      icon: <Shield size={16} />,
    },
    {
      key: "allowCancellation",
      label: "Cancelación libre",
      description: "Los comensales pueden cancelar su reserva",
      tooltip:
        "Si está activado, los clientes pueden cancelar su reserva sin necesidad de llamar. Si está desactivado, deben contactar al restaurante.",
      type: "toggle",
      value: true,
      icon: <Shield size={16} />,
    },
  ],
};

export const BookingRulesEditor = () => {
  const tenant = useTenant();
  const primaryColor = tenant.branding?.primaryColor ?? "#6366f1";
  const defaults = DEFAULT_RULES[tenant.type] ?? DEFAULT_RULES.clinic;
  const [rules, setRules] = useState<BookingRule[]>(defaults);

  const updateRule = (key: string, newValue: string | number | boolean) => {
    setRules((prev) =>
      prev.map((r) => (r.key === key ? { ...r, value: newValue } : r)),
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2.5 mb-1">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: `${primaryColor}15` }}
        >
          <Shield size={16} style={{ color: primaryColor }} />
        </div>
        <div className="flex items-center gap-2">
          <div>
            <h2 className="text-base font-semibold text-gray-900 dark:text-white">
              Reglas de Reserva
            </h2>
            <p className="text-xs text-gray-400 dark:text-neutral-500">
              Configurá la lógica de agendamiento
            </p>
          </div>
          <Tooltip text="Estas reglas controlan cómo se comporta el sistema de reservas: duración de citas, restricciones de tiempo y límites de capacidad. Los cambios aplicarán a todas las nuevas reservaciones." />
        </div>
      </div>

      <div className="space-y-3">
        {rules.map((rule) => (
          <div
            key={rule.key}
            className="bg-white dark:bg-neutral-800 rounded-2xl border border-gray-100 dark:border-neutral-700 shadow-sm p-4 flex items-center gap-4 transition-colors"
          >
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
              style={{
                backgroundColor: `${primaryColor}12`,
                color: primaryColor,
              }}
            >
              {rule.icon}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  {rule.label}
                </span>
                <Tooltip text={rule.tooltip} size={13} />
              </div>
              <div className="text-xs text-gray-400 dark:text-neutral-500 mt-0.5">
                {rule.description}
              </div>
            </div>

            <div className="shrink-0">
              {rule.type === "select" && (
                <select
                  value={String(rule.value)}
                  onChange={(e) => updateRule(rule.key, e.target.value)}
                  className="text-sm font-medium px-3 py-2 rounded-lg border border-gray-200 dark:border-neutral-600 bg-gray-50/50 dark:bg-neutral-700 text-gray-700 dark:text-neutral-300 focus:outline-none focus:ring-2 transition-all cursor-pointer appearance-none pr-8"
                  style={
                    {
                      "--tw-ring-color": primaryColor,
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%239ca3af' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "right 8px center",
                    } as React.CSSProperties
                  }
                >
                  {rule.options?.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              )}

              {rule.type === "number" && (
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={Number(rule.value)}
                    onChange={(e) =>
                      updateRule(rule.key, parseInt(e.target.value) || 0)
                    }
                    className="w-16 text-center text-sm font-medium px-2 py-2 rounded-lg border border-gray-200 dark:border-neutral-600 bg-gray-50/50 dark:bg-neutral-700 text-gray-700 dark:text-neutral-300 focus:outline-none focus:ring-2 transition-all"
                    style={
                      { "--tw-ring-color": primaryColor } as React.CSSProperties
                    }
                    min={1}
                  />
                  {rule.suffix && (
                    <span className="text-xs text-gray-400 dark:text-neutral-500">
                      {rule.suffix}
                    </span>
                  )}
                </div>
              )}

              {rule.type === "toggle" && (
                <button
                  onClick={() => updateRule(rule.key, !rule.value)}
                  className="relative w-11 h-6 rounded-full transition-colors cursor-pointer"
                  style={{
                    backgroundColor: rule.value ? primaryColor : "#d1d5db",
                  }}
                  title={
                    rule.value
                      ? "Activado — clic para desactivar"
                      : "Desactivado — clic para activar"
                  }
                >
                  <span
                    className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform"
                    style={{
                      transform: rule.value
                        ? "translateX(20px)"
                        : "translateX(0)",
                    }}
                  />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end">
        <button
          onClick={() => console.log("Reglas guardadas:", rules)}
          className="px-5 py-2.5 text-sm font-semibold text-white rounded-xl hover:opacity-90 hover:shadow-lg transition-all cursor-pointer"
          style={{
            backgroundColor: primaryColor,
            boxShadow: `0 4px 14px ${primaryColor}40`,
          }}
        >
          Guardar reglas
        </button>
      </div>
    </div>
  );
};
