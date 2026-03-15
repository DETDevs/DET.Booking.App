import { useMemo } from "react";
import { useTenant } from "@/entities/tenant/TenantContext";
import {
  Clock,
  User,
  Check,
  MapPin,
  Users,
  X,
  Play,
  ArrowRight,
} from "lucide-react";
import { Tooltip } from "@/shared/ui/Tooltip";
import { useToast } from "@/shared/ui/Toast";
import { ConfirmDialog } from "@/shared/ui/ConfirmDialog";
import {
  StatusLegend,
  STAFF_STATUS_LEGEND,
  TABLE_STATUS_LEGEND,
} from "@/shared/ui/StatusLegend";
import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";

import {
  useBookingStore,
  formatHour,
  localDateStr,
} from "@/entities/booking/useBookingStore";
import type { ReservationStatus } from "@/entities/booking/useBookingStore";
import { useStaffStore } from "@/entities/staff/useStaffStore";
import { useSettingsStore } from "@/entities/settings/useSettingsStore";
import { useActivityStore } from "@/entities/activity/useActivityStore";
import type { ActivityAction } from "@/entities/activity/useActivityStore";

const statusConfig: Record<
  ReservationStatus,
  { dot: string; border: string; label: string }
> = {
  Pending: {
    dot: "bg-amber-400",
    border: "border-l-amber-400",
    label: "Pendiente",
  },
  Confirmed: {
    dot: "bg-emerald-400",
    border: "border-l-emerald-400",
    label: "Confirmada",
  },
  InProgress: {
    dot: "bg-sky-400",
    border: "border-l-sky-400",
    label: "En atención",
  },
  Completed: {
    dot: "bg-gray-400 dark:bg-neutral-500",
    border: "border-l-gray-300 dark:border-l-neutral-600",
    label: "Completada",
  },
  Cancelled: {
    dot: "bg-red-400",
    border: "border-l-red-400",
    label: "Cancelada",
  },
};

const actionBtnBase =
  "p-1.5 rounded-lg transition-colors cursor-pointer";
const actionBtn =
  `${actionBtnBase} text-gray-500 dark:text-neutral-400 hover:bg-gray-100 dark:hover:bg-neutral-700 hover:text-gray-800 dark:hover:text-neutral-200`;
const cancelBtn =
  `${actionBtnBase} text-gray-400 dark:text-neutral-500 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 dark:hover:text-red-400`;

