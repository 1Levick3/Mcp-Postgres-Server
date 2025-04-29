#!/usr/bin/env node

/**
 * PostgreSQL MCP Server Test Client
 * 
 * A command-line tool for testing PostgreSQL MCP Server functionality.
 * 
 * Usage:
 *   node test-client.js <tool-name> <arguments-json>
 * 
 * Available Tools:
 *   - execute_custom_query: Execute custom SQL queries against PostgreSQL
 * 
 * Examples:
 *   # Execute a custom query
 *   node test-client.js execute_custom_query '{
 *     "connectionString": "postgresql://user:password@localhost:5432/dbname",
 *     "query": "SELECT * FROM users",
 *     "timeout": 5000
 *   }'
 */

import { spawn } from 'child_process';
import { resolve } from 'path';

// Parse command line arguments
const toolName = process.argv[2];
const argsJson = process.argv[3] || '{}';

// Validate arguments
if (!toolName) {
  console.error('Error: Tool name is required');
  console.error('\nAvailable Tools:');
  console.error('  - execute_custom_query: Execute custom SQL queries against PostgreSQL');
  console.error('\nUsage:');
  console.error('  node test-client.js <tool-name> <arguments-json>');
  console.error('\nExample:');
  console.error('  node test-client.js execute_custom_query \'{"connectionString":"postgresql://user:password@localhost:5432/dbname","query":"SELECT * FROM users"}\'');
  process.exit(1);
}

// Validate tool name
const validTools = ['execute_custom_query'];
if (!validTools.includes(toolName)) {
  console.error(`Error: Invalid tool name '${toolName}'`);
  console.error('Valid tools are:', validTools.join(', '));
  process.exit(1);
}

// Parse JSON arguments
let args;
try {
  args = JSON.parse(argsJson);
} catch (error) {
  console.error('Error parsing JSON arguments:', error.message);
  console.error('Please provide valid JSON as the second argument');
  process.exit(1);
}

// Validate required arguments for execute_custom_query
if (toolName === 'execute_custom_query') {
  if (!args.connectionString) {
    console.error('Error: connectionString is required for execute_custom_query');
    process.exit(1);
  }
  if (!args.query) {
    console.error('Error: query is required for execute_custom_query');
    process.exit(1);
  }
}

// Path to the MCP server
const serverPath = resolve('./build/index.js');

// Start the MCP server process
const serverProcess = spawn('node', [serverPath], {
  stdio: ['pipe', 'pipe', process.stderr]
});

// Handle server process errors
serverProcess.on('error', (error) => {
  console.error('Failed to start MCP server:', error);
  process.exit(1);
});

// Send request to server
const request = {
  jsonrpc: '2.0',
  id: 1,
  method: 'callTool',
  params: {
    name: toolName,
    arguments: args
  }
};

serverProcess.stdin.write(JSON.stringify(request) + '\n');
serverProcess.stdin.end();

// Collect response data
let responseData = '';
serverProcess.stdout.on('data', (data) => {
  responseData += data.toString();
  
  try {
    // Try to parse the response
    const response = JSON.parse(responseData);
    
    // Handle error response
    if (response.error) {
      console.error('Error:', response.error.message);
      process.exit(1);
    }
    
    // Handle successful response
    if (response.result && response.result.content) {
      const content = response.result.content[0].text;
      try {
        // Try to parse as JSON for pretty printing
        const parsedContent = JSON.parse(content);
        console.log(JSON.stringify(parsedContent, null, 2));
      } catch {
        // If not JSON, print as is
        console.log(content);
      }
    } else {
      console.error('Unexpected response format:', response);
      process.exit(1);
    }
    
    // Clean up and exit
    serverProcess.kill();
    process.exit(0);
  } catch (error) {
    // Not a complete JSON response yet, continue collecting data
  }
});

// Handle process exit
process.on('SIGINT', () => {
  serverProcess.kill();
  process.exit(0);
});

process.on('SIGTERM', () => {
  serverProcess.kill();
  process.exit(0);
}); 
