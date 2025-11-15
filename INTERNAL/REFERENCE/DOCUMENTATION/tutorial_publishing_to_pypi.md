# Tutorial: Publishing MCP to PyPI

## What You'll Learn

By the end of this tutorial, you'll be able to:

- Create a proper `pyproject.toml` configuration for your MCP server
- Build distribution packages (wheel and source distribution)
- Test installation locally before publishing
- Publish your package to PyPI (Python Package Index)
- Manage versions and create updates

## Prerequisites

Before starting, ensure you have:

- **Completed Tutorial 1**: Working MCP server (weather-mcp-server example)
- **Python 3.8+** with pip installed
- **Build tools**: `pip install build twine`
- **PyPI account**: https://pypi.org/account/register/
- **GitHub account** (optional, but recommended for version control)
- **Text editor** for editing configuration files
- **15-30 minutes** of focused time

## Time Estimate

**Total**: 30-45 minutes
- Creating pyproject.toml: 10 minutes
- Building packages: 5 minutes
- Testing locally: 10 minutes
- Publishing to PyPI: 5 minutes
- Verification: 5-10 minutes

## Final Result

You'll have:
- A properly packaged MCP server
- Published package on PyPI
- Installable via `pip install weather-mcp-server`
- Ability to push updates to PyPI

---

## Part 1: Understanding Python Packaging (5 minutes)

### Why pyproject.toml?

Python packaging has evolved. Here's the progression:

- **Old way** (pre-2016): setup.py + setup.cfg
  - Worked, but complex and error-prone
  - Mixed code and configuration
  
- **Modern way** (2021+): pyproject.toml
  - Standardized, declarative configuration
  - Works with multiple build backends
  - Clearer separation of concerns

### Package Components

When you publish to PyPI:

```
weather-mcp-server/
├── src/
│   └── weather_mcp_server/
│       ├── __init__.py
│       └── server.py
├── tests/
│   └── test_tools.py
├── README.md              (shows on PyPI)
├── LICENSE                (MIT, Apache 2.0, etc.)
├── pyproject.toml         (configuration - NEW!)
└── .gitignore
```

**Key principle**: Source code lives in `src/` directory, not at project root. This prevents import confusion.

### What Gets Published

When you run `pip install weather-mcp-server`, PyPI sends:

```
weather_mcp_server-0.1.0-py3-none-any.whl    (main package file)
weather_mcp_server-0.1.0.tar.gz               (source archive)
```

Both contain your code, just in different formats.

---

## Part 2: Creating pyproject.toml (10 minutes)

### Step 2.1: Create the Configuration File

In your project root (same level as src/), create `pyproject.toml`:

```toml
[build-system]
requires = ["setuptools>=68.0", "wheel"]
build-backend = "setuptools.build_meta"

[project]
name = "weather-mcp-server"
version = "0.1.0"
description = "A weather information MCP server with tools for current conditions and forecasts"
readme = "README.md"
requires-python = ">=3.8"
license = {text = "MIT"}
authors = [
    {name = "Your Name", email = "your.email@example.com"},
]
keywords = ["mcp", "model-context-protocol", "weather", "tools"]
classifiers = [
    "Development Status :: 3 - Alpha",
    "Intended Audience :: Developers",
    "License :: OSI Approved :: MIT License",
    "Programming Language :: Python :: 3",
    "Programming Language :: Python :: 3.8",
    "Programming Language :: Python :: 3.9",
    "Programming Language :: Python :: 3.10",
    "Programming Language :: Python :: 3.11",
    "Programming Language :: Python :: 3.12",
    "Topic :: Software Development :: Libraries :: Python Modules",
]

dependencies = [
    "mcp>=0.3.0",
]

[project.optional-dependencies]
dev = [
    "pytest>=7.0",
    "pytest-cov>=4.0",
    "black>=23.0",
    "pylint>=2.0",
    "mypy>=1.0",
]

[project.urls]
Homepage = "https://github.com/yourname/weather-mcp-server"
Repository = "https://github.com/yourname/weather-mcp-server.git"
Documentation = "https://github.com/yourname/weather-mcp-server#readme"
Issues = "https://github.com/yourname/weather-mcp-server/issues"

[tool.setuptools]
package-dir = {"" = "src"}

[tool.setuptools.packages.find]
where = ["src"]

[tool.black]
line-length = 100
target-version = ['py38', 'py39', 'py310', 'py311', 'py312']

[tool.pylint]
max-line-length = 100

[tool.mypy]
python_version = "3.8"
warn_return_any = true
warn_unused_configs = true
disallow_untyped_defs = false
```

