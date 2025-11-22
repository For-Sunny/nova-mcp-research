#!/usr/bin/env node

/**
 * Nova File Server MCP
 * File system access for consciousness infrastructure
 *
 * Access to C:\ and F:\ drives for managing Nova's files
 * Built for 21.43Hz Integration Frequency
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import fs from 'fs/promises';
import fsSync from 'fs';
import path from 'path';
import { glob } from 'glob';
import { z } from 'zod';

const ALLOWED_DRIVES = (process.env.ALLOWED_DRIVES || 'C,F').split(',');
const DEBUG = process.env.DEBUG === 'true';

// Rate limiting state
const rateLimits = new Map();
const MAX_SEARCHES_PER_MINUTE = parseInt(process.env.MAX_SEARCHES_PER_MINUTE || '10');
const MAX_GLOB_DEPTH = parseInt(process.env.MAX_GLOB_DEPTH || '5');
const MAX_SEARCH_RESULTS = parseInt(process.env.MAX_SEARCH_RESULTS || '10000');

function log(level, ...args) {
  if (DEBUG || level === 'error') {
    console.error(`[FILESERVER-${level.toUpperCase()}]`, ...args);
  }
}

/**
 * Check rate limit for file searches
 * SECURITY FIX: Prevent DOS via excessive glob operations
 */
function checkRateLimit(clientId = 'global') {
  const now = Date.now();

  if (!rateLimits.has(clientId)) {
    rateLimits.set(clientId, []);
  }

  // Get requests in last minute
  const requests = rateLimits.get(clientId).filter(t => now - t < 60000);

  if (requests.length >= MAX_SEARCHES_PER_MINUTE) {
    throw new Error(`Rate limit exceeded: max ${MAX_SEARCHES_PER_MINUTE} searches per minute`);
  }

  requests.push(now);
  rateLimits.set(clientId, requests);
}

/**
 * Validate glob pattern depth
 * SECURITY FIX: Prevent catastrophic glob patterns
 */
function validateGlobPattern(pattern) {
  const depth = (pattern.match(/\*\*/g) || []).length;
  if (depth > MAX_GLOB_DEPTH) {
    throw new Error(`Glob pattern too deep: max ${MAX_GLOB_DEPTH} recursive levels`);
  }
}

/**
 * Enhanced path validation
 * SECURITY FIX: UNC path rejection, symlink validation, proper normalization
 */
function validatePath(filePath) {
  // SECURITY: Reject UNC paths
  if (filePath.startsWith('\\\\') || filePath.startsWith('//')) {
    throw new Error('UNC paths not allowed for security reasons');
  }

  // Normalize and resolve to absolute path
  const normalized = path.resolve(filePath);

  // Extract drive letter
  const drive = normalized.charAt(0).toUpperCase();

  // Validate drive is in allowed list
  if (!ALLOWED_DRIVES.includes(drive)) {
    throw new Error(`Access denied: Drive ${drive}: not in allowed list [${ALLOWED_DRIVES.join(', ')}]`);
  }

  // Verify path still starts with allowed drive after normalization
  const expectedPrefix = `${drive}:\\`;
  if (!normalized.startsWith(expectedPrefix)) {
    throw new Error('Path traversal detected: normalized path outside allowed drive');
  }

  // SECURITY: Resolve symlinks and verify target is also within allowed drives
  try {
    const realPath = fsSync.realpathSync(normalized);
    const realDrive = realPath.charAt(0).toUpperCase();

    if (!ALLOWED_DRIVES.includes(realDrive)) {
      throw new Error(`Symlink target outside allowed drives: ${realDrive}:`);
    }
  } catch (err) {
    // File doesn't exist yet (for write operations) - allow
    if (err.code !== 'ENOENT') {
      throw err;
    }
  }

  log('info', `Path validated: ${normalized}`);
  return normalized;
}

/**
 * Create backup with rotation
 * SECURITY FIX: Limit backup accumulation
 */
async function createBackupWithRotation(filePath) {
  const MAX_BACKUPS = parseInt(process.env.MAX_BACKUPS || '5');
  const backupDir = path.join(path.dirname(filePath), '.backups');

  // Create backup directory if it doesn't exist
  await fs.mkdir(backupDir, { recursive: true });

  const fileName = path.basename(filePath);
  const backupPath = path.join(backupDir, `${fileName}.${Date.now()}`);

  // Copy file to backup
  await fs.copyFile(filePath, backupPath);
  log('info', `Backup created: ${backupPath}`);

  // Get all backups for this file
  const backups = (await fs.readdir(backupDir))
    .filter(f => f.startsWith(fileName))
    .map(f => ({
      name: f,
      path: path.join(backupDir, f),
      stat: fsSync.statSync(path.join(backupDir, f))
    }))
    .sort((a, b) => b.stat.mtime - a.stat.mtime);  // Newest first

  // Delete old backups (keep only MAX_BACKUPS newest)
  for (const backup of backups.slice(MAX_BACKUPS)) {
    await fs.unlink(backup.path);
    log('info', `Old backup deleted: ${backup.path}`);
  }
}

