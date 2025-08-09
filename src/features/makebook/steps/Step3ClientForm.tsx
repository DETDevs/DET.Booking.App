import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import ReCAPTCHA from "react-google-recaptcha";
import { CheckCircle2, XCircle } from "lucide-react";

import { Input } from "../../../ui/input";
import { Label } from "../../../ui/label";
import { Button } from "@/components/ui/button";

import { useBooking } from "@/store/booking";
import { createBooking } from "../api/booking";
import type { BookingRequest } from "../api/booking";

const SITE_KEY = "6LfiwAkrAAAAAD5LPzXJsij7YcHZG7reqDDoiwRF";

const schema = z.object({
  name: z.string().min(2, "Nombre muy corto"),
  idNumber: z
    .string()
    .min(5, "Mín. 5 caracteres")
    .max(20, "Máx. 20 caracteres"),
  email: z.string().email("Correo inválido"),
  phone: z.string().regex(/^\d{8,15}$/, "Solo números 8-15 dígitos"),
});
type FormData = z.infer<typeof schema>;

interface Props {
  onNext: () => void;
  onPrev: () => void;
}

export default function Step3ClientForm({ onNext, onPrev }: Props) {
  const { service, employee, date, time, setClient, setBookingId } =
    useBooking();

  const captchaRef = useRef<ReCAPTCHA>(null);
  const [captcha, setCaptcha] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields, isSubmitting, isValid },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onChange", // para que isValid sea reactivo
  });

  const onSubmit = async (data: FormData) => {
    if (!captcha || !service || !employee || !date || !time) return;

    setClient(data);

    const body: BookingRequest = {
      serviceId: service.id,
      employeeId: employee.id,
      date,
      time,
      client: data,
    };

    try {
      const resp = await createBooking(body);
      setBookingId(resp.id);
      onNext();
    } catch (err) {
      console.error(err);
      alert("No se pudo crear la reserva. Intenta de nuevo.");
    }
  };

  const Icon = ({ name }: { name: keyof FormData }) => {
    if (!touchedFields[name]) return null;
    return errors[name] ? (
      <XCircle className="w-5 h-5 text-destructive" />
    ) : (
      <CheckCircle2 className="w-5 h-5 text-emerald-500" />
    );
  };

  return (
    <section
      className="relative flex flex-col py-6 px-4 space-y-6 max-w-md w-full
                        rounded-xl shadow-lg bg-white"
    >
      <h1 className="text-2xl font-semibold">Tus datos</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Field label="Nombre completo" error={errors.name?.message}>
          <div className="relative">
            <Input placeholder="Juan Pérez" {...register("name")} />
            <span className="absolute right-2 top-2">
              <Icon name="name" />
            </span>
          </div>
        </Field>

        <Field label="Documento de identidad" error={errors.idNumber?.message}>
          <div className="relative">
            <Input
              placeholder="0102030405"
              maxLength={20}
              {...register("idNumber")}
            />
            <span className="absolute right-2 top-2">
              <Icon name="idNumber" />
            </span>
          </div>
        </Field>

        <Field label="Correo electrónico" error={errors.email?.message}>
          <div className="relative">
            <Input
              type="email"
              placeholder="correo@ejemplo.com"
              {...register("email")}
            />
            <span className="absolute right-2 top-2">
              <Icon name="email" />
            </span>
          </div>
        </Field>

        <Field label="Teléfono" error={errors.phone?.message}>
          <div className="relative">
            <Input placeholder="ej. 88112233" {...register("phone")} />
            <span className="absolute right-2 top-2">
              <Icon name="phone" />
            </span>
          </div>
        </Field>

        <div className="flex justify-center">
          <ReCAPTCHA
            ref={captchaRef}
            sitekey={SITE_KEY}
            theme="light"
            onChange={(token) => setCaptcha(token)}
            onExpired={() => setCaptcha(null)}
          />
        </div>

        <div className="flex gap-4 pt-4">
          <Button variant="outline" type="button" onClick={onPrev}>
            Atrás
          </Button>
          <Button type="submit" disabled={!isValid || !captcha || isSubmitting}>
            {isSubmitting ? "Enviando…" : "Confirmar reserva"}
          </Button>
        </div>
      </form>
    </section>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <Label className="text-sm">{label}</Label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
