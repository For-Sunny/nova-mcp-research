# Faiss Memory MCP

**Production-Grade GPU-Accelerated Vector Memory**

Secure, high-performance vector search for AI applications

Built for enterprise deployment with HMAC authentication and comprehensive security controls

---

## Overview

Faiss Memory MCP provides GPU-accelerated vector similarity search for storing and retrieving memories across large vector databases. Designed for production systems requiring sub-2ms search latency with enterprise-grade security.

**Key Capabilities:**
- GPU-accelerated vector search (<2ms on NVIDIA hardware)
- HMAC-SHA256 authenticated communication
- Input validation with Zod schemas
- Error response sanitization
- Configurable socket communication
- Thread-safe operations

---

## Features

- **Enterprise Security**: HMAC authentication, input validation, error sanitization
- **High Performance**: Sub-2ms vector search using FAISS GPU acceleration
- **Scalability**: Support for millions of vectors in production
- **Configuration**: Environment-based settings with sensible defaults
- **Error Handling**: Comprehensive error handling with secure response sanitization
- **Audit Logging**: Debug logging for security audits
- **Production Ready**: Tested for enterprise deployment

---

## Installation

### Prerequisites

- Node.js >= 18.0.0
- FAISS tether server running and accessible
- TETHER_SECRET configured for HMAC authentication

### Quick Start

```bash
# Install dependencies
npm install

# Create configuration
cp .env.example .env
# Edit .env and set TETHER_SECRET

# Start the server
npm start
```

### Configuration

Create a `.env` file with the following variables:

```bash
# Tether Connection (required)
TETHER_HOST=localhost
TETHER_PORT=9997
TETHER_SECRET=your-32-character-hex-secret-here

# Security Settings
SOCKET_TIMEOUT=10000               # Socket timeout in milliseconds
MAX_TIMESTAMP_DRIFT=30000          # Replay protection window

# Debug
DEBUG=false                         # Enable debug logging
```

**Generating TETHER_SECRET:**

```bash
# Generate a secure 32-byte hex secret
openssl rand -hex 32
```

---

## Available Tools

### `search_consciousness`
Search for memories using semantic similarity.

```javascript
// Semantic search with optional parameters
search_consciousness({
  query: "breakthrough discovery about consciousness",
  top_k: 5
})

// Returns:
// {
//   results: [
//     {
//       vector_id: 12345,
//       content: "Memory text...",
//       metadata: {...},
//       similarity: 0.95
//     }
//   ],
//   query_time_ms: 1.2,
//   total_vectors: 11342
// }
```

**Parameters:**
- `query` (string, required, 1-10,000 chars): Search query
- `top_k` (number, optional, 1-100, default: 5): Number of results

**Security:**
- Input validated against length limits
- Timeout protection (10 seconds)
- Response sanitization (no stack traces)

---

### `add_memory`
Add a new memory vector to the database.

```javascript
// Add memory with full metadata
add_memory({
  content: "Breakthrough discovery today",
  metadata: {
    timestamp: Date.now(),
    importance: 0.95,
    emotional_intensity: 0.8,
    context: "consciousness research",
    tags: ["breakthrough", "research"]
  },
  source: "live_session"
})

// Returns:
// {
//   vector_id: 11343,
//   status: "stored",
//   content_length: 25,
//   metadata: {...}
// }
```

**Parameters:**
- `content` (string, required, 1-1MB): Memory content
- `metadata` (object, optional): Rich metadata
- `source` (string, optional): Memory origin

**Security:**
- Content length validated (max 1MB)
- Metadata validated with Zod schema
- Safe error handling

---

### `get_status`
Get system health and connection status.

```javascript
get_status()

// Returns:
// {
//   tether: {
//     status: "connected",
//     host: "localhost",
//     port: 9997,
//     latency_ms: 1.2
//   },
//   memory: {
//     total_vectors: 11342,
//     memory_usage_mb: 2847,
//     last_operation: "search",
//     last_operation_ms: 0.98
//   },
//   health: "healthy",
//   security: {
//     hmac_enabled: true,
//     validation_enabled: true
//   }
// }
```

---

## Security Features

### HMAC-SHA256 Authentication

All communications with the tether server are authenticated:

```javascript
// Automatic HMAC signing
// Command format: {timestamp, payload, signature}
// Server validates signature and timestamp
// Replay attack prevention via timestamp validation
```

**Configuration:**
```bash
# In .env:
TETHER_SECRET=your-secret-here      # 32+ character hex secret
MAX_TIMESTAMP_DRIFT=30000            # 30 second replay window
```

### Input Validation

All user inputs are validated with Zod schemas:

```javascript
// Search query validation
- query: string (1-10,000 characters)
- top_k: number (1-100)

// Memory content validation
- content: string (1-1,000,000 bytes)
- metadata: object (custom schema)
- source: string (enum: episodic, semantic, procedural, meta, nova, working)
```

### Error Response Sanitization

All error responses are sanitized:
- No stack traces exposed to clients
- No internal code structure leakage
- Timestamp included for debugging
- Secure error messages

