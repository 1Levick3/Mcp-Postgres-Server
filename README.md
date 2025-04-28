# PostgreSQL MCP Server

A Model Context Protocol (MCP) server that provides PostgreSQL database management capabilities. This server assists with analyzing existing PostgreSQL setups, providing implementation guidance, debugging database issues, managing schemas, migrating data, and monitoring database performance.

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

2. Query Safety
   - Validates SQL queries
   - Prevents dangerous operations
   - Implements query timeouts
   - Logs all operations

3. Authentication
   - Supports multiple authentication methods
   - Implements role-based access control
   - Enforces password policies
   - Manages connection credentials securely

## Best Practices

1. Always use secure connection strings with proper credentials
2. Follow production security recommendations for sensitive environments
3. Regularly monitor and analyze database performance
4. Keep PostgreSQL version up to date
5. Implement proper backup strategies
6. Use connection pooling for better resource management
7. Implement proper error handling and logging
8. Regular security audits and updates

## Error Handling

The server implements comprehensive error handling:
- Connection failures
- Query timeouts
- Authentication errors
- Permission issues
- Resource constraints

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request
