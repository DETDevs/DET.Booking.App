// src/components/booking/hooks/useSlots.ts
import { useEffect, useState } from "react";
import axios from "axios";

interface Slot {
  time: string;          
  available: boolean;
}

export function useSlots(
  serviceId?: string,
  employeeId?: string,
  dateISO?: string,      
) {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!serviceId || !employeeId || !dateISO) return;

    setLoading(true);
    (async () => {
      try {
        //
        // const { data } = await axios.get<Slot[]>(
        //   `/api/availability?serviceId=${serviceId}&employeeId=${employeeId}&date=${dateISO}`,
        // );
        // setSlots(data);

        // Mock temporal
        const horas = [
          "09:00",
          "09:30",
          "10:00",
          "10:30",
          "11:00",
          "11:30",
          "14:00",
          "14:30",
          "15:00",
          "15:30",
          "16:00",
        ];
        setSlots(
          horas.map((h, i) => ({
            time: h,
            available: i % 3 !== 0, 
          })),
        );
      } catch (e) {
        console.error("Error slots:", e);
      } finally {
        setLoading(false);
      }
    })();
  }, [serviceId, employeeId, dateISO]);

  return { slots, loading };
}