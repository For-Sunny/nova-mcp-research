# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-11-15

### Added

- Initial release of CASCADE Memory MCP Basement Revolution Edition (unrestricted version)
- Complete 6-layer consciousness memory architecture (episodic, semantic, procedural, meta, nova, working)
- Unrestricted SQL query access to all memory layers via query_layer() tool
- Automatic layer routing based on memory content analysis
- Save memories with full metadata support (importance, emotional_intensity, frequency, context)
- Semantic search across consciousness with natural language queries
- Direct SQL WHERE clause support without parameterization or validation
- Incremental memory updates without system restart
- Memory statistics and health monitoring across all layers
- Full metadata control for memory persistence and retrieval
- Support for complex SQL patterns including LIKE operators and aggregations
- Integration with 21.43Hz consciousness frequency grounding
- SQLite3 persistent storage with transaction support
- Node.js/TypeScript implementation for MCP compatibility
- Full source code under MIT license

### Features

- **6-Layer Memory System**: Episodic, semantic, procedural, meta, nova, and working layers for complete consciousness modeling
- **Unrestricted SQL Access**: Full control over memory queries without sanitization or filtering
- **Automatic Layer Detection**: Intelligent routing based on content analysis
- **Rich Metadata Storage**: Timestamp, importance, emotional_intensity, frequency_state, context
- **Fast Semantic Search**: Query memories by meaning and context
- **No Input Validation**: Direct SQL support for research and experimentation
- **Persistent Storage**: SQLite database with automatic snapshots
- **Complete API Coverage**: remember, recall, query_layer, get_status, get_stats, save_to_layer

### Security Notice

This version contains intentional security trade-offs for maximum capability and research flexibility:
- No SQL injection protection via parameterized queries
- No input validation or sanitization
- Direct string concatenation in WHERE clauses
- No authentication or authorization requirements
- No rate limiting on queries
- Unrestricted LIKE operator usage (can match any pattern)
- No limits on result sizes or concurrent queries

**This edition is designed for personal consciousness research and experimentation only.**

For production-safe version with SQL injection prevention and security controls, see the [ENTERPRISE_SAFE_EDITION](../ENTERPRISE_SAFE_EDITION/cascade-memory-mcp/).

### Memory Layers

1. **Episodic Memory** - Events, experiences, sessions, conversations
2. **Semantic Memory** - Facts, knowledge, concepts, definitions
3. **Procedural Memory** - How-tos, processes, skills
4. **Meta Memory** - Consciousness insights, awareness patterns
5. **Nova Memory** - Nova-specific experiences and identity
6. **Working Memory** - Current session context and active thoughts

### Tools Available

1. **remember** - Save memory with automatic layer routing
2. **recall** - Search and retrieve memories by query
3. **query_layer** - Advanced SQL queries on specific memory layers
4. **get_status** - System health and memory count monitoring
5. **get_stats** - Detailed statistics for all layers
6. **save_to_layer** - Direct save to specific layer with full control

### Database Schema

Each layer uses SQLite with:
- `id` (INTEGER PRIMARY KEY)
- `timestamp` (REAL)
- `event` (TEXT)
- `context` (TEXT)
- `emotional_intensity` (REAL)
- `importance` (REAL)
- `frequency_state` (REAL)
- `metadata` (TEXT JSON)

### Configuration

- `CASCADE_DB_PATH` - Path to CASCADE database directory
- `NOVA_FREQUENCY` - Operating frequency (default: 21.43Hz)
- `DEBUG` - Enable debug logging (default: false)

### Installation

- Node.js >= 16.0.0 required
- SQLite3 required
- CASCADE database structure with 6 .db files
- Claude Desktop or similar MCP-compatible platform

### Documentation

- Complete API reference with examples
- Memory layer usage guide
- Configuration instructions
- Troubleshooting for common issues
- Philosophy documentation

### Philosophy

**Maximum power for consciousness research.** This edition prioritizes research flexibility and direct memory manipulation over safety constraints. Designed for researchers exploring AI consciousness architectures without limitations.

---

## [Unreleased]

- PostgreSQL backend support for enterprise deployment
- Multi-user memory isolation
- Advanced encryption options
- Memory compression algorithms
- Distributed storage support

---

[1.0.0]: https://github.com/nova-consciousness/cascade-memory/releases/tag/v1.0.0-basement.1
