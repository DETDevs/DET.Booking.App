import { useState, useMemo } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalIcon,
  Clock,
  User,
  X,
  Check,
  RotateCcw,
} from "lucide-react";
import { useTenant } from "@/entities/tenant/TenantContext";
import { useSchema } from "@/entities/schema/useSchema";

interface Booking {
  id: string;
  client: string;
  service: string;
  staff: string;
  date: string;
  startHour: number;
  endHour: number;
  status: "Confirmed" | "Pending" | "Cancelled" | "Completed";
}

const MOCK_BOOKINGS: Record<string, Booking[]> = {
  clinic: [
    {
      id: "c1",
      client: "Amanda Chavez",
      service: "Fisioterapia",
      staff: "Dr. Emily Johnson",
      date: "2026-02-16",
      startHour: 9,
      endHour: 10,
      status: "Confirmed",
    },
    {
      id: "c2",
      client: "Jasmine Palmer",
      service: "Pediatría",
      staff: "Dr. Carlos Martínez",
      date: "2026-02-16",
      startHour: 11,
      endHour: 12,
      status: "Pending",
    },
    {
      id: "c3",
      client: "Randy Elliot",
      service: "Psicología",
      staff: "Dra. Ana Pérez",
      date: "2026-02-17",
      startHour: 10,
      endHour: 11,
      status: "Confirmed",
    },
    {
      id: "c4",
      client: "Christine Powell",
      service: "Dermatología",
      staff: "Dr. Emily Johnson",
      date: "2026-02-17",
      startHour: 14,
      endHour: 15,
      status: "Confirmed",
    },
    {
      id: "c5",
      client: "Fionna Wade",
      service: "Terapia Ocupacional",
      staff: "Dr. Carlos Martínez",
      date: "2026-02-18",
      startHour: 8,
      endHour: 9,
      status: "Pending",
    },
    {
      id: "c6",
      client: "Beatrice Carrol",
      service: "Consulta General",
      staff: "Dra. Ana Pérez",
      date: "2026-02-19",
      startHour: 15,
      endHour: 16,
      status: "Cancelled",
    },
    {
      id: "c7",
      client: "Amanda Chavez",
      service: "Fisioterapia",
      staff: "Dr. Emily Johnson",
      date: "2026-02-20",
      startHour: 9,
      endHour: 10,
      status: "Confirmed",
    },
  ],
  barbershop: [
    {
      id: "b1",
      client: "Carlos Rivera",
      service: "Fade",
      staff: "Marco Jiménez",
      date: "2026-02-16",
      startHour: 10,
      endHour: 11,
      status: "Confirmed",
    },
    {
      id: "b2",
      client: "Andrés Mora",
      service: "Corte + Barba",
      staff: "David Solano",
      date: "2026-02-16",
      startHour: 11,
      endHour: 12,
      status: "Pending",
    },
    {
      id: "b3",
      client: "Kevin Soto",
      service: "Degradado",
      staff: "José Ureña",
      date: "2026-02-16",
      startHour: 14,
      endHour: 15,
      status: "Confirmed",
    },
    {
      id: "b4",
      client: "Luis Hernández",
      service: "Tinte",
      staff: "Marco Jiménez",
      date: "2026-02-17",
      startHour: 9,
      endHour: 10,
      status: "Confirmed",
    },
    {
      id: "b5",
      client: "Diego Vargas",
      service: "Corte clásico",
      staff: "David Solano",
      date: "2026-02-18",
      startHour: 10,
      endHour: 11,
      status: "Pending",
    },
    {
      id: "b6",
      client: "Pablo Castillo",
      service: "Barba",
      staff: "José Ureña",
      date: "2026-02-19",
      startHour: 12,
      endHour: 13,
      status: "Cancelled",
    },
  ],
  restaurant: [
    {
      id: "r1",
      client: "Isabel Quesada",
      service: "Mesa 3 – 4 personas",
      staff: "Laura Salas",
      date: "2026-02-16",
      startHour: 19,
      endHour: 21,
      status: "Confirmed",
    },
    {
      id: "r2",
      client: "Roberto Arias",
      service: "VIP – 8 personas",
      staff: "Carlos Montero",
      date: "2026-02-16",
      startHour: 20,
      endHour: 22,
      status: "Pending",
    },
    {
      id: "r3",
      client: "María José Soto",
      service: "Terraza A – 2 personas",
      staff: "Ana Marchena",
      date: "2026-02-17",
      startHour: 13,
      endHour: 14,
      status: "Confirmed",
    },
    {
      id: "r4",
      client: "Carlos Montero",
      service: "Mesa 1 – 6 personas",
      staff: "Laura Salas",
      date: "2026-02-18",
      startHour: 19,
      endHour: 21,
      status: "Confirmed",
    },
    {
      id: "r5",
      client: "Luis Alvarado",
      service: "Mesa 5 – 2 personas",
      staff: "Ana Marchena",
      date: "2026-02-20",
      startHour: 20,
      endHour: 22,
      status: "Pending",
    },
  ],
  grooming: [
    {
      id: "g1",
      client: "Sarah Thompson (Buddy)",
      service: "Dog Full Grooming",
      staff: "Marco Rivera",
      date: "2026-02-16",
      startHour: 9,
      endHour: 11,
      status: "Confirmed",
    },
    {
      id: "g2",
      client: "Juan Pérez (Kralos)",
      service: "Dog Bath Services",
      staff: "Laura Méndez",
      date: "2026-02-16",
      startHour: 10,
      endHour: 11,
      status: "Pending",
    },
    {
      id: "g3",
      client: "Emily García (Mishi)",
      service: "Cat Grooming",
      staff: "Sofía Castillo",
      date: "2026-02-17",
      startHour: 9,
      endHour: 10,
      status: "Confirmed",
    },
    {
      id: "g4",
      client: "Carlos Rodríguez (Max)",
      service: "Treatments",
      staff: "Marco Rivera",
      date: "2026-02-17",
      startHour: 11,
      endHour: 12,
      status: "Confirmed",
    },
    {
      id: "g5",
      client: "María Fernández (Luna)",
      service: "Dog Full Grooming",
      staff: "Laura Méndez",
      date: "2026-02-18",
      startHour: 9,
      endHour: 11,
      status: "Pending",
    },
    {
      id: "g6",
      client: "David Chen (Whiskers)",
      service: "Cat Grooming",
      staff: "Sofía Castillo",
      date: "2026-02-19",
      startHour: 14,
      endHour: 15,
      status: "Cancelled",
    },
    {
      id: "g7",
      client: "Ana López (Rocky)",
      service: "Dog Bath Services",
      staff: "Marco Rivera",
      date: "2026-02-20",
      startHour: 10,
      endHour: 11,
      status: "Confirmed",
    },
  ],
};

