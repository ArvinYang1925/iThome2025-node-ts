import { z } from "zod";

export const createTodoSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }).max(100, { message: "Title must be at most 100 characters" }),
});

export const updateTodoSchema = z.object({
  title: z.string().optional(),
  completed: z.boolean().optional(),
});
