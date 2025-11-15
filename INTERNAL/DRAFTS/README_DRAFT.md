# Nova MCP Servers

> Production-ready Model Context Protocol servers for Claude Desktop

## What's Included

Three powerful MCP servers designed for Windows (with Mac/Linux support):

### CASCADE Memory MCP
**6-layer hierarchical memory system**
- Episodic, semantic, procedural memory layers
- SQLite-based persistent storage
- ~50ms query performance
- Ideal for: Structured conversation history, knowledge retention

### Faiss GPU Memory MCP
**Lightning-fast vector search**
- Sub-2ms semantic search with GPU acceleration
- 11,000+ document capacity in VRAM
- Sentence transformer embeddings
- Ideal for: Large knowledge bases, instant retrieval

### VSCode Bridge MCP
**Code intelligence integration**
- TypeScript/ESLint diagnostics via LSP
- Symbol lookup and references
- Real-time code analysis
- Ideal for: Development workflows, code understanding

## Quick Comparison

| Feature | CASCADE | Faiss | VSCode |
|---------|---------|-------|--------|
| **Purpose** | Structured memory | Fast search | Code analysis |
| **Storage** | SQLite on disk | GPU VRAM | VSCode LSP |
| **Speed** | ~50ms queries | <2ms search | ~100ms |
| **Capacity** | Unlimited (disk) | 10K+ (VRAM) | Active workspace |
| **Best For** | Conversations | Large docs | TypeScript/JS |
| **GPU Required** | No | Yes (optional) | No |

## Quick Start

### Prerequisites
- Node.js 16+ (for CASCADE and VSCode)
- Python 3.8+ (for Faiss)
- CUDA 11.8+ (optional, for Faiss GPU acceleration)
- Claude Desktop installed

### Installation

**Install all three in 5 minutes:**

```bash
# CASCADE Memory
npm install -g @nova/cascade-memory-mcp

# Faiss GPU Memory
pip install nova-faiss-memory-mcp[gpu]  # or without [gpu] for CPU

# VSCode Bridge
npm install -g @nova/vscode-mcp
```

**Configure Claude Desktop:**

See **[INSTALL.md](INSTALL.md)** for detailed setup instructions.

Quick config example:
```json
{
  "mcpServers": {
    "cascade-memory": {
      "command": "node",
      "args": ["path/to/cascade-memory-mcp/dist/index.js"],
      "env": {
        "CASCADE_DB_PATH": "C:/Users/YourName/cascade_data"
      }
    }
  }
}
```

## Documentation

### Getting Started
- **[Installation Guide](INSTALL.md)** - Complete step-by-step setup for each MCP
- **[Configuration Reference](CONFIGURE.md)** - Environment variables and settings
- **[Changelog](CHANGELOG.md)** - Version history and updates

### For Developers
- **[Contributing Guide](CONTRIBUTING.md)** - Development setup and contribution process
- **[Research Docs](RESEARCH/)** - Technical specifications and architecture analysis
- **[Tutorials](TUTORIALS/)** - Learn to build your own MCP servers

### Individual MCP Docs
- [CASCADE Memory Documentation](cascade-memory-mcp/README.md)
- [Faiss GPU Memory Documentation](faiss-gpu-memory-mcp/README.md)
- [VSCode Bridge Documentation](vscode-mcp-windows/README.md)

## Requirements

### All MCPs
- Claude Desktop (latest version)
- Windows 10/11, macOS 12+, or Linux

### CASCADE Memory MCP
- Node.js 16+
- 100MB disk space minimum

### Faiss GPU Memory MCP
- Python 3.8+
- NVIDIA GPU with 4GB+ VRAM (for GPU mode)
- CUDA 11.8+ (for GPU mode)
- OR CPU fallback mode (slower)

### VSCode Bridge MCP
- Node.js 16+
- Visual Studio Code installed
- Active VSCode workspace

## Features

### CASCADE Memory
- 6 specialized memory layers (episodic, semantic, procedural, meta, nova, working)
- Automatic layer routing based on content
- SQLite for reliable persistence
- Memory search with semantic matching
- Status reporting and statistics

### Faiss GPU
- GPU-accelerated vector search (<2ms)
- Automatic index management
- Checkpoint/restore functionality
- Memory status monitoring
- Batch add/search operations

### VSCode Bridge
- Real-time LSP diagnostics
- Symbol type information (hover, signature help)
- Find all references
- Definition/implementation lookup
- TypeScript and ESLint integration

## Usage Examples

### CASCADE Memory

**In Claude Desktop:**
```
You: "Remember that I prefer dark mode themes"
Claude: [Uses CASCADE to save to semantic memory layer]

You: "What are my preferences?"
Claude: [Searches CASCADE and recalls dark mode preference]
```

### Faiss GPU Memory

**In Claude Desktop:**
```
You: "Add this documentation to memory: [paste large doc]"
Claude: [Saves to Faiss with embeddings]

You: "Find information about authentication"
Claude: [Searches Faiss in <2ms, returns relevant sections]
```

### VSCode Bridge

