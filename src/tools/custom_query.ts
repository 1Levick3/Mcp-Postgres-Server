import { DatabaseConnection } from '../utils/connection.js';

/**
 * Result type for custom query execution
 */
export interface CustomQueryResult {
  success: boolean;
  message: string;
  details: unknown;
}

/**
 * Execute a custom SQL query against the database.
 * WARNING: This tool allows execution of arbitrary SQL. Use with care and do not expose to untrusted input.
 */
export async function executeCustomQuery(
  connectionString: string,
  query: string,
  values: unknown[] = [],
  options: { timeout?: number } = {}
): Promise<CustomQueryResult> {
  const db = DatabaseConnection.getInstance();
  try {
    await db.connect(connectionString);
    const result = await db.query(query, values, options);
    return {
      success: true,
      message: 'Query executed successfully',
      details: result
    };
  } catch (error) {
    return {
      success: false,
      message: `Query execution failed: ${error instanceof Error ? error.message : String(error)}`,
      details: null
    };
  } finally {
    await db.disconnect();
  }
} 