import { NotificationIndicator } from "./NotificationIndicator";
import { Search } from "lucide-react";
import { UserMenu } from "./UserMenu";
import { useTenant } from "@/entities/tenant/TenantContext";

interface HeaderProps {
  pendingBookings: number;
}

export const Header = ({ pendingBookings }: HeaderProps) => {
  const tenant = useTenant();
  const primaryColor = tenant.branding?.primaryColor ?? "#6366f1";

  return (
    <header className="flex items-center justify-between px-6 py-3 bg-white dark:bg-neutral-800 border-b border-gray-200 dark:border-neutral-700 transition-colors duration-300">
      <div className="flex items-center gap-4">
        <span
          className="text-sm font-bold tracking-wide"
          style={{ color: primaryColor }}
        >
          {tenant.name}
        </span>
        <div className="relative">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-neutral-500"
          />
          <input
            placeholder="Buscar..."
            className="pl-9 pr-4 py-2 text-sm rounded-lg bg-gray-100 dark:bg-neutral-700 dark:text-neutral-200 border-none outline-none focus:ring-2 transition-all"
            style={{ "--tw-ring-color": primaryColor } as React.CSSProperties}
          />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <NotificationIndicator count={pendingBookings} />
        <UserMenu />
      </div>
    </header>
  );
};
