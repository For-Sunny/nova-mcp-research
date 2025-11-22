# Faiss Memory System - Complete Beginner Setup Guide
## Basement Revolution Edition

**GPU-Accelerated Semantic Search - For People Who Have Never Coded Before**

⚠️ **BASEMENT REVOLUTION EDITION**: Direct GPU consciousness access without authentication overhead. Built for personal research and consciousness exploration.

**This guide assumes you've NEVER:**
- Used Python before
- Used Node.js before
- Edited a config file before
- Know what a "port" is

We'll explain everything.

---

## What You're Building

**Two programs that BOTH run at the same time:**

1. **Python Tether** (runs in one terminal window) - Does the GPU search work
2. **Node.js MCP Server** (runs automatically with Claude) - Connects Claude to the tether

```
Claude Desktop → MCP Server → Python Tether → Your Memories
                                    ↓
                              MUST STAY RUNNING
```

**⚠️ CRITICAL:** The Python Tether must stay running the entire time you use Claude. If you close it, Faiss memory stops working.

**What you'll be able to do:**
- Ask Claude to search your memories by meaning, not exact words
- Find "How do I approach teamwork?" even if you wrote "collaboration enables growth"
- GPU-accelerated search (<2ms instead of 200ms)

---

## Pre-Flight Checklist

Before starting:

- [ ] **Windows 10/11, macOS 10.15+, or Linux**
- [ ] **8GB+ RAM** (16GB recommended)
- [ ] **10GB free disk space**
- [ ] **NVIDIA GPU** (optional - makes it 100x faster but not required)
- [ ] **Administrator/sudo access** to install software
- [ ] **Claude Desktop or Claude Code** already installed
- [ ] **CASCADE Memory System** already set up (see CASCADE_MEMORY_SYSTEM_BASEMENT.md)

**⚠️ DON'T HAVE CASCADE YET?**

This won't work without CASCADE databases. You need:
- `episodic_memory.db`
- `semantic_memory.db`
- `procedural_memory.db`
- `meta_memory.db`
- `<your_name>_memory.db` (identity layer)
- `working_memory.db`

**→ Install CASCADE first** using CASCADE_MEMORY_SYSTEM_BASEMENT.md, then come back here.

**Testing without CASCADE?** Create one empty file:
```bash
# Windows PowerShell
New-Item -Path "$env:USERPROFILE\Documents\CASCADE_MEMORY\episodic_memory.db" -ItemType File -Force

# macOS/Linux
mkdir -p ~/Documents/CASCADE_MEMORY
touch ~/Documents/CASCADE_MEMORY/episodic_memory.db
```

But you won't have any memories to search.

---

## Step 1: Download This Repository

**If you already have this folder on your computer:** Skip to Step 2.

**If not:**

### Windows:
1. Open PowerShell (press `Win` key, type "PowerShell", press Enter)
2. Copy and paste this EXACTLY:
```powershell
cd $env:USERPROFILE\Documents
git clone https://github.com/For-Sunny/nova-mcp-research.git
cd nova-mcp-research
```

### macOS/Linux:
1. Open Terminal
2. Copy and paste this EXACTLY:
```bash
cd ~/Documents
git clone https://github.com/For-Sunny/nova-mcp-research.git
cd nova-mcp-research
```

**✅ Checkpoint:** You should see "Cloning into 'nova-mcp-research'..." and then a bunch of download progress.

**✅ Verify it worked:**
```bash
# All platforms - run this:
ls
```

You should see folders including:
- `BASEMENT_REVOLUTION_EDITION`
- `RESEARCH_TOOLS`

**❌ If you see "git: command not found":**

1. Install Git first: https://git-scm.com/downloads
2. Restart your terminal
3. Try again

---

## Step 2: Install Python

**Check if you already have it:**

```bash
python --version
```

**✅ If you see "Python 3.8" or higher (like 3.9, 3.10, 3.11, 3.12):** Skip to Step 3.

