import { Outlet } from "react-router-dom";
import { Sidebar, SidebarBody, SidebarLink } from "@/shared/ui/Sidebar";
import { Header } from "@/shared/ui/Header";
import { useTenant } from "@/entities/tenant/TenantContext";
import { useAuth } from "@/entities/auth/AuthContext";
import { resolveIcon } from "@/shared/lib/iconResolver";
import { TenantSwitcher } from "@/shared/ui/TenantSwitcher";
import type { Role } from "@/entities/auth/AuthContext";
import { useSidebar } from "@/shared/ui/Sidebar";
import { motion } from "motion/react";
import { Plus } from "lucide-react";
import { useBookingStore } from "@/entities/booking/useBookingStore";
import { NewBookingModal } from "@/features/booking/components/NewBookingModal";

const ROLE_NAV_ACCESS: Record<Role, string[]> = {
  admin: [],
  receptionist: [
    "dashboard",
    "bookings",
    "calendar",
    "patients",
    "profile",
    "notifications",
  ],
  staff: ["dashboard", "bookings", "calendar", "profile"],
};

// Items to EXCLUDE from sidebar (now handled via modal)
const HIDDEN_NAV_KEYS = new Set(["newBooking"]);

interface NavItem {
  href: string;
  icon: React.JSX.Element;
  label: string;
  group?: string;
}

function SidebarLogo() {
  const tenant = useTenant();
  const { open } = useSidebar();
  const primaryColor = tenant.branding?.primaryColor ?? "#6366f1";

  return (
    <div className="flex items-center gap-3 px-1 mb-6 mt-1">
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-[11px] font-bold shrink-0"
        style={{ backgroundColor: primaryColor }}
      >
        {tenant.name.slice(0, 2).toUpperCase()}
      </div>
      <motion.span
        animate={{ opacity: open ? 1 : 0, display: open ? "block" : "none" }}
        className="text-sm font-bold text-gray-900 dark:text-white truncate"
      >
        {tenant.name}
      </motion.span>
    </div>
  );
}

function SidebarGroupLabel({ label }: { label: string }) {
  const { open } = useSidebar();
  return (
    <motion.div
      animate={{ opacity: open ? 1 : 0, height: open ? "auto" : 0 }}
      className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 dark:text-neutral-500 px-2 pt-4 pb-1.5 overflow-hidden"
    >
      {label}
    </motion.div>
  );
}

function AdminLayout() {
  const tenant = useTenant();
  const { role } = useAuth();
  const isDark = tenant.branding?.theme === "dark";
  const primaryColor = tenant.branding?.primaryColor ?? "#6366f1";

  // Connect pending count to Zustand store
  const pendingCount = useBookingStore((s) => s.getPendingCount());
  const openNewBooking = useBookingStore((s) => s.openNewBooking);

  const allowedKeys = ROLE_NAV_ACCESS[role];

  const navItems: NavItem[] = tenant.navigation
    .filter((item) => {
      // Hide items that are now handled via modal
      if (HIDDEN_NAV_KEYS.has(item.featureKey)) return false;
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
        group: item.group,
      };
    });

  // Group items by group
  const groups: { label: string; items: NavItem[] }[] = [];
  let currentGroup = "";
  for (const item of navItems) {
    const g = item.group ?? "";
    if (g !== currentGroup) {
      groups.push({ label: g, items: [] });
      currentGroup = g;
    }
    groups[groups.length - 1].items.push(item);
  }

  return (
    <div
      className={`flex flex-col md:flex-row h-screen ${isDark ? "dark" : ""}`}
    >
      <Sidebar animate>
        <SidebarBody>
          <SidebarLogo />
          {groups.map((group) => (
            <div key={group.label}>
              {group.label && <SidebarGroupLabel label={group.label} />}
              {group.items.map((link) => (
                <SidebarLink
                  key={link.href}
                  link={link}
                  activeColor={primaryColor}
                />
              ))}
            </div>
          ))}
        </SidebarBody>
      </Sidebar>

      <div className="flex flex-col flex-1 overflow-hidden">
        <Header pendingBookings={pendingCount} />
        <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-neutral-900 p-6 transition-colors duration-300">
          <Outlet />
        </main>
      </div>

      {/* Global FAB to open New Booking Modal */}
      <button
        onClick={openNewBooking}
        className="fixed bottom-6 left-6 z-40 w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-white transition-all hover:scale-110 hover:shadow-xl active:scale-95 cursor-pointer"
        style={{ backgroundColor: primaryColor }}
        aria-label="Nueva reserva"
      >
        <Plus size={24} strokeWidth={2.5} />
      </button>

      {/* Global NewBookingModal — accessible from any view */}
      <NewBookingModal />

      <TenantSwitcher />
    </div>
  );
}

export default AdminLayout;
