export interface BookingRequest {
  serviceId:  string;
  employeeId: string;
  date:       string;   
  time:       string;   
  client: {
    name:     string;
    idNumber: string;
    email:    string;
    phone:    string;
  };
}

export interface BookingResponse {
  id: string;
}

export const createBooking = async (
  body: BookingRequest,
): Promise<BookingResponse> => {
  console.log("⤴️  Simulando POST /api/bookings →", body);
  await new Promise((r) => setTimeout(r, 800));
  return { id: crypto.randomUUID() };
};