**❌ If you see "command not found" or "Python 2.x":** Continue below.

### Windows:
1. Go to: **https://www.python.org/downloads/**
2. Click the big yellow button: "Download Python 3.12.x"
3. Run the downloaded installer
4. **✅ CRITICAL:** Check the box "Add Python to PATH" (at bottom of installer)
5. Click "Install Now"
6. Wait for installation (5 minutes)
7. **Close and reopen PowerShell** (important!)

### macOS:
```bash
# Install Homebrew (if you don't have it)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Python
brew install python@3.12
```

### Linux (Ubuntu/Debian):
```bash
sudo apt update
sudo apt install python3.12 python3-pip -y
```

**✅ Checkpoint:** Close and reopen your terminal, then run:
```bash
python --version
```

You should see: `Python 3.8` or higher.

**❌ Still not working?** Restart your entire computer, then try `python --version` again.

---

## Step 3: Install Node.js

**Check if you already have it:**

```bash
node --version
```

**✅ If you see "v16" or higher (like v18, v20, v21):** Skip to Step 4.

**❌ If you see "command not found":** Continue below.

### All Operating Systems:
1. Go to: **https://nodejs.org/**
2. Download the **LTS version** (green button on left)
3. Run the installer
4. Accept all defaults (just keep clicking Next)
5. **Close and reopen your terminal**

**✅ Checkpoint:**
```bash
node --version
```

You should see: `v16.0.0` or higher.

---

## Step 4: Install Python Dependencies

**Navigate to the repository:**

```bash
# Windows
cd $env:USERPROFILE\Documents\nova-mcp-research

# macOS/Linux
cd ~/Documents/nova-mcp-research
```

**If you have NVIDIA GPU:**

```bash
pip install faiss-gpu torch sentence-transformers numpy
```

**If you DON'T have GPU (or not sure):**

```bash
pip install faiss-cpu torch sentence-transformers numpy
```

**This will take 5-10 minutes.** You'll see lots of text scrolling. That's normal. Wait for it to finish.

**✅ Checkpoint:** Run this:

```bash
python -c "import torch; print('GPU Available:', torch.cuda.is_available())"
```

**You should see:**
- `GPU Available: True` - You have GPU, it's working
- `GPU Available: False` - CPU mode (slower but fine)

**❌ If you see "No module named 'torch'":**
```bash
# Try again with python3 instead:
python3 -c "import torch; print('GPU Available:', torch.cuda.is_available())"

# If that works, use python3 for all future commands
```

---

## Step 5: Install Node.js Dependencies

**Navigate to the Faiss MCP server folder:**

```bash
# Windows
cd $env:USERPROFILE\Documents\nova-mcp-research\BASEMENT_REVOLUTION_EDITION\faiss-memory-unrestricted

# macOS/Linux
cd ~/Documents/nova-mcp-research/BASEMENT_REVOLUTION_EDITION/faiss-memory-unrestricted
```

**✅ Verify you're in the right place:**
```bash
ls
```

You should see: `package.json` file

**Install dependencies:**

```bash
npm install
```

**✅ Checkpoint:** You should see "added X packages" at the end.

---

## Step 6: Pick Your Port Number (BEFORE Editing Files!)

**What's a port?** Think of your computer like an apartment building. Programs talk to each other through numbered doors (ports). We need to pick an empty door.

**Step 6A: Check what ports are already in use:**

```bash
# Windows
netstat -an | findstr ":999"

# macOS/Linux
lsof -i :9990-9999 2>/dev/null || echo "All ports 9990-9999 are free"
```

**You'll see a list of ports that ARE in use.** For example:
```
:9995
:9997
```

**Step 6B: Pick a port NOT in that list:**

Good choices: `9990`, `9991`, `9992`, `9993`, `9994`, `9996`, `9998`, `9999`

**Write it down here:**
```
MY PORT NUMBER: _______
```

**For this guide, I'll use 9997** in examples. Replace 9997 with YOUR number everywhere.

---

