"use client";
import { useState, useMemo } from "react";
import StickyHeadTable from "@/shared/ui/Table";
import type { Column, Data } from "@/shared/ui/Table";
import FilterBooking from "./FilterBooking";
import type { Filters } from "./FilterBooking";
import { bookingsData } from "../data/bookingsData";

/* ----- columnas para la tabla ----- */
const columns: Column[] = [
  { id: "patient", label: "Paciente", minWidth: 150 },
  { id: "doctor",  label: "Doctor",   minWidth: 150 },
  { id: "service", label: "Servicio", minWidth: 150 },
  { id: "date",    label: "Fecha",    minWidth: 110 },
  { id: "time",    label: "Hora",     minWidth: 110 },
  { id: "status",  label: "Estado",   minWidth: 110 },
];

export default function BookingTable() {
  const [filters, setFilters] = useState<Filters>({
    startDate: undefined,
    endDate: undefined,
    status: "",
    search: "",
  });

  /* ---------- filtrado ---------- */
  const rows: Data[] = useMemo(() => {
    return bookingsData
      .filter((b) => {
        const d = new Date(b.date);

        // rango de fechas
        if (filters.startDate && d < filters.startDate) return false;
        if (filters.endDate   && d > filters.endDate)   return false;

        // estado
        if (filters.status && b.status !== filters.status) return false;

        // búsqueda global
        const q = filters.search.toLowerCase();
        if (q) {
          const hay =
            b.patient.toLowerCase().includes(q) ||
            b.doctor .toLowerCase().includes(q) ||
            b.service.toLowerCase().includes(q) ||
            b.status .toLowerCase().includes(q);
          if (!hay) return false;
        }

        return true;
      })
      .map((b) => ({
        patient: b.patient,
        doctor:  b.doctor,
        service: b.service,
        date:    b.date,
        time:    b.time,
        status:  b.status,
      }));
  }, [filters]);

  /* ---------- UI ---------- */
  return (
    <>
      <h1 className="mb-4 text-xl font-semibold">Booking List</h1>

      <FilterBooking onFilterChange={setFilters} />

      <StickyHeadTable columns={columns} rows={rows} />
    </>
  );
}
