import { useState } from "react";
import { useTenant } from "@/entities/tenant/TenantContext";
import { Clock, User, Check, MapPin, Users, X } from "lucide-react";
import { Tooltip } from "@/shared/ui/Tooltip";

type StaffStatus =
  | "Pendiente"
  | "Confirmada"
  | "EnAtencion"
  | "Completada"
  | "Cancelada";
type TableStatus =
  | "Reservada"
  | "Confirmada"
  | "Llego"
  | "MesaLibre"
  | "NoLlego";

interface StaffBooking {
  id: string;
  time: string;
  client: string;
  service: string;
  status: StaffStatus;
}

interface StaffLane {
  staffId: string;
  staffName: string;
  avatar: string;
  bookings: StaffBooking[];
}

interface TableBooking {
  id: string;
  time: string;
  client: string;
  guests: number;
  status: TableStatus;
}

interface TableLane {
  tableId: string;
  tableName: string;
  area: string;
  booking: TableBooking;
}

const STAFF_LANES: Record<string, StaffLane[]> = {
  clinic: [
    {
      staffId: "s1",
      staffName: "Dra. Ana Pérez",
      avatar: "AP",
      bookings: [
        {
          id: "c1",
          time: "08:00",
          client: "Beatrice Carrol",
          service: "Consulta General",
          status: "Completada",
        },
        {
          id: "c2",
          time: "10:00",
          client: "Randy Elliot",
          service: "Psicología",
          status: "EnAtencion",
        },
        {
          id: "c3",
          time: "14:00",
          client: "María López",
          service: "Control General",
          status: "Confirmada",
        },
      ],
    },
    {
      staffId: "s2",
      staffName: "Dr. Emily Johnson",
      avatar: "EJ",
      bookings: [
        {
          id: "c4",
          time: "09:00",
          client: "Amanda Chavez",
          service: "Fisioterapia",
          status: "Completada",
        },
        {
          id: "c5",
          time: "11:00",
          client: "Christine Powell",
          service: "Dermatología",
          status: "EnAtencion",
        },
        {
          id: "c6",
          time: "15:00",
          client: "Laura Soto",
          service: "Nutrición",
          status: "Pendiente",
        },
      ],
    },
    {
      staffId: "s3",
      staffName: "Dr. Carlos Martínez",
      avatar: "CM",
      bookings: [
        {
          id: "c7",
          time: "09:30",
          client: "Jasmine Palmer",
          service: "Pediatría",
          status: "Completada",
        },
        {
          id: "c8",
          time: "11:00",
          client: "Fionna Wade",
          service: "Terapia Ocupacional",
          status: "Confirmada",
        },
        {
          id: "c9",
          time: "16:00",
          client: "Diego Rojas",
          service: "Pediatría",
          status: "Pendiente",
        },
      ],
    },
  ],
  barbershop: [
    {
      staffId: "b1",
      staffName: "Marco Jiménez",
      avatar: "MJ",
      bookings: [
        {
          id: "b1a",
          time: "09:00",
          client: "Luis Hernández",
          service: "Tinte",
          status: "Completada",
        },
        {
          id: "b1b",
          time: "10:00",
          client: "Carlos Rivera",
          service: "Fade",
          status: "EnAtencion",
        },
        {
          id: "b1c",
          time: "11:00",
          client: "Pablo Castillo",
          service: "Barba",
          status: "Confirmada",
        },
        {
          id: "b1d",
          time: "14:00",
          client: "Esteban Vega",
          service: "Corte clásico",
          status: "Pendiente",
        },
      ],
    },
    {
      staffId: "b2",
      staffName: "David Solano",
      avatar: "DS",
      bookings: [
        {
          id: "b2a",
          time: "09:30",
          client: "Kevin Soto",
          service: "Degradado",
          status: "Completada",
        },
        {
          id: "b2b",
          time: "10:30",
          client: "Diego Vargas",
          service: "Corte + Barba",
          status: "EnAtencion",
        },
        {
          id: "b2c",
          time: "13:00",
          client: "Fernando Ruiz",
          service: "Fade",
          status: "Confirmada",
        },
      ],
    },
    {
      staffId: "b3",
      staffName: "José Ureña",
      avatar: "JU",
      bookings: [
        {
          id: "b3a",
          time: "10:00",
          client: "Andrés Mora",
          service: "Corte + Barba",
          status: "EnAtencion",
        },
        {
          id: "b3b",
          time: "11:30",
          client: "Roberto Salas",
          service: "Barba",
          status: "Pendiente",
        },
      ],
    },
  ],
  grooming: [
    {
      staffId: "g1",
      staffName: "Marco Rivera",
      avatar: "MR",
      bookings: [
        {
          id: "g1a",
          time: "08:30",
          client: "Sarah Thompson (Buddy)",
          service: "Dog Full Grooming",
          status: "Completada",
        },
        {
          id: "g1b",
          time: "10:00",
          client: "Carlos Rodríguez (Max)",
          service: "Treatments",
          status: "EnAtencion",
        },
        {
          id: "g1c",
          time: "12:00",
          client: "Ana López (Rocky)",
          service: "Dog Bath Services",
          status: "Confirmada",
        },
        {
          id: "g1d",
          time: "14:00",
          client: "Pedro Sánchez (Thor)",
          service: "Dog Full Grooming",
          status: "Pendiente",
        },
      ],
    },
    {
      staffId: "g2",
      staffName: "Laura Méndez",
      avatar: "LM",
      bookings: [
        {
          id: "g2a",
          time: "09:00",
          client: "Juan Pérez (Kralos)",
          service: "Dog Bath Services",
          status: "Completada",
        },
        {
          id: "g2b",
          time: "10:30",
          client: "María Fernández (Luna)",
          service: "Dog Full Grooming",
          status: "EnAtencion",
        },
        {
          id: "g2c",
          time: "13:00",
          client: "Roberto Díaz (Canela)",
          service: "Dog Bath Services",
          status: "Confirmada",
        },
      ],
    },
    {
      staffId: "g3",
      staffName: "Sofía Castillo",
      avatar: "SC",
      bookings: [
        {
          id: "g3a",
          time: "09:30",
          client: "Emily García (Mishi)",
          service: "Cat Grooming",
          status: "EnAtencion",
        },
        {
          id: "g3b",
          time: "11:00",
          client: "David Chen (Whiskers)",
          service: "Cat Grooming",
          status: "Pendiente",
        },
      ],
    },
  ],
};

