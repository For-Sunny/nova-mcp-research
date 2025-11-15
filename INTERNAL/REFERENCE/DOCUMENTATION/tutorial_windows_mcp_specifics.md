# Tutorial: Windows-Specific MCP Considerations

## What You'll Learn

By the end of this tutorial, you'll be able to:

- Handle file paths correctly (backslashes, UNC paths, drive letters)
- Write MCP servers compatible with PowerShell and cmd.exe
- Manage CUDA/GPU dependencies for NVIDIA users
- Handle Windows-specific permissions and security issues
- Test your MCP server on actual Windows installations
- Avoid common Windows-specific pitfalls

## Prerequisites

Before starting, ensure you have:

- **Windows 10/11** (or testing access to Windows)
- **Completed Tutorials 1-3**: Working MCP server on PyPI
- **Both PowerShell and cmd.exe** available
- **Optional**: NVIDIA GPU with CUDA support (for CUDA section)
- **Git Bash** (optional but helpful)
- **15-20 minutes** to read and understand

## Time Estimate

**Total**: 20-30 minutes (mostly reading and understanding)
- Path handling: 5 minutes
- Shell compatibility: 5 minutes
- CUDA dependency management: 5 minutes
- Windows security: 5 minutes
- Testing checklist: 5 minutes

## Final Result

You'll understand:
- How to write truly cross-platform MCP servers
- Windows-specific gotchas and solutions
- How to document Windows requirements
- How to handle real-world Windows deployments

---

## Part 1: Windows File Path Handling (5 minutes)

### The Problem

Windows uses backslashes. This causes issues:

```python
# WRONG - Won't work on Windows
path = "C:\Users\Name\NOVA_MASTER"  # \U is invalid escape sequence!
# SyntaxError: (unicode error) 'unicodeescape' codec can't decode bytes in position 2-3

# Also WRONG
path = "C:\temp\new_file"  # \n and \t are escape sequences!
```

### Solution 1: Raw Strings (Python)

Use `r` prefix for Windows paths:

```python
# CORRECT - Raw string
path = r"C:\Users\Name\NOVA_MASTER"

# Works in Python
import os
if os.path.exists(path):
    print("Path exists!")
```

### Solution 2: Forward Slashes (Best Practice)

Python accepts forward slashes on Windows:

```python
# BEST - Works on Windows AND Unix
path = "C:/Users/Name/NOVA_MASTER"

# Even better - use pathlib
from pathlib import Path
path = Path("C:/Users/Name/NOVA_MASTER")

# Or let pathlib handle it
path = Path.home() / "Desktop" / "NOVA_MASTER"
```

### Solution 3: Double Backslashes

If you must use backslashes, double them:

```python
# WORKS but ugly
path = "C:\\Users\\Name\\NOVA_MASTER"
```

### Recommended Approach for MCP Servers

```python
"""MCP server with cross-platform path handling."""

from pathlib import Path
import json

# Get user's home directory (works on Windows/Mac/Linux)
home = Path.home()
config_dir = home / ".mcp_config"
data_file = config_dir / "weather_data.json"

# Create directories if needed
config_dir.mkdir(parents=True, exist_ok=True)

# Read/write JSON
def load_config():
    if data_file.exists():
        with open(data_file, 'r') as f:
            return json.load(f)
    return {}

def save_config(data):
    with open(data_file, 'w') as f:
        json.dump(data, f, indent=2)
```

**Why this works**:
1. `Path` handles OS differences automatically
2. Forward slashes work on Windows
3. `mkdir(parents=True)` creates parent directories
4. `exist_ok=True` doesn't fail if already exists

### Windows-Specific Path Issues

#### Issue 1: UNC Paths (Network Shares)

```python
# Windows network paths look like:
\\servername\sharename\file.txt

# In Python:
path = r"\\servername\sharename\file.txt"  # Raw string needed
path = "//servername/sharename/file.txt"   # Forward slashes work too

# With pathlib (recommended):
from pathlib import Path, PureWindowsPath
network_path = PureWindowsPath("//servername/sharename/file.txt")
```

