import { z } from "zod";

export const ProductSchema = z.object({
  id: z.number(),
  name: z.string(),
  slug: z.string(),
  permalink: z.string().url(),
  type: z.string(),
  status: z.string(),
  sku: z.string(),
  price: z.string(),
  regular_price: z.string(),
  sale_price: z.string(),
  stock_status: z.string(),
  stock_quantity: z.number().nullable(),
  description: z.string(),
  short_description: z.string(),
  categories: z.array(
    z.object({
      id: z.number(),
      name: z.string(),
      slug: z.string()
    })
  )
});

export const ProductListSchema = z.array(ProductSchema);

export type Product = z.infer<typeof ProductSchema>;