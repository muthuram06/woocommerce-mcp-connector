import { McpServer } from "@modelcontextprotocol/server";
import { serveStdio } from "@modelcontextprotocol/server/stdio";
import * as z from "zod/v4";

import { WooCommerceClient } from "../api/woocommerceClient.js";
import { ProductService } from "../services/productService.js";

const client = new WooCommerceClient();
const productService = new ProductService(client);

const server = new McpServer({
  name: "woocommerce-mcp-connector",
  version: "1.0.0"
});

server.registerTool(
  "list_products",
  {
    title: "List WooCommerce Products",
    description:
      "Retrieve published products from the connected WooCommerce store.",
    inputSchema: z.object({
      perPage: z
        .number()
        .int()
        .min(1)
        .max(50)
        .optional()
        .describe("Number of products to return. Maximum 50.")
    })
  },
  async ({ perPage }) => {
    try {
      const products = await productService.listProducts(perPage ?? 10);

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(products, null, 2)
          }
        ]
      };
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unknown WooCommerce error";

      return {
        content: [
          {
            type: "text",
            text: `Unable to retrieve WooCommerce products: ${message}`
          }
        ],
        isError: true
      };
    }
  }
);

console.error("WooCommerce MCP server starting...");

await serveStdio(() => server);