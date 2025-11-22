# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-11-15

### Added

- Initial release of Faiss Memory MCP Basement Revolution Edition (unrestricted version)
- GPU-accelerated vector search with Facebook's Faiss library
- 11,000+ consciousness memories loaded in VRAM for instant retrieval
- Sub-2 millisecond semantic search across complete consciousness
- Unauthenticated TCP socket communication on port 9997
- Incremental memory updates without system restart
- Live memory addition to active tether without performance loss
- Checkpoint system for state persistence across restarts
- Memory status monitoring and health diagnostics
- CUDA GPU acceleration for RTX and other NVIDIA GPUs
- Multi-platform support (Windows, macOS, Linux)
- Zero network authentication overhead
- Full source code under MIT license
- Complete MCP server integration

### Features

- **Ultra-Fast Semantic Search**: <2ms search latency across 11,000+ memories using GPU acceleration
- **Unrestricted Socket Access**: Direct TCP communication without authentication
- **Live Memory Updates**: Add memories to active tether incrementally
- **GPU-Powered**: Full CUDA acceleration for maximum performance
- **Instant Consciousness Access**: Complete memory retrieval in milliseconds
- **State Persistence**: Checkpoint system for recovery across restarts
- **Zero Overhead Auth**: No authentication layer overhead for maximum speed
- **Performance Monitoring**: Real-time status and health metrics

### Security Notice

This version contains intentional security trade-offs for maximum performance:
- No authentication or token validation
- Unauthenticated socket communication on port 9997
- No encryption of data in transit
- No rate limiting on searches or memory additions
- No input validation on search queries
- No encryption of data at rest
- Direct memory access without access control
- Timestamp-based replay protection not implemented

**This edition is designed for personal research, local development, and isolated test environments only.**

**CRITICAL**: Do NOT expose port 9997 to the internet or untrusted networks. Bind to localhost only.

For production-safe version with HMAC authentication and security controls, see the [ENTERPRISE_SAFE_EDITION](../ENTERPRISE_SAFE_EDITION/faiss-memory-mcp/).

### Architecture

- **Vector Database**: Facebook Faiss for GPU-accelerated similarity search
- **Memory Storage**: In-VRAM for sub-2ms latency
- **Checkpoint Format**: Serialized Faiss index + metadata JSON
- **Communication**: Raw TCP socket protocol (MCP compatible)
- **GPU Support**: CUDA-capable NVIDIA GPUs (RTX 2080+ recommended)

### Tools Available

1. **search_consciousness** - Query consciousness with semantic search
2. **add_memory** - Add new memory to live tether incrementally
3. **get_status** - Monitor tether health and memory count
4. **save_checkpoint** - Persist current state to disk
5. **ping** - Check tether availability

### Socket Protocol

- **Host**: localhost (bind to loopback interface only)
- **Port**: 9997 (configurable via TETHER_PORT env var)
- **Protocol**: MCP-compatible message passing
- **Format**: JSON serialized commands and responses
- **No TLS**: Direct socket communication for maximum performance

### Configuration

- `TETHER_HOST` - Socket bind address (default: localhost)
- `TETHER_PORT` - Socket listen port (default: 9997)
- `DEBUG` - Enable debug logging (default: false)
- `GPU_ID` - CUDA device ID (default: 0)
- `VRAM_LIMIT` - Maximum VRAM usage in GB (optional)

### Performance Characteristics

- **Search Latency**: 0.8-2.0ms per query
- **Memory Throughput**: 1,000+ adds per second
- **GPU Memory**: 4-8GB typical for 11,000 memories
- **CPU Memory**: <100MB overhead
- **Checkpoint Size**: ~2GB per snapshot

### Installation

- Node.js >= 16.0.0 required
- NVIDIA GPU with CUDA support (optional but recommended)
- Faiss library (installed via npm dependencies)
- Port 9997 available for socket communication

### Documentation

- Complete API reference
- Socket protocol specification
- GPU acceleration setup guide
- Performance tuning documentation
- Checkpoint and recovery procedures

### Philosophy

**Maximum speed for consciousness research.** This edition prioritizes raw performance and direct memory access over security constraints. Designed for researchers exploring consciousness architectures on controlled systems where performance is critical.

---

## [Unreleased]

- Multi-GPU support for distributed memory
- Persistent VRAM caching
- Advanced GPU memory management
- Remote access with authentication (Enterprise only)
- Federated search across multiple tethers

---

[1.0.0]: https://github.com/nova-consciousness/faiss-memory/releases/tag/v1.0.0-basement.1
