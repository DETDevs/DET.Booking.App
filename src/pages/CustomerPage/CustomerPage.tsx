import { useState, useMemo, useEffect } from "react";
import { useTenant } from "@/entities/tenant/TenantContext";
import { useSchema } from "@/entities/schema/useSchema";
import { useClientStore } from "@/entities/client/useClientStore";
import type { Client } from "@/entities/client/useClientStore";
import { useActivityStore } from "@/entities/activity/useActivityStore";
import { useToast } from "@/shared/ui/Toast";
import { ConfirmDialog } from "@/shared/ui/ConfirmDialog";
import { PageHeader } from "@/shared/ui/PageHeader";
import { motion, AnimatePresence } from "motion/react";
import {
  Plus,
  Search,
  Edit3,
  Trash2,
  UsersRound,
  X,
  Phone,
  Mail,
  CalendarDays,
  Hash,
  StickyNote,
} from "lucide-react";

// ─── Client form modal ───────────────────────────────────────────
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

  const inputClass =
    "w-full px-3 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-gray-900 dark:text-neutral-100 focus:outline-none focus:ring-2 transition-all";
  const labelClass =
    "block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-neutral-400 mb-1.5";
  const ringStyle = { "--tw-ring-color": primaryColor } as React.CSSProperties;

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
          />
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-2xl w-full max-w-md border border-gray-100 dark:border-neutral-700">
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-neutral-700">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  {isEdit ? "Editar" : "Nuevo"} cliente
                </h3>
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-neutral-700 transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="px-6 py-5 space-y-4">
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
              </div>

              <div className="flex justify-end gap-2 px-6 py-4 border-t border-gray-100 dark:border-neutral-700">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-neutral-400 bg-gray-100 dark:bg-neutral-700 rounded-xl hover:bg-gray-200 dark:hover:bg-neutral-600 transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!isValid}
                  className="px-5 py-2 text-sm font-semibold text-white rounded-xl hover:opacity-90 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{ backgroundColor: primaryColor }}
                >
                  {isEdit ? "Guardar cambios" : "Crear"}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ─── Main page ───────────────────────────────────────────────────
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

  // Zustand stores
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
      addActivity({
        action: "settings",
        user: "Admin",
        target: data.name,
        details: `Actualizó información del cliente ${data.name}`,
        tenant: tenant.type,
      });
      toast(`${data.name} actualizado ✓`, "success");
    } else {
      addClient(data);
      addActivity({
        action: "create",
        user: "Admin",
        target: data.name,
        details: `Registró nuevo cliente: ${data.name}`,
        tenant: tenant.type,
      });
      toast(`${data.name} registrado ✓`, "success");
    }
    setFormOpen(false);
    setEditClient(null);
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    const client = allClients.find((c) => c.id === deleteTarget);
    deleteClient(deleteTarget);
    addActivity({
      action: "cancel",
      user: "Admin",
      target: client?.name ?? "",
      details: `Eliminó al cliente ${client?.name ?? ""}`,
      tenant: tenant.type,
    });
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
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <PageHeader
          icon={UsersRound}
          title={title}
          subtitle={`${tenantClients.length} clientes registrados`}
        />
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white rounded-xl hover:opacity-90 hover:shadow-lg transition-all cursor-pointer"
          style={{
            backgroundColor: primaryColor,
            boxShadow: `0 4px 14px ${primaryColor}40`,
          }}
        >
          <Plus size={16} />
          Nuevo
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-neutral-500"
        />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por nombre, teléfono, email..."
          className="w-full pl-9 pr-3 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-gray-900 dark:text-neutral-100 focus:outline-none focus:ring-2 transition-all"
          style={{ "--tw-ring-color": primaryColor } as React.CSSProperties}
        />
      </div>

      {/* Client table */}
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
                      {/* Name + Avatar */}
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

                      {/* Contact */}
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

                      {/* Notes */}
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

                      {/* Visits */}
                      <td className="px-5 py-3 text-center">
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-gray-600 dark:text-neutral-300">
                          <Hash size={10} />
                          {client.totalVisits}
                        </span>
                      </td>

                      {/* Last Visit */}
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

                      {/* Actions */}
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

      {/* Create / Edit modal */}
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

      {/* Delete confirm */}
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
