import { useNavigate } from "react-router-dom";
import { useTenant } from "@/entities/tenant/TenantContext";
import { Home } from "lucide-react";

const NotFoundPage = () => {
  const navigate = useNavigate();
  const tenant = useTenant();
  const primaryColor = tenant?.branding?.primaryColor ?? "#6366f1";

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-neutral-900 px-6 transition-colors">
      <div className="text-center space-y-6 max-w-md">
        <div className="relative">
          <span className="text-[10rem] font-black leading-none text-gray-100 dark:text-neutral-800 select-none">
            404
          </span>
          <div className="absolute inset-0 flex items-center justify-center">
            <span
              className="text-6xl font-black"
              style={{ color: primaryColor }}
            >
              Oops!
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Página no encontrada
          </h1>
          <p className="text-gray-500 dark:text-neutral-400">
            La página que buscás no existe o fue movida. Verificá la URL o
            regresá al inicio.
          </p>
        </div>

        <button
          onClick={() => navigate("/")}
          className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white rounded-xl hover:opacity-90 hover:shadow-lg transition-all cursor-pointer"
          style={{
            backgroundColor: primaryColor,
            boxShadow: `0 4px 14px ${primaryColor}40`,
          }}
        >
          <Home size={16} />
          Volver al inicio
        </button>
      </div>
    </div>
  );
};

export default NotFoundPage;
