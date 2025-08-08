import { useEffect, useState } from "react";
import { getServicios } from "../../../Service/ServiceCache";
import type { Servicio as ApiServicio } from "../../../types/Servicio";
import type { UIService } from "../types/Servicio";

export function useServicios() {
  const [services, setServices] = useState<UIService[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const api = await getServicios();
        setServices(api.map(mapToUI));
      } catch (e) {
        console.error("Error servicios:", e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return { services, loading };
}

function mapToUI(s: ApiServicio): UIService {
  return {
    id: String(s.idServicio),
    name: s.titulo,
    category: s.subTitulo ?? "General",
    duration: "1 h",
    price: Number(s.precio?.[0]?.monto ?? 0),
    prices: s.precio ?? [],             
    description: s.descripcion,
    includes: JSON.parse(s.incluye),
    note: s.nota,
  };
}