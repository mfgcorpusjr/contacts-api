import { z } from "zod";

export const getAllQuerySchema = z.object({
  page: z.coerce
    .number({ error: "Page must be an integer." })
    .int({ error: "Page must be an integer." })
    .min(1, { error: "Page must be at least 1." })
    .default(1),
  pageSize: z.coerce
    .number({ error: "Page size must be an integer." })
    .int({ error: "Page size must be an interger." })
    .min(1, { error: "Page size must be at least 1." })
    .default(10),
  search: z
    .string()
    .trim()
    .min(1, { error: "Search must be at least 1 character." })
    .optional(),
});
