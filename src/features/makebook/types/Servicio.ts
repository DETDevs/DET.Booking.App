export interface PriceItem {
  idPrecio: number;
  monto: number;  
  rangoPeso: {
    idRango: number;
    nombre: string;
    pesoMin: number;
    pesoMax: number;
  };
}

export interface UIService {
  id: string;
  name: string;
  category: string;
  duration: string;
  price: number;          
  prices: PriceItem[];    
  description: string;
  includes: { id: number; descripcion: string }[];
  note?: string | null;
}