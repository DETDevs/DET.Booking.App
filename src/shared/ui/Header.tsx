import { NotificationIndicator } from "./NotificationIndicator";
import { Search } from "lucide-react";
import { UserMenu } from "./UserMenu";
import { useTenant } from "@/entities/tenant/TenantContext";

interface HeaderProps {
  pendingBookings: number;
}

export const Header = ({ pendingBookings }: HeaderProps) => {
  const tenant = useTenant();

  return (
    <header className="flex items-center justify-between px-6 py-3 bg-white border-b">
      <div className="flex items-center gap-4">
        <span className="text-sm font-semibold text-gray-700">
          {tenant.name}
        </span>
        <div className="relative">
          <Search
            size={16}
            className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            placeholder="Search"
            className="pl-8 pr-3 py-1.5 text-sm rounded-md bg-gray-100 border-none outline-none"
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