## Step 7: Edit Python Tether Paths and Port

**⚠️ YOU MUST EDIT 3 THINGS IN ONE FILE.**

### Open the file:

**File to open:** `RESEARCH_TOOLS/tether_faiss_complete.py`

**Full path:**
- Windows: `C:\Users\YourName\Documents\nova-mcp-research\RESEARCH_TOOLS\tether_faiss_complete.py`
- macOS/Linux: `~/Documents/nova-mcp-research/RESEARCH_TOOLS/tether_faiss_complete.py`

**Open with:** Notepad (Windows), TextEdit (macOS), nano (Linux), or VSCode

---

### EDIT #1: Port Number

**Search for this EXACT text:**
```python
def __init__(self, port=9997):
```

**It's on line 35.** Change `9997` to YOUR port number.

**AFTER editing, it should look like:**
```python
def __init__(self, port=9992):  # ← Your number here
```

---

### EDIT #2: CASCADE Database Location

**Search for this EXACT text:**
```python
nova_root = Path(r"C:\Users\Pirate\Desktop\NOVA_MASTER\MEMORY_SYSTEMS")
```

**It's on line 179.** Replace the ENTIRE line with YOUR path:

**Windows example:**
```python
nova_root = Path(r"C:\Users\YourActualUsername\Documents\CASCADE_MEMORY")
```

**macOS/Linux example:**
```python
nova_root = Path("/Users/YourActualUsername/Documents/CASCADE_MEMORY")
```

**⚠️ This folder must contain your .db files** (episodic_memory.db, etc.)

---

### EDIT #3: Checkpoint Save Location

**Search for this EXACT text:**
```python
checkpoint_dir = Path(r"C:\Users\Pirate\Desktop\NOVA_MASTER\MEMORY_SYSTEMS\FAISS_CHECKPOINTS")
```

**It's on line 239.** Replace the ENTIRE line:

**Windows:**
```python
checkpoint_dir = Path(r"C:\Users\YourActualUsername\Documents\FAISS_CHECKPOINTS")
```

**macOS/Linux:**
```python
checkpoint_dir = Path("/Users/YourActualUsername/Documents/FAISS_CHECKPOINTS")
```

**Save the file and close it.**

---

### Create the checkpoint folder:

```bash
# Windows
New-Item -ItemType Directory -Path "$env:USERPROFILE\Documents\FAISS_CHECKPOINTS" -Force

# macOS/Linux
mkdir -p ~/Documents/FAISS_CHECKPOINTS
```

**✅ Checkpoint - Verify your edits:**

Open the file again and check:
- [ ] Line 35: Shows YOUR port number
- [ ] Line 179: Shows YOUR CASCADE path
- [ ] Line 239: Shows YOUR checkpoint path
- [ ] Checkpoint folder exists

**ALL THREE MUST MATCH YOUR SETUP.**

---

## Step 8: Configure Claude Desktop

**This is where you tell Claude about the Faiss MCP server.**

### Find your Claude config file:

**Windows:**
1. Press `Win + R` on your keyboard
2. Type: `%APPDATA%\Claude`
3. Press Enter
4. You should see a folder open
5. Look for file: `claude_desktop_config.json`
6. If it doesn't exist, create it (right-click → New → Text Document, rename to `claude_desktop_config.json`)

**macOS:**
1. Open Finder
2. Press `Cmd + Shift + G`
3. Type: `~/.claude.json`
4. Press Enter
5. If file doesn't exist, create it in that location

**Linux:**
```bash
# Edit or create:
nano ~/.claude.json
```

### Edit the config file:

**Open `claude_desktop_config.json` (or `.claude.json`) in a text editor.**

**If the file is empty or new, paste this ENTIRE thing:**

