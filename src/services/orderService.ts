import { WooCommerceClient } from "../api/woocommerceClient.js";
import {
  OrderListSchema,
  OrderSchema
} from "../schemas/order.js";

export class OrderService {
  constructor(
    private readonly client: WooCommerceClient
  ) {}

  async listOrders(perPage = 10) {
    const data = await this.client.listOrders(perPage);

    return OrderListSchema.parse(data);
  }

  async getOrder(orderId: number) {
    const data = await this.client.getOrder(orderId);

    return OrderSchema.parse(data);
  }

  async searchOrders(search: string, perPage = 10) {
    const data = await this.client.searchOrders(
      search,
      perPage
    );

    return OrderListSchema.parse(data);
  }
}