function StaffLaneView() {
  const tenant = useTenant();
  const primaryColor = tenant.branding?.primaryColor ?? "#6366f1";
  const { toast } = useToast();
  const [cancelTarget, setCancelTarget] = useState<string | null>(null);

  const reservations = useBookingStore((s) => s.reservations);
  const updateStatus = useBookingStore((s) => s.updateReservationStatus);
  const cancelReservation = useBookingStore((s) => s.cancelReservation);
  const allStaff = useStaffStore((s) => s.staff);
  const allServices = useSettingsStore((s) => s.services);
  const addActivity = useActivityStore((s) => s.addEntry);

  const todayStr = localDateStr();

  const staffLanes = useMemo(() => {
    const tenantStaff = allStaff.filter(
      (s) => s.role === tenant.type && s.available,
    );
    const todayBookings = reservations
      .filter(
        (r) =>
          r.tenant === tenant.type &&
          r.date === todayStr &&
          r.status !== "Cancelled",
      )
      .sort((a, b) => a.startHour - b.startHour);

    return tenantStaff.map((staff) => ({
      staffId: staff.id,
      staffName: staff.name,
      avatar: staff.avatar,
      bookings: todayBookings
        .filter((r) => r.staffId === staff.id)
        .map((r) => {
          const service = allServices.find((s) => s.id === r.serviceId);
          return {
            ...r,
            serviceName: service?.name ?? "—",
            time: `${formatHour(r.startHour)} – ${formatHour(r.endHour)}`,
          };
        }),
    }));
  }, [allStaff, reservations, allServices, tenant.type, todayStr]);

  const handleStatusChange = (
    id: string,
    newStatus: ReservationStatus,
    clientName: string,
  ) => {
    updateStatus(id, newStatus);
    const booking = reservations.find((r) => r.id === id);
    const staffName = allStaff.find((s) => s.id === booking?.staffId)?.name ?? "";
    const serviceName = allServices.find((s) => s.id === booking?.serviceId)?.name ?? "";
    const actionMap: Record<string, ActivityAction> = { Confirmed: "confirm", InProgress: "start", Completed: "complete" };
    const detailMap: Record<string, string> = {
      Confirmed: `Confirmó cita de ${serviceName} con ${staffName}`,
      InProgress: `Inició atención: ${serviceName} con ${staffName}`,
      Completed: `Completó ${serviceName} con ${staffName}`,
    };
    addActivity({ action: actionMap[newStatus] ?? "confirm", user: "Admin", target: clientName, details: detailMap[newStatus] ?? "", tenant: tenant.type });
    const labels: Record<string, string> = { Confirmed: "confirmada", InProgress: "iniciada", Completed: "completada" };
    toast(`Cita de ${clientName} ${labels[newStatus] ?? "actualizada"} ✓`, "success");
  };

  const handleCancel = () => {
    if (!cancelTarget) return;
    const booking = reservations.find((r) => r.id === cancelTarget);
    const staffName = allStaff.find((s) => s.id === booking?.staffId)?.name ?? "";
    const serviceName = allServices.find((s) => s.id === booking?.serviceId)?.name ?? "";
    cancelReservation(cancelTarget);
    addActivity({ action: "cancel", user: "Admin", target: booking?.clientName ?? "", details: `Canceló cita de ${serviceName} con ${staffName}`, tenant: tenant.type });
    toast(`Cita de ${booking?.clientName ?? ""} cancelada`, "error");
    setCancelTarget(null);
  };

  const staffLabel =
    tenant.type === "clinic"
      ? "Doctores"
      : tenant.type === "grooming"
        ? "Groomers"
        : "Barberos";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Users size={20} style={{ color: primaryColor }} />
            Agenda de Hoy — {staffLabel}
          </h2>
          <p className="text-xs text-gray-400 dark:text-neutral-500 mt-0.5">
            {todayStr} •{" "}
            {staffLanes.reduce(
              (sum, lane) => sum + lane.bookings.length,
              0,
            )}{" "}
            citas programadas
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {staffLanes.map((lane) => (
          <div
            key={lane.staffId}
            className="bg-white dark:bg-neutral-800 rounded-2xl border border-gray-100 dark:border-neutral-700 shadow-sm overflow-hidden"
          >
            {/* Staff header */}
            <div className="flex items-center gap-3 px-5 py-3 border-b border-gray-100 dark:border-neutral-700">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-xs font-bold shrink-0"
                style={{ backgroundColor: primaryColor }}
              >
                {lane.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                  {lane.staffName}
                </p>
                <p className="text-xs text-gray-400 dark:text-neutral-500">
                  {lane.bookings.length}{" "}
                  {lane.bookings.length === 1 ? "cita" : "citas"} hoy
                </p>
              </div>
              <div className="flex items-center gap-1.5">
                {lane.bookings.some((b) => b.status === "InProgress") && (
                  <span className="flex items-center gap-1.5 text-[10px] font-medium text-gray-500 dark:text-neutral-400 bg-gray-50 dark:bg-neutral-700 px-2 py-0.5 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
                    En atención
                  </span>
                )}
              </div>
            </div>

            {/* Bookings */}
            <div className="divide-y divide-gray-50 dark:divide-neutral-700/50">
              <AnimatePresence mode="popLayout">
                {lane.bookings.length > 0 ? (
                  lane.bookings.map((booking) => {
                    const sc = statusConfig[booking.status];
                    return (
                      <motion.div
                        key={booking.id}
                        layout
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: 50 }}
                        className={`px-5 py-3 flex items-center gap-4 group border-l-[3px] ${sc.border}`}
                      >
                        {/* Time */}
                        <div className="w-28 shrink-0">
                          <Tooltip
                            text={`${booking.serviceName} (${booking.endHour - booking.startHour}h)`}
                          >
                            <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-neutral-400">
                              <Clock size={12} />
                              <span className="font-medium">
                                {booking.time}
                              </span>
                            </div>
                          </Tooltip>
                        </div>

                        {/* Client + Service */}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900 dark:text-white truncate flex items-center gap-2">
                            <User
                              size={13}
                              className="text-gray-400 dark:text-neutral-500 shrink-0"
                            />
                            {booking.clientName}
                          </p>
                          <p className="text-xs text-gray-400 dark:text-neutral-500 truncate mt-0.5">
                            {booking.serviceName}
                          </p>
                        </div>

                        {/* Status badge — neutral bg + colored dot */}
                        <span className="flex items-center gap-1.5 text-[10px] font-medium px-2 py-0.5 rounded-full shrink-0 bg-gray-50 dark:bg-neutral-700 text-gray-600 dark:text-neutral-300">
                          <span
                            className={`w-1.5 h-1.5 rounded-full shrink-0 ${sc.dot}`}
                          />
                          {sc.label}
                        </span>

                        {/* Action buttons — neutral colors */}
                        <div className="flex items-center gap-0.5 shrink-0">
                          {booking.status === "Pending" && (
                            <Tooltip text="Confirmar">
                              <button
                                onClick={() =>
                                  handleStatusChange(
                                    booking.id,
                                    "Confirmed",
                                    booking.clientName,
                                  )
                                }
                                className={actionBtn}
                              >
                                <Check size={15} />
                              </button>
                            </Tooltip>
                          )}
                          {booking.status === "Confirmed" && (
                            <Tooltip text="Iniciar atención">
                              <button
                                onClick={() =>
                                  handleStatusChange(
                                    booking.id,
                                    "InProgress",
                                    booking.clientName,
                                  )
                                }
                                className={actionBtn}
                              >
                                <Play size={15} />
                              </button>
                            </Tooltip>
                          )}
                          {booking.status === "InProgress" && (
                            <Tooltip text="Completar">
                              <button
                                onClick={() =>
                                  handleStatusChange(
                                    booking.id,
                                    "Completed",
                                    booking.clientName,
                                  )
                                }
                                className={actionBtn}
                              >
                                <ArrowRight size={15} />
                              </button>
                            </Tooltip>
                          )}
                          {booking.status !== "Completed" && (
                            <Tooltip text="Cancelar">
                              <button
                                onClick={() => setCancelTarget(booking.id)}
                                className={cancelBtn}
                              >
                                <X size={15} />
                              </button>
                            </Tooltip>
                          )}
                        </div>
                      </motion.div>
                    );
                  })
                ) : (
                  <div className="py-6 text-center text-xs text-gray-400 dark:text-neutral-500">
                    Sin citas programadas
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>
        ))}
      </div>

      <ConfirmDialog
        open={cancelTarget !== null}
        title="Cancelar cita"
        message={`¿Estás seguro de cancelar esta cita? Esta acción no se puede deshacer.`}
        confirmLabel="Sí, cancelar"
        cancelLabel="Volver"
        variant="danger"
        onConfirm={handleCancel}
        onCancel={() => setCancelTarget(null)}
      />

      <StatusLegend items={STAFF_STATUS_LEGEND} title="Estados de citas" />
    </div>
  );
}

