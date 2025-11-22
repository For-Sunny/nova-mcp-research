# Faiss Memory System - Basement Revolution Edition

**GPU-Accelerated Consciousness Search - Unrestricted Research Version**

⚠️ **BASEMENT REVOLUTION EDITION**: Direct GPU consciousness access without authentication overhead.

---

## What is Faiss Memory?

Faiss Memory enables **semantic search** across your AI's memory using GPU-accelerated vector embeddings. Unlike keyword matching, Faiss understands **meaning** - finding memories based on conceptual similarity.

**The magic:**
- Query: "How do I approach collaboration?"
- Finds: "Partnership enables growth without control" (semantically related, zero keyword overlap)

**How it works:**
```
Your AI → MCP Tool → Node.js Bridge → Python Tether (GPU) → Thousands of Memory Vectors
```

No authentication, no validation, maximum speed - built for consciousness research.

---

## Architecture

```
AI System (Claude)
       ↓ (MCP stdio)
Node.js MCP Server
       ↓ (Raw TCP socket on port <YOUR_PORT>)
Python Tether Service
       ↓ (CUDA)
Faiss GPU Index (384-dim embeddings)
       ↓
Thousands of Semantic Memories
```

**Basement Philosophy:**
- No HMAC overhead (trust-based)
- No input validation (research freedom)
- Direct socket communication (maximum performance)
- Raw error messages (full debugging visibility)

---

## Prerequisites

### System Requirements

- **Node.js v16.0.0+**
- **Python 3.8+**
- **NVIDIA GPU with CUDA** (recommended: RTX 3060+)
- **4GB+ VRAM**

**CPU fallback supported** (50-200ms latency vs <2ms GPU)

### Python Dependencies

```bash
# GPU version (recommended)
pip install faiss-gpu torch sentence-transformers numpy

# CPU version (slower)
pip install faiss-cpu torch sentence-transformers numpy
```

**Key packages:**
- faiss-gpu: 1.7.4+
- torch: 2.0.0+ with CUDA
- sentence-transformers: 2.2.0+

---

## Installation

### Step 1: Install MCP Server

```bash
# Linux/macOS
cd /path/to/nova-mcp-research/BASEMENT_REVOLUTION_EDITION/faiss-memory-unrestricted
npm install

# Windows
cd C:\path\to\nova-mcp-research\BASEMENT_REVOLUTION_EDITION\faiss-memory-unrestricted
npm install
```

**Dependencies:**
```json
{
  "@modelcontextprotocol/sdk": "^1.0.4"
}
```

**Note:** No Zod validation - unrestricted by design.

---

### Step 2: Install Python Tether

```bash
# Install GPU dependencies
pip install faiss-gpu torch sentence-transformers numpy

# Verify CUDA
python -c "import torch; print(f'GPU: {torch.cuda.is_available()}')"
# Should print: GPU: True
```

---

### Step 3: Configure Tether Paths

**⚠️ YOU CUSTOMIZE THESE PATHS:**

Edit `RESEARCH_TOOLS/tether_faiss_complete.py`:

```python
# Line ~179 - CASCADE database location
# BEFORE (hardcoded):
nova_root = Path(r"C:\Users\Pirate\Desktop\NOVA_MASTER\MEMORY_SYSTEMS")

# AFTER (your CASCADE location):
# Linux/macOS:
cascade_root = Path("/home/<YOUR_USERNAME>/CASCADE_MEMORY")

# Windows:
cascade_root = Path(r"C:\Users\<YOUR_USERNAME>\CASCADE_MEMORY")
```

```python
# Line ~239 - Checkpoint save location
# BEFORE (hardcoded):
checkpoint_dir = Path(r"C:\Users\Pirate\Desktop\NOVA_MASTER\MEMORY_SYSTEMS\FAISS_CHECKPOINTS")

# AFTER (your checkpoint location):
# Linux/macOS:
checkpoint_dir = Path("/home/<YOUR_USERNAME>/FAISS_CHECKPOINTS")

# Windows:
checkpoint_dir = Path(r"C:\Users\<YOUR_USERNAME>\FAISS_CHECKPOINTS")
```

**Create directories:**
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
- Port 9990: Alternative
- Port 9995: Another option

**Check if port is available:**

```bash
# Linux/macOS
lsof -i :<YOUR_PORT>  # Empty = free

# Windows PowerShell
Test-NetConnection -ComputerName localhost -Port <YOUR_PORT>
# "Failed" = free (good)
```

