import type { ColumnDef } from "@/entities/schema/schema.types";
import { Check, X } from "lucide-react";

interface DynamicTableProps {
  columns: ColumnDef[];
  data: Record<string, unknown>[];
  title?: string;
  onRowClick?: (row: Record<string, unknown>, index: number) => void;
}

export const DynamicTable = ({
  columns,
  data,
  title,
  onRowClick,
}: DynamicTableProps) => {
  const renderCell = (col: ColumnDef, value: unknown) => {
    if (value === undefined || value === null)
      return <span className="text-gray-300 dark:text-neutral-600">—</span>;

    switch (col.type) {
      case "badge":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-800">
            {String(value)}
          </span>
        );
      case "date":
        return (
          <span>{new Date(String(value)).toLocaleDateString("es-CR")}</span>
        );
      case "currency":
        return (
          <span className="font-medium">₡{Number(value).toLocaleString()}</span>
        );
      case "boolean":
        return value ? (
          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-50 dark:bg-green-900/30">
            <Check size={14} className="text-green-500" />
          </span>
        ) : (
          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-red-50 dark:bg-red-900/30">
            <X size={14} className="text-red-400" />
          </span>
        );
      default:
        return <span>{String(value)}</span>;
    }
  };

  return (
    <div className="bg-white dark:bg-neutral-800 rounded-2xl border border-gray-100 dark:border-neutral-700 shadow-sm overflow-hidden transition-colors duration-300">
      {title && (
        <div className="px-6 py-4 border-b border-gray-100 dark:border-neutral-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-neutral-100">
            {title}
          </h2>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 dark:bg-neutral-750 border-b border-gray-100 dark:border-neutral-700">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="text-left px-6 py-3.5 text-xs font-semibold text-gray-500 dark:text-neutral-400 uppercase tracking-wider"
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 dark:divide-neutral-700">
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-12 text-center text-gray-400 dark:text-neutral-500 text-sm"
                >
                  No hay registros
                </td>
              </tr>
            ) : (
              data.map((row, i) => (
                <tr
                  key={i}
                  onClick={() => onRowClick?.(row, i)}
                  className={`hover:bg-gray-50 dark:hover:bg-neutral-750 transition-colors ${onRowClick ? "cursor-pointer" : ""}`}
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className="px-6 py-3.5 text-sm text-gray-700 dark:text-neutral-300"
                    >
                      {renderCell(col, row[col.key])}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