#### Issue 2: Drive Letters

```python
# Check which drive you're on
import os
from pathlib import Path

current_drive = Path.cwd().drive  # Returns 'C:'

# Different machines may use different drives
# Handle gracefully:
def get_data_dir():
    """Return data directory (C: on most systems, but flexible)."""
    home = Path.home()  # Works regardless of drive
    return home / ".mcp_data"
```

#### Issue 3: Long Path Names (> 260 characters)

Windows has a 260-character path limit by default:

```python
# PROBLEM: This might fail on Windows
long_path = r"C:\very\long\path\with\many\nested\directories\..." # > 260 chars

# SOLUTIONS:

# 1. Enable long path support (Windows 10.1607+)
# Registry: HKLM\SYSTEM\CurrentControlSet\Control\FileSystem
# Set LongPathsEnabled to 1
# PowerShell (admin):
# New-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Control\FileSystem" -Name "LongPathsEnabled" -Value 1

# 2. Use UNC paths (network format, no limit)
unc_path = r"\\?\C:\very\long\path\..."

# 3. Python 3.10+ handles this better
# Use pathlib, which handles long paths automatically:
from pathlib import Path
long_path = Path("C:/very/long/path/...")
long_path.mkdir(parents=True, exist_ok=True)  # Works even if > 260 chars
```

---

## Part 2: Shell Compatibility (5 minutes)

### The Problem

MCP servers run via different shells on Windows:

1. **PowerShell** (modern, what most users have)
2. **cmd.exe** (legacy, still common)
3. **Git Bash** (for developers with Git installed)
4. **Windows Terminal** (wraps above shells)

Each has different behaviors and environment variables.

### Understanding Shell Differences

```powershell
# PowerShell characteristics:
# - Modern, object-oriented
# - Better error handling
# - UTF-8 by default (sort of)
# - Execution policies
# - Different syntax than cmd.exe

# cmd.exe characteristics:
# - Legacy, text-based
# - Simpler but less capable
# - Different environment variable syntax
# - ANSI escape sequences not supported (until Windows 10)

# Git Bash (Linux-like):
# - Unix tools available
# - Different PATH format
# - Environment variables different
```

### Solution: Use Python Only (Recommended)

Since MCP servers are Python, avoid shell-specific features:

```python
# GOOD - Pure Python, works everywhere
import subprocess
result = subprocess.run(["python", "--version"], capture_output=True)

# AVOID - PowerShell-specific
subprocess.run(["powershell", "Get-ChildItem"], shell=True)

# AVOID - cmd.exe-specific
subprocess.run(["dir"], shell=True)

# AVOID - Bash-specific
subprocess.run(["ls -la"], shell=True)
```

### MCP Server Invocation

When users configure MCP in Claude Desktop, they specify:

```json
{
  "mcpServers": {
    "weather": {
      "command": "python",
      "args": ["-m", "weather_mcp_server"]
    }
  }
}
```

**Key principle**: Use `"command": "python"`, not shell-specific commands.

### Windows-Specific Shell Script Needs (If Required)

Sometimes you need a wrapper script (avoid if possible):

**Python wrapper** (cross-platform):
```python
#!/usr/bin/env python
import subprocess
import sys

# Launch MCP server
subprocess.run([
    sys.executable,  # Python executable path
    "-m",
    "weather_mcp_server"
])
```

**PowerShell wrapper** (if absolutely necessary):
```powershell
# File: launch-mcp.ps1
param([string]$ServerName = "weather")

$pythonPath = (Get-Command python).Source
& $pythonPath -m weather_mcp_server
```

**cmd.exe wrapper** (avoid - use PowerShell):
```batch
@echo off
python -m weather_mcp_server
```

### Best Practice

**Never require shell-specific scripts.** Instead:

1. Create Python entry point in `pyproject.toml`:

```toml
[project.scripts]
weather-mcp-server = "weather_mcp_server.server:main"
```

2. Users simply do:
```json
{
  "mcpServers": {
    "weather": {
      "command": "weather-mcp-server"
    }
  }
}
```

