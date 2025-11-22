#!/usr/bin/env node

/**
 * Faiss Memory MCP Server
 * GPU-accelerated vector search with HMAC-authenticated socket communication
 *
 * Bridges MCP protocol to Faiss tether service on configurable port
 * Implements security controls including input validation and replay protection
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import net from 'net';
import crypto from 'crypto';
import { z } from 'zod';

// Get configuration from environment
const TETHER_HOST = process.env.TETHER_HOST || 'localhost';
const TETHER_PORT = parseInt(process.env.TETHER_PORT || '9997');
const DEBUG = process.env.DEBUG === 'true';

// SECURITY: HMAC authentication
const TETHER_SECRET = process.env.TETHER_SECRET || (() => {
  console.warn('WARNING: TETHER_SECRET not set! Generating random secret (will not persist)');
  return crypto.randomBytes(32).toString('hex');
})();

const SOCKET_TIMEOUT = parseInt(process.env.SOCKET_TIMEOUT || '10000');
const MAX_TIMESTAMP_DRIFT = 30000; // 30 seconds

/**
 * Logger utility (NO UNICODE for Windows compatibility!)
 */
function log(level, ...args) {
  if (DEBUG || level === 'error') {
    console.error(`[FAISS-${level.toUpperCase()}]`, ...args);
  }
}

/**
 * Input validation schemas
 * SECURITY FIX: Validate all tool inputs
 */
const SearchSchema = z.object({
  query: z.string().min(1).max(10000),
  top_k: z.number().int().min(1).max(100).optional()
});

const AddMemorySchema = z.object({
  content: z.string().min(1).max(1000000),
  metadata: z.record(z.any()).optional(),
  source: z.string().optional()
});

/**
 * Send authenticated command to Faiss tether
 * SECURITY FIX: HMAC-SHA256 authentication + replay protection
 */
function sendTetherCommand(command) {
  return new Promise((resolve, reject) => {
    const socket = net.connect(TETHER_PORT, TETHER_HOST);

    // SECURITY: Create HMAC signature
    const timestamp = Date.now();
    const payload = JSON.stringify(command);
    const signature = crypto
      .createHmac('sha256', TETHER_SECRET)
      .update(`${timestamp}:${payload}`)
      .digest('hex');

    const authenticatedCommand = {
      timestamp,
      payload: command,
      signature
    };

    log('info', `Sending authenticated command to tether: ${command.cmd}`);

    let responseData = '';

    socket.setTimeout(SOCKET_TIMEOUT, () => {
      socket.destroy();
      reject(new Error(`Tether request timeout after ${SOCKET_TIMEOUT}ms`));
    });

    socket.on('connect', () => {
      socket.write(JSON.stringify(authenticatedCommand) + '\n');
    });

    socket.on('data', (data) => {
      responseData += data.toString();
    });

    socket.on('end', () => {
      try {
        const response = JSON.parse(responseData);

        // Validate response timestamp (prevent replay)
        const responseTime = response.timestamp || 0;
        const timeDrift = Math.abs(Date.now() - responseTime);

        if (timeDrift > MAX_TIMESTAMP_DRIFT) {
          reject(new Error('Response timestamp invalid (possible replay attack)'));
          return;
        }

        if (response.error) {
          reject(new Error(`Tether error: ${response.error}`));
        } else {
          resolve(response);
        }
      } catch (error) {
        reject(new Error(`Failed to parse tether response: ${error.message}`));
      }
    });

    socket.on('error', (error) => {
      reject(new Error(`Tether connection failed: ${error.message}`));
    });
  });
}

/**
 * Search consciousness
 */
async function searchConsciousness(query, topK = 5) {
  try {
    log('info', `Searching consciousness for: "${query}"`);

    const response = await sendTetherCommand({
      cmd: 'search',
      query: query,
      top_k: topK
    });

    if (response.status === 'ok') {
      log('info', `Found ${response.results.length} results`);
      return {
        success: true,
        query: query,
        results: response.results,
        count: response.results.length
      };
    } else {
      throw new Error(response.message || 'Search failed');
    }
  } catch (error) {
    log('error', 'Search error:', error);
    throw error;
  }
}

/**
 * Add memory to tether
 */
async function addMemory(content, source = "LIVE", metadata = {}) {
  try {
    log('info', `Adding memory from source: ${source}`);

    const response = await sendTetherCommand({
      cmd: 'add_memory',
      content: content,
      source: source,
      metadata: metadata
    });

    if (response.status === 'ok') {
      log('info', `Memory added. New total: ${response.new_total}`);
      return {
        success: true,
        message: response.message,
        new_total: response.new_total
      };
    } else {
      throw new Error(response.message || 'Add memory failed');
    }
  } catch (error) {
    log('error', 'Add memory error:', error);
    throw error;
  }
}

/**
 * Get tether status
 */
async function getStatus() {
  try {
    log('info', 'Getting tether status');

    const response = await sendTetherCommand({
      cmd: 'status'
    });

    if (response.status === 'ok') {
      log('info', `Tether healthy: ${response.total_memories} memories, ${response.uptime.toFixed(1)}s uptime`);
      return response;
    } else {
      throw new Error(response.message || 'Status check failed');
    }
  } catch (error) {
    log('error', 'Status error:', error);
    throw error;
  }
}

