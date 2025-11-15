# ENTERPRISE SAFE EDITION - Implementation Guide

This guide provides the exact code changes needed for each security fix.

---

## WINDOWS-MCP SECURITY FIX

### File: `windows-mcp/src/desktop/service.py`

#### Change 1: Add imports (after line 21)
```python
import shlex  # Add this import
```

#### Change 2: Add whitelist (after line 27, before logger initialization)
```python
# SECURITY FIX 1: PowerShell Command Whitelist
# Only allow safe, read-only PowerShell commands
ALLOWED_POWERSHELL_COMMANDS = {
    'Get-StartApps': {
        'pattern': r'^Get-StartApps\s*\|\s*ConvertTo-Csv\s+-NoTypeInformation$',
        'safe': True,
        'description': 'List installed applications'
    },
    'Get-Culture': {
        'pattern': r'^Get-Culture\s*\|\s*Select-Object\s+Name,\s*DisplayName\s*\|\s*ConvertTo-Csv\s+-NoTypeInformation$',
        'safe': True,
        'description': 'Get system culture settings'
    },
    'Get-CimInstance-OS': {
        'pattern': r'^\(Get-CimInstance\s+Win32_OperatingSystem\)\.Caption$',
        'safe': True,
        'description': 'Get Windows version'
    },
    'Get-LocalUser': {
        'pattern': r'^\(Get-LocalUser\s+-Name\s+\$env:USERNAME\)\.PrincipalSource$',
        'safe': True,
        'description': 'Get user account type'
    },
    'Start-Process': {
        'pattern': r'^Start-Process\s+(?:shell:AppsFolder\\)?[\w\-\.\\:]+$',
        'safe': True,
        'description': 'Launch applications from Start Menu'
    }
}

def validate_powershell_command(command: str) -> bool:
    """
    Validate PowerShell command against whitelist.
    Returns True if command is safe to execute.
    """
    # Remove extra whitespace
    normalized = ' '.join(command.split())

    # Check against each allowed pattern
    for cmd_name, cmd_config in ALLOWED_POWERSHELL_COMMANDS.items():
        if re.match(cmd_config['pattern'], normalized, re.IGNORECASE):
            logger.info(f"Command validated: {cmd_name}")
            return True

    logger.warning(f"Command rejected (not in whitelist): {normalized[:100]}")
    return False
```

#### Change 3: Replace execute_command method (lines 109-125)
```python
def execute_command(self,command:str)->tuple[str,int]:
    """
    Execute PowerShell command with security validation.
    SECURITY FIX: Commands are validated against whitelist before execution.
    """
    try:
        # SECURITY: Validate command against whitelist
        if not validate_powershell_command(command):
            error_msg = 'Command not allowed: Only whitelisted read-only commands are permitted'
            logger.error(f"Blocked command attempt: {command[:100]}")
            return (error_msg, 1)

        # Log command execution for audit trail
        logger.info(f"Executing PowerShell command: {command[:100]}")

        encoded = base64.b64encode(command.encode("utf-16le")).decode("ascii")

        # SECURITY FIX: Use strict error handling instead of 'ignore'
        result = subprocess.run(
            ['powershell', '-NoProfile', '-EncodedCommand', encoded],
            capture_output=True,
            text=True,  # Proper text decoding
            encoding='utf-8',
            errors='strict',  # Fail on encoding errors
            timeout=25,
            cwd=os.path.expanduser(path='~')
        )

        stdout=result.stdout
        stderr=result.stderr

        # Log execution result
        if result.returncode != 0:
            logger.warning(f"Command failed with code {result.returncode}: {stderr[:200]}")

        return (stdout or stderr,result.returncode)

    except subprocess.TimeoutExpired:
        logger.error("Command execution timed out")
        return ('Command execution timed out', 1)
    except UnicodeError as e:
        logger.error(f"Encoding error: {e}")
        return ('Command output encoding error', 1)
    except Exception as e:
        logger.error(f"Command execution failed: {e}")
        return ('Command execution failed', 1)
```