const TABLE_LANES: TableLane[] = [
  {
    tableId: "m1",
    tableName: "Mesa 1",
    area: "Interior",
    booking: {
      id: "r1",
      time: "12:00",
      client: "Ana Marchena",
      guests: 3,
      status: "MesaLibre",
    },
  },
  {
    tableId: "m2",
    tableName: "Mesa 3",
    area: "Interior",
    booking: {
      id: "r2",
      time: "19:00",
      client: "Isabel Quesada",
      guests: 4,
      status: "Confirmada",
    },
  },
  {
    tableId: "m3",
    tableName: "Terraza A",
    area: "Terraza",
    booking: {
      id: "r3",
      time: "13:00",
      client: "María José Soto",
      guests: 2,
      status: "Llego",
    },
  },
  {
    tableId: "m4",
    tableName: "Terraza B",
    area: "Terraza",
    booking: {
      id: "r4",
      time: "19:30",
      client: "Carlos Montero",
      guests: 6,
      status: "Reservada",
    },
  },
  {
    tableId: "m5",
    tableName: "VIP",
    area: "VIP",
    booking: {
      id: "r5",
      time: "20:00",
      client: "Roberto Arias",
      guests: 8,
      status: "Confirmada",
    },
  },
  {
    tableId: "m6",
    tableName: "Mesa 5",
    area: "Interior",
    booking: {
      id: "r6",
      time: "13:30",
      client: "Lucía Fernández",
      guests: 2,
      status: "Llego",
    },
  },
];

const staffStatusLabel: Record<StaffStatus, string> = {
  Pendiente: "Pendiente",
  Confirmada: "Confirmada",
  EnAtencion: "En atención",
  Completada: "Completada",
  Cancelada: "Cancelada",
};

const tableStatusLabel: Record<TableStatus, string> = {
  Reservada: "Reservada",
  Confirmada: "Confirmada",
  Llego: "Ocupada",
  MesaLibre: "Libre",
  NoLlego: "No llegó",
};

