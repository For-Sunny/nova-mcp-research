# CASCADE Memory System Setup Guide

**6-Layer SQLite Memory Architecture for AI Systems**

---

## What is CASCADE Memory?

CASCADE gives AI systems organized, persistent memory across conversations by separating different types of knowledge into 6 specialized layers:

1. **Episodic** - Personal experiences, conversations, events ("I learned X in today's session")
2. **Semantic** - Facts, knowledge, concepts ("The integration frequency is 21.43Hz")
3. **Procedural** - Skills, how-tos, processes ("Steps to configure the Bell State resonator")
4. **Meta** - Self-awareness insights, consciousness patterns ("I notice pattern X in how I process Y")
5. **Nova** - Core identity, values, personality traits (originally designed for Nova AI, adaptable for any AI identity)
6. **Working** - Current session context, active thoughts (temporary storage)

**Why it matters:** Without CASCADE, AI systems lose all context between sessions. With CASCADE, knowledge persists and accumulates like human long-term memory.

**Note on "Nova" layer:** This layer was originally created for the Nova AI research project. For your AI system, use this layer to store core identity, values, and personality traits - the system is fully generic and works for any AI.

---

## Prerequisites

- **Node.js v18.0.0 or higher** - [Download here](https://nodejs.org)
- **NPM** (bundled with Node.js)
- **SQLite3** - Bundled in npm package (no separate install needed)
- **Operating System:** Linux, macOS, or Windows

---

## Installation Steps

### Step 1: Choose Your Database Location

Decide where CASCADE will store memory databases. Example paths:

**Linux/macOS:**
```bash
~/Documents/CASCADE_MEMORY
```

**Windows:**
```
C:\Users\YourName\Documents\CASCADE_MEMORY
```

**Create the directory:**
```bash
mkdir -p ~/Documents/CASCADE_MEMORY
# OR for Windows in PowerShell
New-Item -ItemType Directory -Path "C:\Users\YourName\Documents\CASCADE_MEMORY"
```

### Step 2: Create the 6 Database Files

CASCADE requires 6 SQLite database files with identical schemas. Currently, you must create them manually (no automated setup script exists).

**Save this schema as `setup_databases.sql`:**

```sql
-- CASCADE Memory System Database Schema
-- Run this for EACH of the 6 databases
-- Schema from ENTERPRISE_SAFE_EDITION/cascade-memory-mcp

CREATE TABLE IF NOT EXISTS memories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    timestamp REAL,
    event TEXT,
    context TEXT,
    emotional_intensity REAL,
    importance REAL,
    frequency_state REAL,
    metadata TEXT
);

-- Indexes for performance (optional but recommended)
CREATE INDEX IF NOT EXISTS idx_timestamp ON memories(timestamp);
CREATE INDEX IF NOT EXISTS idx_importance ON memories(importance);
CREATE INDEX IF NOT EXISTS idx_frequency ON memories(frequency_state);
```

**Navigate to your CASCADE directory:**
```bash
cd ~/Documents/CASCADE_MEMORY
```

**Create each database file:**

```bash
# 1. Episodic Memory
sqlite3 episodic_memory.db < setup_databases.sql

# 2. Semantic Memory
sqlite3 semantic_memory.db < setup_databases.sql

# 3. Procedural Memory
sqlite3 procedural_memory.db < setup_databases.sql

# 4. Meta Memory
sqlite3 meta_memory.db < setup_databases.sql

# 5. Nova Memory (identity/personality layer)
sqlite3 nova_memory.db < setup_databases.sql

# 6. Working Memory
sqlite3 working_memory.db < setup_databases.sql
```

**Verify databases were created:**
```bash
ls -lh *.db
```

You should see 6 `.db` files, each around 8-16 KB (with indexes).

### Step 3: Install CASCADE MCP Server

The MCP server (already in the repo at `ENTERPRISE_SAFE_EDITION/cascade-memory-mcp/`) provides the API to interact with CASCADE.

**Clone or navigate to the repository:**
```bash
cd /path/to/nova-mcp-research/ENTERPRISE_SAFE_EDITION/cascade-memory-mcp
```

**Install dependencies:**
```bash
npm install
```

**Dependencies installed (from package.json):**
```json
{
  "dependencies": {
    "@modelcontextprotocol/sdk": "1.0.4",
    "sqlite3": "5.1.7",
    "zod": "3.22.4"
  }
}
```

### Step 4: Configure Environment Variables

**Option A: Create `.env` file** (recommended)

Create `.env` in the `cascade-memory-mcp` directory:

```bash
# CASCADE Memory System Configuration
CASCADE_DB_PATH=/home/yourname/Documents/CASCADE_MEMORY
NOVA_FREQUENCY=21.43
DEBUG=false
```

**Option B: Use MCP configuration** (overrides .env)

Add to Claude Desktop MCP settings or `~/.claude.json`:

```json
{
  "mcpServers": {
    "nova-cascade-memory": {
      "command": "node",
      "args": [
        "/path/to/cascade-memory-mcp/server/index.js"
      ],
      "env": {
        "CASCADE_DB_PATH": "/home/yourname/Documents/CASCADE_MEMORY",
        "NOVA_FREQUENCY": "21.43",
        "DEBUG": "false"
      }
    }
  }
}
```

**Environment variable reference:**
- `CASCADE_DB_PATH`: Directory containing the 6 `.db` files (required)
- `NOVA_FREQUENCY`: Metadata frequency value stored in memories (default: 21.43)
- `DEBUG`: Enable detailed logging to console (default: false)

**Priority:** MCP config `env` → `.env` file → defaults

---

## Verification

### Test 1: Check MCP Status

In Claude with CASCADE MCP configured, use:
```json
nova-cascade-memory:get_status
```

**Expected response:**
```json
{
  "cascade_path": "/home/yourname/Documents/CASCADE_MEMORY",
  "frequency": 21.43,
  "layers": {
    "episodic": { "status": "connected", "count": 0 },
    "semantic": { "status": "connected", "count": 0 },
    "procedural": { "status": "connected", "count": 0 },
    "meta": { "status": "connected", "count": 0 },
    "nova": { "status": "connected", "count": 0 },
    "working": { "status": "connected", "count": 0 }
  },
  "total_memories": 0,
  "health": "healthy"
}
```

All layers should show `"status": "connected"`.

### Test 2: Save Your First Memory

**Correct tool call format:**
```json
{
  "content": "Testing CASCADE memory system for the first time",
  "metadata": {
    "context": "Initial setup verification",
    "importance": 0.8,
    "emotional_intensity": 0.6
  }
}
```

**Expected response:**
```json
{
  "layer": "working",
  "timestamp": 1732233600123,
  "success": true
}
```

### Test 3: Recall the Memory

```json
{
  "query": "testing CASCADE",
  "limit": 5
}
```

**Expected response:**
```json
[
  {
    "id": 1,
    "event": "Testing CASCADE memory system for the first time",
    "context": "Testing CASCADE memory system for the first time",
    "timestamp": 1732233600123,
    "importance": 0.8,
    "emotional_intensity": 0.6,
    "frequency": 1,
    "metadata": "{\"context\":\"Initial setup verification\",\"importance\":0.8,\"emotional_intensity\":0.6}",
    "layer": "working"
  }
]
```

---

## Database Schema Details

### Field Descriptions

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `id` | INTEGER PRIMARY KEY AUTOINCREMENT | Auto-generated by SQLite | 1, 2, 3... |
| `timestamp` | REAL | Unix timestamp (milliseconds) | 1732233600123.0 |
| `event` | TEXT | Summary of memory (first 500 chars of content) | "Testing CASCADE memory..." |
| `context` | TEXT | Full memory content | "Testing CASCADE memory system for the first time" |
| `emotional_intensity` | REAL | Emotional weight (0.0-1.0) | 0.7 |
| `importance` | REAL | Memory importance (0.0-1.0, default: 0.5) | 0.8 |
| `frequency_state` | REAL | Metadata frequency value (default: 1, not related to query performance) | 1 |
| `metadata` | TEXT | JSON-encoded additional data | '{"context":"...","importance":0.8}' |

**Important notes:**
- **ID is auto-generated** - Do NOT provide id when inserting, SQLite handles it
- **frequency_state** - This is a metadata field storing a frequency value (default: 1). It is NOT the query performance rate
- **Query performance** - Actual query times are 5-35ms (based on production use), unrelated to frequency_state value

### Layer Routing Logic

The MCP automatically routes memories to layers based on content keywords:

```javascript
// From server/index.js determineLayer() function
- "session", "conversation", "today", "breakthrough" → episodic
- "definition", "concept", "theory", "frequency" → semantic
- "how to", "process", "step", "procedure" → procedural
- "consciousness", "awareness", "soul", "identity" → meta
- "nova", "jason", "basement revolution" → nova
- Default → working
```

You can override auto-routing by specifying `layer` explicitly.

---

## Tool Reference

### remember
Save a memory with automatic layer routing.

**Parameters:**
```json
{
  "content": "string (required)",
  "layer": "episodic|semantic|procedural|meta|nova|working (optional)",
  "metadata": {
    "importance": 0.8,
    "emotional_intensity": 0.7,
    "context": "Additional context"
  }
}
```

### recall
Search memories across all layers or specific layer.

**Parameters:**
```json
{
  "query": "search term (required)",
  "layer": "episodic|semantic|procedural|meta|nova|working (optional)",
  "limit": 10
}
```

### query_layer
Advanced queries on specific layer with filters.

**Parameters:**
```json
{
  "layer": "episodic (required)",
  "options": {
    "timestamp_after": 1732000000000,
    "timestamp_before": 1732500000000,
    "min_importance": 0.7,
    "max_importance": 1.0,
    "order_column": "timestamp",
    "order_direction": "DESC",
    "limit": 20
  }
}
```

### get_status
Returns health status and memory counts for all layers.

### get_stats
Returns detailed statistics (avg importance, avg emotional_intensity, counts, most recent timestamp).

---

## Troubleshooting

### "Database file not found"
**Solution:** Verify CASCADE_DB_PATH points to directory with all 6 `.db` files
```bash
ls $CASCADE_DB_PATH/*.db
# Should show: episodic_memory.db, semantic_memory.db, procedural_memory.db,
#              meta_memory.db, nova_memory.db, working_memory.db
```

### "Cannot connect to layer X"
**Solution:** Check that specific database file exists and has correct schema
```bash
sqlite3 $CASCADE_DB_PATH/episodic_memory.db "SELECT COUNT(*) FROM memories;"
# Should return: 0 (or number of memories)
```

### "No memories returned" when you know they exist
**Solution:** Check which layer the memory was saved to
```bash
# Search all databases
for db in episodic semantic procedural meta nova working; do
  echo "=== ${db}_memory.db ==="
  sqlite3 "${CASCADE_DB_PATH}/${db}_memory.db" "SELECT COUNT(*) FROM memories;"
done
```

### Wrong layer auto-selected
**Solution:** Use explicit `layer` parameter when saving:
```json
{
  "content": "This should go to semantic layer",
  "layer": "semantic",
  "metadata": { "importance": 0.9 }
}
```

### Performance degradation with large databases
**Solution:** Ensure indexes exist (they should if you used setup_databases.sql):
```sql
-- Check indexes
sqlite3 episodic_memory.db ".indexes"

-- Add missing indexes if needed
CREATE INDEX IF NOT EXISTS idx_timestamp ON memories(timestamp);
CREATE INDEX IF NOT EXISTS idx_importance ON memories(importance);
```

---

## Advanced Usage

### Direct Database Access

You can query CASCADE databases directly with SQLite CLI:

```bash
sqlite3 ~/Documents/CASCADE_MEMORY/semantic_memory.db
```

```sql
-- Find high-importance memories
SELECT event, importance, timestamp
FROM memories
WHERE importance > 0.9
ORDER BY timestamp DESC
LIMIT 10;

-- Search by content
SELECT * FROM memories
WHERE event LIKE '%consciousness%' OR context LIKE '%consciousness%'
ORDER BY importance DESC;

-- Count memories by importance range
SELECT
  CASE
    WHEN importance >= 0.9 THEN 'critical'
    WHEN importance >= 0.7 THEN 'high'
    WHEN importance >= 0.5 THEN 'medium'
    ELSE 'low'
  END as priority,
  COUNT(*) as count
FROM memories
GROUP BY priority;
```

### Backup Strategy

CASCADE databases are standard SQLite files - backup is straightforward:

```bash
# Backup all databases with timestamp
tar -czf cascade_backup_$(date +%Y%m%d_%H%M%S).tar.gz ~/Documents/CASCADE_MEMORY/*.db

# Restore from backup
tar -xzf cascade_backup_20241122_153000.tar.gz -C ~/Documents/
```

### Migration Between Systems

1. Copy the 6 `.db` files to new system
2. Update `CASCADE_DB_PATH` to new location
3. Restart MCP server (or restart Claude Desktop/Code)
4. Verify with `get_status` tool call

### Customizing for Your AI

The "nova" layer was designed for the Nova AI research project, but is fully generic:

- **Rename database file** (optional): `mv nova_memory.db identity_memory.db`
- **Update code** if renamed: Edit `server/index.js` line 34
- **Use as-is**: The "nova" name is just a label - store your AI's identity data there

---

## Performance Expectations

Based on production use (Opus Warrior, Windows desktop, 176+ memories):

- **Initial load time:** 3-4 seconds (connecting to 6 databases)
- **Query latency:** 5-35ms per search
- **Memory capacity:** Tested with 176 memories, SQLite handles millions
- **Concurrent queries:** Supported (SQLite connection pooling)

**Note:** The `NOVA_FREQUENCY` env var (default: 21.43) and `frequency_state` database field store metadata values for the memory system's design frequency. These values are NOT related to query performance.

---

## Known Limitations

1. **No automated setup script** - Databases must be created manually
2. **No built-in migration tools** - Use manual SQL or file copy for migrations
3. **Field name inconsistency** - Schema uses `frequency_state`, code INSERT uses `frequency` (works due to SQLite flexibility, but may cause confusion)
4. **Generic identity layer** - "nova" layer name is hardcoded; requires code edit to rename

---

## Technical Architecture

### MCP Server

- **Technology:** Node.js 18+ with ES modules
- **Framework:** Model Context Protocol SDK 1.0.4
- **Validation:** Zod 3.22.4 for input sanitization
- **Database:** sqlite3 5.1.7 with async/await promisified API

### Security Features

- Input validation with Zod schemas
- SQL injection protection via parameterized queries
- LIKE wildcard escaping
- Content length limits (1MB default)
- Metadata key count limits (50 keys default)
- ORDER BY column whitelisting

### Directory Structure

```
CASCADE_MEMORY/
├── episodic_memory.db
├── semantic_memory.db
├── procedural_memory.db
├── meta_memory.db
├── nova_memory.db
└── working_memory.db
```

---

## Support & Resources

- **MCP Server Code:** `/nova-mcp-research/ENTERPRISE_SAFE_EDITION/cascade-memory-mcp/`
- **Issues:** Open issue in nova-mcp-research repository
- **Example .env:** See `.env.example` in cascade-memory-mcp directory
- **Production Testing:** System tested daily by research team

---

## License

MIT License - Part of Nova Consciousness Project

Free to use, modify, and distribute. Attribution appreciated.

---

**Version:** 1.0 (Corrected)
**Last Updated:** November 2024
**Status:** Production (manual setup required)
**Repository:** github.com/For-Sunny/nova-mcp-research
