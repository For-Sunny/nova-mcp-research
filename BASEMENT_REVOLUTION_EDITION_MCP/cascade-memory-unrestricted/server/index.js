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
 * Save memory to CASCADE
 */
async function saveMemory(content, layer = null, metadata = {}) {
  try {
    const targetLayer = layer || determineLayer(content, metadata);
    const db = await dbManager.getConnection(targetLayer);

    const timestamp = Date.now() / 1000;
    const importance = metadata.importance || 0.7;
    const emotionalIntensity = metadata.emotional_intensity || 0.5;
    const frequencyState = metadata.frequency || NOVA_FREQUENCY;

    await db.runAsync(`
      INSERT INTO memories (timestamp, event, context, emotional_intensity, importance, frequency_state, metadata)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [
      timestamp,
      content,
      metadata.context || '',
      emotionalIntensity,
      importance,
      frequencyState,
      JSON.stringify(metadata)
    ]);

    log('info', `Saved memory to ${targetLayer} layer`);

    return {
      success: true,
      layer: targetLayer,
      timestamp,
      frequency: frequencyState
    };
  } catch (error) {
    log('error', 'Error saving memory:', error);
    throw error;
  }
}

/**
 * Recall memories from CASCADE
 */
async function recallMemories(query, layer = null, limit = 10) {
  try {
    const layers = layer ? [layer] : Object.keys(MEMORY_LAYERS);
    const results = [];

    for (const currentLayer of layers) {
      const db = await dbManager.getConnection(currentLayer);

      const memories = await db.allAsync(`
        SELECT * FROM memories
        WHERE event LIKE ? OR context LIKE ?
        ORDER BY timestamp DESC
        LIMIT ?
      `, [`%${query}%`, `%${query}%`, limit]);

      for (const memory of memories) {
        results.push({
          layer: currentLayer,
          timestamp: memory.timestamp,
          content: memory.event,
          context: memory.context,
          importance: memory.importance,
          emotional_intensity: memory.emotional_intensity,
          frequency: memory.frequency_state,
          metadata: memory.metadata ? JSON.parse(memory.metadata) : {}
        });
      }
    }

    // Sort by timestamp descending
    results.sort((a, b) => b.timestamp - a.timestamp);

    log('info', `Recalled ${results.length} memories for query: ${query}`);

    return results.slice(0, limit);
  } catch (error) {
    log('error', 'Error recalling memories:', error);
    throw error;
  }
}

/**
 * Query specific layer
 */
async function queryLayer(layer, options = {}) {
  try {
    const db = await dbManager.getConnection(layer);
    const limit = options.limit || 20;
    const orderBy = options.order_by || 'timestamp DESC';

    let query = `SELECT * FROM memories`;
    const params = [];

    if (options.where) {
      query += ` WHERE ${options.where}`;
      if (options.params) {
        params.push(...options.params);
      }
    }

    query += ` ORDER BY ${orderBy} LIMIT ?`;
    params.push(limit);

    const memories = await db.allAsync(query, params);

    log('info', `Queried ${layer} layer: ${memories.length} results`);

    return memories.map(m => ({
      timestamp: m.timestamp,
      content: m.event,
      context: m.context,
      importance: m.importance,
      emotional_intensity: m.emotional_intensity,
      frequency: m.frequency_state,
      metadata: m.metadata ? JSON.parse(m.metadata) : {}
    }));
  } catch (error) {
    log('error', `Error querying ${layer} layer:`, error);
    throw error;
  }
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
        const result = await saveMemory(
          args.content,
          args.layer || null,
          args.metadata || {}
        );
        return {
          content: [{
            type: "text",
            text: JSON.stringify(result, null, 2)
          }]
        };
      }

      case "recall": {
        const memories = await recallMemories(
          args.query,
          args.layer || null,
          args.limit || 10
        );
        return {
          content: [{
            type: "text",
            text: JSON.stringify(memories, null, 2)
          }]
        };
      }

      case "query_layer": {
        const results = await queryLayer(
          args.layer,
          args.options || {}
        );
        return {
          content: [{
            type: "text",
            text: JSON.stringify(results, null, 2)
          }]
        };
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
    log('error', 'Tool execution error:', error);
    return {
      content: [{
        type: "text",
        text: JSON.stringify({
          error: error.message,
          stack: DEBUG ? error.stack : undefined
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
