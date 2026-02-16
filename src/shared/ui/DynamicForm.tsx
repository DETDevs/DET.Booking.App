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
      "w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:border-transparent transition-shadow";
    const ringStyle = {
      "--tw-ring-color": primaryColor,
    } as React.CSSProperties;

    switch (field.type) {
      case "select":
        return (
          <select
            name={field.key}
            required={field.required}
            className={baseClass}
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
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name={field.key}
              className="w-4 h-4 rounded border-gray-300"
              style={{ accentColor: primaryColor }}
            />
            <span className="text-sm text-gray-700">{field.label}</span>
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

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-xl border border-gray-200 overflow-hidden"
    >
      {title && (
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        </div>
      )}

      <div className="p-6 space-y-5">
        {fields.map((field) => (
          <div key={field.key}>
            {field.type !== "checkbox" && (
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
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

      <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
          >
            Cancelar
          </button>
        )}
        <button
          type="submit"
          className="px-6 py-2 text-sm font-semibold text-white rounded-lg hover:opacity-90 transition-opacity cursor-pointer"
          style={{ backgroundColor: primaryColor }}
        >
          {submitLabel ?? "Guardar"}
        </button>
      </div>
    </form>
  );
};
