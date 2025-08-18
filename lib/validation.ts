import { z } from "zod";

export const postSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  tags: z.array(z.string()).optional(),
  link: z.string().url("Must be a valid URL"),
});
