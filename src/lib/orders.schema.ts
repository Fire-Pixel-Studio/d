import { z } from "zod";

export const orderInputSchema = z.object({
  customer_name: z.string().trim().min(2).max(100),
  phone: z.string().trim().min(6).max(20),
  address: z.string().trim().min(5).max(300),
  city: z.string().trim().min(2).max(80),
  note: z.string().trim().max(500),
  items: z
    .array(
      z.object({
        slug: z.string().trim().min(1).max(120),
        size: z.string().trim().max(20),
        quantity: z.number().int().min(1).max(10),
      }),
    )
    .min(1)
    .max(30),
});

export type OrderInput = z.infer<typeof orderInputSchema>;
