interface Props {
  label: string;
  value: number;
  delta: number;
}

export const StatCard = ({ label, value, delta }: Props) => (
  <div className="rounded-2xl border border-gray-100 dark:border-neutral-700 bg-white dark:bg-neutral-800 p-5 shadow-sm hover:shadow-md transition-all duration-300">
    <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-neutral-500 mb-1">
      {label}
    </p>
    <p className="text-3xl font-bold text-gray-900 dark:text-white">
      {value.toLocaleString()}
    </p>
    <p
      className={`text-sm mt-1 ${delta >= 0 ? "text-green-500" : "text-red-400"}`}
    >
      {delta > 0 ? "▲" : "▼"} {Math.abs(delta)}% {delta > 0 ? "más" : "menos"}{" "}
      que ayer
    </p>
  </div>
);
