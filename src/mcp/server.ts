import { McpServer } from "@modelcontextprotocol/server";
import { serveStdio } from "@modelcontextprotocol/server/stdio";
import { InsightService } from "../services/insightService.js";
import { CommerceRadarService } from "../services/commerceRadarService.js";
import * as z from "zod/v4";

import { WooCommerceClient } from "../api/woocommerceClient.js";
import { ProductService } from "../services/productService.js";

const client = new WooCommerceClient();
const productService = new ProductService(client);
const insightService = new InsightService(client);
const commerceRadarService =
  new CommerceRadarService(client);

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

server.registerTool(
  "search_products",
  {
    title: "Search WooCommerce Products",
    description:
      "Search WooCommerce products by name or keyword.",
    inputSchema: z.object({
      search: z
        .string()
        .min(1)
        .max(100)
        .describe("Product name or keyword to search for."),
      perPage: z
        .number()
        .int()
        .min(1)
        .max(50)
        .optional()
        .describe("Maximum number of matching products to return.")
    })
  },
  async ({ search, perPage }) => {
    try {
      const products = await productService.searchProducts(
        search,
        perPage ?? 10
      );

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
            text: `Unable to search WooCommerce products: ${message}`
          }
        ],
        isError: true
      };
    }
  }
);

server.registerTool(
  "store_insights",
  {
    title: "WooCommerce Store Insights",
    description:
      "Generate a privacy-safe summary of WooCommerce product inventory, order activity, and completed sales.",
    inputSchema: z.object({})
  },
  async () => {
    try {
      const insights = await insightService.getStoreInsights();

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(insights, null, 2)
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
            text: `Unable to generate store insights: ${message}`
          }
        ],
        isError: true
      };
    }
  }
);

server.registerTool(
  "commerce_radar",
  {
    title: "WooCommerce Commerce Radar",
    description:
      "Scan the WooCommerce store for inventory, catalog, and order issues and return prioritized actionable alerts.",
    inputSchema: z.object({})
  },
  async () => {
    try {
      const radar = await commerceRadarService.scan();

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(radar, null, 2)
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
            text: `Unable to scan WooCommerce store: ${message}`
          }
        ],
        isError: true
      };
    }
  }
);

console.error("WooCommerce MCP server starting...");
server.registerTool(
  "get_product",
  {
    title: "Get WooCommerce Product",
    description:
      "Retrieve a single WooCommerce product by its product ID.",
    inputSchema: z.object({
      productId: z
        .number()
        .int()
        .positive()
        .describe("WooCommerce product ID.")
    })
  },
  async ({ productId }) => {
    try {
      const product = await productService.getProduct(productId);

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(product, null, 2)
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
            text: `Unable to retrieve WooCommerce product: ${message}`
          }
        ],
        isError: true
      };
    }
  }
);

await serveStdio(() => server);