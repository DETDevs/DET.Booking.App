import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface StaffMember {
  id: string;
  name: string;
  avatar: string; // 2-letter initials
  role: string; // tenant type: barbershop | clinic | grooming | restaurant
  speciality?: string;
  phone?: string;
  email?: string;
  available: boolean;
}

interface StaffStore {
  staff: StaffMember[];
  addStaff: (member: Omit<StaffMember, "id">) => string;
  updateStaff: (id: string, data: Partial<StaffMember>) => void;
  deleteStaff: (id: string) => void;
  toggleAvailability: (id: string) => void;
  getByTenant: (tenantType: string) => StaffMember[];
}

const INITIAL_STAFF: StaffMember[] = [
  { id: "st1", name: "Marco Jiménez", avatar: "MJ", role: "barbershop", speciality: "Fades & Degradados", phone: "8888-0001", email: "marco@barberking.com", available: true },
  { id: "st2", name: "David Solano", avatar: "DS", role: "barbershop", speciality: "Corte clásico & Barba", phone: "8888-0002", email: "david@barberking.com", available: true },
  { id: "st3", name: "José Ureña", avatar: "JU", role: "barbershop", speciality: "Tinte & Color", phone: "8888-0003", email: "jose@barberking.com", available: true },
  { id: "st4", name: "Dra. Ana Pérez", avatar: "AP", role: "clinic", speciality: "Medicina General", phone: "8888-0004", email: "ana@clinicavida.com", available: true },
  { id: "st5", name: "Dr. Emily Johnson", avatar: "EJ", role: "clinic", speciality: "Fisioterapia", phone: "8888-0005", email: "emily@clinicavida.com", available: true },
  { id: "st6", name: "Dr. Carlos Martínez", avatar: "CM", role: "clinic", speciality: "Pediatría", phone: "8888-0006", email: "carlos@clinicavida.com", available: true },
  { id: "st7", name: "Marco Rivera", avatar: "MR", role: "grooming", speciality: "Perros grandes", phone: "8888-0007", email: "marco@mopetco.com", available: true },
  { id: "st8", name: "Laura Méndez", avatar: "LM", role: "grooming", speciality: "Baños & Tratamientos", phone: "8888-0008", email: "laura@mopetco.com", available: true },
  { id: "st9", name: "Sofía Castillo", avatar: "SC", role: "grooming", speciality: "Gatos", phone: "8888-0009", email: "sofia@mopetco.com", available: true },
  { id: "st10", name: "Laura Salas", avatar: "LS", role: "restaurant", speciality: "Salón Principal", phone: "8888-0010", email: "laura@mesadorada.com", available: true },
  { id: "st11", name: "Carlos Montero", avatar: "CM", role: "restaurant", speciality: "VIP & Eventos", phone: "8888-0011", email: "carlos@mesadorada.com", available: true },
  { id: "st12", name: "Ana Marchena", avatar: "AM", role: "restaurant", speciality: "Terraza", phone: "8888-0012", email: "ana@mesadorada.com", available: true },
];

export const useStaffStore = create<StaffStore>()(persist(
  (set, get) => ({
    staff: INITIAL_STAFF,

    addStaff: (data) => {
      const id = `st-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`;
      const member: StaffMember = { ...data, id };
      set((s) => ({ staff: [...s.staff, member] }));
      return id;
    },

    updateStaff: (id, data) => {
      set((s) => ({
        staff: s.staff.map((m) => (m.id === id ? { ...m, ...data } : m)),
      }));
    },

    deleteStaff: (id) => {
      set((s) => ({ staff: s.staff.filter((m) => m.id !== id) }));
    },

    toggleAvailability: (id) => {
      set((s) => ({
        staff: s.staff.map((m) =>
          m.id === id ? { ...m, available: !m.available } : m,
        ),
      }));
    },

    getByTenant: (tenantType) => {
      return get().staff.filter((m) => m.role === tenantType);
    },
  }),
  {
    name: "det-staff-store",
    partialize: (state) => ({ staff: state.staff }),
  },
));
