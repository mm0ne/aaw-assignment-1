import { z } from "zod";

export const deleteProductSchema = z.object({
  params: z.object({
    productIdd: z.string({ required_error: "Product ID is required" }).uuid(),
  }),
});
