"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { CollegeCard } from "@/components/college/college-card";
import { CollegeFilters } from "@/components/college/college-filters";
import { SearchBar } from "@/components/shared/search-bar";
import { SkeletonCard } from "@/components/shared/skeleton-card";
import { EmptyState } from "@/components/shared/empty-state";
import { useColleges } from "@/hooks/use-colleges";
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll";
import { useFilterStore } from "@/store/filter-store";
import { GraduationCap, Loader2 } from "lucide-react";

export default function CollegesPage() {
  const searchParams = useSearchParams();
  const { search, setSearch } = useFilterStore();
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
    refetch,
  } = useColleges();

  const { sentinelRef } = useInfiniteScroll({
    onIntersect: fetchNextPage,
    enabled: !!hasNextPage && !isFetchingNextPage,
  });

  useEffect(() => {
    const urlSearch = searchParams.get("search");
    if (urlSearch) setSearch(urlSearch);
  }, [searchParams, setSearch]);

  const colleges = data?.pages.flatMap((page) => page.data ?? []) ?? [];
  const total = data?.pages[0]?.meta?.total ?? 0;

  if (isError) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 text-center">
        <h3 className="text-lg font-semibold mb-2">Something went wrong</h3>
        <p className="text-sm text-muted-foreground mb-6">{(error as Error)?.message}</p>
        <button onClick={() => refetch()} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg">Try Again</button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Explore Colleges</h1>
        <p className="text-muted-foreground">Discover top institutions across India</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <SearchBar value={search || ""} onChange={setSearch} placeholder="Search by college name..." className="flex-1" />
      </div>

      {!isLoading && (
        <p className="text-sm text-muted-foreground mb-6">
          {total > 0 ? `Showing ${colleges.length} of ${total} colleges` : "No colleges found"}
        </p>
      )}

      <div className="flex gap-8">
        {/* CollegeFilters handles both desktop sidebar and mobile sheet trigger */}
        <CollegeFilters />

        <div className="flex-1 min-w-0">
          {isLoading ? (
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : colleges.length === 0 ? (
            <EmptyState
              icon={GraduationCap}
              title="No colleges found"
              description="Try adjusting your search or filters to find what you're looking for."
              actionLabel="Clear Filters"
              onAction={() => useFilterStore.getState().resetFilters()}
            />
          ) : (
            <>
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {colleges.map((college, i) => (
                  <CollegeCard key={`${college.id}-${i}`} college={college} index={i} />
                ))}
              </div>
              <div ref={sentinelRef} className="flex justify-center py-8">
                {isFetchingNextPage && <Loader2 className="h-6 w-6 animate-spin text-primary" />}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
