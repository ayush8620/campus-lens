import { SkeletonCard } from "@/components/shared/skeleton-card";

export default function CollegesLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="h-8 w-48 bg-muted animate-pulse rounded mb-2" />
      <div className="h-4 w-72 bg-muted animate-pulse rounded mb-8" />
      <div className="h-11 w-full bg-muted animate-pulse rounded-lg mb-6" />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    </div>
  );
}
