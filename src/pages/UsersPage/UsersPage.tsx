import { useState, useMemo, useEffect } from "react";
import { useTenant } from "@/entities/tenant/TenantContext";
import { useSchema } from "@/entities/schema/useSchema";
import { useStaffStore } from "@/entities/staff/useStaffStore";
import type { StaffMember } from "@/entities/staff/useStaffStore";
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
  ToggleLeft,
  ToggleRight,
  Users,
  Phone,
  Mail,
  Briefcase,
} from "lucide-react";

interface StaffFormProps {
  open: boolean;
  member?: StaffMember | null;
  tenantType: string;
  primaryColor: string;
  onSave: (data: Omit<StaffMember, "id">) => void;
  onClose: () => void;
}

function StaffFormModal({
  open,
  member,
  tenantType,
  primaryColor,
  onSave,
  onClose,
}: StaffFormProps) {
  const [name, setName] = useState(member?.name ?? "");
  const [speciality, setSpeciality] = useState(member?.speciality ?? "");
  const [phone, setPhone] = useState(member?.phone ?? "");
  const [email, setEmail] = useState(member?.email ?? "");

  useEffect(() => {
    setName(member?.name ?? "");
    setSpeciality(member?.speciality ?? "");
    setPhone(member?.phone ?? "");
    setEmail(member?.email ?? "");
  }, [member]);

  const isEdit = !!member;
  const isValid = name.trim().length > 1;

  const handleSubmit = () => {
    if (!isValid) return;
    const initials = name
      .trim()
      .split(" ")
      .map((w) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

    onSave({
      name: name.trim(),
      avatar: member?.avatar ?? initials,
      role: tenantType,
      speciality: speciality.trim() || undefined,
      phone: phone.trim() || undefined,
      email: email.trim() || undefined,
      available: member?.available ?? true,
    });
  };

  const ringStyle = getRingStyle(primaryColor);

  return (
    <FormModal
      open={open}
      title={`${isEdit ? "Editar" : "Nuevo"} miembro`}
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
          placeholder="Ej: Dr. Juan Pérez"
          className={inputClass}
          style={ringStyle}
          autoFocus
        />
      </div>
      <div>
        <label className={labelClass}>Especialidad / Área</label>
        <input
          type="text"
          value={speciality}
          onChange={(e) => setSpeciality(e.target.value)}
          placeholder="Ej: Cardiología, Fade, Terraza..."
          className={inputClass}
          style={ringStyle}
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelClass}>Teléfono</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="8888-0000"
            className={inputClass}
            style={ringStyle}
          />
        </div>
        <div>
          <label className={labelClass}>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="correo@email.com"
            className={inputClass}
            style={ringStyle}
          />
        </div>
      </div>
    </FormModal>
  );
}

