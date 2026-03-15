import type { ReservationStatus } from "@/entities/booking/useBookingStore";

export const statusConfig: Record<
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

const actionBtnBase = "p-1.5 rounded-lg transition-colors cursor-pointer";

export const actionBtn = `${actionBtnBase} text-gray-500 dark:text-neutral-400 hover:bg-gray-100 dark:hover:bg-neutral-700 hover:text-gray-800 dark:hover:text-neutral-200`;

export const cancelBtn = `${actionBtnBase} text-gray-400 dark:text-neutral-500 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 dark:hover:text-red-400`;