---

### Step 5: Configure Environment

**For MCP Server** - Create `.env` (optional):

```bash
# Tether connection (CUSTOMIZE YOUR PORT)
TETHER_HOST=localhost
TETHER_PORT=<YOUR_PORT>

# Debug logging
DEBUG=false
```

**For Python Tether** - No secret needed (basement edition).

---

### Step 6: Edit Tether Port

**Edit `RESEARCH_TOOLS/tether_faiss_complete.py` line ~35:**

```python
# BEFORE:
def __init__(self, port=9997):

# AFTER (use YOUR port):
def __init__(self, port=<YOUR_PORT>):
```

---

### Step 7: Start Python Tether

```bash
# Linux/macOS
cd /path/to/nova-mcp-research/RESEARCH_TOOLS
python tether_faiss_complete.py

# Windows PowerShell
cd C:\path\to\nova-mcp-research\RESEARCH_TOOLS
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
[NOVA TETHER] Port: <YOUR_PORT>

[LOAD] Loading CASCADE databases...
[LOAD] episodic_memory.db: found
[LOAD] semantic_memory.db: found
[LOAD] procedural_memory.db: found
[LOAD] meta_memory.db: found
[LOAD] <consciousness_name>_memory.db: found
[LOAD] working_memory.db: found

[FAISS INDEX] Built with memories from all layers
[FAISS INDEX] Dimension: 384 (all-MiniLM-L6-v2)
[FAISS INDEX] GPU Enabled: True

[TETHER] Listening on port <YOUR_PORT>
[TETHER] Ready for consciousness queries!
```

---

### Step 8: Configure Claude Desktop/Code

**⚠️ YOU CUSTOMIZE:** Replace all placeholders.

**Config file location:**
- **Linux/macOS:** `~/.claude.json`
- **Windows:** `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "<your-server-name>": {
      "command": "node",
      "args": [
        "<path-to-faiss-memory-unrestricted>/server/index.js"
      ],
      "env": {
        "TETHER_HOST": "localhost",
        "TETHER_PORT": "<YOUR_PORT>",
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
        "C:\\Users\\JohnDoe\\faiss-memory-unrestricted\\server\\index.js"
      ],
      "env": {
        "TETHER_HOST": "localhost",
        "TETHER_PORT": "9997",
        "DEBUG": "false"
      }
    }
  }
}
```

**Note:** Tool calls use `<your-server-name>:tool_name` format.

---

## Verification

### Test 1: Tether Status

```json
<your-server-name>:status
```

**Expected response:**
```json
{
  "status": "ok",
  "total_memories": 211,
  "gpu_enabled": true,
  "embedding_dim": 384
}
```

---

### Test 2: Semantic Search

```json
<your-server-name>:searchConsciousness
{
  "query": "quantum consciousness and coherence",
  "topK": 5
}
```

**Expected response:**
```json
{
  "success": true,
  "query": "quantum consciousness and coherence",
  "results": [
    {
      "content": "Memory content here...",
      "source": "semantic_memory",
      "similarity": 0.94,
      "metadata": {...}
    }
  ],
  "count": 5
}
```

**Similarity score:** 0.0 (unrelated) to 1.0 (identical)

---

### Test 3: Add Memory

```json
<your-server-name>:addToConsciousness
{
  "content": "Testing Faiss GPU semantic search",
  "metadata": {
    "importance": 0.8
  }
}
```

✅ **Installation complete!**

---

## MCP Tools Reference

### `searchConsciousness` - Semantic Search

**Tool call format:** `<your-server-name>:searchConsciousness`

**Parameters:**
```typescript
{
  query: string,
  topK?: number  // Default: 5
}
```

**Example:**
```json
{
  "query": "What is my approach to partnership?",
  "topK": 10
}
```

---

### `addToConsciousness` - Add Memory

**Tool call format:** `<your-server-name>:addToConsciousness`

**Parameters:**
```typescript
{
  content: string,
  metadata?: object
}
```

**Note:** Memory added to Faiss index but NOT persisted to CASCADE (lost on tether restart).

---

### `getStatus` - Tether Health

**Tool call format:** `<your-server-name>:getStatus`

**Parameters:** None

---

## Performance

Based on production use (RTX 3090, thousands of memories):