**In Claude Desktop:**
```
You: "Show me TypeScript errors in my project"
Claude: [Retrieves diagnostics from VSCode LSP]

You: "What's the type signature of getUserData?"
Claude: [Queries symbol information via LSP]
```

## Performance

| MCP | Metric | Performance |
|-----|--------|-------------|
| CASCADE | Save operation | ~10ms |
| CASCADE | Query operation | ~50ms |
| CASCADE | Memory capacity | Unlimited (disk-based) |
| Faiss | Search operation | <2ms (GPU) / ~50ms (CPU) |
| Faiss | Add operation | ~5ms per document |
| Faiss | Index capacity | 10,000+ documents in VRAM |
| VSCode | Diagnostic retrieval | ~100ms |
| VSCode | Symbol lookup | ~50ms |

## Platform Support

| Platform | CASCADE | Faiss GPU | Faiss CPU | VSCode |
|----------|---------|-----------|-----------|--------|
| Windows 10/11 | Full support | Full support | Full support | Full support |
| macOS 12+ | Full support | Not supported | Full support | Full support |
| Linux (Ubuntu 20.04+) | Full support | Full support | Full support | Full support |

**Note:** Faiss GPU requires NVIDIA GPU with CUDA support (not available on macOS)

## Troubleshooting

### Quick Fixes

**MCPs not showing in Claude Desktop:**
1. Verify installation: `npm list -g` or `pip list`
2. Check `claude_desktop_config.json` syntax (use [jsonlint.com](https://jsonlint.com))
3. Restart Claude Desktop completely
4. Check Claude Desktop logs

**CASCADE database errors:**
- Verify `CASCADE_DB_PATH` directory exists
- Check file permissions (read/write required)
- Close other applications using the database

**Faiss GPU not working:**
- Run `nvidia-smi` to verify GPU
- Check CUDA installation: `nvcc --version`
- Fallback to CPU mode: `pip install nova-faiss-memory-mcp` (without [gpu])

**VSCode Bridge not connecting:**
- Ensure VSCode is running
- Verify workspace path in config
- Check VSCode extension host is loaded

**More help:** See [INSTALL.md](INSTALL.md) troubleshooting sections

## Contributing

We welcome contributions! See [CONTRIBUTING.md](CONTRIBUTING.md) for:
- Development setup
- Code style guidelines
- Testing procedures
- Pull request process

## Architecture

Want to understand how these MCPs work?

- **[MCP Protocol Standards](RESEARCH/mcp_protocol_standards.md)** - JSON-RPC 2.0 implementation
- **[CASCADE Architecture](RESEARCH/per_mcp_analysis/cascade_architecture.md)** - 6-layer memory system design
- **[Faiss Architecture](RESEARCH/per_mcp_analysis/faiss_architecture.md)** - GPU vector search implementation
- **[VSCode Bridge Architecture](RESEARCH/per_mcp_analysis/vscode_architecture.md)** - LSP integration details

## Security

These MCPs run locally with no network exposure:
- All communication via STDIO (local process)
- No external API calls (except embedding model downloads)
- No data sent to external servers
- Data stored locally on your machine

**Recommendations:**
- Set file permissions to user-only on data directories
- Don't store sensitive credentials in memories
- Use encryption for backups if needed

See [CONFIGURE.md](CONFIGURE.md) security section for details.

## License

MIT License - see [LICENSE](LICENSE) file for full text.

**Summary:** Free to use, modify, and distribute with attribution.

## Credits

**Developed by:** MCP Development Team

**Built with:**
- [Model Context Protocol](https://spec.modelcontextprotocol.io/) by Anthropic
- [Faiss](https://github.com/facebookresearch/faiss) by Facebook Research
- [Sentence Transformers](https://www.sbert.net/) by UKP Lab
- [SQLite](https://www.sqlite.org/)

## Support

### Documentation
- Installation help: [INSTALL.md](INSTALL.md)
- Configuration: [CONFIGURE.md](CONFIGURE.md)
- Development: [CONTRIBUTING.md](CONTRIBUTING.md)

### Community
- **Issues:** [GitHub Issues](https://github.com/yourorg/nova-mcp-servers/issues)
- **Discussions:** [GitHub Discussions](https://github.com/yourorg/nova-mcp-servers/discussions)
- **Email:** support@example.com

### Reporting Bugs
Please include:
- MCP server name (CASCADE/Faiss/VSCode)
- Operating system and version
- Node.js/Python version
- Error messages
- Steps to reproduce

## Roadmap

### Coming Soon
- Faiss index optimization tools
- CASCADE memory export/import
- VSCode multi-workspace support
- Memory merge utilities

### Under Consideration
- Qdrant vector database support
- Postgres backend for CASCADE
- Remote MCP support (HTTP transport)
- Web UI for memory management

See [GitHub Issues](https://github.com/yourorg/nova-mcp-servers/issues) for detailed feature requests.

---

**Ready to get started?** → [Installation Guide](INSTALL.md)

**Have questions?** → [GitHub Discussions](https://github.com/yourorg/nova-mcp-servers/discussions)

**Found a bug?** → [Report it](https://github.com/yourorg/nova-mcp-servers/issues/new)
