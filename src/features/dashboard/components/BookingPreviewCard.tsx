import { useState } from "react";
import { Calendar as CalIcon, Clock } from "lucide-react";
import { useToast } from "@/shared/ui/Toast";
import { ConfirmDialog } from "@/shared/ui/ConfirmDialog";
import { useTenant } from "@/entities/tenant/TenantContext";

interface Booking {
  name: string;
  service: string;
  date: string;
  time: string;
}

interface Labels {
  name: string;
  service: string;
  date: string;
  time: string;
}

interface Actions {
  accept: string;
  decline: string;
}

interface Props {
  booking: Booking;
  labels?: Labels;
  actions?: Actions;
}

export const BookingPreviewCard = ({
  booking,
  labels: _labels = {
    name: "Cliente",
    service: "Servicio",
    date: "Fecha",
    time: "Hora",
  },
  actions = { accept: "Confirmar", decline: "Rechazar" },
}: Props) => {
  const { toast } = useToast();
  const tenant = useTenant();
  const primaryColor = tenant.branding?.primaryColor ?? "#6366f1";
  const [status, setStatus] = useState<"pending" | "accepted" | "declined">("pending");
  const [showConfirm, setShowConfirm] = useState(false);

  if (status === "accepted") {
    return (
      <div className="rounded-2xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/20 p-5 space-y-2 transition-all">
        <div className="flex items-center gap-2">
          <CalIcon size={14} className="text-emerald-600 dark:text-emerald-400" />
          <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">
            Reserva confirmada
          </span>
        </div>
        <h3 className="font-semibold text-gray-900 dark:text-white">{booking.name}</h3>
        <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-neutral-400">
          <span className="flex items-center gap-1"><CalIcon size={12} /> {booking.date}</span>
          <span className="flex items-center gap-1"><Clock size={12} /> {booking.time}</span>
        </div>
      </div>
    );
  }

  if (status === "declined") {
    return (
      <div className="rounded-2xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 p-5 opacity-50 space-y-2 transition-all">
        <span className="text-xs font-semibold text-red-600 dark:text-red-400">Rechazada</span>
        <h3 className="font-semibold text-gray-400 dark:text-neutral-500 line-through">{booking.name}</h3>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-2xl border border-gray-100 dark:border-neutral-700 bg-white dark:bg-neutral-800 p-5 shadow-sm hover:shadow-md transition-all duration-300 space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900 dark:text-white">
            {booking.name}
          </h3>
          <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-neutral-700 text-gray-500 dark:text-neutral-400">
            {booking.service}
          </span>
        </div>
        <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-neutral-400">
          <span className="flex items-center gap-1"><CalIcon size={12} /> {booking.date}</span>
          <span className="flex items-center gap-1"><Clock size={12} /> {booking.time}</span>
        </div>
        <div className="pt-1 flex gap-3">
          <button
            onClick={() => {
              setStatus("accepted");
              toast(`Reserva de ${booking.name} confirmada`, "success");
            }}
            className="text-sm font-semibold px-4 py-1.5 rounded-lg text-white transition-all hover:opacity-90 cursor-pointer"
            style={{ backgroundColor: primaryColor }}
            aria-label={`Confirmar reserva de ${booking.name}`}
          >
            {actions.accept}
          </button>
          <button
            onClick={() => setShowConfirm(true)}
            className="text-sm font-medium px-4 py-1.5 rounded-lg border border-red-200 dark:border-red-800 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors cursor-pointer"
            aria-label={`Rechazar reserva de ${booking.name}`}
          >
            {actions.decline}
          </button>
        </div>
      </div>

      <ConfirmDialog
        open={showConfirm}
        title="Rechazar reserva"
        message={`¿Deseas rechazar la reserva de ${booking.name}?`}
        confirmLabel="Sí, rechazar"
        cancelLabel="Volver"
        variant="danger"
        onConfirm={() => {
          setStatus("declined");
          toast(`Reserva de ${booking.name} rechazada`, "error");
          setShowConfirm(false);
        }}
        onCancel={() => setShowConfirm(false)}
      />
    </>
  );
};
