import { email, z } from "zod";

export const getContactsQuerySchema = z.object({
  page: z.coerce
    .number({ error: "Page must be an integer." })
    .int({ error: "Page must be an integer" })
    .min(1, { error: "Page must be at least 1." })
    .default(1),
  pageSize: z.coerce
    .number({ error: "Page size must be an integer." })
    .int({ error: "Page size must be an integer." })
    .min(1, { error: "Page size must be at least 1." })
    .default(10),
  search: z
    .string({ error: "Search must be a string." })
    .trim()
    .min(1, { error: "Search must be at least 1 character." })
    .optional(),
});

export const upsertContactSchema = z.object({
  firstName: z
    .string({ error: "First name is required." })
    .trim()
    .min(1, { error: "First name must be at least 1 character." })
    .max(191, { error: "First name cannot exceed more than 191 characters." }),
  lastName: z
    .string({ error: "Last name is required." })
    .trim()
    .min(1, { error: "Last name must be at least 1 character." })
    .max(191, { error: "Last name cannot exceed more than 191 characters." }),
  email: z.email({ error: "Email is required." }),
  phone: z
    .string({ error: "Phone must be a string." })
    .trim()
    .min(1, { error: "Phone must be at least 1 character." })
    .max(191, { error: "Phone cannot exceed more than 191 characters." })
    .optional(),
  address: z
    .string({ error: "Address must be a string." })
    .trim()
    .min(1, { error: "Address must be at least 1 character." })
    .max(191, { error: "Address cannot exceed more than 191 characters." })
    .optional(),
});
