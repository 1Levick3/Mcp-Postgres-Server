import { z } from 'zod';
// Remove direct import of sql from @vercel/postgres
// import { sql } from '@vercel/postgres'; 
import { DatabaseConnection } from '../utils/connection.js'; // Use the custom connection wrapper
// Remove MCP specific type imports - rely on structural typing
// import type { MCPToolDefinition, MCPToolExecuteInput } from '../types.js';

// Define return type structure similar to schema.ts
interface EnumResult {
  success: boolean;
  message: string;
  details: unknown;
}

interface EnumInfo {
  enum_schema: string;
  enum_name: string;
  enum_values: string[];
}

const getEnumsInput = z.object({
  connectionString: z.string().describe('PostgreSQL connection string'),
  schema: z.string().optional().default('public').describe('Schema name (defaults to public)'),
  enumName: z.string().optional().describe('Optional specific ENUM name to filter by'),
});

const createEnumInput = z.object({
  connectionString: z.string().describe('PostgreSQL connection string'),
  enumName: z.string().describe('Name of the ENUM type to create'),
  values: z.array(z.string()).min(1).describe('List of values for the ENUM type'),
  schema: z.string().optional().default('public').describe('Schema name (defaults to public)'),
  ifNotExists: z.boolean().optional().default(false).describe('Include IF NOT EXISTS clause'),
});

// Use inferred input type and expected Promise<EnumResult> return type
export async function getEnums(input: z.infer<typeof getEnumsInput>): Promise<EnumResult> {
  const { connectionString, schema, enumName } = input;
  const db = DatabaseConnection.getInstance();
  try {
    await db.connect(connectionString);
    let query = `
      SELECT 
          n.nspname as enum_schema,
          t.typname as enum_name, 
          array_agg(e.enumlabel ORDER BY e.enumsortorder) as enum_values
      FROM pg_type t 
      JOIN pg_enum e ON t.oid = e.enumtypid
      JOIN pg_catalog.pg_namespace n ON n.oid = t.typnamespace
      WHERE n.nspname = $1 AND t.typtype = 'e'
    `;
    const params: (string | undefined)[] = [schema];

    if (enumName) {
      query += ' AND t.typname = $2';
      params.push(enumName);
    }

    query += ' GROUP BY n.nspname, t.typname ORDER BY n.nspname, t.typname;';

    const result = await db.query<EnumInfo>(query, params.filter(p => p !== undefined) as string[]); 
    
    return {
        success: true,
        message: enumName ? `Details for ENUM ${schema}.${enumName}` : `ENUMs in schema ${schema}`,
        details: result
    };

  } catch (error) {
    console.error("Error fetching ENUMs:", error);
    return {
        success: false,
        message: `Failed to fetch ENUMs: ${error instanceof Error ? error.message : String(error)}`,
        details: null
    };
  } finally {
    await db.disconnect();
  }
}

// Use inferred input type and expected Promise<EnumResult> return type
export async function createEnum(input: z.infer<typeof createEnumInput>): Promise<EnumResult> {
  const { connectionString, enumName, values, schema, ifNotExists } = input;
  const db = DatabaseConnection.getInstance();
  try {
    await db.connect(connectionString);
    // Manually quote identifiers using double quotes
    const qualifiedSchema = `"${schema || 'public'}"`;
    const qualifiedEnumName = `"${enumName}"`;
    const fullEnumName = `${qualifiedSchema}.${qualifiedEnumName}`;
    // Use parameterized query for values and add explicit types to map
    const valuesPlaceholders = values.map((_: string, i: number) => `$${i + 1}`).join(', ');
    const ifNotExistsClause = ifNotExists ? 'IF NOT EXISTS' : '';

    const query = `CREATE TYPE ${ifNotExistsClause} ${fullEnumName} AS ENUM (${valuesPlaceholders});`;

    await db.query(query, values);
    return {
        success: true,
        message: `ENUM type ${fullEnumName} created successfully.`,
        details: { schema, enumName, values }
    };
  } catch (error) {
    console.error("Error creating ENUM:", error);
     return {
        success: false,
        message: `Failed to create ENUM ${enumName}: ${error instanceof Error ? error.message : String(error)}`,
        details: null
    };
  } finally {
      await db.disconnect();
  }
}

// Potential future additions: dropEnum, alterEnumAddValue, alterEnumRenameValue 