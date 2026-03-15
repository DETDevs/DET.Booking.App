import { useState, useMemo, useEffect } from "react";
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
import { useToast } from "@/shared/ui/Toast";
import { ConfirmDialog } from "@/shared/ui/ConfirmDialog";
import { StatusLegend, CALENDAR_STATUS_LEGEND } from "@/shared/ui/StatusLegend";
import { useBookingStore, formatHour } from "@/entities/booking/useBookingStore";
import type { Reservation, ReservationStatus } from "@/entities/booking/useBookingStore";
import { useStaffStore } from "@/entities/staff/useStaffStore";
import { useSettingsStore } from "@/entities/settings/useSettingsStore";

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
  const y = d.getFullYear();
  const m = (d.getMonth() + 1).toString().padStart(2, "0");
  const day = d.getDate().toString().padStart(2, "0");
  return `${y}-${m}-${day}`;
}

const DAY_NAMES = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
const MONTH_NAMES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

const statusColors: Record<string, { bg: string; text: string; border: string }> = {
  Confirmed: { bg: "bg-emerald-50 dark:bg-emerald-900/30", text: "text-emerald-700 dark:text-emerald-400", border: "border-l-emerald-500" },
  Pending: { bg: "bg-amber-50 dark:bg-amber-900/30", text: "text-amber-700 dark:text-amber-400", border: "border-l-amber-500" },
  Cancelled: { bg: "bg-red-50 dark:bg-red-900/30", text: "text-red-700 dark:text-red-400", border: "border-l-red-500" },
  Completed: { bg: "bg-purple-50 dark:bg-purple-900/30", text: "text-purple-700 dark:text-purple-400", border: "border-l-purple-500" },
  InProgress: { bg: "bg-blue-50 dark:bg-blue-900/30", text: "text-blue-700 dark:text-blue-400", border: "border-l-blue-500" },
};

const STATUS_LABELS: Record<string, string> = {
  Confirmed: "Confirmada",
  Pending: "Pendiente",
  Cancelled: "Cancelada",
  Completed: "Completada",
  InProgress: "En atención",
};

interface CalendarBooking extends Reservation {
  staffName: string;
  serviceName: string;
}

