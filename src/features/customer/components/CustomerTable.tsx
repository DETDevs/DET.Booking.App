import { useState, useMemo } from "react";
import StickyHeadTable from "@/shared/ui/Table";
import type { Column, Data } from "@/shared/ui/Table";
import FilterComponent, { type Filters } from "../../../shared/ui/filter";
import { customerData } from "../data/customerdata";

const columns: Column[] = [
  { id: "name", label: "Nombre", minWidth: 150 },
  { id: "email", label: "Correo", minWidth: 150 },
  { id: "service", label: "Servicio", minWidth: 150 },
  { id: "date", label: "Fecha", minWidth: 110 },
  { id: "time", label: "Hora", minWidth: 110 },
  { id: "status", label: "Estado", minWidth: 110 },
];

export const CustomerTable = () => {
  const [filter, setfilter] = useState<Filters>({
    startDate: undefined,
    endDate: undefined,
    status: "",
    search: "",
  });

  const rows: Data[] = useMemo(() => {
    return customerData
      .filter((b) => {
        const d = new Date(b.date);

        if (filter.startDate && d < filter.startDate) return false;
        if (filter.endDate && d > filter.endDate) return false;

        // estado
        if (filter.status && b.status !== filter.status) return false;

        const q = filter.search.toLowerCase();
        if (q) {
          const hay =
            b.name.toLowerCase().includes(q) ||
            b.email.toLowerCase().includes(q) ||
            b.service.toLowerCase().includes(q) ||
            b.status.toLowerCase().includes(q);
          if (!hay) return false;
        }

        return true;
      })
      .map((b) => ({
        name: b.name,
        email: b.email,
        service: b.service,
        date: b.date,
        time: b.time,
        status: b.status,
      }));
  }, [filter]);

  return (
    <>
      <h1 className="mb-4 text-xl font-semibold">Customer</h1>

      <FilterComponent onFilterChange={setfilter} />

      <StickyHeadTable columns={columns} rows={rows} />
    </>
  );
};