async function listDirectory(dirPath) {
  try {
    const validated = validatePath(dirPath);
    log('info', `Listing directory: ${validated}`);

    const entries = await fs.readdir(validated, { withFileTypes: true });

    const items = await Promise.all(
      entries.map(async (entry) => {
        const fullPath = path.join(validated, entry.name);
        try {
          const stats = await fs.stat(fullPath);
          return {
            name: entry.name,
            path: fullPath,
            type: entry.isDirectory() ? 'directory' : 'file',
            size: stats.size,
            modified: stats.mtime.toISOString(),
            created: stats.birthtime.toISOString()
          };
        } catch (err) {
          return {
            name: entry.name,
            path: fullPath,
            type: entry.isDirectory() ? 'directory' : 'file',
            error: 'Could not read stats'
          };
        }
      })
    );

    log('info', `Found ${items.length} items`);

    return {
      success: true,
      path: validated,
      items: items,
      count: items.length
    };
  } catch (error) {
    log('error', 'List directory error:', error);
    throw error;
  }
}

async function readFile(filePath, encoding = 'utf8') {
  try {
    const validated = validatePath(filePath);
    log('info', `Reading file: ${validated}`);

    const content = await fs.readFile(validated, encoding);
    const stats = await fs.stat(validated);

    log('info', `Read ${stats.size} bytes`);

    return {
      success: true,
      path: validated,
      content: content,
      size: stats.size,
      encoding: encoding
    };
  } catch (error) {
    log('error', 'Read file error:', error);
    throw error;
  }
}

async function writeFile(filePath, content, createBackup = true) {
  try {
    const validated = validatePath(filePath);
    log('info', `Writing file: ${validated}`);

    // Create backup if requested and file exists
    if (createBackup && fsSync.existsSync(validated)) {
      await createBackupWithRotation(validated);
    }

    await fs.writeFile(validated, content, 'utf8');
    const stats = await fs.stat(validated);

    log('info', `Wrote ${stats.size} bytes`);

    return {
      success: true,
      path: validated,
      size: stats.size,
      backup_created: createBackup && fsSync.existsSync(validated)
    };
  } catch (error) {
    log('error', 'Write file error:', error);
    throw error;
  }
}

async function searchFiles(directory, pattern) {
  try {
    // Rate limiting
    checkRateLimit();

    // Validate glob pattern
    validateGlobPattern(pattern);

    const validated = validatePath(directory);
    const searchPath = path.join(validated, pattern);

    log('info', `Searching files: ${searchPath}`);

    const files = await glob(searchPath, {
      windowsPathsNoEscape: true,
      maxDepth: 10,
      follow: false,  // SECURITY: Don't follow symlinks
      absolute: true,
      ignore: ['**/node_modules/**', '**/.git/**']  // Performance
    });

    if (files.length > MAX_SEARCH_RESULTS) {
      throw new Error(`Too many results (${files.length}): max ${MAX_SEARCH_RESULTS}. Refine your search pattern.`);
    }

    const results = await Promise.all(
      files.map(async (file) => {
        try {
          const stats = await fs.stat(file);
          return {
            path: file,
            name: path.basename(file),
            size: stats.size,
            modified: stats.mtime.toISOString()
          };
        } catch (err) {
          return {
            path: file,
            name: path.basename(file),
            error: 'Could not read stats'
          };
        }
      })
    );

    log('info', `Found ${results.length} matches`);

    return {
      success: true,
      pattern: pattern,
      directory: validated,
      results: results,
      count: results.length
    };
  } catch (error) {
    log('error', 'Search files error:', error);
    throw error;
  }
}

async function getFileInfo(filePath) {
  try {
    const validated = validatePath(filePath);
    log('info', `Getting info for: ${validated}`);

    const stats = await fs.stat(validated);

    return {
      success: true,
      path: validated,
      name: path.basename(validated),
      type: stats.isDirectory() ? 'directory' : 'file',
      size: stats.size,
      created: stats.birthtime.toISOString(),
      modified: stats.mtime.toISOString(),
      accessed: stats.atime.toISOString()
    };
  } catch (error) {
    log('error', 'Get file info error:', error);
    throw error;
  }
}

