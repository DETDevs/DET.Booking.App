import { Bell } from "lucide-react";

export const NotificationIndicator = ({ count = 0 }: { count?: number }) => (
  <div className="relative ml-2 md:m-0">
    <Bell size={20} />
    {count > 0 && (
      <span className="absolute -top-1 -right-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white text-xs">
        {count}
      </span>
    )}
  </div>
);
