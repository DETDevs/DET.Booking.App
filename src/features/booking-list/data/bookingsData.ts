
import type { Booking } from "@/shared/types/booking";


export const bookingsData: Booking[] = [
  {
    id: "1",
    patient: "Amanda Chavez",
    doctor: "Dr. Emily Johnson",
    service: "Fisioterapia",
    date: "2025-05-13",
    time: "11:00 - 12:00",
    status: "Pending",
  },
  {
    id: "2",
    patient: "Jasmine Palmer",
    doctor: "Dr. Carlos Martínez",
    service: "Terapia Ocupacional",
    date: "2025-05-14",
    time: "09:00 - 10:00",
    status: "Confirmed",
  },
  {
    id: "3",
    patient: "Randy Elliot",
    doctor: "Dra. Ana Pérez",
    service: "Psicología",
    date: "2025-05-14",
    time: "10:30 - 11:30",
    status: "Cancelled",
  },
];
