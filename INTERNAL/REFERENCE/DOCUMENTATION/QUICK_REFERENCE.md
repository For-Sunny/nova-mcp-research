# MCP Publishing Quick Reference

One-page cheat sheet for the complete publishing process.

---

## Phase 1: Server Creation (30 min)

```powershell
# Setup
mkdir my-mcp-server
cd my-mcp-server
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install mcp

# Create structure
mkdir src\my_mcp_server
mkdir tests
New-Item src\my_mcp_server\__init__.py
New-Item src\my_mcp_server\server.py

# Write server code (see Tutorial 1)
# - Define TOOLS list
# - Define RESOURCES list
# - Create @server.list_tools() handler
# - Create @server.list_resources() handler
# - Create @server.call_tool() handler
# - Create @server.read_resource() handler

# Test
python src/my_mcp_server/server.py
# Server should start and wait for connections

# Write tests (see Tutorial 1)
pip install pytest
pytest tests/ -v
```

---

## Phase 2: PyPI Publishing (30 min)

```powershell
# Create pyproject.toml
# - Set name, version, description
# - List dependencies (mcp>=0.3.0)
# - Set author and email
# - Add classifiers

# Create README.md
# - Features
# - Installation instructions
# - Usage examples
# - Architecture explanation
# - Troubleshooting

# Create LICENSE (MIT recommended)
# - Copy from: https://opensource.org/licenses/MIT
# - Replace [year] and [fullname]

# Build and publish
pip install build twine

python -m build
# Creates: dist/my_mcp_server-0.1.0-py3-none-any.whl
#          dist/my_mcp_server-0.1.0.tar.gz

twine check dist/*
# Should show: "passed"

# Create PyPI account: https://pypi.org/account/register/
# Generate API token: https://pypi.org/manage/account/

# Store credentials: %APPDATA%\pip\pypirc
[pypi]
username = __token__
password = pypi-AgE...

twine upload dist/*
# Success: "View at: https://pypi.org/project/my-mcp-server/"

# Test installation
python -m venv test_env
.\test_env\Scripts\Activate.ps1
pip install my-mcp-server
python -c "from my_mcp_server import server; print('Success')"
```

---

## Phase 3: GitHub Release (20 min)

```powershell
# Initialize repository
git init
git add .
git commit -m "Initial commit: My MCP server"

# Add to GitHub: https://github.com/new
# - Name: my-mcp-server
# - Description: Your description
# - Public
# - License: MIT

git remote add origin https://github.com/yourname/my-mcp-server.git
git branch -M main
git push -u origin main

# Create version tag
git tag -a v0.1.0 -m "Release version 0.1.0"
git push origin v0.1.0

# GitHub automatically creates release from tag
# https://github.com/yourname/my-mcp-server/releases/tag/v0.1.0
```

---

## Phase 4: Windows Compatibility (15 min)

**File Paths:**
```python
from pathlib import Path

# DO use
config_dir = Path.home() / ".mcp_config"

# DON'T use
config_dir = r"C:\Users\Name\.mcp_config"
```

**Shell Compatibility:**
```json
{
  "mcpServers": {
    "myserver": {
      "command": "python",
      "args": ["-m", "my_mcp_server"]
    }
  }
}
```

**Test on Windows:**
```powershell
# Test different Python versions
py -3.8 -m venv test38
py -3.10 -m venv test310
py -3.11 -m venv test311
py -3.12 -m venv test312

# Test in Claude Desktop
# Edit: %APPDATA%\Claude\claude_desktop_config.json
# Restart Claude and try your tools
```

---

## Phase 5: Code Anonymization (15 min)

```powershell
# Create audit script (see Tutorial 5)
# tools/anonymization_audit.py

python tools/anonymization_audit.py

# Remove:
# ✓ Hardcoded paths (C:\Users\YourName\...)
# ✓ Email addresses
# ✓ Author names in comments
# ✓ GitHub usernames
# ✓ Personal project names
# ✓ TODO comments with names
# ✓ Development context in comments

# Replace hardcoded paths with:
def get_config_dir():
    env = os.getenv("MYAPP_CONFIG")
    if env:
        return Path(env)
    return Path.home() / ".myapp"

# Create example config file (not personal)
# example_config.json - template only

# Run audit again until clean
python tools/anonymization_audit.py
# Output: ✓ No suspicious patterns found!
```

