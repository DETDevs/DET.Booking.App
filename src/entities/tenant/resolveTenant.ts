import type { TenantConfig } from "./tenant.types";

const TENANT_STORAGE_KEY = "det:tenant-id";

const tenantModules = import.meta.glob<{ default: TenantConfig }>(
    "/src/config/tenants/*.json",
    { eager: true }
);

function getTenantId(): string | null {
    const params = new URLSearchParams(window.location.search);
    const fromParam = params.get("tenant");

    if (fromParam) {
        const key = `/src/config/tenants/${fromParam}.json`;
        if (!tenantModules[key]) return null;
        localStorage.setItem(TENANT_STORAGE_KEY, fromParam);
        return fromParam;
    }

    const hostname = window.location.hostname;
    const parts = hostname.split(".");
    if (parts.length >= 3) {
        const fromSubdomain = parts[0];
        const key = `/src/config/tenants/${fromSubdomain}.json`;
        if (!tenantModules[key]) return null;
        localStorage.setItem(TENANT_STORAGE_KEY, fromSubdomain);
        return fromSubdomain;
    }

    const fromStorage = localStorage.getItem(TENANT_STORAGE_KEY);
    if (fromStorage) {
        const key = `/src/config/tenants/${fromStorage}.json`;
        if (tenantModules[key]) return fromStorage;
        localStorage.removeItem(TENANT_STORAGE_KEY);
    }

    return "default";
}

export function resolveTenant(): TenantConfig | null {
    const id = getTenantId();
    if (!id) return null;

    const key = `/src/config/tenants/${id}.json`;
    const mod = tenantModules[key];
    return mod ? mod.default : null;
}
