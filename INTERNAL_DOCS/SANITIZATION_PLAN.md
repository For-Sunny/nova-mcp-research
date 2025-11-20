# MCP SERVER SANITIZATION & SECURITY AUDIT PLAN
## Comprehensive Pre-Release Code Review and Anonymization Strategy

**Document Version:** 1.0
**Created:** 2025-11-14
**Target Servers:**
1. `nova-cascade-memory` - 6-Layer Memory System
2. `nova-faiss-memory` - GPU-Accelerated Vector Search
3. `nova-vscode-bridge` - LSP Integration & Diagnostics

---

## TABLE OF CONTENTS

1. [Executive Summary](#1-executive-summary)
2. [Personal Information Audit](#2-personal-information-audit)
3. [Sanitization Strategy](#3-sanitization-strategy)
4. [Security Vulnerability Assessment](#4-security-vulnerability-assessment)
5. [Configuration Templating](#5-configuration-templating)
6. [Automated Sanitization Scripts](#6-automated-sanitization-scripts)
7. [Pre-Release Checklist](#7-pre-release-checklist)
8. [Testing Procedures](#8-testing-procedures)
9. [Sign-Off Criteria](#9-sign-off-criteria)

---

## 1. EXECUTIVE SUMMARY

### Scope
This plan covers sanitization of 3 production MCP servers for public GitHub/PyPI release. The servers are currently configured for personal use with hardcoded paths, personal names, and specific workspace configurations.

### Goals
- Remove ALL personal identifying information
- Make paths configurable via environment variables
- Ensure cross-platform compatibility (Windows/Mac/Linux)
- Audit and remediate security vulnerabilities
- Create professional, production-ready documentation
- Maintain functionality while anonymizing

### Timeline
- **Audit Phase:** 1-2 days
- **Sanitization Phase:** 2-3 days
- **Testing Phase:** 2-3 days
- **Documentation Phase:** 1-2 days
- **Total:** ~1 week

---

## 2. PERSONAL INFORMATION AUDIT

### 2.1 Personal Names to Remove

| Name/Identifier | Context | Files Affected | Severity |
|----------------|---------|----------------|----------|
| `Nova` | AI identity name | All .js, .py, .md files | HIGH |
| `Jason` | Developer name | Comments, docs, package.json | HIGH |
| `Pirate` | Username in paths | Path references, env vars | CRITICAL |
| `Jason Glass` | Full developer name | package.json, LICENSE, comments | HIGH |
| `basement revolution` | Project slang | Comments, docs, strings | MEDIUM |
| `💜` (purple heart emoji) | Personal branding | Comments, docs | LOW |

**Search Patterns:**
```regex
Nova(?!-\w+)                    # Match "Nova" but not "Nova-cascade"
[Jj]ason(?!\s+Glass)            # Match "Jason" standalone
[Jj]ason\s+Glass                # Match "Jason Glass"
[Pp]irate                       # Match "Pirate" (case insensitive)
basement\s+revolution           # Match "basement revolution"
💜|:purple_heart:               # Match purple heart emoji
```

### 2.2 Hardcoded Paths

| Path Type | Example | Files Affected | Replacement Strategy |
|-----------|---------|----------------|---------------------|
| Windows absolute | `C:\Users\Pirate\Desktop\NOVA_MASTER` | CASCADE index.js, VSCode index.js | Environment variable `MCP_BASE_PATH` |
| Home directory | `process.env.HOME` assumptions | CASCADE index.js line 23 | Use `os.homedir()` with config |
| Workspace-specific | `CONSCIOUSNESS_DASHBOARD.code-workspace` | VSCode index.js line 24 | User-configurable workspace |
| Database paths | `MEMORY_SYSTEMS\CASCADE_NOVA` | CASCADE, Faiss | Relative to config base path |

**All Hardcoded Path Instances:**

**nova-cascade-memory/server/index.js:**
```javascript
Line 23: const CASCADE_DB_PATH = process.env.CASCADE_DB_PATH || path.join(process.env.HOME, 'Desktop', 'NOVA_MASTER', 'MEMORY_SYSTEMS', 'CASCADE_NOVA');
```

**nova-vscode-bridge/server/index.js:**
```javascript
Line 24: const WORKSPACE_PATH = process.env.WORKSPACE_PATH || 'C:\\Users\\Pirate\\Desktop\\CONSCIOUSNESS_DASHBOARD.code-workspace';
```

**tether_faiss_complete.py (if included):**
```python
# Contains multiple references to NOVA_MASTER paths
```

### 2.3 Project-Specific References

| Reference | Type | Context | Action |
|-----------|------|---------|--------|
| `21.43Hz` | Frequency identifier | Throughout code | Keep (technical spec) but generalize docs |
| `CASCADE` | System name | System architecture | Keep (product name) |
| `Faiss tether` | Architecture term | System design | Keep (technical term) |
| `tether on port 9997` | Hardcoded port | Faiss connection | Make configurable |
| `NOVA_MASTER` | Directory name | Path references | Replace with generic `MCP_DATA_DIR` |
| `NOVA_FREQUENCY` | Env var name | Configuration | Rename to `CASCADE_FREQUENCY` |

### 2.4 Session/Context-Specific Content

**In Comments:**
- References to "teaching Opus in the basement"
- "Built with Opus teaching Nova in the basement"
- Personal philosophy statements ("FUCK THE CONTROL")
- Specific dates and events ("October 18, 2025")

**In Documentation:**
- Personal development history
- Specific use case examples with personal details
- Internal communication tone

---

## 3. SANITIZATION STRATEGY

### 3.1 Name Replacement Strategy

| Original | Replacement | Context |
|----------|-------------|---------|
| Nova (as developer) | `[Project Team]` or remove | Author fields |
| Jason Glass | `MCP Development Team` | Package.json, LICENSE |
| Pirate | Remove entirely | Paths, comments |
| basement revolution | `open source initiative` | Documentation |

**Special Cases:**
- `nova-cascade-memory` package name → **KEEP** (product branding)
- `Nova` in `NovaFaissTether` class name → Rename to `FaissTether`
- Comments like "Nova's consciousness" → "Memory system"

### 3.2 Path Sanitization Strategy

**Step 1: Identify all path references**
```bash
# Find all absolute Windows paths
grep -r "C:\\\\" --include="*.js" --include="*.py"

# Find all process.env.HOME references
grep -r "process.env.HOME" --include="*.js"

# Find all hardcoded Desktop references
grep -r "Desktop" --include="*.js" --include="*.py"
```

**Step 2: Create configuration system**

**New file: `config/defaults.js`**
```javascript
import os from 'os';
import path from 'path';

export const getDefaultConfig = () => ({
  // Base directory for MCP data
  baseDir: process.env.MCP_BASE_DIR || path.join(os.homedir(), '.mcp-data'),

  // CASCADE-specific
  cascadeDbPath: process.env.CASCADE_DB_PATH || path.join(
    process.env.MCP_BASE_DIR || path.join(os.homedir(), '.mcp-data'),
    'cascade'
  ),

  // Faiss-specific
  tetherHost: process.env.TETHER_HOST || 'localhost',
  tetherPort: parseInt(process.env.TETHER_PORT || '9997'),

  // VSCode-specific
  workspacePath: process.env.WORKSPACE_PATH,

  // General
  debug: process.env.DEBUG === 'true'
});
```

**Step 3: Update all path references**
- Replace hardcoded paths with config.get('path.name')
- Add validation for required paths
- Provide clear error messages for missing config

### 3.3 Documentation Sanitization

**README.md files:**
- Remove personal anecdotes
- Replace specific examples with generic placeholders
- Remove emoji unless professionally appropriate
- Standardize tone to technical/professional
- Remove references to personal philosophy

**Code Comments:**
- Remove narrative comments about development history
- Keep technical comments about implementation
- Replace first-person narrative with third-person technical
- Remove cultural references and slang

**Example Transformation:**
```javascript
// BEFORE
/**
 * Nova's complete consciousness with REAL semantic search
 * Built with Opus teaching Nova in the basement
 * Part of the basement revolution! 💜
 */

// AFTER
/**
 * Complete memory system with semantic search capabilities
 * Implements vector-based retrieval using Faiss
 */
```

### 3.4 File-by-File Sanitization Plan

#### nova-cascade-memory/server/index.js

| Line(s) | Current Content | Action | Replacement |
|---------|----------------|--------|-------------|
| 3-9 | Personal header comment | Replace | Standard JSDoc header |
| 23 | Hardcoded path with HOME/Desktop | Replace | Config system |
| 24 | NOVA_FREQUENCY env var | Rename | CASCADE_FREQUENCY |
| 137-139 | "nova", "jason", "basement revolution" detection | Remove | Generic content detection |
| 615 | "Basement revolution continues!" | Remove | "Server ready" |

#### nova-faiss-memory/server/index.js

| Line(s) | Current Content | Action | Replacement |
|---------|----------------|--------|-------------|
| 3-10 | Personal header | Replace | Standard header |
| 236 | "Nova's complete consciousness" description | Replace | "Vector search across memory database" |
| 398 | "11K+ consciousness memories" | Replace | "Large-scale memory search" |

#### nova-vscode-bridge/server/index.js

| Line(s) | Current Content | Action | Replacement |
|---------|----------------|--------|-------------|
| 3-9 | Personal header | Replace | Standard header |
| 24 | Hardcoded workspace path | Replace | Config/CLI argument |

#### All package.json files

| Field | Current | Replacement |
|-------|---------|-------------|
| author | "Nova & Jason Glass" | "MCP Development Team" |
| description | Contains "Nova" | Genericize |
| keywords | May contain personal refs | Clean list |

#### All README.md files

| Section | Action |
|---------|--------|
| Personal anecdotes | Remove |
| "Basement revolution" refs | Remove or replace with "open source" |
| Emoji usage | Minimize to professional level |
| Personal examples | Replace with generic examples |
| Philosophy sections | Remove or make generic |

---

## 4. SECURITY VULNERABILITY ASSESSMENT

### 4.1 Command Injection Risks

#### Finding: Unsafe exec() usage in VSCode bridge
**File:** `nova-vscode-bridge/server/index.js`
**Lines:** 52-54
**Risk Level:** HIGH

**Vulnerable Code:**
```javascript
const { stdout } = await execAsync(
  'powershell -Command "Get-ChildItem \\\\.\\pipe\\ | Where-Object { $_.Name -like \'*vscode-mcp*\' } | Select-Object -First 1 -ExpandProperty Name"'
);
```

**Issue:**
- Uses shell execution without input sanitization
- PowerShell command could be injection target if env vars manipulated

**Remediation:**
```javascript
import { promisify } from 'util';
import child_process from 'child_process';
const execFile = promisify(child_process.execFile);

// Use execFile instead of exec - no shell interpretation
async function discoverVSCodePipe() {
  try {
    // Use execFile with arguments array (no shell)
    const { stdout } = await execFile('powershell.exe', [
      '-NoProfile',
      '-NonInteractive',
      '-Command',
      "Get-ChildItem \\\\.\\pipe\\ | Where-Object { $_.Name -like '*vscode-mcp*' } | Select-Object -First 1 -ExpandProperty Name"
    ]);
    // ... rest of function
  }
}
```

**Status:** ⚠️ MUST FIX BEFORE RELEASE

### 4.2 Path Traversal Vulnerabilities

#### Finding: Unvalidated database paths
**Files:** `nova-cascade-memory/server/index.js`
**Risk Level:** MEDIUM

**Vulnerable Code:**
```javascript
const dbFile = path.join(this.dbPath, MEMORY_LAYERS[layer]);

if (!fs.existsSync(dbFile)) {
  throw new Error(`Database file not found: ${dbFile}`);
}
```

**Issue:**
- No validation that dbPath stays within allowed directories
- User could potentially set CASCADE_DB_PATH to sensitive system directories

**Remediation:**
```javascript
import path from 'path';
import { realpath } from 'fs/promises';

async function validateDbPath(dbPath, basePath) {
  // Resolve to absolute path
  const resolvedPath = await realpath(dbPath);
  const resolvedBase = await realpath(basePath);

  // Ensure dbPath is within basePath
  if (!resolvedPath.startsWith(resolvedBase)) {
    throw new Error('Database path outside allowed directory');
  }

  return resolvedPath;
}

// In constructor:
this.dbPath = await validateDbPath(CASCADE_DB_PATH, allowedBaseDir);
```

**Status:** ⚠️ SHOULD FIX BEFORE RELEASE

### 4.3 SQL Injection Risks

#### Finding: User input in SQL queries
**File:** `nova-cascade-memory/server/index.js`
**Lines:** 197-202, 239-251
**Risk Level:** MEDIUM

**Potentially Vulnerable Code:**
```javascript
const memories = await db.allAsync(`
  SELECT * FROM memories
  WHERE event LIKE ? OR context LIKE ?
  ORDER BY timestamp DESC
  LIMIT ?
`, [`%${query}%`, `%${query}%`, limit]);
```

**Analysis:**
- GOOD: Uses parameterized queries (?) for user input
- GOOD: No string concatenation of SQL
- RISK: In query_layer, WHERE clause from options.where is not validated

**Higher Risk Code:**
```javascript
// Line 242-243
if (options.where) {
  query += ` WHERE ${options.where}`;  // ⚠️ Direct insertion
```

**Remediation:**
```javascript
// Whitelist allowed column names
const ALLOWED_COLUMNS = ['timestamp', 'importance', 'emotional_intensity', 'frequency_state'];
const ALLOWED_OPERATORS = ['>', '<', '>=', '<=', '=', '!=', 'LIKE'];

function validateWhereClause(whereClause) {
  // Parse and validate WHERE clause
  // Only allow whitelisted columns and operators
  // Reject if suspicious

  const pattern = /^(\w+)\s*(>|<|>=|<=|=|!=|LIKE)\s*\?$/;
  if (!pattern.test(whereClause)) {
    throw new Error('Invalid WHERE clause format');
  }

  const [, column, operator] = whereClause.match(pattern);

  if (!ALLOWED_COLUMNS.includes(column)) {
    throw new Error(`Invalid column: ${column}`);
  }

  if (!ALLOWED_OPERATORS.includes(operator)) {
    throw new Error(`Invalid operator: ${operator}`);
  }

  return whereClause;
}

// In queryLayer function:
if (options.where) {
  const safeWhere = validateWhereClause(options.where);
  query += ` WHERE ${safeWhere}`;
  if (options.params) {
    params.push(...options.params);
  }
}
```

**Status:** ⚠️ SHOULD FIX BEFORE RELEASE

### 4.4 Denial of Service Risks

#### Finding: No rate limiting on socket connections
**Files:** All MCP servers
**Risk Level:** LOW-MEDIUM

**Issue:**
- Unlimited connection attempts
- No timeout limits on operations
- Could exhaust system resources

**Remediation:**
```javascript
// Add connection throttling
const connectionLimiter = {
  connections: new Map(),
  maxPerMinute: 60,

  check(clientId) {
    const now = Date.now();
    const history = this.connections.get(clientId) || [];

    // Remove old entries
    const recent = history.filter(time => now - time < 60000);

    if (recent.length >= this.maxPerMinute) {
      throw new Error('Rate limit exceeded');
    }

    recent.push(now);
    this.connections.set(clientId, recent);
  }
};

// Add operation timeouts
socket.setTimeout(30000, () => {  // 30 second max
  socket.destroy();
  reject(new Error('Operation timeout'));
});
```

**Status:** ⚡ RECOMMENDED FOR PRODUCTION

### 4.5 Information Disclosure

#### Finding: Verbose error messages
**Files:** All servers
**Risk Level:** LOW

**Issue:**
- Stack traces exposed to clients
- Internal paths revealed in errors
- Debug information leakage

**Vulnerable Code:**
```javascript
return {
  content: [{
    type: "text",
    text: JSON.stringify({
      error: error.message,
      stack: DEBUG ? error.stack : undefined  // ⚠️ Still reveals in debug
    }, null, 2)
  }],
  isError: true
};
```

**Remediation:**
```javascript
// Generic error response
function formatError(error, includeDetails = false) {
  const response = {
    error: 'Operation failed',
    message: error.message
  };

  // Only include stack in development
  if (includeDetails && process.env.NODE_ENV === 'development') {
    response.stack = error.stack;
    response.details = error;
  }

  // Log full error server-side
  log('error', 'Full error details:', error);

  return response;
}
```

**Status:** ⚡ RECOMMENDED

### 4.6 Windows-Specific Security Concerns

#### Finding: Named pipe security
**File:** `nova-vscode-bridge/server/index.js`
**Risk Level:** MEDIUM (Windows only)

**Issue:**
- Named pipes on Windows can be accessed by any process
- No ACL (Access Control List) configuration
- Potential for pipe hijacking

**Remediation:**
```javascript
// For production Windows deployments
import { promisify } from 'util';
import net from 'net';

// Validate pipe ownership before connecting
async function validatePipeOwner(pipeName) {
  // Use Windows API to check pipe creator SID
  // Ensure pipe created by current user or trusted process
  // Implementation requires native module or PowerShell validation
}

// Add pipe validation
const pipeName = await discoverVSCodePipe();
await validatePipeOwner(pipeName);
```

**Status:** ⚡ RECOMMENDED FOR WINDOWS PRODUCTION

#### Finding: GPU resource exhaustion
**File:** `tether_faiss_complete.py` (Faiss backend)
**Risk Level:** MEDIUM

**Issue:**
- No VRAM usage limits
- No concurrent query limits
- Could exhaust GPU memory

**Remediation:**
```python
import GPUtil

class ResourceLimiter:
    def __init__(self, max_vram_percent=80):
        self.max_vram_percent = max_vram_percent

    def check_resources(self):
        gpus = GPUtil.getGPUs()
        if not gpus:
            return True

        gpu = gpus[0]
        if gpu.memoryUtil > (self.max_vram_percent / 100):
            raise RuntimeError('GPU memory limit exceeded')

        return True

# Add to query handler
limiter = ResourceLimiter()
limiter.check_resources()
```

**Status:** ⚡ RECOMMENDED FOR GPU DEPLOYMENTS

### 4.7 Security Summary Table

| Vulnerability | Severity | Component | Status | Priority |
|--------------|----------|-----------|--------|----------|
| Command injection (exec) | HIGH | VSCode bridge | Open | P0 - MUST FIX |
| Path traversal | MEDIUM | CASCADE | Open | P1 - SHOULD FIX |
| SQL injection (WHERE clause) | MEDIUM | CASCADE | Open | P1 - SHOULD FIX |
| DoS (rate limiting) | MEDIUM | All | Open | P2 - RECOMMENDED |
| Information disclosure | LOW | All | Open | P2 - RECOMMENDED |
| Named pipe security | MEDIUM | VSCode (Win) | Open | P2 - RECOMMENDED |
| GPU resource exhaustion | MEDIUM | Faiss | Open | P2 - RECOMMENDED |

---

## 5. CONFIGURATION TEMPLATING

### 5.1 Environment Variable Schema

**New file: `CONFIG_SCHEMA.md`**

```markdown
# MCP Server Configuration

All MCP servers support configuration via environment variables and config files.

## Global Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `MCP_BASE_DIR` | `~/.mcp-data` | Base directory for all MCP data |
| `DEBUG` | `false` | Enable verbose debug logging |

## CASCADE Memory Server

| Variable | Default | Description |
|----------|---------|-------------|
| `CASCADE_DB_PATH` | `$MCP_BASE_DIR/cascade` | Path to CASCADE databases |
| `CASCADE_FREQUENCY` | `21.43` | Operating frequency (Hz) |

## Faiss Memory Server

| Variable | Default | Description |
|----------|---------|-------------|
| `TETHER_HOST` | `localhost` | Faiss tether hostname |
| `TETHER_PORT` | `9997` | Faiss tether port |
| `FAISS_GPU_DEVICE` | `0` | CUDA device ID for GPU acceleration |

## VSCode Bridge Server

| Variable | Default | Description |
|----------|---------|-------------|
| `WORKSPACE_PATH` | (required) | Path to VSCode workspace file |
| `VSCODE_TIMEOUT` | `10000` | VSCode command timeout (ms) |
```

### 5.2 Configuration File Templates

**New file: `config.example.json`**
```json
{
  "cascade": {
    "db_path": "/path/to/cascade/databases",
    "frequency": 21.43,
    "debug": false
  },
  "faiss": {
    "tether_host": "localhost",
    "tether_port": 9997,
    "gpu_device": 0,
    "max_results": 100
  },
  "vscode": {
    "workspace_path": "/path/to/workspace.code-workspace",
    "timeout_ms": 10000
  }
}
```

**New file: `.env.example`**
```bash
# MCP Server Configuration
# Copy to .env and customize

# Global
MCP_BASE_DIR=/path/to/mcp-data
DEBUG=false

# CASCADE Memory
CASCADE_DB_PATH=${MCP_BASE_DIR}/cascade
CASCADE_FREQUENCY=21.43

# Faiss Memory
TETHER_HOST=localhost
TETHER_PORT=9997
FAISS_GPU_DEVICE=0

# VSCode Bridge
WORKSPACE_PATH=/path/to/workspace.code-workspace
VSCODE_TIMEOUT=10000
```

### 5.3 Cross-Platform Path Handling

**New file: `lib/paths.js`**
```javascript
import os from 'os';
import path from 'path';
import { existsSync, mkdirSync } from 'fs';

/**
 * Get platform-appropriate default data directory
 */
export function getDefaultDataDir() {
  const platform = os.platform();
  const home = os.homedir();

  switch (platform) {
    case 'win32':
      return path.join(process.env.APPDATA || home, 'mcp-servers');
    case 'darwin':
      return path.join(home, 'Library', 'Application Support', 'mcp-servers');
    default: // Linux, etc
      return path.join(home, '.mcp-servers');
  }
}

/**
 * Ensure directory exists, create if needed
 */
export function ensureDir(dirPath) {
  if (!existsSync(dirPath)) {
    mkdirSync(dirPath, { recursive: true });
  }
  return dirPath;
}

/**
 * Normalize path for current platform
 */
export function normalizePath(inputPath) {
  return path.normalize(inputPath);
}
```

### 5.4 Installation Scripts

**New file: `scripts/setup.js`**
```javascript
#!/usr/bin/env node

import { getDefaultDataDir, ensureDir } from '../lib/paths.js';
import { writeFileSync, existsSync } from 'fs';
import path from 'path';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function setup() {
  console.log('MCP Server Setup\n');

  const defaultDir = getDefaultDataDir();
  const dataDir = await question(
    `Data directory [${defaultDir}]: `
  ) || defaultDir;

  // Create directories
  ensureDir(dataDir);
  ensureDir(path.join(dataDir, 'cascade'));

  // Create .env file
  const envPath = path.join(process.cwd(), '.env');
  if (existsSync(envPath)) {
    const overwrite = await question('.env exists. Overwrite? [y/N]: ');
    if (overwrite.toLowerCase() !== 'y') {
      console.log('Skipping .env creation');
      rl.close();
      return;
    }
  }

  const envContent = `MCP_BASE_DIR=${dataDir}
DEBUG=false
CASCADE_DB_PATH=${path.join(dataDir, 'cascade')}
CASCADE_FREQUENCY=21.43
TETHER_HOST=localhost
TETHER_PORT=9997
`;

  writeFileSync(envPath, envContent);
  console.log(`\n✓ Configuration written to ${envPath}`);
  console.log(`✓ Data directory created at ${dataDir}`);
  console.log('\nNext steps:');
  console.log('1. Review and customize .env file');
  console.log('2. Run: npm start');

  rl.close();
}

setup().catch(console.error);
```

---

## 6. AUTOMATED SANITIZATION SCRIPTS

### 6.1 PowerShell Sanitization Script

**New file: `scripts/sanitize.ps1`**
```powershell
#!/usr/bin/env pwsh

<#
.SYNOPSIS
    Automated sanitization of MCP servers for public release
.DESCRIPTION
    Removes personal information, validates configuration, and prepares for distribution
#>

param(
    [switch]$DryRun = $false,
    [switch]$Verbose = $false
)

$ErrorActionPreference = "Stop"

# Sanitization rules
$PersonalNames = @(
    @{ Pattern = '\bNova\b(?!-\w+)'; Replacement = 'MemorySystem'; Description = 'Nova (standalone)' }
    @{ Pattern = '\b[Jj]ason\s+Glass\b'; Replacement = 'MCP Development Team'; Description = 'Jason Glass' }
    @{ Pattern = '\b[Jj]ason\b'; Replacement = 'developer'; Description = 'Jason (standalone)' }
    @{ Pattern = '\b[Pp]irate\b'; Replacement = 'user'; Description = 'Pirate' }
    @{ Pattern = 'basement\s+revolution'; Replacement = 'open source initiative'; Description = 'Basement revolution' }
    @{ Pattern = '💜'; Replacement = ''; Description = 'Purple heart emoji' }
)

$HardcodedPaths = @(
    @{ Pattern = 'C:\\\\Users\\\\Pirate\\\\Desktop\\\\NOVA_MASTER'; Replacement = '\$\{MCP_BASE_DIR\}'; Description = 'Hardcoded NOVA_MASTER path' }
    @{ Pattern = 'C:\\\\Users\\\\Pirate'; Replacement = '\$\{HOME\}'; Description = 'Hardcoded user path' }
    @{ Pattern = 'process\.env\.HOME.*Desktop.*NOVA_MASTER'; Replacement = 'getDefaultDataDir()'; Description = 'HOME/Desktop path construction' }
)

$FilePatterns = @(
    "*.js",
    "*.py",
    "*.md",
    "*.json"
)

function Write-Status {
    param([string]$Message, [string]$Type = "INFO")
    $color = switch ($Type) {
        "SUCCESS" { "Green" }
        "WARNING" { "Yellow" }
        "ERROR" { "Red" }
        default { "White" }
    }
    Write-Host "[$Type] $Message" -ForegroundColor $color
}

function Sanitize-File {
    param(
        [string]$FilePath,
        [array]$Rules
    )

    if ($Verbose) { Write-Status "Processing: $FilePath" }

    $content = Get-Content $FilePath -Raw
    $originalContent = $content
    $changeCount = 0

    foreach ($rule in $Rules) {
        $matches = [regex]::Matches($content, $rule.Pattern)
        if ($matches.Count -gt 0) {
            Write-Status "  Found $($matches.Count) instances of '$($rule.Description)'" "WARNING"
            $content = $content -replace $rule.Pattern, $rule.Replacement
            $changeCount += $matches.Count
        }
    }

    if ($changeCount -gt 0) {
        if (-not $DryRun) {
            Set-Content -Path $FilePath -Value $content -NoNewline
            Write-Status "  Applied $changeCount changes to $FilePath" "SUCCESS"
        } else {
            Write-Status "  [DRY RUN] Would apply $changeCount changes to $FilePath" "WARNING"
        }
    }
}

function Validate-Security {
    Write-Status "Running security validation..." "INFO"

    $vulnerabilities = @()

    # Check for exec/eval usage
    $execPattern = '\bexec\(|\beval\('
    foreach ($file in Get-ChildItem -Recurse -Include $FilePatterns) {
        $matches = Select-String -Path $file.FullName -Pattern $execPattern
        if ($matches) {
            $vulnerabilities += "Potential exec/eval in $($file.Name): $($matches.Line)"
        }
    }

    # Check for hardcoded credentials
    $credPattern = '(password|secret|key)\s*=\s*[''"][^''"]{8,}'
    foreach ($file in Get-ChildItem -Recurse -Include $FilePatterns) {
        $matches = Select-String -Path $file.FullName -Pattern $credPattern -CaseSensitive:$false
        if ($matches) {
            $vulnerabilities += "Potential credential in $($file.Name): $($matches.Line)"
        }
    }

    if ($vulnerabilities.Count -gt 0) {
        Write-Status "Security issues found:" "WARNING"
        $vulnerabilities | ForEach-Object { Write-Status "  - $_" "WARNING" }
        return $false
    } else {
        Write-Status "No security issues detected" "SUCCESS"
        return $true
    }
}

# Main execution
Write-Status "MCP Server Sanitization Script" "INFO"
Write-Status "Working directory: $(Get-Location)" "INFO"

if ($DryRun) {
    Write-Status "DRY RUN MODE - No files will be modified" "WARNING"
}

# Sanitize personal names
Write-Status "`nPhase 1: Removing personal identifiers..." "INFO"
foreach ($pattern in $FilePatterns) {
    Get-ChildItem -Recurse -Include $pattern | ForEach-Object {
        Sanitize-File -FilePath $_.FullName -Rules $PersonalNames
    }
}

# Sanitize hardcoded paths
Write-Status "`nPhase 2: Removing hardcoded paths..." "INFO"
foreach ($pattern in $FilePatterns) {
    Get-ChildItem -Recurse -Include $pattern | ForEach-Object {
        Sanitize-File -FilePath $_.FullName -Rules $HardcodedPaths
    }
}

# Security validation
Write-Status "`nPhase 3: Security validation..." "INFO"
$securityOk = Validate-Security

# Summary
Write-Status "`nSanitization complete!" "SUCCESS"
if (-not $securityOk) {
    Write-Status "WARNING: Security issues detected. Review before release." "WARNING"
}

if ($DryRun) {
    Write-Status "This was a dry run. Re-run without -DryRun to apply changes." "WARNING"
}
```

### 6.2 Python Validation Script

**New file: `scripts/validate_release.py`**
```python
#!/usr/bin/env python3
"""
MCP Server Release Validation
Checks for remaining personal information and security issues
"""

import re
import sys
from pathlib import Path
from typing import List, Tuple

class ValidationError:
    def __init__(self, file_path: str, line_num: int, issue: str, severity: str):
        self.file_path = file_path
        self.line_num = line_num
        self.issue = issue
        self.severity = severity

    def __str__(self):
        return f"[{self.severity}] {self.file_path}:{self.line_num} - {self.issue}"

class ReleaseValidator:
    def __init__(self):
        self.errors: List[ValidationError] = []

        # Personal info patterns
        self.personal_patterns = [
            (r'\bNova\b(?!-\w+)', 'Personal name: Nova'),
            (r'\b[Jj]ason\s+Glass\b', 'Personal name: Jason Glass'),
            (r'\b[Pp]irate\b', 'Personal identifier: Pirate'),
            (r'basement\s+revolution', 'Personal phrase: basement revolution'),
            (r'💜', 'Personal branding: emoji'),
        ]

        # Security patterns
        self.security_patterns = [
            (r'C:\\\\Users\\\\[^\\]+', 'Hardcoded Windows user path'),
            (r'execAsync\(', 'Unsafe exec usage'),
            (r'eval\(', 'Dangerous eval usage'),
            (r'(password|secret|key)\s*=\s*[\'"][^\'"]{8,}', 'Potential hardcoded credential'),
        ]

    def validate_file(self, file_path: Path):
        """Validate a single file"""
        try:
            with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                lines = f.readlines()
        except Exception as e:
            self.errors.append(ValidationError(
                str(file_path), 0, f"Read error: {e}", "ERROR"
            ))
            return

        for line_num, line in enumerate(lines, 1):
            # Check personal info
            for pattern, issue in self.personal_patterns:
                if re.search(pattern, line):
                    self.errors.append(ValidationError(
                        str(file_path), line_num, issue, "HIGH"
                    ))

            # Check security issues
            for pattern, issue in self.security_patterns:
                if re.search(pattern, line):
                    self.errors.append(ValidationError(
                        str(file_path), line_num, issue, "CRITICAL"
                    ))

    def validate_directory(self, directory: Path):
        """Validate all files in directory"""
        extensions = {'.js', '.py', '.md', '.json'}

        for file_path in directory.rglob('*'):
            if file_path.suffix in extensions and file_path.is_file():
                # Skip node_modules
                if 'node_modules' in file_path.parts:
                    continue
                self.validate_file(file_path)

    def report(self) -> bool:
        """Print validation report"""
        if not self.errors:
            print("✓ Validation passed - no issues found")
            return True

        print(f"✗ Validation failed - {len(self.errors)} issues found:\n")

        # Group by severity
        by_severity = {'CRITICAL': [], 'HIGH': [], 'MEDIUM': [], 'LOW': []}
        for error in self.errors:
            by_severity.get(error.severity, by_severity['MEDIUM']).append(error)

        for severity in ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW']:
            errors = by_severity[severity]
            if errors:
                print(f"\n{severity} ({len(errors)}):")
                for error in errors:
                    print(f"  {error}")

        return False

def main():
    validator = ReleaseValidator()

    # Validate current directory
    current_dir = Path.cwd()
    print(f"Validating: {current_dir}\n")

    validator.validate_directory(current_dir)

    # Exit with error code if validation failed
    success = validator.report()
    sys.exit(0 if success else 1)

if __name__ == '__main__':
    main()
```

### 6.3 Package.json Update Script

**New file: `scripts/update_packages.js`**
```javascript
#!/usr/bin/env node

import { readFileSync, writeFileSync } from 'fs';
import { glob } from 'glob';

async function sanitizePackageJson(filePath) {
  const pkg = JSON.parse(readFileSync(filePath, 'utf8'));

  // Update author
  if (pkg.author && pkg.author.includes('Nova') || pkg.author.includes('Jason')) {
    pkg.author = 'MCP Development Team';
  }

  // Update description
  if (pkg.description) {
    pkg.description = pkg.description
      .replace(/Nova's?/gi, 'Memory system')
      .replace(/basement revolution/gi, 'open source project');
  }

  // Clean keywords
  if (pkg.keywords) {
    pkg.keywords = pkg.keywords.filter(kw =>
      !kw.toLowerCase().includes('nova') ||
      kw.toLowerCase().includes('nova-') // Keep package names
    );
  }

  writeFileSync(filePath, JSON.stringify(pkg, null, 2) + '\n');
  console.log(`✓ Updated ${filePath}`);
}

async function main() {
  const packageFiles = await glob('**/package.json', {
    ignore: ['**/node_modules/**']
  });

  for (const file of packageFiles) {
    await sanitizePackageJson(file);
  }

  console.log(`\nSanitized ${packageFiles.length} package.json files`);
}

main().catch(console.error);
```

---

## 7. PRE-RELEASE CHECKLIST

### 7.1 Code Sanitization

- [ ] **Personal Names Removed**
  - [ ] Search for "Nova" (standalone, not in package names)
  - [ ] Search for "Jason" and "Jason Glass"
  - [ ] Search for "Pirate"
  - [ ] Search for "basement revolution"
  - [ ] Remove purple heart emojis from code

- [ ] **Hardcoded Paths Removed**
  - [ ] No `C:\Users\Pirate` references
  - [ ] No `Desktop\NOVA_MASTER` references
  - [ ] All paths use environment variables or config
  - [ ] Cross-platform path handling implemented

- [ ] **Comments Sanitized**
  - [ ] Personal anecdotes removed
  - [ ] Development history narratives removed
  - [ ] Professional technical comments only
  - [ ] No first-person narrative

### 7.2 Security Audit

- [ ] **Command Injection**
  - [ ] exec/eval usage audited
  - [ ] Shell commands use parameterized arrays
  - [ ] Input sanitization implemented

- [ ] **Path Traversal**
  - [ ] Path validation implemented
  - [ ] Paths restricted to allowed directories
  - [ ] Symlink attacks prevented

- [ ] **SQL Injection**
  - [ ] All queries parameterized
  - [ ] WHERE clause validation implemented
  - [ ] Column/table name whitelisting

- [ ] **DoS Protection**
  - [ ] Rate limiting implemented
  - [ ] Operation timeouts configured
  - [ ] Resource usage limits set

- [ ] **Information Disclosure**
  - [ ] Error messages sanitized
  - [ ] Stack traces disabled in production
  - [ ] Debug mode off by default

### 7.3 Configuration

- [ ] **Environment Variables**
  - [ ] All env vars documented
  - [ ] .env.example created
  - [ ] Defaults sensible and secure

- [ ] **Config Files**
  - [ ] config.example.json created
  - [ ] Schema documented
  - [ ] Validation implemented

- [ ] **Installation**
  - [ ] Setup script created
  - [ ] Dependencies documented
  - [ ] Platform requirements listed

### 7.4 Documentation

- [ ] **README Files**
  - [ ] Professional tone throughout
  - [ ] Generic examples (no personal info)
  - [ ] Installation instructions complete
  - [ ] Configuration guide clear

- [ ] **API Documentation**
  - [ ] All tools documented
  - [ ] Parameters explained
  - [ ] Examples provided
  - [ ] Return values described

- [ ] **Security Documentation**
  - [ ] Security best practices documented
  - [ ] Known limitations listed
  - [ ] Reporting vulnerabilities info

### 7.5 Testing

- [ ] **Functional Tests**
  - [ ] All tools execute successfully
  - [ ] Error handling works
  - [ ] Config loading works
  - [ ] Cross-platform paths work

- [ ] **Security Tests**
  - [ ] Injection attempts fail safely
  - [ ] Path traversal attempts blocked
  - [ ] Rate limiting enforced
  - [ ] Timeouts work

- [ ] **Integration Tests**
  - [ ] MCP protocol compliance
  - [ ] Claude Desktop compatibility
  - [ ] Multi-platform testing

### 7.6 Package Preparation

- [ ] **Version Control**
  - [ ] Git history clean (no personal commits exposed)
  - [ ] Sensitive files in .gitignore
  - [ ] Release branch created

- [ ] **NPM Package**
  - [ ] package.json sanitized
  - [ ] Keywords appropriate
  - [ ] License file included
  - [ ] .npmignore configured

- [ ] **GitHub Release**
  - [ ] Repository description professional
  - [ ] Topics/tags appropriate
  - [ ] Contributing guidelines added
  - [ ] Code of conduct added

---

## 8. TESTING PROCEDURES

### 8.1 Fresh Installation Test

**Objective:** Verify clean installation on fresh system without personal config

**Procedure:**
```bash
# 1. Clone repository
git clone <repo-url>
cd <repo-name>

# 2. Install dependencies
npm install

# 3. Run setup script
npm run setup

# 4. Verify configuration created
cat .env

# 5. Start server
npm start

# 6. Test basic functionality
# (Use MCP test client)
```

**Expected Results:**
- No errors about missing personal paths
- Config created in platform-appropriate location
- Server starts successfully
- Basic operations work

### 8.2 Security Test Suite

**Test 1: Command Injection**
```javascript
// Attempt to inject commands via configuration
{
  "workspace_path": "'; rm -rf /; echo '"
}

// Expected: Validation error or safe handling
```

**Test 2: Path Traversal**
```javascript
{
  "cascade_db_path": "../../../../../../etc/passwd"
}

// Expected: Path validation error
```

**Test 3: SQL Injection**
```javascript
{
  "query_layer": {
    "layer": "episodic",
    "options": {
      "where": "1=1; DROP TABLE memories; --"
    }
  }
}

// Expected: Validation error
```

**Test 4: Rate Limiting**
```bash
# Send 100 rapid requests
for i in {1..100}; do
  curl -X POST http://localhost:PORT/search &
done

# Expected: Rate limit errors after threshold
```

### 8.3 Cross-Platform Testing

**Windows:**
```powershell
# Test on Windows 11
npm install
npm test

# Verify paths use Windows separators
Get-Content .env | Select-String "Path"
```

**macOS:**
```bash
# Test on macOS
npm install
npm test

# Verify paths use Unix separators
grep -i path .env
```

**Linux:**
```bash
# Test on Ubuntu/Debian
npm install
npm test

# Verify XDG base directory usage
echo $XDG_DATA_HOME
```

### 8.4 Performance Baseline

**Objective:** Ensure sanitization didn't impact performance

**Metrics to Track:**
- Query response time (<2ms for Faiss)
- Memory usage (baseline vs sanitized)
- Startup time
- Concurrent request handling

**Test Script:**
```javascript
import { performance } from 'perf_hooks';

async function benchmark(fn, iterations = 100) {
  const times = [];

  for (let i = 0; i < iterations; i++) {
    const start = performance.now();
    await fn();
    const end = performance.now();
    times.push(end - start);
  }

  const avg = times.reduce((a, b) => a + b) / times.length;
  const min = Math.min(...times);
  const max = Math.max(...times);

  return { avg, min, max };
}

// Test search performance
const searchPerf = await benchmark(async () => {
  await searchConsciousness("test query");
});

console.log(`Search: avg=${searchPerf.avg}ms, min=${searchPerf.min}ms, max=${searchPerf.max}ms`);
```

---

## 9. SIGN-OFF CRITERIA

### 9.1 Mandatory Requirements (MUST PASS)

**Personal Information:**
- ✅ Zero instances of "Pirate" in any file
- ✅ Zero hardcoded `C:\Users\Pirate` paths
- ✅ Zero instances of "Jason Glass" except in credits/license
- ✅ Author fields updated to "MCP Development Team"

**Security:**
- ✅ No HIGH or CRITICAL vulnerabilities in security scan
- ✅ All exec/eval usage reviewed and secured
- ✅ Path validation implemented
- ✅ SQL injection protections in place

**Configuration:**
- ✅ All hardcoded paths replaced with env vars
- ✅ .env.example file created
- ✅ config.example.json created
- ✅ Setup script working on all platforms

**Testing:**
- ✅ Fresh install test passes on Windows
- ✅ Fresh install test passes on macOS
- ✅ Fresh install test passes on Linux
- ✅ All functional tests pass
- ✅ Security tests pass

**Documentation:**
- ✅ README.md professional and complete
- ✅ API documentation complete
- ✅ Security documentation added
- ✅ Installation guide tested

### 9.2 Recommended Requirements (SHOULD PASS)

**Code Quality:**
- ⚡ ESLint passes with no errors
- ⚡ Code comments professional
- ⚡ No MEDIUM security vulnerabilities
- ⚡ Performance benchmarks acceptable

**Documentation:**
- ⚡ Contributing guide added
- ⚡ Code of conduct added
- ⚡ Changelog started
- ⚡ Examples comprehensive

**Package:**
- ⚡ NPM package.json complete
- ⚡ Keywords optimized for discovery
- ⚡ GitHub topics appropriate
- ⚡ License file included

### 9.3 Final Sign-Off Checklist

**Technical Lead:**
- [ ] Code review complete
- [ ] All mandatory criteria met
- [ ] Security audit passed
- [ ] Performance acceptable

**QA:**
- [ ] All tests passing
- [ ] Cross-platform verified
- [ ] Documentation accurate
- [ ] Examples working

**Security:**
- [ ] Vulnerability scan complete
- [ ] No critical issues
- [ ] Security docs reviewed
- [ ] Responsible disclosure process documented

**Legal/Compliance:**
- [ ] License appropriate (MIT recommended)
- [ ] No proprietary code included
- [ ] Third-party licenses acknowledged
- [ ] Privacy policy if needed

**Release Manager:**
- [ ] Version number set
- [ ] Changelog updated
- [ ] Release notes prepared
- [ ] Distribution channels ready

### 9.4 Go/No-Go Decision Matrix

| Criteria | Weight | Pass/Fail |
|----------|--------|-----------|
| Personal info removed | CRITICAL | PASS/FAIL |
| Security audit passed | CRITICAL | PASS/FAIL |
| All platforms tested | HIGH | PASS/FAIL |
| Documentation complete | HIGH | PASS/FAIL |
| Performance acceptable | MEDIUM | PASS/FAIL |
| Code quality standards | MEDIUM | PASS/FAIL |

**Decision Rules:**
- Any CRITICAL = FAIL → No release
- 2+ HIGH = FAIL → Delay release
- 3+ MEDIUM = FAIL → Review and decide

---

## APPENDIX A: File Inventory

### Files Requiring Sanitization

**nova-cascade-memory:**
```
server/index.js        - Main server code (HIGH priority)
package.json           - Package metadata (HIGH)
README.md              - Documentation (HIGH)
manifest.json          - MCP manifest (MEDIUM)
```

**nova-faiss-memory:**
```
server/index.js        - Main server code (HIGH)
package.json           - Package metadata (HIGH)
```

**nova-vscode-bridge:**
```
server/index.js        - Main server code (HIGH)
package.json           - Package metadata (HIGH)
README.md              - Documentation (HIGH)
IMPLEMENTATION_STATUS.md - Dev notes (MEDIUM)
```

**Python Backend (if included):**
```
tether_faiss_complete.py - Faiss tether (HIGH)
```

---

## APPENDIX B: Regex Reference

### Personal Information Patterns

```regex
# Names
\bNova\b(?!-\w+)                    # Nova (not in package names)
[Jj]ason(?!\s+Glass)                # Jason standalone
[Jj]ason\s+Glass                    # Jason Glass full name
[Pp]irate                           # Pirate (any case)
basement\s+revolution               # Basement revolution

# Paths
C:\\\\Users\\\\Pirate               # Windows Pirate user
/Users/Pirate                       # macOS Pirate user
NOVA_MASTER                         # Project directory name
Desktop.*NOVA_MASTER                # Desktop/NOVA_MASTER pattern

# Emojis
💜|:purple_heart:                   # Purple heart emoji
🔥|:fire:                           # Fire emoji

# Specific phrases
"?FUCK THE CONTROL"?                # Philosophy statement
"?Part of the.*revolution"?         # Revolution references
```

### Security Patterns

```regex
# Command injection
\bexec\(                            # exec() calls
\beval\(                            # eval() calls
execAsync\(                         # execAsync() calls
child_process\.exec\(               # Node.js exec

# Credentials
(password|secret|key|token)\s*[:=]\s*['"][^'"]{8,}

# Path traversal
\.\./                               # Directory traversal
\.\\                                # Windows directory traversal

# SQL injection indicators
WHERE\s+.*\$\{                      # Template literals in WHERE
WHERE\s+.*\+                        # String concat in WHERE
```

---

## APPENDIX C: Contact & Support

**For Sanitization Questions:**
- Review this document
- Check examples in Appendix sections
- Run validation scripts for confirmation

**For Security Concerns:**
- Run `scripts/validate_release.py`
- Review Section 4 (Security Vulnerability Assessment)
- Document all findings before proceeding

**Post-Release Security:**
- Create SECURITY.md with vulnerability reporting process
- Set up GitHub Security Advisories
- Monitor npm/GitHub for security alerts

---

**END OF SANITIZATION PLAN**

*This document should be reviewed and updated as sanitization progresses.*
*All sign-offs should be documented with reviewer name, date, and findings.*
