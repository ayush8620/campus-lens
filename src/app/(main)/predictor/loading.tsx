import { Skeleton } from "@/components/ui/skeleton";
export default function PredictorLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-10">
        <Skeleton className="h-14 w-14 rounded-2xl mx-auto mb-4" />
        <Skeleton className="h-8 w-64 mx-auto mb-2" />
        <Skeleton className="h-5 w-96 mx-auto" />
      </div>
      <div className="grid lg:grid-cols-5 gap-8">
        <Skeleton className="lg:col-span-2 h-[500px] rounded-xl" />
        <div className="lg:col-span-3 space-y-4">
          {[1,2,3].map(i => <Skeleton key={i} className="h-24 rounded-xl" />)}
        </div>
      </div>
    </div>
  );
}
