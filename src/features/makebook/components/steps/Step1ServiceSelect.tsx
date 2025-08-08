import { Tabs, TabsList, TabsTrigger, TabsContent } from "../../../../ui/tabs";
import { Button } from "@/components/ui/button";
import { useBooking } from "@/store/booking";
import { useServicios } from "../../hooks/useServicios";
import ServiceCard from "../ui/ServiceCard";
import EmployeeSelect from "../ui/EmployeeSelect";
import SizeSelect from "../ui/SizeSelect";
import empleadosData from "../../empleados.json";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect } from "react";

interface EmployeeMock {
  id: string;
  name: string;
  avatar: string;
  serviceId: string;
}

export default function Step1ServiceSelect({ onNext }: { onNext: () => void }) {
  const { service, employee, petSize, setService, setEmployee, setPetSize, reset } =
    useBooking();
  const { services, loading } = useServicios();
  const [params] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (!services.length) return;
    const idFromUrl = params.get("serviceId");
    if (idFromUrl && !service) {
      const pre = services.find((s) => s.id === idFromUrl);
      if (pre) setService(pre);
    }
  }, [services, params, service, setService]);

  const categories = [...new Set(services.map((s) => s.category))];
  const empleados = service
    ? (empleadosData as EmployeeMock[]).filter(
        (e) => String(e.serviceId) === service.id
      )
    : [];

  const canContinue = !!service && !!employee && !!petSize;

  if (loading) return <p className="p-6">Cargando servicios…</p>;

  return (
    <section className="w-full px-4 py-6 bg-white rounded-xl shadow-md overflow-hidden">
      <div className="mb-4">
        <button
          onClick={() => {
            reset();
            navigate("/serivecesshow");
          }}
          className="text-black font-bold px-3 py-1 rounded-full shadow bg-white hover:bg-slate-200 transition"
        >
          <i className="fa-solid fa-arrow-left text-pink-500"></i>
        </button>
      </div>

      {!service && (
        <Tabs defaultValue={categories[0]} className="space-y-4">
          <TabsList className="flex flex-wrap gap-2 justify-center">
            {categories.map((c) => (
              <TabsTrigger key={c} value={c} className="text-sm">
                {c}
              </TabsTrigger>
            ))}
          </TabsList>
          {categories.map((c) => (
            <TabsContent
              key={c}
              value={c}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            >
              {services
                .filter((s) => s.category === c)
                .map((svc) => (
                  <ServiceCard
                    key={svc.id}
                    svc={svc}
                    selected={false}
                    onSelect={() => {
                      setService(svc);
                      setEmployee(undefined);
                      setPetSize(undefined);
                    }}
                  />
                ))}
            </TabsContent>
          ))}
        </Tabs>
      )}

      {service && (
        <>
          {service.prices.length ? (
            <div className="space-y-4 mt-4">
              <h2 className="text-base sm:text-lg font-bold">
                Elige el tamaño de tu mascota
              </h2>
              <SizeSelect
                prices={service.prices}
                value={petSize?.idPrecio}
                onChange={(idPrecio) => {
                  const item = service.prices.find(
                    (p: { idPrecio: number; }) => p.idPrecio === idPrecio
                  )!;
                  setPetSize({
                    idPrecio: item.idPrecio,
                    label: item.rangoPeso.nombre,
                    price: item.monto,
                  });
                }}
              />
              {petSize && (
                <div className="text-sm bg-pink-50 border border-pink-200 rounded-md px-4 py-2">
                  Tamaño seleccionado: <strong>{petSize.label}</strong> –
                  Precio: <strong>${petSize.price}</strong>
                </div>
              )}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Este servicio no tiene precios configurados.
            </p>
          )}

          <div className="space-y-2 mt-6">
            <h2 className="text-base sm:text-lg font-bold">
              Elige el encargado de tu servicio
            </h2>
            <EmployeeSelect
              empleados={empleados}
              value={employee?.id}
              onChange={(id) => setEmployee(empleados.find((e) => e.id === id))}
            />
          </div>
        </>
      )}

      <div className="flex justify-center mt-6">
        <Button
          className="w-full sm:w-2/3 cursor-pointer"
          disabled={!canContinue}
          onClick={onNext}
        >
          Continuar
        </Button>
      </div>
    </section>
  );
}
