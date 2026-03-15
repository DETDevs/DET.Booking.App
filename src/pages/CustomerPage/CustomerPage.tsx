import { useState, useMemo, useEffect } from "react";
import { useTenant } from "@/entities/tenant/TenantContext";
import { useSchema } from "@/entities/schema/useSchema";
import { useClientStore } from "@/entities/client/useClientStore";
import type { Client } from "@/entities/client/useClientStore";
import { useActivityStore } from "@/entities/activity/useActivityStore";
import { useToast } from "@/shared/ui/Toast";
import { ConfirmDialog } from "@/shared/ui/ConfirmDialog";
import { FormModal } from "@/shared/ui/FormModal";
import { CrudPageHeader } from "@/shared/ui/CrudPageHeader";
import { inputClass, labelClass, getRingStyle } from "@/shared/lib/formStyles";
import { motion, AnimatePresence } from "motion/react";
import {
  Edit3,
  Trash2,
  UsersRound,
  Phone,
  Mail,
  CalendarDays,
  Hash,
  StickyNote,
} from "lucide-react";

interface ClientFormProps {
  open: boolean;
  client?: Client | null;
  tenantType: string;
  primaryColor: string;
  onSave: (data: Omit<Client, "id" | "createdAt" | "totalVisits">) => void;
  onClose: () => void;
}

function ClientFormModal({
  open,
  client,
  tenantType,
  primaryColor,
  onSave,
  onClose,
}: ClientFormProps) {
  const [name, setName] = useState("");
  const [phone1, setPhone1] = useState("");
  const [email1, setEmail1] = useState("");
  const [notes1, setNotes1] = useState("");

  useEffect(() => {
    setName(client?.name ?? "");
    setPhone1(client?.phone ?? "");
    setEmail1(client?.email ?? "");
    setNotes1(client?.notes ?? "");
  }, [client, open]);

  const isEdit = !!client;
  const isValid = name.trim().length > 1 && phone1.trim().length > 3;

  const handleSubmit = () => {
    if (!isValid) return;
    onSave({
      name: name.trim(),
      phone: phone1.trim(),
      email: email1.trim(),
      tenant: tenantType,
      notes: notes1.trim() || undefined,
      lastVisit: client?.lastVisit,
    });
  };

  const ringStyle = getRingStyle(primaryColor);

  return (
    <FormModal
      open={open}
      title={`${isEdit ? "Editar" : "Nuevo"} cliente`}
      primaryColor={primaryColor}
      submitLabel={isEdit ? "Guardar cambios" : "Crear"}
      isValid={isValid}
      onSubmit={handleSubmit}
      onClose={onClose}
    >
      <div>
        <label className={labelClass}>Nombre completo *</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ej: María López"
          className={inputClass}
          style={ringStyle}
          autoFocus
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelClass}>Teléfono *</label>
          <input
            type="tel"
            value={phone1}
            onChange={(e) => setPhone1(e.target.value)}
            placeholder="8888-0000"
            className={inputClass}
            style={ringStyle}
          />
        </div>
        <div>
          <label className={labelClass}>Email</label>
          <input
            type="email"
            value={email1}
            onChange={(e) => setEmail1(e.target.value)}
            placeholder="correo@email.com"
            className={inputClass}
            style={ringStyle}
          />
        </div>
      </div>
      <div>
        <label className={labelClass}>Notas / Preferencias</label>
        <textarea
          value={notes1}
          onChange={(e) => setNotes1(e.target.value)}
          placeholder="Ej: Alérgico a mariscos, prefiere ventana..."
          rows={2}
          className={`${inputClass} resize-none`}
          style={ringStyle}
        />
      </div>
    </FormModal>
  );
}

