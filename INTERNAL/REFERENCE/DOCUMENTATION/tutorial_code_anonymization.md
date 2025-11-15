# Tutorial: Anonymizing Code for Public Release

## What You'll Learn

By the end of this tutorial, you'll be able to:

- Identify personal information scattered throughout your codebase
- Remove hardcoded paths, usernames, and sensitive data systematically
- Create configurable defaults instead of hardcoded values
- Sanitize documentation and comments
- Audit your code for accidental information leakage
- Create a pre-release checklist for anonymization

## Prerequisites

Before starting, ensure you have:

- **Your MCP server code**: weather-mcp-server from previous tutorials
- **Text editor with search/replace**: VS Code (recommended)
- **Git installed**: For reviewing changes
- **Understanding of your codebase**: Know where personal data might be
- **10-15 minutes** to complete

## Time Estimate

**Total**: 20-30 minutes
- Identification: 5 minutes
- Path sanitization: 5 minutes
- Comment/documentation scrubbing: 5 minutes
- Configuration setup: 5 minutes
- Audit & verification: 5 minutes

## Final Result

You'll have:
- Codebase with no personal information leakage
- Configurable defaults for user customization
- Safe to publish on PyPI and GitHub
- Reusable checklist for future releases

---

## Part 1: What Needs Anonymization? (5 minutes)

### Common Information Leaks

Developers often accidentally publish:

**Paths & File Locations**
```python
# WRONG - Reveals personal directory structure
CONFIG_PATH = r"C:\Users\JasonGlass\Desktop\NOVA_MASTER\config.json"
LOG_FILE = r"C:\Users\JasonGlass\Documents\logs\app.log"
DATABASE = r"C:\Users\JasonGlass\AppData\Roaming\myapp\data.db"
```

**Names & Emails**
```python
# WRONG - Reveals author/developer names
AUTHOR = "Jason Glass"
MAINTAINER_EMAIL = "jason.glass@company.com"
CREATED_BY = "Pirate (Jason's alter ego)"

# In docstrings:
"""
Created by Jason Glass on 2024-01-15
For questions, contact jason.glass@example.com
"""
```

**Usernames & Credentials**
```python
# WRONG - Even if not real, implies pattern
GITHUB_USER = "jasonglass"
DISCORD_USER = "Pirate#1234"
API_KEY = "sk-abc123def456..."  # Dummy but same format

# In comments:
# TODO: Ask @jason-glass for review
# This was in Jason's original version
```

**Organization Names**
```python
# WRONG - Reveals employer/organization
COMPANY = "Anthropic"
TEAM = "NOVA Research Lab"
PROJECT_CODE = "Project Odyssey"
```

**System Information**
```python
# WRONG - Reveals development environment
PYTHON_VERSION = "3.11.0"  # OK to mention, but...
SYSTEM = "Windows 11 Build 26100"  # Too specific
GPU_MODEL = "RTX 3090"  # Too specific
```

**Internal URLs & IPs**
```python
# WRONG - Reveals internal infrastructure
API_ENDPOINT = "https://internal-api.mycompany.com/v1"
DATABASE_HOST = "192.168.1.100"
MONITORING_DASHBOARD = "https://grafana.internal.company"
```

**Comments Revealing Development Context**
```python
# WRONG - Too much context about author's life
# This function took me 3 hours to debug yesterday at 2am
# I was listening to Tool while coding this
# My boss wanted this done by Friday but I did it in a day
# Reference: conversation with Jason on Oct 15

# TODO: @jason fix this before demo
# FIXME: Jason said this would work, but it doesn't
```

---

## Part 2: Systematic Path Sanitization (5 minutes)

### Step 2.1: Find All Hardcoded Paths

Use VS Code's Find & Replace with regex:

```
Search pattern: [C-Z]:\\Users\\[^\\]+\\
Replace with: <user_home>/
```

Or in PowerShell:

```powershell
# Find all hardcoded paths in Python files
Get-ChildItem -Recurse -Include "*.py" | 
  ForEach-Object {
    Select-String -Pattern '[C-Z]:\\Users\\.*\\' -Path $_ -List |
    ForEach-Object { "$($_.Path): $($_.Line.Trim())" }
  }
```

### Step 2.2: Replace with Configurable Paths

**Before** (in src/weather_mcp_server/config.py):
```python
"""Configuration with hardcoded paths."""

# WRONG - Personal paths hardcoded
CONFIG_DIR = r"C:\Users\Jason\AppData\Roaming\weather_mcp"
LOG_FILE = r"C:\Users\Jason\Desktop\weather_mcp.log"
CACHE_DIR = r"C:\Users\Jason\AppData\Local\weather_mcp\cache"
```

