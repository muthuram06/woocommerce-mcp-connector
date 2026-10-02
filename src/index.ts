import { WooCommerceClient } from "./api/woocommerceClient.js";
import { OrderService } from "./services/orderService.js";

async function main() {
  const client = new WooCommerceClient();
  const orderService = new OrderService(client);

  console.log("\n=== LIST ORDERS ===");

  const orders = await orderService.listOrders(10);

  for (const order of orders) {
    console.log(
      `${order.id} | ${order.status} | ₹${order.total}`
    );
  }
}

main().catch((error) => {
  console.error("Application failed:", error);
  process.exit(1);
});