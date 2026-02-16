import { useTenant } from "@/entities/tenant/TenantContext";
import { useAuth } from "@/entities/auth/AuthContext";
import { useNavigate } from "react-router-dom";
import { Camera, Mail, Phone, Shield, Key, LogOut } from "lucide-react";

const ProfilePage = () => {
  const tenant = useTenant();
  const { logout, userName, role } = useAuth();
  const navigate = useNavigate();
  const primaryColor = tenant.branding?.primaryColor ?? "#6366f1";

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
        Mi Perfil
      </h1>

      <div className="bg-white dark:bg-neutral-800 rounded-2xl border border-gray-100 dark:border-neutral-700 shadow-sm overflow-hidden transition-colors">
        <div
          className="h-24 relative"
          style={{
            background: `linear-gradient(135deg, ${primaryColor}, ${primaryColor}99)`,
          }}
        >
          <div className="absolute -bottom-10 left-6">
            <div className="relative group">
              <img
                src="https://fydn.imgix.net/m%2Fgen%2Fart-print-square-p1%2Fd338a134-22d3-47a5-a120-c0c6858d4ee6.jpg?auto=format%2Ccompress&q=75"
                alt="Avatar"
                className="w-20 h-20 rounded-2xl object-cover border-4 border-white dark:border-neutral-800 shadow-md"
              />
              <button className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                <Camera size={18} className="text-white" />
              </button>
            </div>
          </div>
        </div>

        <div className="pt-14 px-6 pb-6 space-y-1">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {userName || "Usuario"}
          </h2>
          <p className="text-sm text-gray-500 dark:text-neutral-400">
            {role === "admin"
              ? "Administrador"
              : role === "receptionist"
                ? "Recepcionista"
                : "Staff"}{" "}
            · {tenant.name}
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-neutral-800 rounded-2xl border border-gray-100 dark:border-neutral-700 shadow-sm p-6 space-y-5 transition-colors">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-neutral-400">
          Información Personal
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-neutral-500 mb-2">
              Nombre completo
            </label>
            <input
              type="text"
              defaultValue={userName || ""}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-neutral-600 bg-gray-50/50 dark:bg-neutral-700 text-sm text-gray-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:bg-white dark:focus:bg-neutral-600 transition-all"
              style={{ "--tw-ring-color": primaryColor } as React.CSSProperties}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-neutral-500 mb-2">
              Correo electrónico
            </label>
            <div className="relative">
              <Mail
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-neutral-500"
              />
              <input
                type="email"
                defaultValue="edwin@detdevs.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 dark:border-neutral-600 bg-gray-50/50 dark:bg-neutral-700 text-sm text-gray-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:bg-white dark:focus:bg-neutral-600 transition-all"
                style={
                  { "--tw-ring-color": primaryColor } as React.CSSProperties
                }
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-neutral-500 mb-2">
              Teléfono
            </label>
            <div className="relative">
              <Phone
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-neutral-500"
              />
              <input
                type="tel"
                defaultValue="8714-0989"
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 dark:border-neutral-600 bg-gray-50/50 dark:bg-neutral-700 text-sm text-gray-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:bg-white dark:focus:bg-neutral-600 transition-all"
                style={
                  { "--tw-ring-color": primaryColor } as React.CSSProperties
                }
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-neutral-500 mb-2">
              Rol
            </label>
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gray-50/50 dark:bg-neutral-700 border border-gray-200 dark:border-neutral-600 text-sm text-gray-700 dark:text-neutral-300">
              <Shield size={14} style={{ color: primaryColor }} />
              Administrador
            </div>
          </div>
        </div>
        <div className="flex justify-end">
          <button
            className="px-5 py-2.5 text-sm font-semibold text-white rounded-xl hover:opacity-90 hover:shadow-lg transition-all cursor-pointer"
            style={{
              backgroundColor: primaryColor,
              boxShadow: `0 4px 14px ${primaryColor}40`,
            }}
          >
            Guardar cambios
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-neutral-800 rounded-2xl border border-gray-100 dark:border-neutral-700 shadow-sm p-6 space-y-5 transition-colors">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-neutral-400">
          Seguridad
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-neutral-500 mb-2">
              Contraseña actual
            </label>
            <div className="relative">
              <Key
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-neutral-500"
              />
              <input
                type="password"
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 dark:border-neutral-600 bg-gray-50/50 dark:bg-neutral-700 text-sm text-gray-900 dark:text-neutral-100 placeholder:text-gray-400 dark:placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:bg-white dark:focus:bg-neutral-600 transition-all"
                style={
                  { "--tw-ring-color": primaryColor } as React.CSSProperties
                }
              />
            </div>
          </div>
          <div />
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-neutral-500 mb-2">
              Nueva contraseña
            </label>
            <input
              type="password"
              placeholder="Mínimo 8 caracteres"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-neutral-600 bg-gray-50/50 dark:bg-neutral-700 text-sm text-gray-900 dark:text-neutral-100 placeholder:text-gray-400 dark:placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:bg-white dark:focus:bg-neutral-600 transition-all"
              style={{ "--tw-ring-color": primaryColor } as React.CSSProperties}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-neutral-500 mb-2">
              Confirmar contraseña
            </label>
            <input
              type="password"
              placeholder="Repetir contraseña"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-neutral-600 bg-gray-50/50 dark:bg-neutral-700 text-sm text-gray-900 dark:text-neutral-100 placeholder:text-gray-400 dark:placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:bg-white dark:focus:bg-neutral-600 transition-all"
              style={{ "--tw-ring-color": primaryColor } as React.CSSProperties}
            />
          </div>
        </div>
        <div className="flex justify-end">
          <button
            className="px-5 py-2.5 text-sm font-semibold text-white rounded-xl hover:opacity-90 hover:shadow-lg transition-all cursor-pointer"
            style={{
              backgroundColor: primaryColor,
              boxShadow: `0 4px 14px ${primaryColor}40`,
            }}
          >
            Cambiar contraseña
          </button>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/30 transition-all cursor-pointer"
        >
          <LogOut size={16} />
          Cerrar sesión
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
