import { useState, useMemo } from "react";
import StickyHeadTable from "@/shared/ui/Table";
import type { Column, Data } from "@/shared/ui/Table";
import FilterBooking from "./FilterBooking";
import type { Filters } from "./FilterBooking";
import { useSchema } from "@/entities/schema/useSchema";
import { useTenant } from "@/entities/tenant/TenantContext";
import { EmptyState } from "@/shared/ui/EmptyState";
import { PageHeader } from "@/shared/ui/PageHeader";
import { Calendar, Clock, User } from "lucide-react";
import { useBookingStore, formatHour } from "@/entities/booking/useBookingStore";
import { useStaffStore } from "@/entities/staff/useStaffStore";
import { useSettingsStore } from "@/entities/settings/useSettingsStore";

const STATUS_LABELS: Record<string, string> = {
  Pending: "Pendiente",
  Confirmed: "Confirmada",
  InProgress: "En atención",
  Completed: "Completada",
  Cancelled: "Cancelada",
};

export default function BookingTable() {
  const schema = useSchema("bookings");
  const tenant = useTenant();
  const primaryColor = tenant.branding?.primaryColor ?? "#6366f1";
  const openNewBooking = useBookingStore((s) => s.openNewBooking);

  const reservations = useBookingStore((s) => s.reservations);
  const allStaff = useStaffStore((s) => s.staff);
  const allServices = useSettingsStore((s) => s.services);

  const [filters, setFilters] = useState<Filters>({
    startDate: undefined,
    endDate: undefined,
    status: "",
    search: "",
  });

  // Filter by tenant + enrich with display names
  const storeRows = useMemo(() => {
    return reservations
      .filter((r) => r.tenant === tenant.type)
      .map((r) => {
        const staff = allStaff.find((s) => s.id === r.staffId);
        const service = allServices.find((s) => s.id === r.serviceId);
        return {
          ...r,
          staffName: staff?.name ?? "—",
          serviceName: service?.name ?? "—",
          timeRange: `${formatHour(r.startHour)} - ${formatHour(r.endHour)}`,
        };
      });
  }, [reservations, allStaff, allServices, tenant.type]);

  const schemaColumns: Column[] = schema
    ? schema.columns.map((col) => ({
        id: col.key,
        label: col.label,
        minWidth: col.key === "status" ? 110 : 150,
      }))
    : [];

  // Apply filters
  const filteredData = useMemo(() => {
    return storeRows.filter((b) => {
      const d = new Date(b.date);
      if (filters.startDate && d < filters.startDate) return false;
      if (filters.endDate && d > filters.endDate) return false;
      if (filters.status && b.status !== filters.status) return false;
      const q = filters.search.toLowerCase();
      if (q) {
        const searchable = `${b.clientName} ${b.staffName} ${b.serviceName} ${b.date} ${b.timeRange}`.toLowerCase();
        if (!searchable.includes(q)) return false;
      }
      return true;
    });
  }, [filters, storeRows]);

  // Map to table rows
  const rows: Data[] = useMemo(() => {
    return filteredData.map((b) => {
      const row: Data = {};
      schemaColumns.forEach((col) => {
        if (col.id === "status") row[col.id] = STATUS_LABELS[b.status] ?? b.status;
        else if (col.id === "client" || col.id === "patient") row[col.id] = b.clientName;
        else if (col.id === "barber" || col.id === "doctor" || col.id === "groomer") row[col.id] = b.staffName;
        else if (col.id === "service") row[col.id] = b.serviceName;
        else if (col.id === "date") row[col.id] = b.date;
        else if (col.id === "time") row[col.id] = b.timeRange;
        else row[col.id] = (b as unknown as Record<string, string>)[col.id] ?? "—";
      });
      return row;
    });
  }, [filteredData, schemaColumns]);

  if (!schema) {
    return (
      <div className="p-6 text-gray-500 dark:text-neutral-400">
        Schema de bookings no encontrado.
      </div>
    );
  }

  return (
    <>
      <PageHeader
        icon={Calendar}
        title={schema.title}
        subtitle={`${storeRows.length} registros totales`}
      />
      <FilterBooking onFilterChange={setFilters} />

      {/* Desktop table */}
      <div className="hidden md:block">
        {rows.length > 0 ? (
          <StickyHeadTable columns={schemaColumns} rows={rows} />
        ) : (
          <EmptyState
            title="Sin resultados"
            description="No se encontraron reservas con los filtros aplicados."
            primaryColor={primaryColor}
            action={{ label: "Nueva reserva", onClick: openNewBooking }}
          />
        )}
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-3 px-1">
        {filteredData.length > 0 ? (
          filteredData.map((b) => (
            <div
              key={b.id}
              className="bg-white dark:bg-neutral-800 rounded-xl border border-gray-100 dark:border-neutral-700 p-4 shadow-sm space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-sm text-gray-900 dark:text-white">{b.clientName}</span>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                  b.status === "Confirmed" || b.status === "Completed"
                    ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300"
                    : b.status === "Pending"
                      ? "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300"
                      : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300"
                }`}>
                  {STATUS_LABELS[b.status] ?? b.status}
                </span>
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500 dark:text-neutral-400">
                <span className="flex items-center gap-1"><User size={11} />{b.staffName}</span>
                <span>{b.serviceName}</span>
                <span className="flex items-center gap-1"><Clock size={11} />{b.timeRange}</span>
                <span>{b.date}</span>
              </div>
            </div>
          ))
        ) : (
          <EmptyState title="Sin resultados" description="No se encontraron reservas." primaryColor={primaryColor} />
        )}
      </div>
    </>
  );
}
