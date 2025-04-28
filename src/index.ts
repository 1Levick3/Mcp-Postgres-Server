#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError
} from '@modelcontextprotocol/sdk/types.js';
import { executeCustomQuery } from './tools/custom_query.js';
import { DatabaseConnection } from './utils/connection.js';

// Helper function to get connection string from arguments or environment variable
function getConnectionString(connectionStringArg?: string): string {
  if (connectionStringArg) {
    return connectionStringArg;
  }
  const envConnectionString = process.env.POSTGRES_CONNECTION_STRING;
  if (!envConnectionString) {
    throw new McpError(
      ErrorCode.MethodNotFound,
      'No connection string provided. Set POSTGRES_CONNECTION_STRING environment variable or provide connectionString in the request.'
    );
  }
  return envConnectionString;
}

const TOOL_DEFINITIONS = [
  {
    name: 'execute_custom_query',
    description: 'Execute a custom SQL query against the database. WARNING: Use with care. Do not expose to untrusted input.',
    inputSchema: {
      type: 'object',
      properties: {
        connectionString: {
          type: 'string',
          description: 'PostgreSQL connection string'
        },
        query: {
          type: 'string',
          description: 'SQL query to execute'
        },
        values: {
          type: 'array',
          description: 'Optional parameter values for the query',
          items: { type: 'string' }
        },
        timeout: {
          type: 'number',
          description: 'Optional query timeout in milliseconds'
        }
      },
      required: ['connectionString', 'query']
    }
  }
];

class PostgreSQLServer {
  private server: Server;

  constructor() {
    this.server = new Server(
      {
        name: 'postgresql-mcp-server',
        version: '0.2.0',
      },
      {
        capabilities: {
          tools: TOOL_DEFINITIONS.reduce((acc, tool) => {
            acc[tool.name] = tool;
            return acc;
          }, {} as Record<string, any>),
        },
      }
    );
    this.setupToolHandlers();
    this.server.onerror = (error) => console.error('[MCP Error]', error);
    process.on('SIGINT', async () => {
      await this.cleanup();
      process.exit(0);
    });
    process.on('SIGTERM', async () => {
      await this.cleanup();
      process.exit(0);
    });
  }

  private async cleanup(): Promise<void> {
    console.error('Shutting down PostgreSQL MCP server...');
    await DatabaseConnection.cleanupPools();
    await this.server.close();
  }

  private setupToolHandlers(): void {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: TOOL_DEFINITIONS
    }));
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      try {
        switch (request.params.name) {
          case 'execute_custom_query': {
            const { connectionString, query, values, timeout } = request.params.arguments as {
              connectionString: string;
              query: string;
              values?: unknown[];
              timeout?: number;
            };
            const result = await executeCustomQuery(connectionString, query, values ?? [], { timeout });
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(result, null, 2)
                }
              ]
            };
          }
          default:
            throw new McpError(
              ErrorCode.MethodNotFound,
              `Unknown tool: ${request.params.name}`
            );
        }
      } catch (error) {
        console.error(`Error handling request for tool ${request.params.name}:`, error);
        return {
          content: [
            {
              type: 'text',
              text: `Error: ${error instanceof Error ? error.message : String(error)}`
            }
          ],
          isError: true
        };
      }
    });
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('PostgreSQL MCP server running on stdio');
  }
}

const server = new PostgreSQLServer();
server.run().catch(console.error);