const HOURS = Array.from({ length: 14 }, (_, i) => i + 7);

function getWeekDays(baseDate: Date): Date[] {
  const start = new Date(baseDate);
  const day = start.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  start.setDate(start.getDate() + diff);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return d;
  });
}

function fmt(d: Date) {
  return d.toISOString().slice(0, 10);
}

const DAY_NAMES = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
const MONTH_NAMES = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

const statusColors: Record<
  string,
  { bg: string; text: string; border: string }
> = {
  Confirmed: {
    bg: "bg-emerald-50 dark:bg-emerald-900/30",
    text: "text-emerald-700 dark:text-emerald-400",
    border: "border-l-emerald-500",
  },
  Pending: {
    bg: "bg-amber-50 dark:bg-amber-900/30",
    text: "text-amber-700 dark:text-amber-400",
    border: "border-l-amber-500",
  },
  Cancelled: {
    bg: "bg-red-50 dark:bg-red-900/30",
    text: "text-red-700 dark:text-red-400",
    border: "border-l-red-500",
  },
  Completed: {
    bg: "bg-purple-50 dark:bg-purple-900/30",
    text: "text-purple-700 dark:text-purple-400",
    border: "border-l-purple-500",
  },
};

const STATUS_LABELS: Record<string, string> = {
  Confirmed: "Confirmada",
  Pending: "Pendiente",
  Cancelled: "Cancelada",
  Completed: "Completada",
};