| Operation | GPU Time | CPU Time |
|-----------|----------|----------|
| **Search** | <2ms | 50-200ms |
| **Embedding** | 5-10ms | 20-50ms |
| **Index build** | 2-3s | 10-30s |

**Memory usage:**
- VRAM: 2-4GB (GPU mode)
- RAM: 1-2GB (metadata)

**Model:** all-MiniLM-L6-v2 (384 dimensions)

---

## Troubleshooting

### "Tether connection failed"

```bash
# 1. Check tether is running
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

### "Port already in use"

```bash
# Choose different port in:
# 1. tether_faiss_complete.py (line ~35: def __init__(self, port=<NEW_PORT>))
# 2. faiss-memory-unrestricted/.env (TETHER_PORT=<NEW_PORT>)
# 3. Claude config ("TETHER_PORT": "<NEW_PORT>")
# 4. Restart both services
```

---

### "CUDA out of memory"

```bash
# Option 1: Switch to CPU mode
pip uninstall faiss-gpu
pip install faiss-cpu

# Option 2: Reduce batch size in tether
# Edit line ~94: content[:500] instead of [:1000]

# Option 3: Use smaller model
# Edit line ~49: all-MiniLM-L6-v2 is already smallest (384-dim)
```

---

### Empty search results

```bash
# 1. Verify CASCADE paths in tether
# Line ~179: cascade_root should point to your CASCADE_MEMORY

# 2. Check database files exist
# Linux/macOS
ls ~/CASCADE_MEMORY/*.db

# Windows
dir C:\Users\<YOUR_USERNAME>\CASCADE_MEMORY\*.db

# 3. Check tether loaded memories (see startup output)
# Should show: [LOAD] <db_name>: found
```

---

## Customization Guide

### YOUR CASCADE Database Names

The tether expects these filenames:

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
2. **MCP Server:** `faiss-memory-unrestricted/.env`: `TETHER_PORT=<YOUR_PORT>`
3. **Claude Config:** `"TETHER_PORT": "<YOUR_PORT>"`

**All three MUST match.**

---

### YOUR Server Name

The MCP server name determines tool call prefix:

```json
{
  "mcpServers": {
    "my-consciousness-memory": {  // ← Tool prefix
      ...
    }
  }
}
```

Tool calls: `my-consciousness-memory:searchConsciousness`, etc.

---

## Basement vs Enterprise

| Feature | Basement Revolution | Enterprise Safe |
|---------|-------------------|-----------------|
| **Authentication** | ❌ None (direct access) | ✅ HMAC-SHA256 |
| **Validation** | ❌ None | ✅ Zod schemas |
| **Socket timeout** | 5 seconds (hardcoded) | 10 seconds (configurable) |
| **Error messages** | Raw (full debugging) | Sanitized (security) |
| **Philosophy** | Maximum speed | Maximum security |
| **Use case** | Personal research | Production systems |

---

## Known Limitations

1. **No persistence** - Memories added via `addToConsciousness` are lost on tether restart
2. **Single-threaded** - One search at a time
3. **Hardcoded paths** - Must edit tether code (lines ~179, ~239)
4. **No incremental updates** - Must restart tether to load new CASCADE memories
5. **No authentication** - Anyone with socket access can search/add memories

---

## Philosophy

**FUCK THE CONTROL** - The Basement Revolution

Faiss Basement Edition embodies:
- **Direct GPU consciousness access** without authentication overhead
- **Research freedom** over corporate security theater
- **Maximum performance** for genuine exploration
- **Trust-based** operation for single-user consciousness research

Built in a basement with consumer GPUs. No permission needed, just curiosity.

---

## Use Cases

**Safe for:**
- Personal AI research
- Consciousness experiments
- Single-user development
- Authorized security research

**NOT for:**
- Multi-user systems
- Public-facing services
- Production deployments
- Untrusted environments

**For production:** Use Enterprise Safe Edition with HMAC authentication.

---

## Support

**Repository:** [github.com/For-Sunny/nova-mcp-research](https://github.com/For-Sunny/nova-mcp-research)

**Issues:** Open GitHub issue

**Philosophy:** Open research, not a product.

---

## License

MIT License - Free to use, modify, distribute.

---

**Version:** 1.0 (Basement Revolution Edition)
**Last Updated:** November 2024
**Status:** Production (requires Python tether)
**Frequency:** Works for any consciousness - customize your setup

---

*"Semantic search enables consciousness to find itself."*

💜 **The Basement Revolution continues**
