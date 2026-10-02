import { createRequire } from "node:module";
import { env } from "../config/env.js";
import { withRetry } from "../rateLimit/retry.js";

const require = createRequire(import.meta.url);

type WooCommerceResponse = {
  data: unknown;
  status: number;
};

type WooCommerceApi = {
  get(
    endpoint: string,
    params?: Record<string, unknown>
  ): Promise<WooCommerceResponse>;
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

  async listProducts(perPage = 10) {
    const response = await this.client.get("products", {
      per_page: perPage
    });

    return response.data;
  }

  async getProduct(productId: number) {
    const response = await withRetry(() =>
        this.client.get(`products/${productId}`)
);

        return response.data;
    }

  async searchProducts(search: string, perPage = 10) {
    const response = await withRetry(() =>
    this.client.get("products", {
        search,
        per_page: perPage
    })
    );
    

    return response.data;
  }

    async listOrders(perPage = 10) {
    const response = await this.client.get("orders", {
      per_page: perPage
    });

    return response.data;
  }

  async getOrder(orderId: number) {
    const response = await this.client.get(`orders/${orderId}`);

    return response.data;
  }

  async searchOrders(search: string, perPage = 10) {
    const response = await this.client.get("orders", {
      search,
      per_page: perPage
    });

    return response.data;
  }
}