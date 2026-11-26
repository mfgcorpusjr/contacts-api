import { z } from "zod";

export const signUpSchema = z.object({
  email: z.email({ error: "Email is required." }),
  password: z
    .string({ error: "Password is required." })
    .trim()
    .min(6, { error: "Password must be at least 6 characters." }),
  name: z
    .string({ error: "Name is required." })
    .trim()
    .min(1, { error: "Name is required." }),
});
