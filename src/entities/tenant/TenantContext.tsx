import { createContext, useContext } from "react";
import type { TenantConfig, FeatureConfig } from "./tenant.types";
import { resolveTenant } from "./resolveTenant";

const tenant = resolveTenant();

const TenantContext = createContext<TenantConfig | null>(tenant);

export function TenantProvider({ children }: { children: React.ReactNode }) {
  if (!tenant) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center space-y-4 max-w-md px-6">
          <div className="mx-auto w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            Acceso no autorizado
          </h1>
          <p className="text-gray-500 text-sm">
            La organización solicitada no existe o no está disponible. Contactá
            al administrador si creés que es un error.
          </p>
          <p className="text-xs text-gray-400 font-mono">
            ERR_TENANT_NOT_FOUND
          </p>
        </div>
      </div>
    );
  }

  return (
    <TenantContext.Provider value={tenant}>{children}</TenantContext.Provider>
  );
}

export function useTenant(): TenantConfig {
  const ctx = useContext(TenantContext);
  if (!ctx) {
    throw new Error(
      "useTenant must be used within a TenantProvider with a valid tenant.",
    );
  }
  return ctx;
}

export function useFeature(key: string): FeatureConfig & { active: boolean } {
  const tenant = useTenant();
  const feature = tenant.features[key];
  if (!feature) return { enabled: false, active: false };
  return { ...feature, active: feature.enabled };
}
