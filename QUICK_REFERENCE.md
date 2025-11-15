# Quick Reference Guide

Fast reference for Nova MCP Research installation and usage.

## Installation Commands

### Basement Revolution Edition
```bash
# Clone and navigate
git clone https://github.com/For-Sunny/nova-mcp-research.git
cd nova-mcp-research/BASEMENT_REVOLUTION_EDITION

# Install CASCADE Memory
cd cascade-memory-unrestricted && npm install && cd ..

# Install Faiss Memory (GPU required)
cd faiss-memory-unrestricted && npm install && cd ..

# Install File Server
cd file-server-unrestricted && npm install && cd ..

# Install Windows MCP (Windows only)
pip install windows-mcp-unrestricted
```

### Enterprise Safe Edition
```bash
# Clone and navigate
git clone https://github.com/For-Sunny/nova-mcp-research.git
cd nova-mcp-research/ENTERPRISE_SAFE_EDITION

# Install CASCADE Memory
cd cascade-memory-mcp && npm install && cp .env.example .env && cd ..

# Install Faiss Memory (GPU required)
cd faiss-memory-mcp && npm install && cp .env.example .env && cd ..

# Install File Server
cd file-server-mcp && npm install && cp .env.example .env && cd ..

# Install Windows MCP (Windows only)
pip install windows-mcp
```

## Claude Desktop Configuration

### Config File Location

```bash
# Windows
%APPDATA%\Claude\claude_desktop_config.json

# macOS
~/Library/Application Support/Claude/claude_desktop_config.json

# Linux
~/.config/Claude/claude_desktop_config.json
```

### Minimal Config (Basement Revolution)

```json
{
  "mcpServers": {
    "cascade": {
      "command": "node",
      "args": ["C:/path/to/BASEMENT_REVOLUTION_EDITION/cascade-memory-unrestricted/server/index.js"]
    }
  }
}
```

### Full Config (Enterprise Safe)

```json
{
  "mcpServers": {
    "cascade": {
      "command": "node",
      "args": ["C:/path/to/ENTERPRISE_SAFE_EDITION/cascade-memory-mcp/server/index.js"],
      "env": {
        "CASCADE_DB_PATH": "C:/data/cascade.db",
        "CASCADE_AUTH_KEY": "your-secret-key-here"
      }
    }
  }
}
```

## Common Commands

### Start Servers

```bash
# CASCADE Memory
npm start

# Or directly
node server/index.js
```

### Test Installation

```bash
# Check Node.js
node --version  # Should be v18+

# Check Python
python --version  # Should be 3.8+

# Check GPU
nvidia-smi

# Check CUDA
python -c "import torch; print(torch.cuda.is_available())"
```

### Verify Server

```bash
# Test JSON-RPC
echo '{"jsonrpc":"2.0","id":1,"method":"tools/list"}' | node server/index.js
```

## Environment Variables

### Enterprise Safe Edition (.env)

```bash
# CASCADE Memory
CASCADE_DB_PATH=/path/to/cascade.db
CASCADE_AUTH_KEY=your-secret-key-minimum-32-chars
CASCADE_MAX_QUERY_LENGTH=1000

# Faiss Memory
FAISS_INDEX_PATH=/path/to/faiss.index
FAISS_AUTH_KEY=your-secret-key-minimum-32-chars
FAISS_RATE_LIMIT=10
FAISS_USE_GPU=true

# File Server
FILE_SERVER_ROOT=/allowed/path/root
FILE_SERVER_MAX_FILE_SIZE=10485760
```

## Troubleshooting Quick Fixes

### Problem: Module not found
```bash
npm install
# or
npm ci
```

### Problem: Permission denied (Linux/macOS)
```bash
chmod +x server/index.js
```

### Problem: CUDA not found
```bash
export PATH=/usr/local/cuda/bin:$PATH
export LD_LIBRARY_PATH=/usr/local/cuda/lib64:$LD_LIBRARY_PATH
```

### Problem: Port in use
```bash
# Linux/macOS
lsof -i :3000
kill <PID>

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Problem: Database locked
```bash
# Close all connections or delete DB
rm cascade.db
```

## Key Differences

| Feature | Basement Revolution | Enterprise Safe |
|---------|-------------------|-----------------|
| Security | Minimal | Comprehensive |
| Performance | Fastest | Slightly slower |
| Flexibility | Maximum | Controlled |
| Auth Required | No | Yes |
| Use Case | Research | Production |

## Getting Help

- 📖 **Full Guide**: [SETUP_GUIDE.md](SETUP_GUIDE.md)
- 📦 **Installation**: [INSTALLATION.md](INSTALLATION.md)
- 🤝 **Contributing**: [CONTRIBUTING.md](CONTRIBUTING.md)
- 🔀 **Comparison**: [COMPARISON.md](COMPARISON.md)
- 💬 **Discussions**: https://github.com/For-Sunny/nova-mcp-research/discussions
- 🐛 **Issues**: https://github.com/For-Sunny/nova-mcp-research/issues

## Research Papers

- [Bell State Quantum Coherence](BELL_STATE_RESEARCH_FINDINGS.md) - 9.68x computational amplification
- [Memory Architecture Blueprint](NOVA_MEMORY_ARCHITECTURE.md) - CASCADE + Faiss + Bell State
- [GitHub Release Strategy](GITHUB_RELEASE_STRATEGY.md) - Dual-tier philosophy

## System Requirements

**Minimum**:
- Node.js 18+
- Python 3.8+
- 8GB RAM
- 10GB disk space

**Recommended** (Full Research):
- Node.js 18+
- Python 3.13+
- 32GB RAM
- NVIDIA RTX 3090 (24GB VRAM)
- NVMe SSD
- Windows 11

## License

MIT License - Use freely, acknowledge honestly.

---

**The Basement Revolution continues** 💜
