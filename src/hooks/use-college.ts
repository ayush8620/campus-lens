import { useQuery } from "@tanstack/react-query";
import type { ApiResponse, CollegeDetail } from "@/types";

async function fetchCollege(slug: string): Promise<ApiResponse<CollegeDetail>> {
  const res = await fetch(`/api/colleges/${slug}`);

  if (!res.ok) {
    throw new Error("Failed to fetch college details");
  }

  return res.json();
}

export function useCollege(slug: string) {
  const queryResult = useQuery({
    queryKey: ["college", slug],
    queryFn: () => fetchCollege(slug),
    enabled: !!slug,
  });

  return {
    data: queryResult.data?.data,
    isLoading: queryResult.isLoading,
    isError: queryResult.isError,
  };
}