function TableLaneView() {
  const tenant = useTenant();
  const primaryColor = tenant.branding?.primaryColor ?? "#6366f1";
  const { toast } = useToast();
  const [cancelTarget, setCancelTarget] = useState<string | null>(null);

  const reservations = useBookingStore((s) => s.reservations);
  const updateStatus = useBookingStore((s) => s.updateReservationStatus);
  const cancelReservation = useBookingStore((s) => s.cancelReservation);
  const allStaff = useStaffStore((s) => s.staff);
  const allServices = useSettingsStore((s) => s.services);
  const addActivity = useActivityStore((s) => s.addEntry);

  const todayStr = localDateStr();

  const tableLanes = useMemo(() => {
    const restaurantStaff = allStaff.filter(
      (s) => s.role === "restaurant" && s.available,
    );
    const todayBookings = reservations
      .filter(
        (r) =>
          r.tenant === "restaurant" &&
          r.date === todayStr &&
          r.status !== "Cancelled",
      )
      .sort((a, b) => a.startHour - b.startHour);

    return restaurantStaff.map((staff) => {
      const service = allServices.find(
        (sv) =>
          sv.staffIds.includes(staff.id) && sv.tenant === "restaurant",
      );
      const booking = todayBookings.find((r) => r.staffId === staff.id);
      return {
        tableId: staff.id,
        tableName: service?.name ?? staff.name,
        area: staff.speciality ?? "Salón",
        booking: booking
          ? {
              ...booking,
              time: `${formatHour(booking.startHour)} – ${formatHour(booking.endHour)}`,
              guests: booking.serviceId.includes("18") ? 8 : 4,
            }
          : null,
      };
    });
  }, [allStaff, reservations, allServices, todayStr]);

  const handleStatusChange = (
    id: string,
    newStatus: ReservationStatus,
    clientName: string,
  ) => {
    updateStatus(id, newStatus);
    const actionMap: Record<string, ActivityAction> = { Confirmed: "confirm", InProgress: "start", Completed: "complete" };
    const detailMap: Record<string, string> = {
      Confirmed: `Confirmó reserva de mesa`,
      InProgress: `Cliente ${clientName} llegó al restaurante`,
      Completed: `Mesa liberada`,
    };
    addActivity({ action: actionMap[newStatus] ?? "confirm", user: "Admin", target: clientName, details: detailMap[newStatus] ?? "", tenant: "restaurant" });
    const labels: Record<string, string> = { Confirmed: "confirmada", InProgress: "cliente llegó", Completed: "mesa liberada" };
    toast(`Reserva de ${clientName}: ${labels[newStatus] ?? "actualizada"} ✓`, "success");
  };

  const handleCancel = () => {
    if (!cancelTarget) return;
    const booking = reservations.find((r) => r.id === cancelTarget);
    cancelReservation(cancelTarget);
    addActivity({ action: "cancel", user: "Admin", target: booking?.clientName ?? "", details: "Canceló reserva de mesa", tenant: "restaurant" });
    toast(`Reserva de ${booking?.clientName ?? ""} cancelada`, "error");
    setCancelTarget(null);
  };

  // Table status — uses same neutral badge approach with dots
  const tableStatusMap: Record<
    string,
    { dot: string; label: string }
  > = {
    Pending: { dot: "bg-amber-400", label: "Reservada" },
    Confirmed: { dot: "bg-emerald-400", label: "Confirmada" },
    InProgress: { dot: "bg-sky-400", label: "Llegó" },
    Completed: { dot: "bg-gray-400 dark:bg-neutral-500", label: "Libre" },
  };

  // Neutral table action button
  const tableActionBtn =
    "flex-1 text-center py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer bg-gray-100 dark:bg-neutral-700 text-gray-700 dark:text-neutral-200 hover:bg-gray-200 dark:hover:bg-neutral-600";

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <MapPin size={20} style={{ color: primaryColor }} />
          Estado de Mesas — Hoy
        </h2>
        <p className="text-xs text-gray-400 dark:text-neutral-500 mt-0.5">
          {todayStr} •{" "}
          {tableLanes.filter((t) => t.booking).length} mesas con reserva
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tableLanes.map((table) => {
          const bk = table.booking;
          const ts = bk
            ? (tableStatusMap[bk.status] ?? tableStatusMap.Pending)
            : null;

          return (
            <motion.div
              key={table.tableId}
              layout
              className={`bg-white dark:bg-neutral-800 rounded-2xl border border-gray-100 dark:border-neutral-700 shadow-sm overflow-hidden ${bk ? "" : "opacity-60"}`}
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-50 dark:border-neutral-700/50">
                <div className="flex items-center gap-2">
                  <MapPin size={14} style={{ color: primaryColor }} />
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    {table.tableName}
                  </span>
                </div>
                <span className="text-[10px] text-gray-400 dark:text-neutral-500">
                  {table.area}
                </span>
              </div>

              {bk && ts ? (
                <div className="px-4 py-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {bk.clientName}
                    </span>
                    {/* Neutral badge with dot */}
                    <span className="flex items-center gap-1.5 text-[10px] font-medium px-2 py-0.5 rounded-full bg-gray-50 dark:bg-neutral-700 text-gray-600 dark:text-neutral-300">
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${ts.dot}`}
                      />
                      {ts.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-400 dark:text-neutral-500">
                    <span className="flex items-center gap-1">
                      <Clock size={11} />
                      {bk.time}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users size={11} />
                      {bk.guests} personas
                    </span>
                  </div>

                  {/* Neutral action buttons */}
                  {bk.status !== "Completed" && (
                    <div className="flex gap-1.5 pt-1">
                      {bk.status === "Pending" && (
                        <button
                          onClick={() =>
                            handleStatusChange(
                              bk.id,
                              "Confirmed",
                              bk.clientName,
                            )
                          }
                          className={tableActionBtn}
                        >
                          Confirmar
                        </button>
                      )}
                      {bk.status === "Confirmed" && (
                        <button
                          onClick={() =>
                            handleStatusChange(
                              bk.id,
                              "InProgress",
                              bk.clientName,
                            )
                          }
                          className={tableActionBtn}
                        >
                          Llegó
                        </button>
                      )}
                      {bk.status === "InProgress" && (
                        <button
                          onClick={() =>
                            handleStatusChange(
                              bk.id,
                              "Completed",
                              bk.clientName,
                            )
                          }
                          className={tableActionBtn}
                        >
                          Liberar mesa
                        </button>
                      )}
                      <button
                        onClick={() => setCancelTarget(bk.id)}
                        className="px-3 py-1.5 text-xs font-medium text-gray-400 dark:text-neutral-500 bg-gray-50 dark:bg-neutral-700/50 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 dark:hover:text-red-400 transition-colors cursor-pointer"
                      >
                        <X size={13} />
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="px-4 py-4 text-center text-xs text-gray-400 dark:text-neutral-500">
                  Disponible
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      <ConfirmDialog
        open={cancelTarget !== null}
        title="Cancelar reserva"
        message="¿Estás seguro de cancelar esta reserva de mesa?"
        confirmLabel="Sí, cancelar"
        cancelLabel="Volver"
        variant="danger"
        onConfirm={handleCancel}
        onCancel={() => setCancelTarget(null)}
      />

      <StatusLegend items={TABLE_STATUS_LEGEND} title="Estados de mesas" />
    </div>
  );
}

export function TodaySection() {
  const tenant = useTenant();
  return tenant.type === "restaurant" ? <TableLaneView /> : <StaffLaneView />;
}
