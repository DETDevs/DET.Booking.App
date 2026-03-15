import { useState } from "react";
import { useTenant } from "@/entities/tenant/TenantContext";
import { PageHeader } from "@/shared/ui/PageHeader";
import { Tag, Plus, Pencil, Trash2, Clock, DollarSign, User } from "lucide-react";
import { useToast } from "@/shared/ui/Toast";
import { ConfirmDialog } from "@/shared/ui/ConfirmDialog";
import { EmptyState } from "@/shared/ui/EmptyState";

interface Service {
  id: string;
  name: string;
  duration: number;
  price: number;
  staff: string[];
  active: boolean;
}

const MOCK_SERVICES: Record<string, Service[]> = {
  barbershop: [
    { id: "s1", name: "Corte clásico", duration: 30, price: 5000, staff: ["Marco Jiménez", "David Solano"], active: true },
    { id: "s2", name: "Fade", duration: 30, price: 6000, staff: ["Marco Jiménez", "José Ureña"], active: true },
    { id: "s3", name: "Barba", duration: 20, price: 3000, staff: ["David Solano", "José Ureña"], active: true },
    { id: "s4", name: "Corte + Barba", duration: 45, price: 8000, staff: ["Marco Jiménez", "David Solano", "José Ureña"], active: true },
    { id: "s5", name: "Tinte", duration: 60, price: 12000, staff: ["Marco Jiménez"], active: true },
    { id: "s6", name: "Tratamiento capilar", duration: 40, price: 10000, staff: ["David Solano"], active: false },
  ],
  clinic: [
    { id: "s1", name: "Consulta General", duration: 30, price: 25000, staff: ["Dra. Ana Pérez"], active: true },
    { id: "s2", name: "Fisioterapia", duration: 60, price: 35000, staff: ["Dr. Emily Johnson"], active: true },
    { id: "s3", name: "Pediatría", duration: 30, price: 30000, staff: ["Dr. Carlos Martínez"], active: true },
    { id: "s4", name: "Psicología", duration: 50, price: 40000, staff: ["Dra. Ana Pérez"], active: true },
    { id: "s5", name: "Dermatología", duration: 30, price: 35000, staff: ["Dr. Emily Johnson"], active: true },
  ],
  grooming: [
    { id: "s1", name: "Dog Full Grooming", duration: 90, price: 15000, staff: ["Marco Rivera", "Laura Méndez"], active: true },
    { id: "s2", name: "Dog Bath Services", duration: 60, price: 8000, staff: ["Laura Méndez"], active: true },
    { id: "s3", name: "Cat Grooming", duration: 60, price: 12000, staff: ["Sofía Castillo"], active: true },
    { id: "s4", name: "Treatments", duration: 45, price: 10000, staff: ["Marco Rivera"], active: true },
  ],
  restaurant: [
    { id: "s1", name: "Mesa Interior (2-4)", duration: 120, price: 0, staff: ["Laura Salas"], active: true },
    { id: "s2", name: "Mesa Interior (5-8)", duration: 120, price: 0, staff: ["Laura Salas"], active: true },
    { id: "s3", name: "Terraza (2-4)", duration: 120, price: 0, staff: ["Ana Marchena"], active: true },
    { id: "s4", name: "VIP (6-10)", duration: 150, price: 5000, staff: ["Carlos Montero"], active: true },
  ],
};

