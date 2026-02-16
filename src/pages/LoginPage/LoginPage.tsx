import { useNavigate } from "react-router-dom";
import { useTenant } from "@/entities/tenant/TenantContext";

const LoginPage = () => {
  const tenant = useTenant();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    navigate("/");
  };

  return (
    <div
      className="flex items-center justify-center h-screen"
      style={{
        background: `linear-gradient(135deg, ${tenant.branding?.primaryColor ?? "#6366f1"}15, ${tenant.branding?.accentColor ?? "#818cf8"}10)`,
      }}
    >
      <form
        onSubmit={handleSubmit}
        className="w-[380px] space-y-6 bg-white p-8 shadow-xl rounded-xl border border-gray-100"
      >
        {tenant.branding?.logo && (
          <img
            src={tenant.branding.logo}
            alt={tenant.name}
            className="mx-auto h-12 object-contain"
          />
        )}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">{tenant.name}</h1>
          <p className="text-sm text-gray-500 mt-1">Ingresá a tu cuenta</p>
        </div>

        <div className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:border-transparent transition-shadow"
            style={
              {
                "--tw-ring-color": tenant.branding?.primaryColor ?? "#6366f1",
              } as React.CSSProperties
            }
          />
          <input
            type="password"
            placeholder="Contraseña"
            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:border-transparent transition-shadow"
            style={
              {
                "--tw-ring-color": tenant.branding?.primaryColor ?? "#6366f1",
              } as React.CSSProperties
            }
          />
        </div>

        <button
          type="submit"
          className="w-full py-2.5 rounded-lg text-white text-sm font-semibold transition-opacity hover:opacity-90 cursor-pointer"
          style={{
            backgroundColor: tenant.branding?.primaryColor ?? "#6366f1",
          }}
        >
          Iniciar sesión
        </button>

        <p className="text-xs text-center text-gray-400">
          Powered by{" "}
          <span className="font-medium text-gray-500">DETDevs Booking</span>
        </p>
      </form>
    </div>
  );
};

export default LoginPage;
