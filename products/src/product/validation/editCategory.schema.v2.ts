import { z } from "zod";

export const editCategorySchemaV2 = z.object({
  body: z.object({
    category_id: z.string({ required_error: "Category ID is required" }).uuid(),
    name: z.string().optional(),
  }),
});
