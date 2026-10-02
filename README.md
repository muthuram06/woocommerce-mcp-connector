# WooCommerce MCP Connector

A secure, read-only Model Context Protocol (MCP) connector that exposes WooCommerce store data and operational intelligence to AI agents.

The connector provides structured access to products and orders while adding privacy-aware store analytics, operational anomaly detection, and sales intelligence.

## ✨ Highlights

- 🔐 Environment-based WooCommerce authentication
- 🛡️ Read-only capability boundary
- 🤖 MCP-compatible AI agent tools
- 📦 Product listing, lookup, and search
- 🧾 Order listing, lookup, and search
- 📊 Privacy-safe store insights
- 🚨 Commerce Radar for operational alerts
- 📈 Sales intelligence
- 🔄 Automatic retry handling for transient API failures
- ⏱️ HTTP 429 / rate-limit handling with backoff
- ✅ Zod-based input validation
- 🧪 Automated unit tests
- 🐳 Docker-ready architecture
- 📚 Architecture and capability documentation

---

## Architecture

```text
                    AI Agent / Agent Studio
                              │
                              ▼
                     ┌─────────────────┐
                     │   MCP Server    │
                     └────────┬────────┘
                              │
          ┌───────────────────┼───────────────────┐
          │                   │                   │
          ▼                   ▼                   ▼
     Data Tools        Intelligence Tools    Resilience
          │                   │                   │
   ┌──────┴──────┐     ┌──────┴────────┐     ┌────┴─────┐
   │             │     │               │     │          │
Products       Orders  Insights     Commerce  Retry    429
Search         Search  Radar        Sales     Backoff  Handling
   │             │     │               │
   └─────────────┴─────┴───────────────┘
                         │
                         ▼
                WooCommerce REST API
                         │
                         ▼
                    WooCommerce
