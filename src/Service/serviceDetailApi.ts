import axios from "axios";
import { API_BASE_URL } from "./apiConfig";
import type { Servicio } from "../types/Servicio";

export const obtenerDetallesServicio = async (): Promise<Servicio[]> => {
  try {
    const response = await axios.get<{ content: Servicio[] }>(
      `${API_BASE_URL}/api/Servicio/ObtenerDetalles`
    );
    return response.data.content;
  } catch (error) {
    console.error("Error fetching service details:", error);
    return [];
  }
};
