import { z } from "zod";

export const OrderSchema = z.object({
  id: z.number(),
  parent_id: z.number(),
  status: z.string(),
  currency: z.string(),
  total: z.string(),
  date_created: z.string(),
  date_modified: z.string(),
  payment_method: z.string(),
  payment_method_title: z.string(),
  transaction_id: z.string(),
  customer_id: z.number(),
  billing: z.object({
    first_name: z.string(),
    last_name: z.string(),
    email: z.string(),
    phone: z.string()
  }),
  shipping: z.object({
    first_name: z.string(),
    last_name: z.string(),
    address_1: z.string(),
    address_2: z.string(),
    city: z.string(),
    state: z.string(),
    postcode: z.string(),
    country: z.string()
  }),
  line_items: z.array(
    z.object({
      id: z.number(),
      name: z.string(),
      product_id: z.number(),
      quantity: z.number(),
      total: z.string()
    })
  )
});

export const OrderListSchema = z.array(OrderSchema);

export type Order = z.infer<typeof OrderSchema>;