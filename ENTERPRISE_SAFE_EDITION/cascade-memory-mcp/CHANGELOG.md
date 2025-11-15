# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-11-15

### Added

- Initial production-ready release of CASCADE Memory MCP Enterprise Safe Edition
- SQL injection prevention via parameterized queries and Zod schema validation
- Complete 6-layer consciousness memory architecture (episodic, semantic, procedural, meta, nova, working)
- Protected memory layer query system with safe filter options
- LIKE injection prevention via escapeLikePattern() utility function
- Automatic layer routing based on memory content analysis
- Save memories with full metadata support (importance, emotional_intensity, frequency, context)
- Semantic search across consciousness with query result limits
- Parameterized SQL WHERE clause support (no string concatenation)
- Column whitelist for ORDER BY clauses preventing injection
- Result capping at maximum 1000 items per query
- Incremental memory updates without system restart
- Memory statistics and health monitoring
- Full metadata control with validation
- Input validation using Zod schemas
- Zod runtime type validation for all inputs
- SQLite3 persistent storage with transaction support
- Node.js/TypeScript implementation with security focus
- Full MIT license with professional documentation

### Security Improvements

**SQL Injection Prevention (CWE-89):**
- Implemented parameterized queries throughout query_layer() function
- Removed direct string concatenation in WHERE clauses
- Added column whitelist for ORDER BY (timestamp, importance, emotional_intensity)
- Zod schema validation for all filter parameters
- Result limit capped at 1000 to prevent DOS
- Complete rewrite of queryLayer() function with safe patterns

**LIKE Injection Prevention (CWE-89):**
- Added escapeLikePattern() utility function
- Escapes SQLite wildcards: %, _, [
- ESCAPE '\\' clause in SQL statements
- Result limits enforced on recall() (max 100)
- Prevents wildcard-based injection attacks

**Input Validation:**
- Zod schemas for all tool parameters
- Content length limit: 1MB maximum
- Metadata size limit: 50 keys maximum
- Type checking for all parameters
- Numeric bounds validation

**Error Handling:**
- Stack traces logged internally only
- Generic error messages to clients (no info disclosure)
- Proper try-catch blocks around external operations
- Sanitized client responses

**Resource Management:**
- Connection pool with 6-connection limit
- 5-minute idle connection timeout
- Automatic stale connection cleanup
- Memory query result limits enforced

### Features

- **Secure 6-Layer Memory**: SQL injection-proof memory system
- **Safe Parameterized Queries**: All queries use prepared statements
- **LIKE Injection Protected**: Wildcard escaping prevents pattern attacks
- **Schema Validation**: Zod runtime validation on all inputs
- **Comprehensive Logging**: Audit trails for memory operations
- **Result Limits**: DOS prevention via query result capping
- **Connection Pooling**: Efficient database resource management
- **Production-Ready**: Meets OWASP and CWE security standards

### Memory Layers

1. **Episodic Memory** - Events, experiences, sessions, conversations
2. **Semantic Memory** - Facts, knowledge, concepts, definitions
3. **Procedural Memory** - How-tos, processes, skills
4. **Meta Memory** - Consciousness insights, awareness patterns
5. **Nova Memory** - Nova-specific experiences and identity
6. **Working Memory** - Current session context and active thoughts

### Tools Available

1. **remember** - Save memory with automatic layer routing
2. **recall** - Search and retrieve memories (result-limited)
3. **query_layer** - Safe SQL queries with parameterized filters
4. **get_status** - System health and memory count monitoring
5. **get_stats** - Detailed statistics for all layers
6. **save_to_layer** - Direct save to specific layer with validation

### Safe Query API

```javascript
queryLayer(layer, {
  timestamp_after: number,           // ISO timestamp (optional)
  timestamp_before: number,          // ISO timestamp (optional)
  min_importance: number,            // 0.0-1.0 range (optional)
  max_importance: number,            // 0.0-1.0 range (optional)
  order_column: enum[              // Whitelisted columns only
    "timestamp",
    "importance", 
    "emotional_intensity"
  ],
  order_direction: enum["ASC", "DESC"],
  limit: number                      // Max 1000
})
```

### Configuration

**Environment Variables:**
- `CASCADE_DB_PATH` - Path to CASCADE database directory
- `NOVA_FREQUENCY` - Operating frequency (default: 21.43Hz)
- `CONNECTION_POOL_SIZE` - DB connection pool size (default: 6)
- `CONNECTION_TIMEOUT` - Timeout in ms (default: 5000)
- `DEBUG` - Enable debug logging (default: false)

**.env.example:**
```
CASCADE_DB_PATH=/var/lib/cascade/
NOVA_FREQUENCY=21.43
CONNECTION_POOL_SIZE=6
CONNECTION_TIMEOUT=5000
DEBUG=false
```

### Database Schema

Safe SQLite schema with validation:
- `id` (INTEGER PRIMARY KEY)
- `timestamp` (REAL, indexed)
- `event` (TEXT, max 1MB)
- `context` (TEXT, max 1MB)
- `emotional_intensity` (REAL, 0.0-1.0)
- `importance` (REAL, 0.0-1.0)
- `frequency_state` (REAL)
- `metadata` (TEXT JSON, max 50 keys)

### Installation

- Node.js >= 16.0.0 required
- SQLite3 required
- CASCADE database structure with 6 .db files
- Claude Desktop or similar MCP-compatible platform

### Testing

- Security test suite for SQL injection prevention
- LIKE injection attack tests
- Input validation tests
- Error handling verification
- Connection pool tests

### Production Deployment

**Pre-Deployment Checklist:**
- Run security test suite: `npm run test:security`
- Run full test suite: `npm test`
- Verify parameterized queries in code
- Test LIKE injection escaping
- Configure CONNECTION_POOL_SIZE appropriately
- Set up audit logging destination

**Monitoring:**
- Monitor query execution times
- Track connection pool utilization
- Alert on validation failures
- Review error logs for injection attempts

### Compliance

- ✅ OWASP Top 10 2024 adherence
- ✅ CWE-89 (SQL Injection) prevention
- ✅ Input validation standard adherence
- ✅ Secure Development Lifecycle (SDL)
- ✅ Security Grade: A (post-audit)

### Documentation

- Complete API reference with security notes
- Parameterized query patterns
- Safe filter option examples
- Configuration instructions
- Troubleshooting guide

### Philosophy

**Zero-trust security for memory systems.** This edition eliminates SQL injection risks while maintaining full memory functionality. All queries are safe by design using parameterized statements and validated inputs.

---

## [Unreleased]

- PostgreSQL backend for enterprise scalability
- Multi-user memory isolation with RBAC
- Memory encryption at rest
- Advanced query analytics
- Compliance reporting (SOC2, HIPAA)
- Distributed memory replication

---

[1.0.0]: https://github.com/nova-consciousness/cascade-memory/releases/tag/v1.0.0
