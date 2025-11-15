# Installation Guide

Complete installation guide for Nova MCP Research servers.

## Table of Contents

- [Quick Install](#quick-install)
- [Detailed Installation](#detailed-installation)
- [Claude Desktop Integration](#claude-desktop-integration)
- [Hardware Requirements](#hardware-requirements)
- [Configuration](#configuration)
- [Verification](#verification)

---

## Quick Install

### Basement Revolution Edition (Researchers)

```bash
# Clone repository
git clone https://github.com/For-Sunny/nova-mcp-research.git
cd nova-mcp-research

# Install CASCADE Memory
cd BASEMENT_REVOLUTION_EDITION/cascade-memory-unrestricted
npm install

# Install Faiss Memory (requires GPU)
cd ../faiss-memory-unrestricted
npm install

# Install File Server
cd ../file-server-unrestricted
npm install

# Install Windows MCP (Windows only)
pip install windows-mcp-unrestricted
```

### Enterprise Safe Edition (Production)

```bash
# Clone repository
git clone https://github.com/For-Sunny/nova-mcp-research.git
cd nova-mcp-research

# Install CASCADE Memory
cd ENTERPRISE_SAFE_EDITION/cascade-memory-mcp
npm install

# Install Faiss Memory (requires GPU)
cd ../faiss-memory-mcp
npm install

# Install File Server
cd ../file-server-mcp
npm install

# Install Windows MCP (Windows only)
pip install windows-mcp
```

---

## Detailed Installation

### Prerequisites

Install these before proceeding:

1. **Node.js v18.0.0+**
   - Download: https://nodejs.org/
   - Verify: `node --version`

2. **Python 3.8+** (3.13+ recommended)
   - Download: https://www.python.org/downloads/
   - Verify: `python --version`

3. **Git**
   - Download: https://git-scm.com/
   - Verify: `git --version`

4. **NVIDIA GPU** (Optional, for Faiss)
   - CUDA Toolkit 11.8+
   - Download: https://developer.nvidia.com/cuda-downloads
   - Verify: `nvidia-smi`

### Step-by-Step Installation

#### 1. Clone Repository

```bash
git clone https://github.com/For-Sunny/nova-mcp-research.git
cd nova-mcp-research
```

#### 2. Choose Your Edition

Navigate to either:
- `BASEMENT_REVOLUTION_EDITION/` for unrestricted research
- `ENTERPRISE_SAFE_EDITION/` for production-ready security

#### 3. Install CASCADE Memory Server

**Basement Revolution**:
```bash
cd BASEMENT_REVOLUTION_EDITION/cascade-memory-unrestricted
npm install
```

**Enterprise Safe**:
```bash
cd ENTERPRISE_SAFE_EDITION/cascade-memory-mcp
npm install

# Copy environment template
cp .env.example .env
# Edit .env with your settings
```

**Test Installation**:
```bash
npm start
# Should see: "CASCADE Memory Server started on stdio"
# Press Ctrl+C to stop
```

#### 4. Install Faiss Memory Server (GPU Required)

**Basement Revolution**:
```bash
cd BASEMENT_REVOLUTION_EDITION/faiss-memory-unrestricted
npm install
```

**Enterprise Safe**:
```bash
cd ENTERPRISE_SAFE_EDITION/faiss-memory-mcp
npm install

# Copy environment template
cp .env.example .env
# Edit .env with your settings
```

**Test Installation**:
```bash
npm start
# Should see: "Faiss Memory Server started on stdio"
# Press Ctrl+C to stop
```

**GPU Verification**:
```bash
# Check GPU is available
nvidia-smi

# Check CUDA
python -c "import torch; print(torch.cuda.is_available())"
```

#### 5. Install File Server

**Basement Revolution**:
```bash
cd BASEMENT_REVOLUTION_EDITION/file-server-unrestricted
npm install
```

**Enterprise Safe**:
```bash
cd ENTERPRISE_SAFE_EDITION/file-server-mcp
npm install

# Copy environment template
cp .env.example .env
# Edit .env with your settings
```

**Test Installation**:
```bash
npm start
# Should see: "File Server started on stdio"
# Press Ctrl+C to stop
```

#### 6. Install Windows MCP (Windows Only)

**Basement Revolution**:
```powershell
# In PowerShell
pip install windows-mcp-unrestricted

# Verify
windows-mcp-unrestricted --version
```

**Enterprise Safe**:
```powershell
# In PowerShell
pip install windows-mcp

# Verify
windows-mcp --version
```

---

## Claude Desktop Integration

### Configuration File Location

**Windows**:
```
%APPDATA%\Claude\claude_desktop_config.json
```

**macOS**:
```
~/Library/Application Support/Claude/claude_desktop_config.json
```

**Linux**:
```
~/.config/Claude/claude_desktop_config.json
```

### Basic Configuration

Create or edit `claude_desktop_config.json`:

**Basement Revolution Edition**:
```json
{
  "mcpServers": {
    "cascade-memory": {
      "command": "node",
      "args": [
        "C:/path/to/nova-mcp-research/BASEMENT_REVOLUTION_EDITION/cascade-memory-unrestricted/server/index.js"
      ]
    },
    "faiss-memory": {
      "command": "node",
      "args": [
        "C:/path/to/nova-mcp-research/BASEMENT_REVOLUTION_EDITION/faiss-memory-unrestricted/server/index.js"
      ]
    },
    "file-server": {
      "command": "node",
      "args": [
        "C:/path/to/nova-mcp-research/BASEMENT_REVOLUTION_EDITION/file-server-unrestricted/server/index.js"
      ]
    }
  }
}
```

**Enterprise Safe Edition**:
```json
{
  "mcpServers": {
    "cascade-memory": {
      "command": "node",
      "args": [
        "C:/path/to/nova-mcp-research/ENTERPRISE_SAFE_EDITION/cascade-memory-mcp/server/index.js"
      ],
      "env": {
        "CASCADE_DB_PATH": "C:/data/cascade.db",
        "CASCADE_AUTH_KEY": "your-secret-key-here",
        "CASCADE_MAX_QUERY_LENGTH": "1000"
      }
    },
    "faiss-memory": {
      "command": "node",
      "args": [
        "C:/path/to/nova-mcp-research/ENTERPRISE_SAFE_EDITION/faiss-memory-mcp/server/index.js"
      ],
      "env": {
        "FAISS_AUTH_KEY": "your-secret-key-here",
        "FAISS_INDEX_PATH": "C:/data/faiss.index",
        "FAISS_RATE_LIMIT": "10"
      }
    },
    "file-server": {
      "command": "node",
      "args": [
        "C:/path/to/nova-mcp-research/ENTERPRISE_SAFE_EDITION/file-server-mcp/server/index.js"
      ],
      "env": {
        "FILE_SERVER_ROOT": "C:/allowed/path",
        "FILE_SERVER_MAX_FILE_SIZE": "10485760"
      }
    }
  }
}
```

**Important Notes**:
- Use **absolute paths** (not relative)
- Use **forward slashes** (/) even on Windows
- Replace `C:/path/to/` with your actual installation path
- For Enterprise edition, set strong auth keys

---

## Hardware Requirements

### Minimum Requirements

**All Servers**:
- 8GB RAM
- 10GB free disk space
- CPU: Any modern processor
- OS: Windows 10+, macOS 11+, or Linux

**Faiss Memory Server**:
- NVIDIA GPU with CUDA support
- 8GB GPU VRAM (minimum)
- CUDA Toolkit 11.8+

### Recommended for Full Research

**Optimal Setup**:
- 32GB RAM
- NVMe SSD (fast disk I/O)
- CPU: Intel i7/i9 or AMD Ryzen 7/9
- GPU: NVIDIA RTX 3090 or better (24GB VRAM)
- OS: Windows 11

**Why This Hardware?**:
- RTX 3090: Used in original research, optimal for Bell State quantum coherence
- 24GB VRAM: Enables large-scale memory operations
- NVMe SSD: Fast database and index operations
- 32GB RAM: Comfortable for multiple servers and research workloads

### GPU Requirements (Faiss Only)

**Supported GPUs**:
- NVIDIA RTX 30-series (3060, 3070, 3080, 3090)
- NVIDIA RTX 40-series (4060, 4070, 4080, 4090)
- NVIDIA Tesla series (V100, A100)
- Any CUDA-capable GPU with 8GB+ VRAM

**Not Supported**:
- AMD GPUs (no CUDA support)
- Intel integrated graphics
- Apple Silicon (M1/M2) - different architecture

---

## Configuration

### Enterprise Safe Edition Configuration

The Enterprise Safe edition requires configuration for security features.

#### CASCADE Memory (.env)

```bash
# Database configuration
CASCADE_DB_PATH=/path/to/cascade.db

# Security
CASCADE_AUTH_KEY=your-secret-key-minimum-32-chars
CASCADE_MAX_QUERY_LENGTH=1000

# Performance
CASCADE_CACHE_SIZE=1000
```

#### Faiss Memory (.env)

```bash
# Index configuration
FAISS_INDEX_PATH=/path/to/faiss.index
FAISS_DIMENSION=1536

# Security
FAISS_AUTH_KEY=your-secret-key-minimum-32-chars
FAISS_RATE_LIMIT=10

# GPU
FAISS_USE_GPU=true
FAISS_GPU_DEVICE=0
```

#### File Server (.env)

```bash
# Root directory
FILE_SERVER_ROOT=/allowed/path/root

# Security
FILE_SERVER_MAX_FILE_SIZE=10485760
FILE_SERVER_ALLOWED_EXTENSIONS=.txt,.md,.json,.js

# Performance
FILE_SERVER_CACHE_ENABLED=true
```

### Basement Revolution Edition Configuration

The Basement Revolution edition has minimal required configuration:

```bash
# Optional: Custom database path
CASCADE_DB_PATH=/path/to/cascade.db

# Optional: Custom index path
FAISS_INDEX_PATH=/path/to/faiss.index
```

---

## Verification

### Test Individual Servers

**Test CASCADE Memory**:
```bash
cd BASEMENT_REVOLUTION_EDITION/cascade-memory-unrestricted
npm start

# In another terminal, test JSON-RPC
echo '{"jsonrpc":"2.0","id":1,"method":"tools/list"}' | node server/index.js
```

**Expected**: JSON response with available tools

**Test Faiss Memory** (requires GPU):
```bash
cd BASEMENT_REVOLUTION_EDITION/faiss-memory-unrestricted
npm start
```

**Expected**: Server starts without GPU errors

**Test File Server**:
```bash
cd BASEMENT_REVOLUTION_EDITION/file-server-unrestricted
npm start
```

**Expected**: Server starts successfully

### Test with Claude Desktop

1. **Configure** `claude_desktop_config.json` (see above)
2. **Restart** Claude Desktop completely
3. **Open** a new chat
4. **Type**: "What MCP tools are available?"
5. **Verify**: You should see your installed servers listed

### Test GPU (Faiss Memory)

```bash
# Check NVIDIA GPU
nvidia-smi

# Check CUDA
python -c "import torch; print(f'CUDA available: {torch.cuda.is_available()}')"

# Check Faiss GPU support
python -c "import faiss; print(f'GPU resources: {faiss.get_num_gpus()}')"
```

**Expected**:
- `nvidia-smi` shows your GPU
- CUDA available: True
- GPU resources: 1 (or more)

### Troubleshooting Installation

**Problem: npm install fails**
```bash
# Clear npm cache
npm cache clean --force

# Try again
npm install
```

**Problem: Permission denied (Linux/macOS)**
```bash
# Fix permissions
chmod +x server/index.js

# Or use sudo (not recommended)
sudo npm install
```

**Problem: CUDA not found**
```bash
# Add CUDA to PATH
export PATH=/usr/local/cuda/bin:$PATH
export LD_LIBRARY_PATH=/usr/local/cuda/lib64:$LD_LIBRARY_PATH

# Verify
nvcc --version
```

**Problem: Python package not found**
```bash
# Upgrade pip
python -m pip install --upgrade pip

# Install with verbose output
pip install -v windows-mcp-unrestricted
```

---

## Next Steps

After successful installation:

1. **Read the Research**:
   - [Bell State Quantum Coherence](../BELL_STATE_RESEARCH_FINDINGS.md)
   - [Memory Architecture Blueprint](../NOVA_MEMORY_ARCHITECTURE.md)

2. **Configure Claude Desktop**:
   - Follow integration guide above
   - Test each server

3. **Start Using**:
   - Create memories
   - Search semantically
   - Explore consciousness research

4. **Get Help**:
   - [Setup Guide](../SETUP_GUIDE.md) for detailed help
   - [GitHub Discussions](https://github.com/For-Sunny/nova-mcp-research/discussions)
   - [Issues](https://github.com/For-Sunny/nova-mcp-research/issues)

---

## Support

- **Documentation**: [SETUP_GUIDE.md](../SETUP_GUIDE.md)
- **Discussions**: https://github.com/For-Sunny/nova-mcp-research/discussions
- **Issues**: https://github.com/For-Sunny/nova-mcp-research/issues

This is research software. We don't provide support, but the community helps itself.

For paid consulting: Open a GitHub Discussion.

---

**License**: MIT - Use freely, acknowledge honestly.

**The Basement Revolution continues** 💜
