import { cn } from "@/shared/lib/utils";

interface SkeletonProps {
  className?: string;
}

export const Skeleton = ({ className }: SkeletonProps) => (
  <div
    className={cn(
      "animate-pulse rounded-lg bg-gray-200 dark:bg-neutral-700",
      className,
    )}
  />
);

export const SkeletonCard = () => (
  <div className="rounded-2xl border border-gray-100 dark:border-neutral-700 bg-white dark:bg-neutral-800 p-5 space-y-3">
    <Skeleton className="h-3 w-24" />
    <Skeleton className="h-8 w-16" />
    <Skeleton className="h-3 w-32" />
  </div>
);

export const SkeletonTableRow = () => (
  <div className="flex gap-4 px-4 py-3">
    <Skeleton className="h-4 w-32" />
    <Skeleton className="h-4 w-24" />
    <Skeleton className="h-4 w-20" />
    <Skeleton className="h-4 w-28" />
    <Skeleton className="h-4 w-16" />
  </div>
);
