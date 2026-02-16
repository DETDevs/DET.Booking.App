import { useState } from "react";
import { useSchema } from "@/entities/schema/useSchema";
import { DynamicTable } from "@/shared/ui/DynamicTable";
import { DynamicForm } from "@/shared/ui/DynamicForm";
import { useTenant } from "@/entities/tenant/TenantContext";
import { Plus } from "lucide-react";

const MOCK_CLINIC_STAFF = [
  {
    name: "Dr. Carlos Méndez",
    specialty: "Cardiología",
    license: "MED-4521",
    phone: "8844-1122",
    office: "2do piso, 204",
    available: true,
  },
  {
    name: "Dra. Ana Ruiz",
    specialty: "Pediatría",
    license: "MED-3310",
    phone: "8855-3344",
    office: "1er piso, 102",
    available: true,
  },
  {
    name: "Dr. Luis Herrera",
    specialty: "Dermatología",
    license: "MED-2208",
    phone: "8866-5566",
    office: "3er piso, 301",
    available: false,
  },
];

const MOCK_BARBER_STAFF = [
  {
    name: "Marco Jiménez",
    phone: "7711-2233",
    shift: "Mañana",
    available: true,
  },
  { name: "David Solano", phone: "7722-3344", shift: "Tarde", available: true },
  {
    name: "José Ureña",
    phone: "7733-4455",
    shift: "Completo",
    available: false,
  },
];

const UsersPage = () => {
  const schema = useSchema("staff");
  const tenant = useTenant();
  const [showForm, setShowForm] = useState(false);

  const mockData =
    tenant.type === "barbershop" ? MOCK_BARBER_STAFF : MOCK_CLINIC_STAFF;

  if (!schema) {
    return (
      <div className="p-6 text-gray-500">
        Schema no encontrado para esta entidad.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">{schema.title}</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white rounded-lg hover:opacity-90 transition-opacity cursor-pointer"
          style={{
            backgroundColor: tenant.branding?.primaryColor ?? "#6366f1",
          }}
        >
          <Plus size={16} />
          {showForm ? "Ver lista" : `Nuevo ${schema.title.slice(0, -1)}`}
        </button>
      </div>

      {showForm ? (
        <DynamicForm
          fields={schema.fields}
          title={`Registrar ${schema.title.slice(0, -1)}`}
          onSubmit={(data) => {
            console.log("Form submitted:", data);
            setShowForm(false);
          }}
          onCancel={() => setShowForm(false)}
        />
      ) : (
        <DynamicTable columns={schema.columns} data={mockData} />
      )}
    </div>
  );
};

export default UsersPage;
