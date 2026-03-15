import type { LucideIcon } from "lucide-react";
import { Plus, Search } from "lucide-react";
import { PageHeader } from "@/shared/ui/PageHeader";

interface CrudPageHeaderProps {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  primaryColor: string;
  search: string;
  onSearch: (value: string) => void;
  searchPlaceholder?: string;
  onCreate: () => void;
}

export function CrudPageHeader({
  icon,
  title,
  subtitle,
  primaryColor,
  search,
  onSearch,
  searchPlaceholder = "Buscar...",
  onCreate,
}: CrudPageHeaderProps) {
  return (
    <>
      <div className="flex items-center justify-between flex-wrap gap-3">
        <PageHeader icon={icon} title={title} subtitle={subtitle} />
        <button
          onClick={onCreate}
          className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white rounded-xl hover:opacity-90 hover:shadow-lg transition-all cursor-pointer"
          style={{
            backgroundColor: primaryColor,
            boxShadow: `0 4px 14px ${primaryColor}40`,
          }}
        >
          <Plus size={16} />
          Nuevo
        </button>
      </div>

      <div className="relative max-w-sm">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-neutral-500"
        />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder={searchPlaceholder}
          className="w-full pl-9 pr-3 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-gray-900 dark:text-neutral-100 focus:outline-none focus:ring-2 transition-all"
          style={{ "--tw-ring-color": primaryColor } as React.CSSProperties}
        />
      </div>
    </>
  );
}
