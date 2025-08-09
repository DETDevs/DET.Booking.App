import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import { Card, CardHeader, CardTitle, CardContent } from "../../../ui/card";
import { Input } from "../../../ui/input";
import { Button } from "@/components/ui/button";

import { findCustomerById } from "@/features/customer/api/findCustomerByid";
import { useBooking } from "@/store/booking";
import type { Customer } from "@/features/customer/data/customerdata";

export default function ClientLookupPage() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  
  const {
    data: customer,
    isFetching,
    isError,
  } = useQuery<Customer | null>({
    queryKey: ["customer", query],
    queryFn: () => findCustomerById(query),
    enabled: query.trim().length >= 3,
    staleTime: 1000 * 30,
  });
  
  const setClient = useBooking((s) => s.setClient);
  const setExistingClient = useBooking((s) => s.setExistingClient);

  const handleContinue = () => {
    if (customer) {
      setClient({
        name: customer.name,
        idNumber: query,
        email: customer.email,
        phone: "",
      });
      setExistingClient(true); 
    } else {
      setClient({
        name: "",
        idNumber: query,
        email: "",
        phone: "",
      });
      setExistingClient(false); 
    }
    navigate("/makebook/services");
  };

  const canSearch = query.trim().length >= 3;
  const exists = !!customer;

  return (
    <div className="flex justify-center px-4 py-8">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Buscar cliente</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder="Identificación o correo"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />

          {canSearch && (
            <div className="text-sm min-h-5">
              {isFetching && (
                <span className="text-muted-foreground">Buscando…</span>
              )}

              {!isFetching && isError && (
                <span className="text-destructive">
                  Ocurrió un error al buscar.
                </span>
              )}

              {!isFetching && !isError && exists && (
                <span className="text-emerald-600">
                  Cliente encontrado: <strong>{customer!.name}</strong>
                </span>
              )}

              {!isFetching && !isError && !exists && (
                <span className="text-amber-600">
                  No se encontró cliente. Podés continuar y completarlo en el
                  formulario.
                </span>
              )}
            </div>
          )}

          <div className="flex gap-2">
            <Button
              className="w-full"
              disabled={!canSearch || isFetching}
              onClick={handleContinue}
            >
              Continuar
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
