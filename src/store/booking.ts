import { create } from "zustand";

type Client = {
  name: string;
  idNumber: string;
  email: string;
  phone: string;
};

interface BookingState {
  service?: any;
  employee?: { id: string; name: string };
  date?: string;
  time?: string;
  petSize?: { idPrecio: number; label: string; price: number };

  client?: Client;
  isExistingClient: boolean;
  bookingId?: string;

  setService: (s: any | undefined) => void;
  setEmployee: (e: BookingState["employee"]) => void;
  setDateTime: (d: string, t: string) => void;
  setClient: (c: Client | undefined) => void;
  setExistingClient: (b: boolean) => void;
  setPetSize: (s: BookingState["petSize"]) => void;
  setBookingId: (id: string) => void;
  reset: (opts?: { keepClient?: boolean }) => void;
}

export const useBooking = create<BookingState>((set, get) => ({
  service: undefined,
  employee: undefined,
  date: undefined,
  time: undefined,
  client: undefined,
  isExistingClient: false,
  bookingId: undefined,
  petSize: undefined,

  setService: (service) => set({ service }),
  setEmployee: (employee) => set({ employee }),
  setDateTime: (date, time) => set({ date, time }),
  setClient: (client) => set({ client }),
  setExistingClient: (b) => set({ isExistingClient: b }),
  setPetSize: (petSize) => set({ petSize }),
  setBookingId: (bookingId) => set({ bookingId }),
  reset: (opts?: { keepClient?: boolean }) => {
    const { client, isExistingClient } = get();
    set({
      service: undefined,
      employee: undefined,
      date: undefined,
      time: undefined,
      petSize: undefined,
      bookingId: undefined,
      client: opts?.keepClient ? client : undefined,
      isExistingClient: opts?.keepClient ? isExistingClient : false,
    });
  },
}));
