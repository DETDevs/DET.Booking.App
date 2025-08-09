import type { Servicio }  from "@/types/Servicio";
import type { UIService } from "../../features/makebook/types/Servicio";

export function mapServicioToUIService(s: Servicio): UIService {
  const basePrice =
    s.precio?.length && typeof s.precio[0].monto === "number"
      ? s.precio[0].monto
      : 0;

  return {
    id:          String(s.idServicio),
    name:        s.titulo,
    category:    s.subTitulo ?? "",            
    duration:    "",                           
    price:       basePrice,                 
    prices:      s.precio ?? [],              
    description: s.descripcion,
    includes:    s.incluyeLista ?? [],         
    note:        s.nota ?? null,               

  };
}
