import { useMemo } from "react";
import { useSchema } from "@/entities/schema/useSchema";
import { useTenant } from "@/entities/tenant/TenantContext";
import { StatCard } from "@/features/dashboard/components/StatCard";
import { BookingPreviewCard } from "@/features/dashboard/components/BookingPreviewCard";
import { Link } from "react-router-dom";
import { Activity, ArrowRight } from "lucide-react";
import { useBookingStore, formatHour, localDateStr } from "@/entities/booking/useBookingStore";
import { useSettingsStore } from "@/entities/settings/useSettingsStore";

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
  const primaryColor = tenant.branding?.primaryColor ?? "#6366f1";

  const reservations = useBookingStore((s) => s.reservations);
  const allServices = useSettingsStore((s) => s.services);

  // Filter by tenant
  const tenantReservations = useMemo(
    () => reservations.filter((r) => r.tenant === tenant.type),
    [reservations, tenant.type],
  );

  // KPIs
  const kpiValues = useMemo(() => {
    const total = tenantReservations.filter((r) => r.status !== "Cancelled").length;
    const pending = tenantReservations.filter((r) => r.status === "Pending").length;
    const todayStr = localDateStr();
    const today = tenantReservations.filter((r) => r.date === todayStr && r.status !== "Cancelled").length;
    const uniqueClients = new Set(tenantReservations.map((r) => r.clientName)).size;
    return [
      { value: total, delta: 8.5 },
      { value: pending, delta: -2.1 },
      { value: today, delta: 4.3 },
      { value: uniqueClients, delta: 1.8 },
    ];
  }, [tenantReservations]);

  // Preview cards
  const previews = useMemo(() => {
    return tenantReservations
      .filter((r) => r.status === "Pending")
      .slice(0, 6)
      .map((r) => {
        const service = allServices.find((s) => s.id === r.serviceId);
        return {
          name: r.clientName,
          service: service?.name ?? "—",
          date: r.date,
          time: `${formatHour(r.startHour)} - ${formatHour(r.endHour)}`,
        };
      });
  }, [tenantReservations, allServices]);

  if (!schema) {
    return (
      <div className="p-6 text-gray-500 dark:text-neutral-400">
        Dashboard schema no encontrado.
      </div>
    );
  }

  return (
    <section className="space-y-8">
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {schema.kpis.map((kpi, i) => (
          <StatCard key={kpi.key} label={kpi.label} value={kpiValues[i]?.value ?? 0} delta={kpiValues[i]?.delta ?? 0} />
        ))}
      </div>

      <Link
        to="/live"
        className="flex items-center justify-between p-4 bg-white dark:bg-neutral-800 rounded-2xl border border-gray-100 dark:border-neutral-700 shadow-sm hover:shadow-md transition-all group"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${primaryColor}15` }}>
            <Activity size={18} style={{ color: primaryColor }} />
          </div>
          <div>
            <div className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              {tenant.features.liveOps?.label ?? "Operaciones"}
              <span className="flex items-center gap-1 text-[10px] font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                En vivo
              </span>
            </div>
            <div className="text-xs text-gray-400 dark:text-neutral-500">
              {tenant.type === "restaurant"
                ? "Estado de mesas y reservaciones en tiempo real"
                : "Gestión de citas y atención en tiempo real"}
            </div>
          </div>
        </div>
        <ArrowRight size={18} className="text-gray-300 dark:text-neutral-600 group-hover:text-gray-500 dark:group-hover:text-neutral-400 transition-colors" />
      </Link>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{schema.previewTitle}</h2>
        {previews.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {previews.map((b, i) => (
              <BookingPreviewCard key={i} booking={b} labels={schema.previewFields} actions={schema.previewActions} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-white dark:bg-neutral-800 rounded-2xl border border-gray-100 dark:border-neutral-700">
            <p className="text-sm text-gray-400 dark:text-neutral-500">No hay reservas pendientes por revisar 🎉</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default DashboardPage;
