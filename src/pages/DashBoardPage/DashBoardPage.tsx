import { useSchema } from "@/entities/schema/useSchema";
import { useTenant } from "@/entities/tenant/TenantContext";
import { StatCard } from "@/features/dashboard/components/StatCard";
import { BookingPreviewCard } from "@/features/dashboard/components/BookingPreviewCard";

const MOCK_CLINIC_PREVIEWS = [
  {
    name: "Amanda Chavez",
    service: "Fisioterapia",
    date: "25 Jul 2026",
    time: "11:00 - 12:00",
  },
  {
    name: "Fionna Wade",
    service: "Terapia Ocupacional",
    date: "25 Jul 2026",
    time: "14:00 - 15:00",
  },
  {
    name: "Beatrice Carrol",
    service: "Consulta General",
    date: "26 Jul 2026",
    time: "09:00 - 10:00",
  },
  {
    name: "Jasmine Palmer",
    service: "Pediatría",
    date: "26 Jul 2026",
    time: "11:00 - 12:00",
  },
  {
    name: "Randy Elliot",
    service: "Dermatología",
    date: "26 Jul 2026",
    time: "15:00 - 16:00",
  },
  {
    name: "Christine Powell",
    service: "Psicología",
    date: "27 Jul 2026",
    time: "10:00 - 11:00",
  },
];

const MOCK_BARBER_PREVIEWS = [
  {
    name: "Carlos Rivera",
    service: "Fade",
    date: "25 Jul 2026",
    time: "10:00 - 10:30",
  },
  {
    name: "Andrés Mora",
    service: "Corte + Barba",
    date: "25 Jul 2026",
    time: "11:00 - 11:45",
  },
  {
    name: "Kevin Soto",
    service: "Degradado",
    date: "25 Jul 2026",
    time: "14:00 - 14:30",
  },
  {
    name: "Luis Hernández",
    service: "Tinte",
    date: "26 Jul 2026",
    time: "09:00 - 10:00",
  },
  {
    name: "Diego Vargas",
    service: "Corte clásico",
    date: "26 Jul 2026",
    time: "10:30 - 11:00",
  },
  {
    name: "Pablo Castillo",
    service: "Barba",
    date: "26 Jul 2026",
    time: "12:00 - 12:30",
  },
];

const MOCK_CLINIC_KPIS = [
  { value: 1284, delta: 8.5 },
  { value: 23, delta: -2.1 },
  { value: 12, delta: 4.3 },
  { value: 847, delta: 1.8 },
];

const MOCK_BARBER_KPIS = [
  { value: 562, delta: 12.3 },
  { value: 8, delta: 3.5 },
  { value: 15, delta: -1.2 },
  { value: 234, delta: 5.7 },
];

interface DashboardSchema {
  title: string;
  kpis: { key: string; label: string }[];
  previewTitle: string;
  previewActions: { accept: string; decline: string };
  previewFields: { name: string; service: string; date: string; time: string };
}

const DashboardPage = () => {
  const tenant = useTenant();
  const schema = useSchema("dashboard") as unknown as DashboardSchema | null;

  if (!schema) {
    return (
      <div className="p-6 text-gray-500">Dashboard schema no encontrado.</div>
    );
  }

  const isBarber = tenant.type === "barbershop";
  const kpiValues = isBarber ? MOCK_BARBER_KPIS : MOCK_CLINIC_KPIS;
  const previews = isBarber ? MOCK_BARBER_PREVIEWS : MOCK_CLINIC_PREVIEWS;

  return (
    <section className="space-y-8">
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {schema.kpis.map((kpi, i) => (
          <StatCard
            key={kpi.key}
            label={kpi.label}
            value={kpiValues[i]?.value ?? 0}
            delta={kpiValues[i]?.delta ?? 0}
          />
        ))}
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold">{schema.previewTitle}</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {previews.map((b, i) => (
            <BookingPreviewCard
              key={i}
              booking={b}
              labels={schema.previewFields}
              actions={schema.previewActions}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default DashboardPage;
