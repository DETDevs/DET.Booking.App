import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Card, CardHeader, CardTitle } from "../../../ui/card";
import { PawPrint } from "lucide-react";

import { getServicios } from "@/Service/ServiceCache"; 
import { useBooking } from "@/store/booking";
import { mapServicioToUIService } from "@/shared/types/mapServicio"; 

import type { Servicio } from "@/types/Servicio";
import type { UIService } from "@/features/makebook/types/Servicio";

export default function ServicesShowcasePage() {
  const nav = useNavigate();
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const { reset, setService, setEmployee, setPetSize } = useBooking();

  useEffect(() => {
    getServicios().then(setServicios);
  }, []);

  const handleServiceClick = (svc: Servicio) => {
    reset({ keepClient: true }); 
    const uiSvc: UIService = mapServicioToUIService(svc);
    setService(uiSvc);
    setEmployee(undefined);
    setPetSize(undefined);
    nav(`/makebook/booking?serviceId=${svc.idServicio}`); // va a los steps
  };

  return (
    <main className="flex flex-col items-center w-full min-h-screen mt-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Nuestros Servicios</h1>

      <div className="grid gap-6 w-full max-w-6xl sm:grid-cols-2 lg:grid-cols-3">
        {servicios.map((s) => (
          <Card
            key={s.idServicio}
            role="button"
            tabIndex={0}
            onClick={() => handleServiceClick(s)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleServiceClick(s);
              }
            }}
            className="relative cursor-pointer h-[18rem] rounded-xl overflow-hidden group transition-transform
                       duration-300 ease-in-out hover:scale-105 hover:brightness-110 shadow-md"
            style={{
              backgroundImage: `url(${s.urlImagen})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
            aria-label={`Seleccionar servicio ${s.titulo}`}
          >
            <div className="absolute inset-0 bg-black/50 z-0" />
            <CardHeader className="relative z-10 flex flex-col items-center justify-center text-center h-full px-4">
              <PawPrint className="w-8 h-8 text-white mb-2 opacity-90" />
              <CardTitle className="text-white text-2xl md:text-3xl font-extrabold leading-snug drop-shadow-lg">
                {s.titulo}
              </CardTitle>
            </CardHeader>
          </Card>
        ))}
      </div>
    </main>
  );
}
