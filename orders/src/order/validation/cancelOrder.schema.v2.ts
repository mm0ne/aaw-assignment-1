import { z } from "zod";

export const cancelOrderSchemaV2 = z.object({
  body: z.object({
    orderId: z.string().uuid(),
  }),
});
