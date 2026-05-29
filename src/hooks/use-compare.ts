import { useQuery } from "@tanstack/react-query";
import { useCompareStore } from "@/store/compare-store";
import type { ApiResponse, CompareCollege } from "@/types";

async function fetchCompareData(
  ids: string[]
): Promise<ApiResponse<CompareCollege[]>> {
  const res = await fetch(`/api/compare?ids=${ids.join(",")}`);

  if (!res.ok) {
    throw new Error("Failed to fetch comparison data");
  }

  return res.json();
}

export function useCompare() {
  const colleges = useCompareStore((state) => state.colleges);
  const ids = colleges.map((c) => c.id);

  const queryResult = useQuery({
    queryKey: ["compare", ids],
    queryFn: () => fetchCompareData(ids),
    enabled: ids.length >= 2,
  });

  return {
    data: queryResult.data?.data,
    isLoading: queryResult.isLoading,
    isError: queryResult.isError,
  };
}
