import { z } from "zod";

export const getAllContactsQuerySchema = z.object({
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

export const upsertContactSchema = z.object({
  firstName: z
    .string({ error: "First name is required." })
    .trim()
    .min(1, { error: "First name is required." }),
  lastName: z
    .string({ error: "Last name is required." })
    .trim()
    .min(1, { error: "Last name is required." }),
  email: z.email({ error: "Invalid email." }),
  phone: z
    .string({ error: "Phone must be a string." })
    .trim()
    .min(1, { error: "Phone must be at least 1 character." })
    .optional(),
  address: z
    .string({ error: "Address must be a string." })
    .trim()
    .min(1, { error: "Address must be at least 1 character." })
    .optional(),
});
