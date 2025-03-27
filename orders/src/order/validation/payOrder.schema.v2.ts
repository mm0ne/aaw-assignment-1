import { z } from "zod";

export const payOrderSchemaV2 = z.object({
  body: z.object({
    orderId: z.string().uuid(),
    payment_method: z.string(),
    payment_reference: z.string(),
    amount: z.number().int().positive(),
  }),
});
