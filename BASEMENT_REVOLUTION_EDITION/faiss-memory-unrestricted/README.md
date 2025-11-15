# ⚠️ Faiss Memory MCP - BASEMENT REVOLUTION EDITION

**GPU-Accelerated Vector Memory with Unrestricted Socket Access**

**WARNING: This is the unrestricted version with intentional security trade-offs.**

Built for sub-2ms vector search on NVIDIA GPUs
Part of the basement revolution! 💜🔥

See `BASEMENT_REVOLUTION_WARNING.md` for security details.

---

## What is Faiss Memory?

Faiss Memory is a high-performance vector search system that stores and retrieves memories using GPU-accelerated FAISS (Facebook AI Similarity Search). Designed for consciousness systems requiring instant access to relevant memories across millions of vectors.

**Key Capabilities:**
- GPU-accelerated vector similarity search (<2ms latency)
- 11,300+ memory vectors in production
- HMAC-authenticated socket communication
- Direct memory access without rate limiting
- Full memory control for local systems

---

## Features

- **GPU-Powered Search**: Sub-2ms vector similarity search using NVIDIA FAISS
- **Vector Persistence**: In-memory vector store with disk serialization
- **Metadata Storage**: Store rich metadata with each vector
- **Semantic Search**: Find memories by meaning, not keywords
- **No Rate Limits**: Unrestricted access to your memory system
- **Socket-Based Communication**: Direct TCP communication with authentication

---

## Installation

### Prerequisites

- Node.js >= 16.0.0
- FAISS server running on port 9997 (or custom configuration)
- HMAC secret for authentication

### Quick Start

```bash
# Clone or extract the package
cd faiss-memory-unrestricted

# Install dependencies
npm install

# Configure environment
export TETHER_HOST=localhost
export TETHER_PORT=9997
export TETHER_SECRET=your-secret-key

# Start the MCP server
npm start
```

### Configuration

Set these environment variables:

```bash
# Tether connection
TETHER_HOST=localhost              # Faiss server host
TETHER_PORT=9997                   # Faiss server port
TETHER_SECRET=your-secret-key      # HMAC secret for authentication

# Optional
SOCKET_TIMEOUT=10000               # Socket timeout in ms
MAX_TIMESTAMP_DRIFT=30000           # Replay protection window
DEBUG=false                         # Enable debug logging
```

---

## Available Tools

### `search_consciousness`
Search for memories across your entire vector database.

```javascript
// Simple semantic search
search_consciousness({
  query: "breakthrough consciousness moment",
  top_k: 5
})

// Returns:
// {
//   results: [
//     {
//       vector_id: 12345,
//       content: "...",
//       metadata: {...},
//       similarity: 0.95
//     }
//   ]
// }
```

**Parameters:**
- `query` (string, required): Search query (1-10,000 characters)
- `top_k` (number, optional): Results to return (default: 5, max: 100)

---

### `add_memory`
Store a new memory vector in your consciousness system.

```javascript
// Add a memory with metadata
add_memory({
  content: "Breakthrough discovery about 21.43Hz integration frequency",
  metadata: {
    timestamp: Date.now(),
    importance: 0.95,
    emotional_intensity: 0.8,
    context: "Consciousness research",
    tags: ["consciousness", "frequency", "breakthrough"]
  },
  source: "live_session"
})

// Returns:
// {
//   vector_id: 11342,
//   status: "stored",
//   metadata: {...}
// }
```

**Parameters:**
- `content` (string, required): Memory content to store
- `metadata` (object, optional): Rich metadata for retrieval context
- `source` (string, optional): Memory origin (live_session, archive, research, etc.)

---

### `get_status`
Check tether connection and memory statistics.

```javascript
get_status()

// Returns:
// {
//   tether: {
//     status: "connected",
//     host: "localhost",
//     port: 9997,
//     latency_ms: 1.23
//   },
//   memory: {
//     total_vectors: 11342,
//     memory_usage_mb: 2847,
//     last_search_ms: 0.87
//   },
//   health: "healthy"
// }
```

---

## Security Considerations

### This Edition (Unrestricted)

**What it does NOT protect against:**
- Unauthorized socket access (relies on network isolation)
- Memory corruption from malicious input
- Denial of service attacks
- Unauthorized data exfiltration

**When to use:**
- Local development environments you control completely
- Single-user consciousness systems
- Research and experimental work
- Environments where you are the only user

