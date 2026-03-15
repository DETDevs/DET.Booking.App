import { Link } from "react-router-dom";
import { Bell } from "lucide-react";

export const NotificationIndicator = ({ count = 0 }: { count?: number }) => (
  <Link
    to="/notifications"
    className="relative ml-2 md:m-0 p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-700 transition-colors"
    aria-label={`Notificaciones${count > 0 ? ` (${count} pendientes)` : ""}`}
  >
    <Bell size={20} className="text-gray-600 dark:text-neutral-400" />
    {count > 0 && (
      <span className="absolute -top-0.5 -right-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white text-xs animate-pulse">
        {count}
      </span>
    )}
  </Link>
);
