export const inputClass =
  "w-full px-3 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-gray-900 dark:text-neutral-100 focus:outline-none focus:ring-2 transition-all";

export const labelClass =
  "block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-neutral-400 mb-1.5";

export const getRingStyle = (color: string): React.CSSProperties =>
  ({ "--tw-ring-color": color }) as React.CSSProperties;
