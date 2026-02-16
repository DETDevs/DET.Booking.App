import { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ChevronDown, LogOut, User, Settings } from "lucide-react";
import { useTenant } from "@/entities/tenant/TenantContext";
import { useAuth } from "@/entities/auth/AuthContext";

export const UserMenu = () => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const tenant = useTenant();
  const { logout } = useAuth();

  const profileLabel = tenant.features.profile?.label ?? "Profile";
  const settingsLabel = tenant.features.settings?.label ?? "Settings";

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const handleLogout = () => {
    setOpen(false);
    logout();
    navigate("/login");
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 px-3 py-1 rounded hover:bg-gray-100 dark:hover:bg-neutral-700 cursor-pointer transition-colors"
      >
        <img
          src="https://fydn.imgix.net/m%2Fgen%2Fart-print-square-p1%2Fd338a134-22d3-47a5-a120-c0c6858d4ee6.jpg?auto=format%2Ccompress&q=75"
          alt="avatar"
          className="h-8 w-8 rounded-full object-cover"
        />
        <div className="hidden sm:flex flex-col text-left leading-tight">
          <span className="text-sm font-medium text-gray-900 dark:text-neutral-100">
            Edwin T
          </span>
          <span className="text-xs text-gray-500 dark:text-neutral-400">
            Admin
          </span>
        </div>
        <ChevronDown
          size={16}
          className="text-gray-500 dark:text-neutral-400"
        />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-xl shadow-lg z-10 py-1">
          <Link
            to="/profile"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-neutral-300 hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors"
          >
            <User size={16} className="text-gray-400 dark:text-neutral-500" />
            {profileLabel}
          </Link>
          <Link
            to="/settings"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-neutral-300 hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors"
          >
            <Settings
              size={16}
              className="text-gray-400 dark:text-neutral-500"
            />
            {settingsLabel}
          </Link>
          <hr className="my-1 border-gray-100 dark:border-neutral-700" />
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors cursor-pointer"
          >
            <LogOut size={16} />
            Cerrar sesión
          </button>
        </div>
      )}
    </div>
  );
};
