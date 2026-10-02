import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  WOOCOMMERCE_BASE_URL: z.string().url(),
  WOOCOMMERCE_CONSUMER_KEY: z.string().min(1),
  WOOCOMMERCE_CONSUMER_SECRET: z.string().min(1)
});

export const env = envSchema.parse(process.env);