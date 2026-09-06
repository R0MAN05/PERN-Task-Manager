import { z } from "zod";

export const createProjectSchema = z.object({
  name: z
    .string()
    .min(1, "Project name is required")
    .max(100, "Project name must be at most 100 characters"),

  description: z
    .string()
    .max(2000, "Description must be at most 2000 characters")
    .optional(),
});

export const updateProjectSchema = createProjectSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field is required",
  });