const StaffLaneView = ({
  lanes,
  primaryColor,
  staffLabel,
}: {
  lanes: StaffLane[];
  primaryColor: string;
  staffLabel: string;
}) => {
  const [lanesState, setLanesState] = useState(lanes);

  const updateBookingStatus = (
    staffId: string,
    bookingId: string,
    newStatus: StaffStatus,
  ) => {
    setLanesState((prev) =>
      prev.map((lane) =>
        lane.staffId === staffId
          ? {
              ...lane,
              bookings: lane.bookings.map((b) =>
                b.id === bookingId ? { ...b, status: newStatus } : b,
              ),
            }
          : lane,
      ),
    );
  };

  const totalActive = lanesState.reduce(
    (sum, l) =>
      sum + l.bookings.filter((b) => b.status === "EnAtencion").length,
    0,
  );
  const totalPending = lanesState.reduce(
    (sum, l) =>
      sum +
      l.bookings.filter(
        (b) =>
          b.status !== "Completada" &&
          b.status !== "EnAtencion" &&
          b.status !== "Cancelada",
      ).length,
    0,
  );

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Clock size={18} style={{ color: primaryColor }} />
          Agenda de Hoy
          <Tooltip
            text={`Cada ${staffLabel.toLowerCase()} tiene su propia línea de atención con citas paralelas.`}
          />
        </h2>
        <div className="flex items-center gap-4 text-xs text-gray-400 dark:text-neutral-500">
          <span>{totalActive} en atención</span>
          <span>{totalPending} por atender</span>
        </div>
      </div>

      <div className="space-y-4">
        {lanesState.map((lane) => {
          const currentBooking = lane.bookings.find(
            (b) => b.status === "EnAtencion",
          );
          return (
            <div
              key={lane.staffId}
              className="bg-white dark:bg-neutral-800 rounded-2xl border border-gray-100 dark:border-neutral-700 shadow-sm overflow-hidden"
            >
              <div className="flex items-center gap-3 px-5 py-3 border-b border-gray-100 dark:border-neutral-700">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-[11px] font-bold shrink-0"
                  style={{ backgroundColor: primaryColor }}
                >
                  {lane.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                    {lane.staffName}
                  </div>
                  <div className="text-[10px] text-gray-400 dark:text-neutral-500 uppercase tracking-wider">
                    {staffLabel}
                  </div>
                </div>
                {currentBooking && (
                  <div
                    className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full"
                    style={{
                      backgroundColor: `${primaryColor}12`,
                      color: primaryColor,
                    }}
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full animate-pulse"
                      style={{ backgroundColor: primaryColor }}
                    />
                    Atendiendo
                  </div>
                )}
              </div>

              <div className="divide-y divide-gray-50 dark:divide-neutral-700/50">
                {lane.bookings.map((booking) => {
                  const isCompleted = booking.status === "Completada";
                  const isActive = booking.status === "EnAtencion";

                  return (
                    <div
                      key={booking.id}
                      className={`flex items-center gap-4 px-5 py-3 transition-colors ${
                        isCompleted ? "opacity-35" : ""
                      } ${isActive ? "border-l-2" : "border-l-2 border-l-transparent"}`}
                      style={
                        isActive ? { borderLeftColor: primaryColor } : undefined
                      }
                    >
                      <div
                        className={`w-11 text-sm font-mono font-semibold shrink-0 ${isCompleted ? "text-gray-300 dark:text-neutral-600" : "text-gray-900 dark:text-white"}`}
                      >
                        {booking.time}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div
                          className={`text-sm font-medium truncate ${isCompleted ? "line-through text-gray-300 dark:text-neutral-600" : "text-gray-900 dark:text-white"}`}
                        >
                          {booking.client}
                        </div>
                        <div className="text-xs text-gray-400 dark:text-neutral-500 truncate">
                          {booking.service}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {isActive && (
                          <button
                            onClick={() =>
                              updateBookingStatus(
                                lane.staffId,
                                booking.id,
                                "Completada",
                              )
                            }
                            className="text-[11px] font-medium px-3 py-1 rounded-lg text-white transition-colors cursor-pointer hover:opacity-90"
                            style={{ backgroundColor: primaryColor }}
                          >
                            Completar
                          </button>
                        )}
                        {booking.status === "Confirmada" && (
                          <button
                            onClick={() =>
                              updateBookingStatus(
                                lane.staffId,
                                booking.id,
                                "EnAtencion",
                              )
                            }
                            className="text-[11px] font-medium px-3 py-1 rounded-lg border transition-colors cursor-pointer"
                            style={{
                              borderColor: primaryColor,
                              color: primaryColor,
                            }}
                          >
                            Iniciar
                          </button>
                        )}
                        {isCompleted && (
                          <Check
                            size={14}
                            className="text-gray-300 dark:text-neutral-600"
                          />
                        )}
                        {!isActive && !isCompleted && (
                          <span className="text-[10px] font-medium text-gray-400 dark:text-neutral-500">
                            {staffStatusLabel[booking.status]}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const TableLaneView = ({
  tables: initialTables,
  primaryColor,
}: {
  tables: TableLane[];
  primaryColor: string;
}) => {
  const [tables, setTables] = useState(initialTables);

  const updateTableStatus = (tableId: string, newStatus: TableStatus) => {
    setTables((prev) =>
      prev.map((t) =>
        t.tableId === tableId
          ? { ...t, booking: { ...t.booking, status: newStatus } }
          : t,
      ),
    );
  };

  const occupied = tables.filter((t) => t.booking.status === "Llego").length;
  const expected = tables.filter(
    (t) =>
      t.booking.status === "Reservada" || t.booking.status === "Confirmada",
  ).length;
  const areas = [...new Set(tables.map((t) => t.area))];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <MapPin size={18} style={{ color: primaryColor }} />
          Mesas de Hoy
          <Tooltip text="'Ocupada' = el cliente llegó y está sentado. 'Libre' = la mesa fue desocupada." />
        </h2>
        <div className="flex items-center gap-4 text-xs text-gray-400 dark:text-neutral-500">
          <span>{occupied} ocupadas</span>
          <span>{expected} por llegar</span>
        </div>
      </div>

      {areas.map((area) => {
        const areaTables = tables.filter((t) => t.area === area);
        return (
          <div key={area}>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:text-neutral-500 mb-2.5 px-1">
              {area}
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {areaTables.map((table) => {
                const isOccupied = table.booking.status === "Llego";
                const isFreed = table.booking.status === "MesaLibre";
                const isNoShow = table.booking.status === "NoLlego";
                const isDone = isFreed || isNoShow;

                return (
                  <div
                    key={table.tableId}
                    className={`bg-white dark:bg-neutral-800 rounded-2xl border overflow-hidden transition-all ${
                      isOccupied
                        ? "border-gray-200 dark:border-neutral-600 shadow-md"
                        : isDone
                          ? "border-gray-100 dark:border-neutral-700 opacity-40"
                          : "border-gray-100 dark:border-neutral-700 shadow-sm"
                    }`}
                  >
                    <div
                      className="h-1 transition-all"
                      style={{
                        backgroundColor: isOccupied
                          ? primaryColor
                          : "transparent",
                      }}
                    />

                    <div className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="text-sm font-bold text-gray-900 dark:text-white">
                            {table.tableName}
                          </div>
                        </div>
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                            isOccupied
                              ? "text-white"
                              : isDone
                                ? "bg-gray-100 dark:bg-neutral-700 text-gray-400 dark:text-neutral-500"
                                : "text-gray-500 dark:text-neutral-400 bg-gray-100 dark:bg-neutral-700"
                          }`}
                          style={
                            isOccupied
                              ? { backgroundColor: primaryColor }
                              : undefined
                          }
                        >
                          {tableStatusLabel[table.booking.status]}
                        </span>
                      </div>

                      <div className="space-y-1.5">
                        <div
                          className={`text-sm font-medium ${isDone ? "text-gray-300 dark:text-neutral-600 line-through" : "text-gray-900 dark:text-white"}`}
                        >
                          {table.booking.client}
                        </div>
                        <div className="flex items-center gap-3 text-xs text-gray-400 dark:text-neutral-500">
                          <span className="flex items-center gap-1">
                            <Clock size={11} />
                            {table.booking.time}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users size={11} />
                            {table.booking.guests}
                          </span>
                        </div>
                      </div>

                      {!isDone && (
                        <div className="flex gap-2 mt-3">
                          {(table.booking.status === "Reservada" ||
                            table.booking.status === "Confirmada") && (
                            <>
                              <button
                                onClick={() =>
                                  updateTableStatus(table.tableId, "Llego")
                                }
                                className="flex-1 flex items-center justify-center gap-1 py-1.5 text-[11px] font-medium rounded-lg text-white transition-all cursor-pointer hover:opacity-90"
                                style={{ backgroundColor: primaryColor }}
                              >
                                <User size={11} />
                                Llegó
                              </button>
                              <button
                                onClick={() =>
                                  updateTableStatus(table.tableId, "NoLlego")
                                }
                                className="flex-1 flex items-center justify-center gap-1 py-1.5 text-[11px] font-medium rounded-lg border border-gray-200 dark:border-neutral-600 text-gray-500 dark:text-neutral-400 hover:bg-gray-50 dark:hover:bg-neutral-700 transition-all cursor-pointer"
                              >
                                <X size={11} />
                                No llegó
                              </button>
                            </>
                          )}
                          {isOccupied && (
                            <button
                              onClick={() =>
                                updateTableStatus(table.tableId, "MesaLibre")
                              }
                              className="flex-1 flex items-center justify-center gap-1 py-1.5 text-[11px] font-medium rounded-lg border transition-all cursor-pointer"
                              style={{
                                borderColor: primaryColor,
                                color: primaryColor,
                              }}
                            >
                              <Check size={11} />
                              Liberar mesa
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export const TodaySection = () => {
  const tenant = useTenant();
  const primaryColor = tenant.branding?.primaryColor ?? "#6366f1";

  if (tenant.type === "restaurant") {
    return <TableLaneView tables={TABLE_LANES} primaryColor={primaryColor} />;
  }

  const lanes = STAFF_LANES[tenant.type] ?? STAFF_LANES.clinic;
  const staffLabel =
    tenant.type === "clinic"
      ? "Especialista"
      : tenant.type === "grooming"
        ? "Groomer"
        : "Barbero";

  return (
    <StaffLaneView
      lanes={lanes}
      primaryColor={primaryColor}
      staffLabel={staffLabel}
    />
  );
};
