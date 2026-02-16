import type { ColumnDef } from "@/entities/schema/schema.types";
import { Check, X } from "lucide-react";

interface DynamicTableProps {
  columns: ColumnDef[];
  data: Record<string, unknown>[];
  title?: string;
  onRowClick?: (row: Record<string, unknown>) => void;
}

export const DynamicTable = ({
  columns,
  data,
  title,
  onRowClick,
}: DynamicTableProps) => {
  const renderCell = (col: ColumnDef, value: unknown) => {
    if (value === undefined || value === null)
      return <span className="text-gray-300">—</span>;

    switch (col.type) {
      case "badge":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
            {String(value)}
          </span>
        );
      case "date":
        return (
          <span>{new Date(String(value)).toLocaleDateString("es-CR")}</span>
        );
      case "currency":
        return <span>₡{Number(value).toLocaleString()}</span>;
      case "boolean":
        return value ? (
          <Check size={16} className="text-green-500" />
        ) : (
          <X size={16} className="text-red-400" />
        );
      default:
        return <span>{String(value)}</span>;
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {title && (
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider"
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-12 text-center text-gray-400 text-sm"
                >
                  No hay registros
                </td>
              </tr>
            ) : (
              data.map((row, i) => (
                <tr
                  key={i}
                  onClick={() => onRowClick?.(row)}
                  className={`hover:bg-gray-50 transition-colors ${onRowClick ? "cursor-pointer" : ""}`}
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className="px-6 py-3 text-sm text-gray-700"
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
