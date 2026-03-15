import { useState, useEffect } from "react";
import { RotateCcw, Search } from "lucide-react";
import { Calendar } from "@/shared/ui/Calendar";
import { Popover, PopoverTrigger, PopoverContent } from "@/shared/ui/Popover";
import { useTenant } from "@/entities/tenant/TenantContext";
import { format } from "date-fns";

export interface Filters {
  startDate?: Date;
  endDate?: Date;
  status: string;
  search: string;
}

interface Props {
  onFilterChange: (f: Filters) => void;
}

export default function FilterBooking({ onFilterChange }: Props) {
  const tenant = useTenant();
  const primaryColor = tenant.branding?.primaryColor ?? "#6366f1";

  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");

  const [openStart, setOpenStart] = useState(false);
  const [openEnd, setOpenEnd] = useState(false);

  useEffect(() => {
    onFilterChange({ startDate, endDate, status, search });
  }, [startDate, endDate, status, search]);

  const reset = () => {
    setStartDate(undefined);
    setEndDate(undefined);
    setStatus("");
    setSearch("");
  };

  const inputBase =
    "px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-gray-900 dark:text-neutral-100 focus:outline-none focus:ring-2 transition-all";
  const ringStyle = { "--tw-ring-color": primaryColor } as React.CSSProperties;

  return (
    <div className="flex flex-wrap justify-between items-center gap-4 p-4">
      <div className="flex items-center gap-3 flex-wrap">
        {/* Date Start */}
        <Popover open={openStart} onOpenChange={setOpenStart}>
          <PopoverTrigger asChild>
            <button
              onClick={() => setOpenStart(true)}
              className={`${inputBase} w-[8.5rem] text-left cursor-pointer`}
              style={ringStyle}
            >
              {startDate ? (
                <span>{format(startDate, "yyyy-MM-dd")}</span>
              ) : (
                <span className="text-gray-400 dark:text-neutral-500">
                  Desde
                </span>
              )}
            </button>
          </PopoverTrigger>
          <PopoverContent side="bottom" className="p-2">
            <Calendar
              mode="single"
              selected={startDate}
              onSelect={(d) => {
                setStartDate(d);
                setOpenStart(false);
              }}
              className="rounded-md border"
            />
          </PopoverContent>
        </Popover>

        {/* Date End */}
        <Popover open={openEnd} onOpenChange={setOpenEnd}>
          <PopoverTrigger asChild>
            <button
              onClick={() => setOpenEnd(true)}
              className={`${inputBase} w-[8.5rem] text-left cursor-pointer`}
              style={ringStyle}
            >
              {endDate ? (
                <span>{format(endDate, "yyyy-MM-dd")}</span>
              ) : (
                <span className="text-gray-400 dark:text-neutral-500">
                  Hasta
                </span>
              )}
            </button>
          </PopoverTrigger>
          <PopoverContent side="bottom" className="p-2">
            <Calendar
              mode="single"
              selected={endDate}
              onSelect={(d) => {
                setEndDate(d);
                setOpenEnd(false);
              }}
              className="rounded-md border"
            />
          </PopoverContent>
        </Popover>

        {/* Status */}
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className={`${inputBase} w-[10rem] appearance-none cursor-pointer`}
          style={ringStyle}
        >
          <option value="">Todos</option>
          <option value="Pending">Pendiente</option>
          <option value="Confirmed">Confirmada</option>
          <option value="Cancelled">Cancelada</option>
        </select>

        {/* Reset */}
        <button
          onClick={reset}
          className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors cursor-pointer"
        >
          <RotateCcw size={14} />
          Limpiar
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-neutral-500"
        />
        <input
          placeholder="Buscar..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={`${inputBase} pl-9 pr-4 rounded-full w-52`}
          style={ringStyle}
        />
      </div>
    </div>
  );
}