**After** (proper version):
```python
"""Configuration with flexible, user-friendly paths."""

from pathlib import Path
import os

def get_config_dir():
    """
    Get configuration directory.
    
    Returns:
        Path: Configuration directory, uses standard platform locations
        
    Priority:
        1. WEATHER_MCP_CONFIG environment variable
        2. ~/.config/weather-mcp on Linux/Mac
        3. %APPDATA%/weather-mcp on Windows
        4. Falls back to user home directory
    
    Examples:
        Windows: C:/Users/YourName/AppData/Roaming/weather-mcp
        Linux: /home/yourname/.config/weather-mcp
        Mac: /Users/yourname/Library/Application Support/weather-mcp
    """
    # 1. Check environment variable
    env_config = os.getenv("WEATHER_MCP_CONFIG")
    if env_config:
        return Path(env_config)
    
    # 2. Use platform-standard locations
    home = Path.home()
    
    if os.name == "nt":  # Windows
        appdata = Path(os.getenv("APPDATA", home))
        return appdata / "weather-mcp"
    elif os.name == "posix":  # Linux/Mac
        if os.uname().sysname == "Darwin":  # Mac
            return home / "Library" / "Application Support" / "weather-mcp"
        else:  # Linux
            return home / ".config" / "weather-mcp"
    
    # 3. Fallback
    return home / ".weather-mcp"


def get_log_file():
    """
    Get log file path.
    
    Returns:
        Path: Log file location
        
    Can be overridden with WEATHER_MCP_LOG environment variable.
    """
    env_log = os.getenv("WEATHER_MCP_LOG")
    if env_log:
        return Path(env_log)
    
    config_dir = get_config_dir()
    config_dir.mkdir(parents=True, exist_ok=True)
    return config_dir / "weather_mcp.log"


def get_cache_dir():
    """
    Get cache directory for temporary data.
    
    Returns:
        Path: Cache directory location
        
    Can be overridden with WEATHER_MCP_CACHE environment variable.
    """
    env_cache = os.getenv("WEATHER_MCP_CACHE")
    if env_cache:
        return Path(env_cache)
    
    if os.name == "nt":  # Windows
        localappdata = Path(os.getenv("LOCALAPPDATA"))
        cache_dir = localappdata / "weather-mcp" / "cache"
    else:  # Linux/Mac
        cache_dir = get_config_dir() / "cache"
    
    cache_dir.mkdir(parents=True, exist_ok=True)
    return cache_dir


# Use these functions instead of hardcoded paths
CONFIG_DIR = get_config_dir()
LOG_FILE = get_log_file()
CACHE_DIR = get_cache_dir()
```

### Step 2.3: Document Configuration Options

Add to README.md:

```markdown
## Configuration

Weather MCP Server is configurable via environment variables:

### Configuration Directories

| Variable | Purpose | Default |
|----------|---------|---------|
| `WEATHER_MCP_CONFIG` | Config directory | See below |
| `WEATHER_MCP_LOG` | Log file location | `{CONFIG_DIR}/weather_mcp.log` |
| `WEATHER_MCP_CACHE` | Cache directory | Platform-specific |

### Default Locations

**Windows:**
- Config: `C:\Users\YourName\AppData\Roaming\weather-mcp\`
- Cache: `C:\Users\YourName\AppData\Local\weather-mcp\cache\`
- Logs: `C:\Users\YourName\AppData\Roaming\weather-mcp\weather_mcp.log`

**Linux:**
- Config: `~/.config/weather-mcp/`
- Cache: `~/.config/weather-mcp/cache/`
- Logs: `~/.config/weather-mcp/weather_mcp.log`

**Mac:**
- Config: `~/Library/Application Support/weather-mcp/`
- Cache: `~/Library/Application Support/weather-mcp/cache/`
- Logs: `~/Library/Application Support/weather-mcp/weather_mcp.log`

### Examples

```bash
# Use custom config directory
export WEATHER_MCP_CONFIG=/etc/weather-mcp
weather-mcp-server

# Use custom log location
export WEATHER_MCP_LOG=/var/log/weather-mcp.log
weather-mcp-server

# Override cache directory
export WEATHER_MCP_CACHE=/tmp/weather-cache
weather-mcp-server
```
```

---

## Part 3: Comment & Documentation Scrubbing (5 minutes)

### Step 3.1: Remove Personal Context from Comments

