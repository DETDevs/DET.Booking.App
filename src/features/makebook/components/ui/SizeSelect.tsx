import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "../../../../ui/tooltip";
import { cn } from "@/lib/utils";
import type { PriceItem } from "../../types/Servicio";

export default function SizeSelect({
  prices,
  value,
  onChange,
}: {
  prices: PriceItem[];
  value?: number;
  onChange: (idPrecio: number) => void;
}) {
  const iconBySize = (label: string) => {
    const l = label.toLowerCase();
    if (l.includes("extra small")) return "🐾";
    if (l.includes("small")) return "🐶";
    if (l.includes("medium")) return "🐕";
    if (l.includes("large")) return "🦮";
    if (l.includes("x large")) return "🐕‍🦺";
    return "🐾";
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {prices.map((p) => (
        <Tooltip key={p.idPrecio}>
          <TooltipTrigger asChild>
            <button
              onClick={() => onChange(p.idPrecio)}
              className={cn(
                "flex items-center gap-4 p-4 rounded-xl border transition-all shadow-sm text-left",
                p.idPrecio === value
                  ? "border-pink-500 bg-pink-50 shadow-md"
                  : "border-gray-300 hover:bg-gray-100"
              )}
            >
              <div className="text-2xl">{iconBySize(p.rangoPeso.nombre)}</div>
              <div className="flex flex-col">
                <span className="font-bold">{p.rangoPeso.nombre}</span>
                <span className="text-sm text-gray-600">${p.monto}</span>
              </div>
            </button>
          </TooltipTrigger>
          <TooltipContent className="max-w-xs bg-white text-black border border-gray-300 shadow">
            {p.rangoPeso.nombre ?? "Rango de peso específico para este tamaño."}
          </TooltipContent>
        </Tooltip>
      ))}
    </div>
  );
}
