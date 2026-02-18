import { useParams, Link } from "react-router-dom";
import { useTenant } from "@/entities/tenant/TenantContext";
import {
  ArrowLeft,
  Phone,
  Mail,
  Calendar,
  Clock,
  FileText,
} from "lucide-react";

interface HistoryEntry {
  date: string;
  service: string;
  staff: string;
  status: "Confirmed" | "Pending" | "Cancelled" | "Completed";
}

const MOCK_CLIENTS: Record<
  string,
  Record<
    string,
    {
      name: string;
      phone: string;
      email: string;
      notes: string;
      since: string;
      history: HistoryEntry[];
    }
  >
> = {
  clinic: {
    "1": {
      name: "Amanda Chavez",
      phone: "7788-1122",
      email: "amanda@email.com",
      notes: "Alérgica a penicilina. Prefiere citas por la mañana.",
      since: "2025-03-15",
      history: [
        {
          date: "2026-02-16",
          service: "Fisioterapia",
          staff: "Dr. Emily Johnson",
          status: "Confirmed",
        },
        {
          date: "2026-01-20",
          service: "Consulta General",
          staff: "Dr. Carlos Martínez",
          status: "Confirmed",
        },
        {
          date: "2025-11-10",
          service: "Fisioterapia",
          staff: "Dr. Emily Johnson",
          status: "Cancelled",
        },
      ],
    },
    "2": {
      name: "Jasmine Palmer",
      phone: "7799-3344",
      email: "jasmine@email.com",
      notes: "Paciente pediátrica, requiere acompañante.",
      since: "2025-06-01",
      history: [
        {
          date: "2026-02-16",
          service: "Pediatría",
          staff: "Dr. Carlos Martínez",
          status: "Pending",
        },
        {
          date: "2025-12-05",
          service: "Pediatría",
          staff: "Dr. Carlos Martínez",
          status: "Confirmed",
        },
      ],
    },
  },
  barbershop: {
    "1": {
      name: "Carlos Rivera",
      phone: "8811-2233",
      email: "carlos@email.com",
      notes: "Prefiere fade bajo con línea. Cliente frecuente.",
      since: "2024-11-20",
      history: [
        {
          date: "2026-02-16",
          service: "Fade",
          staff: "Marco Jiménez",
          status: "Confirmed",
        },
        {
          date: "2026-01-15",
          service: "Corte + Barba",
          staff: "Marco Jiménez",
          status: "Confirmed",
        },
        {
          date: "2025-12-18",
          service: "Fade",
          staff: "David Solano",
          status: "Confirmed",
        },
        {
          date: "2025-11-20",
          service: "Corte clásico",
          staff: "Marco Jiménez",
          status: "Confirmed",
        },
      ],
    },
    "2": {
      name: "Andrés Mora",
      phone: "8822-3344",
      email: "andres@email.com",
      notes: "Requiere productos hipoalergénicos.",
      since: "2025-04-10",
      history: [
        {
          date: "2026-02-16",
          service: "Corte + Barba",
          staff: "David Solano",
          status: "Pending",
        },
        {
          date: "2025-12-01",
          service: "Barba",
          staff: "José Ureña",
          status: "Confirmed",
        },
      ],
    },
  },
  restaurant: {
    "1": {
      name: "Isabel Quesada",
      phone: "7700-1122",
      email: "isabel@email.com",
      notes: "Prefiere mesa junto a la ventana. Celebra cumpleaños en marzo.",
      since: "2025-08-01",
      history: [
        {
          date: "2026-02-16",
          service: "Mesa 3 – 4 personas",
          staff: "Laura Salas",
          status: "Confirmed",
        },
        {
          date: "2026-01-10",
          service: "VIP – 6 personas",
          staff: "Laura Salas",
          status: "Confirmed",
        },
      ],
    },
    "2": {
      name: "Roberto Arias",
      phone: "7711-2233",
      email: "roberto@email.com",
      notes: "Dieta vegetariana. Cliente corporativo.",
      since: "2025-05-20",
      history: [
        {
          date: "2026-02-16",
          service: "VIP – 8 personas",
          staff: "Carlos Montero",
          status: "Pending",
        },
        {
          date: "2025-12-24",
          service: "Mesa 1 – 10 personas",
          staff: "Carlos Montero",
          status: "Confirmed",
        },
      ],
    },
  },
};

