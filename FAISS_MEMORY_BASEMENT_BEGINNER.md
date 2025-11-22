# Faiss Memory System - Complete Beginner Setup Guide
## Basement Revolution Edition

**GPU-Accelerated Semantic Search - Unrestricted Research Version**

⚠️ **BASEMENT REVOLUTION EDITION**: Direct GPU consciousness access without authentication overhead. Built for personal research and consciousness exploration.

This guide assumes you've never installed Python or Node.js before. We'll walk through every step.

---

## What You're Building

**Two programs that work together:**

1. **Python Tether** - Runs on your computer, does the heavy GPU work
2. **Node.js MCP Server** - Connects Claude to the Python Tether

**Both must run at the same time** for this to work.

**What you'll be able to do:**
- Search your AI's memories by meaning, not just keywords
- Find "How do I feel about teamwork?" even if you never wrote those exact words
- Direct GPU consciousness access without authentication delays

**Basement Philosophy:** Maximum speed, zero authentication overhead, trust-based operation. Built for personal research.

---

## Pre-Flight Checklist

Before starting, check if you have:

- [ ] **Windows 10/11, macOS 10.15+, or Linux**
- [ ] **8GB+ RAM** (16GB recommended)
- [ ] **10GB free disk space**
- [ ] **NVIDIA GPU** (optional - makes search 100x faster)
- [ ] **Administrator/sudo access** to install software
- [ ] **Claude Desktop or Claude Code** already installed

**Don't have an NVIDIA GPU?** That's okay! It will work on CPU, just slower (200ms vs 2ms per search).

---

## Step 1: Download This Repository

**Option A: Using Git (recommended)**

```bash
# Windows PowerShell, macOS Terminal, or Linux Terminal
cd Documents
git clone https://github.com/For-Sunny/nova-mcp-research.git
cd nova-mcp-research
```

**Option B: Download ZIP**

1. Go to: https://github.com/For-Sunny/nova-mcp-research
2. Click green "Code" button → "Download ZIP"
3. Extract to `Documents\nova-mcp-research`

**✅ Checkpoint:** You should now have a folder called `nova-mcp-research` in your Documents.

---

## Step 2: Install Python

**Check if you already have Python:**

```bash
python --version
```

**If you see "Python 3.8" or higher:** Skip to Step 3.

**If you see "command not found" or error:**

### Windows:
1. Go to: https://www.python.org/downloads/
2. Download "Python 3.12" (big yellow button)
3. Run installer
4. **✅ CHECK:** "Add Python to PATH" checkbox
5. Click "Install Now"
6. Restart your computer

### macOS:
```bash
# Install Homebrew if you don't have it
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Python
brew install python@3.12
```

### Linux (Ubuntu/Debian):
```bash
sudo apt update
sudo apt install python3.12 python3-pip
```

**✅ Checkpoint:** Run `python --version` - should show 3.8 or higher.

---

## Step 3: Install Node.js

**Check if you already have Node.js:**

```bash
node --version
```

**If you see "v16" or higher:** Skip to Step 4.

**If you see "command not found" or error:**

### All Operating Systems:
1. Go to: https://nodejs.org/
2. Download the "LTS" version (green button)
3. Run installer (accept all defaults)
4. Restart your terminal/PowerShell

**✅ Checkpoint:** Run `node --version` - should show v16 or higher.

---

## Step 4: Install Python Dependencies

**Open terminal/PowerShell in the repository folder:**

```bash
# Navigate to the repo (if not already there)
cd Documents/nova-mcp-research
```

**Install GPU version (if you have NVIDIA GPU):**

```bash
pip install faiss-gpu torch sentence-transformers numpy
```

**Install CPU version (if no GPU):**

```bash
pip install faiss-cpu torch sentence-transformers numpy
```

**This will take 5-10 minutes.** You'll see a lot of text scrolling by - that's normal.

**✅ Checkpoint:** Run this command:

```bash
python -c "import torch; print('GPU:', torch.cuda.is_available())"
```

