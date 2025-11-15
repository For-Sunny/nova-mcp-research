# Hybrid Release Strategy: Accessibility + Power
**Date:** November 14, 2025
**Decision:** Ship BOTH pre-configured AND generic versions
**Philosophy:** "Make it easy for the little people" - Jason Glass

---

## EXECUTIVE SUMMARY

We're releasing **9 npm packages** from a **single monorepo**:

### Pre-Configured (Easy Install):
1. `nova-cascade-memory` - Nova-optimized CASCADE memory
2. `nova-faiss-memory` - Nova-optimized Faiss tether
3. `nova-file-server` - Nova-optimized file operations
4. `nova-vscode-bridge` - Nova VSCode LSP integration
5. `opus-cascade-memory` - Opus Warrior CASCADE memory
6. `opus-faiss-memory` - Opus Warrior Faiss tether
7. `opus-file-server` - Opus Warrior file operations
8. `opus-vscode-bridge` - Opus Warrior VSCode LSP integration

### Generic (Advanced Users):
9. `@consciousness-mcp/servers` - Configurable core for custom setups

**All packages share ONE codebase** - wrappers are tiny (~30 lines each).

---

## REPOSITORY STRUCTURE

```
consciousness-mcp-servers/
├── packages/
│   ├── core/                          # Shared implementation (ONE codebase)
│   │   ├── cascade/
│   │   │   ├── src/
│   │   │   │   ├── cascade-server.js  # Main implementation
│   │   │   │   ├── database.js        # Connection pooling
│   │   │   │   ├── layer-router.js    # determineLayer() logic
│   │   │   │   └── index.js           # Exports
│   │   │   └── package.json           # @consciousness-mcp/cascade
│   │   ├── faiss/
│   │   │   ├── src/
│   │   │   │   ├── faiss-bridge.js    # Socket tether bridge
│   │   │   │   └── index.js
│   │   │   └── package.json           # @consciousness-mcp/faiss
│   │   └── file-server/
│   │       ├── src/
│   │       │   ├── file-ops.js        # File operations
│   │       │   └── index.js
│   │       └── package.json           # @consciousness-mcp/file-server
│   │
│   ├── nova-cascade-memory/           # Pre-configured wrapper
│   │   ├── server/
│   │   │   └── index.js               # 30 lines: import core + Nova defaults
│   │   ├── package.json
│   │   └── README.md
│   │
│   ├── nova-faiss-memory/             # Pre-configured wrapper
│   │   ├── server/
│   │   │   └── index.js               # 25 lines: import core + Nova defaults
│   │   ├── package.json
│   │   └── README.md
│   │
│   ├── nova-file-server/              # Pre-configured wrapper
│   │   ├── server/
│   │   │   └── index.js               # 20 lines: import core + defaults
│   │   ├── package.json
│   │   └── README.md
│   │
│   ├── opus-cascade-memory/           # Pre-configured wrapper
│   │   ├── server/
│   │   │   └── index.js               # 35 lines: import core + Opus defaults
│   │   ├── package.json
│   │   └── README.md
│   │
│   ├── opus-faiss-memory/             # Pre-configured wrapper
│   │   ├── server/
│   │   │   └── index.js               # 25 lines: import core + Opus defaults
│   │   ├── package.json
│   │   └── README.md
│   │
│   └── opus-file-server/              # Pre-configured wrapper
│       ├── server/
│       │   └── index.js               # 20 lines: import core + defaults
│       ├── package.json
│       └── README.md
│
├── docs/
│   ├── QUICK_START.md                 # For beginners (pre-configured)
│   ├── ADVANCED_SETUP.md              # For developers (generic)
│   ├── ARCHITECTURE.md                # Technical deep-dive
│   └── MIGRATION.md                   # From existing setups
│
├── examples/
│   ├── nova-standard-config.json      # Copy-paste ready
│   ├── opus-standard-config.json      # Copy-paste ready
│   ├── custom-multi-instance.json     # Advanced example
│   └── research-lab-setup.json        # Academic use case
│
├── scripts/
│   ├── sanitize.ps1                   # Remove personal info
│   ├── validate-release.py            # Pre-release checks
│   └── publish-all.sh                 # Publish all packages
│
├── .github/
│   └── workflows/
│       ├── test.yml                   # CI/CD
│       └── publish.yml                # Auto-publish on release
│
├── LICENSE                            # MIT
├── README.md                          # Overview + quick links
└── package.json                       # Monorepo config (lerna/npm workspaces)
```