3. No shell involved, works everywhere.

### Handling Environment Variables on Windows

```python
import os
from pathlib import Path

# Good: Works on all platforms
home = Path.home()  # Gets user home directory

# Also good: os.getenv with default
api_key = os.getenv("WEATHER_API_KEY", "default_key")

# AVOID: Assumes specific shell
os.environ["WEATHER_API_KEY"]  # Will fail if not set

# Handle case-sensitivity (Windows is case-insensitive for env vars)
# But Python sees them as case-sensitive:
api_key_upper = os.getenv("WEATHER_API_KEY")   # Might be None
api_key_lower = os.getenv("weather_api_key")   # Might be None
api_key_either = os.getenv("WEATHER_API_KEY") or os.getenv("weather_api_key")
```

---

## Part 3: CUDA and GPU Dependency Management (5 minutes)

### When Does Your MCP Server Need CUDA?

You need to handle CUDA if your server:

- Uses PyTorch, TensorFlow, or other ML frameworks
- Does GPU-accelerated inference
- Uses vector databases like Faiss with GPU support
- Performs tensor operations on GPU

### The Problem

```python
# PROBLEM: Hardcoding GPU dependencies
import torch  # Requires CUDA 11.8
import faiss

# User without GPU gets confusing errors:
# "RuntimeError: CUDA runtime error (4) : unknown error"
# or "ImportError: No module named 'torch'"
```

### Solution: Optional GPU Dependencies

**In pyproject.toml**:

```toml
[project]
name = "weather-mcp-server"
# ... other config ...
dependencies = [
    "mcp>=0.3.0",
]

[project.optional-dependencies]
dev = [
    "pytest>=7.0",
]

# GPU support is OPTIONAL
gpu = [
    "torch>=2.0; sys_platform == 'win32'",
    "faiss-cpu>=1.7.4; sys_platform == 'win32' and extra != 'gpu'",
    "faiss-gpu>=1.7.4; sys_platform == 'win32' and extra == 'gpu'",
]

# Lightweight CPU-only version
cpu = [
    "faiss-cpu>=1.7.4",
]
```

**In your code**:

```python
"""Weather MCP server with optional GPU support."""

import sys

# Try to import GPU libraries, fall back to CPU
gpu_available = False

try:
    import torch
    import faiss
    gpu_available = torch.cuda.is_available()
except ImportError:
    print("GPU libraries not installed, using CPU mode", file=sys.stderr)

def initialize_faiss():
    """Initialize Faiss index with GPU if available."""
    dimension = 768
    
    if gpu_available:
        # Use GPU-accelerated Faiss
        import faiss
        gpu_resource = faiss.StandardGpuResources()
        cpu_index = faiss.IndexFlatL2(dimension)
        gpu_index = faiss.index_cpu_to_gpu(gpu_resource, 0, cpu_index)
        return gpu_index
    else:
        # Fall back to CPU-only Faiss
        import faiss
        return faiss.IndexFlatL2(dimension)
```

**Users install based on their needs**:

```powershell
# CPU-only installation (no CUDA needed)
pip install weather-mcp-server[cpu]

# GPU-enabled installation (requires CUDA)
pip install weather-mcp-server[gpu]

# Default installation (no GPU libraries)
pip install weather-mcp-server
```

### CUDA on Windows Specifics

#### Checking CUDA Installation

```powershell
# In PowerShell, check if CUDA is installed
if (Test-Path "C:\Program Files\NVIDIA GPU Computing Toolkit") {
    Write-Host "CUDA is installed"
} else {
    Write-Host "CUDA not found"
}

# Or from Python:
import subprocess
result = subprocess.run(["nvidia-smi"], capture_output=True)
if result.returncode == 0:
    print("NVIDIA GPU found")
else:
    print("No NVIDIA GPU detected")
```

#### Common CUDA Issues on Windows

**Issue 1: CUDA version mismatch**

```python
# PROBLEM: PyTorch compiled for CUDA 11.8, but user has CUDA 12.0
# Error: "The GPU doesn't support running CUDA"

# SOLUTION: Document CUDA requirements clearly
```

