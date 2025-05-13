import { StatCard } from "@/features/dashboard/components/StatCard";
import { BookingPreviewCard } from "@/features/dashboard/components/BookingPreviewCard";
const kpis = [
  { label: "Total Bookings", value: 40689, delta: 8.5 },
  { label: "Pending Approval", value: 10293, delta: 1.3 },
  { label: "Today", value: 123, delta: -4.3 },
  { label: "Other", value: 2040, delta: 1.8 },
];

const previews = Array.from({ length: 6 }).map((_, i) => ({
  id: i,
  name: [
    "Amanda Chavez",
    "Fionna Wade",
    "Beatrice Carrol",
    "Jasmine Palmer",
    "Randy Elliot",
    "Christine Powell",
  ][i],
  date: "25 Jul 2020",
  time: "11:00 - 12:00",
  service: "Physiotherapy",
}));

const DashboardPage = () => (
  <section className="space-y-8">
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      {kpis.map((kpi) => (
        <StatCard
          key={kpi.label}
          label={kpi.label}
          value={kpi.value}
          delta={kpi.delta}
        />
      ))}
    </div>

    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Bookings</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {previews.map((b) => (
          <BookingPreviewCard key={b.id} booking={b} />
        ))}
      </div>
    </div>
  </section>
);

export default DashboardPage;
