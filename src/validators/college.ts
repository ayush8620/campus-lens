import { z } from "zod";

export const collegeQuerySchema = z.object({
  search: z.string().optional(),
  state: z.string().optional(),
  city: z.string().optional(),
  minFees: z.coerce.number().min(0).optional(),
  maxFees: z.coerce.number().min(0).optional(),
  minRating: z.coerce.number().min(0).max(5).optional(),
  ownership: z.enum(["GOVERNMENT", "PRIVATE", "PUBLIC_PRIVATE", "DEEMED", "AUTONOMOUS"]).optional(),
  naacGrade: z.enum(["A_PLUS_PLUS", "A_PLUS", "A", "B_PLUS_PLUS", "B_PLUS", "B", "C", "NOT_ACCREDITED"]).optional(),
  course: z.string().optional(),
  sort: z.enum(["rating_desc", "fees_asc", "fees_desc", "placement_desc", "name_asc", "name_desc"]).optional(),
  cursor: z.string().optional(),
  limit: z.coerce.number().min(1).max(50).default(12),
});

export type CollegeQueryInput = z.infer<typeof collegeQuerySchema>;
