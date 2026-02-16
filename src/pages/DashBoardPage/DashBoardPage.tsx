import { useSchema } from "@/entities/schema/useSchema";
import { useTenant } from "@/entities/tenant/TenantContext";
import { StatCard } from "@/features/dashboard/components/StatCard";
import { BookingPreviewCard } from "@/features/dashboard/components/BookingPreviewCard";

const MOCK_PREVIEWS: Record<
  string,
  { name: string; service: string; date: string; time: string }[]
> = {
  clinic: [
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
  ],
  barbershop: [
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
  ],
  restaurant: [
    {
      name: "Isabel Quesada",
      service: "Mesa 3 – 4 personas",
      date: "25 Jul 2026",
      time: "19:00 - 21:00",
    },
    {
      name: "Roberto Arias",
      service: "VIP – 8 personas",
      date: "25 Jul 2026",
      time: "20:00 - 22:00",
    },
    {
      name: "María José Soto",
      service: "Terraza A – 2 personas",
      date: "25 Jul 2026",
      time: "13:00 - 14:30",
    },
    {
      name: "Carlos Montero",
      service: "Mesa 1 – 6 personas",
      date: "26 Jul 2026",
      time: "19:30 - 21:30",
    },
    {
      name: "Ana Marchena",
      service: "Terraza B – 3 personas",
      date: "26 Jul 2026",
      time: "12:30 - 14:00",
    },
    {
      name: "Luis Alvarado",
      service: "Mesa 5 – 2 personas",
      date: "26 Jul 2026",
      time: "20:00 - 21:30",
    },
  ],
};

const MOCK_KPIS: Record<string, { value: number; delta: number }[]> = {
  clinic: [
    { value: 1284, delta: 8.5 },
    { value: 23, delta: -2.1 },
    { value: 12, delta: 4.3 },
    { value: 847, delta: 1.8 },
  ],
  barbershop: [
    { value: 562, delta: 12.3 },
    { value: 8, delta: 3.5 },
    { value: 15, delta: -1.2 },
    { value: 234, delta: 5.7 },
  ],
  restaurant: [
    { value: 892, delta: 6.2 },
    { value: 15, delta: -3.1 },
    { value: 22, delta: 8.7 },
    { value: 1340, delta: 4.5 },
  ],
};

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
      <div className="p-6 text-gray-500 dark:text-neutral-400">
        Dashboard schema no encontrado.
      </div>
    );
  }

  const kpiValues = MOCK_KPIS[tenant.type] ?? MOCK_KPIS.clinic;
  const previews = MOCK_PREVIEWS[tenant.type] ?? MOCK_PREVIEWS.clinic;

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
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          {schema.previewTitle}
        </h2>
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