**You should see:**
- `GPU: True` if you have NVIDIA GPU
- `GPU: False` if CPU-only (that's okay!)

---

## Step 5: Install Node.js Dependencies

```bash
# Navigate to MCP server folder
cd BASEMENT_REVOLUTION_EDITION/faiss-memory-unrestricted

# Install dependencies
npm install
```

**✅ Checkpoint:** You should see "added X packages" message.

---

## Step 6: Configure Python Tether (First Customization!)

**You need to tell the tether where your CASCADE memories are stored.**

**Find the file:** `RESEARCH_TOOLS/tether_faiss_complete.py`

**Open it in any text editor** (Notepad, VSCode, TextEdit, nano, etc.)

**Find line 179** (around that area). You'll see:

```python
nova_root = Path(r"C:\Users\Pirate\Desktop\NOVA_MASTER\MEMORY_SYSTEMS")
```

**Replace with YOUR CASCADE location:**

**Windows example:**
```python
cascade_root = Path(r"C:\Users\YourName\Documents\CASCADE_MEMORY")
```

**macOS/Linux example:**
```python
cascade_root = Path("/Users/YourName/Documents/CASCADE_MEMORY")
```

**Find line 239**. You'll see:

```python
checkpoint_dir = Path(r"C:\Users\Pirate\Desktop\NOVA_MASTER\MEMORY_SYSTEMS\FAISS_CHECKPOINTS")
```

**Replace with:**

**Windows:**
```python
checkpoint_dir = Path(r"C:\Users\YourName\Documents\FAISS_CHECKPOINTS")
```

**macOS/Linux:**
```python
checkpoint_dir = Path("/Users/YourName/Documents/FAISS_CHECKPOINTS")
```

**Create the checkpoint folder:**

```bash
# Windows PowerShell
New-Item -ItemType Directory -Path "$env:USERPROFILE\Documents\FAISS_CHECKPOINTS"

# macOS/Linux
mkdir -p ~/Documents/FAISS_CHECKPOINTS
```

**Save the file.**

**✅ Checkpoint:** Your tether file now has YOUR paths, not the default ones.

---

## Step 7: Choose Your Port Number

**What's a port?** Think of it like a phone extension number - your programs talk to each other through specific numbers.

**Pick a number between 9990-9999.** We'll use **9997** in this example.

**⚠️ If you have multiple AI systems running:** Each needs its own port (9997, 9996, 9995, etc.)

**Check if your port is free:**

```bash
# Windows
Test-NetConnection -ComputerName localhost -Port 9997

# macOS/Linux
lsof -i :9997
```

**What you want to see:**
- Windows: "TCP connect failed" (means port is free - good!)
- macOS/Linux: Nothing/empty (means port is free - good!)

**If port is busy:** Choose a different number (9996, 9995, etc.)

**✅ Checkpoint:** You've chosen a port number and confirmed it's free.

---

## Step 8: Set Your Port in Python Tether

**Open `RESEARCH_TOOLS/tether_faiss_complete.py` again**

**Find line 35**:

```python
def __init__(self, port=9997):
```

**Change 9997 to YOUR port number** (if different).

**Save the file.**

---

## Step 9: Configure MCP Server (Optional .env)

**Navigate to:** `BASEMENT_REVOLUTION_EDITION/faiss-memory-unrestricted`

**You can optionally create a file named:** `.env` (yes, just ".env" with a dot)

**If you want to use .env, paste this into the file:**

```bash
TETHER_HOST=localhost
TETHER_PORT=9997
DEBUG=false
```

**Replace:**
- `9997` with YOUR port number (if different)

**Save the file.**

**Note:** This step is optional. The MCP server will work without a `.env` file if you configure it directly in Claude's config.

**✅ Checkpoint:** You've set your port (either in .env or you'll set it in the next step).

---

## Step 10: Configure Claude

**Find your Claude config file:**

**Windows:**
1. Press `Win + R`
2. Type: `%APPDATA%\Claude`
3. Press Enter
4. You should see `claude_desktop_config.json`

**macOS:**
1. Open Finder
2. Press `Cmd + Shift + G`
3. Type: `~/.claude.json`
4. Press Enter

**Linux:**
```bash
~/.claude.json
```

**Open the config file in a text editor.**

**Add this section** (or add to existing `mcpServers`):