Document in README.md:

```markdown
## GPU Support (Optional)

### Requirements
- NVIDIA GPU with CUDA compute capability 3.0+
- NVIDIA CUDA Toolkit 12.0 or higher
- cuDNN 8.0+

### Installation
```bash
# Check your CUDA version
nvidia-smi

# Install with GPU support
pip install weather-mcp-server[gpu]
```

### Troubleshooting
- "CUDA out of memory": Reduce batch size
- "CUDA runtime error (4)": Check GPU drivers are up to date
```

**Issue 2: Multiple CUDA versions**

Windows can have multiple CUDA versions installed. Users need the right one:

```python
import os
import torch

# Show which CUDA version PyTorch is using
print(f"PyTorch CUDA version: {torch.version.cuda}")
print(f"GPU available: {torch.cuda.is_available()}")

# Print GPU info
if torch.cuda.is_available():
    print(f"GPU count: {torch.cuda.device_count()}")
    print(f"Current GPU: {torch.cuda.current_device()}")
    print(f"GPU name: {torch.cuda.get_device_name(0)}")
```

**Issue 3: Tensor Core/Library Incompatibilities**

Different NVIDIA GPUs support different features:

```python
import torch

# Check compute capability
if torch.cuda.is_available():
    major, minor = torch.cuda.get_device_capability()
    compute_capability = major * 10 + minor
    
    if compute_capability < 30:
        print("Warning: GPU too old for modern frameworks")
    elif compute_capability >= 80:
        print("GPU supports Tensor Cores")
```

---

## Part 4: Windows Security & Permissions (5 minutes)

### Issue 1: Execution Policies (PowerShell)

PowerShell has execution policies that might prevent running scripts:

```powershell
# Check current policy
Get-ExecutionPolicy

# User might see error:
# "cannot be loaded because running scripts is disabled on this system"

# SOLUTION for MCP: Don't use scripts, use Python directly
# Instead of: launch-mcp.ps1
# Do: python -m weather_mcp_server
```

### Issue 2: File Permissions

Your MCP server needs to read/write files. Windows permissions might block this:

```python
import os
from pathlib import Path

def ensure_writable(path):
    """Ensure file/directory is writable."""
    path = Path(path)
    
    # Create directory if needed
    path.mkdir(parents=True, exist_ok=True)
    
    # Test write permission
    test_file = path / ".write_test"
    try:
        test_file.touch()
        test_file.unlink()
    except PermissionError:
        raise PermissionError(
            f"No write permission for {path}\n"
            "Try running as administrator or choose a different directory."
        )

# Use in your server
config_dir = Path.home() / ".mcp_config"
ensure_writable(config_dir)
```

### Issue 3: Registry Access (Advanced)

Some Windows configurations require registry access. Avoid unless necessary:

```python
# AVOID - Requires special permissions
import winreg
registry = winreg.ConnectRegistry(None, winreg.HKEY_LOCAL_MACHINE)

# Instead: Document requirements and ask user for admin if needed
print("Warning: Some features may require administrator privileges")
```

### Issue 4: Antivirus/Windows Defender

Windows Defender or third-party antivirus might:
- Quarantine your package
- Slow down file access
- Block network connections

**Best practices**:

```python
# 1. Sign your code (expensive but helps)
# 2. Use reputable certificate authorities
# 3. Don't do anything suspicious in your code:

# GOOD
import json
config = json.load(open(config_file))

# SUSPICIOUS (to antivirus)
import subprocess
subprocess.run("powershell.exe ...", shell=True)  # This triggers alerts!

# ALSO SUSPICIOUS
exec(code_string)  # Dynamic code execution
```

### Issue 5: AppData vs Temp Directories

Use the right directory for persistent data:

