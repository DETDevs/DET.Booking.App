interface Booking {
  name: string;
  service: string;
  date: string;
  time: string;
}

export const BookingPreviewCard = ({ booking }: { booking: Booking }) => (
  <div className="rounded-lg border bg-white p-4 shadow-sm space-y-1">
    <h3 className="font-medium">{booking.name}</h3>
    <p className="text-xs text-gray-500">{booking.service}</p>
    <p className="text-xs">
      <span className="font-medium">Date:</span> {booking.date}
    </p>
    <p className="text-xs">
      <span className="font-medium">Time:</span> {booking.time}
    </p>
    <div className="pt-2 flex gap-3">
      <button className="text-primary text-sm hover:underline">Accept Booking</button>
      <button className="text-gray-400 text-sm" disabled>Decline</button>
    </div>
  </div>
);
