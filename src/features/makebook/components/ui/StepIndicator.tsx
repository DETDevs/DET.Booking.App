type Props = {
  step: number;  
  total: number;
};

export default function StepIndicator({ step, total }: Props) {
  const progressPct = ((step + 1) / total) * 100; 
  const label       = `Paso ${step + 1} de ${total}`;

  return (
    <div className="w-full space-y-1">
      <p className="text-sm font-semibold text-pink-600">{label}</p>

      <div className="h-2 w-full rounded-full bg-gray-200 overflow-hidden">
        <div
          className="h-full bg-pink-500 transition-all duration-300 rounded-full"
          style={{ width: `${progressPct}%` }}
        />
      </div>
    </div>
  );
}
