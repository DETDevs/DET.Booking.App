
export interface Customer {
  id: string;
  name: string;
  email: string;
  service: string;
  date: string;      
  time: string;      
  status: string;    
}

export const customerData: Customer[] = [
  {
    id: "1",
    name: "Amanda Chavez",
    email: "amanda@gmail.com",
    service: "Fisioterapia",
    date: "2025-05-13",
    time: "11:00 - 12:00",
    status: "Pending",    
  },
  {
    id: "2",
    name: "Jasmine Palmer",
    email: "Martinez@gmail.com",
    service: "Terapia Ocupacional",
    date: "2025-05-14",
    time: "09:00 - 10:00",
    status: "Confirmed",   
  },
  {
    id: "3",
    name: "Randy Elliot",
    email: "perez@gmail.com",
    service: "Psicología",
    date: "2025-05-14",
    time: "10:30 - 11:30",
    status: "Cancelled",   
  },
];
