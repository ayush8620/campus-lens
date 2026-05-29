import { useMutation } from "@tanstack/react-query";
import type { PredictorInput, PredictorResponse, ApiResponse } from "@/types";

async function fetchPredictions(
  input: PredictorInput
): Promise<ApiResponse<PredictorResponse>> {
  const res = await fetch("/api/predictor", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  if (!res.ok) {
    throw new Error("Failed to fetch predictions");
  }

  return res.json();
}

export function usePredictor() {
  const mutation = useMutation({
    mutationFn: fetchPredictions,
  });

  return {
    mutate: mutation.mutate,
    data: mutation.data?.data,
    isPending: mutation.isPending,
    isError: mutation.isError,
  };
}
