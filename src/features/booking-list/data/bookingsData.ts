
export interface Booking {
  id: string;
  patient: string;
  doctor: string;
  service: string;
  date: string;      // ISO yyyy-MM-dd
  time: string;      // e.g. "11:00 - 12:00"
  status: string;    // Debe coincidir exactamente con los valores del filtro
}

export const bookingsData: Booking[] = [
  {
    id: "1",
    patient: "Amanda Chavez",
    doctor: "Dr. Emily Johnson",
    service: "Fisioterapia",
    date: "2025-05-13",
    time: "11:00 - 12:00",
    status: "Pending",     // coincidente con <MenuItem value="Pending">
  },
  {
    id: "2",
    patient: "Jasmine Palmer",
    doctor: "Dr. Carlos Martínez",
    service: "Terapia Ocupacional",
    date: "2025-05-14",
    time: "09:00 - 10:00",
    status: "Confirmed",   // coincidente con <MenuItem value="Confirmed">
  },
  {
    id: "3",
    patient: "Randy Elliot",
    doctor: "Dra. Ana Pérez",
    service: "Psicología",
    date: "2025-05-14",
    time: "10:30 - 11:30",
    status: "Cancelled",   // coincidente con <MenuItem value="Cancelled">
  },
  // … añade más citas según necesites …
];
