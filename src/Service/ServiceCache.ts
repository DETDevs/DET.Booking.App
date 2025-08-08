import type { Servicio } from "../types/Servicio";
import { obtenerDetallesServicio } from "./serviceDetailApi";

let cache: Servicio[] | null = null;

export async function getServicios(): Promise<Servicio[]> {
  if (cache) return cache;
  cache = await obtenerDetallesServicio();
  return cache;
}