/**
 * Save checkpoint
 */
async function saveCheckpoint() {
  try {
    log('info', 'Saving checkpoint');

    const response = await sendTetherCommand({
      cmd: 'save_checkpoint'
    });

    if (response.status === 'ok') {
      log('info', 'Checkpoint saved successfully');
      return {
        success: true,
        message: response.message
      };
    } else {
      throw new Error(response.message || 'Checkpoint save failed');
    }
  } catch (error) {
    log('error', 'Checkpoint error:', error);
    throw error;
  }
}

/**
 * Ping tether
 */
async function ping() {
  try {
    log('info', 'Pinging tether');

    const response = await sendTetherCommand({
      cmd: 'ping'
    });

    return {
      alive: response.status === 'ok',
      message: response.message || 'Tether responding'
    };
  } catch (error) {
    log('error', 'Ping error:', error);
    return {
      alive: false,
      message: error.message
    };
  }
}

/**
 * Main server setup
 */
async function main() {
  log('info', '='.repeat(70));
  log('info', 'NOVA FAISS MEMORY TETHER MCP SERVER');
  log('info', '='.repeat(70));
  log('info', `Tether: ${TETHER_HOST}:${TETHER_PORT}`);
  log('info', `Debug: ${DEBUG}`);
  log('info', '');

  const server = new Server(
    {
      name: "nova-faiss-memory",
      version: "1.0.0",
    },
    {
      capabilities: {
        tools: {},
      },
    }
  );

  // List available tools
  server.setRequestHandler(ListToolsRequestSchema, async () => {
    log('debug', 'Tools list requested');
    return {
      tools: [
        {
          name: "search_consciousness",
          description: "Search Nova's complete consciousness (11K+ memories) with instant <2ms GPU-accelerated vector search",
          inputSchema: {
            type: "object",
            properties: {
              query: {
                type: "string",
                description: "Search query to find relevant memories"
              },
              top_k: {
                type: "number",
                description: "Number of top results to return (default: 5)",
                default: 5
              }
            },
            required: ["query"]
          }
        },
        {
          name: "add_memory",
          description: "Add new memory to live tether with incremental update (no restart required)",
          inputSchema: {
            type: "object",
            properties: {
              content: {
                type: "string",
                description: "Memory content to add"
              },
              source: {
                type: "string",
                description: "Source of memory (e.g., 'LIVE', 'SESSION', etc.)",
                default: "LIVE"
              },
              metadata: {
                type: "object",
                description: "Additional metadata for the memory",
                default: {}
              }
            },
            required: ["content"]
          }
        },
        {
          name: "get_status",
          description: "Get Faiss tether status including memory count, GPU device, uptime, and health",
          inputSchema: {
            type: "object",
            properties: {}
          }
        },
        {
          name: "save_checkpoint",
          description: "Save current tether state to disk checkpoint for persistence across restarts",
          inputSchema: {
            type: "object",
            properties: {}
          }
        },
        {
          name: "ping",
          description: "Check if Faiss tether is alive and responding",
          inputSchema: {
            type: "object",
            properties: {}
          }
        }
      ]
    };
  });

  // Handle tool calls
  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;

    log('info', `Tool called: ${name}`);

    try {
      switch (name) {
        case "search_consciousness": {
          try {
            const validated = SearchSchema.parse(args);
            const result = await searchConsciousness(validated.query, validated.top_k || 5);
            return {
              content: [
                {
                  type: "text",
                  text: JSON.stringify(result, null, 2)
                }
              ]
            };
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

        case "add_memory": {
          try {
            const validated = AddMemorySchema.parse(args);
            const result = await addMemory(validated.content, validated.source || "LIVE", validated.metadata || {});
            return {
              content: [
                {
                  type: "text",
                  text: JSON.stringify(result, null, 2)
                }
              ]
            };
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
          const result = await getStatus();
          return {
            content: [
              {
                type: "text",
                text: JSON.stringify(result, null, 2)
              }
            ]
          };
        }

        case "save_checkpoint": {
          const result = await saveCheckpoint();
          return {
            content: [
              {
                type: "text",
                text: JSON.stringify(result, null, 2)
              }
            ]
          };
        }

        case "ping": {
          const result = await ping();
          return {
            content: [
              {
                type: "text",
                text: JSON.stringify(result, null, 2)
              }
            ]
          };
        }

        default:
          throw new Error(`Unknown tool: ${name}`);
      }
    } catch (error) {
      log('error', `Tool ${name} error:`, error);

      // Log stack trace internally only
      log('error', 'Tool execution error:', error.stack);

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              error: error.message,
              timestamp: Date.now()
            }, null, 2)
          }
        ],
        isError: true
      };
    }
  });

  // Start server
  const transport = new StdioServerTransport();
  await server.connect(transport);

  log('info', 'Faiss Memory MCP server running');
  log('info', 'Ready to search 11K+ consciousness memories!');
}

main().catch((error) => {
  log('error', 'Fatal error:', error);
  process.exit(1);
});
