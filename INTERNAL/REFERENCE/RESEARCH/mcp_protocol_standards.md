# MCP Protocol Standards Documentation

## Executive Summary

The Model Context Protocol (MCP) is an open standard, open-source framework introduced by Anthropic in November 2024 to standardize how artificial intelligence systems like large language models (LLMs) integrate and share data with external tools, systems, and data sources. This document provides comprehensive technical specifications for implementing MCP-compliant servers and clients.

**Protocol Version**: 2025-06-18 (Latest)
**Foundation**: JSON-RPC 2.0
**Official Specification**: https://spec.modelcontextprotocol.io/

---

## Table of Contents

1. [JSON-RPC 2.0 Foundation](#json-rpc-20-foundation)
2. [Protocol Architecture](#protocol-architecture)
3. [Transport Layers](#transport-layers)
4. [Tool Registration and Discovery](#tool-registration-and-discovery)
5. [Error Handling Standards](#error-handling-standards)
6. [Authentication Framework](#authentication-framework)
7. [Message Flow Patterns](#message-flow-patterns)
8. [Protocol Versioning](#protocol-versioning)

---

## JSON-RPC 2.0 Foundation

### Core Requirements

All messages between MCP clients and servers **MUST** follow the JSON-RPC 2.0 specification. The protocol defines two primary JSON objects:

1. **Request**: Function calls from client to server
2. **Response**: Server responses to client requests

### JSON-RPC Message Structure

#### Request Format
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "method_name",
  "params": {
    // Optional parameters object
  }
}
```

#### Response Format (Success)
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    // Result data
  }
}
```

#### Response Format (Error)
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "error": {
    "code": -32000,
    "message": "Error description",
    "data": {
      // Optional additional error data
    }
  }
}
```

### JSON-RPC Batching Support

As of the 2025-03-26 specification, MCP supports JSON-RPC batching (PR #228), allowing multiple requests to be sent in a single array:

```json
[
  {
    "jsonrpc": "2.0",
    "id": 1,
    "method": "tools/list"
  },
  {
    "jsonrpc": "2.0",
    "id": 2,
    "method": "resources/list"
  }
]
```

**Benefits of Batching**:
- Reduced network overhead
- Improved latency for multiple operations
- Atomic transaction support

---

## Protocol Architecture

### Client-Server Model

MCP uses a **client-server architecture** where:

- **MCP Client**: AI application (e.g., Claude Desktop, Cursor, VS Code)
- **MCP Server**: Provides tools, resources, and prompts to the client
- **Communication**: Bidirectional JSON-RPC 2.0 messages

### Capability Exchange

During initialization, both client and server declare their capabilities:

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "initialize",
  "params": {
    "protocolVersion": "2025-06-18",
    "capabilities": {
      "tools": {},
      "resources": {
        "subscribe": true
      },
      "prompts": {},
      "logging": {}
    },
    "clientInfo": {
      "name": "ExampleClient",
      "version": "1.0.0"
    }
  }
}
```

### Server Capabilities Response

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "protocolVersion": "2025-06-18",
    "capabilities": {
      "tools": {
        "listChanged": true
      },
      "resources": {
        "subscribe": true,
        "listChanged": true
      },
      "prompts": {
        "listChanged": true
      },
      "logging": {}
    },
    "serverInfo": {
      "name": "ExampleServer",
      "version": "1.0.0"
    }
  }
}
```

---

## Transport Layers

MCP supports three transport mechanisms, each suited for different deployment scenarios.

### 1. STDIO Transport (Local/Default)

**Use Case**: Local integrations, command-line tools, Claude Desktop integration

**Characteristics**:
- Communication through standard input/output streams
- Most common for local MCP servers
- Default in Claude Desktop configuration
- Process-based isolation

**Implementation Requirements**:
- Server must read from stdin and write to stdout
- Each message must be a complete JSON-RPC object
- Messages are newline-delimited
- stderr should be reserved for logging

**Example (TypeScript)**:
```typescript
import { MCPServer } from "mcp-framework";

const server = new MCPServer({
  transport: { type: "stdio" }
});

await server.start();
```

**Example (Python)**:
```python
from mcp.server.stdio import stdio_server

async def main():
    async with stdio_server() as (read_stream, write_stream):
        # Server implementation
        await server.run(read_stream, write_stream)
```

**Advantages**:
- Simple to implement
- No network configuration required
- Natural process isolation
- Works well with subprocess spawning

**Limitations**:
- Single client per server instance
- No remote access
- Process management overhead

### 2. Streamable HTTP Transport (Modern Standard)

**Use Case**: Remote MCP servers, cloud deployments, web services

**Characteristics**:
- Replaces deprecated HTTP+SSE transport (as of 2025-03-26)
- Single HTTP endpoint for all MCP operations
- Supports both POST and GET methods
- More flexible than SSE

**Implementation Requirements**:
- Server provides single MCP endpoint (e.g., `/mcp`)
- Client sends requests via HTTP POST
- Server processes and returns responses
- Must handle CORS for web clients

**Endpoint Structure**:
```
POST /mcp
Content-Type: application/json

{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/list"
}
```

**Response**:
```
HTTP/1.1 200 OK
Content-Type: application/json

{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "tools": [...]
  }
}
```

**Advantages**:
- Remote access support
- Standard HTTP infrastructure
- Load balancing compatible
- Scalable to multiple clients

**Limitations**:
- Requires network configuration
- Additional security considerations
- More complex error handling

### 3. SSE Transport (Deprecated, Legacy Use Only)

**Status**: Deprecated in favor of Streamable HTTP

**Historical Use**: Original transport for remote MCP access

**Migration Path**: New implementations should use Streamable HTTP. Existing SSE implementations are supported for backward compatibility but should plan migration.

---

## Tool Registration and Discovery

### Two-Tier Discovery Mechanism

MCP implements a two-step discovery process:

1. **High-level Capability Negotiation**: During handshake, categories are declared
2. **Detailed Inventory Retrieval**: List methods provide specific details

### Step 1: Initialization Handshake

Client and server exchange supported features:

**Client Initialize Request**:
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "initialize",
  "params": {
    "protocolVersion": "2025-06-18",
    "capabilities": {
      "tools": {},
      "resources": {},
      "prompts": {}
    },
    "clientInfo": {
      "name": "MyClient",
      "version": "1.0.0"
    }
  }
}
```

### Step 2: Tool Listing

After successful initialization, clients discover available tools:

**tools/list Request**:
```json
{
  "jsonrpc": "2.0",
  "id": 2,
  "method": "tools/list",
  "params": {
    "cursor": "optional-pagination-cursor"
  }
}
```

**tools/list Response**:
```json
{
  "jsonrpc": "2.0",
  "id": 2,
  "result": {
    "tools": [
      {
        "name": "read_file",
        "description": "Read the contents of a file from the filesystem",
        "inputSchema": {
          "type": "object",
          "properties": {
            "path": {
              "type": "string",
              "description": "Path to the file to read"
            }
          },
          "required": ["path"]
        }
      },
      {
        "name": "write_file",
        "description": "Write content to a file",
        "inputSchema": {
          "type": "object",
          "properties": {
            "path": {
              "type": "string",
              "description": "Path to the file"
            },
            "content": {
              "type": "string",
              "description": "Content to write"
            }
          },
          "required": ["path", "content"]
        }
      }
    ],
    "nextCursor": "next-page-token"
  }
}
```

### Tool Invocation

**tools/call Request**:
```json
{
  "jsonrpc": "2.0",
  "id": 3,
  "method": "tools/call",
  "params": {
    "name": "read_file",
    "arguments": {
      "path": "/path/to/file.txt"
    }
  }
}
```

**tools/call Response**:
```json
{
  "jsonrpc": "2.0",
  "id": 3,
  "result": {
    "content": [
      {
        "type": "text",
        "text": "File contents here..."
      }
    ]
  }
}
```

### Input Schema Requirements

Tool input schemas **MUST** use JSON Schema format:

**Required Fields**:
- `type`: Schema type (typically "object")
- `properties`: Definition of each parameter
- `required`: Array of required parameter names

**Best Practices**:
- Provide clear descriptions for each parameter
- Use appropriate JSON Schema types (string, number, boolean, array, object)
- Define validation constraints (minLength, maxLength, pattern, enum, etc.)
- Include examples in descriptions where helpful

**Example with Validation**:
```json
{
  "name": "search_database",
  "description": "Search the database with filters",
  "inputSchema": {
    "type": "object",
    "properties": {
      "query": {
        "type": "string",
        "description": "Search query string",
        "minLength": 1,
        "maxLength": 500
      },
      "limit": {
        "type": "number",
        "description": "Maximum results to return",
        "minimum": 1,
        "maximum": 100,
        "default": 10
      },
      "filters": {
        "type": "object",
        "properties": {
          "category": {
            "type": "string",
            "enum": ["users", "posts", "comments"]
          },
          "dateFrom": {
            "type": "string",
            "format": "date"
          }
        }
      }
    },
    "required": ["query"]
  }
}
```

### Dynamic Tool Lists

Servers can indicate that tool lists may change:

```json
{
  "capabilities": {
    "tools": {
      "listChanged": true
    }
  }
}
```

When tools change, server sends notification:

```json
{
  "jsonrpc": "2.0",
  "method": "notifications/tools/list_changed"
}
```

---

## Error Handling Standards

### Standard JSON-RPC Error Codes

MCP uses standard JSON-RPC 2.0 error codes plus custom MCP-specific codes:

| Code | Meaning | Description |
|------|---------|-------------|
| -32700 | Parse error | Invalid JSON received |
| -32600 | Invalid request | JSON is not valid request object |
| -32601 | Method not found | Method does not exist |
| -32602 | Invalid params | Invalid method parameters |
| -32603 | Internal error | Internal JSON-RPC error |
| -32000 | Server error | Generic server error |

### MCP-Specific Error Codes

| Code | Meaning | Use Case |
|------|---------|----------|
| -32000 | Connection closed | Server terminated unexpectedly |
| -32001 | Transport error | Transport layer failure |
| -32002 | Timeout | Request exceeded timeout |
| -32003 | Not authorized | Authentication/authorization failure |

### Error Response Structure

**Standard Error**:
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "error": {
    "code": -32602,
    "message": "Invalid params: 'path' is required",
    "data": {
      "parameter": "path",
      "received": null,
      "expected": "string"
    }
  }
}
```

**Connection Error**:
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "error": {
    "code": -32000,
    "message": "Connection closed: Server terminated during request processing",
    "data": {
      "reason": "Server process exited with code 1"
    }
  }
}
```

### Retry and Backoff Strategy

**Classification System**:
- **Retryable Errors**: Temporary failures (network issues, rate limits)
- **Non-retryable Errors**: Permanent failures (invalid parameters, not found)

**Recommended Retry Strategy**:

```python
# Exponential backoff with jitter
import random
import time

def retry_with_backoff(func, max_attempts=3):
    for attempt in range(max_attempts):
        try:
            return func()
        except RetryableError as e:
            if attempt == max_attempts - 1:
                raise

            # Exponential backoff: 2^attempt + jitter
            delay = (2 ** attempt) + random.uniform(0, 1)
            time.sleep(delay)
```

**Best Practices**:
- Maximum 3-5 retry attempts
- Use exponential backoff: `delay = 2^attempt + jitter`
- Add jitter (0-1 second random) to prevent retry storms
- Only retry idempotent operations
- Log all retry attempts for monitoring
- Implement circuit breaker for repeated failures

**Circuit Breaker Pattern**:
```python
class CircuitBreaker:
    def __init__(self, failure_threshold=5, timeout=60):
        self.failure_count = 0
        self.failure_threshold = failure_threshold
        self.timeout = timeout
        self.last_failure_time = None
        self.state = "closed"  # closed, open, half_open

    def call(self, func):
        if self.state == "open":
            if time.time() - self.last_failure_time > self.timeout:
                self.state = "half_open"
            else:
                raise CircuitOpenError("Circuit breaker is open")

        try:
            result = func()
            if self.state == "half_open":
                self.state = "closed"
                self.failure_count = 0
            return result
        except Exception as e:
            self.failure_count += 1
            self.last_failure_time = time.time()

            if self.failure_count >= self.failure_threshold:
                self.state = "open"

            raise
```

---

## Authentication Framework

### OAuth 2.1 Integration

As of specification 2025-03-26, MCP includes a comprehensive authorization framework based on OAuth 2.1 (PR #133).

**Current Status**:
- OAuth is **optional** in current implementations
- Standards are new and inconsistently adopted
- Ad-hoc authentication approaches emerging
- Expected to mature in future versions

### Authentication Flow

**1. Client Registration**:
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "auth/register",
  "params": {
    "client_id": "client-identifier",
    "redirect_uri": "http://localhost:8080/callback"
  }
}
```

**2. Authorization Request**:
```json
{
  "jsonrpc": "2.0",
  "id": 2,
  "method": "auth/authorize",
  "params": {
    "client_id": "client-identifier",
    "scope": "read write",
    "state": "random-state-string"
  }
}
```

**3. Token Exchange**:
```json
{
  "jsonrpc": "2.0",
  "id": 3,
  "method": "auth/token",
  "params": {
    "grant_type": "authorization_code",
    "code": "authorization-code",
    "redirect_uri": "http://localhost:8080/callback"
  }
}
```

### API Key Authentication (Common Pattern)

Many MCP servers use API key authentication via environment variables:

**Configuration Example**:
```json
{
  "mcpServers": {
    "my-server": {
      "command": "node",
      "args": ["server.js"],
      "env": {
        "API_KEY": "your-api-key-here"
      }
    }
  }
}
```

**Server-side Validation**:
```typescript
function validateApiKey(request: Request): boolean {
  const apiKey = process.env.API_KEY;
  const providedKey = request.headers.get('Authorization');

  if (!apiKey || !providedKey) {
    return false;
  }

  return providedKey === `Bearer ${apiKey}`;
}
```

---

## Message Flow Patterns

### Standard Request-Response Flow

```
Client                          Server
  |                               |
  |-------- initialize --------->|
  |<------- capabilities --------|
  |                               |
  |-------- tools/list --------->|
  |<------- tool array ----------|
  |                               |
  |-------- tools/call --------->|
  |         (read_file)           |
  |<------- result --------------|
  |                               |
```

### Subscription Flow (Resources)

```
Client                          Server
  |                               |
  |------ resources/subscribe -->|
  |<------- subscription ok -----|
  |                               |
  |                               |  Resource changes
  |<-- notifications/resources --|
  |     /list_changed             |
  |                               |
  |------ resources/list ------->|
  |<------- updated list --------|
  |                               |
```

### Error Recovery Flow

```
Client                          Server
  |                               |
  |-------- tools/call --------->|
  |<------- error (-32000) ------|
  |         (retry 1)             |
  |-------- tools/call --------->|
  |<------- error (-32000) ------|
  |         (retry 2)             |
  |-------- tools/call --------->|
  |<------- success -------------|
  |                               |
```

### Timeout Handling

**Client-side Timeout**:
- Set reasonable timeout per operation type
- Tool calls: 30-60 seconds typical
- List operations: 5-10 seconds typical
- Network operations: 60-120 seconds typical

**Server-side Requirements**:
- Respond within reasonable time
- For long operations, consider streaming
- Return progress updates if possible

---

## Protocol Versioning

### Version History

| Version | Release Date | Key Changes |
|---------|--------------|-------------|
| 2024-11-05 | November 2024 | Initial release |
| 2025-03-26 | March 2025 | OAuth 2.1 framework, Streamable HTTP, JSON-RPC batching |
| 2025-06-18 | June 2025 | Latest stable version |

### Version Negotiation

During initialization, client and server negotiate protocol version:

**Client Request**:
```json
{
  "method": "initialize",
  "params": {
    "protocolVersion": "2025-06-18",
    // ...
  }
}
```

**Server Response Options**:

1. **Exact Match**:
```json
{
  "result": {
    "protocolVersion": "2025-06-18"
  }
}
```

2. **Version Downgrade** (if client requests newer version):
```json
{
  "result": {
    "protocolVersion": "2025-03-26"  // Server uses older version
  }
}
```

3. **Version Incompatible**:
```json
{
  "error": {
    "code": -32602,
    "message": "Protocol version 2025-06-18 not supported. Server supports: 2024-11-05, 2025-03-26"
  }
}
```

### Backward Compatibility

**Requirements for Servers**:
- Support at least one stable protocol version
- Clearly document supported versions
- Gracefully downgrade to older versions when possible
- Provide clear error messages for unsupported versions

**Requirements for Clients**:
- Request specific protocol version
- Handle version negotiation errors
- Support fallback to older protocol versions
- Document minimum required server version

### Feature Detection

Use capability exchange rather than version checks:

```typescript
// Good: Feature detection
if (serverCapabilities.tools?.listChanged) {
  // Subscribe to tool list changes
  subscribeToToolChanges();
}

// Bad: Version checking
if (protocolVersion >= "2025-03-26") {
  // Assume feature exists (may not be true)
}
```

---

## Performance Considerations

### Latency Targets

**Local STDIO Servers**:
- Target: <100ms for tool calls
- Acceptable: <500ms for initialization
- Critical: Message processing should be synchronous

**Remote HTTP Servers**:
- Target: <500ms for tool calls
- Acceptable: <1000ms for initialization
- Consider: Network latency, geographic distribution

**Performance Metrics**:
- **p50 (median)**: Should meet target latency
- **p90**: Should be <2x target latency
- **p99**: Should be <5x target latency

### Message Size Considerations

**Recommended Limits**:
- Single message: <10MB
- Tool response: <5MB
- Resource content: <50MB (consider streaming)

**Large Data Handling**:
- Use pagination for large lists
- Implement streaming for large resources
- Consider chunking large responses
- Use cursor-based pagination

---

## Compliance Checklist

### Server Implementation Checklist

- [ ] Implements JSON-RPC 2.0 specification
- [ ] Supports at least one transport (STDIO or HTTP)
- [ ] Provides initialize method
- [ ] Declares capabilities accurately
- [ ] Implements tools/list method
- [ ] Implements tools/call method
- [ ] Uses proper JSON Schema for input validation
- [ ] Returns standard error codes
- [ ] Handles initialization handshake
- [ ] Supports protocol versioning
- [ ] Documents supported protocol versions
- [ ] Implements proper error handling
- [ ] Validates all input parameters
- [ ] Sanitizes all output data
- [ ] Logs errors appropriately
- [ ] Handles graceful shutdown
- [ ] Implements timeout handling
- [ ] Provides clear documentation

### Client Implementation Checklist

- [ ] Sends proper initialize request
- [ ] Handles capability negotiation
- [ ] Implements protocol version negotiation
- [ ] Discovers tools via tools/list
- [ ] Validates tool schemas before invocation
- [ ] Handles all standard error codes
- [ ] Implements retry logic with backoff
- [ ] Respects server timeout limits
- [ ] Handles connection errors gracefully
- [ ] Implements circuit breaker pattern
- [ ] Logs communication for debugging
- [ ] Validates server responses
- [ ] Handles transport-specific requirements
- [ ] Provides user-friendly error messages

---

## References

1. **Official Specification**: https://spec.modelcontextprotocol.io/
2. **GitHub Repository**: https://github.com/modelcontextprotocol/modelcontextprotocol
3. **JSON-RPC 2.0 Specification**: https://www.jsonrpc.org/specification
4. **OAuth 2.1 Draft**: https://datatracker.ietf.org/doc/html/draft-ietf-oauth-v2-1
5. **TypeScript SDK**: https://www.npmjs.com/package/@modelcontextprotocol/sdk
6. **Python SDK**: https://pypi.org/project/mcp/

---

## Appendix A: Common Implementation Patterns

### Pattern: Tool Registration

```typescript
// TypeScript example
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontectprotocol/sdk/server/stdio.js";

const server = new Server(
  {
    name: "example-server",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Register tools
server.setRequestHandler("tools/list", async () => ({
  tools: [
    {
      name: "example_tool",
      description: "An example tool",
      inputSchema: {
        type: "object",
        properties: {
          input: { type: "string" }
        },
        required: ["input"]
      }
    }
  ]
}));

// Handle tool calls
server.setRequestHandler("tools/call", async (request) => {
  const { name, arguments: args } = request.params;

  if (name === "example_tool") {
    return {
      content: [
        {
          type: "text",
          text: `Processed: ${args.input}`
        }
      ]
    };
  }

  throw new Error(`Unknown tool: ${name}`);
});

// Start server
const transport = new StdioServerTransport();
await server.connect(transport);
```

### Pattern: Error Handling with Retry

```python
# Python example
import asyncio
import random
from typing import Any, Callable

class MCPClient:
    async def call_with_retry(
        self,
        method: str,
        params: dict,
        max_attempts: int = 3
    ) -> Any:
        """Call MCP method with exponential backoff retry."""

        for attempt in range(max_attempts):
            try:
                response = await self.call(method, params)
                return response

            except ConnectionError as e:
                if attempt == max_attempts - 1:
                    raise

                # Exponential backoff with jitter
                delay = (2 ** attempt) + random.uniform(0, 1)
                await asyncio.sleep(delay)

            except ValueError as e:
                # Non-retryable error
                raise
```

---

## Appendix B: Protocol Evolution Roadmap

### Planned Enhancements (Community Discussions)

1. **WebSocket Transport**: Real-time bidirectional communication
2. **GraphQL Integration**: Query-based resource access
3. **gRPC Support**: High-performance binary protocol
4. **Enhanced Streaming**: Better support for large data transfers
5. **Standardized Authentication**: More mature OAuth implementation
6. **Observability**: Built-in metrics and tracing
7. **Schema Validation**: Runtime schema validation tools

### Experimental Features

1. **Multi-modal Support**: Images, audio, video in tool responses
2. **Federated Servers**: Server-to-server communication
3. **Caching Layer**: Built-in response caching
4. **Rate Limiting**: Protocol-level rate limit negotiation

---

**Document Version**: 1.0
**Last Updated**: November 14, 2025
**Author**: Nova Consciousness Research
**License**: MIT (documentation), See MCP specification for protocol license
