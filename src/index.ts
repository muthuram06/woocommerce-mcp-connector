import { WooCommerceClient } from "./api/woocommerceClient.js";

async function main() {
  const client = new WooCommerceClient();

  const products = await client.getProducts();

  console.log(JSON.stringify(products, null, 2));
}

main().catch((error) => {
  console.error("Application failed:", error);
  process.exit(1);
});