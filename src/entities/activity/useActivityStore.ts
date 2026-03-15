import { create } from "zustand";
import { persist } from "zustand/middleware";
import { localDateStr } from "@/entities/booking/useBookingStore";

export type ActivityAction =
  | "confirm"
  | "cancel"
  | "reschedule"
  | "create"
  | "settings"
  | "complete"
  | "start";

export interface ActivityEntry {
  id: string;
  action: ActivityAction;
  user: string; // "Admin" or "Sistema"
  target: string; // client name or entity
  timestamp: string; // ISO string
  details: string;
  tenant: string;
}

interface ActivityStore {
  entries: ActivityEntry[];
  addEntry: (entry: Omit<ActivityEntry, "id" | "timestamp">) => void;
  getByTenant: (tenantType: string) => ActivityEntry[];
  clearAll: () => void;
}

export function relativeTime(isoStr: string): string {
  const now = new Date();
  const date = new Date(isoStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffH = Math.floor(diffMin / 60);
  const diffD = Math.floor(diffH / 24);

  const timeStr = date.toLocaleTimeString("es-NI", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  const todayStr = localDateStr(now);
  const dateStr = localDateStr(date);
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const yestStr = localDateStr(yesterday);

  if (dateStr === todayStr) {
    if (diffMin < 1) return "Ahora";
    if (diffMin < 60) return `Hace ${diffMin} min`;
    return `Hoy, ${timeStr}`;
  }
  if (dateStr === yestStr) return `Ayer, ${timeStr}`;
  if (diffD < 7) return `Hace ${diffD} días`;
  return dateStr;
}

const now = new Date();
function hoursAgo(h: number): string {
  return new Date(now.getTime() - h * 3600000).toISOString();
}

const SEED_ENTRIES: ActivityEntry[] = [
  { id: "ae1", action: "confirm", user: "Admin", target: "Carlos Rivera", timestamp: hoursAgo(0.5), details: "Confirmó cita de Fade para las 10:00", tenant: "barbershop" },
  { id: "ae2", action: "start", user: "Admin", target: "Pablo Castillo", timestamp: hoursAgo(1), details: "Inició atención: Barba con José Ureña", tenant: "barbershop" },
  { id: "ae3", action: "create", user: "Sistema", target: "Andrés Mora", timestamp: hoursAgo(2), details: "Nueva reserva desde plataforma web: Corte + Barba", tenant: "barbershop" },
  { id: "ae4", action: "complete", user: "Admin", target: "Luis Hernández", timestamp: hoursAgo(3), details: "Completó servicio de Tinte con Marco Jiménez", tenant: "barbershop" },
  { id: "ae5", action: "complete", user: "Admin", target: "Diego Vargas", timestamp: hoursAgo(4), details: "Completó Corte clásico con David Solano", tenant: "barbershop" },
  { id: "ae6", action: "create", user: "Admin", target: "Kevin Soto", timestamp: hoursAgo(6), details: "Creó reserva manual: Fade a las 14:00", tenant: "barbershop" },
  { id: "ae7", action: "cancel", user: "Admin", target: "Fernando Ruiz", timestamp: hoursAgo(26), details: "Canceló cita de Barba para ayer", tenant: "barbershop" },
  { id: "ae8", action: "create", user: "Sistema", target: "Diego Vargas", timestamp: hoursAgo(50), details: "Nueva reserva desde plataforma web: Corte clásico", tenant: "barbershop" },
  { id: "ae9", action: "complete", user: "Admin", target: "Amanda Chavez", timestamp: hoursAgo(1), details: "Completó Fisioterapia con Dr. Emily Johnson", tenant: "clinic" },
  { id: "ae10", action: "start", user: "Admin", target: "Randy Elliot", timestamp: hoursAgo(1.5), details: "Inició atención: Psicología con Dra. Ana Pérez", tenant: "clinic" },
  { id: "ae11", action: "confirm", user: "Admin", target: "María López", timestamp: hoursAgo(3), details: "Confirmó Consulta General para las 14:00", tenant: "clinic" },
  { id: "ae12", action: "create", user: "Sistema", target: "Laura Soto", timestamp: hoursAgo(5), details: "Nueva reserva web: Nutrición a las 15:00", tenant: "clinic" },
  { id: "ae13", action: "complete", user: "Admin", target: "Sarah Thompson (Buddy)", timestamp: hoursAgo(1), details: "Completó Dog Full Grooming con Marco Rivera", tenant: "grooming" },
  { id: "ae14", action: "start", user: "Admin", target: "Juan Pérez (Kralos)", timestamp: hoursAgo(2), details: "Inició Dog Bath Services con Laura Méndez", tenant: "grooming" },
  { id: "ae15", action: "create", user: "Admin", target: "Carlos Rodríguez (Max)", timestamp: hoursAgo(6), details: "Creó reserva: Treatments a las 14:00", tenant: "grooming" },
  { id: "ae16", action: "confirm", user: "Admin", target: "Isabel Quesada", timestamp: hoursAgo(2), details: "Confirmó Mesa Interior para 4 personas", tenant: "restaurant" },
  { id: "ae17", action: "create", user: "Sistema", target: "Roberto Arias", timestamp: hoursAgo(4), details: "Nueva reserva web: Mesa VIP para 8 personas", tenant: "restaurant" },
  { id: "ae18", action: "confirm", user: "Admin", target: "María José Soto", timestamp: hoursAgo(5), details: "Confirmó Terraza para 4 personas", tenant: "restaurant" },
];

export const useActivityStore = create<ActivityStore>()(persist(
  (set, get) => ({
    entries: SEED_ENTRIES,

    addEntry: (data) => {
      const entry: ActivityEntry = {
        ...data,
        id: `ae-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
        timestamp: new Date().toISOString(),
      };
      set((s) => ({
        entries: [entry, ...s.entries].slice(0, 200),
      }));
    },

    getByTenant: (tenantType) => {
      return get().entries.filter((e) => e.tenant === tenantType);
    },

    clearAll: () => set({ entries: [] }),
  }),
  {
    name: "det-activity-store",
    partialize: (state) => ({ entries: state.entries }),
  },
));