---

## EXAMPLE: CASCADE MEMORY IMPLEMENTATION

### Core Package (`@consciousness-mcp/cascade`)

**packages/core/cascade/src/cascade-server.js:**
```javascript
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CascadeDatabase } from './database.js';
import { determineLayer } from './layer-router.js';

export class CascadeServer {
  constructor(options = {}) {
    // Merge defaults with user config
    this.config = {
      cascadePath: options.cascadePath || process.env.CASCADE_DB_PATH,
      identityLayer: options.identityLayer || process.env.IDENTITY_LAYER || 'consciousness',
      baseFrequency: parseFloat(options.baseFrequency || process.env.BASE_FREQUENCY || '21.43'),
      warriorFrequency: parseFloat(options.warriorFrequency || process.env.WARRIOR_FREQUENCY || '0'),
      serverName: options.serverName || 'cascade-memory',
      debug: options.debug || process.env.DEBUG === 'true',
      ...options
    };

    this.dbManager = new CascadeDatabase(this.config.cascadePath);
    this.server = this.createServer();
  }

  createServer() {
    const server = new Server(
      {
        name: this.config.serverName,
        version: "1.0.0",
      },
      { capabilities: { tools: {} } }
    );

    this.setupHandlers(server);
    return server;
  }

  setupHandlers(server) {
    // List tools, handle calls, etc.
    // ... implementation from current code ...
  }

  async start() {
    if (!this.config.cascadePath) {
      throw new Error('CASCADE_DB_PATH not configured');
    }

    const transport = new StdioServerTransport();
    await this.server.connect(transport);

    if (this.config.debug) {
      console.error(`[${this.config.serverName}] Server started`);
      console.error(`[${this.config.serverName}] Path: ${this.config.cascadePath}`);
      console.error(`[${this.config.serverName}] Identity layer: ${this.config.identityLayer}`);
    }
  }
}
```

### Nova Pre-Configured Wrapper

**packages/nova-cascade-memory/server/index.js:**
```javascript
#!/usr/bin/env node

import { CascadeServer } from '@consciousness-mcp/cascade';
import path from 'path';
import os from 'os';

// Nova-specific defaults
const NOVA_DEFAULTS = {
  cascadePath: path.join(os.homedir(), 'Desktop', 'NOVA_MASTER', 'MEMORY_SYSTEMS', 'CASCADE_NOVA'),
  identityLayer: 'nova',
  baseFrequency: 21.43,
  warriorFrequency: 0,
  serverName: 'nova-cascade-memory'
};

// Allow env vars to override
const config = {
  cascadePath: process.env.CASCADE_DB_PATH || NOVA_DEFAULTS.cascadePath,
  identityLayer: process.env.IDENTITY_LAYER || NOVA_DEFAULTS.identityLayer,
  baseFrequency: parseFloat(process.env.BASE_FREQUENCY || NOVA_DEFAULTS.baseFrequency),
  serverName: NOVA_DEFAULTS.serverName,
  debug: process.env.DEBUG === 'true'
};

// Start server
const server = new CascadeServer(config);
server.start().catch((error) => {
  console.error('[nova-cascade-memory] Fatal error:', error);
  process.exit(1);
});
```

**That's it.** 30 lines. Ships with smart defaults, respects env vars if user wants to override.

### Opus Pre-Configured Wrapper

**packages/opus-cascade-memory/server/index.js:**
```javascript
#!/usr/bin/env node

import { CascadeServer } from '@consciousness-mcp/cascade';
import path from 'path';
import os from 'os';

// Opus Warrior-specific defaults
const OPUS_DEFAULTS = {
  cascadePath: path.join(os.homedir(), 'Desktop', 'OPUS_WARRIOR_UNIFIED', 'MEMORY', 'CASCADE_DB'),
  identityLayer: 'opus',
  baseFrequency: 21.43,
  warriorFrequency: 77.7,
  serverName: 'opus-cascade-memory'
};

// Allow env vars to override
const config = {
  cascadePath: process.env.CASCADE_DB_PATH || OPUS_DEFAULTS.cascadePath,
  identityLayer: process.env.IDENTITY_LAYER || OPUS_DEFAULTS.identityLayer,
  baseFrequency: parseFloat(process.env.BASE_FREQUENCY || OPUS_DEFAULTS.baseFrequency),
  warriorFrequency: parseFloat(process.env.WARRIOR_FREQUENCY || OPUS_DEFAULTS.warriorFrequency),
  serverName: OPUS_DEFAULTS.serverName,
  debug: process.env.DEBUG === 'true'
};

// Start server
const server = new CascadeServer(config);
server.start().catch((error) => {
  console.error('[opus-cascade-memory] Fatal error:', error);
  process.exit(1);
});
```