---

## Version Management Quick Reference

```toml
# pyproject.toml
[project]
version = "0.1.0"     # MAJOR.MINOR.PATCH

# __init__.py
__version__ = "0.1.0" # Must match
```

**Versioning Rules:**

| Change | From | To | Example |
|--------|------|----|----|
| Bug fix | 0.1.0 | 0.1.1 | Fixed temperature rounding |
| New feature | 0.1.0 | 0.2.0 | Added humidity data |
| Breaking change | 0.2.0 | 1.0.0 | Changed API structure |

**Update Process:**
```powershell
# 1. Update version in pyproject.toml
# 2. Update version in __init__.py
# 3. Update CHANGELOG.md
# 4. Rebuild: python -m build
# 5. Upload: twine upload dist/*
# 6. Tag: git tag v1.0.0 && git push origin v1.0.0
```

---

## Configuration Best Practices

```python
from pathlib import Path
import os

# ✓ USE environment variables
config_dir = Path(os.getenv("MYAPP_CONFIG", Path.home() / ".myapp"))

# ✓ USE pathlib for paths
config_file = config_dir / "config.json"

# ✓ USE forward slashes in paths
path = "C:/Users/Name/config"  # Works everywhere

# ✗ AVOID hardcoded paths
path = r"C:\Users\Jason\AppData\Roaming\myapp"

# ✗ AVOID shell-specific code
subprocess.run(["powershell", "..."], shell=True)  # No!

# ✓ DO pure Python
subprocess.run([sys.executable, "-m", "myapp"])  # Yes!
```

---

## Dependency Management

```toml
# pyproject.toml

[project]
dependencies = [
    "mcp>=0.3.0",          # Core dependency
]

[project.optional-dependencies]
dev = [
    "pytest>=7.0",         # Testing
    "black>=23.0",         # Formatting
    "pylint>=2.0",         # Linting
]

gpu = [
    "torch>=2.0",          # GPU support
    "faiss-gpu>=1.7.4",
]

cpu = [
    "faiss-cpu>=1.7.4",    # CPU-only
]
```

**Installation:**
```powershell
pip install my-mcp-server              # Core only
pip install my-mcp-server[dev]         # With dev tools
pip install my-mcp-server[gpu]         # With GPU support
pip install my-mcp-server[cpu,dev]     # Multiple extras
```

---

## Common Issues & Fixes

| Issue | Fix |
|-------|-----|
| `ModuleNotFoundError: mcp` | `pip install mcp` in activated venv |
| Path contains backslash errors | Use `Path()` or forward slashes |
| Server doesn't appear in Claude | Restart Claude Desktop completely |
| Can't upload to PyPI | Check `PYPI_API_TOKEN` in `~/.pypirc` |
| "File already exists on PyPI" | Bump version number, rebuild, re-upload |
| Tests fail on Windows | Check path handling, use `Path()` |
| GPU not detected | Run `nvidia-smi`, check CUDA version |
| Windows Defender blocks | Add to whitelist or disable scanning |
| `twine check` fails | Check README.md Markdown syntax |

---

## Pre-Release Checklist

- [ ] `pytest tests/ -v` passes
- [ ] `python -m build` succeeds
- [ ] `twine check dist/*` shows "passed"
- [ ] `python tools/anonymization_audit.py` shows no issues
- [ ] pyproject.toml version updated
- [ ] __init__.py __version__ matches
- [ ] CHANGELOG.md updated
- [ ] README.md explains usage
- [ ] LICENSE file present
- [ ] .gitignore configured
- [ ] No hardcoded paths in code
- [ ] No personal info in comments
- [ ] No credentials in code
- [ ] Tested in fresh venv

---

## Publishing Workflow (Complete)

```powershell
# 1. Make changes to your server
# ... edit code, write tests, etc ...

# 2. Update version
# - Edit pyproject.toml
# - Edit src/my_mcp_server/__init__.py
# - Edit CHANGELOG.md

# 3. Commit changes
git add .
git commit -m "Add feature X, bump to v0.2.0"

# 4. Run checks
pytest tests/ -v
python tools/anonymization_audit.py
python -m build

# 5. Publish to PyPI
twine upload dist/*
# Creates: https://pypi.org/project/my-mcp-server/0.2.0/

# 6. Create GitHub release
git tag -a v0.2.0 -m "Release version 0.2.0"
git push origin v0.2.0
# Creates: https://github.com/yourname/my-mcp-server/releases/tag/v0.2.0

# 7. Verify
pip install --upgrade my-mcp-server
python -c "from my_mcp_server import server; print('Success')"
```

