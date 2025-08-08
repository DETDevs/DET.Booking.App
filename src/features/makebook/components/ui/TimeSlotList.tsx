import { Button } from "@/components/ui/button";

interface Slot {
  time: string;
  available: boolean;
}

export default function TimeSlotList({
  slots,
  selected,
  onSelect,
}: {
  slots: Slot[];
  selected?: string;
  onSelect: (t: string) => void;
}) {
  if (!slots.length) return <p className="text-sm">No hay horarios.</p>;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
      {slots.map((s) => (
        <Button
          key={s.time}
          variant={s.time === selected ? "default" : "outline"}
          disabled={!s.available}
          onClick={() => onSelect(s.time)}
          className="justify-center"
        >
          {s.time}
        </Button>
      ))}
    </div>
  );
}
