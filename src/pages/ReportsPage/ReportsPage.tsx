import { useTenant } from "@/entities/tenant/TenantContext";
import { PageHeader } from "@/shared/ui/PageHeader";
import { PieChart, TrendingUp, Users, Calendar, Clock } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart as RePie,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";

const BOOKING_DATA = [
  { day: "Lun", reservas: 12 },
  { day: "Mar", reservas: 19 },
  { day: "Mié", reservas: 15 },
  { day: "Jue", reservas: 22 },
  { day: "Vie", reservas: 28 },
  { day: "Sáb", reservas: 35 },
  { day: "Dom", reservas: 8 },
];

const STATUS_DATA = [
  { name: "Completadas", value: 68, color: "#10b981" },
  { name: "Confirmadas", value: 18, color: "#6366f1" },
  { name: "Pendientes", value: 9, color: "#f59e0b" },
  { name: "Canceladas", value: 5, color: "#ef4444" },
];

const MONTHLY_DATA = [
  { month: "Sep", clientes: 85, ingresos: 42 },
  { month: "Oct", clientes: 102, ingresos: 51 },
  { month: "Nov", clientes: 98, ingresos: 48 },
  { month: "Dic", clientes: 134, ingresos: 67 },
  { month: "Ene", clientes: 112, ingresos: 55 },
  { month: "Feb", clientes: 148, ingresos: 73 },
];

const PEAK_HOURS = [
  { hour: "8:00", citas: 3 },
  { hour: "9:00", citas: 8 },
  { hour: "10:00", citas: 12 },
  { hour: "11:00", citas: 15 },
  { hour: "12:00", citas: 10 },
  { hour: "13:00", citas: 6 },
  { hour: "14:00", citas: 9 },
  { hour: "15:00", citas: 14 },
  { hour: "16:00", citas: 11 },
  { hour: "17:00", citas: 7 },
];

const ReportsPage = () => {
  const tenant = useTenant();
  const primaryColor = tenant.branding?.primaryColor ?? "#6366f1";
  const accentColor = tenant.branding?.accentColor ?? "#818cf8";

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <PageHeader
        icon={PieChart}
        title={tenant.features.reports?.label ?? "Reportes"}
        subtitle="Estadísticas y métricas del negocio"
      />

      {/* Summary Cards */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Tasa de Ocupación", value: "78%", icon: TrendingUp, delta: "+5%" },
          { label: "No-shows", value: "3.2%", icon: Users, delta: "-0.8%" },
          { label: "Reservas/Semana", value: "139", icon: Calendar, delta: "+12" },
          { label: "Duración Promedio", value: "45 min", icon: Clock, delta: "0" },
        ].map((card) => (
          <div
            key={card.label}
            className="bg-white dark:bg-neutral-800 rounded-2xl border border-gray-100 dark:border-neutral-700 p-4 shadow-sm"
          >
            <div className="flex items-center gap-2 mb-2">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: `${primaryColor}12` }}
              >
                <card.icon size={16} style={{ color: primaryColor }} />
              </div>
            </div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:text-neutral-500">
              {card.label}
            </p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-0.5">
              {card.value}
            </p>
            <p className="text-xs text-emerald-500 font-medium mt-0.5">
              {card.delta}
            </p>
          </div>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Bar chart */}
        <div className="bg-white dark:bg-neutral-800 rounded-2xl border border-gray-100 dark:border-neutral-700 p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
            Reservas por Día
          </h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={BOOKING_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="day" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <RechartsTooltip />
              <Bar dataKey="reservas" fill={primaryColor} radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie chart */}
        <div className="bg-white dark:bg-neutral-800 rounded-2xl border border-gray-100 dark:border-neutral-700 p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
            Distribución por Estado
          </h3>
          <div className="flex items-center gap-6">
            <ResponsiveContainer width="50%" height={200}>
              <RePie>
                <Pie
                  data={STATUS_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {STATUS_DATA.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip />
              </RePie>
            </ResponsiveContainer>
            <div className="space-y-2">
              {STATUS_DATA.map((s) => (
                <div key={s.name} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: s.color }}
                  />
                  <span className="text-xs text-gray-600 dark:text-neutral-400">
                    {s.name} ({s.value}%)
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Line chart */}
        <div className="bg-white dark:bg-neutral-800 rounded-2xl border border-gray-100 dark:border-neutral-700 p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
            Tendencia Mensual
          </h3>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={MONTHLY_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <RechartsTooltip />
              <Line type="monotone" dataKey="clientes" stroke={primaryColor} strokeWidth={2} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="ingresos" stroke={accentColor} strokeWidth={2} dot={{ r: 4 }} strokeDasharray="5 5" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Peak hours */}
        <div className="bg-white dark:bg-neutral-800 rounded-2xl border border-gray-100 dark:border-neutral-700 p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
            Horas Pico
          </h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={PEAK_HOURS} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis type="number" tick={{ fontSize: 12 }} />
              <YAxis dataKey="hour" type="category" tick={{ fontSize: 11 }} width={45} />
              <RechartsTooltip />
              <Bar dataKey="citas" fill={accentColor} radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
