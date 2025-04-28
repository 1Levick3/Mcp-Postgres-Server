# PostgreSQL MCP Server

A Model Context Protocol (MCP) server that provides direct PostgreSQL database query execution capabilities. This server enables custom SQL query execution against PostgreSQL databases with support for parameterized queries and configurable timeouts.

## Prerequisites

- Node.js >= 18.0.0
- PostgreSQL server (for target database operations)
- Network access to target PostgreSQL instances

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Build the server:
   ```bash
   npm run build
   ```
4. Add to MCP settings file:
   ```json
    {
      "mcpServers": {
        "postgresql-mcp": {
          "command": "node",
          "args": ["/Users/anirjeethv/Desktop/postgresql-mcp-server/build/index.js"],
          "disabled": false,
          "alwaysAllow": [],
          "env": {
            "POSTGRES_CONNECTION_STRING": "postgresUrl",
            "POSTGRES_SSL_CERT_PATH": "/Users/1levick3/Desktop/root.crt"
          }
        }
      }
    }
   ```

## Development

- `npm run dev` - Start development server with hot reload
- `npm run lint` - Run ESLint
- `npm test` - Run tests

## Security Considerations

1. Connection Security
   - Uses connection pooling
   - Implements connection timeouts
   - Validates connection strings
   - Supports SSL/TLS connections


## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request