**Before** (reveals personal information):
```python
def get_weather(city: str, unit: str = "celsius") -> dict:
    """
    Get current weather for a city.
    
    TODO: @jason-glass - optimize this with caching
    NOTE: This took me 3 days to get right, see email from Oct 15
    HACK: Jason said this would work and it finally does!
    
    Created by Jason Glass on 2024-01-15
    Last modified by Pirate (Jason's alter ego) on 2024-01-20
    Contact: jason.glass@example.com for questions
    
    Args:
        city: City name (e.g., 'New York')
        unit: Temperature unit (default: celsius)
    
    Returns:
        dict: Weather data with temp, condition, humidity
    """
    # Get data - this is where Jason's magic happens
    weather_data = {
        "new york": {"temp": 15, "condition": "Cloudy", "humidity": 65},
    }
    return weather_data
```

**After** (professional and impersonal):
```python
def get_weather(city: str, unit: str = "celsius") -> dict:
    """
    Get current weather for a city.
    
    Args:
        city: City name (e.g., 'New York')
        unit: Temperature unit - "celsius" or "fahrenheit" (default: "celsius")
    
    Returns:
        dict: Weather data with the following keys:
            - temp (float): Temperature value
            - condition (str): Weather condition (e.g., "Cloudy")
            - humidity (int): Humidity percentage (0-100)
            - unit (str): Temperature unit ("C" or "F")
    
    Raises:
        ValueError: If city is not in supported cities list
    
    Examples:
        >>> result = get_weather("New York")
        >>> print(result["temp"])
        15
        >>> result = get_weather("London", unit="fahrenheit")
        >>> print(result["unit"])
        'F'
    """
    weather_data = {
        "new york": {"temp": 15, "condition": "Cloudy", "humidity": 65},
    }
    return weather_data
```

### Step 3.2: Clean Up TODO/FIXME Comments

**Bad TODOs** (reveal personal details):
```python
# TODO: @jason fix this before Friday
# FIXME: Ask Pirate why this doesn't work
# BUG: Jason said it works but I don't believe him
# HACK: This is a temporary fix for the demo
```

**Good TODOs** (actionable without personal context):
```python
# TODO: Add caching layer for performance improvement
# FIXME: Optimize temperature conversion algorithm
# ENHANCE: Add support for more cities
# REFACTOR: Reduce function complexity
# PERF: Improve response time for large queries
```

### Step 3.3: Remove Author Attribution from Code

**Before**:
```python
"""
Weather MCP Server
Author: Jason Glass
Created: January 15, 2024
Modified: January 20, 2024
Copyright: Jason Glass, 2024
Contact: jason.glass@example.com
Repository: https://github.com/jasonglass/weather-mcp-server
"""
```

**After** (use pyproject.toml instead):
```python
"""
Weather MCP Server

A Python MCP server providing weather information tools and resources.

For more information, see: https://github.com/yourname/weather-mcp-server
"""
```

Put author info in `pyproject.toml`:
```toml
[project]
name = "weather-mcp-server"
authors = [
    {name = "Your Name", email = "your.email@example.com"},
]
```

### Step 3.4: Sanitize Module Docstrings

**Before**:
```python
"""
config.py - Configuration management for Weather MCP Server
Created by Jason Glass on 2024-01-15
Last updated by Jason on 2024-01-20 (added user home support)
For questions: jason.glass@company.com
"""
```

**After**:
```python
"""
Configuration management for Weather MCP Server.

Handles loading and managing configuration from environment variables and files.
Supports customizable paths via standard environment variables.
"""
```

---

## Part 4: Remove Hardcoded Names & Identifiers (5 minutes)

### Step 4.1: Replace Names in Test Data

**Before**:
```python
# In tests/test_weather.py
def test_get_weather():
    """Test weather retrieval (wrote this, jason.glass)."""
    result = get_weather("New York")
    # This was failing when Jason first wrote it
    assert result["temp"] == 15
    # TODO: Ask Jason why this is flaky

MOCK_DATA = {
    "new york": {"temp": 15, "condition": "Cloudy", "humidity": 65},
    # Jason's favorite city
    "london": {"temp": 12, "condition": "Rainy", "humidity": 80},
}
```

**After**:
```python
# In tests/test_weather.py
def test_get_weather():
    """Test weather retrieval for New York."""
    result = get_weather("New York")
    assert result["temp"] == 15
    assert "condition" in result
    assert "humidity" in result

MOCK_DATA = {
    "new york": {
        "temp": 15,
        "condition": "Cloudy",
        "humidity": 65,
        "description": "Cool and mostly cloudy"
    },
    "london": {
        "temp": 12,
        "condition": "Rainy",
        "humidity": 80,
        "description": "Cool and rainy"
    },
}
```

