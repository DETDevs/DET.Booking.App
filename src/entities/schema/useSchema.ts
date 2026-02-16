import { useTenant } from "@/entities/tenant/TenantContext";
import type { EntitySchema } from "./schema.types";

const schemaModules = import.meta.glob<{ default: EntitySchema }>(
    "/src/config/schemas/**/*.json",
    { eager: true }
);

export function useSchema(entity: string): EntitySchema | null {
    const tenant = useTenant();
    const key = `/src/config/schemas/${tenant.schemaDir}/${entity}.json`;
    const mod = schemaModules[key];
    return mod ? mod.default : null;
}