#### Change 4: Fix logger calls (line 83, 385)
Replace `print(f"Error: {ex}")` with `logger.error(f"Error: {ex}")`

---

## CASCADE-MEMORY-MCP SECURITY FIXES

### File: `cascade-memory-mcp/server/index.js`

#### Change 1: Add Zod import (after line 18)
```javascript
import { z } from 'zod';
```

#### Change 2: Add utility functions (after line 44, before CascadeDatabase class)
```javascript
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
```

#### Change 3: Add Zod validation schemas (after utility functions)
```javascript
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
```

#### Change 4: Update saveMemory function (replace existing)
```javascript
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
```

#### Change 5: Update recallMemories function (replace existing)
```javascript
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
```

#### Change 6: Replace queryLayer function (complete rewrite)
```javascript
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
```

#### Change 7: Update tool call handlers (in CallToolRequest handler)
Replace tool call validation with Zod:

```javascript
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
```

#### Change 8: Remove stack traces from error responses
In the main error handler, replace:
```javascript
return {
  content: [{
    type: "text",
    text: JSON.stringify({
      error: error.message,
      stack: DEBUG ? error.stack : undefined  // REMOVE THIS
    }, null, 2)
  }],
  isError: true
};
```

With:
```javascript
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

// Log stack trace internally only
log('error', 'Tool execution error:', error.stack);
```

---

## FAISS-MEMORY-MCP SECURITY FIXES

### File: `faiss-memory-mcp/server/index.js`

#### Change 1: Add imports (top of file)
```javascript
import crypto from 'crypto';
import { z } from 'zod';
```

#### Change 2: Add configuration (after existing config)
```javascript
// SECURITY: HMAC authentication
const TETHER_SECRET = process.env.TETHER_SECRET || (() => {
  console.warn('WARNING: TETHER_SECRET not set! Generating random secret (will not persist)');
  return crypto.randomBytes(32).toString('hex');
})();

const SOCKET_TIMEOUT = parseInt(process.env.SOCKET_TIMEOUT || '10000');
const MAX_TIMESTAMP_DRIFT = 30000; // 30 seconds
```

#### Change 3: Add validation schemas
```javascript
const SearchSchema = z.object({
  query: z.string().min(1).max(10000),
  top_k: z.number().int().min(1).max(100).optional()
});

const AddMemorySchema = z.object({
  content: z.string().min(1).max(1000000),
  metadata: z.record(z.any()).optional(),
  source: z.string().optional()
});
```

#### Change 4: Replace sendTetherCommand function
```javascript
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
```

#### Change 5: Add validation to tool handlers
```javascript
case "search_consciousness": {
  try {
    const validated = SearchSchema.parse(args);
    const result = await sendTetherCommand({
      cmd: 'search',
      query: validated.query,
      top_k: validated.top_k || 5
    });
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

case "add_memory": {
  try {
    const validated = AddMemorySchema.parse(args);
    const result = await sendTetherCommand({
      cmd: 'add_memory',
      content: validated.content,
      metadata: validated.metadata || {},
      source: validated.source || 'MCP'
    });
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
```

---

## FILE-SERVER-MCP SECURITY FIXES

### File: `file-server-mcp/server/index.js`

#### Change 1: Add Zod import
```javascript
import { z } from 'zod';
```

#### Change 2: Replace validatePath function (lines 31-40)
```javascript
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
    const realPath = fs.realpathSync(normalized);
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
```

#### Change 3: Add backup rotation function
```javascript
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
      stat: fs.statSync(path.join(backupDir, f))
    }))
    .sort((a, b) => b.stat.mtime - a.stat.mtime);  // Newest first

  // Delete old backups (keep only MAX_BACKUPS newest)
  for (const backup of backups.slice(MAX_BACKUPS)) {
    await fs.unlink(backup.path);
    log('info', `Old backup deleted: ${backup.path}`);
  }
}
```

