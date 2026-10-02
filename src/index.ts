import { WooCommerceClient } from "./api/woocommerceClient.js";
import { ProductService } from "./services/productService.js";

async function main() {
  const client = new WooCommerceClient();
  const productService = new ProductService(client);

  console.log("\n=== LIST PRODUCTS ===");

  const products = await productService.listProducts(5);

  for (const product of products) {
    console.log(
      `${product.id} | ${product.name} | ₹${product.price}`
    );
  }

  console.log("\n=== GET PRODUCT ===");

  const product = await productService.getProduct(12);

  console.log({
    id: product.id,
    name: product.name,
    price: product.price,
    stockStatus: product.stock_status
  });

  console.log("\n=== SEARCH PRODUCTS ===");

  const results = await productService.searchProducts("mouse");

  for (const item of results) {
    console.log(
      `${item.id} | ${item.name} | ₹${item.price}`
    );
  }
}

main().catch((error) => {
  console.error("Application failed:", error);
  process.exit(1);
});