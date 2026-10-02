```md
# Capability and Security Boundaries

## Supported Capabilities

The connector provides controlled read access to WooCommerce.

### Products

- List products
- Retrieve a product by ID
- Search products by keyword

### Orders

- List orders
- Retrieve an order
- Search orders

### Store Intelligence

- Generate aggregated store insights
- Scan the store for operational signals
- Generate sales intelligence
- Identify inventory/catalog issues

## Explicitly Unsupported Capabilities

The connector intentionally does not provide tools for:

- Creating orders
- Updating orders
- Cancelling orders
- Issuing refunds
- Updating products
- Updating inventory
- Changing store configuration
- Accessing payment credentials
- Performing arbitrary WooCommerce API requests

## Security Principle

The project follows the principle of least privilege.

The AI agent receives only the tools required for the intended read-only use cases.

A tool is not exposed simply because the underlying WooCommerce API supports the operation.

## Data Minimization

Intelligence tools prefer aggregated information where possible.

Examples include:

- product counts
- inventory status
- order counts
- revenue aggregates
- sales summaries
- operational alerts

This reduces unnecessary exposure of customer information.

## Input Validation

MCP tool inputs are validated before the underlying service is called.

For example:

```text
productId > 0
perPage >= 1
perPage <= 50