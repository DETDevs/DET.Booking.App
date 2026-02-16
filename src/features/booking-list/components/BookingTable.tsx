import { useState, useMemo } from "react";
import StickyHeadTable from "@/shared/ui/Table";
import type { Column, Data } from "@/shared/ui/Table";
import FilterBooking from "./FilterBooking";
import type { Filters } from "./FilterBooking";
import { useSchema } from "@/entities/schema/useSchema";
import { useTenant } from "@/entities/tenant/TenantContext";

const MOCK_CLINIC_BOOKINGS = [
  {
    patient: "Amanda Chavez",
    doctor: "Dr. Emily Johnson",
    service: "Fisioterapia",
    date: "2025-05-13",
    time: "11:00 - 12:00",
    status: "Pending",
  },
  {
    patient: "Jasmine Palmer",
    doctor: "Dr. Carlos Martínez",
    service: "Terapia Ocupacional",
    date: "2025-05-14",
    time: "09:00 - 10:00",
    status: "Confirmed",
  },
  {
    patient: "Randy Elliot",
    doctor: "Dra. Ana Pérez",
    service: "Psicología",
    date: "2025-05-14",
    time: "10:30 - 11:30",
    status: "Cancelled",
  },
];

const MOCK_BARBER_BOOKINGS = [
  {
    client: "Carlos Rivera",
    barber: "Marco Jiménez",
    service: "Fade",
    date: "2025-05-13",
    time: "10:00 - 10:30",
    status: "Confirmed",
  },
  {
    client: "Andrés Mora",
    barber: "David Solano",
    service: "Corte + Barba",
    date: "2025-05-14",
    time: "11:00 - 11:45",
    status: "Pending",
  },
  {
    client: "Kevin Soto",
    barber: "José Ureña",
    service: "Tinte",
    date: "2025-05-14",
    time: "14:00 - 15:00",
    status: "Cancelled",
  },
];

export default function BookingTable() {
  const schema = useSchema("bookings");
  const tenant = useTenant();

  const [filters, setFilters] = useState<Filters>({
    startDate: undefined,
    endDate: undefined,
    status: "",
    search: "",
  });

  const mockData =
    tenant.type === "barbershop" ? MOCK_BARBER_BOOKINGS : MOCK_CLINIC_BOOKINGS;

  const schemaColumns: Column[] = schema
    ? schema.columns.map((col) => ({
        id: col.key,
        label: col.label,
        minWidth: col.key === "status" ? 110 : 150,
      }))
    : [];

  const rows: Data[] = useMemo(() => {
    return mockData
      .filter((b) => {
        const d = new Date(b.date);

        if (filters.startDate && d < filters.startDate) return false;
        if (filters.endDate && d > filters.endDate) return false;

        if (filters.status && b.status !== filters.status) return false;

        const q = filters.search.toLowerCase();
        if (q) {
          const values = Object.values(b).join(" ").toLowerCase();
          if (!values.includes(q)) return false;
        }

        return true;
      })
      .map((b) => {
        const row: Data = {};
        schemaColumns.forEach((col) => {
          row[col.id] = (b as Record<string, string>)[col.id] ?? "";
        });
        return row;
      });
  }, [filters, mockData, schemaColumns]);

  if (!schema) {
    return (
      <div className="p-6 text-gray-500">Schema de bookings no encontrado.</div>
    );
  }

  return (
    <>
      <h1 className="mb-4 text-xl font-semibold">{schema.title}</h1>
      <FilterBooking onFilterChange={setFilters} />
      <StickyHeadTable columns={schemaColumns} rows={rows} />
    </>
  );
}
