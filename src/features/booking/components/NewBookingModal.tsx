import { useState, useMemo, useEffect } from "react";
import { X, CalendarPlus, Clock, User, Sparkles } from "lucide-react";
import { useTenant } from "@/entities/tenant/TenantContext";
import { useBookingStore, formatHour } from "@/entities/booking/useBookingStore";
import type { ReservationStatus } from "@/entities/booking/useBookingStore";
import { useStaffStore } from "@/entities/staff/useStaffStore";
import { useClientStore } from "@/entities/client/useClientStore";
import { useSettingsStore } from "@/entities/settings/useSettingsStore";
import { useActivityStore } from "@/entities/activity/useActivityStore";
import { useToast } from "@/shared/ui/Toast";
import { motion, AnimatePresence } from "motion/react";

export const NewBookingModal = () => {
  const tenant = useTenant();
  const primaryColor = tenant.branding?.primaryColor ?? "#6366f1";
  const { toast } = useToast();

  const isNewBookingOpen = useBookingStore((s) => s.isNewBookingOpen);
  const closeNewBooking = useBookingStore((s) => s.closeNewBooking);
  const addReservation = useBookingStore((s) => s.addReservation);
  const getAvailableSlots = useBookingStore((s) => s.getAvailableSlots);
  const addActivity = useActivityStore((s) => s.addEntry);

  const allStaff = useStaffStore((s) => s.staff);

  const allClients = useClientStore((s) => s.clients);
  const tenantClients = useMemo(
    () => allClients.filter((c) => c.tenant === tenant.type),
    [allClients, tenant.type],
  );

  const allServices = useSettingsStore((s) => s.services);

  const tenantStaff = useMemo(
    () => allStaff.filter((s) => s.role === tenant.type && s.available),
    [allStaff, tenant.type],
  );

  const tenantServices = useMemo(
    () =>
      allServices.filter(
        (s) => s.active && s.tenant === tenant.type,
      ),
    [allServices, tenant.type],
  );

  const [clientName, setClientName] = useState("");
  const [clientSuggestions, setClientSuggestions] = useState<typeof tenantClients>([]);
  const [serviceId, setServiceId] = useState("");
  const [staffId, setStaffId] = useState("");
  const [date, setDate] = useState("");
  const [startHour, setStartHour] = useState<number | "">("");
  const [notes, setNotes] = useState("");

  // Reset form when modal opens
  useEffect(() => {
    if (isNewBookingOpen) {
      setClientName("");
      setServiceId("");
      setStaffId("");
      setDate("");
      setStartHour("");
      setNotes("");
      setClientSuggestions([]);
    }
  }, [isNewBookingOpen]);

  const handleClientInput = (value: string) => {
    setClientName(value);
    if (value.length >= 2) {
      setClientSuggestions(
        tenantClients.filter((c) =>
          c.name.toLowerCase().includes(value.toLowerCase()),
        ).slice(0, 5),
      );
    } else {
      setClientSuggestions([]);
    }
  };

  const selectedService = useMemo(
    () => tenantServices.find((s) => s.id === serviceId),
    [tenantServices, serviceId],
  );

  const availableStaff = useMemo(() => {
    if (!selectedService) return tenantStaff;
    return tenantStaff.filter((s) => selectedService.staffIds.includes(s.id));
  }, [selectedService, tenantStaff]);

  const availableSlots = useMemo(() => {
    if (!date || !staffId || !selectedService) return [];
    return getAvailableSlots(date, staffId, selectedService.duration, tenant.type);
  }, [date, staffId, selectedService, getAvailableSlots, tenant.type]);

  // Reset startHour when slots change (selected hour may no longer be valid)
  useEffect(() => {
    if (startHour !== "" && !availableSlots.includes(startHour)) {
      setStartHour("");
    }
  }, [availableSlots, startHour]);

  const endHour = useMemo(() => {
    if (startHour === "" || !selectedService) return null;
    return startHour + Math.ceil(selectedService.duration / 30) * 0.5;
  }, [startHour, selectedService]);

  const handleSubmit = () => {
    if (!clientName.trim() || !serviceId || !staffId || !date || startHour === "" || endHour === null) {
      toast("Completá todos los campos obligatorios", "error");
      return;
    }

    addReservation({
      clientName: clientName.trim(),
      staffId,
      serviceId,
      date,
      startHour: startHour as number,
      endHour,
      status: "Confirmed" as ReservationStatus,
      notes: notes.trim() || undefined,
      tenant: tenant.type,
    });

    const staffName = allStaff.find((s) => s.id === staffId)?.name ?? "";
    const serviceName = tenantServices.find((s) => s.id === serviceId)?.name ?? "";
    addActivity({
      action: "create",
      user: "Admin",
      target: clientName.trim(),
      details: `Creó reserva manual: ${serviceName} con ${staffName} a las ${formatHour(startHour as number)}`,
      tenant: tenant.type,
    });
    toast(
      `Reserva creada: ${clientName} con ${staffName} el ${date} a las ${formatHour(startHour as number)}`,
      "success",
    );
    closeNewBooking();
  };

  const inputClass =
    "w-full px-3 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-gray-900 dark:text-neutral-100 focus:outline-none focus:ring-2 transition-all";
  const labelClass =
    "block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-neutral-400 mb-1.5";
  const ringStyle = { "--tw-ring-color": primaryColor } as React.CSSProperties;

  return (
    <AnimatePresence>
      {isNewBookingOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
            onClick={closeNewBooking}
          />

          {/* Slide-over panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-white dark:bg-neutral-800 shadow-2xl border-l border-gray-200 dark:border-neutral-700 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-neutral-700">
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${primaryColor}15` }}
                >
                  <CalendarPlus size={18} style={{ color: primaryColor }} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                    Nueva Reserva
                  </h2>
                  <p className="text-xs text-gray-400 dark:text-neutral-500">
                    Completá los datos para agendar
                  </p>
                </div>
              </div>
              <button
                onClick={closeNewBooking}
                className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-neutral-700 transition-colors cursor-pointer"
                aria-label="Cerrar"
              >
                <X size={18} className="text-gray-500 dark:text-neutral-400" />
              </button>
            </div>

            {/* Form content */}
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
              {/* Client name with autocomplete */}
              <div className="relative">
                <label className={labelClass}>
                  <User size={12} className="inline mr-1" />
                  Cliente *
                </label>
                <input
                  value={clientName}
                  onChange={(e) => handleClientInput(e.target.value)}
                  className={inputClass}
                  style={ringStyle}
                  placeholder="Nombre del cliente"
                />
                {clientSuggestions.length > 0 && (
                  <div className="absolute z-10 top-full left-0 right-0 mt-1 bg-white dark:bg-neutral-700 border border-gray-200 dark:border-neutral-600 rounded-xl shadow-lg py-1 max-h-40 overflow-y-auto">
                    {clientSuggestions.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => {
                          setClientName(c.name);
                          setClientSuggestions([]);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-neutral-300 hover:bg-gray-50 dark:hover:bg-neutral-600 transition-colors cursor-pointer"
                      >
                        <span className="font-medium">{c.name}</span>
                        <span className="text-xs text-gray-400 dark:text-neutral-500 ml-2">
                          {c.phone}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Service */}
              <div>
                <label className={labelClass}>
                  <Sparkles size={12} className="inline mr-1" />
                  Servicio *
                </label>
                <select
                  value={serviceId}
                  onChange={(e) => {
                    setServiceId(e.target.value);
                    setStaffId(""); // Reset staff when service changes
                    setStartHour(""); // Reset hour
                  }}
                  className={inputClass}
                  style={ringStyle}
                >
                  <option value="">Seleccionar servicio</option>
                  {tenantServices.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.duration} min) — C${s.price.toLocaleString()}
                    </option>
                  ))}
                </select>
              </div>

              {/* Staff (filtered by service) */}
              <div>
                <label className={labelClass}>
                  <User size={12} className="inline mr-1" />
                  {tenant.type === "clinic"
                    ? "Doctor *"
                    : tenant.type === "grooming"
                      ? "Groomer *"
                      : tenant.type === "restaurant"
                        ? "Encargado *"
                        : "Barbero *"}
                </label>
                <select
                  value={staffId}
                  onChange={(e) => {
                    setStaffId(e.target.value);
                    setStartHour(""); // Reset hour when staff changes
                  }}
                  className={inputClass}
                  style={ringStyle}
                  disabled={!serviceId}
                >
                  <option value="">
                    {serviceId
                      ? "Seleccionar profesional"
                      : "Primero seleccioná un servicio"}
                  </option>
                  {availableStaff.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date */}
              <div>
                <label className={labelClass}>
                  <CalendarPlus size={12} className="inline mr-1" />
                  Fecha *
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => {
                    setDate(e.target.value);
                    setStartHour(""); // Reset hour when date changes
                  }}
                  className={inputClass}
                  style={ringStyle}
                />
              </div>

              {/* ── TIME SLOT SELECTOR ─────────────────────────────
                  This is the smart slot system:
                  - Only shows hours that DON'T overlap with existing bookings
                  - Grayed out / hidden if date+staff+service not selected
                  - Each slot shows start → end time based on service duration
               ─────────────────────────────────────────────────── */}
              <div>
                <label className={labelClass}>
                  <Clock size={12} className="inline mr-1" />
                  Hora disponible *
                </label>
                {!date || !staffId || !selectedService ? (
                  <p className="text-xs text-gray-400 dark:text-neutral-500 italic py-2">
                    Seleccioná servicio, profesional y fecha para ver los horarios disponibles
                  </p>
                ) : availableSlots.length === 0 ? (
                  <div className="text-center py-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-100 dark:border-red-800/30">
                    <Clock size={20} className="mx-auto mb-1 text-red-400" />
                    <p className="text-xs font-medium text-red-500 dark:text-red-400">
                      No hay horarios disponibles para esta fecha y profesional
                    </p>
                    <p className="text-[10px] text-red-400 dark:text-red-500 mt-0.5">
                      Probá con otra fecha o profesional
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto">
                    {availableSlots.map((slot) => {
                      const end =
                        slot + Math.ceil(selectedService.duration / 30) * 0.5;
                      const isSelected = startHour === slot;
                      return (
                        <button
                          key={slot}
                          onClick={() => setStartHour(slot)}
                          className={`py-2 px-1 text-xs font-medium rounded-xl border-2 transition-all cursor-pointer ${
                            isSelected
                              ? "text-white border-transparent shadow-md"
                              : "text-gray-600 dark:text-neutral-300 border-gray-200 dark:border-neutral-600 hover:border-gray-300 dark:hover:border-neutral-500"
                          }`}
                          style={
                            isSelected
                              ? { backgroundColor: primaryColor, borderColor: primaryColor }
                              : undefined
                          }
                        >
                          {formatHour(slot)}
                          <span className="block text-[10px] opacity-70">
                            → {formatHour(end)}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Notes */}
              <div>
                <label className={labelClass}>Notas (opcional)</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                  className={`${inputClass} resize-none`}
                  style={ringStyle}
                  placeholder="Comentarios adicionales..."
                />
              </div>

              {/* Summary */}
              {startHour !== "" && selectedService && endHour !== null && (
                <div
                  className="rounded-xl p-4 space-y-1"
                  style={{ backgroundColor: `${primaryColor}08`, borderLeft: `3px solid ${primaryColor}` }}
                >
                  <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: primaryColor }}>
                    Resumen
                  </p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {clientName || "—"} • {selectedService.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-neutral-400">
                    {date} de {formatHour(startHour as number)} a {formatHour(endHour)} ({selectedService.duration} min)
                  </p>
                  <p className="text-xs text-gray-500 dark:text-neutral-400">
                    Con {allStaff.find((s) => s.id === staffId)?.name}
                  </p>
                  {selectedService.price > 0 && (
                    <p className="text-sm font-bold" style={{ color: primaryColor }}>
                      C${selectedService.price.toLocaleString()}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-100 dark:border-neutral-700 flex gap-3">
              <button
                onClick={closeNewBooking}
                className="flex-1 py-3 text-sm font-medium text-gray-600 dark:text-neutral-300 bg-gray-100 dark:bg-neutral-700 rounded-xl hover:bg-gray-200 dark:hover:bg-neutral-600 transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={handleSubmit}
                disabled={!clientName || !serviceId || !staffId || !date || startHour === ""}
                className="flex-1 py-3 text-sm font-semibold text-white rounded-xl transition-all cursor-pointer hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ backgroundColor: primaryColor }}
              >
                Crear Reserva
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