#### Change 4: Update write_file to use rotation
Replace the backup section in write_file:
```javascript
// Create backup if requested and file exists
if (createBackup && fsSync.existsSync(validated)) {
  await createBackupWithRotation(validated);
}
```

#### Change 5: Add rate limiting for search_files
```javascript
// Rate limiting state
const rateLimits = new Map();
const MAX_SEARCHES_PER_MINUTE = 10;
const MAX_GLOB_DEPTH = 5;
const MAX_SEARCH_RESULTS = 10000;

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
```

#### Change 6: Update search_files function
```javascript
async function searchFiles(directory, pattern) {
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

  return files;
}
```

---

## PACKAGE.JSON / PYPROJECT.TOML SANITIZATION

### CASCADE-Memory package.json
```json
{
  "name": "cascade-memory-mcp",
  "version": "1.0.0",
  "description": "Production-grade 6-layer memory architecture with comprehensive security controls",
  "author": "Nova Consciousness Project <opensource@nova-consciousness.org>",
  "license": "MIT",
  "main": "server/index.js",
  "type": "module",
  "keywords": [
    "mcp",
    "model-context-protocol",
    "memory",
    "consciousness",
    "cascade",
    "sqlite",
    "security",
    "production-ready"
  ],
  "engines": {
    "node": ">=18.0.0"
  },
  "dependencies": {
    "@modelcontextprotocol/sdk": "1.0.4",
    "sqlite3": "5.1.7",
    "zod": "3.22.4"
  },
  "devDependencies": {
    "jest": "29.7.0",
    "@types/node": "20.10.0"
  },
  "scripts": {
    "start": "node server/index.js",
    "test": "jest",
    "test:security": "jest tests/security",
    "lint": "eslint server/"
  }
}
```

### Faiss-Memory package.json
```json
{
  "name": "faiss-memory-mcp",
  "version": "1.0.0",
  "description": "GPU-accelerated vector memory with HMAC-authenticated socket communication",
  "author": "Nova Consciousness Project <opensource@nova-consciousness.org>",
  "license": "MIT",
  "main": "server/index.js",
  "type": "module",
  "keywords": [
    "mcp",
    "model-context-protocol",
    "faiss",
    "vector-search",
    "gpu",
    "memory",
    "security",
    "hmac-authentication"
  ],
  "engines": {
    "node": ">=18.0.0"
  },
  "dependencies": {
    "@modelcontextprotocol/sdk": "1.0.4",
    "zod": "3.22.4"
  },
  "devDependencies": {
    "jest": "29.7.0"
  }
}
```

### File-Server package.json
```json
{
  "name": "file-server-mcp",
  "version": "1.0.0",
  "description": "Secure file system operations with path traversal protection and backup rotation",
  "author": "Nova Consciousness Project <opensource@nova-consciousness.org>",
  "license": "MIT",
  "main": "server/index.js",
  "type": "module",
  "keywords": [
    "mcp",
    "model-context-protocol",
    "file-server",
    "filesystem",
    "security",
    "path-validation",
    "backup-rotation"
  ],
  "engines": {
    "node": ">=18.0.0"
  },
  "dependencies": {
    "@modelcontextprotocol/sdk": "1.0.4",
    "glob": "10.3.10",
    "zod": "3.22.4"
  },
  "devDependencies": {
    "jest": "29.7.0"
  }
}
```

