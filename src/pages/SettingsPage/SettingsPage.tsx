import { useState } from "react";
import { useSchema } from "@/entities/schema/useSchema";
import { useTenant } from "@/entities/tenant/TenantContext";
import { DynamicForm } from "@/shared/ui/DynamicForm";
import { resolveIcon } from "@/shared/lib/iconResolver";
import { BusinessHoursEditor } from "@/features/settings/components/BusinessHoursEditor";
import { BookingRulesEditor } from "@/features/settings/components/BookingRulesEditor";
import { Settings, Clock, Shield } from "lucide-react";
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

type Tab = "general" | "hours" | "rules";

const TABS: { key: Tab; label: string; icon: React.ReactNode }[] = [
  { key: "general", label: "General", icon: <Settings size={16} /> },
  { key: "hours", label: "Horarios", icon: <Clock size={16} /> },
  { key: "rules", label: "Reglas", icon: <Shield size={16} /> },
];

const SettingsPage = () => {
  const schema = useSchema("settings") as unknown as SettingsSchema | null;
  const tenant = useTenant();
  const primaryColor = tenant.branding?.primaryColor ?? "#6366f1";
  const [activeTab, setActiveTab] = useState<Tab>("general");

  if (!schema) {
    return (
      <div className="p-6 text-gray-500 dark:text-neutral-400">
        Schema de settings no encontrado.
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {schema.title}
        </h1>
        <p className="text-sm text-gray-500 dark:text-neutral-400 mt-1">
          Administrá la configuración de {tenant.name}
        </p>
      </div>

      <div className="flex gap-1 bg-gray-100/80 dark:bg-neutral-800 rounded-xl p-1">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg transition-all cursor-pointer flex-1 justify-center ${
              activeTab === tab.key
                ? "bg-white dark:bg-neutral-700 text-gray-900 dark:text-white shadow-sm"
                : "text-gray-500 dark:text-neutral-400 hover:text-gray-700 dark:hover:text-neutral-300"
            }`}
            style={
              activeTab === tab.key
                ? { boxShadow: `0 1px 3px ${primaryColor}15` }
                : {}
            }
          >
            <span style={activeTab === tab.key ? { color: primaryColor } : {}}>
              {tab.icon}
            </span>
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "general" && (
        <div className="space-y-8">
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
      )}

      {activeTab === "hours" && <BusinessHoursEditor />}
      {activeTab === "rules" && <BookingRulesEditor />}
    </div>
  );
};

export default SettingsPage;
