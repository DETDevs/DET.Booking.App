import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface ServiceItem {
  id: string;
  name: string;
  duration: number; // minutes
  price: number; // in C$
  staffIds: string[]; // which staff can perform this service
  active: boolean;
  tenant: string; // barbershop | clinic | grooming | restaurant
}

export interface BusinessHours {
  day: string;
  open: string; // "07:00"
  close: string; // "20:00"
  active: boolean;
}

export interface TenantSettings {
  tenant: string;
  businessName: string;
  currency: string;
  timezone: string;
  businessHours: BusinessHours[];
  slotInterval: number; // minutes (30)
  maxAdvanceDays: number; // how far ahead bookings can be made
  allowCancellation: boolean;
  cancellationMinHours: number;
  autoConfirm: boolean; // from frontend: auto-confirm or require manual
}

interface SettingsStore {
  services: ServiceItem[];
  settings: TenantSettings[];

  addService: (data: Omit<ServiceItem, "id">) => string;
  updateService: (id: string, data: Partial<ServiceItem>) => void;
  deleteService: (id: string) => void;
  toggleService: (id: string) => void;
  getServicesByTenant: (tenantType: string) => ServiceItem[];

  updateSettings: (tenant: string, data: Partial<TenantSettings>) => void;
  getSettings: (tenant: string) => TenantSettings | undefined;
  getBusinessHours: (tenant: string) => { open: number; close: number };
}

const defaultHours = (open: string, close: string): BusinessHours[] => [
  { day: "Lunes", open, close, active: true },
  { day: "Martes", open, close, active: true },
  { day: "Miércoles", open, close, active: true },
  { day: "Jueves", open, close, active: true },
  { day: "Viernes", open, close, active: true },
  { day: "Sábado", open, close: "14:00", active: true },
  { day: "Domingo", open: "00:00", close: "00:00", active: false },
];

const INITIAL_SERVICES: ServiceItem[] = [
  { id: "sv1", name: "Corte clásico", duration: 30, price: 5000, staffIds: ["st1", "st2"], active: true, tenant: "barbershop" },
  { id: "sv2", name: "Fade", duration: 30, price: 6000, staffIds: ["st1", "st3"], active: true, tenant: "barbershop" },
  { id: "sv3", name: "Barba", duration: 20, price: 3000, staffIds: ["st2", "st3"], active: true, tenant: "barbershop" },
  { id: "sv4", name: "Corte + Barba", duration: 45, price: 8000, staffIds: ["st1", "st2", "st3"], active: true, tenant: "barbershop" },
  { id: "sv5", name: "Tinte", duration: 60, price: 12000, staffIds: ["st1"], active: true, tenant: "barbershop" },
  { id: "sv6", name: "Tratamiento capilar", duration: 40, price: 10000, staffIds: ["st2"], active: false, tenant: "barbershop" },
  { id: "sv7", name: "Consulta General", duration: 30, price: 25000, staffIds: ["st4"], active: true, tenant: "clinic" },
  { id: "sv8", name: "Fisioterapia", duration: 60, price: 35000, staffIds: ["st5"], active: true, tenant: "clinic" },
  { id: "sv9", name: "Pediatría", duration: 30, price: 30000, staffIds: ["st6"], active: true, tenant: "clinic" },
  { id: "sv10", name: "Psicología", duration: 50, price: 40000, staffIds: ["st4"], active: true, tenant: "clinic" },
  { id: "sv11", name: "Dermatología", duration: 30, price: 28000, staffIds: ["st5"], active: true, tenant: "clinic" },
  { id: "sv12", name: "Nutrición", duration: 40, price: 22000, staffIds: ["st6"], active: true, tenant: "clinic" },
  { id: "sv13", name: "Dog Full Grooming", duration: 90, price: 15000, staffIds: ["st7", "st8"], active: true, tenant: "grooming" },
  { id: "sv14", name: "Dog Bath Services", duration: 60, price: 8000, staffIds: ["st8"], active: true, tenant: "grooming" },
  { id: "sv15", name: "Cat Grooming", duration: 60, price: 12000, staffIds: ["st9"], active: true, tenant: "grooming" },
  { id: "sv16", name: "Treatments", duration: 45, price: 10000, staffIds: ["st7"], active: true, tenant: "grooming" },
  { id: "sv17", name: "Mesa Interior (2-4)", duration: 120, price: 0, staffIds: ["st10"], active: true, tenant: "restaurant" },
  { id: "sv18", name: "Mesa VIP (6-10)", duration: 150, price: 5000, staffIds: ["st11"], active: true, tenant: "restaurant" },
  { id: "sv19", name: "Terraza (2-4)", duration: 120, price: 0, staffIds: ["st12"], active: true, tenant: "restaurant" },
];

