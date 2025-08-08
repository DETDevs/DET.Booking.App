import { useEffect, useRef, useState } from "react";
import { format, endOfYear } from "date-fns";
import { CalendarDays, Clock } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useBooking } from "@/store/booking";
import { useSlots } from "../../hooks/useSlots";
import TimeSlotList from "../ui/TimeSlotList";
import HorizontalCalendar from "../ui/CalendarHoriz";

const SkeletonSlots = () => (
  <div className="grid grid-cols-3 gap-2 animate-pulse">
    {Array.from({ length: 6 }).map((_, i) => (
      <div key={i} className="h-10 rounded bg-gray-200 dark:bg-gray-700" />
    ))}
  </div>
);

interface Props {
  onNext: () => void;
  onPrev: () => void;
}

export default function Step2DateTime({ onNext, onPrev }: Props) {
  const { service, employee, date, time, setDateTime } = useBooking();

  const today = new Date();
  const endOfThisYear = endOfYear(today);

  const [selectedDay, setSelectedDay] = useState<Date>(
    date ? new Date(date) : today
  );

  const calRef = useRef<HTMLUListElement | null>(null);

  const iso = format(selectedDay, "yyyy-MM-dd");

  const { slots, loading } = useSlots(service?.id, employee?.id, iso);

  const canContinue = !!time;

  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;

  useEffect(() => {
    const chip = calRef.current?.querySelector('[data-selected="true"]');
    chip?.scrollIntoView({
      behavior: "instant",
      block: "nearest",
      inline: "center",
    });
  }, [selectedDay]);

  return (
    <section className="flex flex-col space-y-6 max-w-xl w-full md:w-[30vw] mx-auto rounded-xl shadow-lg bg-white py-6 px-4">
      <h1 className="flex items-center gap-2 text-2xl font-semibold">
        <CalendarDays className="w-6 h-6 text-pink-500" />
        Seleccionar fecha y hora
      </h1>

      <HorizontalCalendar
        ref={calRef}
        selected={selectedDay}
        onSelect={(d) => {
          setSelectedDay(d);
          setDateTime(format(d, "yyyy-MM-dd"), "");
        }}
        fromDate={today}
        toDate={endOfThisYear}
      />

      <p className="text-xs text-gray-500 -mt-2">
        Horarios mostrados en&nbsp;
        <span className="font-medium">
          hora local&nbsp;(GMT‑{Math.abs(today.getTimezoneOffset() / 60)}, {tz})
        </span>
      </p>

      <div className="space-y-2">
        <h2 className="flex items-center gap-2 text-lg font-medium">
          <Clock className="w-5 h-5 text-pink-500" />
          Horarios disponibles — {format(selectedDay, "dd MMM yyyy")}
        </h2>

        {loading ? (
          <SkeletonSlots />
        ) : (
          <TimeSlotList
            slots={slots}
            selected={time}
            onSelect={(t) => setDateTime(iso, t)}
          />
        )}
      </div>

      <div className="flex gap-4 pt-4">
        <Button variant="outline" onClick={onPrev}>
          Atrás
        </Button>
        <Button
          disabled={!canContinue}
          title={!canContinue ? "Selecciona una hora" : undefined}
          onClick={onNext}
        >
          Continuar
        </Button>
      </div>
    </section>
  );
}