const CustomerPage = () => {
  const tenant = useTenant();
  const entityName =
    tenant.type === "barbershop"
      ? "clients"
      : tenant.type === "restaurant"
        ? "clients"
        : tenant.type === "grooming"
          ? "clients"
          : "patients";
  const schema = useSchema(entityName);
  const primaryColor = tenant.branding?.primaryColor ?? "#6366f1";
  const { toast } = useToast();

  const allClients = useClientStore((s) => s.clients);
  const addClient = useClientStore((s) => s.addClient);
  const updateClient = useClientStore((s) => s.updateClient);
  const deleteClient = useClientStore((s) => s.deleteClient);
  const addActivity = useActivityStore((s) => s.addEntry);

  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editClient, setEditClient] = useState<Client | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const tenantClients = useMemo(() => {
    let list = allClients.filter((c) => c.tenant === tenant.type);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.phone.includes(q) ||
          c.email?.toLowerCase().includes(q) ||
          c.notes?.toLowerCase().includes(q),
      );
    }
    return list.sort((a, b) => b.totalVisits - a.totalVisits);
  }, [allClients, tenant.type, search]);

  const title = schema?.title ?? "Clientes";

  const handleSave = (data: Omit<Client, "id" | "createdAt" | "totalVisits">) => {
    if (editClient) {
      updateClient(editClient.id, data);
      addActivity({ action: "settings", user: "Admin", target: data.name, details: `Actualizó información del cliente ${data.name}`, tenant: tenant.type });
      toast(`${data.name} actualizado ✓`, "success");
    } else {
      addClient(data);
      addActivity({ action: "create", user: "Admin", target: data.name, details: `Registró nuevo cliente: ${data.name}`, tenant: tenant.type });
      toast(`${data.name} registrado ✓`, "success");
    }
    setFormOpen(false);
    setEditClient(null);
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    const client = allClients.find((c) => c.id === deleteTarget);
    deleteClient(deleteTarget);
    addActivity({ action: "cancel", user: "Admin", target: client?.name ?? "", details: `Eliminó al cliente ${client?.name ?? ""}`, tenant: tenant.type });
    toast(`${client?.name ?? ""} eliminado`, "error");
    setDeleteTarget(null);
  };

  const openEdit = (client: Client) => {
    setEditClient(client);
    setFormOpen(true);
  };

  const openCreate = () => {
    setEditClient(null);
    setFormOpen(true);
  };

  return (
    <div className="space-y-6">
      <CrudPageHeader
        icon={UsersRound}
        title={title}
        subtitle={`${tenantClients.length} clientes registrados`}
        primaryColor={primaryColor}
        search={search}
        onSearch={setSearch}
        searchPlaceholder="Buscar por nombre, teléfono, email..."
        onCreate={openCreate}
      />

      <div className="bg-white dark:bg-neutral-800 rounded-2xl border border-gray-100 dark:border-neutral-700 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 dark:border-neutral-700">
                <th className="text-left px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-neutral-500">
                  Cliente
                </th>
                <th className="text-left px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-neutral-500">
                  Contacto
                </th>
                <th className="text-left px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-neutral-500">
                  Notas
                </th>
                <th className="text-center px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-neutral-500">
                  Visitas
                </th>
                <th className="text-left px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-neutral-500">
                  Última visita
                </th>
                <th className="text-right px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-neutral-500">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence mode="popLayout">
                {tenantClients.map((client) => {
                  const initials = client.name
                    .split(" ")
                    .map((w) => w[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase();

                  return (
                    <motion.tr
                      key={client.id}
                      layout
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 40 }}
                      className="border-b border-gray-50 dark:border-neutral-700/50 group"
                    >
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-xs font-bold shrink-0"
                            style={{ backgroundColor: primaryColor }}
                          >
                            {initials}
                          </div>
                          <span className="font-semibold text-gray-900 dark:text-white truncate">
                            {client.name}
                          </span>
                        </div>
                      </td>

                      <td className="px-5 py-3">
                        <div className="space-y-0.5">
                          <p className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-neutral-400">
                            <Phone size={10} />
                            {client.phone}
                          </p>
                          {client.email && (
                            <p className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-neutral-400">
                              <Mail size={10} />
                              {client.email}
                            </p>
                          )}
                        </div>
                      </td>

                      <td className="px-5 py-3">
                        {client.notes ? (
                          <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded-full bg-gray-50 dark:bg-neutral-700 text-gray-600 dark:text-neutral-300 max-w-[180px] truncate">
                            <StickyNote size={10} />
                            {client.notes}
                          </span>
                        ) : (
                          <span className="text-xs text-gray-300 dark:text-neutral-600">
                            —
                          </span>
                        )}
                      </td>

                      <td className="px-5 py-3 text-center">
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-gray-600 dark:text-neutral-300">
                          <Hash size={10} />
                          {client.totalVisits}
                        </span>
                      </td>

                      <td className="px-5 py-3">
                        {client.lastVisit ? (
                          <span className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-neutral-400">
                            <CalendarDays size={10} />
                            {client.lastVisit}
                          </span>
                        ) : (
                          <span className="text-xs text-gray-300 dark:text-neutral-600">
                            —
                          </span>
                        )}
                      </td>

                      <td className="px-5 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => openEdit(client)}
                            className="p-1.5 rounded-lg text-gray-400 dark:text-neutral-500 hover:bg-gray-100 dark:hover:bg-neutral-700 hover:text-gray-700 dark:hover:text-neutral-200 transition-colors cursor-pointer"
                            title="Editar"
                          >
                            <Edit3 size={15} />
                          </button>
                          <button
                            onClick={() => setDeleteTarget(client.id)}
                            className="p-1.5 rounded-lg text-gray-400 dark:text-neutral-500 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 dark:hover:text-red-400 transition-colors cursor-pointer"
                            title="Eliminar"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {tenantClients.length === 0 && (
          <div className="py-12 text-center text-gray-400 dark:text-neutral-500">
            <UsersRound size={32} className="mx-auto mb-2 opacity-30" />
            <p className="text-sm">
              {search.trim()
                ? "Sin resultados para esta búsqueda"
                : "No hay clientes registrados"}
            </p>
          </div>
        )}
      </div>

      <ClientFormModal
        open={formOpen}
        client={editClient}
        tenantType={tenant.type}
        primaryColor={primaryColor}
        onSave={handleSave}
        onClose={() => {
          setFormOpen(false);
          setEditClient(null);
        }}
      />

      <ConfirmDialog
        open={deleteTarget !== null}
        title="Eliminar cliente"
        message="¿Estás seguro de que querés eliminar este cliente? Esta acción no se puede deshacer."
        confirmLabel="Sí, eliminar"
        cancelLabel="Cancelar"
        variant="danger"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};

export default CustomerPage;