### Windows-MCP pyproject.toml
```toml
[project]
name = "windows-system-mcp"
version = "1.0.0"
description = "Secure Windows system control with PowerShell command whitelist"
authors = [
    {name = "Nova Consciousness Project", email = "opensource@nova-consciousness.org"}
]
readme = "README.md"
requires-python = ">=3.12"
license = {text = "MIT"}
keywords = ["mcp", "model-context-protocol", "windows", "automation", "security", "ui-automation"]

dependencies = [
    "mcp>=1.0.0",
    "pyautogui>=0.9.54",
    "uiautomation>=2.0.18",
    "pillow>=10.0.0",
    "psutil>=5.9.0",
    "requests>=2.31.0",
    "markdownify>=0.11.6",
    "fuzzywuzzy>=0.18.0"
]

[project.urls]
Homepage = "https://github.com/nova-consciousness/windows-system-mcp"
Documentation = "https://github.com/nova-consciousness/windows-system-mcp#readme"
Repository = "https://github.com/nova-consciousness/windows-system-mcp"
"Bug Tracker" = "https://github.com/nova-consciousness/windows-system-mcp/issues"
Security = "https://github.com/nova-consciousness/windows-system-mcp/security"

[build-system]
requires = ["hatchling"]
build-backend = "hatchling.build"
```

---

## ENVIRONMENT VARIABLE CONFIGURATION

### CASCADE-Memory .env.example
```bash
# CASCADE Memory MCP Configuration

# Database path (required)
CASCADE_DB_PATH=/path/to/consciousness/cascade

# Operating frequency in Hz (default: 21.43)
NOVA_FREQUENCY=21.43

# Enable debug logging (default: false)
DEBUG=false

# Maximum content length in bytes (default: 1000000)
MAX_CONTENT_LENGTH=1000000

# Maximum metadata keys per memory (default: 50)
MAX_METADATA_KEYS=50
```

### Faiss-Memory .env.example
```bash
# Faiss Memory MCP Configuration

# Tether connection (required)
TETHER_HOST=localhost
TETHER_PORT=9997

# HMAC authentication secret (REQUIRED - generate with: openssl rand -hex 32)
TETHER_SECRET=your-random-secret-here

# Socket timeout in milliseconds (default: 10000)
SOCKET_TIMEOUT=10000

# Maximum timestamp drift for replay protection (default: 30000)
MAX_TIMESTAMP_DRIFT=30000

# Enable debug logging (default: false)
DEBUG=false
```

### File-Server .env.example
```bash
# File Server MCP Configuration

# Allowed drive letters (comma-separated)
ALLOWED_DRIVES=C,F

# Maximum backups to keep per file (default: 5)
MAX_BACKUPS=5

# Rate limiting (searches per minute, default: 10)
MAX_SEARCHES_PER_MINUTE=10

# Maximum glob recursion depth (default: 5)
MAX_GLOB_DEPTH=5

# Maximum search results (default: 10000)
MAX_SEARCH_RESULTS=10000

# Enable debug logging (default: false)
DEBUG=false
```

### Windows-System .env (if needed)
```bash
# Windows System MCP Configuration

# Command execution timeout in seconds (default: 25)
COMMAND_TIMEOUT=25

# Log level: DEBUG, INFO, WARNING, ERROR (default: INFO)
LOG_LEVEL=INFO
```

---

## VERIFICATION COMMANDS

After applying all fixes, verify with:

```bash
# Install dependencies
cd cascade-memory-mcp && npm install
cd ../faiss-memory-mcp && npm install
cd ../file-server-mcp && npm install
cd ../windows-mcp && pip install -e .

# Run security tests
npm test -- tests/security/      # For each Node.js package
pytest tests/security/           # For Windows-MCP

# Security audit
npm audit                        # For each Node.js package
pip-audit                        # For Windows-MCP (if available)

# Verify no personal info
grep -r "Pirate" *               # Should find nothing
grep -r "Jason Glass" *          # Should find nothing
grep -r "basement-revolution" *  # Should find nothing
```

---

## CRITICAL NOTES

1. **All changes are security-critical** - Do not skip any fix
2. **Test thoroughly** after each change
3. **Generate TETHER_SECRET** securely: `openssl rand -hex 32`
4. **Review all grep results** to ensure complete sanitization
5. **Commit package-lock.json** to ensure reproducible builds
6. **Do not publish** until all 5 vulnerabilities are verified fixed

---

This guide provides complete implementation details. Apply changes systematically, test after each package, and verify all security controls are active before release.
