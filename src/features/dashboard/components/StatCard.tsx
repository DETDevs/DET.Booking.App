interface Props {
  label: string;
  value: number;
  delta: number; 
}

export const StatCard = ({ label, value, delta }: Props) => (
  <div className="rounded-lg border bg-white p-4 shadow-sm">
    <p className="text-sm text-gray-500">{label}</p>
    <p className="text-2xl font-semibold">{value.toLocaleString()}</p>
    <p className={`text-sm ${delta >= 0 ? "text-green-600" : "text-red-600"}`}>
      {delta > 0 ? "▲" : "▼"} {Math.abs(delta)}% {delta > 0 ? "Up" : "Down"} from yesterday
    </p>
  </div>
);
