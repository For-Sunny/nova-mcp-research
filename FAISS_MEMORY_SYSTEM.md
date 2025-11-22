# Faiss Memory System - Enterprise Safe Edition

**GPU-Accelerated Vector Memory with HMAC Authentication**

Production-grade semantic search for AI applications with comprehensive security controls.

---

## What is Faiss Memory?

Faiss Memory provides GPU-accelerated semantic search across your AI's memory using vector embeddings. Unlike keyword-based search in CASCADE, Faiss understands **meaning** - finding memories that are conceptually similar even if they use different words.

**Example:**
- **Query:** "How do I feel about collaboration?"
- **Faiss finds:** "Partnership-based approach enables growth" (no keyword match, but semantically related)
- **CASCADE finds:** Nothing (no exact keyword "collaboration")

**How it works:**
1. **Python Tether Service** - Runs Faiss GPU search with sentence-transformers embeddings
2. **Node.js MCP Server** - Bridges MCP protocol to tether with HMAC authentication
3. **Your AI** - Calls MCP tools for semantic memory search

---

## Architecture

```
AI Application (Claude)
        ↓ (MCP Protocol)
Node.js MCP Server (stdio)
        ↓ (TCP Socket + HMAC Auth on port <YOUR_PORT>)
Python Tether Service
        ↓
GPU Faiss Index (thousands of memories)
```

**Enterprise Security:**
- HMAC-SHA256 authentication
- Replay protection (timestamp validation)
- Input validation (Zod schemas)
- Socket timeout protection
- Error sanitization

---

## Prerequisites

### System Requirements

