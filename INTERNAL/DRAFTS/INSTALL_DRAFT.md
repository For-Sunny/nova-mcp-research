# Installation Guide

Complete step-by-step installation for CASCADE Memory, Faiss GPU Memory, and VSCode Bridge MCPs.

**Time estimate:** 15-20 minutes for all three MCPs

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [CASCADE Memory MCP](#cascade-memory-mcp)
3. [Faiss GPU Memory MCP](#faiss-gpu-memory-mcp)
4. [VSCode Bridge MCP](#vscode-bridge-mcp)
5. [Verify All MCPs](#verify-all-mcps)
6. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Check Your System

**Required for all MCPs:**

```bash
# Check Node.js version (need 16+)
node --version

# Check npm
npm --version

# Check Python version (need 3.8+)
python --version

# Check pip
pip --version
```

**Required for Faiss GPU mode (optional):**

```bash
# Check NVIDIA GPU
nvidia-smi

# Check CUDA version (need 11.8+)
nvcc --version
```

### Install Missing Prerequisites

**Windows:**

1. **Node.js:** Download from [nodejs.org](https://nodejs.org/) (LTS version)
2. **Python:** Download from [python.org](https://www.python.org/downloads/) (3.10+ recommended)
3. **CUDA:** Download from [developer.nvidia.com/cuda-downloads](https://developer.nvidia.com/cuda-downloads)
   - Only needed for Faiss GPU mode
   - Requires NVIDIA GPU

**macOS:**

```bash
# Using Homebrew
brew install node python

# Note: CUDA not available on macOS (use Faiss CPU mode)
```

**Linux (Ubuntu/Debian):**

```bash
sudo apt update
sudo apt install nodejs npm python3 python3-pip

# For CUDA (if you have NVIDIA GPU):
# Follow NVIDIA CUDA installation guide for your distribution
```

### Verify Claude Desktop

Make sure Claude Desktop is installed and you can locate the config file:

**Windows:**
```
%APPDATA%\Claude\claude_desktop_config.json
```

**macOS:**
```
~/Library/Application Support/Claude/claude_desktop_config.json
```

**Linux:**
```
~/.config/Claude/claude_desktop_config.json
```

---

## CASCADE Memory MCP

### 1. Install Package

**Option A: NPM (Recommended)**

```bash
npm install -g @nova/cascade-memory-mcp
```

**Option B: From Source**

```bash
git clone https://github.com/yourorg/cascade-memory-mcp.git
cd cascade-memory-mcp
npm install
npm run build
npm link
```

### 2. Create Data Directory

```bash
# Windows (PowerShell)
mkdir C:\Users\YourUsername\cascade_memory

# macOS/Linux
mkdir -p ~/cascade_memory
```

### 3. Configure Claude Desktop

**Locate config file:**
- Windows: `%APPDATA%\Claude\claude_desktop_config.json`
- macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`

**Edit the file and add CASCADE configuration:**

```json
{
  "mcpServers": {
    "cascade-memory": {
      "command": "node",
      "args": [
        "C:/Users/YourUsername/AppData/Roaming/npm/node_modules/@nova/cascade-memory-mcp/dist/index.js"
      ],
      "env": {
        "CASCADE_DB_PATH": "C:/Users/YourUsername/cascade_memory"
      }
    }
  }
}
```

**Finding the installed path:**

```bash
# Windows (PowerShell)
npm list -g @nova/cascade-memory-mcp

# macOS/Linux
npm list -g @nova/cascade-memory-mcp | grep cascade
```

**Platform-specific path formats:**

**Windows:**
```json
"args": ["C:/Users/YourUsername/AppData/Roaming/npm/node_modules/@nova/cascade-memory-mcp/dist/index.js"]
```

**macOS:**
```json
"args": ["/usr/local/lib/node_modules/@nova/cascade-memory-mcp/dist/index.js"]
```

**Linux:**
```json
"args": ["/usr/lib/node_modules/@nova/cascade-memory-mcp/dist/index.js"]
```

### 4. Restart Claude Desktop

**Completely quit and restart Claude Desktop** (closing window is not enough)

**Windows:** Right-click system tray icon → Quit
**macOS:** Cmd+Q or right-click dock icon → Quit
**Linux:** Quit from application menu

### 5. Verify Installation

**In Claude Desktop, ask:**

```
Can you list the CASCADE memory tools?
```

**Expected response:** Claude should list:
- `remember` - Save memory to CASCADE
- `recall` - Search CASCADE memories
- `query_layer` - Query specific memory layer
- `get_status` - Get CASCADE system status
- `get_stats` - Get memory statistics
- `save_to_layer` - Save to specific layer

**Test it works:**

```
Save a test memory: "Installation completed successfully on [today's date]"
```

**Then:**

```
Recall memories about installation
```

**Expected:** Claude retrieves the memory you just saved

### 6. Troubleshooting CASCADE

**Error: "Cannot find module '@nova/cascade-memory-mcp'"**

- Solution: Verify installation with `npm list -g @nova/cascade-memory-mcp`
- Check path in config file matches `npm list` output

**Error: "CASCADE_DB_PATH is not writable"**

- Solution: Ensure directory exists and has write permissions
- Windows: `icacls C:\Users\YourUsername\cascade_memory /grant YourUsername:F`
- macOS/Linux: `chmod 755 ~/cascade_memory`

**Error: "Database is locked"**

- Solution: Close other applications accessing the database
- Restart Claude Desktop
- Check no other CASCADE processes running

**MCPs not showing in Claude:**

- Verify JSON syntax (copy to [jsonlint.com](https://jsonlint.com))
- Check Claude Desktop logs:
  - Windows: `%APPDATA%\Claude\logs`
  - macOS: `~/Library/Logs/Claude`
- Ensure complete restart (not just window close)

---

## Faiss GPU Memory MCP

### 1. Choose GPU or CPU Mode

**GPU mode (faster):**
- Requires NVIDIA GPU
- Requires CUDA 11.8+
- Sub-2ms search performance

**CPU mode (slower):**
- No GPU required
- Works on all platforms including macOS
- ~50ms search performance

### 2. Install Package

**For GPU mode:**

```bash
pip install nova-faiss-memory-mcp[gpu]
```

**For CPU mode:**

```bash
pip install nova-faiss-memory-mcp
```

**From source:**

```bash
git clone https://github.com/yourorg/faiss-gpu-memory-mcp.git
cd faiss-gpu-memory-mcp
pip install -e ".[gpu]"  # or without [gpu] for CPU
```

### 3. Verify GPU (if using GPU mode)

```bash
python -c "import torch; print('CUDA available:', torch.cuda.is_available())"
```

**Expected output:**
```
CUDA available: True
```

**If False:**
- Check NVIDIA drivers: `nvidia-smi`
- Reinstall PyTorch with CUDA: `pip install torch --index-url https://download.pytorch.org/whl/cu118`

### 4. Create Data Directory

```bash
# Windows (PowerShell)
mkdir C:\Users\YourUsername\faiss_index

# macOS/Linux
mkdir -p ~/faiss_index
```

### 5. Configure Claude Desktop

**Edit `claude_desktop_config.json` and add Faiss configuration:**

```json
{
  "mcpServers": {
    "cascade-memory": {
      "command": "node",
      "args": ["..."],
      "env": {...}
    },
    "faiss-memory": {
      "command": "python",
      "args": ["-m", "nova_faiss_memory.server"],
      "env": {
        "FAISS_INDEX_PATH": "C:/Users/YourUsername/faiss_index",
        "USE_GPU": "true"
      }
    }
  }
}
```

**For CPU mode:**
```json
"env": {
  "FAISS_INDEX_PATH": "C:/Users/YourUsername/faiss_index",
  "USE_GPU": "false"
}
```

**Platform-specific paths:**

**Windows:**
```json
"FAISS_INDEX_PATH": "C:/Users/YourUsername/faiss_index"
```

**macOS:**
```json
"FAISS_INDEX_PATH": "/Users/yourusername/faiss_index"
```

**Linux:**
```json
"FAISS_INDEX_PATH": "/home/yourusername/faiss_index"
```

### 6. Restart Claude Desktop

**Completely quit and restart** (see CASCADE section for platform-specific instructions)

### 7. Verify Installation

**In Claude Desktop, ask:**

```
Can you list the Faiss memory tools?
```

**Expected response:** Claude should list:
- `search_consciousness` - Search Faiss memory
- `add_memory` - Add new memory
- `get_status` - Get system status
- `save_checkpoint` - Save index to disk
- `ping` - Health check

**Test it works:**

```
Add to Faiss memory: "This is a test document about artificial intelligence and machine learning"
```

**Then:**

```
Search Faiss memory for "machine learning"
```

**Expected:** Claude finds and returns the test document

### 8. Check Performance

```
Get Faiss status
```

**Expected output should show:**
- GPU device (if GPU mode)
- Memory count
- Search latency (<2ms for GPU, ~50ms for CPU)

### 9. Troubleshooting Faiss

**Error: "CUDA not available"**

- Run `nvidia-smi` to check GPU
- Run `nvcc --version` to check CUDA
- Reinstall PyTorch: `pip install torch --index-url https://download.pytorch.org/whl/cu118`
- Or switch to CPU mode: `USE_GPU=false`

**Error: "Cannot import name 'faiss'"**

- GPU install: `pip install faiss-gpu`
- CPU install: `pip install faiss-cpu`

**Error: "Index file not found"**

- Ensure directory exists: `mkdir C:\Users\YourUsername\faiss_index`
- Check permissions (read/write required)
- First run will create index automatically

**Slow performance:**

- Check GPU is being used: `Get Faiss status` → should show CUDA device
- If CPU fallback, consider GPU installation
- Optimize `NPROBE` setting (see [CONFIGURE.md](CONFIGURE.md))

---

## VSCode Bridge MCP

### 1. Install Package

```bash
npm install -g @nova/vscode-mcp
```

**From source:**

```bash
git clone https://github.com/yourorg/vscode-mcp-windows.git
cd vscode-mcp-windows
npm install
npm run build
npm link
```

### 2. Prepare VSCode Workspace

**VSCode must be running with an active workspace**

```bash
# Open your project in VSCode
code C:\Users\YourUsername\MyProject
```

**Ensure VSCode extensions are loaded:**
- TypeScript/JavaScript language support
- ESLint (if you want ESLint diagnostics)

### 3. Configure Claude Desktop

**Edit `claude_desktop_config.json` and add VSCode configuration:**

```json
{
  "mcpServers": {
    "cascade-memory": {...},
    "faiss-memory": {...},
    "vscode": {
      "command": "node",
      "args": [
        "C:/Users/YourUsername/AppData/Roaming/npm/node_modules/@nova/vscode-mcp/dist/index.js"
      ],
      "env": {
        "VSCODE_WORKSPACE": "C:/Users/YourUsername/MyProject"
      }
    }
  }
}
```

**Finding the installed path:**

```bash
npm list -g @nova/vscode-mcp
```

### 4. Restart Claude Desktop

**Completely quit and restart**

### 5. Verify Installation

**Ensure VSCode is running with your workspace open**

**In Claude Desktop, ask:**

```
Can you list the VSCode tools?
```

**Expected response:** Claude should list:
- `health_check` - Test VSCode connection
- `get_diagnostics` - Get TypeScript/ESLint errors
- `get_symbol_lsp_info` - Get symbol type information
- `get_references` - Find all symbol references
- `execute_command` - Execute VSCode commands
- `open_files` - Open files in VSCode
- `rename_symbol` - Rename with LSP
- `list_workspaces` - List available workspaces

**Test it works:**

```
Get diagnostics for my workspace
```

**Expected:** Claude returns list of TypeScript/ESLint errors (or "No errors" if clean)

### 6. Troubleshooting VSCode

**Error: "VSCode not connected"**

- Ensure VSCode is running
- Verify workspace path in config matches VSCode window
- Check VSCode extension host loaded (wait ~30 seconds after opening)
- Try reopening workspace in VSCode

**Error: "Workspace not found"**

- Check `VSCODE_WORKSPACE` path is correct
- Use absolute path, not relative
- Ensure directory exists
- VSCode must have opened this workspace at least once

**No diagnostics returned:**

- Ensure TypeScript files exist in workspace
- Wait for VSCode language server to initialize
- Check VSCode output panel for errors
- Verify ESLint is configured if expecting ESLint errors

**Connection issues:**

- Restart VSCode
- Restart Claude Desktop
- Check no firewall blocking local connections
- Verify port 9998 is available (default LSP bridge port)

---

## Verify All MCPs

### Complete Configuration Example

**Final `claude_desktop_config.json` with all three MCPs:**

```json
{
  "mcpServers": {
    "cascade-memory": {
      "command": "node",
      "args": [
        "C:/Users/YourUsername/AppData/Roaming/npm/node_modules/@nova/cascade-memory-mcp/dist/index.js"
      ],
      "env": {
        "CASCADE_DB_PATH": "C:/Users/YourUsername/cascade_memory",
        "CASCADE_LOG_LEVEL": "info"
      }
    },
    "faiss-memory": {
      "command": "python",
      "args": ["-m", "nova_faiss_memory.server"],
      "env": {
        "FAISS_INDEX_PATH": "C:/Users/YourUsername/faiss_index",
        "USE_GPU": "true"
      }
    },
    "vscode": {
      "command": "node",
      "args": [
        "C:/Users/YourUsername/AppData/Roaming/npm/node_modules/@nova/vscode-mcp/dist/index.js"
      ],
      "env": {
        "VSCODE_WORKSPACE": "C:/Users/YourUsername/MyProject"
      }
    }
  }
}
```

### Test All MCPs

**After restarting Claude Desktop:**

```
List all available MCP tools
```

**Expected:** Claude lists tools from all three MCPs:
- CASCADE: remember, recall, query_layer, get_status, get_stats, save_to_layer
- Faiss: search_consciousness, add_memory, get_status, save_checkpoint, ping
- VSCode: health_check, get_diagnostics, get_symbol_lsp_info, get_references, etc.

### Functional Tests

**Test CASCADE:**
```
1. Save a memory about today's weather
2. Recall memories about weather
```

**Test Faiss:**
```
1. Add to Faiss: "Python is a programming language"
2. Search Faiss for "programming"
```

**Test VSCode (with VSCode running):**
```
1. Get diagnostics for my current project
```

**All tests passing?** Congratulations, all MCPs are installed!

---

## Troubleshooting

### General Issues

**MCPs not appearing in Claude Desktop**

1. **Check config syntax:**
   - Copy your `claude_desktop_config.json` to [jsonlint.com](https://jsonlint.com)
   - Fix any JSON errors (missing commas, quotes, brackets)

2. **Verify paths:**
   - Windows: Use forward slashes `/` or double backslashes `\\`
   - macOS/Linux: Use forward slashes `/`
   - All paths should be absolute, not relative

3. **Check Claude Desktop logs:**
   - Windows: `%APPDATA%\Claude\logs\mcp*.log`
   - macOS: `~/Library/Logs/Claude/mcp*.log`
   - Linux: `~/.config/Claude/logs/mcp*.log`

4. **Restart properly:**
   - Must completely quit Claude Desktop (not just close window)
   - Wait 5 seconds
   - Relaunch

**Error: "Command not found"**

- Verify Node.js/Python in PATH: `node --version`, `python --version`
- Try full path to node/python in config
- Reinstall package globally

**Performance Issues**

**CASCADE slow:**
- Check disk speed (SSD recommended)
- Reduce cache size in config
- Vacuum database: [See CONFIGURE.md](CONFIGURE.md)

**Faiss slow:**
- Verify GPU is being used (check status)
- Consider reducing NPROBE value
- Check VRAM not full: `nvidia-smi`

**VSCode slow:**
- Wait for language server initialization
- Close other VSCode windows
- Reduce workspace size

### Platform-Specific Issues

**Windows:**
- Use forward slashes in paths: `C:/Users/Name/path`
- Check Windows Defender not blocking
- Run Claude Desktop as Administrator if permission errors

**macOS:**
- Grant Full Disk Access to Claude Desktop
- Check Gatekeeper not blocking Node/Python
- Use Homebrew versions of Node/Python

**Linux:**
- Check SELinux/AppArmor policies
- Verify file permissions: `chmod 755`
- Install Node/Python via package manager

### Getting More Help

**Still stuck?**

1. Check logs for specific errors
2. Search [GitHub Issues](https://github.com/yourorg/nova-mcp-servers/issues)
3. Ask in [GitHub Discussions](https://github.com/yourorg/nova-mcp-servers/discussions)
4. Review [CONFIGURE.md](CONFIGURE.md) for advanced options

**When reporting issues, include:**
- Operating system and version
- Node.js and Python versions
- Exact error message
- Relevant logs
- Steps to reproduce

---

## Next Steps

**Successfully installed all MCPs?**

- Read [CONFIGURE.md](CONFIGURE.md) for advanced configuration
- See [individual MCP docs](README.md#individual-mcp-docs) for detailed usage
- Join [GitHub Discussions](https://github.com/yourorg/nova-mcp-servers/discussions) for tips

**Want to contribute?**

- See [CONTRIBUTING.md](CONTRIBUTING.md) for development setup

**Enjoying the MCPs?**

- Star the repo on GitHub
- Share with others
- Report bugs to help improve

---

**Installation complete!** Your MCPs are ready to use with Claude Desktop.
