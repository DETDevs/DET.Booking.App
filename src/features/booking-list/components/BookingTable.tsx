import { useState, useMemo } from "react";
import StickyHeadTable from "@/shared/ui/Table";
import type { Column, Data } from "@/shared/ui/Table";
import FilterBooking from "./FilterBooking";
import type { Filters } from "./FilterBooking";
import { useSchema } from "@/entities/schema/useSchema";
import { useTenant } from "@/entities/tenant/TenantContext";

const MOCK_DATA: Record<string, Record<string, string>[]> = {
  clinic: [
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
  ],
  barbershop: [
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
  ],
  restaurant: [
    {
      client: "Isabel Quesada",
      table: "Mesa 3",
      guests: "4",
      date: "2025-05-13",
      time: "19:00 - 21:00",
      status: "Confirmed",
    },
    {
      client: "Roberto Arias",
      table: "VIP",
      guests: "8",
      date: "2025-05-14",
      time: "20:00 - 22:00",
      status: "Pending",
    },
    {
      client: "María José Soto",
      table: "Terraza A",
      guests: "2",
      date: "2025-05-14",
      time: "13:00 - 14:30",
      status: "Confirmed",
    },
  ],
  grooming: [
    {
      client: "Sarah Thompson",
      pet: "Buddy",
      groomer: "Marco",
      service: "Dog Full Grooming Services",
      size: "Medium",
      date: "2026-02-28",
      time: "09:00 - 10:30",
      status: "Confirmed",
    },
    {
      client: "Juan Pérez",
      pet: "Kralos",
      groomer: "Laura",
      service: "Dog Bath Services",
      size: "Extra Small",
      date: "2026-02-28",
      time: "10:00 - 11:00",
      status: "Pending",
    },
    {
      client: "Emily García",
      pet: "Mishi",
      groomer: "Marco",
      service: "Cat Grooming",
      size: "Small",
      date: "2026-02-28",
      time: "11:00 - 12:00",
      status: "Confirmed",
    },
    {
      client: "Carlos Rodríguez",
      pet: "Max",
      groomer: "Laura",
      service: "Treatments",
      size: "Large",
      date: "2026-03-01",
      time: "09:00 - 10:00",
      status: "Pending",
    },
    {
      client: "María Fernández",
      pet: "Luna",
      groomer: "Marco",
      service: "Dog Full Grooming Services",
      size: "XLarge",
      date: "2026-03-01",
      time: "10:30 - 12:00",
      status: "Cancelled",
    },
  ],
};

export default function BookingTable() {
  const schema = useSchema("bookings");
  const tenant = useTenant();

  const [filters, setFilters] = useState<Filters>({
    startDate: undefined,
    endDate: undefined,
    status: "",
    search: "",
  });

  const mockData = MOCK_DATA[tenant.type] ?? MOCK_DATA.clinic;

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
          row[col.id] = b[col.id] ?? "";
        });
        return row;
      });
  }, [filters, mockData, schemaColumns]);

  if (!schema) {
    return (
      <div className="p-6 text-gray-500 dark:text-neutral-400">
        Schema de bookings no encontrado.
      </div>
    );
  }

  return (
    <>
      <h1 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
        {schema.title}
      </h1>
      <FilterBooking onFilterChange={setFilters} />
      <StickyHeadTable columns={schemaColumns} rows={rows} />
    </>
  );
}
