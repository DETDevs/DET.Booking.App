import { useState, useRef, useEffect } from "react";
import { NotificationIndicator } from "./NotificationIndicator";
import { Search, X } from "lucide-react";
import { UserMenu } from "./UserMenu";
import { useTenant } from "@/entities/tenant/TenantContext";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  pendingBookings: number;
}

interface SearchResult {
  label: string;
  path: string;
  type: "page" | "action";
}

export const Header = ({ pendingBookings }: HeaderProps) => {
  const tenant = useTenant();
  const navigate = useNavigate();
  const primaryColor = tenant.branding?.primaryColor ?? "#6366f1";
  const [query, setQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const searchItems: SearchResult[] = tenant.navigation
    .filter((item) => tenant.features[item.featureKey]?.enabled !== false)
    .map((item) => ({
      label: tenant.features[item.featureKey]?.label ?? item.featureKey,
      path: item.path,
      type: "page" as const,
    }));

  const results = query.trim()
    ? searchItems.filter((item) =>
        item.label.toLowerCase().includes(query.toLowerCase()),
      )
    : [];

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleSelect = (path: string) => {
    navigate(path);
    setQuery("");
    setShowResults(false);
  };

  return (
    <header className="flex items-center justify-between px-6 py-3 bg-white dark:bg-neutral-800 border-b border-gray-200 dark:border-neutral-700 transition-colors duration-300">
      <div className="flex items-center gap-4">
        <span
          className="text-sm font-bold tracking-wide hidden sm:block"
          style={{ color: primaryColor }}
        >
          {tenant.name}
        </span>
        <div className="relative" ref={searchRef}>
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-neutral-500"
          />
          <input
            placeholder="Buscar módulo..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setShowResults(true);
            }}
            onFocus={() => query && setShowResults(true)}
            className="pl-9 pr-8 py-2 text-sm rounded-lg bg-gray-100 dark:bg-neutral-700 dark:text-neutral-200 border-none outline-none focus:ring-2 transition-all w-48 sm:w-56"
            style={{ "--tw-ring-color": primaryColor } as React.CSSProperties}
            aria-label="Buscar módulos"
          />
          {query && (
            <button
              onClick={() => {
                setQuery("");
                setShowResults(false);
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 rounded hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Limpiar búsqueda"
            >
              <X size={14} className="text-gray-400 dark:text-neutral-500" />
            </button>
          )}

          {showResults && results.length > 0 && (
            <div className="absolute top-full left-0 mt-2 w-full bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-xl shadow-lg z-50 py-1 overflow-hidden">
              {results.map((r) => (
                <button
                  key={r.path}
                  onClick={() => handleSelect(r.path)}
                  className="w-full text-left px-4 py-2.5 text-sm text-gray-700 dark:text-neutral-300 hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors cursor-pointer flex items-center gap-2"
                >
                  <Search size={14} className="text-gray-400 dark:text-neutral-500" />
                  {r.label}
                </button>
              ))}
            </div>
          )}

          {showResults && query && results.length === 0 && (
            <div className="absolute top-full left-0 mt-2 w-full bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-xl shadow-lg z-50 py-3 px-4">
              <p className="text-sm text-gray-400 dark:text-neutral-500 text-center">
                Sin resultados
              </p>
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center gap-4">
        <NotificationIndicator count={pendingBookings} />
        <UserMenu />
      </div>
    </header>
  );
};