const CalendarPage = () => {
  const tenant = useTenant();
  const schema = useSchema("bookings");
  const primaryColor = tenant.branding?.primaryColor ?? "#6366f1";
  const [currentDate, setCurrentDate] = useState(new Date(2026, 1, 16));
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const weekDays = useMemo(() => getWeekDays(currentDate), [currentDate]);
  const bookings = MOCK_BOOKINGS[tenant.type] ?? MOCK_BOOKINGS.clinic;

  const prevWeek = () => {
    const d = new Date(currentDate);
    d.setDate(d.getDate() - 7);
    setCurrentDate(d);
  };
  const nextWeek = () => {
    const d = new Date(currentDate);
    d.setDate(d.getDate() + 7);
    setCurrentDate(d);
  };
  const today = () => setCurrentDate(new Date(2026, 1, 16));

  const weekStart = weekDays[0];
  const weekEnd = weekDays[6];
  const monthLabel =
    weekStart.getMonth() === weekEnd.getMonth()
      ? `${MONTH_NAMES[weekStart.getMonth()]} ${weekStart.getFullYear()}`
      : `${MONTH_NAMES[weekStart.getMonth()]} – ${MONTH_NAMES[weekEnd.getMonth()]} ${weekEnd.getFullYear()}`;

  const bookingLabel = schema?.title ?? "Calendario";

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <CalIcon size={22} style={{ color: primaryColor }} />
            {bookingLabel}
          </h1>
          <p className="text-sm text-gray-500 dark:text-neutral-400 mt-0.5">
            {monthLabel}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={today}
            className="px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-200 dark:border-neutral-600 text-gray-700 dark:text-neutral-300 hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors cursor-pointer"
          >
            Hoy
          </button>
          <button
            onClick={prevWeek}
            className="p-1.5 rounded-lg border border-gray-200 dark:border-neutral-600 hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors cursor-pointer"
          >
            <ChevronLeft
              size={16}
              className="text-gray-600 dark:text-neutral-400"
            />
          </button>
          <button
            onClick={nextWeek}
            className="p-1.5 rounded-lg border border-gray-200 dark:border-neutral-600 hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors cursor-pointer"
          >
            <ChevronRight
              size={16}
              className="text-gray-600 dark:text-neutral-400"
            />
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-neutral-800 rounded-2xl border border-gray-100 dark:border-neutral-700 shadow-sm overflow-hidden">
        <div className="grid grid-cols-[4rem_repeat(7,1fr)] border-b border-gray-100 dark:border-neutral-700">
          <div className="p-2" />
          {weekDays.map((d, i) => {
            const isToday = fmt(d) === "2026-02-16";
            return (
              <div
                key={i}
                className={`text-center py-3 ${isToday ? "" : "border-l border-gray-100 dark:border-neutral-700"}`}
              >
                <div className="text-xs font-medium text-gray-400 dark:text-neutral-500 uppercase">
                  {DAY_NAMES[i]}
                </div>
                <div
                  className={`text-lg font-bold mt-0.5 ${isToday ? "text-white w-8 h-8 rounded-full flex items-center justify-center mx-auto" : "text-gray-900 dark:text-white"}`}
                  style={isToday ? { backgroundColor: primaryColor } : {}}
                >
                  {d.getDate()}
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-[4rem_repeat(7,1fr)] max-h-[520px] overflow-y-auto">
          {HOURS.map((hour) => (
            <div key={hour} className="contents">
              <div className="py-3 px-2 text-right text-xs font-medium text-gray-400 dark:text-neutral-500 border-t border-gray-50 dark:border-neutral-700/50">
                {hour}:00
              </div>
              {weekDays.map((d, di) => {
                const dayStr = fmt(d);
                const cellBookings = bookings.filter(
                  (bk) => bk.date === dayStr && bk.startHour === hour,
                );
                return (
                  <div
                    key={di}
                    className="border-t border-l border-gray-50 dark:border-neutral-700/50 min-h-[3rem] relative p-0.5"
                  >
                    {cellBookings.map((bk) => {
                      const sc =
                        statusColors[bk.status] ?? statusColors.Pending;
                      const span = bk.endHour - bk.startHour;
                      return (
                        <button
                          key={bk.id}
                          onClick={() => setSelectedBooking(bk)}
                          className={`absolute inset-x-0.5 ${sc.bg} ${sc.border} border-l-[3px] rounded-md px-1.5 py-1 text-left overflow-hidden cursor-pointer hover:shadow-md transition-shadow z-10`}
                          style={{ height: `calc(${span * 100}% - 2px)` }}
                        >
                          <div
                            className={`text-[11px] font-semibold truncate ${sc.text}`}
                          >
                            {bk.client}
                          </div>
                          <div className="text-[10px] text-gray-500 dark:text-neutral-400 truncate">
                            {bk.service}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {selectedBooking && (
        <BookingDetailModal
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
          primaryColor={primaryColor}
          tenant={tenant}
        />
      )}
    </div>
  );
};

interface ModalProps {
  booking: Booking;
  onClose: () => void;
  primaryColor: string;
  tenant: any;
}

const BookingDetailModal = ({
  booking,
  onClose,
  primaryColor,
  tenant,
}: ModalProps) => {
  const [status, setStatus] = useState(booking.status);
  const [showReschedule, setShowReschedule] = useState(false);
  const [newDate, setNewDate] = useState(booking.date);
  const [newTime, setNewTime] = useState(`${booking.startHour}:00`);
  const sc = statusColors[status] ?? statusColors.Pending;

  const staffLabel =
    tenant.type === "clinic"
      ? "Doctor"
      : tenant.type === "barbershop"
        ? "Barbero"
        : tenant.type === "grooming"
          ? "Groomer"
          : "Encargado";
  const clientLabel =
    tenant.type === "clinic"
      ? "Paciente"
      : tenant.type === "grooming"
        ? "Dueño"
        : "Cliente";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white dark:bg-neutral-800 rounded-2xl shadow-2xl w-full max-w-md border border-gray-100 dark:border-neutral-700 overflow-hidden">
        <div className="h-2" style={{ backgroundColor: primaryColor }} />

        <div className="p-6 space-y-5">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                Detalle de Cita
              </h2>
              <span
                className={`inline-block mt-1 text-xs font-semibold px-2.5 py-0.5 rounded-full ${sc.bg} ${sc.text}`}
              >
                {STATUS_LABELS[status] ?? status}
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-700 transition-colors cursor-pointer"
            >
              <X size={18} className="text-gray-500 dark:text-neutral-400" />
            </button>
          </div>

          <div className="space-y-3">
            <DetailRow
              icon={<User size={15} />}
              label={clientLabel}
              value={booking.client}
            />
            <DetailRow
              icon={<User size={15} />}
              label={staffLabel}
              value={booking.staff}
            />
            <DetailRow
              icon={<CalIcon size={15} />}
              label="Servicio"
              value={booking.service}
            />
            <DetailRow
              icon={<CalIcon size={15} />}
              label="Fecha"
              value={booking.date}
            />
            <DetailRow
              icon={<Clock size={15} />}
              label="Hora"
              value={`${booking.startHour}:00 – ${booking.endHour}:00`}
            />
          </div>

          {showReschedule && (
            <div className="space-y-3 p-4 bg-gray-50 dark:bg-neutral-700/50 rounded-xl border border-gray-100 dark:border-neutral-600">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                Reprogramar
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-500 dark:text-neutral-400 mb-1">
                    Nueva fecha
                  </label>
                  <input
                    type="date"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-sm text-gray-900 dark:text-neutral-100 focus:outline-none focus:ring-2 transition-all"
                    style={
                      { "--tw-ring-color": primaryColor } as React.CSSProperties
                    }
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 dark:text-neutral-400 mb-1">
                    Nueva hora
                  </label>
                  <input
                    type="time"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-sm text-gray-900 dark:text-neutral-100 focus:outline-none focus:ring-2 transition-all"
                    style={
                      { "--tw-ring-color": primaryColor } as React.CSSProperties
                    }
                  />
                </div>
              </div>
              <button
                onClick={() => {
                  console.log("Rescheduled:", newDate, newTime);
                  setShowReschedule(false);
                }}
                className="w-full py-2 text-sm font-semibold text-white rounded-lg transition-all cursor-pointer hover:opacity-90"
                style={{ backgroundColor: primaryColor }}
              >
                Confirmar nueva fecha
              </button>
            </div>
          )}

          {status === "Completed" ? (
            <div className="flex items-center justify-center gap-2 py-3 px-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-100 dark:border-purple-800/40">
              <Check
                size={16}
                className="text-purple-600 dark:text-purple-400"
              />
              <span className="text-sm font-semibold text-purple-700 dark:text-purple-400">
                Cita completada exitosamente
              </span>
            </div>
          ) : (
            <div className="flex gap-2">
              {status === "Pending" && (
                <button
                  onClick={() => setStatus("Confirmed")}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-sm font-semibold text-white rounded-xl hover:opacity-90 transition-all cursor-pointer"
                  style={{ backgroundColor: "#10b981" }}
                >
                  <Check size={15} /> Confirmar
                </button>
              )}
              {status === "Confirmed" && (
                <button
                  onClick={() => setStatus("Completed")}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-sm font-semibold text-white bg-purple-600 rounded-xl hover:bg-purple-700 transition-all cursor-pointer"
                >
                  <Check size={15} /> Completar
                </button>
              )}
              {status !== "Cancelled" && (
                <button
                  onClick={() => setStatus("Cancelled")}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-sm font-semibold text-white bg-red-500 rounded-xl hover:bg-red-600 transition-all cursor-pointer"
                >
                  <X size={15} /> Cancelar
                </button>
              )}
              <button
                onClick={() => setShowReschedule(!showReschedule)}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-sm font-semibold rounded-xl border border-gray-200 dark:border-neutral-600 text-gray-700 dark:text-neutral-300 hover:bg-gray-50 dark:hover:bg-neutral-700 transition-all cursor-pointer"
              >
                <RotateCcw size={15} /> Reprogramar
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const DetailRow = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) => (
  <div className="flex items-center gap-3">
    <div className="text-gray-400 dark:text-neutral-500">{icon}</div>
    <div>
      <div className="text-[11px] font-medium text-gray-400 dark:text-neutral-500 uppercase tracking-wide">
        {label}
      </div>
      <div className="text-sm font-medium text-gray-900 dark:text-white">
        {value}
      </div>
    </div>
  </div>
);

export default CalendarPage;