### Step 4.2: Remove Personal Identifiers from Examples

**Before** (in docstrings/README):
```python
"""
Example usage by Jason Glass:

from weather_mcp_server import server
# Jason always calls get_weather first
result = server.get_weather("New York")
# Contact jason.glass@example.com for issues
"""
```

**After**:
```python
"""
Example usage:

from weather_mcp_server import server

# Get current weather
result = server.get_weather("New York")
print(result["temp"])  # Output: 15

# Get forecast
forecast = server.get_weather("London")
print(forecast["condition"])  # Output: Rainy
"""
```

### Step 4.3: Sanitize Environment-Specific Code

**Before**:
```python
# Windows-specific handling for Jason's setup
if sys.platform == "win32":
    # Jason's machine has CUDA 12.0
    CUDA_VERSION = "12.0"
    # His RTX 3090 is registered
    GPU_DEVICE = 0
```

**After**:
```python
# Cross-platform path handling
if sys.platform == "win32":
    # Use AppData for Windows configuration
    config_dir = Path(os.getenv("APPDATA")) / "weather-mcp"
else:
    # Use standard Unix config directory
    config_dir = Path.home() / ".config" / "weather-mcp"

# Auto-detect GPU if available
try:
    import torch
    GPU_AVAILABLE = torch.cuda.is_available()
    if GPU_AVAILABLE:
        CUDA_VERSION = torch.version.cuda
except ImportError:
    GPU_AVAILABLE = False
```

---

## Part 5: Configuration File Best Practices (5 minutes)

### Step 5.1: Create Example Configuration File

Create `example_config.json` (instead of users copying your personal config):

```json
{
    "comment": "This is an example configuration. Copy to ~/.config/weather-mcp/config.json and edit.",
    
    "weather": {
        "default_unit": "celsius",
        "cache_ttl_seconds": 3600,
        "max_cities": 50,
        "timeout_seconds": 10
    },
    
    "logging": {
        "level": "INFO",
        "format": "%(asctime)s - %(name)s - %(levelname)s - %(message)s",
        "file_rotation": {
            "enabled": true,
            "max_bytes": 10485760,
            "backup_count": 5
        }
    },
    
    "api": {
        "comment": "Leave empty to use mock data. For real API, set your key.",
        "provider": "openweathermap",
        "api_key": "",
        "endpoint": "https://api.openweathermap.org/data/2.5"
    }
}
```

### Step 5.2: Create Configuration Reader

```python
"""Configuration file handling."""

import json
import os
from pathlib import Path
from typing import Any, Dict

def load_config() -> Dict[str, Any]:
    """
    Load configuration from file or use defaults.
    
    Priority:
        1. WEATHER_MCP_CONFIG environment variable (path to config file)
        2. Standard config directory (see get_config_dir())
        3. Hardcoded defaults in this function
    
    Returns:
        dict: Configuration dictionary
    """
    # Check environment variable for config file
    env_config_file = os.getenv("WEATHER_MCP_CONFIG_FILE")
    if env_config_file:
        config_path = Path(env_config_file)
        if config_path.exists():
            return _load_json_config(config_path)
    
    # Check standard location
    config_dir = get_config_dir()
    config_file = config_dir / "config.json"
    if config_file.exists():
        return _load_json_config(config_file)
    
    # Return defaults
    return {
        "weather": {
            "default_unit": "celsius",
            "cache_ttl_seconds": 3600,
        },
        "logging": {
            "level": "INFO",
        },
        "api": {
            "provider": "mock",  # Use mock data by default
            "api_key": "",
        }
    }


def _load_json_config(path: Path) -> Dict[str, Any]:
    """Load and validate JSON config file."""
    try:
        with open(path, 'r') as f:
            return json.load(f)
    except json.JSONDecodeError as e:
        raise ValueError(f"Invalid JSON in config file {path}: {e}")
    except IOError as e:
        raise ValueError(f"Cannot read config file {path}: {e}")


def save_example_config():
    """Create example config file if it doesn't exist."""
    config_dir = get_config_dir()
    example_file = config_dir / "config.example.json"
    
    example_config = {
        "comment": "This is an example configuration.",
        "weather": {"default_unit": "celsius"},
        "logging": {"level": "INFO"},
        "api": {"provider": "mock", "api_key": ""}
    }
    
    if not example_file.exists():
        with open(example_file, 'w') as f:
            json.dump(example_config, f, indent=2)
```

---

## Part 6: Audit & Verification (5 minutes)

### Step 6.1: Automated Scanning Script

Create `tools/anonymization_audit.py`:

```python
"""
Audit script to find potential personal information leaks.

Run before each release to catch accidental information leakage.
"""

import re
from pathlib import Path
from typing import List, Tuple

# Patterns that might indicate personal information
SUSPICIOUS_PATTERNS = [
    # Hardcoded paths
    (r'[C-Z]:\\Users\\[^\\]+\\', 'Hardcoded user path'),
    (r'/Users/[^/]+/', 'Mac user home path'),
    (r'/home/[^/]+/', 'Linux user home path'),
    
    # Email addresses
    (r'[\w\.-]+@[\w\.-]+\.\w+', 'Email address'),
    
    # GitHub/social usernames
    (r'@[\w-]+', 'Username mention'),
    
    # Specific names (common patterns)
    (r'\b(jason|pirate|glass|Pirate|Jason|Glass)\b', 'Possible author name'),
    
    # API keys/tokens (dummy pattern)
    (r'(api[_-]?key|token|secret|password)\s*[:=]\s*["\']?[\w\-]{20,}', 'Possible credential'),
    
    # Internal URLs
    (r'https?://internal', 'Internal URL'),
    (r'https?://[^\s]+\.internal', 'Internal domain'),
]

EXCLUDE_FILES = {
    '.git', '__pycache__', '.pytest_cache',
    'node_modules', '.venv', 'venv',
    '*.pyc', '.DS_Store'
}

def find_suspicious_patterns(root_dir: Path = Path(".")) -> List[Tuple[str, int, str, str]]:
    """
    Scan codebase for suspicious patterns.
    
    Returns:
        List of tuples: (file_path, line_number, pattern_description, matched_text)
    """
    findings = []
    
    for file_path in root_dir.rglob("*"):
        # Skip excluded files
        if any(file_path.match(exclude) for exclude in EXCLUDE_FILES):
            continue
        if file_path.is_dir():
            continue
        
        # Skip binary files
        if file_path.suffix in {'.pyc', '.so', '.dll', '.exe', '.bin', '.jpg', '.png'}:
            continue
        
        try:
            with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                for line_num, line in enumerate(f, 1):
                    for pattern, description in SUSPICIOUS_PATTERNS:
                        matches = re.finditer(pattern, line, re.IGNORECASE)
                        for match in matches:
                            findings.append((
                                str(file_path),
                                line_num,
                                description,
                                match.group(0)
                            ))
        except Exception as e:
            print(f"Warning: Could not read {file_path}: {e}")
    
    return findings

def print_audit_report(findings: List[Tuple[str, int, str, str]]):
    """Print human-readable audit report."""
    if not findings:
        print("✓ No suspicious patterns found!")
        return
    
    print(f"⚠ Found {len(findings)} potential issues:")
    print()
    
    # Group by file
    by_file = {}
    for file_path, line_num, description, matched in findings:
        if file_path not in by_file:
            by_file[file_path] = []
        by_file[file_path].append((line_num, description, matched))
    
    for file_path, issues in sorted(by_file.items()):
        print(f"{file_path}")
        for line_num, description, matched in issues:
            print(f"  Line {line_num}: {description}")
            print(f"    → {matched[:60]}{'...' if len(matched) > 60 else ''}")
        print()

if __name__ == "__main__":
    print("Scanning for suspicious patterns...")
    print()
    
    findings = find_suspicious_patterns()
    print_audit_report(findings)
    
    if findings:
        print("\nRecommendations:")
        print("1. Review each finding above")
        print("2. Remove or anonymize sensitive information")
        print("3. Use environment variables or config files for paths")
        print("4. Run this script again to verify")
        exit(1)
    else:
        print("Ready for public release!")
        exit(0)
```

### Step 6.2: Run the Audit

```powershell
# Before release, run the audit
python tools/anonymization_audit.py

# Should output:
# ✓ No suspicious patterns found!
# Ready for public release!
```

### Step 6.3: Manual Review Checklist

Even automated tools miss things. Manually check:

