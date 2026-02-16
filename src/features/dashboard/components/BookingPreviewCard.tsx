interface Booking {
  name: string;
  service: string;
  date: string;
  time: string;
}

interface Labels {
  name: string;
  service: string;
  date: string;
  time: string;
}

interface Actions {
  accept: string;
  decline: string;
}

interface Props {
  booking: Booking;
  labels?: Labels;
  actions?: Actions;
}

export const BookingPreviewCard = ({
  booking,
  labels = { name: "Client", service: "Service", date: "Date", time: "Time" },
  actions = { accept: "Accept", decline: "Decline" },
}: Props) => (
  <div className="rounded-lg border bg-white p-4 shadow-sm space-y-1">
    <h3 className="font-medium">{booking.name}</h3>
    <p className="text-xs text-gray-500">{booking.service}</p>
    <p className="text-xs">
      <span className="font-medium">{labels.date}:</span> {booking.date}
    </p>
    <p className="text-xs">
      <span className="font-medium">{labels.time}:</span> {booking.time}
    </p>
    <div className="pt-2 flex gap-3">
      <button className="text-primary text-sm hover:underline cursor-pointer">
        {actions.accept}
      </button>
      <button className="text-gray-400 text-sm cursor-pointer">
        {actions.decline}
      </button>
    </div>
  </div>
);