```python
from pathlib import Path
import os

# WRONG - Temp files get deleted, don't persist data here
temp_dir = Path(os.getenv("TEMP"))  # C:\Users\Name\AppData\Local\Temp

# RIGHT - Use AppData for persistent config/cache
appdata = Path(os.getenv("APPDATA"))  # C:\Users\Name\AppData\Roaming
config_dir = appdata / "NOVA_MCP"

# RIGHT - Use LocalAppData for user-specific cache (not synced across machines)
local_appdata = Path(os.getenv("LOCALAPPDATA"))  # C:\Users\Name\AppData\Local
cache_dir = local_appdata / "NOVA_MCP" / "cache"
```

**Directory purposes**:
- `APPDATA` (`%APPDATA%`): Roaming config that syncs across machines
- `LOCALAPPDATA` (`%LOCALAPPDATA%`): User-specific, machine-local data
- `TEMP` (`%TEMP%`): Temporary files that can be deleted

---

## Part 5: Testing Your MCP Server on Windows (10 minutes)

### Step 1: Test in Fresh Virtual Environment

```powershell
# Simulate a clean Windows installation
python -m venv clean_test_env
.\clean_test_env\Scripts\Activate.ps1

# Install your package
pip install -e .

# Try basic import
python -c "from weather_mcp_server import server; print('Success')"

# Start the server
python -m weather_mcp_server
```

### Step 2: Test with Different Python Versions

Windows users might have Python 3.8, 3.10, 3.11, 3.12:

```powershell
# Use pyenv-win or just test with installed versions
py --list
# Shows: 3.8.10, 3.10.5, 3.11.0, 3.12.1

# Test each version
py -3.8 -m venv test_38
.\test_38\Scripts\Activate.ps1
pip install .
python -m weather_mcp_server

# Repeat for 3.10, 3.11, 3.12
```

### Step 3: Test Path Handling

```python
"""Test that your server handles Windows paths correctly."""

from pathlib import Path
import json

# Test 1: Create config in AppData
def test_appdata_config():
    import os
    appdata = Path(os.getenv("APPDATA"))
    config_dir = appdata / "TestMCP"
    config_dir.mkdir(parents=True, exist_ok=True)
    
    config_file = config_dir / "config.json"
    config_file.write_text(json.dumps({"test": "data"}))
    
    assert config_file.exists()
    assert json.loads(config_file.read_text()) == {"test": "data"}
    print("✓ AppData config working")

# Test 2: Test with long paths
def test_long_paths():
    base = Path.home() / "Desktop"
    long_path = base / "a" * 50 / "b" * 50 / "c" * 50
    long_path.mkdir(parents=True, exist_ok=True)
    
    test_file = long_path / "test.txt"
    test_file.write_text("test data")
    
    assert test_file.exists()
    print("✓ Long path support working")

# Test 3: Test UNC paths (if applicable)
def test_unc_paths():
    # Only test if network share is available
    unc_path = Path("//localhost/c$")  # Administrative share
    # This might fail, which is OK
    if unc_path.exists():
        print("✓ UNC paths accessible")
    else:
        print("⚠ UNC paths not available (expected in some environments)")

if __name__ == "__main__":
    test_appdata_config()
    test_long_paths()
    test_unc_paths()
```

### Step 4: Test in Claude Desktop

The real test - does it work where users will use it?

```json
{
  "mcpServers": {
    "weather": {
      "command": "python",
      "args": ["-m", "weather_mcp_server"]
    }
  }
}
```

1. Add to Claude Desktop config
2. Restart Claude
3. Try using the tool
4. Check Claude logs for errors

### Step 5: Stress Test Windows-Specific Features

