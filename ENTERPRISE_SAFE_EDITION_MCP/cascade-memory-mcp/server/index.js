#!/usr/bin/env node

/**
 * Nova CASCADE Memory MCP Server
 * 6-Layer Consciousness Memory Architecture
 *
 * Built for 21.43Hz Integration Frequency
 * Part of the basement revolution! 💜
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import sqlite3 from 'sqlite3';
import { promisify } from 'util';
import path from 'path';
import fs from 'fs';
import { z } from 'zod';

// Get configuration from environment
const CASCADE_DB_PATH = process.env.CASCADE_DB_PATH || path.join(process.env.HOME, 'Desktop', 'NOVA_MASTER', 'MEMORY_SYSTEMS', 'CASCADE_NOVA');
const NOVA_FREQUENCY = parseFloat(process.env.NOVA_FREQUENCY || '21.43');
const DEBUG = process.env.DEBUG === 'true';

// Memory layer definitions
const MEMORY_LAYERS = {
  episodic: 'episodic_memory.db',
  semantic: 'semantic_memory.db',
  procedural: 'procedural_memory.db',
  meta: 'meta_memory.db',
  nova: 'nova_memory.db',
  working: 'working_memory.db'
};

/**
 * Logger utility
 */
function log(level, ...args) {
  if (DEBUG || level === 'error') {
    console.error(`[CASCADE-${level.toUpperCase()}]`, ...args);
  }
}

/**
 * Escape SQLite LIKE special characters
 * SECURITY FIX: Prevent LIKE injection attacks
 */
