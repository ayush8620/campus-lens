import { z } from "zod";

export const predictorSchema = z.object({
  exam: z.enum(["JEE_MAIN", "JEE_ADVANCED", "CUET", "AKTU", "NEET", "BITSAT", "VITEEE", "COMEDK", "MET", "STATE_CET"]),
  rank: z.number().int().min(1).max(10000000),
  category: z.enum(["GENERAL", "OBC", "SC", "ST", "EWS"]),
  homeState: z.string().optional(),
  preferredCity: z.string().optional(),
  preferredBranch: z.string().min(1, "Branch is required"),
});

export type PredictorInput = z.infer<typeof predictorSchema>;
