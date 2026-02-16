import { Outlet } from "react-router-dom";
import { Sidebar, SidebarBody, SidebarLink } from "@/shared/ui/Sidebar";
import { Header } from "@/shared/ui/Header";
import { usePendingBookings } from "@/features/dashboard/hooks/usePendingBookings";
import { useTenant } from "@/entities/tenant/TenantContext";
import { resolveIcon } from "@/shared/lib/iconResolver";

function AdminLayout() {
  const { data: pending = 0 } = usePendingBookings();
  const tenant = useTenant();

  const navItems = tenant.navigation
    .filter((item) => {
      const feature = tenant.features[item.featureKey];
      return feature?.enabled !== false;
    })
    .map((item) => {
      const feature = tenant.features[item.featureKey];
      const Icon = resolveIcon(item.icon);
      return {
        href: item.path,
        icon: <Icon size={20} />,
        label: feature?.label ?? item.featureKey,
      };
    });

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <Sidebar animate>
        <SidebarBody>
          {navItems.map((link) => (
            <SidebarLink key={link.href} link={link} />
          ))}
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

export default AdminLayout;
