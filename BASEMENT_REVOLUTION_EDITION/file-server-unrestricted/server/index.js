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

const ALLOWED_DRIVES = (process.env.ALLOWED_DRIVES || 'C,F').split(',');
const DEBUG = process.env.DEBUG === 'true';

function log(level, ...args) {
  if (DEBUG || level === 'error') {
    console.error(`[FILESERVER-${level.toUpperCase()}]`, ...args);
  }
}

function validatePath(filePath) {
  const normalized = path.normalize(filePath);
  const drive = normalized.charAt(0).toUpperCase();

  if (!ALLOWED_DRIVES.includes(drive)) {
    throw new Error(`Access denied: Drive ${drive}:\\ not in allowed list (${ALLOWED_DRIVES.join(', ')})`);
  }

  return normalized;
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

    // Create backup if file exists
    if (createBackup && fsSync.existsSync(validated)) {
      const backupPath = `${validated}.backup_${Date.now()}`;
      await fs.copyFile(validated, backupPath);
      log('info', `Backup created: ${backupPath}`);
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
    const validated = validatePath(directory);
    log('info', `Searching in ${validated} for pattern: ${pattern}`);

    const searchPath = path.join(validated, pattern);
    const files = await glob(searchPath, { windowsPathsNoEscape: true });

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
      backupPath = `${validated}.deleted_${Date.now()}`;
      await fs.copyFile(validated, backupPath);
      log('info', `Backup created: ${backupPath}`);
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
      name: "nova-file-server",
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
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              error: error.message,
              stack: error.stack
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
