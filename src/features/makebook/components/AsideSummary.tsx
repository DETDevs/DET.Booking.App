import { motion } from "framer-motion";
import { CalendarCheck2, PawPrint, User, Clock, ZapOff } from "lucide-react";
import { Avatar, AvatarFallback } from "../../../ui/avatar";
import { currency } from "./utils/format";
import { useBooking } from "@/store/booking";

export default function AsideSummary() {
  const { service, petSize, employee, date, time, client } = useBooking();
  const price = petSize?.price ?? service?.price ?? 0;

  const fadeIn = { hidden: { opacity: 0, y: 6 }, show: { opacity: 1, y: 0 } };

  return (
    <aside
      className="w-full lg:w-[22rem] shrink-0 rounded-md lg:sticky lg:top-24 
                       bg-white shadow-lg p-4 space-y-6"
    >
      <h2 className="text-xl font-bold">Resumen</h2>

      <Section label="Servicio" icon={<PawPrint className="w-4 h-4" />}>
        {service ? (
          <motion.p variants={fadeIn} initial="hidden" animate="show">
            {service.name}
          </motion.p>
        ) : (
          <Placeholder />
        )}
      </Section>

      <Section label="Tamaño" icon={<PawPrint className="w-4 h-4" />}>
        {petSize ? (
          <motion.p
            className="flex justify-between"
            variants={fadeIn}
            initial="hidden"
            animate="show"
          >
            <span>{petSize.label}</span>
            <span>{currency(price)}</span>
          </motion.p>
        ) : (
          <Placeholder />
        )}
      </Section>

      <Section label="Encargado" icon={<User className="w-4 h-4" />}>
        {employee ? (
          <motion.div
            className="flex items-center gap-2"
            variants={fadeIn}
            initial="hidden"
            animate="show"
          >
            <Avatar className="h-6 w-6">
              <AvatarFallback>
                {employee.name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span>{employee.name}</span>
          </motion.div>
        ) : (
          <Placeholder />
        )}
      </Section>

      <Section
        label="Fecha y hora"
        icon={<CalendarCheck2 className="w-4 h-4" />}
      >
        {date && time ? (
          <motion.p variants={fadeIn} initial="hidden" animate="show">
            {date} <Clock className="inline w-4 h-4 mx-1 -mt-0.5" /> {time}
          </motion.p>
        ) : (
          <Placeholder />
        )}
      </Section>

      <Section label="Cliente" icon={<User className="w-4 h-4" />}>
        {client ? (
          <motion.div
            className="flex items-center gap-2"
            variants={fadeIn}
            initial="hidden"
            animate="show"
          >
            <Avatar className="h-6 w-6">
              <AvatarFallback>
                {client.name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span>{client.name}</span>
          </motion.div>
        ) : (
          <Placeholder />
        )}
      </Section>

      <div className="pt-4 border-t flex justify-between items-center">
        <span className="font-semibold">Total</span>
        <span className="font-mono text-lg">{currency(price)}</span>
      </div>
    </aside>
  );
}

function Section({
  label,
  icon,
  children,
}: {
  label: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <h3 className="flex items-center gap-1 text-sm text-muted-foreground">
        {icon} {label}
      </h3>
      {children}
    </div>
  );
}

const Placeholder = () => (
  <p className="flex items-center gap-1 italic text-gray-500">
    <ZapOff className="w-3 h-3" /> Sin seleccionar
  </p>
);