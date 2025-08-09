import { Card, CardHeader, CardTitle, CardContent } from "../../../ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Copy } from "lucide-react";
import { format, parseISO, addMinutes } from "date-fns";
import { motion } from "framer-motion";
import { useBooking } from "@/store/booking";
import { useNavigate } from "react-router-dom";

interface Props {
  onPrev: () => void;
}

export default function Step4Confirmation({ onPrev }: Props) {
  const { service, employee, date, time, bookingId, reset, petSize } =
    useBooking();
  const navigate = useNavigate();

  const price = petSize?.price ?? service?.price ?? 0;

  const start = parseISO(`${date}T${time}`);
  const end = addMinutes(start, 60); // 1 h
  const gCalLink = buildGoogleCalLink({
    title: `${service?.name} – MoPetCo`,
    start,
    end,
    details: `Reserva nº ${bookingId}. Encargado: ${employee?.name}`,
  });

  const summaryTxt = `
Reserva MoPetCo
────────────────
Servicio:  ${service?.name}
Encargado: ${employee?.name}
Fecha:     ${format(start, "dd MMM yyyy")} ${time}
Reserva ID: ${bookingId}
Total:     $${price}
  `.trim();

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(summaryTxt);
      if (navigator.share) {
        await navigator.share({ text: summaryTxt });
      } else {
        alert("Detalles copiados al portapapeles 📋");
      }
    } catch {
      alert("No se pudo compartir. Copia manualmente los datos.");
    }
  };

  const nuevaReserva = () => {
    reset();
    window.scrollTo({ top: 0, behavior: "smooth" });
    onPrev();
    navigate("/makebook");
  };

  return (
    <section className="flex flex-col items-center mt-10 space-y-6">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 15 }}
      >
        <CheckCircle2 className="w-20 h-20 text-green-600" />
      </motion.div>

      <h1 className="text-3xl font-semibold text-center">
        ¡Solicitud enviada!
      </h1>
      <p className="text-muted-foreground text-center max-w-md">
        Te llegará un correo cuando confirmemos tu cita.
        <br />
        Id de reserva:&nbsp;<span className="font-medium">{bookingId}</span>
      </p>

      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Resumen de tu reserva</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1 text-sm">
          <Row label="Servicio" value={service?.name} />
          <Row label="Encargado" value={employee?.name} />
          <Row label="Fecha" value={format(start, "dd MMM yyyy")} />
          <Row label="Hora" value={time} />
          <Row label="Total" value={`$${price}`} bold />
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-4">
        <Button asChild variant="secondary">
          <a href={gCalLink} target="_blank" rel="noopener noreferrer">
            Agregar a Google Calendar
          </a>
        </Button>

        <Button variant="secondary" onClick={handleShare}>
          <Copy className="w-4 h-4 mr-1" /> Compartir cita
        </Button>
      </div>

      <Button onClick={nuevaReserva}>Hacer otra reserva</Button>
    </section>
  );
}

function Row({
  label,
  value,
  bold,
}: {
  label: string;
  value?: string;
  bold?: boolean;
}) {
  return (
    <div className="flex justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className={bold ? "font-semibold" : ""}>{value ?? "—"}</span>
    </div>
  );
}

function buildGoogleCalLink(opts: {
  title: string;
  start: Date;
  end: Date;
  details: string;
}) {
  const fmt = (d: Date) => format(d, "yyyyMMdd'T'HHmmss");
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: opts.title,
    dates: `${fmt(opts.start)}/${fmt(opts.end)}`,
    details: opts.details,
  }).toString();
  return `https://calendar.google.com/calendar/render?${params}`;
}
