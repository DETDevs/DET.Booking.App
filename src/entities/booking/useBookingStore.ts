import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useStaffStore } from "@/entities/staff/useStaffStore";
import { useSettingsStore } from "@/entities/settings/useSettingsStore";

export type ReservationStatus =
  | "Pending"
  | "Confirmed"
  | "InProgress"
  | "Completed"
  | "Cancelled";

export interface Reservation {
  id: string;
  clientName: string;
  staffId: string;
  serviceId: string;
  date: string; // YYYY-MM-DD
  startHour: number; // 0-23 (supports .5 for 30-min slots)
  endHour: number;
  status: ReservationStatus;
  createdAt: string;
  notes?: string;
  tenant: string; // which tenant this belongs to
}

interface BookingStore {
  reservations: Reservation[];
  isNewBookingOpen: boolean;
  openNewBooking: () => void;
  closeNewBooking: () => void;

  addReservation: (reservation: Omit<Reservation, "id" | "createdAt">) => string;
  cancelReservation: (id: string) => void;
  updateReservationStatus: (id: string, status: ReservationStatus) => void;
  deleteReservation: (id: string) => void;

  getAvailableSlots: (
    date: string,
    staffId: string,
    serviceDurationMinutes: number,
    tenantType: string,
  ) => number[];

  getPendingCount: () => number;
  getByTenant: (tenantType: string) => Reservation[];
}

export function localDateStr(d: Date = new Date()): string {
  const y = d.getFullYear();
  const m = (d.getMonth() + 1).toString().padStart(2, "0");
  const day = d.getDate().toString().padStart(2, "0");
  return `${y}-${m}-${day}`;
}

const today = localDateStr();

const INITIAL_RESERVATIONS: Reservation[] = [
  { id: "r1", clientName: "Carlos Rivera", staffId: "st1", serviceId: "sv2", date: today, startHour: 10, endHour: 11, status: "Confirmed", createdAt: "2026-02-14T10:00:00Z", tenant: "barbershop" },
  { id: "r2", clientName: "Andrés Mora", staffId: "st2", serviceId: "sv4", date: today, startHour: 11, endHour: 12, status: "Pending", createdAt: "2026-02-14T11:00:00Z", tenant: "barbershop" },
  { id: "r3", clientName: "Kevin Soto", staffId: "st3", serviceId: "sv2", date: today, startHour: 14, endHour: 15, status: "Confirmed", createdAt: "2026-02-14T12:00:00Z", tenant: "barbershop" },
  { id: "r4", clientName: "Luis Hernández", staffId: "st1", serviceId: "sv5", date: today, startHour: 9, endHour: 10, status: "Completed", createdAt: "2026-02-14T13:00:00Z", tenant: "barbershop" },
  { id: "r5", clientName: "Diego Vargas", staffId: "st2", serviceId: "sv1", date: today, startHour: 8, endHour: 9, status: "Completed", createdAt: "2026-02-14T14:00:00Z", tenant: "barbershop" },
  { id: "r6", clientName: "Pablo Castillo", staffId: "st3", serviceId: "sv3", date: today, startHour: 10, endHour: 11, status: "InProgress", createdAt: "2026-02-14T15:00:00Z", tenant: "barbershop" },
  { id: "r7", clientName: "Amanda Chavez", staffId: "st5", serviceId: "sv8", date: today, startHour: 9, endHour: 10, status: "Completed", createdAt: "2026-02-14T10:00:00Z", tenant: "clinic" },
  { id: "r8", clientName: "Jasmine Palmer", staffId: "st6", serviceId: "sv9", date: today, startHour: 9.5, endHour: 10.5, status: "Completed", createdAt: "2026-02-14T11:00:00Z", tenant: "clinic" },
  { id: "r9", clientName: "Randy Elliot", staffId: "st4", serviceId: "sv10", date: today, startHour: 10, endHour: 11, status: "InProgress", createdAt: "2026-02-14T12:00:00Z", tenant: "clinic" },
  { id: "r10", clientName: "Christine Powell", staffId: "st5", serviceId: "sv11", date: today, startHour: 11, endHour: 12, status: "InProgress", createdAt: "2026-02-14T13:00:00Z", tenant: "clinic" },
  { id: "r11", clientName: "María López", staffId: "st4", serviceId: "sv7", date: today, startHour: 14, endHour: 15, status: "Confirmed", createdAt: "2026-02-14T14:00:00Z", tenant: "clinic" },
  { id: "r12", clientName: "Laura Soto", staffId: "st6", serviceId: "sv12", date: today, startHour: 15, endHour: 16, status: "Pending", createdAt: "2026-02-14T15:00:00Z", tenant: "clinic" },
  { id: "r13", clientName: "Sarah Thompson (Buddy)", staffId: "st7", serviceId: "sv13", date: today, startHour: 9, endHour: 10.5, status: "Completed", createdAt: "2026-02-14T10:00:00Z", tenant: "grooming" },
  { id: "r14", clientName: "Juan Pérez (Kralos)", staffId: "st8", serviceId: "sv14", date: today, startHour: 10, endHour: 11, status: "InProgress", createdAt: "2026-02-14T11:00:00Z", tenant: "grooming" },
  { id: "r15", clientName: "Emily García (Mishi)", staffId: "st9", serviceId: "sv15", date: today, startHour: 11, endHour: 12, status: "Confirmed", createdAt: "2026-02-14T12:00:00Z", tenant: "grooming" },
  { id: "r16", clientName: "Carlos Rodríguez (Max)", staffId: "st7", serviceId: "sv16", date: today, startHour: 14, endHour: 15, status: "Pending", createdAt: "2026-02-14T13:00:00Z", tenant: "grooming" },
  { id: "r17", clientName: "Isabel Quesada", staffId: "st10", serviceId: "sv17", date: today, startHour: 12, endHour: 14, status: "Confirmed", createdAt: "2026-02-14T10:00:00Z", tenant: "restaurant" },
  { id: "r18", clientName: "Roberto Arias", staffId: "st11", serviceId: "sv18", date: today, startHour: 19, endHour: 21, status: "Pending", createdAt: "2026-02-14T11:00:00Z", tenant: "restaurant" },
  { id: "r19", clientName: "María José Soto", staffId: "st12", serviceId: "sv19", date: today, startHour: 13, endHour: 15, status: "Confirmed", createdAt: "2026-02-14T12:00:00Z", tenant: "restaurant" },
  { id: "r20", clientName: "Carlos Montero Jr.", staffId: "st10", serviceId: "sv17", date: today, startHour: 19, endHour: 21, status: "Confirmed", createdAt: "2026-02-14T13:00:00Z", tenant: "restaurant" },
];

