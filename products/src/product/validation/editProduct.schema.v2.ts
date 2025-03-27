import { z } from "zod";

export const editProductSchemaV2 = z.object({
  body: z.object({
    id: z.string({ required_error: "Product ID is required" }).uuid(),
    name: z.string().optional(),
    description: z.string().optional(),
    price: z.number().optional(),
    quantity_available: z.number().optional(),
    category_id: z.string().uuid().optional(),
  }),
});
