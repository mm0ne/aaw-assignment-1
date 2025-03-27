import { z } from "zod";

export const deleteCartItemSchemaV2 = z.object({
  params: z.object({
    product_id: z.string().uuid(),
  }),
});