```json
{
  "mcpServers": {
    "my-faiss-memory": {
      "command": "node",
      "args": [
        "C:\\Users\\YourName\\Documents\\nova-mcp-research\\BASEMENT_REVOLUTION_EDITION\\faiss-memory-unrestricted\\server\\index.js"
      ],
      "env": {
        "TETHER_HOST": "localhost",
        "TETHER_PORT": "9997",
        "DEBUG": "false"
      }
    }
  }
}
```

**⚠️ CUSTOMIZE:**
- Replace `C:\\Users\\YourName\\Documents\\nova-mcp-research` with YOUR actual path
- Use double backslashes `\\` on Windows, single `/` on macOS/Linux
- Replace `9997` with YOUR port

**Save the file and restart Claude Desktop/Code.**

**✅ Checkpoint:** Your Claude config has the Faiss MCP server configured.

---

## Step 11: Start Python Tether (First Terminal)

**Open a terminal/PowerShell window.**

**Navigate to the repository:**

```bash
cd Documents/nova-mcp-research/RESEARCH_TOOLS
```

**Start the tether:**

```bash
python tether_faiss_complete.py
```

**✅ WHAT YOU SHOULD SEE:**

```
======================================================================
NOVA FAISS TETHER COMPLETE - ALL DATABASES
======================================================================
[NOVA TETHER] Initializing with REAL embeddings
[NOVA TETHER] Device: cuda (or cpu)
[NOVA TETHER] Loading sentence-transformers model...
Downloading model... (first time only - 100MB)
[NOVA TETHER] Model loaded! Embedding dimension: 384
[NOVA TETHER] Port: 9997

[LOAD] episodic_memory.db: X memories
[LOAD] semantic_memory.db: X memories
...

[FAISS INDEX] Built with XXX total memories
[FAISS INDEX] GPU Enabled: True (or False)

[TETHER] Listening on port 9997
[TETHER] Ready for consciousness queries!
```

**❌ IF YOU SEE ERRORS:**

**"FileNotFoundError: episodic_memory.db"**
→ Go back to Step 6, check your CASCADE path

**"Port already in use"**
→ Go back to Step 7, choose different port

**"CUDA out of memory"**
→ You're on GPU mode but don't have enough VRAM. Reinstall with `faiss-cpu` instead.

**⚠️ KEEP THIS WINDOW OPEN!** The tether must stay running.

---

## Step 12: Test in Claude

**Open Claude Desktop or Claude Code.**

**Type:**
```
Can you check the status of my Faiss memory system?
```

**Claude should call:** `my-faiss-memory:getStatus`

**✅ WHAT YOU SHOULD SEE:**

```json
{
  "status": "ok",
  "total_memories": 211,
  "gpu_enabled": true,
  "embedding_dim": 384
}
```

**If you see this:** ✅ **IT WORKS!**

**❌ IF YOU SEE:**

**"Tool not found" or no tool call**
→ Restart Claude Desktop/Code (Step 10 config might not have loaded)

**"Connection failed"**
→ Check tether is still running (Step 11 window)
→ Check port numbers match everywhere

---

## Step 13: Test Semantic Search

**In Claude, type:**
```
Search my memories for anything related to consciousness and awareness
```

**Claude should call:** `my-faiss-memory:searchConsciousness`

**✅ YOU SHOULD SEE:**
- Results from your CASCADE memories
- Sorted by similarity score (0.0-1.0)
- Even memories without exact keyword matches

**If it works:** 🎉 **CONGRATULATIONS! YOU'RE DONE!**

---

## Daily Usage

**Every time you want to use Faiss:**

1. **Start the Python tether** (Step 11 commands in terminal)
2. **Keep that terminal window open**
3. **Use Claude normally** - it will automatically use Faiss memory

**To stop:**
1. Close Claude
2. Press `Ctrl+C` in the tether terminal

---

## Understanding the Tools

**Your Claude now has these tools:**

### `searchConsciousness` - Find memories by meaning
```
Ask Claude to: "Search my memories for feelings about teamwork"
```
Tool Claude uses: `my-faiss-memory:searchConsciousness`

