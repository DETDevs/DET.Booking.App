export interface Booking {
    id: string;
    patient: string;
    doctor: string;
    service: string;
    date: string;
    time: string;
    status: string;
}

export type BookingStatus = "Pending" | "Confirmed" | "Cancelled";
