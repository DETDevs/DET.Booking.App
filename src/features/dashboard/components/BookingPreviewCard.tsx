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
  labels: _labels = {
    name: "Client",
    service: "Service",
    date: "Date",
    time: "Time",
  },
  actions = { accept: "Accept", decline: "Decline" },
}: Props) => (
  <div className="rounded-2xl border border-gray-100 dark:border-neutral-700 bg-white dark:bg-neutral-800 p-5 shadow-sm hover:shadow-md transition-all duration-300 space-y-2">
    <div className="flex items-center justify-between">
      <h3 className="font-semibold text-gray-900 dark:text-white">
        {booking.name}
      </h3>
      <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-neutral-700 text-gray-500 dark:text-neutral-400">
        {booking.service}
      </span>
    </div>
    <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-neutral-400">
      <span>📅 {booking.date}</span>
      <span>🕐 {booking.time}</span>
    </div>
    <div className="pt-1 flex gap-3">
      <button className="text-primary dark:text-blue-400 text-sm font-medium hover:underline cursor-pointer">
        {actions.accept}
      </button>
      <button className="text-gray-400 dark:text-neutral-500 text-sm cursor-pointer hover:text-gray-600 dark:hover:text-neutral-300 transition-colors">
        {actions.decline}
      </button>
    </div>
  </div>
);
