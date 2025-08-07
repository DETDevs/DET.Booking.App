export interface Usuario {
  id: string;
  name: string;
  email: string;
  date: string;
  time: string;
  status: string;
}

export const usuarioData: Usuario[] = [
  {
    id: "1",
    name: "Amanda Chavez",
    email: "amanda@gmail.com",
    date: "2025-05-13",
    time: "11:00 - 12:00",
    status: "Pending",
  },
  {
    id: "2",
    name: "Jasmine Palmer",
    email: "Martinez@gmail.com",
    date: "2025-05-14",
    time: "09:00 - 10:00",
    status: "Confirmed",
  },
  {
    id: "3",
    name: "Randy Elliot",
    email: "perez@gmail.com",
    date: "2025-05-14",
    time: "10:30 - 11:30",
    status: "Cancelled",
  },
];
