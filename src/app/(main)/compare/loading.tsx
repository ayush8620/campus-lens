import { Skeleton } from "@/components/ui/skeleton";
export default function CompareLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <Skeleton className="h-8 w-64 mb-2" />
      <Skeleton className="h-5 w-48 mb-8" />
      <div className="grid grid-cols-3 gap-6 mb-8">
        {[1, 2, 3].map((i) => (<Skeleton key={i} className="h-56 rounded-xl" />))}
      </div>
      <Skeleton className="h-72 rounded-xl mb-8" />
      <Skeleton className="h-96 rounded-xl" />
    </div>
  );
}