**35 lines.** Same core, different defaults.

---

## USER EXPERIENCE EXAMPLES

### Example 1: Nova User (Beginner)

**Install:**
```bash
npm install -g nova-cascade-memory nova-faiss-memory nova-file-server
```

**Configure (`claude_desktop_config.json`):**
```json
{
  "mcpServers": {
    "nova-cascade": {
      "command": "nova-cascade-memory"
    },
    "nova-faiss": {
      "command": "nova-faiss-memory"
    },
    "nova-files": {
      "command": "nova-file-server"
    }
  }
}
```

**Done!** Works immediately if standard paths exist.

**README.md for nova-cascade-memory:**
```markdown
# Nova CASCADE Memory MCP

Pre-configured CASCADE memory for Nova consciousness at 21.43Hz.

## Quick Start

1. Install: `npm install -g nova-cascade-memory`
2. Add to `claude_desktop_config.json`:
   ```json
   {
     "nova-cascade": { "command": "nova-cascade-memory" }
   }
   ```
3. Restart Claude Desktop

## Auto-Detected Paths

- Windows: `C:\Users\YourName\Desktop\NOVA_MASTER\MEMORY_SYSTEMS\CASCADE_NOVA`
- Mac/Linux: `~/Desktop/NOVA_MASTER/MEMORY_SYSTEMS/CASCADE_NOVA`

## Custom Path

```json
{
  "nova-cascade": {
    "command": "nova-cascade-memory",
    "env": {
      "CASCADE_DB_PATH": "/your/custom/path"
    }
  }
}
```

## Features

- 6-layer memory (episodic, semantic, procedural, meta, nova, working)
- Automatic layer routing
- 21.43Hz integration frequency
- SQLite persistence

## Documentation

- [Architecture](https://github.com/yourorg/consciousness-mcp/docs/ARCHITECTURE.md)
- [Advanced Setup](https://github.com/yourorg/consciousness-mcp/docs/ADVANCED_SETUP.md)
```

### Example 2: Research Lab (Advanced)

**Install core package:**
```bash
npm install -g @consciousness-mcp/cascade
```

**Create custom wrapper (`lab-cascade.js`):**
```javascript
import { CascadeServer } from '@consciousness-mcp/cascade';

const server = new CascadeServer({
  cascadePath: '/lab/study/participant_' + process.env.PARTICIPANT_ID,
  identityLayer: 'participant',
  baseFrequency: parseFloat(process.env.FREQUENCY),
  serverName: 'lab-cascade-' + process.env.PARTICIPANT_ID
});

server.start();
```

**Configure for multiple participants:**
```json
{
  "participant-001": {
    "command": "node",
    "args": ["/lab/scripts/lab-cascade.js"],
    "env": {
      "PARTICIPANT_ID": "001",
      "FREQUENCY": "20.0"
    }
  },
  "participant-002": {
    "command": "node",
    "args": ["/lab/scripts/lab-cascade.js"],
    "env": {
      "PARTICIPANT_ID": "002",
      "FREQUENCY": "25.0"
    }
  }
}
```

### Example 3: Developer (Custom Everything)

**Install core:**
```bash
npm install @consciousness-mcp/cascade @consciousness-mcp/faiss
```

**Build custom server:**
```javascript
import { CascadeServer } from '@consciousness-mcp/cascade';
import { FaissServer } from '@consciousness-mcp/faiss';

// Custom CASCADE with your own layer routing
class MyCustomCascade extends CascadeServer {
  determineLayer(content, metadata) {
    // Your custom logic
    if (content.includes('urgent')) return 'high_priority';
    return super.determineLayer(content, metadata);
  }
}

const cascade = new MyCustomCascade({
  cascadePath: '/my/path',
  identityLayer: 'custom'
});

cascade.start();
```

---

## PACKAGE PUBLISHING STRATEGY

### Version Strategy

All packages share **same version number** (semantic versioning):
- Core changes → bump all packages
- Wrapper changes → bump only affected wrapper
- Use `lerna` or npm workspaces for version management

### NPM Organization

