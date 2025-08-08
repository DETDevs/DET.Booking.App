import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useBooking } from "@/store/booking";
import { findCustomerById } from "@/service/customer"; // tu API

export default function ClientModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [idInput, setIdInput] = useState("");
  const { data: customer, isLoading } = useQuery(
    ["customer", idInput],
    () => findCustomerById(idInput),
    { enabled: idInput.length > 5 }
  );

  const setClient = useBooking((s) => s.setClient);
  const navigate = useNavigate(); // de react-router

  const handleContinue = () => {
    if (customer) setClient(customer);
    navigate("/make-booking?step=service");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="space-y-4">
        <h2 className="text-xl font-bold">Buscar cliente</h2>

        <Input
          placeholder="Número de identificación"
          value={idInput}
          onChange={(e) => setIdInput(e.target.value)}
        />

        {idInput &&
          !isLoading &&
          (customer ? (
            <Alert variant="success">Cliente encontrado: {customer.name}</Alert>
          ) : (
            <Alert variant="error">No se encontró cliente</Alert>
          ))}

        <Button
          disabled={idInput.length < 6}
          onClick={handleContinue}
          className="w-full"
        >
          Continuar
        </Button>
      </DialogContent>
    </Dialog>
  );
}