```markdown
## Pre-Release Anonymization Checklist

### Code Files
- [ ] No hardcoded file paths (use pathlib.Path or environment variables)
- [ ] No email addresses in code
- [ ] No author names in docstrings
- [ ] No GitHub usernames mentioned
- [ ] No internal company names or project code names
- [ ] No specific hardware details (GPU model, RAM amount, CPU)
- [ ] TODO/FIXME comments don't mention names
- [ ] No API keys or credentials (even dummy ones)

### Configuration Files
- [ ] No hardcoded paths in example configs
- [ ] Example configs use generic placeholders
- [ ] Default values don't reveal personal preferences
- [ ] Environment variables documented for customization

### Documentation
- [ ] README.md doesn't mention author's personal life
- [ ] Contributing guide is generic and inclusive
- [ ] No internal project names in docs
- [ ] Examples use generic city/company names
- [ ] Contact info is generic (Issues page, not personal email)

### Comments
- [ ] Development context removed from comments
- [ ] Personal notes removed
- [ ] References to specific people removed
- [ ] Timestamps removed (unless needed for documentation)
- [ ] Humor or personal commentary removed

### Version Control
- [ ] Git history doesn't contain sensitive info (if new repo)
- [ ] No secrets in commit messages
- [ ] Branch names don't reveal internal project info
- [ ] Tags follow semantic versioning (not personal notes)

### Test Data
- [ ] Mock data doesn't contain personal information
- [ ] Test fixtures don't reference real people
- [ ] Example outputs are generic

### Package Metadata
- [ ] author field is generic or your public identity
- [ ] email is public/work email, not personal
- [ ] homepage points to public repository
- [ ] keywords are generic (not "Jason's weather tool")

### Before Publishing
- [ ] Run anonymization_audit.py
- [ ] Manual review of suspicious files
- [ ] Ask someone else to review (pair of eyes)
- [ ] Git log is clean (no sensitive commits)
- [ ] Test installation: pip install -e .
```

---

## Part 7: Examples: Before & After (10 minutes)

### Example 1: Configuration Module

**BEFORE** (leaks personal info):
```python
# src/weather_mcp_server/config.py
"""
Configuration for Weather MCP Server
Author: Jason Glass (jason.glass@company.com)
Created: 2024-01-15
Last modified by Jason: 2024-01-20
"""

import os
from pathlib import Path

# Jason's setup on his Windows machine
CONFIG_DIR = Path(r"C:\Users\Jason\AppData\Roaming\weather-mcp")
LOG_FILE = Path(r"C:\Users\Jason\Desktop\weather_mcp.log")
CACHE_DIR = Path(r"C:\Users\Jason\AppData\Local\weather-mcp\cache")

# Jason's GPU
GPU_DEVICE = 0
CUDA_VERSION = "12.0"

# For Jason's email
MAINTAINER = "jason.glass@example.com"

def get_config():
    """Get configuration - written by Jason on 2024-01-15."""
    return {
        "api_key": "",  # Get from @jason-glass
        "max_cities": 50,  # Jason optimized this number
    }
```

**AFTER** (anonymized):
```python
# src/weather_mcp_server/config.py
"""
Configuration for Weather MCP Server.

Supports customization via environment variables and configuration files.
"""

import os
from pathlib import Path
from typing import Dict, Any

def get_config_dir() -> Path:
    """
    Get configuration directory following platform conventions.
    
    Override with WEATHER_MCP_CONFIG environment variable.
    
    Returns:
        Path to configuration directory
    """
    env_config = os.getenv("WEATHER_MCP_CONFIG")
    if env_config:
        return Path(env_config)
    
    home = Path.home()
    if os.name == "nt":  # Windows
        appdata = Path(os.getenv("APPDATA", home))
        return appdata / "weather-mcp"
    elif os.name == "posix":
        if os.uname().sysname == "Darwin":  # Mac
            return home / "Library" / "Application Support" / "weather-mcp"
        else:  # Linux
            return home / ".config" / "weather-mcp"
    return home / ".weather-mcp"

def get_log_file() -> Path:
    """
    Get log file path.
    
    Override with WEATHER_MCP_LOG environment variable.
    """
    env_log = os.getenv("WEATHER_MCP_LOG")
    if env_log:
        return Path(env_log)
    
    config_dir = get_config_dir()
    config_dir.mkdir(parents=True, exist_ok=True)
    return config_dir / "weather_mcp.log"

def get_cache_dir() -> Path:
    """
    Get cache directory for temporary data.
    
    Override with WEATHER_MCP_CACHE environment variable.
    """
    env_cache = os.getenv("WEATHER_MCP_CACHE")
    if env_cache:
        return Path(env_cache)
    
    home = Path.home()
    if os.name == "nt":
        localappdata = Path(os.getenv("LOCALAPPDATA", home))
        cache_dir = localappdata / "weather-mcp" / "cache"
    else:
        cache_dir = get_config_dir() / "cache"
    
    cache_dir.mkdir(parents=True, exist_ok=True)
    return cache_dir

def get_default_config() -> Dict[str, Any]:
    """
    Get default configuration.
    
    Can be overridden by config.json in config directory.
    """
    return {
        "weather": {
            "default_unit": "celsius",
            "max_cities": 100,
            "cache_ttl_seconds": 3600,
        },
        "gpu": {
            "enabled": False,  # Auto-detect, disable to force CPU
        }
    }
```

