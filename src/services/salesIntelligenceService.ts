import { WooCommerceClient } from "../api/woocommerceClient.js";

type ProductSales = {
  productId: number;
  name: string;
  quantity: number;
  revenue: number;
};

export class SalesIntelligenceService {
  constructor(
    private readonly client: WooCommerceClient
  ) {}

  async analyze() {
    const ordersData = await this.client.listOrders(100);
    const orders = Array.isArray(ordersData) ? ordersData : [];

    const completedOrders = orders.filter(
      (order: any) => order.status === "completed"
    );

    const productMap = new Map<number, ProductSales>();

    let revenue = 0;

    for (const order of completedOrders as any[]) {
      revenue += Number(order.total || 0);

      for (const item of order.line_items ?? []) {
        const productId = Number(item.product_id || 0);
        const quantity = Number(item.quantity || 0);
        const itemRevenue = Number(item.total || 0);

        if (!productId) {
          continue;
        }

        const existing = productMap.get(productId);

        if (existing) {
          existing.quantity += quantity;
          existing.revenue += itemRevenue;
        } else {
          productMap.set(productId, {
            productId,
            name: String(item.name || "Unknown product"),
            quantity,
            revenue: itemRevenue
          });
        }
      }
    }

    const topProducts = [...productMap.values()]
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10)
      .map((product) => ({
        ...product,
        revenue: product.revenue.toFixed(2)
      }));

    const averageOrderValue =
      completedOrders.length > 0
        ? revenue / completedOrders.length
        : 0;

    const statusBreakdown = orders.reduce(
      (result: Record<string, number>, order: any) => {
        const status = String(order.status || "unknown");

        result[status] = (result[status] ?? 0) + 1;

        return result;
      },
      {}
    );

    return {
      generatedAt: new Date().toISOString(),

      ordersAnalyzed: orders.length,

      completedOrders: completedOrders.length,

      revenue: {
        completedRevenue: revenue.toFixed(2),
        averageOrderValue: averageOrderValue.toFixed(2)
      },

      statusBreakdown,

      topProducts,

      privacy: {
        customerPersonalDataIncluded: false,
        billingAddressesIncluded: false,
        shippingAddressesIncluded: false,
        paymentCredentialsIncluded: false,
        transactionIdsIncluded: false
      }
    };
  }
}