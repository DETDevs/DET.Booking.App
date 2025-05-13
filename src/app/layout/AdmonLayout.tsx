import { Outlet } from "react-router-dom";
import { Sidebar, SidebarBody, SidebarLink } from "@/shared/ui/Sidebar";
import { Header } from "@/shared/ui/Header";
import { usePendingBookings } from "@/features/dashboard/hooks/usePendingBookings";
import { Home, Calendar, Settings } from "lucide-react";

export function AdminLayout() {
  const { data: pending = 0 } = usePendingBookings();

  return (
     <div className="flex flex-col md:flex-row h-screen">
      <Sidebar animate>
        <SidebarBody>
          <SidebarLink link={{ href: "/",          icon: <Home size={20} />,     label: "Dashboard" }} />
          <SidebarLink link={{ href: "/bookings",  icon: <Calendar size={20} />, label: "Bookings"  }} />
          <SidebarLink link={{ href: "/settings",  icon: <Settings size={20} />, label: "Settings"  }} />
        </SidebarBody>
      </Sidebar>

      <div className="flex flex-col flex-1 overflow-hidden">
        <Header pendingBookings={pending} />
        <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