### Example 2: Test File

**BEFORE**:
```python
# tests/test_weather.py
"""
Weather tool tests - written by Jason Glass (jason.glass@example.com)
Created: 2024-01-15
This was tricky to debug - see notes from 2024-01-20
TODO: @jason-glass make this faster
"""

def test_get_weather_jason_favorite():
    """Test getting weather (Jason's favorite - London)."""
    result = get_weather("London")
    assert result["condition"] == "Rainy"  # Jason says London is always rainy

MOCK_DATA = {
    "london": {"temp": 12, "condition": "Rainy"},  # Jason's city
    "new york": {"temp": 15, "condition": "Cloudy"},  # I like this city
}

# Contact jason.glass@example.com for issues
```

**AFTER**:
```python
# tests/test_weather.py
"""
Unit tests for weather tool.

Tests cover current weather retrieval, temperature conversion, and error handling.
"""

def test_get_weather_london():
    """Test getting weather for London."""
    result = get_weather("London")
    assert "condition" in result
    assert "temp" in result
    assert isinstance(result["condition"], str)

def test_get_weather_temperature_conversion():
    """Test temperature unit conversion."""
    celsius = get_weather("London")["temp"]
    fahrenheit = get_weather("London", unit="fahrenheit")["temp"]
    
    # Verify conversion is correct
    expected_f = (celsius * 9/5) + 32
    assert abs(fahrenheit - expected_f) < 0.1

MOCK_DATA = {
    "london": {
        "temp": 12,
        "condition": "Rainy",
        "humidity": 80,
    },
    "new york": {
        "temp": 15,
        "condition": "Cloudy",
        "humidity": 65,
    },
}
```

### Example 3: README

**BEFORE**:
```markdown
# Weather MCP Server

Created by Jason Glass (jason.glass@example.com)

Jason built this to learn about MCP. It took him 3 days.

## Contact
For issues, email jason.glass@example.com or ask Jason directly.

## Author Notes
- Jason uses this with Claude Desktop
- He tested on his RTX 3090
- Works on Windows 11 Build 26100
```

**AFTER**:
```markdown
# Weather MCP Server

A Python MCP (Model Context Protocol) server providing weather information tools and resources.

## Features
- Current weather retrieval
- 7-day forecast
- Temperature unit conversion
- Configurable data storage locations

## Installation
```bash
pip install weather-mcp-server
```

## Support
- **Issues**: https://github.com/yourname/weather-mcp-server/issues
- **Documentation**: See README.md

## License
MIT License - see LICENSE file
```

---

## Part 8: Automation: Pre-Release Checklist (5 minutes)

Create `tools/pre_release.sh` (or PowerShell equivalent):

```bash
#!/bin/bash
# Pre-release verification script

echo "Running pre-release checks..."
echo ""

# 1. Anonymization audit
echo "1. Running anonymization audit..."
python tools/anonymization_audit.py
if [ $? -ne 0 ]; then
    echo "FAILED: Found suspicious patterns"
    exit 1
fi

# 2. Run tests
echo ""
echo "2. Running tests..."
pytest tests/ -v
if [ $? -ne 0 ]; then
    echo "FAILED: Tests did not pass"
    exit 1
fi

# 3. Check code quality
echo ""
echo "3. Checking code quality..."
pylint src/ --disable=C0114,C0116,W0212
if [ $? -ne 0 ]; then
    echo "WARNING: Pylint issues detected (non-blocking)"
fi

# 4. Type checking
echo ""
echo "4. Running type checker..."
mypy src/
if [ $? -ne 0 ]; then
    echo "WARNING: Type checking issues (non-blocking)"
fi

# 5. Build package
echo ""
echo "5. Building package..."
python -m build
if [ $? -ne 0 ]; then
    echo "FAILED: Could not build package"
    exit 1
fi

# 6. Validate package
echo ""
echo "6. Validating package..."
twine check dist/*
if [ $? -ne 0 ]; then
    echo "FAILED: Package validation failed"
    exit 1
fi

echo ""
echo "✓ All pre-release checks passed!"
echo "Ready to publish to PyPI"
```

Or **PowerShell version** (`tools/pre-release.ps1`):