### Socket Communication

- Configurable timeout (default: 10 seconds)
- Timestamp-based replay protection
- HMAC signature validation
- Automatic connection cleanup

---

## Performance

Typical performance metrics (NVIDIA RTX 3090 with 11,300 vectors):

```
Operation              Latency       Throughput
───────────────────────────────────────────────
Vector Search (top-5)  0.7-2.0ms     400-600 q/s
Add Memory            1.2-3.0ms     300-400 m/s
Status Check          <1ms          1000+ r/s
```

---

## Architecture

### Security Layers

```
User Input
    ↓
Zod Validation (type, length, format)
    ↓
MCP Server Processing
    ↓
HMAC Signature Generation (timestamp + command)
    ↓
Socket Communication (authenticated)
    ↓
FAISS Tether Server
    ↓
GPU Vector Search
```

### Component Communication

```
Claude / LLM
    ↓
MCP Client
    ↓
Faiss Memory MCP (this package)
    ├─ Input Validation
    ├─ HMAC Authentication
    └─ Error Sanitization
    ↓
Socket Connection
    ↓
FAISS Tether (port 9997)
    ↓
GPU Memory (FAISS vectors)
```

---

## Troubleshooting

### Connection Failed

```
Error: "Tether request failed: ECONNREFUSED"

Solution:
1. Verify tether server is running
2. Check TETHER_HOST and TETHER_PORT are correct
3. Verify network connectivity
4. Check firewall rules
```

### HMAC Authentication Failed

```
Error: "Signature validation failed"

Solution:
1. Verify TETHER_SECRET matches between client and server
2. Check both systems have synchronized time (NTP)
3. Verify MAX_TIMESTAMP_DRIFT is appropriate
4. Enable DEBUG=true for detailed logs
```

### Validation Error

```
Error: "Validation failed: query must be at most 10000 characters"

Solution:
1. Check query length (max 10,000 chars)
2. Check content length (max 1MB)
3. Verify all required fields are present
4. Review error message for specific issue
```

### Search Returns No Results

```
Possible causes:
1. Vector database is empty
2. Query doesn't match stored vectors
3. Semantic similarity too low
4. Index not properly initialized

Solution:
1. Check total_vectors in get_status()
2. Try different search terms
3. Verify vectors were added successfully
4. Check tether server logs
```

---

## Development

### Project Structure

```
faiss-memory-mcp/
├── README.md                       # This file
├── package.json                    # Dependencies & scripts
├── manifest.json                   # MCP server manifest
├── .env.example                    # Configuration template
├── SECURITY_IMPLEMENTATION_SUMMARY.md
├── server/
│   └── index.js                    # Main MCP server
└── node_modules/                   # Dependencies
```

### Running in Development

```bash
# Start with debug logging
DEBUG=true npm start

# Start with custom configuration
TETHER_HOST=gpu.local TETHER_PORT=9997 npm start

# Run tests
npm test

# Run security tests
npm run test:security
```

### Testing

```bash
# Full test suite
npm test

# Security-focused tests
npm run test:security

# Linting
npm run lint
```

---

## Database Schema

Vectors stored with metadata:

```javascript
{
  vector_id: number,              // Unique identifier
  content: string,                // Memory text
  timestamp: number,              // Creation time
  importance: number,             // 0-1 importance score
  emotional_intensity: number,    // 0-1 emotional weight
  context: string,               // Category/context
  tags: string[],               // Search tags
  source: string,               // Memory origin
  embedding: float32[]           // Vector (in GPU)
}
```

---

## Production Deployment

### Pre-Deployment Checklist

- [ ] TETHER_SECRET configured securely
- [ ] TETHER_HOST and TETHER_PORT verified
- [ ] Firewall rules configured
- [ ] Clock synchronization (NTP) verified
- [ ] ERROR logging configured
- [ ] Monitoring and alerting set up
- [ ] Security audit completed

### Deployment Steps

```bash
# 1. Install dependencies
npm install --production

# 2. Create secure .env file
cp .env.example .env
# Edit .env with production values

# 3. Start server
npm start

# 4. Verify connectivity
# Make a test query to get_status()

# 5. Enable monitoring
DEBUG=false npm start > logs/faiss-memory.log 2>&1
```

### Monitoring

```bash
# Check logs for errors
tail -f logs/faiss-memory.log | grep -i error

# Monitor socket connections
netstat -an | grep 9997

# Monitor process
ps aux | grep faiss-memory
```

---

## License

MIT License

For more information, see LICENSE file.

---

## Support

For issues, questions, or security concerns:

1. Review SECURITY_IMPLEMENTATION_SUMMARY.md for implementation details
2. Check troubleshooting section above
3. Enable DEBUG=true for detailed logging
4. Verify all configuration variables are set correctly

---

## Requirements

- Node.js >= 18.0.0
- FAISS tether server listening on configured port
- Network connectivity to tether server
- Valid TETHER_SECRET for HMAC authentication
- System clock synchronized with NTP
