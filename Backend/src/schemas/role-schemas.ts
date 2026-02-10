import { z } from "zod";

export const roleSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Role name minimum 3 characters" })
    .max(50, { message: "Role name maximum 50 characters" })
    .trim(),
  permissions: z.record(z.string(), z.array(z.string())).optional(),
});
