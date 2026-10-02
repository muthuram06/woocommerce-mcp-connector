import { WooCommerceClient } from "../api/woocommerceClient.js";
import {
  ProductListSchema,
  ProductSchema
} from "../schemas/product.js";

export class ProductService {
  constructor(
    private readonly client: WooCommerceClient
  ) {}

  async listProducts(perPage = 10) {
    const data = await this.client.listProducts(perPage);

    return ProductListSchema.parse(data);
  }

  async getProduct(productId: number) {
    const data = await this.client.getProduct(productId);

    return ProductSchema.parse(data);
  }

  async searchProducts(search: string, perPage = 10) {
    const data = await this.client.searchProducts(
      search,
      perPage
    );

    return ProductListSchema.parse(data);
  }
}