// ─── Store creation ───────────────────────────────────────────────
export const useBookingStore = create<BookingStore>()(persist(
  (set, get) => ({
    reservations: INITIAL_RESERVATIONS,

    isNewBookingOpen: false,
    openNewBooking: () => set({ isNewBookingOpen: true }),
    closeNewBooking: () => set({ isNewBookingOpen: false }),

    addReservation: (data) => {
      const id = `r-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      const newReservation: Reservation = {
        ...data,
        id,
        createdAt: new Date().toISOString(),
      };
      set((state) => ({
        reservations: [...state.reservations, newReservation],
      }));
      return id;
    },

    cancelReservation: (id) => {
      set((state) => ({
        reservations: state.reservations.map((r) =>
          r.id === id ? { ...r, status: "Cancelled" as const } : r,
        ),
      }));
    },

    updateReservationStatus: (id, status) => {
      set((state) => ({
        reservations: state.reservations.map((r) =>
          r.id === id ? { ...r, status } : r,
        ),
      }));
    },

    deleteReservation: (id) => {
      set((state) => ({
        reservations: state.reservations.filter((r) => r.id !== id),
      }));
    },

    getAvailableSlots: (date, staffId, serviceDurationMinutes, tenantType) => {
      const { reservations } = get();
      const { open: businessOpen, close: businessClose } =
        useSettingsStore.getState().getBusinessHours(tenantType);

      const conflicts = reservations.filter(
        (r) =>
          r.date === date &&
          r.staffId === staffId &&
          r.status !== "Cancelled",
      );

      const durationHours = Math.ceil(serviceDurationMinutes / 30) * 0.5;

      const slots: number[] = [];
      for (let h = businessOpen; h + durationHours <= businessClose; h += 0.5) {
        const candidateEnd = h + durationHours;

        const hasConflict = conflicts.some(
          (r) => h < r.endHour && candidateEnd > r.startHour,
        );

        if (!hasConflict) {
          slots.push(h);
        }
      }

      return slots;
    },

    getPendingCount: () => {
      return get().reservations.filter((r) => r.status === "Pending").length;
    },

    getByTenant: (tenantType) => {
      const tenantStaffIds = new Set(
        useStaffStore.getState().staff
          .filter((s) => s.role === tenantType)
          .map((s) => s.id),
      );
      return get().reservations.filter(
        (r) => r.tenant === tenantType || tenantStaffIds.has(r.staffId),
      );
    },
  }),
  {
    name: "det-booking-store",
    partialize: (state) => ({ reservations: state.reservations }),
  },
));

export function formatHour(h: number): string {
  const hours = Math.floor(h);
  const minutes = (h % 1) * 60;
  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
}