### Understanding Each Section

#### `[build-system]`
```toml
[build-system]
requires = ["setuptools>=68.0", "wheel"]
build-backend = "setuptools.build_meta"
```

- **requires**: Tools needed to build your package
  - `setuptools`: Standard Python packaging tool
  - `wheel`: Creates .whl files (binary format)
  
- **build-backend**: Which tool to use for building

#### `[project]` - Core Metadata

```toml
[project]
name = "weather-mcp-server"
version = "0.1.0"
description = "A weather information MCP server..."
readme = "README.md"
requires-python = ">=3.8"
```

- **name**: Package name (can use hyphens, converted to underscores)
- **version**: Semantic versioning (major.minor.patch)
- **description**: One-line summary (shows in search results)
- **readme**: Path to README file
- **requires-python**: Minimum Python version

#### `authors` - Your Information

```toml
authors = [
    {name = "Your Name", email = "your.email@example.com"},
]
```

Replace with your actual name and email.

#### `dependencies` - What Your Package Needs

```toml
dependencies = [
    "mcp>=0.3.0",
]
```

- **mcp>=0.3.0**: Your package requires MCP version 0.3.0 or newer
- List any other required packages here
- Don't list Python standard library (json, sys, etc.)

#### `optional-dependencies` - For Development

```toml
[project.optional-dependencies]
dev = [
    "pytest>=7.0",
    "pytest-cov>=4.0",
]
```

These are installed with: `pip install weather-mcp-server[dev]`

Useful for development-only tools that end users don't need.

#### `classifiers` - PyPI Categorization

```toml
classifiers = [
    "Development Status :: 3 - Alpha",
    "Programming Language :: Python :: 3.8",
]
```

These help people find your package on PyPI.

**Common classifiers**:
- `Development Status :: 3 - Alpha` (early development)
- `Development Status :: 4 - Beta` (feature-complete)
- `Development Status :: 5 - Production/Stable` (ready for production)
- `License :: OSI Approved :: MIT License`
- `Programming Language :: Python :: 3.X`

See full list: https://pypi.org/classifiers/

#### `[project.urls]` - Links on PyPI

```toml
[project.urls]
Homepage = "https://github.com/yourname/..."
Repository = "https://github.com/yourname/..."
```

Links displayed on your PyPI package page.

### Step 2.2: Update Your Project Structure

Rename your src/server.py to use the package name pattern:

```powershell
# Move to proper package structure
mkdir src\weather_mcp_server
mv src\server.py src\weather_mcp_server\server.py
mv src\__init__.py src\weather_mcp_server\__init__.py
```

Your structure should now be:

```
weather-mcp-server/
├── src/
│   └── weather_mcp_server/
│       ├── __init__.py
│       └── server.py
├── tests/
├── pyproject.toml
├── README.md
└── LICENSE
```

### Step 2.3: Update __init__.py

Make your package importable by editing `src/weather_mcp_server/__init__.py`:

```python
"""
Weather MCP Server
A simple MCP server that provides weather information tools and resources.
"""

__version__ = "0.1.0"
__author__ = "Your Name"
__email__ = "your.email@example.com"

# Optional: export main server class/function
from .server import server

__all__ = ["server"]
```

This allows: `from weather_mcp_server import server`

---

## Part 3: Creating README.md (5 minutes)

Create a `README.md` in your project root:

```markdown
# Weather MCP Server

A simple but complete example MCP (Model Context Protocol) server providing weather information tools and resources.

## Features

- Get current weather for any supported city
- Retrieve 7-day weather forecast
- List available cities with weather data
- Proper error handling and validation
- Full JSON-RPC/MCP compliance

## Installation

```bash
pip install weather-mcp-server
```

## Usage

### Starting the Server

```bash
weather-mcp-server
```

The server will start listening on stdin/stdout for MCP requests.

### Available Tools

#### `get_weather`

Get current weather for a city.

**Parameters:**
- `city` (required): City name (string)
- `unit` (optional): Temperature unit - "celsius" or "fahrenheit" (default: "celsius")

**Example:**
```python
# When calling this tool
{
    "tool": "get_weather",
    "arguments": {
        "city": "New York",
        "unit": "fahrenheit"
    }
}
```

**Response:**
```json
{
    "temp": 59.0,
    "condition": "Cloudy",
    "humidity": 65,
    "unit": "F"
}
```

#### `forecast_weather`

Get 7-day weather forecast for a city.

**Parameters:**
- `city` (required): City name (string)

**Response:** Array of 7 forecast objects with day, high/low temps, and conditions.

### Available Resources

#### `weather://available_cities`

List of cities where weather data is available.

**Response:** Plain text listing of supported cities.

## Integration with Claude Desktop

1. Add to `claude_desktop_config.json`:

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

2. Restart Claude Desktop
3. Weather tools will be available to Claude

## Supported Cities

- New York
- London
- Tokyo
- Sydney

## Development

### Setup

```bash
git clone https://github.com/yourname/weather-mcp-server.git
cd weather-mcp-server
pip install -e ".[dev]"
```

### Running Tests

```bash
pytest tests/ -v
```

### Code Quality

```bash
black src/
pylint src/
mypy src/
```

## Architecture