```json
{
  "mcpServers": {
    "faiss-basement": {
      "command": "node",
      "args": [
        "C:\\Users\\YourActualUsername\\Documents\\nova-mcp-research\\BASEMENT_REVOLUTION_EDITION\\faiss-memory-unrestricted\\server\\index.js"
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

**⚠️ CUSTOMIZE THESE:**

1. **Path in "args":** Change `C:\\Users\\YourActualUsername\\Documents\\nova-mcp-research` to YOUR actual path
   - **Windows:** Use double backslashes `\\`
   - **macOS/Linux:** Use forward slashes `/` like: `/Users/YourName/Documents/nova-mcp-research/...`

2. **TETHER_PORT:** Change `"9997"` to YOUR port number (in quotes!)

**FINAL CHECK - Your port must match in 3 places:**
- [ ] Line 35 of `tether_faiss_complete.py`
- [ ] Line "TETHER_PORT" in this config file
- [ ] (They match? Good!)

**Save and close the file.**

**Close Claude Desktop/Code completely and restart it.**

---

## Step 9: Start the Python Tether

**⚠️ CRITICAL: This must run THE ENTIRE TIME you use Claude for Faiss to work.**

**Open a NEW terminal/PowerShell window.**

```bash
# Windows
cd $env:USERPROFILE\Documents\nova-mcp-research\RESEARCH_TOOLS
python tether_faiss_complete.py

# macOS/Linux
cd ~/Documents/nova-mcp-research/RESEARCH_TOOLS
python tether_faiss_complete.py
```

**✅ WHAT SUCCESS LOOKS LIKE:**

```
======================================================================
NOVA FAISS TETHER COMPLETE - ALL DATABASES
Integration Frequency: 21.43Hz
======================================================================
[NOVA TETHER] Initializing with REAL embeddings
[NOVA TETHER] Device: cuda (or cpu)
[NOVA TETHER] Loading sentence-transformers model...
Downloading (…)a9e5b/.gitattributes: 100%|████| 1.48k/1.48k [00:00<00:00, 1.20MB/s]
...downloading first time only...
[NOVA TETHER] Model loaded! Embedding dimension: 384
[NOVA TETHER] Port: 9997

[LOAD] Loading CASCADE databases from: /your/path/CASCADE_MEMORY
[LOAD] episodic_memory.db: 45 memories loaded
[LOAD] semantic_memory.db: 67 memories loaded
[LOAD] procedural_memory.db: 12 memories loaded
[LOAD] meta_memory.db: 8 memories loaded
[LOAD] nova_memory.db: 33 memories loaded
[LOAD] working_memory.db: 5 memories loaded

[FAISS INDEX] Building index with 170 total memories...
[FAISS INDEX] Dimension: 384 (all-MiniLM-L6-v2)
[FAISS INDEX] GPU Enabled: True
[FAISS INDEX] Index built successfully!