const ServicesPage = () => {
  const tenant = useTenant();
  const { toast } = useToast();
  const primaryColor = tenant.branding?.primaryColor ?? "#6366f1";

  const [services, setServices] = useState(
    MOCK_SERVICES[tenant.type] ?? MOCK_SERVICES.barbershop,
  );
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ open: boolean; id: string; name: string }>({ open: false, id: "", name: "" });

  // Form state
  const [formName, setFormName] = useState("");
  const [formDuration, setFormDuration] = useState(30);
  const [formPrice, setFormPrice] = useState(0);

  const openNew = () => {
    setEditingId(null);
    setFormName("");
    setFormDuration(30);
    setFormPrice(0);
    setShowForm(true);
  };

  const openEdit = (service: Service) => {
    setEditingId(service.id);
    setFormName(service.name);
    setFormDuration(service.duration);
    setFormPrice(service.price);
    setShowForm(true);
  };

  const handleSave = () => {
    if (!formName.trim()) return;
    if (editingId) {
      setServices((prev) =>
        prev.map((s) =>
          s.id === editingId ? { ...s, name: formName, duration: formDuration, price: formPrice } : s,
        ),
      );
      toast(`Servicio "${formName}" actualizado`, "success");
    } else {
      const newService: Service = {
        id: `s${Date.now()}`,
        name: formName,
        duration: formDuration,
        price: formPrice,
        staff: [],
        active: true,
      };
      setServices((prev) => [...prev, newService]);
      toast(`Servicio "${formName}" creado`, "success");
    }
    setShowForm(false);
  };

  const handleDelete = (id: string) => {
    setServices((prev) => prev.filter((s) => s.id !== id));
    toast("Servicio eliminado", "error");
    setDeleteConfirm({ open: false, id: "", name: "" });
  };

  const toggleActive = (id: string) => {
    setServices((prev) =>
      prev.map((s) => (s.id === id ? { ...s, active: !s.active } : s)),
    );
  };

  const inputClass =
    "w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-gray-900 dark:text-neutral-100 focus:outline-none focus:ring-2 transition-all";
  const ringStyle = { "--tw-ring-color": primaryColor } as React.CSSProperties;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <PageHeader
        icon={Tag}
        title={tenant.features.services?.label ?? "Servicios"}
        subtitle={`${services.length} servicios registrados`}
        actions={
          <button
            onClick={openNew}
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white rounded-xl transition-all hover:opacity-90 cursor-pointer"
            style={{ backgroundColor: primaryColor }}
          >
            <Plus size={16} />
            Nuevo servicio
          </button>
        }
      />

      {/* Service Form */}
      {showForm && (
        <div className="bg-white dark:bg-neutral-800 rounded-2xl border border-gray-100 dark:border-neutral-700 p-6 shadow-sm space-y-4">
          <h3 className="font-semibold text-gray-900 dark:text-white">
            {editingId ? "Editar servicio" : "Nuevo servicio"}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-neutral-400 mb-1">
                Nombre *
              </label>
              <input
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                className={inputClass}
                style={ringStyle}
                placeholder="Nombre del servicio"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-neutral-400 mb-1">
                Duración (min)
              </label>
              <input
                type="number"
                value={formDuration}
                onChange={(e) => setFormDuration(Number(e.target.value))}
                className={inputClass}
                style={ringStyle}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-neutral-400 mb-1">
                Precio
              </label>
              <input
                type="number"
                value={formPrice}
                onChange={(e) => setFormPrice(Number(e.target.value))}
                className={inputClass}
                style={ringStyle}
              />
            </div>
          </div>
          <div className="flex gap-3 justify-end">
            <button
              onClick={() => setShowForm(false)}
              className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-neutral-300 bg-gray-100 dark:bg-neutral-700 rounded-xl hover:bg-gray-200 dark:hover:bg-neutral-600 transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2 text-sm font-semibold text-white rounded-xl transition-all hover:opacity-90 cursor-pointer"
              style={{ backgroundColor: primaryColor }}
            >
              {editingId ? "Actualizar" : "Crear"}
            </button>
          </div>
        </div>
      )}

      {/* Services List */}
      {services.length > 0 ? (
        <div className="space-y-2">
          {services.map((service) => (
            <div
              key={service.id}
              className={`flex items-center gap-4 bg-white dark:bg-neutral-800 rounded-xl border border-gray-100 dark:border-neutral-700 p-4 shadow-sm transition-all ${
                !service.active ? "opacity-50" : ""
              }`}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{ backgroundColor: `${primaryColor}12` }}
              >
                <Tag size={18} style={{ color: primaryColor }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                  {service.name}
                  {!service.active && (
                    <span className="ml-2 text-[10px] font-medium text-gray-400 dark:text-neutral-500 bg-gray-100 dark:bg-neutral-700 px-2 py-0.5 rounded-full">
                      Inactivo
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-neutral-400 mt-0.5">
                  <span className="flex items-center gap-1">
                    <Clock size={11} /> {service.duration} min
                  </span>
                  <span className="flex items-center gap-1">
                    <DollarSign size={11} /> {service.price > 0 ? `C$${service.price.toLocaleString()}` : "Gratis"}
                  </span>
                  <span className="flex items-center gap-1">
                    <User size={11} /> {service.staff.length} profesional{service.staff.length !== 1 ? "es" : ""}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => toggleActive(service.id)}
                  className={`px-2.5 py-1.5 text-[11px] font-medium rounded-lg transition-colors cursor-pointer ${
                    service.active
                      ? "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 hover:bg-emerald-100"
                      : "text-gray-500 dark:text-neutral-400 bg-gray-100 dark:bg-neutral-700 hover:bg-gray-200"
                  }`}
                >
                  {service.active ? "Activo" : "Inactivo"}
                </button>
                <button
                  onClick={() => openEdit(service)}
                  className="p-2 rounded-lg text-gray-400 dark:text-neutral-500 hover:bg-gray-100 dark:hover:bg-neutral-700 transition-colors cursor-pointer"
                  aria-label={`Editar ${service.name}`}
                >
                  <Pencil size={14} />
                </button>
                <button
                  onClick={() => setDeleteConfirm({ open: true, id: service.id, name: service.name })}
                  className="p-2 rounded-lg text-red-400 dark:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors cursor-pointer"
                  aria-label={`Eliminar ${service.name}`}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Tag}
          title="Sin servicios"
          description="Creá tu primer servicio para comenzar a recibir reservas."
          primaryColor={primaryColor}
          action={{ label: "Crear servicio", onClick: openNew }}
        />
      )}

      <ConfirmDialog
        open={deleteConfirm.open}
        title="Eliminar servicio"
        message={`¿Estás seguro de eliminar "${deleteConfirm.name}"? Esta acción no se puede deshacer.`}
        confirmLabel="Sí, eliminar"
        cancelLabel="Cancelar"
        variant="danger"
        onConfirm={() => handleDelete(deleteConfirm.id)}
        onCancel={() => setDeleteConfirm({ open: false, id: "", name: "" })}
      />
    </div>
  );
};

export default ServicesPage;