const CalendarPage = () => {
  const tenant = useTenant();
  const schema = useSchema("bookings");
  const primaryColor = tenant.branding?.primaryColor ?? "#6366f1";
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedBooking, setSelectedBooking] = useState<CalendarBooking | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  const reservations = useBookingStore((s) => s.reservations);
  const allStaff = useStaffStore((s) => s.staff);
  const allServices = useSettingsStore((s) => s.services);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Filter by tenant and enrich with display names
  const bookings: CalendarBooking[] = useMemo(() => {
    return reservations
      .filter((r) => r.tenant === tenant.type && r.status !== "Cancelled")
      .map((r) => ({
        ...r,
        staffName: allStaff.find((s) => s.id === r.staffId)?.name ?? "—",
        serviceName: allServices.find((s) => s.id === r.serviceId)?.name ?? "—",
      }));
  }, [reservations, allStaff, allServices, tenant.type]);

  const weekDays = useMemo(() => getWeekDays(currentDate), [currentDate]);

  const prevWeek = () => {
    const d = new Date(currentDate);
    d.setDate(d.getDate() - (isMobile ? 1 : 7));
    setCurrentDate(d);
  };
  const nextWeek = () => {
    const d = new Date(currentDate);
    d.setDate(d.getDate() + (isMobile ? 1 : 7));
    setCurrentDate(d);
  };
  const today = () => setCurrentDate(new Date());

  const weekStart = weekDays[0];
  const weekEnd = weekDays[6];
  const monthLabel = isMobile
    ? `${currentDate.getDate()} ${MONTH_NAMES[currentDate.getMonth()]} ${currentDate.getFullYear()}`
    : weekStart.getMonth() === weekEnd.getMonth()
      ? `${MONTH_NAMES[weekStart.getMonth()]} ${weekStart.getFullYear()}`
      : `${MONTH_NAMES[weekStart.getMonth()]} – ${MONTH_NAMES[weekEnd.getMonth()]} ${weekEnd.getFullYear()}`;

  const bookingLabel = schema?.title ?? "Calendario";

  // Mobile: show single day view
  if (isMobile) {
    const dayStr = fmt(currentDate);
    const dayBookings = bookings
      .filter((bk) => bk.date === dayStr)
      .sort((a, b) => a.startHour - b.startHour);
    const dayName = DAY_NAMES[(currentDate.getDay() + 6) % 7];

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <CalIcon size={20} style={{ color: primaryColor }} />
              {bookingLabel}
            </h1>
            <p className="text-sm text-gray-500 dark:text-neutral-400 mt-0.5">
              {dayName}, {monthLabel}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={today} className="px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-200 dark:border-neutral-600 text-gray-700 dark:text-neutral-300 hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors cursor-pointer">
              Hoy
            </button>
            <button onClick={prevWeek} className="p-1.5 rounded-lg border border-gray-200 dark:border-neutral-600 hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors cursor-pointer">
              <ChevronLeft size={16} className="text-gray-600 dark:text-neutral-400" />
            </button>
            <button onClick={nextWeek} className="p-1.5 rounded-lg border border-gray-200 dark:border-neutral-600 hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors cursor-pointer">
              <ChevronRight size={16} className="text-gray-600 dark:text-neutral-400" />
            </button>
          </div>
        </div>

        <div className="space-y-3">
          {dayBookings.length > 0 ? (
            dayBookings.map((bk) => {
              const sc = statusColors[bk.status] ?? statusColors.Pending;
              return (
                <button
                  key={bk.id}
                  onClick={() => setSelectedBooking(bk)}
                  className={`w-full text-left p-4 rounded-xl ${sc.bg} border-l-[3px] ${sc.border} transition-all hover:shadow-md cursor-pointer`}
                >
                  <div className={`text-sm font-semibold ${sc.text}`}>{bk.clientName}</div>
                  <div className="text-xs text-gray-500 dark:text-neutral-400 mt-1">{bk.serviceName}</div>
                  <div className="flex items-center gap-3 mt-2 text-xs text-gray-400 dark:text-neutral-500">
                    <span className="flex items-center gap-1"><Clock size={11} />{formatHour(bk.startHour)} – {formatHour(bk.endHour)}</span>
                    <span className="flex items-center gap-1"><User size={11} />{bk.staffName}</span>
                  </div>
                  <span className={`inline-block mt-2 text-[10px] font-semibold px-2 py-0.5 rounded-full ${sc.bg} ${sc.text}`}>
                    {STATUS_LABELS[bk.status]}
                  </span>
                </button>
              );
            })
          ) : (
            <div className="text-center py-12 text-gray-400 dark:text-neutral-500">
              <CalIcon size={32} className="mx-auto mb-2 opacity-30" />
              <p className="text-sm">Sin citas este día</p>
            </div>
          )}
        </div>

        {selectedBooking && (
          <BookingDetailModal
            booking={selectedBooking}
            onClose={() => setSelectedBooking(null)}
            primaryColor={primaryColor}
            tenant={tenant}
          />
        )}

        <StatusLegend items={CALENDAR_STATUS_LEGEND} title="Estados" />
      </div>
    );
  }

  // Desktop: week view
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
          <button onClick={today} className="px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-200 dark:border-neutral-600 text-gray-700 dark:text-neutral-300 hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors cursor-pointer">
            Hoy
          </button>
          <button onClick={prevWeek} className="p-1.5 rounded-lg border border-gray-200 dark:border-neutral-600 hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors cursor-pointer" aria-label="Semana anterior">
            <ChevronLeft size={16} className="text-gray-600 dark:text-neutral-400" />
          </button>
          <button onClick={nextWeek} className="p-1.5 rounded-lg border border-gray-200 dark:border-neutral-600 hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors cursor-pointer" aria-label="Semana siguiente">
            <ChevronRight size={16} className="text-gray-600 dark:text-neutral-400" />
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-neutral-800 rounded-2xl border border-gray-100 dark:border-neutral-700 shadow-sm overflow-hidden">
        <div className="grid grid-cols-[4rem_repeat(7,1fr)] border-b border-gray-100 dark:border-neutral-700">
          <div className="p-2" />
          {weekDays.map((d, i) => {
            const isToday = fmt(d) === fmt(new Date());
            return (
              <div key={i} className={`text-center py-3 ${isToday ? "" : "border-l border-gray-100 dark:border-neutral-700"}`}>
                <div className="text-xs font-medium text-gray-400 dark:text-neutral-500 uppercase">{DAY_NAMES[i]}</div>
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
                  <div key={di} className="border-t border-l border-gray-50 dark:border-neutral-700/50 min-h-[3rem] relative p-0.5">
                    {cellBookings.map((bk) => {
                      const sc = statusColors[bk.status] ?? statusColors.Pending;
                      const span = bk.endHour - bk.startHour;
                      return (
                        <button
                          key={bk.id}
                          onClick={() => setSelectedBooking(bk)}
                          className={`absolute inset-x-0.5 ${sc.bg} ${sc.border} border-l-[3px] rounded-md px-1.5 py-1 text-left overflow-hidden cursor-pointer hover:shadow-md transition-shadow z-10`}
                          style={{ height: `calc(${span * 100}% - 2px)` }}
                          aria-label={`Cita: ${bk.clientName} - ${bk.serviceName}`}
                        >
                          <div className={`text-[11px] font-semibold truncate ${sc.text}`}>{bk.clientName}</div>
                          <div className="text-[10px] text-gray-500 dark:text-neutral-400 truncate">{bk.serviceName}</div>
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

      <StatusLegend items={CALENDAR_STATUS_LEGEND} title="Leyenda de estados" />
    </div>
  );
};

interface ModalProps {
  booking: CalendarBooking;
  onClose: () => void;
  primaryColor: string;
  tenant: ReturnType<typeof useTenant>;
}

const BookingDetailModal = ({ booking, onClose, primaryColor, tenant }: ModalProps) => {
  // Connect to store actions
  const updateStatus = useBookingStore((s) => s.updateReservationStatus);
  const cancelReservation = useBookingStore((s) => s.cancelReservation);

  const [status, setStatus] = useState<ReservationStatus>(booking.status);
  const [showReschedule, setShowReschedule] = useState(false);
  const [newDate, setNewDate] = useState(booking.date);
  const [newTime, setNewTime] = useState(`${booking.startHour}:00`);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const { toast } = useToast();

  const sc = statusColors[status] ?? statusColors.Pending;

  const staffLabel =
    tenant.type === "clinic" ? "Doctor"
      : tenant.type === "barbershop" ? "Barbero"
        : tenant.type === "grooming" ? "Groomer"
          : "Encargado";
  const clientLabel =
    tenant.type === "clinic" ? "Paciente"
      : tenant.type === "grooming" ? "Dueño"
        : "Cliente";

  const handleConfirm = () => {
    updateStatus(booking.id, "Confirmed");
    setStatus("Confirmed");
    toast(`Cita de ${booking.clientName} confirmada`, "success");
  };

  const handleComplete = () => {
    updateStatus(booking.id, "Completed");
    setStatus("Completed");
    toast(`Cita de ${booking.clientName} completada`, "success");
  };

  const handleCancel = () => {
    cancelReservation(booking.id);
    setStatus("Cancelled");
    toast(`Cita de ${booking.clientName} cancelada`, "error");
    setShowCancelConfirm(false);
  };

  const handleReschedule = () => {
    toast(`Cita reprogramada al ${newDate} a las ${newTime}`, "info");
    setShowReschedule(false);
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
        <div className="relative bg-white dark:bg-neutral-800 rounded-2xl shadow-2xl w-full max-w-md border border-gray-100 dark:border-neutral-700 overflow-hidden">
          <div className="h-2" style={{ backgroundColor: primaryColor }} />
          <div className="p-6 space-y-5">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Detalle de Cita</h2>
                <span className={`inline-block mt-1 text-xs font-semibold px-2.5 py-0.5 rounded-full ${sc.bg} ${sc.text}`}>
                  {STATUS_LABELS[status] ?? status}
                </span>
              </div>
              <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-700 transition-colors cursor-pointer" aria-label="Cerrar">
                <X size={18} className="text-gray-500 dark:text-neutral-400" />
              </button>
            </div>

            <div className="space-y-3">
              <DetailRow icon={<User size={15} />} label={clientLabel} value={booking.clientName} />
              <DetailRow icon={<User size={15} />} label={staffLabel} value={booking.staffName} />
              <DetailRow icon={<CalIcon size={15} />} label="Servicio" value={booking.serviceName} />
              <DetailRow icon={<CalIcon size={15} />} label="Fecha" value={booking.date} />
              <DetailRow icon={<Clock size={15} />} label="Hora" value={`${formatHour(booking.startHour)} – ${formatHour(booking.endHour)}`} />
            </div>

            {showReschedule && (
              <div className="space-y-3 p-4 bg-gray-50 dark:bg-neutral-700/50 rounded-xl border border-gray-100 dark:border-neutral-600">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Reprogramar</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 dark:text-neutral-400 mb-1">Nueva fecha</label>
                    <input type="date" value={newDate} onChange={(e) => setNewDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-sm text-gray-900 dark:text-neutral-100 focus:outline-none focus:ring-2 transition-all"
                      style={{ "--tw-ring-color": primaryColor } as React.CSSProperties} />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 dark:text-neutral-400 mb-1">Nueva hora</label>
                    <input type="time" value={newTime} onChange={(e) => setNewTime(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-sm text-gray-900 dark:text-neutral-100 focus:outline-none focus:ring-2 transition-all"
                      style={{ "--tw-ring-color": primaryColor } as React.CSSProperties} />
                  </div>
                </div>
                <button onClick={handleReschedule} className="w-full py-2 text-sm font-semibold text-white rounded-lg transition-all cursor-pointer hover:opacity-90" style={{ backgroundColor: primaryColor }}>
                  Confirmar nueva fecha
                </button>
              </div>
            )}

            {status === "Completed" ? (
              <div className="flex items-center justify-center gap-2 py-3 px-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-100 dark:border-purple-800/40">
                <Check size={16} className="text-purple-600 dark:text-purple-400" />
                <span className="text-sm font-semibold text-purple-700 dark:text-purple-400">Cita completada exitosamente</span>
              </div>
            ) : status === "Cancelled" ? (
              <div className="flex items-center justify-center gap-2 py-3 px-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-100 dark:border-red-800/40">
                <X size={16} className="text-red-600 dark:text-red-400" />
                <span className="text-sm font-semibold text-red-700 dark:text-red-400">Cita cancelada</span>
              </div>
            ) : (
              <div className="flex gap-2">
                {status === "Pending" && (
                  <button onClick={handleConfirm} className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-sm font-semibold text-white rounded-xl hover:opacity-90 transition-all cursor-pointer" style={{ backgroundColor: "#10b981" }}>
                    <Check size={15} /> Confirmar
                  </button>
                )}
                {status === "Confirmed" && (
                  <button onClick={handleComplete} className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-sm font-semibold text-white bg-purple-600 rounded-xl hover:bg-purple-700 transition-all cursor-pointer">
                    <Check size={15} /> Completar
                  </button>
                )}
                <button onClick={() => setShowCancelConfirm(true)} className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-sm font-semibold text-white bg-red-500 rounded-xl hover:bg-red-600 transition-all cursor-pointer">
                  <X size={15} /> Cancelar
                </button>
                <button onClick={() => setShowReschedule(!showReschedule)} className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-sm font-semibold rounded-xl border border-gray-200 dark:border-neutral-600 text-gray-700 dark:text-neutral-300 hover:bg-gray-50 dark:hover:bg-neutral-700 transition-all cursor-pointer">
                  <RotateCcw size={15} /> Reprogramar
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={showCancelConfirm}
        title="Cancelar cita"
        message={`¿Estás seguro de cancelar la cita de ${booking.clientName}? Esta acción no se puede deshacer.`}
        confirmLabel="Sí, cancelar"
        cancelLabel="Volver"
        variant="danger"
        onConfirm={handleCancel}
        onCancel={() => setShowCancelConfirm(false)}
      />
    </>
  );
};

const DetailRow = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
  <div className="flex items-center gap-3">
    <div className="text-gray-400 dark:text-neutral-500">{icon}</div>
    <div>
      <div className="text-[11px] font-medium text-gray-400 dark:text-neutral-500 uppercase tracking-wide">{label}</div>
      <div className="text-sm font-medium text-gray-900 dark:text-white">{value}</div>
    </div>
  </div>
);

export default CalendarPage;
