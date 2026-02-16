import { useNavigate } from "react-router-dom";
import { useSchema } from "@/entities/schema/useSchema";
import { useTenant } from "@/entities/tenant/TenantContext";
import { DynamicForm } from "@/shared/ui/DynamicForm";
import { CalendarPlus } from "lucide-react";

const NewBookingPage = () => {
  const schema = useSchema("bookings");
  const tenant = useTenant();
  const navigate = useNavigate();

  const featureLabel = tenant.features.newBooking?.label ?? "Nueva Reserva";
  const primaryColor = tenant.branding?.primaryColor ?? "#6366f1";

  if (!schema) {
    return (
      <div className="p-6 text-gray-500 dark:text-neutral-400">
        Schema de bookings no encontrado.
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: `${primaryColor}15` }}
        >
          <CalendarPlus size={20} style={{ color: primaryColor }} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {featureLabel}
          </h1>
          <p className="text-sm text-gray-500 dark:text-neutral-400">
            Completá los datos para agendar
          </p>
        </div>
      </div>

      <DynamicForm
        fields={schema.fields}
        submitLabel="Crear"
        onSubmit={(data) => {
          console.log("Booking created:", data);
          navigate("/bookings");
        }}
        onCancel={() => navigate("/bookings")}
      />
    </div>
  );
};

export default NewBookingPage;
