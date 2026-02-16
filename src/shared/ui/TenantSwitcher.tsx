import { useState } from "react";
import { ArrowLeftRight, X } from "lucide-react";

const tenantConfigs = import.meta.glob<{
  default: { id: string; name: string; branding?: { primaryColor?: string } };
}>("/src/config/tenants/*.json", { eager: true });

const tenants = Object.values(tenantConfigs)
  .map((m) => m.default)
  .filter((t) => t.id !== "default");

export const TenantSwitcher = () => {
  const [open, setOpen] = useState(false);
  const currentId = localStorage.getItem("det:tenantId") ?? "default";

  const switchTo = (id: string) => {
    const url = new URL(window.location.href);
    url.searchParams.set("tenant", id);
    window.location.href = url.toString();
  };

  if (import.meta.env.PROD) return null;

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-5 right-5 z-50 w-12 h-12 rounded-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-xl flex items-center justify-center hover:scale-110 transition-transform cursor-pointer"
        title="Switch tenant"
      >
        <ArrowLeftRight size={18} />
      </button>

      {open && (
        <div className="fixed bottom-20 right-5 z-50 w-64 bg-white dark:bg-neutral-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-neutral-700 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100 dark:border-neutral-700 flex items-center justify-between">
            <span className="text-sm font-semibold text-gray-900 dark:text-white">
              Cambiar Tenant
            </span>
            <button
              onClick={() => setOpen(false)}
              className="text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>
          <div className="p-2 space-y-1">
            {tenants.map((t) => (
              <button
                key={t.id}
                onClick={() => switchTo(t.id)}
                className={`w-full text-left px-3 py-2.5 rounded-xl text-sm flex items-center gap-3 transition-colors cursor-pointer ${
                  currentId === t.id
                    ? "bg-gray-100 dark:bg-neutral-700 font-semibold text-gray-900 dark:text-white"
                    : "text-gray-600 dark:text-neutral-400 hover:bg-gray-50 dark:hover:bg-neutral-750"
                }`}
              >
                <span
                  className="w-3 h-3 rounded-full shrink-0"
                  style={{
                    backgroundColor: t.branding?.primaryColor ?? "#6366f1",
                  }}
                />
                <span>{t.name}</span>
                {currentId === t.id && (
                  <span className="ml-auto text-xs text-gray-400">activo</span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
};
