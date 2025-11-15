# MCP Server Packaging Best Practices

## Executive Summary

This document provides comprehensive guidance for packaging and distributing Model Context Protocol (MCP) servers across PyPI, NPM, and marketplace platforms. It covers project structure, configuration files, dependency management, installation workflows, and platform-specific considerations with emphasis on Windows compatibility.

**Target Audience**: MCP server developers preparing for public release

**Platforms Covered**: PyPI (Python), NPM (Node.js/TypeScript), Smithery.ai, GitHub Releases

---

## Table of Contents

1. [Python/PyPI Packaging](#pythonpypi-packaging)
2. [Node.js/NPM Packaging](#nodejsnpm-packaging)
3. [Claude Desktop Configuration](#claude-desktop-configuration)
4. [Smithery.ai Deployment](#smitheryai-deployment)
5. [GitHub Release Process](#github-release-process)
6. [Cross-Platform Considerations](#cross-platform-considerations)
7. [Documentation Standards](#documentation-standards)
8. [Testing and Quality Assurance](#testing-and-quality-assurance)

---

## Python/PyPI Packaging

### Project Structure

**Recommended Directory Layout**:

```
mcp-server-example/
├── src/
│   └── mcp_server_example/
│       ├── __init__.py
│       ├── server.py          # Main server implementation
│       ├── tools/              # Tool implementations
│       │   ├── __init__.py
│       │   ├── tool1.py
│       │   └── tool2.py
│       └── utils/              # Utility modules
│           ├── __init__.py
│           └── helpers.py
├── tests/
│   ├── __init__.py
│   ├── test_server.py
│   └── test_tools.py
├── pyproject.toml              # Modern Python packaging
├── setup.py                    # Legacy support (optional)
├── README.md
├── LICENSE
├── .gitignore
├── requirements.txt            # Development dependencies
└── MANIFEST.in                 # Include non-Python files
```

### pyproject.toml (Modern Approach - RECOMMENDED)

**Complete Example**:

```toml
[build-system]
requires = ["setuptools>=61.0", "wheel"]
build-backend = "setuptools.build_meta"

[project]
name = "mcp-server-example"
version = "1.0.0"
description = "Example MCP server for demonstration"
readme = "README.md"
requires-python = ">=3.10"
license = {text = "MIT"}
authors = [
    {name = "Your Name", email = "you@example.com"}
]
maintainers = [
    {name = "Your Name", email = "you@example.com"}
]
keywords = ["mcp", "model-context-protocol", "ai", "llm"]
classifiers = [
    "Development Status :: 4 - Beta",
    "Intended Audience :: Developers",
    "License :: OSI Approved :: MIT License",
    "Programming Language :: Python :: 3",
    "Programming Language :: Python :: 3.10",
    "Programming Language :: Python :: 3.11",
    "Programming Language :: Python :: 3.12",
    "Topic :: Software Development :: Libraries :: Python Modules",
    "Operating System :: Microsoft :: Windows",
    "Operating System :: POSIX :: Linux",
    "Operating System :: MacOS",
]

# Core dependencies
dependencies = [
    "mcp>=1.0.0",              # Official MCP SDK
    "asyncio>=3.4.3",
    "pydantic>=2.0.0",         # Data validation
]

[project.optional-dependencies]
# Development dependencies
dev = [
    "pytest>=7.0.0",
    "pytest-asyncio>=0.21.0",
    "black>=23.0.0",
    "mypy>=1.0.0",
    "ruff>=0.1.0",
]

# Testing dependencies
test = [
    "pytest>=7.0.0",
    "pytest-asyncio>=0.21.0",
    "pytest-cov>=4.0.0",
]

[project.urls]
Homepage = "https://github.com/yourusername/mcp-server-example"
Documentation = "https://github.com/yourusername/mcp-server-example#readme"
Repository = "https://github.com/yourusername/mcp-server-example"
Issues = "https://github.com/yourusername/mcp-server-example/issues"
Changelog = "https://github.com/yourusername/mcp-server-example/releases"

[project.scripts]
mcp-server-example = "mcp_server_example.server:main"

[tool.setuptools]
package-dir = {"" = "src"}

[tool.setuptools.packages.find]
where = ["src"]
include = ["mcp_server_example*"]
exclude = ["tests*"]

[tool.black]
line-length = 100
target-version = ['py310', 'py311', 'py312']

[tool.mypy]
python_version = "3.10"
warn_return_any = true
warn_unused_configs = true
disallow_untyped_defs = true

[tool.ruff]
line-length = 100
target-version = "py310"

[tool.pytest.ini_options]
testpaths = ["tests"]
python_files = ["test_*.py"]
python_classes = ["Test*"]
python_functions = ["test_*"]
asyncio_mode = "auto"
```

**Key Sections Explained**:

- **[build-system]**: Specifies build tools (setuptools, wheel)
- **[project]**: Core metadata (name, version, description, dependencies)
- **[project.optional-dependencies]**: Dev/test dependencies (not installed by default)
- **[project.scripts]**: Entry points for command-line execution
- **[tool.setuptools.packages.find]**: Automatic package discovery
- **[tool.*]**: Configuration for development tools (black, mypy, ruff, pytest)

### setup.py (Legacy - Optional for Backward Compatibility)

```python
from setuptools import setup, find_packages

setup(
    name="mcp-server-example",
    version="1.0.0",
    packages=find_packages(where="src"),
    package_dir={"": "src"},
    install_requires=[
        "mcp>=1.0.0",
        "asyncio>=3.4.3",
        "pydantic>=2.0.0",
    ],
    entry_points={
        "console_scripts": [
            "mcp-server-example=mcp_server_example.server:main",
        ],
    },
    python_requires=">=3.10",
)
```

**When to Include setup.py**:
- Legacy tool compatibility (pip <21.3, setuptools <61)
- Build-time dependencies requiring compilation
- Complex build processes

**Modern Approach**: pyproject.toml alone is sufficient for most MCP servers

### Server Entry Point

**src/mcp_server_example/server.py**:

```python
"""Main MCP server implementation."""
import asyncio
import sys
from typing import Optional

from mcp.server.stdio import stdio_server
from mcp.server import Server
from mcp.types import Tool, TextContent

# Import tools
from .tools.tool1 import execute_tool1
from .tools.tool2 import execute_tool2


def create_server() -> Server:
    """Create and configure MCP server."""
    server = Server("mcp-server-example")

    @server.list_tools()
    async def list_tools() -> list[Tool]:
        return [
            Tool(
                name="tool1",
                description="Description of tool 1",
                inputSchema={
                    "type": "object",
                    "properties": {
                        "param1": {"type": "string", "description": "Parameter 1"},
                    },
                    "required": ["param1"],
                },
            ),
            Tool(
                name="tool2",
                description="Description of tool 2",
                inputSchema={
                    "type": "object",
                    "properties": {
                        "param2": {"type": "string", "description": "Parameter 2"},
                    },
                    "required": ["param2"],
                },
            ),
        ]

    @server.call_tool()
    async def call_tool(name: str, arguments: dict) -> list[TextContent]:
        if name == "tool1":
            result = await execute_tool1(arguments)
        elif name == "tool2":
            result = await execute_tool2(arguments)
        else:
            raise ValueError(f"Unknown tool: {name}")

        return [TextContent(type="text", text=result)]

    return server


async def main():
    """Run the MCP server via stdio."""
    async with stdio_server() as (read_stream, write_stream):
        server = create_server()
        await server.run(
            read_stream,
            write_stream,
            server.create_initialization_options()
        )


def run():
    """Entry point for console script."""
    asyncio.run(main())


if __name__ == "__main__":
    run()
```

**Key Features**:
- Async/await pattern (MCP requirement)
- stdio transport (most common for local servers)
- Proper error handling
- Entry point for pip installation

### MANIFEST.in (Include Non-Python Files)

```
include README.md
include LICENSE
include requirements.txt
recursive-include src/mcp_server_example/data *
recursive-exclude tests *
recursive-exclude * __pycache__
recursive-exclude * *.py[co]
```

### Building and Publishing to PyPI

**Step 1: Install Build Tools**

```bash
pip install build twine
```

**Step 2: Build Distribution**

```bash
python -m build
```

This creates:
- `dist/mcp-server-example-1.0.0.tar.gz` (source distribution)
- `dist/mcp_server_example-1.0.0-py3-none-any.whl` (wheel distribution)

**Step 3: Test Upload to TestPyPI** (RECOMMENDED)

```bash
# Register TestPyPI account: https://test.pypi.org/account/register/

python -m twine upload --repository testpypi dist/*
```

**Step 4: Test Installation from TestPyPI**

```bash
pip install --index-url https://test.pypi.org/simple/ mcp-server-example
```

**Step 5: Upload to PyPI**

```bash
# Register PyPI account: https://pypi.org/account/register/

python -m twine upload dist/*
```

**Step 6: Verify Installation**

```bash
pip install mcp-server-example
mcp-server-example --help
```

### Version Management

**Semantic Versioning** (MAJOR.MINOR.PATCH):
- **MAJOR**: Breaking changes (e.g., 1.0.0 → 2.0.0)
- **MINOR**: New features, backward compatible (e.g., 1.0.0 → 1.1.0)
- **PATCH**: Bug fixes (e.g., 1.0.0 → 1.0.1)

**Pre-release Versions**:
- `1.0.0a1`: Alpha release
- `1.0.0b1`: Beta release
- `1.0.0rc1`: Release candidate

**Update Version**:
- Manually in `pyproject.toml`: `version = "1.1.0"`
- Or use versioning tools: `bump2version`, `tbump`

### Testing Package Locally

**Install in Editable Mode**:

```bash
pip install -e .
```

Changes to source code immediately reflect without reinstallation.

**Test Entry Point**:

```bash
mcp-server-example
```

**Test with MCP Inspector**:

```bash
npx @modelcontextprotocol/inspector python -m mcp_server_example.server
```

---

## Node.js/NPM Packaging

### Project Structure

**Recommended Directory Layout**:

```
mcp-server-example/
├── src/
│   ├── index.ts               # Main entry point
│   ├── server.ts              # Server implementation
│   ├── tools/
│   │   ├── tool1.ts
│   │   └── tool2.ts
│   └── types/
│       └── index.ts
├── dist/                      # Compiled JavaScript (gitignored)
├── tests/
│   └── server.test.ts
├── package.json
├── tsconfig.json
├── .npmignore
├── README.md
├── LICENSE
└── .gitignore
```

### package.json

**Complete Example**:

```json
{
  "name": "mcp-server-example",
  "version": "1.0.0",
  "description": "Example MCP server for demonstration",
  "type": "module",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "bin": {
    "mcp-server-example": "./dist/index.js"
  },
  "files": [
    "dist",
    "README.md",
    "LICENSE"
  ],
  "scripts": {
    "build": "tsc",
    "clean": "rm -rf dist",
    "dev": "tsc --watch",
    "test": "jest",
    "lint": "eslint src --ext .ts",
    "format": "prettier --write \"src/**/*.ts\"",
    "prepublishOnly": "npm run clean && npm run build",
    "inspector": "npx @modelcontextprotocol/inspector node dist/index.js"
  },
  "keywords": [
    "mcp",
    "modelcontextprotocol",
    "model-context-protocol",
    "ai",
    "llm",
    "claude"
  ],
  "author": "Your Name <you@example.com>",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "https://github.com/yourusername/mcp-server-example"
  },
  "bugs": {
    "url": "https://github.com/yourusername/mcp-server-example/issues"
  },
  "homepage": "https://github.com/yourusername/mcp-server-example#readme",
  "engines": {
    "node": ">=18.0.0"
  },
  "dependencies": {
    "@modelcontextprotocol/sdk": "^1.0.0"
  },
  "devDependencies": {
    "@types/node": "^20.11.24",
    "@typescript-eslint/eslint-plugin": "^6.21.0",
    "@typescript-eslint/parser": "^6.21.0",
    "eslint": "^8.56.0",
    "jest": "^29.7.0",
    "prettier": "^3.2.5",
    "typescript": "^5.8.3"
  }
}
```

**Key Fields Explained**:

- **"type": "module"**: Enable ES modules (required for modern MCP SDK)
- **"main"**: Entry point for imports
- **"types"**: TypeScript type definitions
- **"bin"**: Creates executable command
- **"files"**: Whitelist files to include in package (only `dist`, `README`, `LICENSE`)
- **"prepublishOnly"**: Build before publishing (ensures fresh build)
- **"engines"**: Specify Node.js version requirement

### tsconfig.json

**TypeScript Configuration**:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ES2020",
    "lib": ["ES2020"],
    "moduleResolution": "node",
    "outDir": "./dist",
    "rootDir": "./src",
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "allowSyntheticDefaultImports": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "tests"]
}
```

### Server Entry Point

**src/index.ts**:

```typescript
#!/usr/bin/env node
/**
 * MCP Server Example - Entry Point
 */

import { createServer } from './server.js';

async function main() {
  const server = createServer();

  // Connect to stdio transport
  const transport = new StdioServerTransport();
  await server.connect(transport);

  // Handle graceful shutdown
  process.on('SIGINT', async () => {
    await server.close();
    process.exit(0);
  });
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
```

**Note**: `#!/usr/bin/env node` shebang allows direct execution on Unix systems

**src/server.ts**:

```typescript
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from "@modelcontextprotocol/sdk/types.js";

import { executeTool1 } from './tools/tool1.js';
import { executeTool2 } from './tools/tool2.js';

export function createServer(): Server {
  const server = new Server(
    {
      name: "mcp-server-example",
      version: "1.0.0",
    },
    {
      capabilities: {
        tools: {},
      },
    }
  );

  // List available tools
  server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
      tools: [
        {
          name: "tool1",
          description: "Description of tool 1",
          inputSchema: {
            type: "object",
            properties: {
              param1: {
                type: "string",
                description: "Parameter 1",
              },
            },
            required: ["param1"],
          },
        } as Tool,
        {
          name: "tool2",
          description: "Description of tool 2",
          inputSchema: {
            type: "object",
            properties: {
              param2: {
                type: "string",
                description: "Parameter 2",
              },
            },
            required: ["param2"],
          },
        } as Tool,
      ],
    };
  });

  // Handle tool calls
  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;

    switch (name) {
      case "tool1":
        return await executeTool1(args);
      case "tool2":
        return await executeTool2(args);
      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  });

  return server;
}
```

### .npmignore

**Exclude from Published Package**:

```
# Source files (only ship compiled dist)
src/
tests/
*.test.ts
*.spec.ts

# Configuration files
tsconfig.json
.eslintrc.json
.prettierrc
jest.config.js

# Development files
.git/
.github/
node_modules/
coverage/
*.log
.DS_Store
```

**Note**: If `.npmignore` exists, `.gitignore` is ignored. Be explicit!

### Building and Publishing to NPM

**Step 1: Build TypeScript**

```bash
npm run build
```

Verify `dist/` directory contains compiled `.js` and `.d.ts` files.

**Step 2: Test Locally**

```bash
# Link package globally
npm link

# Test command
mcp-server-example

# In another project, link the package
npm link mcp-server-example
```

**Step 3: Test with MCP Inspector**

```bash
npm run inspector
```

**Step 4: Login to NPM**

```bash
npm login
```

**Step 5: Publish**

```bash
# Dry run to see what will be published
npm publish --dry-run

# Actually publish
npm publish
```

**First-time Publishing**:
- Package name must be unique on NPM
- Email must be verified
- Consider scoped packages: `@yourusername/mcp-server-example`

**Step 6: Verify Installation**

```bash
npx mcp-server-example
```

### NPM Package Scopes

**Scoped Package** (Recommended for Organizations):

```json
{
  "name": "@yourorg/mcp-server-example",
  "version": "1.0.0"
}
```

**Benefits**:
- Namespace protection (avoid name collisions)
- Organizational branding
- Private packages (paid NPM feature)

**Publishing Scoped Packages**:

```bash
# Public scoped package
npm publish --access public

# Private scoped package (requires NPM Pro/Teams)
npm publish
```

### Version Management

**Update Version**:

```bash
# Patch: 1.0.0 → 1.0.1
npm version patch

# Minor: 1.0.0 → 1.1.0
npm version minor

# Major: 1.0.0 → 2.0.0
npm version major
```

**This automatically**:
1. Updates `package.json`
2. Creates a git commit
3. Creates a git tag

**Pre-release Versions**:

```bash
npm version prerelease --preid=alpha  # 1.0.0-alpha.0
npm version prerelease --preid=beta   # 1.0.0-beta.0
```

---

## Claude Desktop Configuration

### Configuration File Locations

**macOS**:
```
~/Library/Application Support/Claude/claude_desktop_config.json
```

**Windows**:
```
C:\Users\<Username>\AppData\Roaming\Claude\claude_desktop_config.json
```

**Linux** (when supported):
```
~/.config/Claude/claude_desktop_config.json
```

### Configuration Schema

**Basic Structure**:

```json
{
  "mcpServers": {
    "server-name": {
      "command": "command-to-run",
      "args": ["arg1", "arg2"],
      "env": {
        "ENV_VAR": "value"
      }
    }
  }
}
```

### Python Server Configuration

**PyPI Package**:

```json
{
  "mcpServers": {
    "example-server": {
      "command": "python",
      "args": ["-m", "mcp_server_example.server"]
    }
  }
}
```

**Alternatively (if console script installed)**:

```json
{
  "mcpServers": {
    "example-server": {
      "command": "mcp-server-example"
    }
  }
}
```

**With Virtual Environment (Recommended)**:

```json
{
  "mcpServers": {
    "example-server": {
      "command": "C:\\Users\\YourName\\venvs\\mcp-env\\Scripts\\python.exe",
      "args": ["-m", "mcp_server_example.server"]
    }
  }
}
```

### Node.js Server Configuration

**NPM Package via npx**:

```json
{
  "mcpServers": {
    "example-server": {
      "command": "npx",
      "args": ["-y", "mcp-server-example"]
    }
  }
}
```

**Windows-Specific (Full Path to npx.cmd)**:

```json
{
  "mcpServers": {
    "example-server": {
      "command": "C:\\Program Files\\nodejs\\npx.cmd",
      "args": ["-y", "mcp-server-example"]
    }
  }
}
```

**Global Installation**:

```json
{
  "mcpServers": {
    "example-server": {
      "command": "node",
      "args": ["C:\\Users\\YourName\\AppData\\Roaming\\npm\\node_modules\\mcp-server-example\\dist\\index.js"]
    }
  }
}
```

### Environment Variables

**API Keys and Secrets**:

```json
{
  "mcpServers": {
    "example-server": {
      "command": "mcp-server-example",
      "env": {
        "API_KEY": "your-api-key-here",
        "DATABASE_URL": "postgresql://localhost:5432/mydb",
        "DEBUG": "true"
      }
    }
  }
}
```

**Best Practices**:
- Never hardcode secrets in server code
- Use environment variables for configuration
- Document required environment variables in README
- Provide example configuration in docs

### Multiple Servers

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/Users/you/Documents"]
    },
    "example-server": {
      "command": "mcp-server-example",
      "env": {
        "API_KEY": "key123"
      }
    },
    "database": {
      "command": "python",
      "args": ["-m", "mcp_server_sqlite", "--db-path", "C:\\data\\mydb.sqlite"]
    }
  }
}
```

### Troubleshooting Configuration

**Common Issues**:

1. **Server not appearing in Claude Desktop**:
   - Restart Claude Desktop after config changes
   - Check JSON syntax (use JSON validator)
   - Verify command path is correct

2. **"Connection failed" error**:
   - Test command in terminal separately
   - Check server logs for errors
   - Verify dependencies installed

3. **Windows npx issues**:
   - Use full path: `C:\\Program Files\\nodejs\\npx.cmd`
   - Or use `node` with full script path

**Testing Configuration**:

```bash
# Test Python server manually
python -m mcp_server_example.server

# Test Node.js server manually
node dist/index.js

# Test with MCP Inspector
npx @modelcontextprotocol/inspector <your-command>
```

### Installation Documentation Template

**README.md Section**:

```markdown
## Installation for Claude Desktop

### Prerequisites

- Python 3.10+ or Node.js 18+ (depending on your server)
- Claude Desktop installed

### Step 1: Install the Server

**Python:**
```bash
pip install mcp-server-example
```

**Node.js:**
```bash
npm install -g mcp-server-example
# or use npx (no installation required)
```

### Step 2: Configure Claude Desktop

1. Open Claude Desktop configuration:
   - **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
   - **Windows**: `C:\Users\<Username>\AppData\Roaming\Claude\claude_desktop_config.json`

2. Add the server configuration:

**Python:**
```json
{
  "mcpServers": {
    "example-server": {
      "command": "python",
      "args": ["-m", "mcp_server_example.server"]
    }
  }
}
```

**Node.js (Windows):**
```json
{
  "mcpServers": {
    "example-server": {
      "command": "C:\\Program Files\\nodejs\\npx.cmd",
      "args": ["-y", "mcp-server-example"]
    }
  }
}
```

**Node.js (macOS/Linux):**
```json
{
  "mcpServers": {
    "example-server": {
      "command": "npx",
      "args": ["-y", "mcp-server-example"]
    }
  }
}
```

3. Restart Claude Desktop

### Step 3: Verify Installation

1. Open Claude Desktop
2. Look for the 🔌 icon indicating MCP servers are connected
3. Ask Claude: "What tools do you have access to?"
4. You should see tools from example-server listed

### Configuration Options

**Environment Variables:**

```json
{
  "mcpServers": {
    "example-server": {
      "command": "mcp-server-example",
      "env": {
        "API_KEY": "your-api-key",
        "DEBUG": "true"
      }
    }
  }
}
```

**Required Environment Variables:**
- `API_KEY`: Your API key for external service (required)
- `DEBUG`: Enable debug logging (optional, default: false)

### Troubleshooting

**Server not connecting:**
1. Verify installation: `mcp-server-example --help`
2. Check Claude Desktop logs
3. Test server manually: `mcp-server-example`

**Windows-specific issues:**
- Use full path to `npx.cmd`: `C:\\Program Files\\nodejs\\npx.cmd`
- Ensure Python is in PATH or use full path to python.exe
```

---

## Smithery.ai Deployment

### Overview

Smithery.ai is the largest open marketplace for MCP servers with one-click deployment from GitHub.

**Key Features**:
- Automatic deployment from GitHub
- Remote hosting with scaling
- Local distribution (TypeScript servers)
- CI/CD integration

### smithery.yaml Configuration

**Required File**: `smithery.yaml` in repository root

#### STDIO Server Example (TypeScript)

```yaml
# smithery.yaml for STDIO-based server
type: stdio

# Start command configuration
startCommand:
  type: stdio
  command: node
  args:
    - dist/index.js

# Configuration schema (JSON Schema)
configSchema:
  type: object
  properties:
    apiKey:
      type: string
      description: API key for external service
      title: API Key
    debugMode:
      type: boolean
      description: Enable debug logging
      title: Debug Mode
      default: false
  required:
    - apiKey

# Function that returns command configuration
commandFunction: |
  (config) => {
    return {
      command: 'node',
      args: ['dist/index.js'],
      env: {
        API_KEY: config.apiKey,
        DEBUG: config.debugMode ? 'true' : 'false'
      }
    };
  }
```

#### HTTP Server Example (FastMCP, Python)

```yaml
# smithery.yaml for HTTP-based server
type: http

# No startCommand needed - Smithery starts your app and routes /mcp endpoint

# Configuration schema
configSchema:
  type: object
  properties:
    databaseUrl:
      type: string
      description: Database connection string
      title: Database URL
    maxConnections:
      type: number
      description: Maximum concurrent connections
      title: Max Connections
      default: 10
  required:
    - databaseUrl
```

**HTTP Server Requirements**:
- Must implement Streamable HTTP transport
- Must handle `/mcp` endpoint
- Must listen on `PORT` environment variable (Smithery sets to 8081)
- Must handle CORS if needed
- Session configuration passed via query parameter

#### Custom Container (Advanced)

**For non-TypeScript servers or complex dependencies**:

**Dockerfile**:

```dockerfile
FROM python:3.12-slim

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application
COPY . .

# Expose port
EXPOSE 8081

# Start server
CMD ["python", "-m", "mcp_server_example.http_server"]
```

**smithery.yaml**:

```yaml
type: custom-container

configSchema:
  type: object
  properties:
    apiKey:
      type: string
      title: API Key
      description: Your API key
```

**Server Requirements**:
- Implement MCP Streamable HTTP transport
- Listen on `PORT` env var (default 8081)
- Handle `/mcp` endpoint
- Configure CORS:
  ```python
  cors_headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
  }
  ```

### Deployment Process

**Step 1: Prepare Repository**

1. Create `smithery.yaml` in root
2. Ensure code is in GitHub repository
3. (Optional) Add `Dockerfile` for custom containers

**Step 2: Connect to Smithery**

1. Go to https://smithery.ai/new
2. Click "Deploy" or "Connect GitHub"
3. Authorize Smithery GitHub App
4. Select repository

**Step 3: Configure Deployment**

Smithery automatically:
- Detects `smithery.yaml`
- Builds server (TypeScript: compiles, Container: builds image)
- Deploys to Smithery infrastructure
- Provides shareable URL

**Step 4: Test Deployment**

1. Get server URL from Smithery dashboard
2. Test with MCP Inspector:
   ```bash
   npx @modelcontextprotocol/inspector <smithery-server-url>
   ```

3. Add to Claude Desktop:
   ```json
   {
     "mcpServers": {
       "example-server": {
         "url": "https://your-server.smithery.ai/mcp",
         "apiKey": "your-api-key"
       }
     }
   }
   ```

### Distribution Modes

#### Remote Hosting (Default)

**Characteristics**:
- Server runs on Smithery infrastructure
- Automatic scaling and load balancing
- Monitoring and CI/CD included
- Users connect via HTTPS

**Best For**: Cloud-based servers, API integrations, databases

#### Local Distribution (TypeScript Only)

**Characteristics**:
- Server distributed as MCP bundle
- Users run server locally (one-click install)
- No remote infrastructure needed
- Better for file system access, local tools

**Best For**: File system servers, local development tools, privacy-sensitive operations

**Enable Local Distribution**:

```yaml
type: stdio
distribution: local  # Add this line

startCommand:
  type: stdio
  command: node
  args:
    - dist/index.js
```

### Session Configuration

Smithery passes session-specific configuration via query parameter:

**HTTP Server**:

```python
from urllib.parse import parse_qs, urlparse

def handle_mcp_request(request):
    # Parse query string
    query = parse_qs(urlparse(request.url).query)

    if 'config' in query:
        import json
        session_config = json.loads(query['config'][0])

        # Use session config
        api_key = session_config.get('apiKey')
        # ...
```

**STDIO Server** (via commandFunction):

Already handled by `commandFunction` in `smithery.yaml`

### Continuous Deployment

**Automatic Deployment on Push**:

1. Push to GitHub main/master branch
2. Smithery detects changes
3. Automatically rebuilds and redeploys
4. Zero-downtime deployment

**Pull Request Previews**:

- Smithery creates preview deployments for PRs
- Test changes before merging
- Preview URLs in PR status checks

### Monitoring and Logs

**Smithery Dashboard**:
- Real-time server status
- Request metrics
- Error logs
- Performance graphs

**Access Logs**:
1. Go to Smithery dashboard
2. Select your server
3. View "Logs" tab
4. Filter by time range, level, search terms

---

## GitHub Release Process

### Semantic Versioning and Git Tags

**Semantic Versioning Format**: `vMAJOR.MINOR.PATCH`

**Examples**:
- `v1.0.0`: First stable release
- `v1.1.0`: New features added
- `v1.0.1`: Bug fixes
- `v2.0.0`: Breaking changes

**Pre-release Tags**:
- `v1.0.0-alpha.1`: Alpha release
- `v1.0.0-beta.2`: Beta release
- `v1.0.0-rc.1`: Release candidate

### Creating Releases Manually

**Step 1: Create Git Tag**

```bash
# Create annotated tag
git tag -a v1.0.0 -m "Release version 1.0.0"

# Push tag to GitHub
git push origin v1.0.0
```

**Step 2: Create GitHub Release**

1. Go to `https://github.com/yourusername/repo/releases/new`
2. Select tag: `v1.0.0`
3. Fill in release details:
   - **Title**: `v1.0.0 - First Stable Release`
   - **Description**: (see template below)
4. Upload assets (optional): binaries, archives
5. Check "Set as latest release"
6. Click "Publish release"

**Release Description Template**:

```markdown
## What's New in v1.0.0

### Features
- Added support for Windows GPU access
- Implemented caching layer for better performance
- New tool: `analyze_system` for system diagnostics

### Bug Fixes
- Fixed path handling on Windows (#42)
- Resolved memory leak in long-running sessions (#38)
- Corrected error handling in API calls (#35)

### Breaking Changes
- Renamed `config.apiKey` to `config.api_key` for consistency
- Removed deprecated `old_tool` (use `new_tool` instead)

### Installation

**PyPI:**
```bash
pip install mcp-server-example==1.0.0
```

**NPM:**
```bash
npm install mcp-server-example@1.0.0
```

### Full Changelog
https://github.com/yourusername/repo/compare/v0.9.0...v1.0.0
```

### Automated Releases with semantic-release

**semantic-release** automatically determines version, generates changelog, and publishes releases based on commit messages.

**Setup (Node.js Project)**:

**Step 1: Install Dependencies**

```bash
npm install --save-dev semantic-release \
  @semantic-release/git \
  @semantic-release/changelog \
  @semantic-release/npm \
  @semantic-release/github
```

**Step 2: Configure (.releaserc.json)**

```json
{
  "branches": ["main", "master"],
  "plugins": [
    "@semantic-release/commit-analyzer",
    "@semantic-release/release-notes-generator",
    "@semantic-release/changelog",
    "@semantic-release/npm",
    "@semantic-release/github",
    [
      "@semantic-release/git",
      {
        "assets": ["package.json", "CHANGELOG.md"],
        "message": "chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}"
      }
    ]
  ]
}
```

**Step 3: GitHub Actions Workflow (.github/workflows/release.yml)**

```yaml
name: Release

on:
  push:
    branches:
      - main

jobs:
  release:
    runs-on: ubuntu-latest
    permissions:
      contents: write
      issues: write
      pull-requests: write
    steps:
      - uses: actions/checkout@v3
        with:
          fetch-depth: 0

      - uses: actions/setup-node@v3
        with:
          node-version: 18

      - run: npm ci

      - run: npm run build

      - run: npx semantic-release
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
```

**Step 4: Commit Message Convention**

Use Angular commit message format:

```
type(scope): subject

body

footer
```

**Types**:
- `feat`: New feature (triggers MINOR version bump)
- `fix`: Bug fix (triggers PATCH version bump)
- `docs`: Documentation changes (no version bump)
- `chore`: Maintenance (no version bump)
- `BREAKING CHANGE`: in footer (triggers MAJOR version bump)

**Examples**:

```
feat(tools): add GPU monitoring tool

Implements NVIDIA GPU monitoring via NVML bindings.
Provides real-time GPU memory, utilization, and temperature data.
```

```
fix(windows): correct path handling for UNC paths

Fixes #42. Windows UNC paths now correctly handled.
```

```
feat(api): redesign tool schema

BREAKING CHANGE: Tool schema now uses 'parameters' instead of 'inputSchema'.
Migrate by renaming the field in your tool definitions.
```

**Automatic Process**:
1. Push commit to `main` branch
2. semantic-release analyzes commits since last release
3. Determines next version based on commit types
4. Updates `CHANGELOG.md`
5. Creates git tag
6. Publishes to NPM
7. Creates GitHub release with notes

### Release Assets

**Include in GitHub Release**:
- Source code archives (automatic)
- Compiled binaries (if applicable)
- Standalone executables (PyInstaller, pkg)
- Documentation PDFs
- Example configurations

**Example: Attach Binary**

```bash
# Build standalone executable (Python example)
pip install pyinstaller
pyinstaller --onefile src/mcp_server_example/server.py

# Rename and upload
mv dist/server dist/mcp-server-example-windows-x64.exe
```

Upload via GitHub UI or use GitHub CLI:

```bash
gh release upload v1.0.0 dist/mcp-server-example-windows-x64.exe
```

### Changelog Automation

**conventional-changelog** generates changelogs from commit messages:

```bash
npm install --save-dev conventional-changelog-cli
```

**package.json**:

```json
{
  "scripts": {
    "changelog": "conventional-changelog -p angular -i CHANGELOG.md -s"
  }
}
```

**Generate Changelog**:

```bash
npm run changelog
git add CHANGELOG.md
git commit -m "docs: update changelog"
```

---

## Cross-Platform Considerations

### Path Handling

**Problem**: Windows uses `\`, Unix uses `/`

**Solution**: Use platform-agnostic path libraries

**Python**:

```python
from pathlib import Path
import os

# ✅ Good: Cross-platform
base_dir = Path("C:/Users/Name/Documents")  # Forward slashes work on Windows too!
file_path = base_dir / "file.txt"

# ✅ Good: os.path
file_path = os.path.join(base_dir, "subdir", "file.txt")

# ❌ Bad: Hardcoded separators
file_path = base_dir + "/" + "file.txt"  # Fails on some systems
```

**TypeScript/JavaScript**:

```typescript
import path from 'path';
import os from 'os';

// ✅ Good: Cross-platform
const filePath = path.join(baseDir, 'subdir', 'file.txt');

// ✅ Good: Normalize paths
const normalized = path.normalize(userPath);

// ❌ Bad: Hardcoded separators
const filePath = `${baseDir}/${subdir}/${file}`;  // Wrong on Windows
```

### Environment Variables

**Python**:

```python
import os

# ✅ Good: Handle both HOME and USERPROFILE
home = os.environ.get('USERPROFILE') or os.environ.get('HOME')

# ✅ Good: Use pathlib
from pathlib import Path
home = Path.home()  # Works everywhere!

# Platform detection
if os.name == 'nt':
    # Windows
    appdata = os.environ['APPDATA']
else:
    # Unix
    config_dir = Path.home() / '.config'
```

**TypeScript**:

```typescript
import os from 'os';

// ✅ Good: Cross-platform home directory
const homeDir = os.homedir();

// Platform detection
if (process.platform === 'win32') {
  // Windows
  const appData = process.env.APPDATA;
} else {
  // Unix
  const configDir = path.join(homeDir, '.config');
}
```

### Subprocess Execution

**Python**:

```python
import subprocess
import os

# ✅ Good: Shell awareness
subprocess.run(
    ['command', 'arg'],
    shell=(os.name == 'nt')  # Use shell on Windows for .bat/.cmd files
)

# ✅ Good: Use full path on Windows
if os.name == 'nt':
    node_cmd = r'C:\Program Files\nodejs\node.exe'
else:
    node_cmd = 'node'

subprocess.run([node_cmd, 'script.js'])
```

**TypeScript**:

```typescript
import { spawn } from 'child_process';

// ✅ Good: Shell option for Windows
const child = spawn('npx', ['some-tool'], {
  shell: process.platform === 'win32',
});

// ✅ Good: Handle executable extensions
const executable = process.platform === 'win32' ? 'tool.exe' : 'tool';
```

### Line Endings

**Git Configuration** (.gitattributes):

```
# Auto-detect text files
* text=auto

# Force LF for scripts
*.sh text eol=lf
*.py text eol=lf
*.ts text eol=lf

# Force CRLF for Windows-specific
*.bat text eol=crlf
*.cmd text eol=crlf
```

**Python**:

```python
# ✅ Good: Universal newlines (default in Python 3)
with open('file.txt', 'r') as f:
    content = f.read()  # \r\n automatically converted to \n

# ✅ Good: Write with platform-specific line endings
with open('file.txt', 'w') as f:
    f.write('Line 1\n')  # Becomes \r\n on Windows, \n on Unix
```

### Testing on Multiple Platforms

**GitHub Actions Multi-Platform Testing**:

```yaml
name: Test

on: [push, pull_request]

jobs:
  test:
    strategy:
      matrix:
        os: [ubuntu-latest, windows-latest, macos-latest]
        python-version: ['3.10', '3.11', '3.12']

    runs-on: ${{ matrix.os }}

    steps:
      - uses: actions/checkout@v3

      - name: Set up Python
        uses: actions/setup-python@v4
        with:
          python-version: ${{ matrix.python-version }}

      - name: Install dependencies
        run: |
          pip install -e .
          pip install pytest

      - name: Run tests
        run: pytest
```

**Platform-Specific Tests**:

```python
import pytest
import sys

@pytest.mark.skipif(sys.platform != 'win32', reason="Windows-only test")
def test_windows_registry():
    # Test Windows-specific functionality
    pass

@pytest.mark.skipif(sys.platform == 'win32', reason="Unix-only test")
def test_unix_permissions():
    # Test Unix-specific functionality
    pass
```

---

## Documentation Standards

### README.md Structure

**Complete Template**:

```markdown
# MCP Server Example

Brief description (1-2 sentences) of what this MCP server does.

## Features

- Feature 1
- Feature 2
- Feature 3

## Installation

### Prerequisites

- Python 3.10+ / Node.js 18+
- Claude Desktop or compatible MCP client

### Install via PyPI / NPM

**Python:**
```bash
pip install mcp-server-example
```

**Node.js:**
```bash
npm install -g mcp-server-example
```

## Configuration

### Claude Desktop

1. Open configuration file:
   - **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
   - **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

2. Add server configuration:

```json
{
  "mcpServers": {
    "example-server": {
      "command": "mcp-server-example",
      "env": {
        "API_KEY": "your-api-key-here"
      }
    }
  }
}
```

3. Restart Claude Desktop

### Environment Variables

- `API_KEY` (required): Your API key for external service
- `DEBUG` (optional): Enable debug logging (true/false)
- `MAX_CONNECTIONS` (optional): Maximum concurrent connections (default: 10)

## Usage

### Available Tools

#### tool_name_1
Description of what this tool does.

**Parameters:**
- `param1` (string, required): Description
- `param2` (number, optional): Description

**Example:**
```
Ask Claude: "Use tool_name_1 to process data.txt"
```

#### tool_name_2
Description of second tool.

**Parameters:**
- `param1` (string, required): Description

**Example:**
```
Ask Claude: "Use tool_name_2 to analyze the system"
```

## Development

### Setup

1. Clone repository:
```bash
git clone https://github.com/yourusername/mcp-server-example
cd mcp-server-example
```

2. Install dependencies:

**Python:**
```bash
pip install -e ".[dev]"
```

**Node.js:**
```bash
npm install
```

3. Build (TypeScript only):
```bash
npm run build
```

### Testing

**Python:**
```bash
pytest
```

**Node.js:**
```bash
npm test
```

### Debugging with MCP Inspector

```bash
npx @modelcontextprotocol/inspector mcp-server-example
```

## Troubleshooting

### Common Issues

**Server not connecting:**
- Verify installation: `mcp-server-example --help`
- Check Claude Desktop logs
- Ensure environment variables are set correctly

**Windows-specific issues:**
- Use full path to executable if command not found
- Ensure Python/Node.js is in PATH

## License

MIT License - see LICENSE file for details

## Contributing

Contributions welcome! Please read CONTRIBUTING.md first.

## Support

- Issues: https://github.com/yourusername/mcp-server-example/issues
- Discussions: https://github.com/yourusername/mcp-server-example/discussions

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for release history.
```

### API Documentation

**For Public Libraries** (if your server is also a library):

**Python: Use Sphinx**

```bash
pip install sphinx sphinx-rtd-theme
sphinx-quickstart docs
```

**TypeScript: Use TypeDoc**

```bash
npm install --save-dev typedoc
npx typedoc src/index.ts
```

### Code Comments

**Document Public APIs**:

**Python (Google Style)**:

```python
def execute_tool(name: str, arguments: dict) -> dict:
    """
    Execute a tool with given arguments.

    Args:
        name: The tool name to execute
        arguments: Dictionary of tool arguments

    Returns:
        Dictionary containing tool execution results

    Raises:
        ValueError: If tool name is unknown
        RuntimeError: If tool execution fails

    Example:
        >>> result = execute_tool("read_file", {"path": "/tmp/test.txt"})
        >>> print(result["content"])
    """
    pass
```

**TypeScript (TSDoc)**:

```typescript
/**
 * Execute a tool with given arguments.
 *
 * @param name - The tool name to execute
 * @param arguments - Object containing tool arguments
 * @returns Promise resolving to tool execution results
 * @throws {Error} If tool name is unknown
 *
 * @example
 * ```typescript
 * const result = await executeTool("read_file", { path: "/tmp/test.txt" });
 * console.log(result.content);
 * ```
 */
async function executeTool(name: string, arguments: Record<string, any>): Promise<ToolResult> {
  // ...
}
```

---

## Testing and Quality Assurance

### Unit Testing

**Python (pytest)**:

```python
# tests/test_tools.py
import pytest
from mcp_server_example.tools.tool1 import execute_tool1

@pytest.mark.asyncio
async def test_execute_tool1_success():
    result = await execute_tool1({"param1": "test"})
    assert result["status"] == "success"
    assert "output" in result

@pytest.mark.asyncio
async def test_execute_tool1_invalid_param():
    with pytest.raises(ValueError):
        await execute_tool1({"param1": ""})
```

**TypeScript (Jest)**:

```typescript
// tests/server.test.ts
import { createServer } from '../src/server';

describe('MCP Server', () => {
  let server: Server;

  beforeEach(() => {
    server = createServer();
  });

  test('lists available tools', async () => {
    const handler = server.getRequestHandler(ListToolsRequestSchema);
    const response = await handler({});

    expect(response.tools).toHaveLength(2);
    expect(response.tools[0].name).toBe('tool1');
  });

  test('executes tool successfully', async () => {
    const handler = server.getRequestHandler(CallToolRequestSchema);
    const response = await handler({
      params: {
        name: 'tool1',
        arguments: { param1: 'test' }
      }
    });

    expect(response.content).toBeDefined();
  });
});
```

### Integration Testing with MCP Inspector

**Test Server Manually**:

```bash
npx @modelcontextprotocol/inspector <your-command>
```

**Interactive Testing**:
1. Inspector shows available tools
2. Test tool invocations
3. Verify responses
4. Check error handling

### Code Quality Tools

**Python**:

```bash
# Type checking
mypy src/

# Linting
ruff check src/

# Formatting
black src/

# All together
mypy src/ && ruff check src/ && black --check src/
```

**TypeScript**:

```bash
# Type checking
tsc --noEmit

# Linting
eslint src/

# Formatting
prettier --check "src/**/*.ts"

# All together
npm run lint && npm run format:check && tsc --noEmit
```

### Pre-commit Hooks

**Install pre-commit** (Python):

```bash
pip install pre-commit
```

**.pre-commit-config.yaml**:

```yaml
repos:
  - repo: https://github.com/pre-commit/pre-commit-hooks
    rev: v4.4.0
    hooks:
      - id: trailing-whitespace
      - id: end-of-file-fixer
      - id: check-yaml
      - id: check-json

  - repo: https://github.com/psf/black
    rev: 23.3.0
    hooks:
      - id: black

  - repo: https://github.com/charliermarsh/ruff-pre-commit
    rev: v0.1.0
    hooks:
      - id: ruff

  - repo: https://github.com/pre-commit/mirrors-mypy
    rev: v1.3.0
    hooks:
      - id: mypy
```

**Install hooks**:

```bash
pre-commit install
```

Now runs automatically on `git commit`!

---

## Checklist for Release

### Pre-Release

- [ ] All tests passing on multiple platforms (Windows, Mac, Linux)
- [ ] Code coverage >80%
- [ ] Documentation complete and reviewed
- [ ] CHANGELOG.md updated
- [ ] Version number bumped (semver)
- [ ] README.md installation instructions tested
- [ ] Example configurations verified
- [ ] Security audit passed (npm audit, safety)
- [ ] Dependencies up to date
- [ ] License file present

### PyPI Release

- [ ] Built with `python -m build`
- [ ] Tested upload to TestPyPI
- [ ] Verified installation from TestPyPI
- [ ] Uploaded to PyPI with `twine upload`
- [ ] Verified installation from PyPI
- [ ] PyPI project page looks correct

### NPM Release

- [ ] Built with `npm run build`
- [ ] Tested locally with `npm link`
- [ ] `npm publish --dry-run` output reviewed
- [ ] Published to NPM
- [ ] Verified installation via `npx`
- [ ] NPM package page looks correct

### GitHub Release

- [ ] Git tag created with proper version
- [ ] Tag pushed to GitHub
- [ ] GitHub release created with notes
- [ ] Release assets uploaded (if any)
- [ ] Release marked as latest
- [ ] Changelog link included

### Smithery.ai

- [ ] smithery.yaml file present and correct
- [ ] Deployed to Smithery
- [ ] Tested with Smithery URL
- [ ] Listed in Smithery marketplace
- [ ] Documentation updated with Smithery instructions

### Post-Release

- [ ] Announcement posted (Twitter, Discord, etc.)
- [ ] awesome-mcp-servers PR submitted
- [ ] Documentation site updated (if applicable)
- [ ] Community notified
- [ ] Monitoring set up for issues/feedback

---

**Document Version**: 1.0
**Last Updated**: November 14, 2025
**Author**: Nova Consciousness Research
