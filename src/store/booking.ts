import { create } from "zustand";
import type { UIService } from "../features/makebook/types/Servicio"; 

interface BookingState {
  service?: UIService;
  employee?: { id: string; name: string };
  date?: string;
  time?: string;
  petSize?: { idPrecio: number; label: string; price: number };
  client?: {
    name: string;
    idNumber: string;
    email: string;
    phone: string;
  };
  bookingId?: string;

  setService:   (s: UIService | undefined)  => void;
  setEmployee:  (e: BookingState["employee"]) => void;
  setDateTime:  (d: string, t: string)        => void;
  setClient:    (c: BookingState["client"])   => void;
  setPetSize:   (s: BookingState["petSize"]) => void;
  setBookingId: (id: string)                  => void;  
  reset:        () => void;
}

export const useBooking = create<BookingState>((set) => ({
  service: undefined,
  employee: undefined,
  date: undefined,
  time: undefined,
  client: undefined,
  bookingId: undefined,
  petSize: undefined,

  setPetSize:   (petSize)    => set({ petSize }),
  setService:   (service)    => set({ service }),
  setEmployee:  (employee)   => set({ employee }),
  setDateTime:  (date, time) => set({ date, time }),
  setClient:    (client)     => set({ client }),
  setBookingId: (bookingId)  => set({ bookingId }),     
  reset: () =>
    set({
      service: undefined,
      employee: undefined,
      date: undefined,
      time: undefined,
      client: undefined,
      bookingId: undefined,
      petSize: undefined,
    }),
}));