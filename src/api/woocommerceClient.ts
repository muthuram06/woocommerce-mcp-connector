import { createRequire } from "node:module";
import { env } from "../config/env.js";

const require = createRequire(import.meta.url);

type WooCommerceApi = {
  get(
    endpoint: string,
    params?: Record<string, unknown>
  ): Promise<{
    data: unknown;
    status: number;
  }>;
};

type WooCommerceApiConstructor = new (options: {
  url: string;
  consumerKey: string;
  consumerSecret: string;
  version: string;
}) => WooCommerceApi;

const WooCommerceRestApi =
  require("@woocommerce/woocommerce-rest-api")
    .default as WooCommerceApiConstructor;

export class WooCommerceClient {
  private readonly client: WooCommerceApi;

  constructor() {
    this.client = new WooCommerceRestApi({
      url: env.WOOCOMMERCE_BASE_URL,
      consumerKey: env.WOOCOMMERCE_CONSUMER_KEY,
      consumerSecret: env.WOOCOMMERCE_CONSUMER_SECRET,
      version: "wc/v3"
    });
  }

  async getProducts() {
    const response = await this.client.get("products", {
      per_page: 5
    });

    return response.data;
  }
}