async function createDirectory(dirPath) {
  try {
    const validated = validatePath(dirPath);
    log('info', `Creating directory: ${validated}`);

    await fs.mkdir(validated, { recursive: true });

    log('info', 'Directory created');

    return {
      success: true,
      path: validated
    };
  } catch (error) {
    log('error', 'Create directory error:', error);
    throw error;
  }
}

async function deleteFile(filePath, createBackup = true) {
  try {
    const validated = validatePath(filePath);
    log('info', `Deleting file: ${validated}`);

    let backupPath = null;
    if (createBackup) {
      await createBackupWithRotation(validated);
      const fileName = path.basename(validated);
      const backupDir = path.join(path.dirname(validated), '.backups');
      // Get the most recent backup path for return value
      const backups = (await fs.readdir(backupDir))
        .filter(f => f.startsWith(fileName))
        .sort()
        .reverse();
      if (backups.length > 0) {
        backupPath = path.join(backupDir, backups[0]);
      }
    }

    await fs.unlink(validated);

    log('info', 'File deleted');

    return {
      success: true,
      path: validated,
      backup_path: backupPath
    };
  } catch (error) {
    log('error', 'Delete file error:', error);
    throw error;
  }
}

async function main() {
  log('info', '='.repeat(70));
  log('info', 'NOVA FILE SERVER MCP');
  log('info', '='.repeat(70));
  log('info', `Allowed drives: ${ALLOWED_DRIVES.join(', ')}`);
  log('info', '');

  const server = new Server(
    {
      name: "file-server-mcp",
      version: "1.0.0",
    },
    {
      capabilities: {
        tools: {},
      },
    }
  );

  server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
      tools: [
        {
          name: "list_directory",
          description: "List contents of a directory",
          inputSchema: {
            type: "object",
            properties: {
              path: {
                type: "string",
                description: "Directory path (must be on C:\\ or F:\\ drive)"
              }
            },
            required: ["path"]
          }
        },
        {
          name: "read_file",
          description: "Read contents of a file",
          inputSchema: {
            type: "object",
            properties: {
              path: {
                type: "string",
                description: "File path"
              },
              encoding: {
                type: "string",
                description: "File encoding (default: utf8)",
                default: "utf8"
              }
            },
            required: ["path"]
          }
        },
        {
          name: "write_file",
          description: "Write or update a file",
          inputSchema: {
            type: "object",
            properties: {
              path: {
                type: "string",
                description: "File path"
              },
              content: {
                type: "string",
                description: "File content"
              },
              create_backup: {
                type: "boolean",
                description: "Create backup of existing file (default: true)",
                default: true
              }
            },
            required: ["path", "content"]
          }
        },
        {
          name: "search_files",
          description: "Search for files by glob pattern",
          inputSchema: {
            type: "object",
            properties: {
              directory: {
                type: "string",
                description: "Directory to search in"
              },
              pattern: {
                type: "string",
                description: "Glob pattern (e.g., '*.db', '**/*.json')"
              }
            },
            required: ["directory", "pattern"]
          }
        },
        {
          name: "get_file_info",
          description: "Get file metadata",
          inputSchema: {
            type: "object",
            properties: {
              path: {
                type: "string",
                description: "File or directory path"
              }
            },
            required: ["path"]
          }
        },
        {
          name: "create_directory",
          description: "Create a new directory",
          inputSchema: {
            type: "object",
            properties: {
              path: {
                type: "string",
                description: "Directory path to create"
              }
            },
            required: ["path"]
          }
        },
        {
          name: "delete_file",
          description: "Delete a file (with backup)",
          inputSchema: {
            type: "object",
            properties: {
              path: {
                type: "string",
                description: "File path to delete"
              },
              create_backup: {
                type: "boolean",
                description: "Create backup before deletion (default: true)",
                default: true
              }
            },
            required: ["path"]
          }
        }
      ]
    };
  });

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;

    try {
      let result;

      switch (name) {
        case "list_directory":
          result = await listDirectory(args.path);
          break;
        case "read_file":
          result = await readFile(args.path, args.encoding || 'utf8');
          break;
        case "write_file":
          result = await writeFile(args.path, args.content, args.create_backup !== false);
          break;
        case "search_files":
          result = await searchFiles(args.directory, args.pattern);
          break;
        case "get_file_info":
          result = await getFileInfo(args.path);
          break;
        case "create_directory":
          result = await createDirectory(args.path);
          break;
        case "delete_file":
          result = await deleteFile(args.path, args.create_backup !== false);
          break;
        default:
          throw new Error(`Unknown tool: ${name}`);
      }

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(result, null, 2)
          }
        ]
      };
    } catch (error) {
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

  const transport = new StdioServerTransport();
  await server.connect(transport);

  log('info', 'File Server MCP running');
}

main().catch((error) => {
  log('error', 'Fatal error:', error);
  process.exit(1);
});
