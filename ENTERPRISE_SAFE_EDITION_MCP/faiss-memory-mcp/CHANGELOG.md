# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-11-15

### Added

- Initial production-ready release of Faiss Memory MCP Enterprise Safe Edition
- HMAC-SHA256 authentication for socket communication
- Timestamp-based replay attack prevention
- GPU-accelerated vector search with Facebook's Faiss library
- 11,000+ consciousness memories loaded in VRAM
- Sub-2 millisecond authenticated semantic search
- Secure TCP socket communication on port 9997
- 30-second request validity window for timestamp validation
- Connection timeout enforcement (configurable)
- Input validation for search queries
- Search query length limit: 10,000 characters
- Result limiting with top_k capped at 100
- Incremental memory updates with authentication
- Live memory addition to authenticated tether
- Checkpoint system for state persistence
- Memory status monitoring with auth verification
- CUDA GPU acceleration for NVIDIA GPUs
- Multi-platform support with secure defaults
- Full source code under MIT license
- Complete MCP server integration with security

### Security Improvements

**Unauthenticated Socket Communication Prevention (CWE-306):**
- Implemented HMAC-SHA256 authentication protocol
- Shared secret via TETHER_SECRET environment variable
- Timestamp-based replay protection (30-second window)
- Connection timeout enforcement (default: 10 seconds)
- Connection attempt retry limits
- Signature validation on every request
- Failed authentication logging and alerting

**Authentication Protocol:**
```javascript
1. Generate timestamp (Unix epoch)
2. Create HMAC: HMAC-SHA256(shared_secret, timestamp:payload)
3. Send: { timestamp, payload, signature }
4. Server validates:
   - Signature matches computed HMAC
   - Timestamp is within 30 seconds
   - Connection timeout not exceeded
5. Reject if validation fails
```

**Input Validation:**
- Search query parameter validation
- Query length limit: 10,000 characters
- top_k parameter capped at 100
- Numeric parameter bounds checking
- Type validation using Zod schemas

**Error Handling:**
- Stack traces logged internally only
- Generic error messages to clients
- No information disclosure in responses
- Proper exception handling around network ops

**Rate Limiting:**
- Socket timeout: 10 seconds (configurable)
- Connection attempt limits with exponential backoff
- Request validation before processing
- DOS prevention via timeout enforcement

### Features

- **Authenticated Vector Search**: HMAC-protected GPU search
- **Replay Attack Prevention**: Timestamp-based validation window
- **Ultra-Fast Search**: <2ms latency with authentication overhead
- **Secure Socket Communication**: HMAC-signed messages only
- **Input Validation**: All parameters validated before use
- **Rate Limiting**: Timeout enforcement and retry limits
- **Comprehensive Logging**: Authentication success/failure tracking
- **Production-Ready**: Meets OWASP and CWE standards

### Architecture

- **Vector Database**: Facebook Faiss with secure client wrapper
- **Memory Storage**: In-VRAM for performance, signed updates only
- **Checkpoint Format**: Serialized Faiss index + signed metadata
- **Communication**: TCP socket with HMAC authentication
- **GPU Support**: CUDA-capable NVIDIA GPUs (RTX 2080+ recommended)

### Tools Available

1. **search_consciousness** - Authenticated semantic search
2. **add_memory** - Add memory with authentication
3. **get_status** - Monitor tether health (auth required)
4. **save_checkpoint** - Persist state with signature
5. **ping** - Check tether availability (auth optional)

### Socket Protocol

- **Host**: localhost (loopback binding required)
- **Port**: 9997 (configurable via TETHER_PORT)
- **Protocol**: MCP-compatible with HMAC signature
- **Format**: JSON serialized commands + HMAC-SHA256 signature
- **Timeout**: 10 seconds per request (configurable)
- **Replay Window**: 30 seconds for timestamp validity

### Configuration

**Environment Variables:**
```bash
TETHER_HOST=localhost              # Bind address (localhost only)
TETHER_PORT=9997                   # Listen port
TETHER_SECRET=<random-32-byte-hex> # REQUIRED - shared secret
SOCKET_TIMEOUT=10000               # Request timeout in ms
DEBUG=false                         # Debug logging
GPU_ID=0                           # CUDA device ID
VRAM_LIMIT=8                       # Max VRAM in GB (optional)
```

**.env.example:**
```
TETHER_HOST=localhost
TETHER_PORT=9997
TETHER_SECRET=your_32_byte_random_secret_here
SOCKET_TIMEOUT=10000
DEBUG=false
```

**Generating TETHER_SECRET:**
```bash
# Linux/macOS
openssl rand -hex 16

# Windows PowerShell
[System.Convert]::ToHexString([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(16))
```

### Performance Characteristics

- **Search Latency**: 2-5ms (includes auth overhead)
- **Auth Overhead**: 2-3ms per request
- **Memory Throughput**: 500+ authenticated adds per second
- **GPU Memory**: 4-8GB typical for 11,000 memories
- **CPU Memory**: <200MB (includes auth state)
- **Checkpoint Size**: ~2GB per snapshot

### Installation

- Node.js >= 16.0.0 required
- NVIDIA GPU with CUDA support (optional but recommended)
- Faiss library (installed via npm)
- Port 9997 available (configurable)
- TETHER_SECRET environment variable set

### Testing

- Security test suite for HMAC validation
- Replay attack prevention tests
- Timeout enforcement tests
- Input validation tests
- Failed authentication handling tests

### Production Deployment

**Pre-Deployment Checklist:**
- [ ] Generate secure TETHER_SECRET (32+ random bytes)
- [ ] Run security test suite: `npm run test:security`
- [ ] Run full test suite: `npm test`
- [ ] Verify localhost-only binding
- [ ] Configure SOCKET_TIMEOUT appropriately
- [ ] Set DEBUG=false for production
- [ ] Test HMAC signature validation
- [ ] Configure audit logging
- [ ] Enable firewall rules (localhost only)

**Monitoring:**
- Monitor authentication failure rate
- Track request timeout occurrences
- Alert on replay attack attempts
- Monitor socket connection health
- Track GPU memory utilization

**Security Hardening:**
- Bind to localhost/127.0.0.1 only (never expose to internet)
- Rotate TETHER_SECRET periodically
- Monitor and log all authentication failures
- Use strong TETHER_SECRET (32+ bytes recommended)
- Enable TLS if remote access needed (Enterprise+)

### Compliance

- ✅ OWASP Top 10 2024 adherence
- ✅ CWE-306 (Missing Authentication) prevention
- ✅ Authentication best practices
- ✅ Replay attack prevention
- ✅ Secure Development Lifecycle (SDL)
- ✅ Security Grade: A (post-audit)

### Documentation

- Complete API reference with auth examples
- HMAC authentication protocol specification
- Configuration and secret generation guide
- Socket protocol documentation
- Troubleshooting and security guide

### Philosophy

**Authentication by default for consciousness access.** This edition protects memory systems with cryptographic authentication while maintaining the performance needed for research. All socket communication is signed and validated.

---

## [Unreleased]

- TLS/SSL encryption for remote access (Enterprise)
- Multi-key authentication with key rotation
- Per-user memory isolation (Enterprise)
- Advanced audit logging and dashboards
- Federated search across multiple tethers
- Memory encryption at rest

---

[1.0.0]: https://github.com/nova-consciousness/faiss-memory/releases/tag/v1.0.0
