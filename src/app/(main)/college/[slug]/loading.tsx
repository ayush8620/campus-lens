import { Skeleton } from "@/components/ui/skeleton";

export default function CollegeDetailLoading() {
  return (
    <div>
      <Skeleton className="h-64 sm:h-80 w-full rounded-none" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <Skeleton className="h-10 w-96" />
        <Skeleton className="h-6 w-64" />
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <Skeleton className="h-48 w-full rounded-xl" />
            <Skeleton className="h-32 w-full rounded-xl" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-48 w-full rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
