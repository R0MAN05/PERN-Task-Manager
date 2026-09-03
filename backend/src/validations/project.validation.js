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

export const updateProjectSchema = createProjectSchema.partial();