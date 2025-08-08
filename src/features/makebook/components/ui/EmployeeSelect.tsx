import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "../../../../ui/select";
import { Avatar, AvatarImage, AvatarFallback } from "../../../../ui/avatar";

interface Props {
  empleados: { id: string; name: string; avatar: string }[];
  value?: string;
  onChange: (id: string) => void;
}

export default function EmployeeSelect({ empleados, value, onChange }: Props) {
  const selectedEmpleado = empleados.find((e) => e.id === value);

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-full min-h-[44px] flex items-center gap-2 px-3">
        {selectedEmpleado ? (
          <>
            <Avatar className="h-6 w-6">
              <AvatarImage src={selectedEmpleado.avatar} />
              <AvatarFallback>{selectedEmpleado.name[0]}</AvatarFallback>
            </Avatar>
            <span className="truncate">{selectedEmpleado.name}</span>
          </>
        ) : (
          <span className="text-muted-foreground">Elegir encargado</span>
        )}
      </SelectTrigger>

      <SelectContent>
        {empleados.map((e) => (
          <SelectItem key={e.id} value={e.id}>
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src={e.avatar} />
                <AvatarFallback>{e.name[0]}</AvatarFallback>
              </Avatar>
              <span className="truncate">{e.name}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