const statusBadge: Record<string, string> = {
  Confirmed:
    "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400",
  Pending:
    "bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400",
  Cancelled: "bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400",
  Completed:
    "bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400",
};

const STATUS_LABELS: Record<string, string> = {
  Confirmed: "Confirmada",
  Pending: "Pendiente",
  Cancelled: "Cancelada",
  Completed: "Completada",
};

const ClientDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const tenant = useTenant();
  const primaryColor = tenant.branding?.primaryColor ?? "#6366f1";

  const clients = MOCK_CLIENTS[tenant.type] ?? MOCK_CLIENTS.clinic;
  const client = clients[id ?? "1"];

  const clientLabel = tenant.type === "clinic" ? "Paciente" : "Cliente";
  const backPath = tenant.type === "clinic" ? "/customers" : "/customers";
  const backLabel = tenant.features.patients?.label ?? "Clientes";

  if (!client) {
    return (
      <div className="p-6 text-gray-500 dark:text-neutral-400">
        {clientLabel} no encontrado.
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Link
        to={backPath}
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-neutral-400 hover:text-gray-900 dark:hover:text-white transition-colors"
      >
        <ArrowLeft size={16} />
        Volver a {backLabel}
      </Link>

      <div className="bg-white dark:bg-neutral-800 rounded-2xl border border-gray-100 dark:border-neutral-700 shadow-sm overflow-hidden">
        <div
          className="h-16"
          style={{
            background: `linear-gradient(135deg, ${primaryColor}, ${primaryColor}88)`,
          }}
        />
        <div className="px-6 pb-6 -mt-6">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-xl font-bold shadow-md border-4 border-white dark:border-neutral-800"
            style={{ backgroundColor: primaryColor }}
          >
            {client.name.charAt(0)}
          </div>
          <div className="mt-3">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              {client.name}
            </h1>
            <p className="text-sm text-gray-500 dark:text-neutral-400">
              {clientLabel} desde {client.since}
            </p>
          </div>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-neutral-300">
              <Phone
                size={14}
                className="text-gray-400 dark:text-neutral-500"
              />
              {client.phone}
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-neutral-300">
              <Mail size={14} className="text-gray-400 dark:text-neutral-500" />
              {client.email}
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-neutral-300">
              <Calendar
                size={14}
                className="text-gray-400 dark:text-neutral-500"
              />
              {client.history.length} citas
            </div>
          </div>
        </div>
      </div>

      {client.notes && (
        <div className="bg-white dark:bg-neutral-800 rounded-2xl border border-gray-100 dark:border-neutral-700 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-2">
            <FileText size={15} style={{ color: primaryColor }} />
            <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-neutral-400">
              Notas
            </h2>
          </div>
          <p className="text-sm text-gray-700 dark:text-neutral-300 leading-relaxed">
            {client.notes}
          </p>
        </div>
      )}

      <div className="bg-white dark:bg-neutral-800 rounded-2xl border border-gray-100 dark:border-neutral-700 shadow-sm p-5 space-y-4">
        <div className="flex items-center gap-2">
          <Clock size={15} style={{ color: primaryColor }} />
          <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-neutral-400">
            Historial de Citas
          </h2>
        </div>
        <div className="space-y-2">
          {client.history.map((h, i) => (
            <div
              key={i}
              className="flex items-center justify-between py-3 px-4 rounded-xl bg-gray-50/80 dark:bg-neutral-700/40 border border-gray-100 dark:border-neutral-600/50"
            >
              <div className="flex items-center gap-4">
                <div className="text-sm font-medium text-gray-900 dark:text-white min-w-[6rem]">
                  {h.date}
                </div>
                <div className="text-sm text-gray-700 dark:text-neutral-300">
                  {h.service}
                </div>
                <div className="text-xs text-gray-400 dark:text-neutral-500 hidden sm:block">
                  con {h.staff}
                </div>
              </div>
              <span
                className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${statusBadge[h.status]}`}
              >
                {STATUS_LABELS[h.status] ?? h.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ClientDetailPage;
