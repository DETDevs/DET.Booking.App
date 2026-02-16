import { Outlet } from "react-router-dom";
import { Sidebar, SidebarBody, SidebarLink } from "@/shared/ui/Sidebar";
import { Header } from "@/shared/ui/Header";
import { usePendingBookings } from "@/features/dashboard/hooks/usePendingBookings";
import { useTenant } from "@/entities/tenant/TenantContext";
import { useAuth } from "@/entities/auth/AuthContext";
import { resolveIcon } from "@/shared/lib/iconResolver";
import { TenantSwitcher } from "@/shared/ui/TenantSwitcher";
import type { Role } from "@/entities/auth/AuthContext";

const ROLE_NAV_ACCESS: Record<Role, string[]> = {
  admin: [],
  receptionist: [
    "dashboard",
    "bookings",
    "newBooking",
    "calendar",
    "patients",
    "profile",
  ],
  staff: ["dashboard", "bookings", "calendar", "profile"],
};

function AdminLayout() {
  const { data: pending = 0 } = usePendingBookings();
  const tenant = useTenant();
  const { role } = useAuth();
  const isDark = tenant.branding?.theme === "dark";
  const primaryColor = tenant.branding?.primaryColor ?? "#6366f1";

  const allowedKeys = ROLE_NAV_ACCESS[role];

  const navItems = tenant.navigation
    .filter((item) => {
      const feature = tenant.features[item.featureKey];
      if (feature?.enabled === false) return false;
      if (allowedKeys.length > 0 && !allowedKeys.includes(item.featureKey))
        return false;
      return true;
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
    <div
      className={`flex flex-col md:flex-row h-screen ${isDark ? "dark" : ""}`}
    >
      <Sidebar animate>
        <SidebarBody>
          {navItems.map((link) => (
            <SidebarLink
              key={link.href}
              link={link}
              activeColor={primaryColor}
            />
          ))}
        </SidebarBody>
      </Sidebar>

      <div className="flex flex-col flex-1 overflow-hidden">
        <Header pendingBookings={pending} />
        <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-neutral-900 p-6 transition-colors duration-300">
          <Outlet />
        </main>
      </div>
      <TenantSwitcher />
    </div>
  );
}

export default AdminLayout;
