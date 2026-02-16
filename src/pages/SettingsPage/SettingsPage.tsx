import { useSchema } from "@/entities/schema/useSchema";
import { useTenant } from "@/entities/tenant/TenantContext";
import { DynamicForm } from "@/shared/ui/DynamicForm";
import { resolveIcon } from "@/shared/lib/iconResolver";
import type { FieldDef } from "@/entities/schema/schema.types";

interface SettingsSection {
  title: string;
  icon: string;
  fields: FieldDef[];
}

interface SettingsSchema {
  entity: string;
  title: string;
  sections: SettingsSection[];
}

const SettingsPage = () => {
  const schema = useSchema("settings") as unknown as SettingsSchema | null;
  const tenant = useTenant();
  const primaryColor = tenant.branding?.primaryColor ?? "#6366f1";

  if (!schema) {
    return (
      <div className="p-6 text-gray-500 dark:text-neutral-400">
        Schema de settings no encontrado.
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {schema.title}
        </h1>
        <p className="text-sm text-gray-500 dark:text-neutral-400 mt-1">
          Administrá la configuración de {tenant.name}
        </p>
      </div>

      {schema.sections.map((section) => {
        const Icon = resolveIcon(section.icon);
        return (
          <div key={section.title} className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: `${primaryColor}15` }}
              >
                <Icon size={16} style={{ color: primaryColor }} />
              </div>
              <h2 className="text-base font-semibold text-gray-900 dark:text-white">
                {section.title}
              </h2>
            </div>
            <DynamicForm
              fields={section.fields}
              onSubmit={(data) => {
                console.log(`Settings saved (${section.title}):`, data);
              }}
              submitLabel="Guardar cambios"
            />
          </div>
        );
      })}
    </div>
  );
};

export default SettingsPage;
