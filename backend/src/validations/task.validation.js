import { z } from "zod";

export const createTaskSchema = z.object({
  title: z.string().min(1, "Task name is required").max(200, "Task title must be at most 200 characters"),

  description: z.string().max(2000, "Description must be at most 2000 characters").optional(),

  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).optional(),

  status: z.enum(["TODO", "IN_PROGRESS", "COMPLETED", "CANCELLED"]).optional(),
});

export const updateTaskSchema = createTaskSchema.partial();