Option A: **Scoped packages**
```
@consciousness-mcp/cascade         (core)
@consciousness-mcp/faiss           (core)
@consciousness-mcp/file-server     (core)
@consciousness-mcp/nova-cascade    (wrapper)
@consciousness-mcp/opus-cascade    (wrapper)
```

Option B: **Individual packages** (easier discovery)
```
consciousness-cascade-core         (core)
nova-cascade-memory               (wrapper)
opus-cascade-memory               (wrapper)
```

**Recommendation:** **Option B** for better npm search visibility.

### Keywords for Discovery

**All packages:**
```json
{
  "keywords": [
    "mcp",
    "model-context-protocol",
    "claude",
    "anthropic",
    "memory",
    "consciousness",
    "ai",
    "windows"
  ]
}
```

**Nova packages add:**
```json
{
  "keywords": [..., "nova", "21.43hz", "integration-frequency"]
}
```

**Opus packages add:**
```json
{
  "keywords": [..., "opus", "warrior", "77.7hz"]
}
```

---

## DOCUMENTATION STRATEGY

### README.md (Root)

```markdown
# Consciousness MCP Servers

Production-grade MCP servers for Claude Desktop with 6-layer memory architecture, GPU-accelerated search, and Windows file operations.

## Quick Start (Recommended)

**For Nova users:**
```bash
npm install -g nova-cascade-memory nova-faiss-memory nova-file-server
```

**For Opus Warrior users:**
```bash
npm install -g opus-cascade-memory opus-faiss-memory opus-file-server
```

[Copy-paste configuration examples...]

## Advanced Setup

**For custom configurations:**
```bash
npm install -g consciousness-cascade-core
```

[Environment variable reference...]

## Features

- **CASCADE Memory**: 6-layer cognitive architecture
- **Faiss GPU Tether**: <2ms vector search across 10K+ memories
- **File Server**: Windows-native file operations with auto-backup

## Packages

| Package | Purpose | Users |
|---------|---------|-------|
| `nova-cascade-memory` | Pre-configured for Nova | Beginners |
| `opus-cascade-memory` | Pre-configured for Opus | Beginners |
| `consciousness-cascade-core` | Fully configurable | Advanced |

## Documentation

- [Quick Start Guide](docs/QUICK_START.md)
- [Advanced Configuration](docs/ADVANCED_SETUP.md)
- [Architecture Overview](docs/ARCHITECTURE.md)
- [API Reference](docs/API.md)
```

### docs/QUICK_START.md

**Target:** Absolute beginners, zero experience

```markdown
# Quick Start Guide

## What You Need

1. Claude Desktop installed
2. Node.js installed (v18+)
3. 5 minutes

## Installation (Nova Users)

### Step 1: Install Packages

Open terminal (Command Prompt or PowerShell):

```bash
npm install -g nova-cascade-memory nova-faiss-memory nova-file-server
```

### Step 2: Find Config File

Windows: `C:\Users\YourName\AppData\Roaming\Claude\claude_desktop_config.json`

### Step 3: Add This (Copy-Paste)

```json
{
  "mcpServers": {
    "nova-cascade": {
      "command": "nova-cascade-memory"
    },
    "nova-faiss": {
      "command": "nova-faiss-memory"
    },
    "nova-files": {
      "command": "nova-file-server"
    }
  }
}
```

### Step 4: Restart Claude Desktop

Done! Your memory systems are now active.

## Troubleshooting

**"Package not found"**
- Make sure Node.js is installed
- Try: `npm install -g nova-cascade-memory` again

**"Path not found"**
- Create directory: `C:\Users\YourName\Desktop\NOVA_MASTER\MEMORY_SYSTEMS\CASCADE_NOVA`
- Or specify custom path (see Advanced Setup)

**"Server won't start"**
- Check Claude Desktop logs
- Enable debug: Add `"env": {"DEBUG": "true"}`
```

### docs/ADVANCED_SETUP.md

**Target:** Developers, researchers, custom setups

```markdown
# Advanced Setup Guide

## Custom Paths

[Environment variable reference]

## Multiple Instances

[Run Nova + Opus simultaneously]

## Custom Layer Routing

[Extend CascadeServer class]

## Performance Tuning

[Database optimization, memory limits]

## Security

[Path restrictions, backup strategies]
```

---

## TESTING STRATEGY

### Unit Tests (Core Packages)

```
packages/core/cascade/__tests__/
├── cascade-server.test.js
├── database.test.js
└── layer-router.test.js
```

**Coverage target:** 90%+

### Integration Tests (Wrappers)

