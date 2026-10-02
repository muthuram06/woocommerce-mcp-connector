import { WooCommerceClient } from "../api/woocommerceClient.js";

export class InsightService {
  constructor(
    private readonly client: WooCommerceClient
  ) {}

  async getStoreInsights() {
    const [products, orders] = await Promise.all([
      this.client.listProducts(50),
      this.client.listOrders(50)
    ]);

    const productList = Array.isArray(products) ? products : [];
    const orderList = Array.isArray(orders) ? orders : [];

    const inStock = productList.filter(
      (product: any) => product.stock_status === "instock"
    );

    const outOfStock = productList.filter(
      (product: any) => product.stock_status === "outofstock"
    );

    const lowStock = productList.filter(
      (product: any) =>
        typeof product.stock_quantity === "number" &&
        product.stock_quantity > 0 &&
        product.stock_quantity <= 5
    );

    const statusBreakdown = orderList.reduce(
      (result: Record<string, number>, order: any) => {
        const status = order.status ?? "unknown";

        result[status] = (result[status] ?? 0) + 1;

        return result;
      },
      {}
    );

    const completedOrders = orderList.filter(
      (order: any) => order.status === "completed"
    );

    const revenue = completedOrders.reduce(
      (total: number, order: any) =>
        total + Number(order.total || 0),
      0
    );

    const averageOrderValue =
      completedOrders.length > 0
        ? revenue / completedOrders.length
        : 0;

    return {
      generatedAt: new Date().toISOString(),

      products: {
        total: productList.length,
        inStock: inStock.length,
        lowStock: lowStock.length,
        outOfStock: outOfStock.length,

        lowStockItems: lowStock.map((product: any) => ({
          id: product.id,
          name: product.name,
          stockQuantity: product.stock_quantity
        })),

        outOfStockItems: outOfStock.map((product: any) => ({
          id: product.id,
          name: product.name
        }))
      },

      orders: {
        total: orderList.length,
        statusBreakdown
      },

      sales: {
        completedOrders: completedOrders.length,
        completedRevenue: revenue.toFixed(2),
        averageOrderValue: averageOrderValue.toFixed(2)
      },

      privacy: {
        customerPersonalDataIncluded: false,
        paymentCredentialsIncluded: false,
        transactionIdsIncluded: false
      }
    };
  }
}