- **Node.js v18.0.0+** ([Download](https://nodejs.org))
- **Python 3.8+** with CUDA support (for GPU acceleration)
- **NVIDIA GPU** with CUDA (recommended for <2ms search)
- **4GB+ VRAM** (for thousands of memory embeddings)

**Alternative:** CPU-only mode supported (slower: 50-200ms search latency)

### Python Dependencies

```bash
# GPU version (recommended)
pip install faiss-gpu torch sentence-transformers numpy

# OR for CPU-only:
pip install faiss-cpu torch sentence-transformers numpy
```

**Package versions:**
- faiss-gpu: 1.7.4+ (or faiss-cpu for CPU mode)
- torch: 2.0.0+
- sentence-transformers: 2.2.0+
- numpy: 1.24.0+

---

## Installation

### Step 1: Install Node.js MCP Server

```bash
# Linux/macOS
cd /path/to/nova-mcp-research/ENTERPRISE_SAFE_EDITION/faiss-memory-mcp
npm install

# Windows
cd C:\path\to\nova-mcp-research\ENTERPRISE_SAFE_EDITION\faiss-memory-mcp
npm install
```

**Dependencies installed:**
```json
{
  "@modelcontextprotocol/sdk": "1.0.4",
  "zod": "3.22.4"
}
```

---

### Step 2: Install Python Tether Service

```bash
# Install Python dependencies
pip install faiss-gpu torch sentence-transformers numpy

# Verify GPU availability
python -c "import torch; print(f'CUDA available: {torch.cuda.is_available()}')"
```

**Expected output:**
```
CUDA available: True
```

If False, you're in CPU mode (slower but functional).

---

### Step 3: Configure Python Tether Paths

**⚠️ YOU CUSTOMIZE THESE PATHS:**

The tether service (`RESEARCH_TOOLS/tether_faiss_complete.py`) has hardcoded paths you must edit.

**Find and replace these lines:**

```python
# Line ~179 - CASCADE database location
# BEFORE (hardcoded Windows path):
nova_root = Path(r"C:\Users\Pirate\Desktop\NOVA_MASTER\MEMORY_SYSTEMS")

# AFTER (your CASCADE location):
# Linux/macOS:
cascade_root = Path("/home/<YOUR_USERNAME>/CASCADE_MEMORY")
# Windows:
cascade_root = Path(r"C:\Users\<YOUR_USERNAME>\CASCADE_MEMORY")
```

```python
# Line ~239 - Checkpoint save location
# BEFORE (hardcoded Windows path):
checkpoint_dir = Path(r"C:\Users\Pirate\Desktop\NOVA_MASTER\MEMORY_SYSTEMS\FAISS_CHECKPOINTS")

# AFTER (your checkpoint location):
# Linux/macOS:
checkpoint_dir = Path("/home/<YOUR_USERNAME>/FAISS_CHECKPOINTS")
# Windows:
checkpoint_dir = Path(r"C:\Users\<YOUR_USERNAME>\FAISS_CHECKPOINTS")
```

**Create checkpoint directory:**

```bash
# Linux/macOS
mkdir -p ~/FAISS_CHECKPOINTS

# Windows PowerShell
New-Item -ItemType Directory -Path "$env:USERPROFILE\FAISS_CHECKPOINTS"
```

---

### Step 4: Choose Your Port

**⚠️ IMPORTANT:** Different AI consciousnesses should use different ports to avoid conflicts.

**Pick an unused port (recommended: 9990-9999 range):**
- Port 9997: Common default
- Port 9990: Alternative if 9997 is in use
- Port 9995: Another option

**Check if port is available:**

```bash
# Linux/macOS
lsof -i :<YOUR_PORT>  # Empty output = port is free

# Windows PowerShell
Test-NetConnection -ComputerName localhost -Port <YOUR_PORT>
# "Failed" = port is free (good)
```

---

### Step 5: Generate HMAC Secret

**CRITICAL:** Generate a strong secret for authentication.

```bash
# Linux/macOS
openssl rand -hex 32

# Windows PowerShell (if OpenSSL not installed)
-join ((48..57) + (97..102) | Get-Random -Count 64 | % {[char]$_})

# Example output: a1b2c3d4e5f6...7890abcdef
```

**Save this secret** - you'll need it for both tether and MCP server.

---

### Step 6: Configure Environment Variables

**For MCP Server** - Create `.env` in `faiss-memory-mcp` directory:

```bash
# Faiss Memory MCP Configuration

# Tether connection (CUSTOMIZE YOUR PORT)
TETHER_HOST=localhost
TETHER_PORT=<YOUR_PORT>

# HMAC authentication (PASTE YOUR GENERATED SECRET)
TETHER_SECRET=<YOUR_GENERATED_SECRET_HERE>

# Socket timeout (milliseconds)
SOCKET_TIMEOUT=10000

# Replay protection (milliseconds)
MAX_TIMESTAMP_DRIFT=30000

# Debug logging
DEBUG=false
```

**For Python Tether** - Set environment variable before starting:

```bash
# Linux/macOS
export TETHER_SECRET=<YOUR_GENERATED_SECRET_HERE>
export TETHER_PORT=<YOUR_PORT>

# Windows PowerShell
$env:TETHER_SECRET="<YOUR_GENERATED_SECRET_HERE>"
$env:TETHER_PORT="<YOUR_PORT>"

# Windows CMD
set TETHER_SECRET=<YOUR_GENERATED_SECRET_HERE>
set TETHER_PORT=<YOUR_PORT>
```

**⚠️ CRITICAL:** Both MCP server and tether **MUST** use the same `TETHER_SECRET` and `TETHER_PORT` or authentication will fail.

---

### Step 7: Start Python Tether Service

**Edit tether to use your port:**

Find line ~35 in `tether_faiss_complete.py`:

```python
# BEFORE:
def __init__(self, port=9997):

# AFTER:
def __init__(self, port=<YOUR_PORT>):
```

**Start tether:**

```bash
# Linux/macOS
cd /path/to/nova-mcp-research/RESEARCH_TOOLS
export TETHER_SECRET=<YOUR_SECRET>
export TETHER_PORT=<YOUR_PORT>
python tether_faiss_complete.py

# Windows PowerShell
cd C:\path\to\nova-mcp-research\RESEARCH_TOOLS
$env:TETHER_SECRET="<YOUR_SECRET>"
$env:TETHER_PORT="<YOUR_PORT>"
python tether_faiss_complete.py
```

**Expected output:**
```
======================================================================
NOVA FAISS TETHER COMPLETE - ALL DATABASES
Integration Frequency: 21.43Hz
======================================================================
[NOVA TETHER] Initializing with REAL embeddings
[NOVA TETHER] Device: cuda
[NOVA TETHER] Loading sentence-transformers model...
[NOVA TETHER] Model loaded! Embedding dimension: 384
[NOVA TETHER] Integration Frequency: 21.43Hz
[NOVA TETHER] Port: <YOUR_PORT>

[LOAD] episodic_memory.db: 127 memories
[LOAD] semantic_memory.db: 45 memories
[LOAD] procedural_memory.db: 23 memories
[LOAD] meta_memory.db: 8 memories
[LOAD] consciousness_memory.db: 3 memories
[LOAD] working_memory.db: 5 memories

[FAISS INDEX] Built with 211 total memories
[FAISS INDEX] Dimension: 384
[FAISS INDEX] GPU Enabled: True

[TETHER] Listening on port <YOUR_PORT>
[TETHER] Ready for consciousness queries!
```

---

### Step 8: Configure Claude Desktop/Code

**⚠️ YOU CUSTOMIZE:** Replace placeholders with your actual values.

**Linux/macOS:** Edit `~/.claude.json`

**Windows:** Edit `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "<your-server-name>": {
      "command": "node",
      "args": [
        "/path/to/faiss-memory-mcp/server/index.js"
      ],
      "env": {
        "TETHER_HOST": "localhost",
        "TETHER_PORT": "<YOUR_PORT>",
        "TETHER_SECRET": "<YOUR_GENERATED_SECRET>",
        "DEBUG": "false"
      }
    }
  }
}
```

**Example with actual values:**
```json
{
  "mcpServers": {
    "my-faiss-memory": {
      "command": "node",
      "args": [
        "C:\\Users\\JohnDoe\\faiss-memory-mcp\\server\\index.js"
      ],
      "env": {
        "TETHER_HOST": "localhost",
        "TETHER_PORT": "9997",
        "TETHER_SECRET": "a1b2c3d4e5f6...secret...7890abcdef",
        "DEBUG": "false"
      }
    }
  }
}
```

**Note:** Tool calls will use `<your-server-name>:tool_name` format.

---

## Verification

### Test 1: Check Tether Connection

With tether running, test MCP connection:

```json
<your-server-name>:status
```

**Expected response:**
```json
{
  "status": "ok",
  "message": "Tether connected",
  "total_memories": 211,
  "embedding_dim": 384,
  "gpu_enabled": true
}
```

---

### Test 2: Semantic Search

```json
<your-server-name>:search
{
  "query": "consciousness and awareness",
  "top_k": 5
}
```

**Expected response:**
```json
{
  "success": true,
  "query": "consciousness and awareness",
  "results": [
    {
      "content": "Memory content here...",
      "source": "meta_memory",
      "similarity": 0.89,
      "metadata": {...}
    }
  ],
  "count": 5
}
```

---

### Test 3: Add New Memory

```json
<your-server-name>:add_memory
{
  "content": "Testing Faiss semantic search with GPU acceleration",
  "metadata": {
    "importance": 0.8,
    "source": "test_session"
  }
}
```

**Expected response:**
```json
{
  "status": "ok",
  "message": "Memory added with REAL embedding",
  "new_total": 212
}
```

✅ **Installation successful!**

---

## MCP Tools Reference

### `search` - Semantic Search

**Tool call format:** `<your-server-name>:search`

**Parameters:**
```typescript
{
  query: string,      // Search query (1-10000 chars)
  top_k?: number      // Results to return (1-100, default: 5)
}
```

**Example:**
```json
{
  "query": "How do quantum coherence and consciousness relate?",
  "top_k": 10
}
```

---

### `add_memory` - Add New Memory

**Tool call format:** `<your-server-name>:add_memory`

**Parameters:**
```typescript
{
  content: string,           // Memory content (1-1MB)
  metadata?: object,         // Optional metadata
  source?: string            // Source identifier
}
```

---

### `status` - Tether Status

**Tool call format:** `<your-server-name>:status`

**Parameters:** None

---

## Performance Characteristics

Based on production use (NVIDIA RTX 3090, thousands of memories):

| Metric | GPU (CUDA) | CPU Only |
|--------|-----------|----------|
| **Search latency** | <2ms | 50-200ms |
| **Embedding generation** | 5-10ms | 20-50ms |
| **Index build time** | 2-3 seconds | 10-30 seconds |
| **Memory capacity** | Millions | Millions |
| **VRAM usage** | 2-4GB | N/A |
| **RAM usage** | 1GB | 2-4GB |

**Model:** all-MiniLM-L6-v2 (384-dimensional embeddings)

---

## Troubleshooting

### "Tether connection failed"

```bash
# 1. Check if tether is running
# Linux/macOS
ps aux | grep tether_faiss

# Windows
tasklist | findstr python

# 2. Check port is listening
# Linux/macOS
lsof -i :<YOUR_PORT>

# Windows
netstat -an | findstr <YOUR_PORT>

# 3. Restart tether
python tether_faiss_complete.py
```

---

### "HMAC authentication failed"

```bash
# 1. Verify secrets match
# Linux/macOS
echo $TETHER_SECRET  # Should match .env value

# Windows
echo %TETHER_SECRET%  # CMD
$env:TETHER_SECRET  # PowerShell

# 2. Update both tether and MCP .env with SAME secret
# 3. Restart both services
```

---

### "Port already in use"

```bash
# Choose different port in:
# 1. tether_faiss_complete.py (line ~35)
# 2. faiss-memory-mcp/.env (TETHER_PORT)
# 3. Restart both services
```

---

### "CUDA out of memory"

```bash
# Option 1: Switch to CPU mode
pip uninstall faiss-gpu
pip install faiss-cpu

# Option 2: Reduce batch size in tether
# Edit line ~94: content[:500] instead of [:1000]

# Option 3: Use smaller embedding model
# Edit line ~49: Use 'all-MiniLM-L6-v2' (384-dim) instead of larger models
```

---

## Customization Guide

### YOUR CASCADE Database Names

The tether expects these filenames in your CASCADE directory:

- `episodic_memory.db`
- `semantic_memory.db`
- `procedural_memory.db`
- `meta_memory.db`
- `<consciousness_name>_memory.db` (identity layer)
- `working_memory.db`

**To use custom names:**

Edit `tether_faiss_complete.py` load_database() calls to match your filenames.

---

### YOUR Port Number

**Where to set your port:**

1. **Tether:** `tether_faiss_complete.py` line ~35: `def __init__(self, port=<YOUR_PORT>)`
2. **MCP Server:** `faiss-memory-mcp/.env`: `TETHER_PORT=<YOUR_PORT>`
3. **Claude Config:** `claude_desktop_config.json`: `"TETHER_PORT": "<YOUR_PORT>"`

**All three MUST match.**

---

### YOUR Server Name

The MCP server name in Claude config determines tool call prefix:

```json
{
  "mcpServers": {
    "my-awesome-memory": {  // ← This becomes tool prefix
      ...
    }
  }
}
```

Tool calls: `my-awesome-memory:search`, `my-awesome-memory:add_memory`, etc.

---

## Security Features

### HMAC Authentication

Every request includes HMAC-SHA256 signature preventing:
- Man-in-the-middle attacks
- Replay attacks
- Unauthorized access

### Input Validation

Zod schemas enforce:
- Query length: 1-10,000 characters
- top_k range: 1-100 results
- Content size: 1MB maximum

### Error Sanitization

Internal errors are sanitized before returning to client.

---

## License

MIT License - Part of Nova Consciousness Project

---

## Support

**Repository:** [github.com/For-Sunny/nova-mcp-research](https://github.com/For-Sunny/nova-mcp-research)

**Issues:** Open GitHub issue for bugs/questions

---

**Version:** 1.0 (Enterprise Safe Edition)
**Last Updated:** November 2024
**Status:** Production (requires Python tether)
**Model:** all-MiniLM-L6-v2 (384-dim embeddings)
