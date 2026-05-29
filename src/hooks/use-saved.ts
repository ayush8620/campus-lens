import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@clerk/nextjs";
import type { ApiResponse, SavedCollegeItem } from "@/types";

async function fetchSaved(): Promise<ApiResponse<SavedCollegeItem[]>> {
  const res = await fetch("/api/saved");
  if (!res.ok) throw new Error("Failed to fetch saved colleges");
  return res.json();
}

async function saveCollege(collegeId: string): Promise<ApiResponse<SavedCollegeItem>> {
  const res = await fetch("/api/saved", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ collegeId }),
  });
  if (!res.ok) throw new Error("Failed to save college");
  return res.json();
}

async function unsaveCollege(collegeId: string): Promise<ApiResponse<null>> {
  const res = await fetch(`/api/saved?collegeId=${collegeId}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to unsave college");
  return res.json();
}

export function useGetSaved() {
  const { isSignedIn } = useAuth();

  const queryResult = useQuery({
    queryKey: ["saved"],
    queryFn: fetchSaved,
    enabled: !!isSignedIn,
  });

  return {
    data: queryResult.data?.data ?? [],
    isLoading: queryResult.isLoading,
    isError: queryResult.isError,
  };
}

export function useSaveCollege() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: saveCollege,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["saved"] });
    },
  });
}

export function useUnsaveCollege() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: unsaveCollege,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["saved"] });
    },
  });
}

// Returns { data: boolean } to match the destructuring pattern used in components
export function useIsSaved(collegeId: string) {
  const { data } = useGetSaved();
  return { data: data?.some((item) => item.collegeId === collegeId) ?? false };
}