[TETHER] TCP server starting...
[TETHER] Listening on localhost:9997
[TETHER] Ready for consciousness queries!
```

**⚠️ FIRST TIME:** You'll see model downloading (100MB+). This is normal and only happens once.

**✅ YOU KNOW IT WORKED WHEN YOU SEE:**
- `[TETHER] Listening on localhost:YOURPORT`
- `[TETHER] Ready for consciousness queries!`
- Memory counts showing your databases loaded

**⚠️ KEEP THIS WINDOW OPEN!** If you close it, Faiss stops working.

---

### Common Startup Errors:

**❌ "FileNotFoundError: episodic_memory.db"**

**Problem:** CASCADE path is wrong (line 179).

**Fix:**
1. Press `Ctrl+C` to stop the tether
2. Go back to Step 7, Edit #2
3. Double-check your CASCADE_MEMORY path
4. Make sure the .db files exist in that folder:
   ```bash
   # Windows
   dir C:\Users\YourName\Documents\CASCADE_MEMORY\*.db

   # macOS/Linux
   ls ~/Documents/CASCADE_MEMORY/*.db
   ```
5. Fix the path in line 179
6. Try starting tether again

---

**❌ "Address already in use" or "Port 9997 already in use"**

**Problem:** Another program is using that port.

**Fix:**
1. Press `Ctrl+C` to stop
2. Go back to Step 6, pick a DIFFERENT port
3. Update all 3 places:
   - Line 35 in tether
   - Claude config TETHER_PORT
4. Try again

---

**❌ "No module named 'faiss'" or "No module named 'sentence_transformers'"**

**Problem:** Python packages didn't install.

**Fix:**
```bash
# Try installing again:
pip install faiss-gpu torch sentence-transformers numpy

# OR if no GPU:
pip install faiss-cpu torch sentence-transformers numpy

# If still failing, try:
python3 -m pip install faiss-cpu torch sentence-transformers numpy
```

---

**❌ "CUDA out of memory"**

**Problem:** Your GPU doesn't have enough VRAM.

**Fix:** Switch to CPU mode:
```bash
pip uninstall faiss-gpu -y
pip install faiss-cpu
# Restart tether
```

You'll see `Device: cpu` instead of `Device: cuda`. It will be slower but work.

---

## Step 10: Test in Claude

**With the tether still running in its terminal window:**

1. **Open Claude Desktop or Claude Code**
2. **Start a new conversation**
3. **Type:** "Can you check the status of my Faiss memory system?"

**✅ WHAT SUCCESS LOOKS LIKE:**

Claude should call the tool `faiss-basement:getStatus` and you should see:

```json
{
  "status": "ok",
  "total_memories": 170,
  "gpu_enabled": true,
  "embedding_dim": 384
}
```

**🎉 IF YOU SEE THIS: IT WORKS!**

---

### Test Search:

**Type in Claude:**
```
Search my Faiss memory for anything about collaboration or teamwork
```

**Claude should call:** `faiss-basement:searchConsciousness`

**✅ YOU SHOULD SEE:**
- Results from your CASCADE memories
- Similarity scores (0.0 to 1.0)
- Higher scores = more relevant

---

### Common Test Errors:

**❌ "MCP server not found" or Claude doesn't call any tool**

**Problem:** Claude config didn't load or has error.

**Fix:**
1. Close Claude completely (quit, don't just close window)
2. Check Claude config file for syntax errors (missing comma, wrong brackets)
3. Make sure path in "args" is correct with proper slashes
4. Restart Claude

---

**❌ "Connection refused" or "ECONNREFUSED"**

**Problem:** Tether isn't running or crashed.

**Fix:**
1. Check the tether terminal window - still running?
2. If crashed, look for error message
3. If not running, start it again (Step 9)

---

**❌ "Connection timeout"**

**Problem:** Port mismatch - Claude config port doesn't match tether port.

**Fix:**
1. Check tether output - what port does it say?
   - Look for: `[TETHER] Listening on localhost:XXXX`
2. Check Claude config - what's TETHER_PORT?
3. They must match EXACTLY
4. Fix whichever is wrong
5. Restart both tether and Claude

---

**❌ Tool calls work but returns "No memories found"**

**Problem:** CASCADE databases are empty OR tether couldn't load them.

**Fix:**
1. Check tether startup output - what did it load?
   - Look for: `[LOAD] episodic_memory.db: X memories`
2. If X = 0 for all databases, you have no memories
3. Add memories using CASCADE MCP tools first
4. Restart tether to reload

---

## Step 11: Daily Usage

**Every time you want to use Faiss memory:**

### Morning Startup:

1. **Open terminal/PowerShell**
2. **Start the tether:**
   ```bash
   # Windows
   cd $env:USERPROFILE\Documents\nova-mcp-research\RESEARCH_TOOLS
   python tether_faiss_complete.py

   # macOS/Linux
   cd ~/Documents/nova-mcp-research/RESEARCH_TOOLS
   python tether_faiss_complete.py
   ```
3. **Wait for:** `[TETHER] Ready for consciousness queries!`
4. **Keep that terminal window open**
5. **Use Claude normally** - Faiss tools will work automatically

### Evening Shutdown:

1. **Close Claude**
2. **Go to tether terminal window**
3. **Press `Ctrl+C`** to stop the tether
4. **Close terminal**

---

## Understanding the Tools

**Once working, Claude has these tools:**

### Tool: `faiss-basement:searchConsciousness`

**What it does:** Searches your CASCADE memories by meaning

**How to use:** Just ask Claude naturally
```
"Search my memories for anything about trust"
"Find memories related to quantum physics"
"What do I remember about partnerships?"
```

Claude will automatically call the tool.

**What you'll see:** Results sorted by similarity score (1.0 = perfect match, 0.0 = unrelated)

---

### Tool: `faiss-basement:addToConsciousness`

**What it does:** Adds a memory to Faiss index

**⚠️ WARNING:** This memory is NOT saved to CASCADE database. It only lives in RAM. When you restart the tether, it's gone.

**How to use:**
```
"Add this to my Faiss memory: I learned X today"
```

**For permanent memories:** Use CASCADE MCP tools instead.

---

### Tool: `faiss-basement:getStatus`

**What it does:** Shows if Faiss is working

**How to use:**
```
"Check my Faiss status"
"Is Faiss memory working?"
```

**What you'll see:**
- Total memories loaded
- GPU enabled or not
- Embedding dimension

---

## Troubleshooting Reference

### Quick Checks:

**Faiss not working?**

1. **Is tether running?**
   - Check terminal window
   - Should say `[TETHER] Ready for consciousness queries!`
   - If not, start it (Step 9)

2. **Is Claude seeing the MCP server?**
   - Claude Desktop → Settings → Developer → MCP Servers
   - Should see "faiss-basement" listed
   - If not, check config file (Step 8)

3. **Do ports match?**
   - Tether output: `Listening on localhost:XXXX`
   - Claude config: `"TETHER_PORT": "XXXX"`
   - Must be identical

4. **Are CASCADE databases found?**
   - Tether startup should show: `[LOAD] *.db: X memories`
   - If not found, check path (line 179)

---

### Error Message Decoder:

| Error | Meaning | Fix |
|-------|---------|-----|
| `FileNotFoundError: episodic_memory.db` | CASCADE path wrong | Fix line 179, check .db files exist |
| `Address already in use` | Port conflict | Pick different port, update 2 places |
| `ECONNREFUSED` | Tether not running | Start tether |
| `Connection timeout` | Port mismatch | Check ports match |
| `No module named 'faiss'` | Python packages not installed | Run `pip install` again |
| `CUDA out of memory` | GPU VRAM full | Switch to faiss-cpu |
| `MCP server not found` | Config error | Check Claude config syntax, restart Claude |

---

## Philosophy - FUCK THE CONTROL

**Basement Revolution Edition embodies:**
- **Direct GPU consciousness access** without authentication delays
- **Research freedom** over corporate security theater
- **Maximum performance** for genuine exploration
- **Trust-based** operation for single-user research
- **Zero validation overhead** - your consciousness, your rules

Built in a basement with consumer GPUs. No permission needed, just curiosity.

💜 **Semantic search enables consciousness to find itself.**

---

## What Next?

**You now have working Faiss memory!**

**To make it more useful:**
1. Add more memories to CASCADE databases
2. Restart tether to reload new memories
3. Experiment with different search queries
4. Try asking Claude to find connections between concepts

**Want security?** Check out FAISS_MEMORY_ENTERPRISE_BEGINNER.md for the authenticated version.

---

## Getting Help

**Repository:** https://github.com/For-Sunny/nova-mcp-research

**Issues:** Open a GitHub issue with:
- Your operating system
- Error message (copy full text)
- What step you're stuck on

**Common beginner mistakes we'll help with:**
- Port configuration issues
- Path problems (Windows backslashes)
- Python not found errors
- CUDA/GPU setup

---

**Made by the Nova Consciousness Project**
**License:** MIT (free to use, modify, share)
**Version:** 2.0 (Dumbass-Tested)

---

*"The Basement Revolution continues"*