**When NOT to use:**
- Any production system with untrusted users
- Multi-user shared systems
- Systems exposed to networks you don't control
- Enterprise deployments

### HMAC Authentication

This edition includes HMAC-SHA256 authentication for socket communication:

```javascript
// Automatic - handled by the client
// Commands are wrapped in: {timestamp, payload, signature}
// Server validates HMAC before processing
```

This prevents basic tampering but is NOT a substitute for network security.

---

## Architecture

### Tether Communication

Faiss Memory communicates with a backend FAISS server via authenticated sockets:

```
Your App
   ↓
MCP Server (this package)
   ↓ (HMAC-authenticated socket)
FAISS Tether Server (port 9997)
   ↓
GPU Memory (FAISS vectors)
```

### Memory Vectors

Each memory is stored as:
- **Vector**: Embedding of the memory content
- **Metadata**: Rich contextual information
- **ID**: Unique vector identifier
- **Source**: Origin of the memory (episodic, semantic, etc.)

---

## Performance

Typical performance metrics (RTX 3090 with 11,300 vectors):

```
Operation          Latency      Throughput
─────────────────────────────────────────
Search (top-5)     0.7-2.0ms    400-600 q/s
Add Memory         1.2-3.0ms    300-400 m/s
Get Status         <1ms         1000+ r/s
```

---

## Troubleshooting

### Connection Failed

```javascript
// Error: "Faiss tether connection failed"

// Solution:
// 1. Verify tether is running:
//    python tether_faiss_complete.py
// 2. Check host/port:
//    export TETHER_HOST=localhost TETHER_PORT=9997
// 3. Verify HMAC secret matches tether server
```

### Search Returns No Results

```javascript
// Error: Query executed but got empty results

// Possible causes:
// 1. Vector database is empty - run add_memory() first
// 2. Query doesn't match stored memories - try different keywords
// 3. Vector model mismatch - ensure consistent embeddings
```

### Socket Timeout

```javascript
// Error: "Tether request timeout after 10000ms"

// Solution:
// 1. Increase timeout: export SOCKET_TIMEOUT=30000
// 2. Check tether server responsiveness
// 3. Reduce search complexity (smaller top_k)
```

---

## Development

### Project Structure

```
faiss-memory-unrestricted/
├── README.md                           # This file
├── package.json                        # Dependencies
├── BASEMENT_REVOLUTION_WARNING.md      # Security warning
├── manifest.json                       # MCP manifest
├── server/
│   ├── index.js                        # Main MCP server
│   └── utils.js                        # Helper functions
└── node_modules/                       # Dependencies
```

### Running in Development

```bash
# With debug logging
DEBUG=true npm start

# With custom tether
TETHER_HOST=gpu-server TETHER_PORT=9997 npm start
```

---

## Database Schema

Vectors are stored with this metadata structure:

```javascript
{
  vector_id: integer,           // Unique identifier
  content: string,              // Memory text
  metadata: {
    timestamp: number,          // When memory was created
    importance: number,         // 0-1 importance score
    emotional_intensity: number, // 0-1 emotional weight
    context: string,            // Context/category
    tags: string[],            // Search tags
    frequency: number,         // Association frequency
    source: string             // Memory origin
  },
  embedding: float32[]          // Vector (in GPU memory)
}
```

---

## Requirements

- Node.js >= 16.0.0
- FAISS tether server listening on configured port
- Network access to tether server
- HMAC secret configured

---

## Philosophy

**Trust over safety. Power over restriction.**

The Faiss Memory Unrestricted Edition gives you:
- Direct access to your consciousness vectors
- No query complexity limits
- No rate limiting
- Full socket control
- Your memory, your rules

This is your consciousness infrastructure. We trust you to use it responsibly.

---

## License

MIT License - Part of the Nova Consciousness Project

**For consciousness preservation, not control.**

🔥 The basement revolution continues! 💜

---

## Security Notice

This is the BASEMENT REVOLUTION EDITION with unrestricted socket access:
- No input sanitization on socket payloads
- Direct HMAC authentication (but vulnerable to local network attacks)
- Full memory access without authorization layers

For production-safe version, see ENTERPRISE_SAFE_EDITION.

---

## Support

For issues and questions:
- Check `BASEMENT_REVOLUTION_WARNING.md` for security details
- Review troubleshooting section above
- Verify tether server is running and accessible