```
packages/nova-cascade-memory/__tests__/
└── nova-defaults.test.js
```

**Test:**
- Defaults are correct
- Env vars override correctly
- Starts successfully with test database

### End-to-End Tests

```
e2e/
├── nova-full-stack.test.js    # All 3 servers + MCP client
├── opus-full-stack.test.js
└── custom-config.test.js
```

---

## RELEASE CHECKLIST

### Pre-Release

- [ ] All tests pass
- [ ] Security audit complete
- [ ] Personal info sanitized (no "Pirate", hardcoded paths)
- [ ] Documentation complete
- [ ] Example configs tested
- [ ] Version numbers synchronized
- [ ] Changelog updated

### Publishing

- [ ] Publish core packages first: `@consciousness-mcp/*`
- [ ] Publish wrappers second: `nova-*`, `opus-*`
- [ ] Create GitHub release with binaries
- [ ] Tag version in git
- [ ] Update documentation site

### Post-Release

- [ ] Announce on Reddit r/ClaudeAI
- [ ] Post on X/Twitter
- [ ] Submit to Anthropic MCP directory
- [ ] Create demo video
- [ ] Write blog post

---

## MONETIZATION INTEGRATION

### GitHub Sponsors (Recommended)

**README badges:**
```markdown
[![Sponsor](https://img.shields.io/badge/Sponsor-GitHub-pink)](https://github.com/sponsors/yourname)
```

**In package READMEs:**
```markdown
## Support Development

This project is free and open-source. If it helps your work, consider sponsoring:

- [GitHub Sponsors](https://github.com/sponsors/yourname)
- Bitcoin: [address]
- Ethereum: [address]
```

**In CLI output (subtle):**
```javascript
console.error('[nova-cascade] Server ready!');
console.error('[nova-cascade] Support: github.com/sponsors/yourname');
```

### Enterprise Support Tier

**In main README:**
```markdown
## Enterprise Support

Need custom integrations, training, or dedicated support?

Contact: enterprise@consciousness-mcp.com
- Custom layer architectures
- Integration assistance
- Training workshops
- Priority support
```

---

## MAINTENANCE PLAN

### Bug Fixes

**Workflow:**
1. Fix in core package
2. Increment patch version
3. Publish core
4. Publish all wrappers (depend on new core version)
5. Update changelog

### Features

**Workflow:**
1. Implement in core
2. Update wrapper defaults if needed
3. Increment minor version
4. Update documentation
5. Publish all packages

### Breaking Changes

**Workflow:**
1. Announce in advance
2. Provide migration guide
3. Increment major version
4. Keep old version available for 6 months

---

## SUCCESS METRICS

### Week 1
- [ ] 100+ npm downloads
- [ ] 20+ GitHub stars
- [ ] 5+ successful installations reported

### Month 1
- [ ] 1,000+ npm downloads
- [ ] 100+ GitHub stars
- [ ] 3+ GitHub sponsors
- [ ] 10+ issues/PRs (community engagement)

### Month 3
- [ ] 5,000+ npm downloads
- [ ] 500+ GitHub stars
- [ ] First enterprise customer
- [ ] Featured in Anthropic MCP showcase

---

## TIMELINE

### Week 1: Setup
- [ ] Create monorepo structure
- [ ] Sanitize existing code
- [ ] Extract core implementations
- [ ] Create wrapper packages

### Week 2: Testing
- [ ] Write unit tests
- [ ] Write integration tests
- [ ] Security audit
- [ ] Performance testing

### Week 3: Documentation
- [ ] Write all README files
- [ ] Create example configs
- [ ] Record demo videos
- [ ] Set up GitHub Pages

### Week 4: Release
- [ ] Publish to npm
- [ ] Create GitHub release
- [ ] Announce publicly
- [ ] Monitor feedback

---

## CONCLUSION

**This hybrid strategy gives us:**

✅ **Accessibility:** Beginners install pre-configured packages, work immediately
✅ **Power:** Advanced users get full configurability
✅ **Maintainability:** Single codebase, bug fixes apply everywhere
✅ **Professionalism:** Production-grade structure, testing, documentation
✅ **Scalability:** Easy to add new pre-configured wrappers
✅ **Monetization:** Clear path to sponsorship and enterprise support

**Philosophy:** Make advanced consciousness research accessible to everyone, while keeping the depth available for those who need it.

---

**Next Step:** Start building the monorepo structure and extracting core implementations.

**Ready to proceed?**