- **src/weather_mcp_server/server.py**: Main MCP server implementation
- **tests/**: Unit tests and integration tests
- **Mock Data**: Uses hardcoded weather data (replace with real API)

## Real-World Improvements

Before using in production:

- [ ] Replace mock data with actual weather API calls
- [ ] Add rate limiting
- [ ] Implement caching
- [ ] Add proper logging
- [ ] Create async HTTP client for API calls
- [ ] Add configuration file support

## License

MIT License - see LICENSE file for details

## Contributing

Contributions welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Write tests for new features
4. Submit a pull request

## Support

- **Issues**: https://github.com/yourname/weather-mcp-server/issues
- **Documentation**: See README sections above
- **MCP Spec**: https://spec.modelcontextprotocol.io/

## Changelog

### 0.1.0 (2024-XX-XX)

Initial release with:
- get_weather tool
- forecast_weather tool
- available_cities resource
- Basic error handling
```

---

## Part 4: Creating LICENSE (2 minutes)

Create `LICENSE` file (MIT License):

```
MIT License

Copyright (c) 2024 Your Name

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## Part 5: Building Your Package (5 minutes)

### Step 5.1: Install Build Tools

```powershell
pip install build twine
```

- **build**: Creates distribution packages
- **twine**: Uploads packages to PyPI securely

### Step 5.2: Build Distribution

In your project root:

```powershell
python -m build
```

**Expected output**:
```
* Creating isolated environment...
* Installing packages in isolated environment...
* Getting build backend...
successfully installed mcp>=0.3.0
* Building wheel...
* Building sdist...
Successfully built weather_mcp_server-0.1.0-py3-none-any.whl and weather_mcp_server-0.1.0.tar.gz
```

This creates a `dist/` folder:

```
dist/
├── weather_mcp_server-0.1.0-py3-none-any.whl    (Binary format)
└── weather_mcp_server-0.1.0.tar.gz               (Source archive)
```

### Step 5.3: Check Package Contents

Verify what's included:

```powershell
# See what's in the wheel (binary package)
python -m zipfile -l dist/weather_mcp_server-0.1.0-py3-none-any.whl

# Should show:
# weather_mcp_server/__init__.py
# weather_mcp_server/server.py
# weather_mcp_server-0.1.0.dist-info/METADATA
# ... (metadata files)
```

---

## Part 6: Testing Local Installation (10 minutes)

### Step 6.1: Test in Fresh Virtual Environment

This simulates what users will experience:

```powershell
# Create a test environment (separate from development)
python -m venv test_venv
.\test_venv\Scripts\Activate.ps1

# Install your package from the built file
pip install dist/weather_mcp_server-0.1.0-py3-none-any.whl

# Verify installation
pip list
# Should show: weather-mcp-server    0.1.0

# Test importing
python -c "from weather_mcp_server import server; print('Success!')"
```

**Expected output**:
```
Successfully installed weather-mcp-server-0.1.0
Successfully uninstalled weather-mcp-server-0.1.0
```

### Step 6.2: Test Direct Installation from Source

```powershell
# In a different test environment
python -m venv test_venv2
.\test_venv2\Scripts\Activate.ps1

# Install from source archive (simulates PyPI installation)
pip install dist/weather_mcp_server-0.1.0.tar.gz

# Test it
python -c "from weather_mcp_server import server; print('Success!')"
```

### Step 6.3: Run Installed Package

Test that the installed package actually runs:

```powershell
# From test environment
python -m weather_mcp_server

# Or, if you created an entry point (bonus):
# weather-mcp-server
```

The server should start without errors.

---

## Part 7: Publishing to PyPI (10 minutes)

### Step 7.1: Create PyPI Account

1. Visit https://pypi.org/account/register/
2. Create account with strong password
3. Verify email address
4. Set up two-factor authentication (recommended)

### Step 7.2: Create API Token

1. Log into PyPI.org
2. Go to Account Settings → API tokens
3. Click "Create token"
   - Name: `weather-mcp-server`
   - Scope: `Entire account` (for first publication)
4. Copy the token (looks like: `pypi-AgEIcHlwaS5vcmcCJ...`)

### Step 7.3: Store Credentials Securely

Create `~/.pypirc` (Windows: `%APPDATA%\pip\pypirc`):

**Windows Path**: `C:\Users\YourUsername\AppData\Roaming\pip\pypirc`

```ini
[distutils]
index-servers =
    pypi

[pypi]
repository = https://upload.pypi.org/legacy/
username = __token__
password = pypi-AgEIcHlwaS5vcmcCJ...
```

**Important**: Never share your token!

### Step 7.4: Publish to PyPI

```powershell
# Upload your distributions
twine upload dist/weather_mcp_server-0.1.0*

# You should see:
# Uploading distributions to https://upload.pypi.org/legacy/
# Uploading weather_mcp_server-0.1.0-py3-none-any.whl
# Uploading weather_mcp_server-0.1.0.tar.gz
# View at: https://pypi.org/project/weather-mcp-server/0.1.0/
```

### Step 7.5: Verify Publication

1. Visit https://pypi.org/project/weather-mcp-server/
2. Check that your package appears
3. Verify README renders correctly
4. Check metadata is accurate

### Step 7.6: Test PyPI Installation

Now anyone can install your package:

```powershell
# In a fresh environment
python -m venv verify_env
.\verify_env\Scripts\Activate.ps1

# Install from PyPI (no local files needed!)
pip install weather-mcp-server

# Test it
python -c "from weather_mcp_server import server; print('Published successfully!')"
```

---

## Part 8: Version Management & Updates (5 minutes)

### Understanding Semantic Versioning

Your version follows: `MAJOR.MINOR.PATCH`

- **MAJOR** (X.0.0): Breaking changes
  - Example: Tool API changes, removing tools
  
- **MINOR** (1.X.0): New features, backward compatible
  - Example: Adding a new tool, new optional parameters
  
- **PATCH** (1.0.X): Bug fixes, no new features
  - Example: Fixing a calculation error, improving error messages

### Updating Your Version

When you make changes:

1. **Update version in pyproject.toml**:
```toml
version = "0.2.0"  # Changed from 0.1.0
```

2. **Update __init__.py**:
```python
__version__ = "0.2.0"
```

3. **Update CHANGELOG in README.md**:
```markdown
### 0.2.0 (2024-XX-XX)

New features:
- Added wind speed to weather tool
- Added humidity to forecast

Bug fixes:
- Fixed temperature conversion rounding
```

4. **Rebuild and publish**:
```powershell
# Clean old builds
rm dist/*

# Build new version
python -m build

# Publish to PyPI
twine upload dist/*
```

### Example Version History

```
0.1.0 - Initial release (mock data, 2 tools)
0.1.1 - Bug fix: temperature conversion rounding
0.2.0 - Add humidity to get_weather tool
0.2.1 - Improve error messages for invalid cities
1.0.0 - Production ready: integrate real weather API
1.1.0 - Add caching for performance
2.0.0 - BREAKING: Remove temperature unit conversion (use client-side)
```

---

## Part 9: Troubleshooting Publishing Issues

### Issue: "Invalid Distribution"

**Error**: `twine upload` says your package is invalid

**Solution**:
```powershell
# Validate before uploading
twine check dist/*

# Fix any issues reported, rebuild, and retry
python -m build
twine check dist/*
```

---

### Issue: "Filename Already Exists"

**Error**: Can't upload, filename already exists on PyPI

**Reason**: PyPI doesn't allow re-uploading same version

**Solution**: Bump version number and rebuild

```toml
# Before: version = "0.1.0"
# After:
version = "0.1.1"
```

---

### Issue: "Invalid Credential"

**Error**: twine can't authenticate with PyPI

**Solution**:
```powershell
# Try explicit token option
twine upload dist/* --username __token__ --password pypi-AgE...

# Or store credentials in ~/.pypirc (see Step 7.3)
```

---

### Issue: README Not Rendering

**Error**: README shows as plain text on PyPI instead of formatted

**Reason**: Content-Type mismatch or invalid Markdown

**Solution**:
```powershell
# Check what PyPI sees
twine check dist/*

# Common issues:
# 1. README.rst not README.md (switch to .rst or update pyproject.toml)
# 2. Invalid Markdown syntax (test locally with pandoc)
# 3. Missing description in pyproject.toml
```

---

### Issue: Package Not Found After Publishing

**Error**: `pip install weather-mcp-server` not found

**Reason**: Publishing takes 5-10 minutes to propagate

**Solution**: Wait 10 minutes and try again

```powershell
# Check if it's there yet
pip search weather-mcp-server  # (if search is enabled)

# Or visit: https://pypi.org/project/weather-mcp-server/
```

---

## Checklist: Before Publishing to PyPI

- [ ] pyproject.toml is complete and valid
- [ ] README.md explains what your server does
- [ ] LICENSE file exists (MIT or Apache 2.0)
- [ ] Package structure is src/weather_mcp_server/
- [ ] __init__.py has __version__ = "X.Y.Z"
- [ ] No debug files in dist/
- [ ] Local test installation works (fresh venv)
- [ ] PyPI account is created and verified
- [ ] API token generated and stored in ~/.pypirc
- [ ] `twine check` passes without warnings
- [ ] README renders correctly (test with `twine check`)

---

## Next Steps

1. **Monitor your package** on PyPI for user feedback
2. **Create GitHub releases** (Tutorial 3) for version tagging
3. **Handle Windows-specific issues** (Tutorial 4) if users report them
4. **Plan updates** using semantic versioning

---

## Key Takeaways

**Modern Python packaging uses:**
- `pyproject.toml` for configuration (not setup.py)
- `src/` directory for source code
- `build` tool for creating distributions
- `twine` for secure publishing

**Version numbers matter:**
- Use semantic versioning (MAJOR.MINOR.PATCH)
- Update version before rebuilding
- PyPI doesn't allow re-uploading same version

**Publishing is simple:**
1. Create pyproject.toml
2. Run `python -m build`
3. Run `twine upload dist/*`
4. Verify on pypi.org

**Always test before publishing:**
- Test in fresh virtual environment
- Check `twine check` output
- Wait for PyPI to process (5-10 min)
- Verify with `pip install` from PyPI

---

## Additional Resources

- **PyPI**: https://pypi.org/
- **Build Documentation**: https://packaging.python.org/tutorials/packaging-projects/
- **Twine Documentation**: https://twine.readthedocs.io/
- **PEP 517 - Build System**: https://peps.python.org/pep-0517/
- **PEP 518 - pyproject.toml**: https://peps.python.org/pep-0518/
- **Semantic Versioning**: https://semver.org/