---

## Entry Points & Installation

```toml
# pyproject.toml - makes command-line tool
[project.scripts]
my-mcp-server = "my_mcp_server.server:main"
```

Then users can run:
```powershell
pip install my-mcp-server
my-mcp-server  # Starts server
```

Or in Claude Desktop:
```json
{
  "mcpServers": {
    "myserver": {
      "command": "my-mcp-server"
    }
  }
}
```

---

## README.md Minimum Content

```markdown
# My MCP Server

[One sentence description]

## Features
- Feature 1
- Feature 2

## Installation
pip install my-mcp-server

## Usage
[Example of using the server]

## Configuration
[Environment variables, config files]

## Troubleshooting
[Common issues and solutions]

## License
MIT

## Support
[GitHub Issues link]
```

---

## Key File Templates

### pyproject.toml Minimum
```toml
[build-system]
requires = ["setuptools>=68.0", "wheel"]
build-backend = "setuptools.build_meta"

[project]
name = "my-mcp-server"
version = "0.1.0"
description = "Your description here"
readme = "README.md"
requires-python = ">=3.8"
license = {text = "MIT"}
authors = [{name = "Your Name", email = "your@email.com"}]
dependencies = ["mcp>=0.3.0"]

[project.urls]
Homepage = "https://github.com/yourname/my-mcp-server"

[tool.setuptools]
package-dir = {"" = "src"}

[tool.setuptools.packages.find]
where = ["src"]
```

### LICENSE (MIT)
```
MIT License

Copyright (c) [year] [your name]

Permission is hereby granted, free of charge, to any person obtaining a copy...
[Full license text from https://opensource.org/licenses/MIT]
```

### .gitignore
```
venv/
__pycache__/
*.pyc
dist/
build/
*.egg-info/
.pytest_cache/
.coverage
htmlcov/
.vscode/
.env
.DS_Store
```

---

## Useful Links

| Resource | URL |
|----------|-----|
| MCP Spec | https://spec.modelcontextprotocol.io/ |
| PyPI | https://pypi.org/ |
| GitHub | https://github.com/ |
| Python Docs | https://docs.python.org/ |
| Semantic Versioning | https://semver.org/ |
| Keep a Changelog | https://keepachangelog.com/ |
| Choose a License | https://choosealicense.com/ |

---

## Time Estimates

| Task | Time |
|------|------|
| Create MCP server | 30-45 min |
| Publish to PyPI | 15-20 min |
| Set up GitHub | 10-15 min |
| Handle Windows issues | 15-20 min |
| Anonymize code | 10-15 min |
| **Total** | **1.5-2.5 hours** |

---

## Common Command Reference

```powershell
# Python/Pip
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install package_name
pip install -e .                    # Install in dev mode
pip install -e ".[dev]"             # Install with extras
pip show package_name
pip list

# Testing
pytest tests/
pytest tests/ -v                    # Verbose
pytest tests/ --cov=src             # With coverage
pytest tests/test_file.py::test_name  # Specific test

# Building
python -m build
twine check dist/*
twine upload dist/*

# Git
git init
git add .
git commit -m "message"
git tag -a v0.1.0 -m "Release 0.1.0"
git push origin main
git push origin v0.1.0

# Code Quality
black src/
pylint src/
mypy src/
```

---

## Maintenance & Updates

**When users find bugs:**
1. Fix the bug
2. Bump PATCH version (0.1.0 → 0.1.1)
3. Update CHANGELOG.md
4. Rebuild and upload
5. Create GitHub release with fix notes

**When adding features:**
1. Add feature + tests
2. Bump MINOR version (0.1.0 → 0.2.0)
3. Update CHANGELOG.md
4. Rebuild and upload
5. Create GitHub release with feature notes

**When breaking changes:**
1. Update API, tests, docs
2. Bump MAJOR version (0.2.0 → 1.0.0)
3. Update CHANGELOG.md with migration guide
4. Rebuild and upload
5. Create GitHub release with migration instructions

---

**Print this page for reference while publishing!**