```python
"""Test Windows-specific edge cases."""

import os
import time
from pathlib import Path

def test_concurrent_file_access():
    """Test multiple threads accessing same file (Windows locking issue)."""
    import threading
    
    test_file = Path("test_concurrent.txt")
    errors = []
    
    def write_file(thread_id):
        try:
            for i in range(10):
                with open(test_file, 'a') as f:
                    f.write(f"Thread {thread_id}: {i}\n")
                time.sleep(0.01)
        except Exception as e:
            errors.append(e)
    
    threads = [threading.Thread(target=write_file, args=(i,)) for i in range(5)]
    for t in threads:
        t.start()
    for t in threads:
        t.join()
    
    test_file.unlink()
    
    if errors:
        print(f"⚠ Concurrent file access issues: {errors}")
    else:
        print("✓ Concurrent file access working")

def test_special_characters():
    """Test file names with special Windows characters."""
    test_dir = Path("test_special")
    test_dir.mkdir(exist_ok=True)
    
    # These are fine
    (test_dir / "file_with-dash.txt").touch()
    (test_dir / "file with spaces.txt").touch()
    (test_dir / "file.with.dots.txt").touch()
    
    # These are NOT allowed on Windows
    forbidden = ['<', '>', ':', '"', '/', '\\', '|', '?', '*']
    for char in forbidden:
        try:
            (test_dir / f"file{char}name.txt").touch()
            print(f"⚠ Character '{char}' should not be allowed!")
        except (OSError, ValueError):
            pass  # Expected
    
    print("✓ Special character handling correct")

if __name__ == "__main__":
    test_concurrent_file_access()
    test_special_characters()
```

---

## Part 6: Windows-Specific Documentation (5 minutes)

### Add to Your README.md

```markdown
## Windows-Specific Notes

### Installation

```bash
# Standard pip installation works on Windows
pip install weather-mcp-server

# For GPU support (NVIDIA GPUs only):
pip install weather-mcp-server[gpu]
```

### Requirements

- **Python 3.8+** (3.10+ recommended on Windows)
- **No special permissions required** (unless using GPUs)
- **Windows 10 (build 1909+) or Windows 11** recommended

### Known Windows Issues & Solutions

#### Issue: "Python not found" or "python is not recognized"

Python must be in your PATH. During installation, make sure you check "Add Python to PATH".

Fix:
1. Uninstall Python
2. Reinstall and CHECK "Add Python to PATH" during setup
3. Restart PowerShell/cmd.exe
4. Try again

#### Issue: "SyntaxError: (unicode error) 'unicodeescape' codec can't decode"

You're likely using backslashes in file paths. This is an old Python issue, now fixed. Update Python:

```powershell
python --version  # Should be 3.8+
# If older, upgrade Python
```

#### Issue: MCP Server doesn't appear in Claude Desktop

1. Verify syntax of `claude_desktop_config.json` (use JSON validator)
2. Ensure file path is correct: `%APPDATA%\Claude\claude_desktop_config.json`
3. Restart Claude Desktop completely
4. Check Claude Desktop output for error messages

#### Issue: "No module named 'weather_mcp_server'"

The package isn't installed correctly.

Fix:
```powershell
# Uninstall and reinstall
pip uninstall weather-mcp-server
pip install weather-mcp-server

# Verify installation
pip show weather-mcp-server
```

### GPU Support (NVIDIA Only)

If you installed with `[gpu]` but don't have an NVIDIA GPU:

```powershell
pip uninstall faiss-gpu
pip install faiss-cpu
```

If you have an NVIDIA GPU but getting "CUDA runtime error":

```powershell
# Check NVIDIA drivers
nvidia-smi

# Update drivers from https://www.nvidia.com/Download/driverDetails.aspx

# Check PyTorch CUDA compatibility
python -c "import torch; print(torch.cuda.is_available())"
```

### Configuration Files

MCP server stores configuration in:
- **Windows**: `C:\Users\YourName\AppData\Roaming\NOVA_MCP\`

For organization-wide deployment, use:
- **Windows**: `C:\ProgramData\NOVA_MCP\` (requires admin)

### Antivirus/Defender Issues

Windows Defender might quarantine the package. This is normal for new packages.

If this happens:
1. Report to Windows Defender team (it's safe)
2. Alternatively, use `pip install --user` to install to your user directory only
3. Or whitelist the Python installation directory in Windows Defender

### File Path Limits

Windows has a 260-character path limit. We automatically handle this, but if you see errors:

Enable long paths (Windows 10 v1607+):

**PowerShell (as Administrator)**:
```powershell
New-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Control\FileSystem" `
  -Name "LongPathsEnabled" -Value 1 -PropertyType DWORD -Force
