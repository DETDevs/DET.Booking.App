import { useState } from "react";
import { useSchema } from "@/entities/schema/useSchema";
import { DynamicTable } from "@/shared/ui/DynamicTable";
import { DynamicForm } from "@/shared/ui/DynamicForm";
import { useTenant } from "@/entities/tenant/TenantContext";
import { Plus } from "lucide-react";

const MOCK_CLINIC_PATIENTS = [
  {
    name: "María López",
    cedula: "1-0234-0567",
    phone: "8811-2233",
    email: "maria@mail.com",
    bloodType: "O+",
    allergies: "Penicilina",
    insurance: "INS",
  },
  {
    name: "Pedro Castillo",
    cedula: "3-0456-0789",
    phone: "8822-3344",
    email: "pedro@mail.com",
    bloodType: "A+",
    allergies: "Ninguna",
    insurance: "CCSS",
  },
  {
    name: "Lucía Vargas",
    cedula: "2-0678-0123",
    phone: "8833-4455",
    email: "lucia@mail.com",
    bloodType: "B-",
    allergies: "Mariscos",
    insurance: "BlueCross",
  },
];

const MOCK_BARBER_CLIENTS = [
  {
    name: "Carlos Rivera",
    phone: "7711-4455",
    preferredStyle: "Fade",
    lastVisit: "2026-02-10",
  },
  {
    name: "Andrés Mora",
    phone: "7722-5566",
    preferredStyle: "Clásico",
    lastVisit: "2026-02-14",
  },
  {
    name: "Kevin Soto",
    phone: "7733-6677",
    preferredStyle: "Degradado",
    lastVisit: "2026-01-28",
  },
];

const CustomerPage = () => {
  const tenant = useTenant();
  const entityName = tenant.type === "barbershop" ? "clients" : "patients";
  const schema = useSchema(entityName);
  const [showForm, setShowForm] = useState(false);

  const mockData =
    tenant.type === "barbershop" ? MOCK_BARBER_CLIENTS : MOCK_CLINIC_PATIENTS;

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

export default CustomerPage;
