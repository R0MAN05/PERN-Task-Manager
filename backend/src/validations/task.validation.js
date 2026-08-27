import { z } from "zod";

export const createTaskSchema = z.object({
  title: z.string().min(1, "Task name is required"),

  description: z.string().optional(),

  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).optional(),

  status: z.enum(["TODO", "IN_PROGRESS", "COMPLETED", "CANCELLED"]).optional(),
});

export const updateTaskSchema = createTaskSchema.partial();