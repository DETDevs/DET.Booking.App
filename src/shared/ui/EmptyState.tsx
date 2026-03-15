import { Inbox } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon?: LucideIcon;
  title?: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  primaryColor?: string;
}

export const EmptyState = ({
  icon: Icon = Inbox,
  title = "No hay datos",
  description = "No se encontraron resultados para mostrar.",
  action,
  primaryColor = "#6366f1",
}: EmptyStateProps) => (
  <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
    <div
      className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
      style={{ backgroundColor: `${primaryColor}12` }}
    >
      <Icon size={28} style={{ color: primaryColor }} />
    </div>
    <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">
      {title}
    </h3>
    <p className="text-sm text-gray-500 dark:text-neutral-400 max-w-xs">
      {description}
    </p>
    {action && (
      <button
        onClick={action.onClick}
        className="mt-4 px-5 py-2 text-sm font-medium text-white rounded-xl transition-all hover:opacity-90 cursor-pointer"
        style={{ backgroundColor: primaryColor }}
      >
        {action.label}
      </button>
    )}
  </div>
);
