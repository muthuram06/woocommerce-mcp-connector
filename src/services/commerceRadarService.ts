import { WooCommerceClient } from "../api/woocommerceClient.js";

type RadarAlert = {
  severity: "high" | "medium" | "low";
  category: "inventory" | "catalog" | "orders";
  message: string;
  evidence: Record<string, unknown>;
};

export class CommerceRadarService {
  constructor(
    private readonly client: WooCommerceClient
  ) {}

  async scan() {
    const [productsData, ordersData] = await Promise.all([
      this.client.listProducts(50),
      this.client.listOrders(50)
    ]);

    const products = Array.isArray(productsData)
      ? productsData
      : [];

    const orders = Array.isArray(ordersData)
      ? ordersData
      : [];

    const alerts: RadarAlert[] = [];

    // Inventory and catalog analysis
    for (const product of products as any[]) {
      if (product.stock_status === "outofstock") {
        alerts.push({
          severity: "high",
          category: "inventory",
          message: `${product.name} is out of stock.`,
          evidence: {
            productId: product.id,
            stockStatus: product.stock_status
          }
        });
      }

      if (
        typeof product.stock_quantity === "number" &&
        product.stock_quantity > 0 &&
        product.stock_quantity <= 5
      ) {
        alerts.push({
          severity: "medium",
          category: "inventory",
          message: `${product.name} has low stock.`,
          evidence: {
            productId: product.id,
            stockQuantity: product.stock_quantity
          }
        });
      }

      if (!product.sku) {
        alerts.push({
          severity: "medium",
          category: "catalog",
          message: `${product.name} does not have a SKU.`,
          evidence: {
            productId: product.id
          }
        });
      }

      if (!product.price) {
        alerts.push({
          severity: "high",
          category: "catalog",
          message: `${product.name} does not have a configured price.`,
          evidence: {
            productId: product.id
          }
        });
      }

      if (!product.short_description && !product.description) {
        alerts.push({
          severity: "low",
          category: "catalog",
          message: `${product.name} has no product description.`,
          evidence: {
            productId: product.id
          }
        });
      }
    }

    // Order analysis
    const failedOrders = (orders as any[]).filter(
      (order) => order.status === "failed"
    );

    const pendingOrders = (orders as any[]).filter(
      (order) => order.status === "pending"
    );

    if (failedOrders.length > 0) {
      alerts.push({
        severity: "high",
        category: "orders",
        message: `${failedOrders.length} failed order(s) detected.`,
        evidence: {
          count: failedOrders.length
        }
      });
    }

    if (pendingOrders.length > 0) {
      alerts.push({
        severity: "medium",
        category: "orders",
        message: `${pendingOrders.length} pending order(s) detected.`,
        evidence: {
          count: pendingOrders.length
        }
      });
    }

    const severityRank = {
      high: 0,
      medium: 1,
      low: 2
    };

    alerts.sort(
      (a, b) =>
        severityRank[a.severity] -
        severityRank[b.severity]
    );

    return {
      generatedAt: new Date().toISOString(),

      summary: {
        productsScanned: products.length,
        ordersScanned: orders.length,
        alertsFound: alerts.length,
        high: alerts.filter(
          (alert) => alert.severity === "high"
        ).length,
        medium: alerts.filter(
          (alert) => alert.severity === "medium"
        ).length,
        low: alerts.filter(
          (alert) => alert.severity === "low"
        ).length
      },

      alerts,

      privacy: {
        customerPersonalDataIncluded: false,
        paymentCredentialsIncluded: false,
        transactionIdsIncluded: false
      }
    };
  }
}