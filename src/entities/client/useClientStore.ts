import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Client {
  id: string;
  name: string;
  phone: string;
  email: string;
  tenant: string; // barbershop | clinic | grooming | restaurant
  notes?: string;
  createdAt: string;
  totalVisits: number;
  lastVisit?: string;
}

interface ClientStore {
  clients: Client[];
  addClient: (data: Omit<Client, "id" | "createdAt" | "totalVisits">) => string;
  updateClient: (id: string, data: Partial<Client>) => void;
  deleteClient: (id: string) => void;
  getByTenant: (tenantType: string) => Client[];
  incrementVisits: (id: string) => void;
}

const INITIAL_CLIENTS: Client[] = [
  { id: "cl1", name: "Carlos Rivera", phone: "8888-1234", email: "carlos@mail.com", tenant: "barbershop", createdAt: "2025-11-20", totalVisits: 12, lastVisit: "2026-03-10", notes: "Prefiere Fade clásico" },
  { id: "cl2", name: "Andrés Mora", phone: "8888-5678", email: "andres@mail.com", tenant: "barbershop", createdAt: "2025-12-05", totalVisits: 8, lastVisit: "2026-03-08" },
  { id: "cl3", name: "Kevin Soto", phone: "8888-9012", email: "kevin@mail.com", tenant: "barbershop", createdAt: "2026-01-15", totalVisits: 5, lastVisit: "2026-03-05" },
  { id: "cl4", name: "Luis Hernández", phone: "8888-3456", email: "luis@mail.com", tenant: "barbershop", createdAt: "2026-01-20", totalVisits: 4, lastVisit: "2026-02-28" },
  { id: "cl5", name: "Pablo Castillo", phone: "8888-1111", email: "pablo@mail.com", tenant: "barbershop", createdAt: "2026-02-01", totalVisits: 3, lastVisit: "2026-02-25" },
  { id: "cl6", name: "Diego Vargas", phone: "8888-2222", email: "diego@mail.com", tenant: "barbershop", createdAt: "2026-02-10", totalVisits: 2, lastVisit: "2026-02-20" },
  { id: "cl7", name: "Leo Messi", phone: "8888-3333", email: "leo@mail.com", tenant: "barbershop", createdAt: "2026-03-01", totalVisits: 1, lastVisit: "2026-03-14" },
  { id: "cl8", name: "Amanda Chavez", phone: "8888-7890", email: "amanda@mail.com", tenant: "clinic", createdAt: "2025-10-15", totalVisits: 15, lastVisit: "2026-03-12" },
  { id: "cl9", name: "Jasmine Palmer", phone: "8888-4444", email: "jasmine@mail.com", tenant: "clinic", createdAt: "2025-11-01", totalVisits: 10, lastVisit: "2026-03-10" },
  { id: "cl10", name: "Randy Elliot", phone: "8888-5555", email: "randy@mail.com", tenant: "clinic", createdAt: "2025-12-01", totalVisits: 7, lastVisit: "2026-03-08" },
  { id: "cl11", name: "Christine Powell", phone: "8888-6666", email: "christine@mail.com", tenant: "clinic", createdAt: "2026-01-10", totalVisits: 4, lastVisit: "2026-02-28" },
  { id: "cl12", name: "María López", phone: "8888-7777", email: "maria@mail.com", tenant: "clinic", createdAt: "2026-02-01", totalVisits: 2, lastVisit: "2026-02-25" },
  { id: "cl13", name: "Sarah Thompson (Buddy)", phone: "8888-8888", email: "sarah@mail.com", tenant: "grooming", createdAt: "2025-11-10", totalVisits: 8, lastVisit: "2026-03-10", notes: "Golden Retriever, alérgico a shampoo fuerte" },
  { id: "cl14", name: "Juan Pérez (Kralos)", phone: "8888-9999", email: "juan@mail.com", tenant: "grooming", createdAt: "2025-12-20", totalVisits: 6, lastVisit: "2026-03-05", notes: "Husky, necesita deslanado" },
  { id: "cl15", name: "Emily García (Mishi)", phone: "8888-0101", email: "emilygm@mail.com", tenant: "grooming", createdAt: "2026-01-05", totalVisits: 4, lastVisit: "2026-02-28", notes: "Gato persa" },
  { id: "cl16", name: "Carlos Rodríguez (Max)", phone: "8888-0202", email: "carlosr@mail.com", tenant: "grooming", createdAt: "2026-02-01", totalVisits: 2, lastVisit: "2026-02-20" },
  { id: "cl17", name: "Isabel Quesada", phone: "8888-0303", email: "isabel@mail.com", tenant: "restaurant", createdAt: "2025-10-01", totalVisits: 20, lastVisit: "2026-03-12", notes: "Alérgica nueces" },
  { id: "cl18", name: "Roberto Arias", phone: "8888-0404", email: "roberto@mail.com", tenant: "restaurant", createdAt: "2025-11-15", totalVisits: 15, lastVisit: "2026-03-10" },
  { id: "cl19", name: "María José Soto", phone: "8888-0505", email: "mariajose@mail.com", tenant: "restaurant", createdAt: "2026-01-01", totalVisits: 8, lastVisit: "2026-03-08" },
  { id: "cl20", name: "Carlos Montero Jr.", phone: "8888-0606", email: "carlosm@mail.com", tenant: "restaurant", createdAt: "2026-02-01", totalVisits: 3, lastVisit: "2026-02-25" },
];

export const useClientStore = create<ClientStore>()(persist(
  (set, get) => ({
    clients: INITIAL_CLIENTS,

    addClient: (data) => {
      const id = `cl-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`;
      const client: Client = { ...data, id, createdAt: new Date().toISOString().slice(0, 10), totalVisits: 0 };
      set((s) => ({ clients: [...s.clients, client] }));
      return id;
    },

    updateClient: (id, data) => {
      set((s) => ({
        clients: s.clients.map((c) => (c.id === id ? { ...c, ...data } : c)),
      }));
    },

    deleteClient: (id) => {
      set((s) => ({ clients: s.clients.filter((c) => c.id !== id) }));
    },

    getByTenant: (tenantType) => {
      return get().clients.filter((c) => c.tenant === tenantType);
    },

    incrementVisits: (id) => {
      set((s) => ({
        clients: s.clients.map((c) =>
          c.id === id
            ? { ...c, totalVisits: c.totalVisits + 1, lastVisit: new Date().toISOString().slice(0, 10) }
            : c,
        ),
      }));
    },
  }),
  {
    name: "det-client-store",
    partialize: (state) => ({ clients: state.clients }),
  },
));
