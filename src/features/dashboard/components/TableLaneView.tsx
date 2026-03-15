import { useMemo, useState } from "react";
import { useTenant } from "@/entities/tenant/TenantContext";
import { Clock, Users, MapPin, X } from "lucide-react";
import { useToast } from "@/shared/ui/Toast";
import { ConfirmDialog } from "@/shared/ui/ConfirmDialog";
import { StatusLegend, TABLE_STATUS_LEGEND } from "@/shared/ui/StatusLegend";
import { motion } from "motion/react";
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

export function TableLaneView() {
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

  const tableStatusMap: Record<
    string,
    { dot: string; label: string }
  > = {
    Pending: { dot: "bg-amber-400", label: "Reservada" },
    Confirmed: { dot: "bg-emerald-400", label: "Confirmada" },
    InProgress: { dot: "bg-sky-400", label: "Llegó" },
    Completed: { dot: "bg-gray-400 dark:bg-neutral-500", label: "Libre" },
  };

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