```

**Or via Registry Editor**:
1. Press `Win+R`
2. Type `regedit`
3. Navigate to `HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\FileSystem`
4. Set `LongPathsEnabled` to `1`
5. Restart

### Permissions Issues

If you get "Permission Denied" errors:

1. Run as administrator (not recommended for security)
2. Or install to user directory: `pip install --user weather-mcp-server`
3. Or choose different data directory: Set `WEATHER_MCP_DATA_DIR` environment variable

### Performance on Windows

Windows file I/O is sometimes slower than Unix systems, especially for network paths. If you notice lag:

1. Store data on local drive (C:), not network drive
2. Disable antivirus scanning of your MCP data directory
3. Use SSD instead of HDD

### Development on Windows

If contributing or developing:

```powershell
# Use Windows-friendly virtual environment
python -m venv venv
.\venv\Scripts\Activate.ps1

# Install with dev dependencies
pip install -e ".[dev]"

# Run tests
pytest tests/ -v

# Format code (compatible with all OSes)
black src/
```
```

---

## Windows-Specific Checklist

Before releasing, verify:

- [ ] Installation works on Windows 10 and 11
- [ ] File paths use `Path` or forward slashes, never raw backslashes
- [ ] No shell-specific commands (only Python)
- [ ] Optional GPU dependencies documented
- [ ] CUDA requirements clearly listed (if applicable)
- [ ] Tests pass on Python 3.8, 3.10, 3.11, 3.12
- [ ] README includes Windows-specific troubleshooting
- [ ] Works in both PowerShell and cmd.exe
- [ ] Handles UNC paths if applicable
- [ ] AppData/LocalAppData directory usage correct
- [ ] Long path support tested (if relevant)
- [ ] No permission issues when run as non-admin user

---

## Quick Reference: Windows Gotchas

| Problem | Solution |
|---------|----------|
| Backslash syntax errors | Use `Path()` or forward slashes |
| CUDA version mismatch | Document CUDA requirements, make GPU optional |
| Path too long (>260 chars) | Enable long paths or use `Path()` |
| PowerShell vs cmd.exe differences | Use only Python, no shell scripts |
| Antivirus blocks installation | Add to whitelist or sign your code |
| File locked by antivirus | Disable scanning during file operations |
| GPU not detected | Check `nvidia-smi` and driver updates |
| UNC path access denied | Add to allowed locations or enable sharing |
| Temp files persist | Use `APPDATA` not `TEMP` for persistent data |
| Environment vars case-sensitive in Python | Query all cases or use `os.getenv()` with fallback |

---

## Additional Resources

- **Python Path Documentation**: https://docs.python.org/3/library/pathlib.html
- **Windows Execution Policies**: https://docs.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_execution_policies
- **Windows CUDA Installation**: https://docs.nvidia.com/cuda/cuda-installation-guide-microsoft-windows/
- **Windows Registry**: https://docs.microsoft.com/en-us/windows/win32/sysinfo/registry
- **Python on Windows**: https://docs.python.org/3/using/windows.html
- **PyTorch Installation**: https://pytorch.org/get-started/locally/
- **Appdata Directories**: https://docs.microsoft.com/en-us/windows/win32/shell/csidl

---

## Key Takeaways

**Windows File Paths**:
- Use `Path()` from pathlib (best)
- Or forward slashes: `"C:/Users/Name/file.txt"`
- Never raw backslashes (causes escape sequence errors)

**Shell Compatibility**:
- Write pure Python code, not shell scripts
- No PowerShell, cmd.exe, or Bash-specific features
- Use entry points in pyproject.toml instead

**GPU/CUDA**:
- Make GPU optional via `optional-dependencies`
- Document CUDA version requirements
- Handle missing CUDA libraries gracefully

**Windows Specifics**:
- Use AppData for persistent config
- Use LocalAppData for machine-local cache
- Handle 260-character path limit
- Be aware of file locking in concurrent scenarios

**Testing**:
- Test on actual Windows systems
- Test across Python versions (3.8-3.12)
- Test in Claude Desktop (the real use case)
- Document Windows-specific issues in README