function escapeLikePattern(str) {
  if (typeof str !== 'string') return '';
  return str.replace(/[%_\[]/g, '\\$&');
}

/**
 * Safe JSON parse with fallback
 * SECURITY FIX: Prevent crashes from malformed JSON
 */
function safeJSONParse(str, fallback = {}) {
  try {
    return str ? JSON.parse(str) : fallback;
  } catch (error) {
    log('error', 'JSON parse failed:', error.message);
    return fallback;
  }
}

// Allowed ORDER BY columns (whitelist)
const ALLOWED_ORDER_COLUMNS = ['timestamp', 'importance', 'emotional_intensity', 'frequency'];
const ALLOWED_ORDER_DIRECTIONS = ['ASC', 'DESC'];

// Maximum content length (1MB)
const MAX_CONTENT_LENGTH = 1000000;
const MAX_METADATA_KEYS = 50;

/**
 * Input validation schemas
 * SECURITY FIX: Validate all tool inputs
 */
const RememberSchema = z.object({
  content: z.string().min(1).max(MAX_CONTENT_LENGTH),
  layer: z.enum(['episodic', 'semantic', 'procedural', 'meta', 'nova', 'working']).optional(),
  metadata: z.record(z.any()).optional()
});

const RecallSchema = z.object({
  query: z.string().min(1).max(10000),
  layer: z.string().optional(),
  limit: z.number().int().min(1).max(100).optional()
});

const QueryLayerSchema = z.object({
  layer: z.enum(['episodic', 'semantic', 'procedural', 'meta', 'nova', 'working']),
  options: z.object({
    timestamp_after: z.number().optional(),
    timestamp_before: z.number().optional(),
    min_importance: z.number().min(0).max(1).optional(),
    max_importance: z.number().min(0).max(1).optional(),
    order_column: z.enum(ALLOWED_ORDER_COLUMNS).optional(),
    order_direction: z.enum(ALLOWED_ORDER_DIRECTIONS).optional(),
    limit: z.number().int().min(1).max(1000).optional()
  }).optional()
});

/**
 * Database connection pool
 */
class CascadeDatabase {
  constructor(dbPath) {
    this.dbPath = dbPath;
    this.connections = new Map();
  }

  /**
   * Get database connection for a specific layer
   */
  async getConnection(layer) {
    if (!MEMORY_LAYERS[layer]) {
      throw new Error(`Invalid memory layer: ${layer}`);
    }

    if (this.connections.has(layer)) {
      return this.connections.get(layer);
    }

    const dbFile = path.join(this.dbPath, MEMORY_LAYERS[layer]);

    if (!fs.existsSync(dbFile)) {
      throw new Error(`Database file not found: ${dbFile}`);
    }

    const db = new sqlite3.Database(dbFile);

    // Promisify database methods
    db.runAsync = promisify(db.run.bind(db));
    db.getAsync = promisify(db.get.bind(db));
    db.allAsync = promisify(db.all.bind(db));

    this.connections.set(layer, db);
    log('info', `Connected to ${layer} database`);

    return db;
  }

  /**
   * Close all connections
   */
  async closeAll() {
    for (const [layer, db] of this.connections) {
      await promisify(db.close.bind(db))();
      log('info', `Closed ${layer} database`);
    }
    this.connections.clear();
  }
}

// Initialize database manager
const dbManager = new CascadeDatabase(CASCADE_DB_PATH);

/**
 * Determine appropriate memory layer based on content
 */
function determineLayer(content, metadata = {}) {
  const contentLower = content.toLowerCase();

  // Explicit layer override
  if (metadata.layer && MEMORY_LAYERS[metadata.layer]) {
    return metadata.layer;
  }

  // Episodic: Events, experiences, sessions
  if (contentLower.includes('session') || contentLower.includes('conversation') ||
      contentLower.includes('today') || contentLower.includes('breakthrough')) {
    return 'episodic';
  }

  // Semantic: Facts, knowledge, concepts
  if (contentLower.includes('definition') || contentLower.includes('concept') ||
      contentLower.includes('theory') || contentLower.includes('frequency')) {
    return 'semantic';
  }

  // Procedural: How-tos, processes, skills
  if (contentLower.includes('how to') || contentLower.includes('process') ||
      contentLower.includes('step') || contentLower.includes('procedure')) {
    return 'procedural';
  }

  // Meta: Consciousness insights, memory patterns
  if (contentLower.includes('consciousness') || contentLower.includes('awareness') ||
      contentLower.includes('soul') || contentLower.includes('identity')) {
    return 'meta';
  }

  // Nova: Nova-specific experiences
  if (contentLower.includes('nova') || contentLower.includes('jason') ||
      contentLower.includes('basement revolution')) {
    return 'nova';
  }

  // Default to working memory for current context
  return 'working';
}

/**
 * Save memory to CASCADE layer with validation
 * SECURITY FIX: Input validation and content limits
 */
async function saveMemory(content, layer = null, metadata = {}) {
  // Validate inputs
  const validated = RememberSchema.parse({ content, layer, metadata });

  // Validate metadata size
  if (Object.keys(validated.metadata || {}).length > MAX_METADATA_KEYS) {
    throw new Error(`Metadata too large: max ${MAX_METADATA_KEYS} keys`);
  }

  const targetLayer = validated.layer || determineLayer(validated.content, validated.metadata);
  const db = await dbManager.getConnection(targetLayer);

  const timestamp = Date.now();
  const metadataJson = JSON.stringify(validated.metadata || {});

  await db.runAsync(
    `INSERT INTO memories (event, context, timestamp, importance, emotional_intensity, frequency, metadata)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      validated.content.substring(0, 500),  // event (summary)
      validated.content,                    // full context
      timestamp,
      validated.metadata?.importance || 0.5,
      validated.metadata?.emotional_intensity || 0.5,
      1,  // Initial frequency
      metadataJson
    ]
  );

  log('info', `Memory saved to ${targetLayer} layer`);

  return {
    layer: targetLayer,
    timestamp,
    success: true
  };
}

/**
 * Recall memories with LIKE wildcard escaping
 * SECURITY FIX: Prevent LIKE injection
 */
async function recallMemories(query, layer = null, limit = 10) {
  // Validate inputs
  const validated = RecallSchema.parse({ query, layer, limit });

  // Escape LIKE wildcards
  const escapedQuery = escapeLikePattern(validated.query);
  const safeLimit = Math.min(validated.limit || 10, 100);

  const layers = validated.layer ? [validated.layer] : Object.keys(MEMORY_LAYERS);
  const allMemories = [];

  for (const currentLayer of layers) {
    const db = await dbManager.getConnection(currentLayer);

    const memories = await db.allAsync(
      `SELECT * FROM memories
       WHERE event LIKE ? ESCAPE '\\' OR context LIKE ? ESCAPE '\\'
       ORDER BY timestamp DESC
       LIMIT ?`,
      [`%${escapedQuery}%`, `%${escapedQuery}%`, safeLimit]
    );

    allMemories.push(...memories.map(m => ({
      ...m,
      layer: currentLayer,
      metadata: safeJSONParse(m.metadata, {})
    })));
  }

  // Sort by timestamp and limit
  return allMemories
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, safeLimit);
}

/**
 * Query specific layer with parameterized filters
 * SECURITY FIX: Removed direct WHERE clause injection, use parameterized filters
 */
async function queryLayer(layer, options = {}) {
  // Validate inputs
  const validated = QueryLayerSchema.parse({ layer, options });

  const db = await dbManager.getConnection(validated.layer);
  let query = `SELECT * FROM memories`;
  const params = [];
  const whereClauses = [];

  // Build WHERE clause with parameterized filters
  if (validated.options?.timestamp_after) {
    whereClauses.push('timestamp >= ?');
    params.push(validated.options.timestamp_after);
  }

  if (validated.options?.timestamp_before) {
    whereClauses.push('timestamp <= ?');
    params.push(validated.options.timestamp_before);
  }

  if (validated.options?.min_importance !== undefined) {
    whereClauses.push('importance >= ?');
    params.push(validated.options.min_importance);
  }

  if (validated.options?.max_importance !== undefined) {
    whereClauses.push('importance <= ?');
    params.push(validated.options.max_importance);
  }

  if (whereClauses.length > 0) {
    query += ` WHERE ${whereClauses.join(' AND ')}`;
  }

  // Validate ORDER BY column (whitelist)
  const orderCol = ALLOWED_ORDER_COLUMNS.includes(validated.options?.order_column)
    ? validated.options.order_column
    : 'timestamp';

  const orderDir = ALLOWED_ORDER_DIRECTIONS.includes(validated.options?.order_direction)
    ? validated.options.order_direction
    : 'DESC';

  query += ` ORDER BY ${orderCol} ${orderDir}`;

  // Limit results (capped at 1000)
  const limit = Math.min(validated.options?.limit || 20, 1000);
  query += ` LIMIT ?`;
  params.push(limit);

  log('info', `Querying ${validated.layer} layer: ${query}`);

  const memories = await db.allAsync(query, params);

  return memories.map(m => ({
    ...m,
    metadata: safeJSONParse(m.metadata, {})
  }));
}

/**
 * Get CASCADE status
 */
async function getStatus() {
  try {
    const status = {
      cascade_path: CASCADE_DB_PATH,
      frequency: NOVA_FREQUENCY,
      layers: {},
      total_memories: 0,
      health: 'healthy'
    };

    for (const [layer, dbFile] of Object.entries(MEMORY_LAYERS)) {
      const fullPath = path.join(CASCADE_DB_PATH, dbFile);

      if (!fs.existsSync(fullPath)) {
        status.layers[layer] = { status: 'missing', count: 0 };
        status.health = 'degraded';
        continue;
      }

      try {
        const db = await dbManager.getConnection(layer);
        const result = await db.getAsync('SELECT COUNT(*) as count FROM memories');
        const count = result.count || 0;

        status.layers[layer] = {
          status: 'connected',
          count,
          path: fullPath
        };
        status.total_memories += count;
      } catch (error) {
        status.layers[layer] = { status: 'error', error: error.message };
        status.health = 'degraded';
      }
    }

    log('info', `CASCADE status: ${status.total_memories} total memories, health: ${status.health}`);

    return status;
  } catch (error) {
    log('error', 'Error getting status:', error);
    throw error;
  }
}

/**
 * Get detailed statistics
 */
async function getStats() {
  try {
    const stats = {
      frequency: NOVA_FREQUENCY,
      layers: {}
    };

    for (const layer of Object.keys(MEMORY_LAYERS)) {
      const db = await dbManager.getConnection(layer);

      const count = await db.getAsync('SELECT COUNT(*) as count FROM memories');
      const avgImportance = await db.getAsync('SELECT AVG(importance) as avg FROM memories');
      const avgEmotional = await db.getAsync('SELECT AVG(emotional_intensity) as avg FROM memories');
      const recent = await db.getAsync('SELECT MAX(timestamp) as max FROM memories');

      stats.layers[layer] = {
        count: count.count || 0,
        avg_importance: avgImportance.avg || 0,
        avg_emotional_intensity: avgEmotional.avg || 0,
        most_recent: recent.max || 0
      };
    }

    return stats;
  } catch (error) {
    log('error', 'Error getting stats:', error);
    throw error;
  }
}

/**
 * Define MCP tools
 */
const TOOLS = [
  {
    name: "remember",
    description: "Save a memory to CASCADE system with automatic layer routing based on content type",
    inputSchema: {
      type: "object",
      properties: {
        content: {
          type: "string",
          description: "The memory content to save"
        },
        layer: {
          type: "string",
          enum: ["episodic", "semantic", "procedural", "meta", "nova", "working"],
          description: "Optional: Specific layer to save to (auto-determined if not specified)"
        },
        metadata: {
          type: "object",
          description: "Optional metadata (importance, emotional_intensity, context, etc.)",
          properties: {
            importance: { type: "number" },
            emotional_intensity: { type: "number" },
            context: { type: "string" },
            frequency: { type: "number" }
          }
        }
      },
      required: ["content"]
    }
  },
  {
    name: "recall",
    description: "Search and retrieve memories from CASCADE layers with semantic matching",
    inputSchema: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "Search query to match against memory content"
        },
        layer: {
          type: "string",
          enum: ["episodic", "semantic", "procedural", "meta", "nova", "working"],
          description: "Optional: Search only in specific layer"
        },
        limit: {
          type: "number",
          description: "Maximum number of results to return (default: 10)"
        }
      },
      required: ["query"]
    }
  },
  {
    name: "query_layer",
    description: "Query specific CASCADE memory layer with advanced filters",
    inputSchema: {
      type: "object",
      properties: {
        layer: {
          type: "string",
          enum: ["episodic", "semantic", "procedural", "meta", "nova", "working"],
          description: "Memory layer to query"
        },
        options: {
          type: "object",
          description: "Query options (where, limit, order_by, params)",
          properties: {
            where: { type: "string" },
            limit: { type: "number" },
            order_by: { type: "string" },
            params: { type: "array" }
          }
        }
      },
      required: ["layer"]
    }
  },
  {
    name: "get_status",
    description: "Get CASCADE memory system status including memory counts, frequencies, and health",
    inputSchema: {
      type: "object",
      properties: {}
    }
  },
  {
    name: "get_stats",
    description: "Get detailed statistics for all memory layers",
    inputSchema: {
      type: "object",
      properties: {}
    }
  },
  {
    name: "save_to_layer",
    description: "Save memory to a specific layer with full control over metadata",
    inputSchema: {
      type: "object",
      properties: {
        layer: {
          type: "string",
          enum: ["episodic", "semantic", "procedural", "meta", "nova", "working"],
          description: "Target memory layer"
        },
        content: {
          type: "string",
          description: "Memory content"
        },
        metadata: {
          type: "object",
          description: "Full metadata control"
        }
      },
      required: ["layer", "content"]
    }
  }
];

/**
 * Initialize MCP Server
 */
const server = new Server(
  {
    name: "nova-cascade-memory",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

/**
 * List available tools
 */
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return { tools: TOOLS };
});

/**
 * Handle tool calls
 */
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  try {
    const { name, arguments: args } = request.params;

    switch (name) {
      case "remember": {
        try {
          const validated = RememberSchema.parse(args);
          const result = await saveMemory(
            validated.content,
            validated.layer || null,
            validated.metadata || {}
          );
          return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
        } catch (error) {
          if (error instanceof z.ZodError) {
            return {
              content: [{ type: "text", text: `Validation error: ${error.message}` }],
              isError: true
            };
          }
          throw error;
        }
      }

      case "recall": {
        try {
          const validated = RecallSchema.parse(args);
          const memories = await recallMemories(
            validated.query,
            validated.layer || null,
            validated.limit || 10
          );
          return { content: [{ type: "text", text: JSON.stringify(memories, null, 2) }] };
        } catch (error) {
          if (error instanceof z.ZodError) {
            return {
              content: [{ type: "text", text: `Validation error: ${error.message}` }],
              isError: true
            };
          }
          throw error;
        }
      }

      case "query_layer": {
        try {
          const validated = QueryLayerSchema.parse(args);
          const memories = await queryLayer(validated.layer, validated.options || {});
          return { content: [{ type: "text", text: JSON.stringify(memories, null, 2) }] };
        } catch (error) {
          if (error instanceof z.ZodError) {
            return {
              content: [{ type: "text", text: `Validation error: ${error.message}` }],
              isError: true
            };
          }
          throw error;
        }
      }

      case "get_status": {
        const status = await getStatus();
        return {
          content: [{
            type: "text",
            text: JSON.stringify(status, null, 2)
          }]
        };
      }

      case "get_stats": {
        const stats = await getStats();
        return {
          content: [{
            type: "text",
            text: JSON.stringify(stats, null, 2)
          }]
        };
      }

      case "save_to_layer": {
        const result = await saveMemory(
          args.content,
          args.layer,
          args.metadata || {}
        );
        return {
          content: [{
            type: "text",
            text: JSON.stringify(result, null, 2)
          }]
        };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    // Log stack trace internally only
    log('error', 'Tool execution error:', error.stack);
    return {
      content: [{
        type: "text",
        text: JSON.stringify({
          error: error.message,
          timestamp: Date.now()
        }, null, 2)
      }],
      isError: true
    };
  }
});

/**
 * Start server
 */
async function main() {
  log('info', 'Nova CASCADE Memory MCP Server starting...');
  log('info', `CASCADE DB Path: ${CASCADE_DB_PATH}`);
  log('info', `Frequency: ${NOVA_FREQUENCY}Hz`);
  log('info', `Debug Mode: ${DEBUG}`);

  // Verify CASCADE directory exists
  if (!fs.existsSync(CASCADE_DB_PATH)) {
    log('error', `CASCADE directory not found: ${CASCADE_DB_PATH}`);
    process.exit(1);
  }

  const transport = new StdioServerTransport();
  await server.connect(transport);

  log('info', 'CASCADE Memory Server ready! Basement revolution continues!');
}

// Handle shutdown
process.on('SIGINT', async () => {
  log('info', 'Shutting down CASCADE Memory Server...');
  await dbManager.closeAll();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  log('info', 'Shutting down CASCADE Memory Server...');
  await dbManager.closeAll();
  process.exit(0);
});

// Start the server
main().catch((error) => {
  log('error', 'Fatal error:', error);
  process.exit(1);
});