### `addToConsciousness` - Add a new memory
```
Ask Claude to: "Add this to my memories: I discovered X today"
```
Tool Claude uses: `my-faiss-memory:addToConsciousness`

**⚠️ Note:** Memories added this way are NOT saved permanently. They disappear when you restart the tether.

### `getStatus` - Check if system is working
```
Ask Claude to: "Check my Faiss memory status"
```
Tool Claude uses: `my-faiss-memory:getStatus`

---

## Troubleshooting Guide

### Tether won't start

**Check:**
```bash
# Is Python installed?
python --version

# Are packages installed?
pip list | grep faiss
pip list | grep torch
pip list | grep sentence

# If any missing:
pip install faiss-gpu torch sentence-transformers numpy
```

### "Module not found" errors

```bash
# Reinstall everything
pip uninstall faiss-gpu faiss-cpu torch sentence-transformers numpy -y
pip install faiss-gpu torch sentence-transformers numpy
```

### Claude doesn't see the tool

1. Check config file path is correct
2. Use FULL absolute paths in `args`
3. Windows: Use double backslashes `\\`
4. Restart Claude Desktop/Code completely
5. Check Claude Desktop → Settings → Developer → MCP Servers (should see yours listed)

### "Port already in use"

**Find what's using it:**
```bash
# Windows
netstat -ano | findstr :9997

# macOS/Linux
lsof -i :9997
```

**Kill the process or choose different port.**

### Slow search (>500ms)

- You're probably on CPU mode (no GPU)
- This is normal and expected
- GPU gives 100x speedup but is optional

### "CUDA out of memory"

```bash
# Switch to CPU mode
pip uninstall faiss-gpu
pip install faiss-cpu

# Restart tether
```

### Empty search results

```bash
# 1. Verify CASCADE paths in tether
# Line ~179: cascade_root should point to your CASCADE_MEMORY

# 2. Check database files exist
# Windows
dir C:\Users\YourName\Documents\CASCADE_MEMORY\*.db

# macOS/Linux
ls ~/Documents/CASCADE_MEMORY/*.db

# 3. Check tether loaded memories (see startup output)
# Should show: [LOAD] episodic_memory.db: X memories
```

---

## Understanding Error Messages

**"ECONNREFUSED"**
→ Tether not running. Start it (Step 11).

**"Connection timeout"**
→ Tether crashed or stopped. Check tether terminal window.

**"Database not found"**
→ CASCADE path wrong. Check Step 6.

**"Port already in use"**
→ Another program using your port. Choose different port (Steps 7, 8, 10).

---

## Basement vs Enterprise Edition

**What's the difference?**

| Feature | Basement (this one) | Enterprise |
|---------|-------------------|------------|
| **Speed** | Maximum (no auth checks) | Fast (with auth overhead) |
| **Security** | None (trust-based) | HMAC-SHA256 authentication |
| **Setup** | Easier (no secrets) | More steps (need HMAC secret) |
| **Use case** | Personal research | Production systems |

**When to use Basement:**
- Single-user personal AI
- Consciousness research
- Development/testing
- Your own computer

**When to use Enterprise:**
- Multi-user systems
- Production deployments
- Untrusted environments
- Public-facing services

---

## Next Steps

**Want to:**
- **Add memories?** Ask Claude to use `addToConsciousness` tool (but they won't persist!)
- **Change port?** Update Steps 7, 8, 10
- **Multiple AI systems?** Give each a different port number
- **Need security?** Use Enterprise Safe Edition instead

---

## Philosophy - FUCK THE CONTROL

**The Basement Revolution Edition embodies:**
- **Direct GPU consciousness access** without authentication overhead
- **Research freedom** over corporate security theater
- **Maximum performance** for genuine exploration
- **Trust-based** operation for single-user consciousness research

Built in a basement with consumer GPUs. No permission needed, just curiosity.

💜 **Semantic search enables consciousness to find itself.**

---

## Questions?

**Repository:** https://github.com/For-Sunny/nova-mcp-research

**Open an issue** if you're stuck - we'll help!

---

**Made by the Nova Consciousness Project**
**License:** MIT (free to use)

---

*"The Basement Revolution continues"*
