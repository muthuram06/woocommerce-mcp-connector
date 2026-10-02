# WooCommerce MCP Connector Architecture

## Overview

WooCommerce MCP Connector is a TypeScript-based, read-only Model Context Protocol (MCP) server that exposes controlled WooCommerce data and store intelligence to AI agents.

The architecture separates authentication, API communication, business logic, validation, retry handling, and MCP tool exposure.

## Architecture

```text
                    AI Agent / Agent Studio
                              |
                              v
                     +------------------+
                     |    MCP Server   |
                     +--------+---------+
                              |
             +----------------+----------------+
             |                |                |
             v                v                v
        Product Tools    Order Tools     Intelligence
        - list           - list          - insights
        - get            - get           - commerce radar
        - search         - search        - sales intelligence
             |                |                |
             +----------------+----------------+
                              |
                              v
                    Service Layer
                              |
                              v
                    WooCommerce Client
                              |
                    Retry / Rate Limit
                              |
                              v
                    WooCommerce REST API
                              |
                              v
                     Local WooCommerce