const UsersPage = () => {
  const tenant = useTenant();
  const schema = useSchema("staff");
  const primaryColor = tenant.branding?.primaryColor ?? "#6366f1";
  const { toast } = useToast();

  const allStaff = useStaffStore((s) => s.staff);
  const addStaff = useStaffStore((s) => s.addStaff);
  const updateStaff = useStaffStore((s) => s.updateStaff);
  const deleteStaff = useStaffStore((s) => s.deleteStaff);
  const toggleAvailability = useStaffStore((s) => s.toggleAvailability);
  const addActivity = useActivityStore((s) => s.addEntry);

  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editMember, setEditMember] = useState<StaffMember | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const tenantStaff = useMemo(() => {
    let list = allStaff.filter((s) => s.role === tenant.type);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.speciality?.toLowerCase().includes(q) ||
          s.phone?.includes(q),
      );
    }
    return list.sort((a, b) => {
      if (a.available !== b.available) return a.available ? -1 : 1;
      return a.name.localeCompare(b.name);
    });
  }, [allStaff, tenant.type, search]);

  const title = schema?.title ?? "Equipo";

  const handleSave = (data: Omit<StaffMember, "id">) => {
    if (editMember) {
      updateStaff(editMember.id, data);
      addActivity({ action: "settings", user: "Admin", target: data.name, details: `Actualizó información de ${data.name}`, tenant: tenant.type });
      toast(`${data.name} actualizado ✓`, "success");
    } else {
      addStaff(data);
      addActivity({ action: "create", user: "Admin", target: data.name, details: `Registró nuevo miembro: ${data.name}`, tenant: tenant.type });
      toast(`${data.name} registrado ✓`, "success");
    }
    setFormOpen(false);
    setEditMember(null);
  };

  const handleToggle = (member: StaffMember) => {
    toggleAvailability(member.id);
    const newState = !member.available;
    addActivity({ action: "settings", user: "Admin", target: member.name, details: newState ? `Activó a ${member.name}` : `Desactivó a ${member.name}`, tenant: tenant.type });
    toast(`${member.name} ${newState ? "activado" : "desactivado"} ✓`, "success");
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    const member = allStaff.find((s) => s.id === deleteTarget);
    deleteStaff(deleteTarget);
    addActivity({ action: "cancel", user: "Admin", target: member?.name ?? "", details: `Eliminó a ${member?.name ?? ""} del equipo`, tenant: tenant.type });
    toast(`${member?.name ?? ""} eliminado`, "error");
    setDeleteTarget(null);
  };

  const openEdit = (member: StaffMember) => {
    setEditMember(member);
    setFormOpen(true);
  };

  const openCreate = () => {
    setEditMember(null);
    setFormOpen(true);
  };

  return (
    <div className="space-y-6">
      <CrudPageHeader
        icon={Users}
        title={title}
        subtitle={`${tenantStaff.length} miembros registrados`}
        primaryColor={primaryColor}
        search={search}
        onSearch={setSearch}
        searchPlaceholder="Buscar por nombre, especialidad, teléfono..."
        onCreate={openCreate}
      />

      <div className="bg-white dark:bg-neutral-800 rounded-2xl border border-gray-100 dark:border-neutral-700 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 dark:border-neutral-700">
                <th className="text-left px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-neutral-500">
                  Miembro
                </th>
                <th className="text-left px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-neutral-500">
                  Especialidad
                </th>
                <th className="text-left px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-neutral-500">
                  Contacto
                </th>
                <th className="text-center px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-neutral-500">
                  Estado
                </th>
                <th className="text-right px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-neutral-500">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence mode="popLayout">
                {tenantStaff.map((member) => (
                  <motion.tr
                    key={member.id}
                    layout
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: 40 }}
                    className={`border-b border-gray-50 dark:border-neutral-700/50 group ${!member.available ? "opacity-50" : ""}`}
                  >
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-xs font-bold shrink-0"
                          style={{
                            backgroundColor: member.available
                              ? primaryColor
                              : "#9ca3af",
                          }}
                        >
                          {member.avatar}
                        </div>
                        <span className="font-semibold text-gray-900 dark:text-white truncate">
                          {member.name}
                        </span>
                      </div>
                    </td>

                    <td className="px-5 py-3">
                      {member.speciality ? (
                        <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded-full bg-gray-50 dark:bg-neutral-700 text-gray-600 dark:text-neutral-300">
                          <Briefcase size={10} />
                          {member.speciality}
                        </span>
                      ) : (
                        <span className="text-xs text-gray-300 dark:text-neutral-600">
                          —
                        </span>
                      )}
                    </td>

                    <td className="px-5 py-3">
                      <div className="space-y-0.5">
                        {member.phone && (
                          <p className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-neutral-400">
                            <Phone size={10} />
                            {member.phone}
                          </p>
                        )}
                        {member.email && (
                          <p className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-neutral-400">
                            <Mail size={10} />
                            {member.email}
                          </p>
                        )}
                      </div>
                    </td>

                    <td className="px-5 py-3 text-center">
                      <button
                        onClick={() => handleToggle(member)}
                        className="inline-flex items-center gap-1 cursor-pointer transition-colors"
                        title={member.available ? "Desactivar" : "Activar"}
                      >
                        {member.available ? (
                          <ToggleRight size={24} className="text-emerald-500" />
                        ) : (
                          <ToggleLeft
                            size={24}
                            className="text-gray-300 dark:text-neutral-600"
                          />
                        )}
                      </button>
                    </td>

                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openEdit(member)}
                          className="p-1.5 rounded-lg text-gray-400 dark:text-neutral-500 hover:bg-gray-100 dark:hover:bg-neutral-700 hover:text-gray-700 dark:hover:text-neutral-200 transition-colors cursor-pointer"
                          title="Editar"
                        >
                          <Edit3 size={15} />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(member.id)}
                          className="p-1.5 rounded-lg text-gray-400 dark:text-neutral-500 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 dark:hover:text-red-400 transition-colors cursor-pointer"
                          title="Eliminar"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {tenantStaff.length === 0 && (
          <div className="py-12 text-center text-gray-400 dark:text-neutral-500">
            <Users size={32} className="mx-auto mb-2 opacity-30" />
            <p className="text-sm">
              {search.trim()
                ? "Sin resultados para esta búsqueda"
                : "No hay miembros registrados"}
            </p>
          </div>
        )}
      </div>

      <StaffFormModal
        open={formOpen}
        member={editMember}
        tenantType={tenant.type}
        primaryColor={primaryColor}
        onSave={handleSave}
        onClose={() => {
          setFormOpen(false);
          setEditMember(null);
        }}
      />

      <ConfirmDialog
        open={deleteTarget !== null}
        title="Eliminar miembro"
        message="¿Estás seguro de que querés eliminar este miembro? Esta acción no se puede deshacer."
        confirmLabel="Sí, eliminar"
        cancelLabel="Cancelar"
        variant="danger"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};

export default UsersPage;
