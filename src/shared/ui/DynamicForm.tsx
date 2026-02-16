import type { FieldDef } from "@/entities/schema/schema.types";
import { useTenant } from "@/entities/tenant/TenantContext";

interface DynamicFormProps {
  fields: FieldDef[];
  title?: string;
  onSubmit: (data: Record<string, string | boolean>) => void;
  onCancel?: () => void;
  submitLabel?: string;
}

export const DynamicForm = ({
  fields,
  title,
  onSubmit,
  onCancel,
  submitLabel,
}: DynamicFormProps) => {
  const tenant = useTenant();
  const primaryColor = tenant.branding?.primaryColor ?? "#6366f1";

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data: Record<string, string | boolean> = {};
    fields.forEach((field) => {
      if (field.type === "checkbox") {
        data[field.key] = formData.get(field.key) === "on";
      } else {
        data[field.key] = (formData.get(field.key) as string) ?? "";
      }
    });
    onSubmit(data);
  };

  const renderField = (field: FieldDef) => {
    const baseClass =
      "w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-neutral-600 bg-gray-50/50 dark:bg-neutral-700 text-sm text-gray-900 dark:text-neutral-100 placeholder:text-gray-400 dark:placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:bg-white dark:focus:bg-neutral-600 focus:border-transparent transition-all duration-200";
    const ringStyle = {
      "--tw-ring-color": primaryColor,
    } as React.CSSProperties;

    switch (field.type) {
      case "select":
        return (
          <select
            name={field.key}
            required={field.required}
            className={baseClass + " appearance-none cursor-pointer"}
            style={ringStyle}
          >
            <option value="">Seleccionar...</option>
            {field.options?.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        );
      case "textarea":
        return (
          <textarea
            name={field.key}
            required={field.required}
            placeholder={field.placeholder}
            rows={3}
            className={baseClass + " resize-none"}
            style={ringStyle}
          />
        );
      case "checkbox":
        return (
          <label className="flex items-center gap-3 cursor-pointer group">
            <div className="relative">
              <input
                type="checkbox"
                name={field.key}
                className="w-5 h-5 rounded-md border-2 border-gray-300 dark:border-neutral-500 transition-colors cursor-pointer"
                style={{ accentColor: primaryColor }}
              />
            </div>
            <span className="text-sm text-gray-700 dark:text-neutral-300 group-hover:text-gray-900 dark:group-hover:text-neutral-100 transition-colors">
              {field.label}
            </span>
          </label>
        );
      default:
        return (
          <input
            type={field.type}
            name={field.key}
            required={field.required}
            placeholder={field.placeholder}
            className={baseClass}
            style={ringStyle}
          />
        );
    }
  };

  const canSplitColumns =
    fields.length > 3 && fields.every((f) => f.type !== "textarea");

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white dark:bg-neutral-800 rounded-2xl border border-gray-100 dark:border-neutral-700 shadow-sm overflow-hidden transition-colors duration-300"
    >
      {title && (
        <div className="px-8 pt-6 pb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {title}
          </h2>
          <div
            className="mt-2 h-0.5 rounded-full"
            style={{
              background: `linear-gradient(to right, ${primaryColor}, transparent)`,
              width: "60px",
            }}
          />
        </div>
      )}

      <div
        className={`px-8 py-6 ${canSplitColumns ? "grid grid-cols-2 gap-x-8 gap-y-5" : "space-y-5"}`}
      >
        {fields.map((field) => (
          <div
            key={field.key}
            className={field.type === "textarea" ? "col-span-2" : ""}
          >
            {field.type !== "checkbox" && (
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-neutral-400 mb-2">
                {field.label}
                {field.required && (
                  <span className="text-red-400 ml-0.5">*</span>
                )}
              </label>
            )}
            {renderField(field)}
          </div>
        ))}
      </div>

      <div className="px-8 py-5 bg-gray-50/50 dark:bg-neutral-900/50 border-t border-gray-100 dark:border-neutral-700 flex justify-end gap-3">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2.5 text-sm font-medium text-gray-600 dark:text-neutral-300 bg-white dark:bg-neutral-700 border border-gray-200 dark:border-neutral-600 rounded-xl hover:bg-gray-50 dark:hover:bg-neutral-600 transition-all duration-200 cursor-pointer"
          >
            Cancelar
          </button>
        )}
        <button
          type="submit"
          className="px-6 py-2.5 text-sm font-semibold text-white rounded-xl hover:opacity-90 hover:shadow-lg transition-all duration-200 cursor-pointer"
          style={{
            backgroundColor: primaryColor,
            boxShadow: `0 4px 14px ${primaryColor}40`,
          }}
        >
          {submitLabel ?? "Guardar"}
        </button>
      </div>
    </form>
  );
};
