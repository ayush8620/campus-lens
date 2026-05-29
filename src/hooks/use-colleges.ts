import { useInfiniteQuery } from "@tanstack/react-query";
import { useFilterStore } from "@/store/filter-store";
import { useDebounce } from "@/hooks/use-debounce";
import type { ApiResponse, CollegeCard } from "@/types";
import { PAGE_SIZE } from "@/lib/constants";

async function fetchColleges(
  params: Record<string, string>
): Promise<ApiResponse<CollegeCard[]>> {
  const searchParams = new URLSearchParams(params);
  const res = await fetch(`/api/colleges?${searchParams.toString()}`);

  if (!res.ok) {
    throw new Error("Failed to fetch colleges");
  }

  return res.json();
}

export function useColleges() {
  const {
    search,
    state,
    city,
    minFees,
    maxFees,
    minRating,
    ownership,
    naacGrade,
    course,
    sort,
  } = useFilterStore();

  const debouncedSearch = useDebounce(search, 300);

  return useInfiniteQuery({
    queryKey: [
      "colleges",
      {
        search: debouncedSearch,
        state,
        city,
        minFees,
        maxFees,
        minRating,
        ownership,
        naacGrade,
        course,
        sort,
      },
    ],
    queryFn: ({ pageParam }) => {
      const params: Record<string, string> = {};

      if (debouncedSearch) params.search = debouncedSearch;
      if (state) params.state = state;
      if (city) params.city = city;
      if (minFees !== undefined) params.minFees = String(minFees);
      if (maxFees !== undefined) params.maxFees = String(maxFees);
      if (minRating !== undefined) params.minRating = String(minRating);
      if (ownership) params.ownership = ownership;
      if (naacGrade) params.naacGrade = naacGrade;
      if (course) params.course = course;
      if (sort) params.sort = sort;
      if (pageParam) params.cursor = pageParam;
      params.limit = String(PAGE_SIZE);

      return fetchColleges(params);
    },
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.meta?.cursor ?? undefined,
  });
}