```powershell
# Pre-release verification script for Windows

Write-Host "Running pre-release checks..." -ForegroundColor Green
Write-Host ""

# 1. Anonymization audit
Write-Host "1. Running anonymization audit..." -ForegroundColor Cyan
python tools/anonymization_audit.py
if ($LASTEXITCODE -ne 0) {
    Write-Host "FAILED: Found suspicious patterns" -ForegroundColor Red
    exit 1
}

# 2. Run tests
Write-Host "" 
Write-Host "2. Running tests..." -ForegroundColor Cyan
pytest tests/ -v
if ($LASTEXITCODE -ne 0) {
    Write-Host "FAILED: Tests did not pass" -ForegroundColor Red
    exit 1
}

# 3. Build package
Write-Host ""
Write-Host "3. Building package..." -ForegroundColor Cyan
python -m build
if ($LASTEXITCODE -ne 0) {
    Write-Host "FAILED: Could not build package" -ForegroundColor Red
    exit 1
}

# 4. Validate package
Write-Host ""
Write-Host "4. Validating package..." -ForegroundColor Cyan
twine check dist/*
if ($LASTEXITCODE -ne 0) {
    Write-Host "FAILED: Package validation failed" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "✓ All pre-release checks passed!" -ForegroundColor Green
Write-Host "Ready to publish to PyPI" -ForegroundColor Green
```

---

## Part 9: Complete Anonymization Checklist

Before publishing, verify ALL of these:

```markdown
## Final Anonymization Checklist

### Information to Remove
- [ ] User home directory paths (C:\Users\YourName\...)
- [ ] Email addresses (personal and work)
- [ ] Full names in code/docs
- [ ] GitHub usernames (@yourname)
- [ ] Internal company/project names
- [ ] Specific hardware details (GPU model, CPU type)
- [ ] API keys and credentials (even dummy ones)
- [ ] Internal URLs and IP addresses
- [ ] Timestamps and dates that are personal context

### Comments to Clean
- [ ] Remove development context ("I spent 3 days on this")
- [ ] Remove personal notes ("My boss wanted this done by Friday")
- [ ] Remove author attributions in comments
- [ ] Remove TODO comments with names (@jason-glass)
- [ ] Remove "LOL" or personal humor
- [ ] Remove references to specific people

### Configuration to Update
- [ ] Hardcoded paths → environment variables
- [ ] Personal settings → defaults
- [ ] Create example config files instead of using yours
- [ ] Document all configuration options
- [ ] Add .example files for reference

### Documentation to Sanitize
- [ ] README: Remove personal story
- [ ] README: Use generic examples
- [ ] Contributing guide: Generic and inclusive
- [ ] Comments: Professional and impersonal
- [ ] Examples: Generic city/company names
- [ ] Contact: GitHub Issues, not personal email

### Testing & Verification
- [ ] Run anonymization_audit.py script
- [ ] Manual review of suspicious patterns
- [ ] Ask someone to review your code
- [ ] Search for suspicious keywords
- [ ] Review git history (no secrets)
- [ ] Test installation from scratch

### Package Metadata
- [ ] Author field in pyproject.toml (public identity)
- [ ] Email field (public/work email)
- [ ] Homepage URL correct
- [ ] Keywords appropriate
- [ ] Description generic

### Before Final Publishing
- [ ] All tests pass
- [ ] No linting errors
- [ ] Package builds successfully
- [ ] twine check passes
- [ ] Manual review complete
- [ ] Ready for public release
```

---

## Key Takeaways

**Common Information Leaks**:
- File paths (use environment variables)
- Email addresses (use GitHub Issues instead)
- Names in comments (remove or make generic)
- API keys/credentials (never hardcode)
- Personal context in comments (be professional)

**Best Practices**:
1. Use `pathlib.Path` for file paths
2. Use environment variables for configuration
3. Create example config files
4. Remove author attributions
5. Make comments professional and impersonal
6. Use generic names in examples

**Automated Checking**:
- Create audit script to scan for suspicious patterns
- Run before every release
- Combine with manual review
- Ask someone else to review

**Configuration Strategy**:
- Remove hardcoded values
- Provide environment variable overrides
- Create example config files
- Document all options
- Use sensible defaults

---

## Additional Resources

- **Privacy-First Development**: https://www.privacytools.io/
- **Secure Coding**: https://owasp.org/www-project-secure-coding-practices-quick-reference-guide/
- **Open Source Licenses**: https://choosealicense.com/
- **PEP 440 - Version Identification**: https://peps.python.org/pep-0440/

---

## Summary: Publishing Safely

1. **Identify**: Run audit script to find personal information
2. **Remove**: Delete hardcoded paths, names, emails
3. **Configure**: Use environment variables and config files
4. **Document**: Update README with configuration options
5. **Verify**: Manual review plus automated checking
6. **Publish**: Release to PyPI with confidence

Your code is ready for the world when no one can identify you from reading it.

