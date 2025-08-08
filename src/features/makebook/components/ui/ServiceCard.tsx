import { Card, CardHeader, CardTitle, CardDescription } from "../../../../ui/card";
import type { UIService } from "../../types/Servicio";

interface Props {
  svc: UIService;
  selected: boolean;
  onSelect: () => void;
}

export default function ServiceCard({ svc, selected, onSelect }: Props) {
  return (
    <Card
      onClick={onSelect}
      className={`cursor-pointer transition ${
        selected ? "border-pink-600" : "border-transparent"
      } hover:border-pink-400`}
    >
      <CardHeader>
        <CardTitle>{svc.name}</CardTitle>
        <CardDescription>{svc.duration}</CardDescription>
      </CardHeader>
    </Card>
  );
}