const INITIAL_SETTINGS: TenantSettings[] = [
  {
    tenant: "barbershop",
    businessName: "BarberKing Studio",
    currency: "C$",
    timezone: "America/Managua",
    businessHours: defaultHours("08:00", "18:00"),
    slotInterval: 30,
    maxAdvanceDays: 30,
    allowCancellation: true,
    cancellationMinHours: 2,
    autoConfirm: false,
  },
  {
    tenant: "clinic",
    businessName: "Clínica Vida Sana",
    currency: "C$",
    timezone: "America/Managua",
    businessHours: defaultHours("07:00", "17:00"),
    slotInterval: 30,
    maxAdvanceDays: 60,
    allowCancellation: true,
    cancellationMinHours: 24,
    autoConfirm: false,
  },
  {
    tenant: "grooming",
    businessName: "MoPetCo Grooming",
    currency: "C$",
    timezone: "America/Managua",
    businessHours: defaultHours("08:00", "17:00"),
    slotInterval: 30,
    maxAdvanceDays: 14,
    allowCancellation: true,
    cancellationMinHours: 4,
    autoConfirm: true,
  },
  {
    tenant: "restaurant",
    businessName: "La Mesa Dorada",
    currency: "C$",
    timezone: "America/Managua",
    businessHours: defaultHours("11:00", "22:00"),
    slotInterval: 30,
    maxAdvanceDays: 30,
    allowCancellation: true,
    cancellationMinHours: 1,
    autoConfirm: false,
  },
];

export const useSettingsStore = create<SettingsStore>()(persist(
  (set, get) => ({
    services: INITIAL_SERVICES,
    settings: INITIAL_SETTINGS,

    addService: (data) => {
      const id = `sv-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`;
      const service: ServiceItem = { ...data, id };
      set((s) => ({ services: [...s.services, service] }));
      return id;
    },

    updateService: (id, data) => {
      set((s) => ({
        services: s.services.map((sv) => (sv.id === id ? { ...sv, ...data } : sv)),
      }));
    },

    deleteService: (id) => {
      set((s) => ({ services: s.services.filter((sv) => sv.id !== id) }));
    },

    toggleService: (id) => {
      set((s) => ({
        services: s.services.map((sv) =>
          sv.id === id ? { ...sv, active: !sv.active } : sv,
        ),
      }));
    },

    getServicesByTenant: (tenantType) => {
      return get().services.filter((sv) => sv.tenant === tenantType);
    },

    updateSettings: (tenant, data) => {
      set((s) => ({
        settings: s.settings.map((ts) =>
          ts.tenant === tenant ? { ...ts, ...data } : ts,
        ),
      }));
    },

    getSettings: (tenant) => {
      return get().settings.find((ts) => ts.tenant === tenant);
    },

    getBusinessHours: (tenant) => {
      const ts = get().settings.find((s) => s.tenant === tenant);
      if (!ts) return { open: 7, close: 20 };
      const activeDay = ts.businessHours.find((d) => d.active);
      if (!activeDay) return { open: 7, close: 20 };
      const [oh, om] = activeDay.open.split(":").map(Number);
      const [ch, cm] = activeDay.close.split(":").map(Number);
      return { open: oh + om / 60, close: ch + cm / 60 };
    },
  }),
  {
    name: "det-settings-store",
    partialize: (state) => ({
      services: state.services,
      settings: state.settings,
    }),
  },
));
