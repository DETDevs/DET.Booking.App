import { NotificationIndicator } from "./NotificationIndicator";
import { Search } from "lucide-react";
import { UserMenu } from "./UserMenu";

interface HeaderProps { pendingBookings?: number }

export const Header = ({ pendingBookings = 0 }: HeaderProps) => (
  <header className="flex items-center h-14 px-4 bg-white border-b">
    <div className="relative flex-1 max-w-sm">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16}/>
      <input type="search" placeholder="Search"
             className="w-full pl-9 pr-3 py-2 rounded-md border bg-gray-50"/>
    </div>
    <div className="flex items-center gap-2 ml-auto">
      <NotificationIndicator count={pendingBookings}/>
      <UserMenu />
    </div>
  </header>
);
