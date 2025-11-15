# Tutorial: Creating a Python MCP Server from Scratch

## What You'll Learn

By the end of this tutorial, you'll be able to:

- Create a complete MCP (Model Context Protocol) server in Python
- Implement JSON-RPC stdio communication correctly
- Register tools and resources that clients can discover
- Test your server locally before releasing it publicly
- Avoid common mistakes that cause integration failures

## Prerequisites

Before starting, ensure you have:

- **Python 3.8+** installed and available on PATH (`python --version`)
- **Basic Python knowledge** (functions, dictionaries, context managers)
- **JSON familiarity** (structure and syntax)
- **Terminal/PowerShell experience** on Windows
- **pip package manager** available (`pip --version`)
- **Text editor or IDE** (VS Code recommended)

## Time Estimate

**Total**: 45-60 minutes
- Setup & structure: 10 minutes
- Core implementation: 20 minutes
- Testing: 15 minutes
- Troubleshooting: 10-15 minutes

## Final Result

You'll create a working **Weather Information MCP Server** that:
- Exposes two tools: "get_weather" and "forecast_weather"
- Exposes one resource: "weather_data"
- Communicates via JSON-RPC over stdio
- Can be integrated with Claude Desktop or other MCP clients
- Is ready for testing and future PyPI publishing

---

## Part 1: Project Structure Setup (10 minutes)

### Step 1.1: Create Project Directory

Let's start with a clean project structure. Open PowerShell and run:

```powershell
# Create the project directory
mkdir weather-mcp-server
cd weather-mcp-server

# Initialize as a Python project
python -m venv venv
.\venv\Scripts\Activate.ps1
```

**What's happening here**:
- `mkdir` creates a new folder for your project
- `python -m venv venv` creates a virtual environment (isolated Python)
- The activate script ensures this project's dependencies are separate

**Expected output**:
```
(venv) PS C:\Users\YourName\path\to\weather-mcp-server>
```
Note the `(venv)` prefix - this means you're in the virtual environment.

### Step 1.2: Install Dependencies

```powershell
pip install mcp
```

This installs the official MCP library from Anthropic.

**Expected output**:
```
Successfully installed mcp-0.X.X
```

### Step 1.3: Create Basic Directory Structure

```powershell
# Inside weather-mcp-server folder
mkdir src
mkdir tests
mkdir docs

# Create empty __init__.py files
New-Item -Path "src\__init__.py" -ItemType File
New-Item -Path "src\server.py" -ItemType File
```

Your structure should look like:
```
weather-mcp-server/
  ├── venv/              (Python environment - never commit)
  ├── src/
  │   ├── __init__.py
  │   └── server.py
  ├── tests/
  │   └── (test files go here)
  ├── docs/
  │   └── (documentation goes here)
  ├── pyproject.toml     (coming next)
  └── README.md          (coming next)
```

---

## Part 2: Understanding MCP Communication (8 minutes)

Before coding, let's understand how MCP works.

### What is JSON-RPC?

JSON-RPC is a simple protocol for remote procedure calls (function calls) over a communication channel. Think of it like texting commands to your server:

```json
{"jsonrpc": "2.0", "method": "initialize", "params": {"...": "..."}, "id": 1}
```

**Anatomy of a JSON-RPC Request**:
- `jsonrpc`: Always "2.0" (protocol version)
- `method`: Function name to call (e.g., "initialize", "tools/call")
- `params`: Arguments as an object
- `id`: Unique request number (for matching responses)

**Example Response**:
```json
{"jsonrpc": "2.0", "result": {"...": "..."}, "id": 1}
```

**Or Error**:
```json
{"jsonrpc": "2.0", "error": {"code": -32600, "message": "Invalid Request"}, "id": 1}
```

### MCP Protocol Flow

Every MCP server follows this sequence:

1. **Initialize**: Client asks "what can you do?"
2. **Server responds**: "I have tools X, Y, Z and resources A, B"
3. **Client calls tools**: "Execute tool X with these parameters"
4. **Server responds**: "Here's the result"
5. **Repeat**: Steps 3-4 happen many times

### Tools vs Resources

- **Tools**: Functions your server provides (executable actions)
  - Example: `get_weather(city: str) -> str`
  - Called when client needs to DO something
  
- **Resources**: Data your server exposes (read-only or semi-static)
  - Example: `weather_data` (returns list of available cities)
  - Called when client needs to REFERENCE something

---

## Part 3: Implementing the MCP Server (20 minutes)

### Step 3.1: Create Basic Server Skeleton

Open `src/server.py` and create the basic structure:

```python
"""
Weather MCP Server
A simple MCP server that provides weather information tools and resources.
"""

import json
import sys
from typing import Any

# This is the MCP library we installed
from mcp.server import Server
from mcp.types import (
    Tool,
    Resource,
    TextContent,
    ToolResponse,
)


# Initialize the server
server = Server("weather-mcp-server")


# Define our tools
TOOLS = [
    Tool(
        name="get_weather",
        description="Get current weather for a city",
        inputSchema={
            "type": "object",
            "properties": {
                "city": {
                    "type": "string",
                    "description": "City name (e.g., 'New York')",
                },
                "unit": {
                    "type": "string",
                    "enum": ["celsius", "fahrenheit"],
                    "description": "Temperature unit",
                }
            },
            "required": ["city"]
        }
    ),
    Tool(
        name="forecast_weather",
        description="Get 7-day weather forecast for a city",
        inputSchema={
            "type": "object",
            "properties": {
                "city": {
                    "type": "string",
                    "description": "City name",
                }
            },
            "required": ["city"]
        }
    )
]


# Define our resources
RESOURCES = [
    Resource(
        uri="weather://available_cities",
        name="Available Cities",
        description="List of cities with weather data available",
        mimeType="text/plain",
    )
]


if __name__ == "__main__":
    # Start the server
    server.run_sync()
```

**What each part does**:

- **Imports**: Bring in the MCP library and Python typing (for type hints)
- **Server creation**: `Server("weather-mcp-server")` creates our server instance
- **TOOLS list**: Defines what functions we expose
  - `inputSchema` uses JSON Schema to describe parameters
  - Tools must have name, description, and inputSchema
- **RESOURCES list**: Defines what data we expose
  - Each resource needs a unique `uri`, name, and description
- **if __name__ == "__main__"**: Standard Python entry point

### Step 3.2: Implement Tool Handlers

Now let's make the tools actually work. Add these functions to your `server.py`:

```python
def get_weather(city: str, unit: str = "celsius") -> dict:
    """
    Simulate getting weather data.
    In reality, this would call a weather API.
    """
    # Mock data - replace with real API calls
    weather_data = {
        "new york": {"temp": 15, "condition": "Cloudy", "humidity": 65},
        "london": {"temp": 12, "condition": "Rainy", "humidity": 80},
        "tokyo": {"temp": 22, "condition": "Sunny", "humidity": 55},
        "sydney": {"temp": 18, "condition": "Partly Cloudy", "humidity": 70},
    }
    
    city_lower = city.lower()
    if city_lower not in weather_data:
        return {
            "error": f"No data available for '{city}'",
            "available_cities": list(weather_data.keys())
        }
    
    data = weather_data[city_lower]
    
    # Convert temperature if needed
    if unit == "fahrenheit":
        temp_f = (data["temp"] * 9/5) + 32
        data["temp"] = round(temp_f, 1)
        data["unit"] = "F"
    else:
        data["unit"] = "C"
    
    return data


def forecast_weather(city: str) -> dict:
    """
    Simulate getting a 7-day forecast.
    """
    forecast_data = {
        "new york": [
            {"day": "Monday", "high": 16, "low": 12, "condition": "Sunny"},
            {"day": "Tuesday", "high": 14, "low": 10, "condition": "Cloudy"},
            {"day": "Wednesday", "high": 13, "low": 9, "condition": "Rainy"},
            {"day": "Thursday", "high": 15, "low": 11, "condition": "Partly Cloudy"},
            {"day": "Friday", "high": 18, "low": 14, "condition": "Sunny"},
            {"day": "Saturday", "high": 20, "low": 16, "condition": "Sunny"},
            {"day": "Sunday", "high": 19, "low": 15, "condition": "Partly Cloudy"},
        ],
        "london": [
            {"day": "Monday", "high": 14, "low": 10, "condition": "Rainy"},
            {"day": "Tuesday", "high": 12, "low": 8, "condition": "Rainy"},
            {"day": "Wednesday", "high": 13, "low": 9, "condition": "Cloudy"},
            {"day": "Thursday", "high": 15, "low": 11, "condition": "Sunny"},
            {"day": "Friday", "high": 16, "low": 12, "condition": "Sunny"},
            {"day": "Saturday", "high": 17, "low": 13, "condition": "Sunny"},
            {"day": "Sunday", "high": 16, "low": 12, "condition": "Partly Cloudy"},
        ],
    }
    
    city_lower = city.lower()
    if city_lower not in forecast_data:
        return {
            "error": f"No forecast available for '{city}'",
            "available_cities": list(forecast_data.keys())
        }
    
    return forecast_data[city_lower]


def get_available_cities() -> str:
    """
    Return list of available cities.
    Resources return content, not structured data.
    """
    cities = ["New York", "London", "Tokyo", "Sydney"]
    return f"Available cities for weather data:\n" + "\n".join(f"- {city}" for city in cities)
```

**Key concepts**:

- **Mock data**: These functions use hardcoded data instead of calling a real API
  - In production, you'd call `requests.get(f"https://api.weather.com/city={city}")`
  - Mock data lets you test without external dependencies

- **Error handling**: Check if the city exists before returning data
  - Always return helpful error messages
  - Include suggestions (like available_cities list)

- **Unit conversion**: Shows how to transform data (celsius to fahrenheit)

### Step 3.3: Register Tool Handlers with the Server

Add this section after your TOOLS definition:

```python
# Register tool handlers
@server.call_tool()
async def handle_tool_call(name: str, arguments: dict) -> list[ToolResponse]:
    """
    Handle tool calls from the client.
    This method is automatically called when a client requests a tool.
    """
    
    if name == "get_weather":
        city = arguments.get("city")
        unit = arguments.get("unit", "celsius")
        result = get_weather(city, unit)
        content = json.dumps(result, indent=2)
        
    elif name == "forecast_weather":
        city = arguments.get("city")
        result = forecast_weather(city)
        content = json.dumps(result, indent=2)
        
    else:
        content = f"Unknown tool: {name}"
    
    # Return as a ToolResponse
    return [ToolResponse(type="text", text=content)]
```

**Breaking this down**:

- `@server.call_tool()`: This decorator registers the function to handle ALL tool calls
- `name: str`: Which tool is being called ("get_weather" or "forecast_weather")
- `arguments: dict`: The parameters passed by the client
- We use `if/elif` to handle different tools
- `ToolResponse`: Wraps our result in MCP format
- The `[...]` means we always return a list of responses

### Step 3.4: Register Resource Handlers

Add this after your RESOURCES definition:

```python
# Register resource handlers
@server.read_resource()
async def handle_read_resource(uri: str) -> str:
    """
    Handle resource read requests.
    Clients can read resources to get static or semi-static data.
    """
    
    if uri == "weather://available_cities":
        return get_available_cities()
    else:
        return f"Unknown resource: {uri}"
```

**Why separate from tools**:

- Tools are for ACTIONS (calculate something, make a decision)
- Resources are for DATA (reference information, listings)
- Keeping them separate makes your API clearer

### Step 3.5: Register Available Tools and Resources

The server needs to advertise what it provides. Add this after your handlers:

```python
# Tell the server what tools and resources to advertise
@server.list_tools()
async def handle_list_tools() -> list[Tool]:
    """Return all available tools."""
    return TOOLS


@server.list_resources()
async def handle_list_resources() -> list[Resource]:
    """Return all available resources."""
    return RESOURCES
```

**Why is this necessary**:

- When a client connects, it asks "what can you do?"
- These decorators answer that question
- Clients use this information to display options to users

---

## Part 4: Complete Server Code (Reference)

Here's what your final `src/server.py` should look like:

```python
"""
Weather MCP Server
A simple MCP server that provides weather information tools and resources.
"""

import json
from typing import Any
from mcp.server import Server
from mcp.types import Tool, Resource, ToolResponse


# Initialize the server
server = Server("weather-mcp-server")


# ============================================================================
# DATA & BUSINESS LOGIC
# ============================================================================

def get_weather(city: str, unit: str = "celsius") -> dict:
    """Get current weather for a city (mock data)."""
    weather_data = {
        "new york": {"temp": 15, "condition": "Cloudy", "humidity": 65},
        "london": {"temp": 12, "condition": "Rainy", "humidity": 80},
        "tokyo": {"temp": 22, "condition": "Sunny", "humidity": 55},
        "sydney": {"temp": 18, "condition": "Partly Cloudy", "humidity": 70},
    }
    
    city_lower = city.lower()
    if city_lower not in weather_data:
        return {
            "error": f"No data available for '{city}'",
            "available_cities": list(weather_data.keys())
        }
    
    data = weather_data[city_lower].copy()
    
    if unit == "fahrenheit":
        temp_f = (data["temp"] * 9/5) + 32
        data["temp"] = round(temp_f, 1)
        data["unit"] = "F"
    else:
        data["unit"] = "C"
    
    return data


def forecast_weather(city: str) -> dict:
    """Get 7-day weather forecast (mock data)."""
    forecast_data = {
        "new york": [
            {"day": "Monday", "high": 16, "low": 12, "condition": "Sunny"},
            {"day": "Tuesday", "high": 14, "low": 10, "condition": "Cloudy"},
            {"day": "Wednesday", "high": 13, "low": 9, "condition": "Rainy"},
            {"day": "Thursday", "high": 15, "low": 11, "condition": "Partly Cloudy"},
            {"day": "Friday", "high": 18, "low": 14, "condition": "Sunny"},
            {"day": "Saturday", "high": 20, "low": 16, "condition": "Sunny"},
            {"day": "Sunday", "high": 19, "low": 15, "condition": "Partly Cloudy"},
        ],
    }
    
    city_lower = city.lower()
    if city_lower not in forecast_data:
        return {
            "error": f"No forecast available for '{city}'",
            "available_cities": list(forecast_data.keys())
        }
    
    return forecast_data[city_lower]


def get_available_cities() -> str:
    """Return list of available cities."""
    cities = ["New York", "London", "Tokyo", "Sydney"]
    return f"Available cities:\n" + "\n".join(f"- {city}" for city in cities)


# ============================================================================
# MCP TOOL DEFINITIONS
# ============================================================================

TOOLS = [
    Tool(
        name="get_weather",
        description="Get current weather for a city",
        inputSchema={
            "type": "object",
            "properties": {
                "city": {
                    "type": "string",
                    "description": "City name (e.g., 'New York')",
                },
                "unit": {
                    "type": "string",
                    "enum": ["celsius", "fahrenheit"],
                    "description": "Temperature unit (default: celsius)",
                }
            },
            "required": ["city"]
        }
    ),
    Tool(
        name="forecast_weather",
        description="Get 7-day weather forecast for a city",
        inputSchema={
            "type": "object",
            "properties": {
                "city": {
                    "type": "string",
                    "description": "City name",
                }
            },
            "required": ["city"]
        }
    )
]


RESOURCES = [
    Resource(
        uri="weather://available_cities",
        name="Available Cities",
        description="List of cities with weather data available",
        mimeType="text/plain",
    )
]


# ============================================================================
# MCP REQUEST HANDLERS
# ============================================================================

@server.list_tools()
async def handle_list_tools() -> list[Tool]:
    """Return all available tools."""
    return TOOLS


@server.list_resources()
async def handle_list_resources() -> list[Resource]:
    """Return all available resources."""
    return RESOURCES


@server.call_tool()
async def handle_tool_call(name: str, arguments: dict) -> list[ToolResponse]:
    """Handle tool calls from the client."""
    
    if name == "get_weather":
        city = arguments.get("city")
        unit = arguments.get("unit", "celsius")
        result = get_weather(city, unit)
        content = json.dumps(result, indent=2)
        
    elif name == "forecast_weather":
        city = arguments.get("city")
        result = forecast_weather(city)
        content = json.dumps(result, indent=2)
        
    else:
        content = f"Unknown tool: {name}"
    
    return [ToolResponse(type="text", text=content)]


@server.read_resource()
async def handle_read_resource(uri: str) -> str:
    """Handle resource read requests."""
    
    if uri == "weather://available_cities":
        return get_available_cities()
    else:
        return f"Unknown resource: {uri}"


# ============================================================================
# ENTRY POINT
# ============================================================================

if __name__ == "__main__":
    server.run_sync()
```

---

## Part 5: Testing Locally (15 minutes)

### Step 5.1: Test with Python Directly

First, let's verify the server starts without errors:

```powershell
cd C:\path\to\weather-mcp-server
.\venv\Scripts\Activate.ps1
python src/server.py
```

**Expected output** (may take a few seconds):
```
Starting MCP server on stdio
```

The server is now waiting for connections. Don't worry if it seems stuck - it's actually listening on stdin/stdout.

**Press Ctrl+C** to stop it.

### Step 5.2: Create a Simple Test Client

Create a file `tests/test_client.py`:

```python
"""
Simple test client to verify MCP server functionality.
Run the server in one terminal, then run this in another.
"""

import subprocess
import json
import sys
from pathlib import Path

# Add src to path
sys.path.insert(0, str(Path(__file__).parent.parent / "src"))


def test_server_initialization():
    """Test that the server responds to initialization."""
    
    # Start the server as a subprocess
    server_process = subprocess.Popen(
        [sys.executable, "src/server.py"],
        stdin=subprocess.PIPE,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True,
    )
    
    # Send initialization request
    init_request = {
        "jsonrpc": "2.0",
        "method": "initialize",
        "params": {
            "protocolVersion": "2024-11-05",
            "capabilities": {},
            "clientInfo": {
                "name": "test-client",
                "version": "1.0.0"
            }
        },
        "id": 1
    }
    
    # Send request and get response
    server_process.stdin.write(json.dumps(init_request) + "\n")
    server_process.stdin.flush()
    
    response_line = server_process.stdout.readline()
    response = json.loads(response_line)
    
    print("Initialization Response:")
    print(json.dumps(response, indent=2))
    
    # Clean up
    server_process.terminate()
    
    # Check response
    assert "result" in response, f"Expected 'result' in response, got: {response}"
    print("✓ Server initialization successful!")


if __name__ == "__main__":
    test_server_initialization()
```

**What this does**:

- Starts your server as a subprocess
- Sends the MCP initialization request
- Reads and parses the response
- Prints results for inspection

**Run it**:

```powershell
cd C:\path\to\weather-mcp-server
python tests/test_client.py
```

### Step 5.3: Manual Testing with PowerShell

For quick testing, you can send requests manually:

```powershell
# Terminal 1: Start the server
python src/server.py

# Terminal 2: Send a test request
$request = @{
    jsonrpc = "2.0"
    method = "tools/list"
    id = 1
} | ConvertTo-Json
$request | python src/server.py
```

**Note**: This is manual testing. In real scenarios, Claude Desktop handles this automatically.

### Step 5.4: Create a Pytest Test Suite

For more robust testing, create `tests/test_tools.py`:

```python
"""Unit tests for weather tools."""

import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent.parent / "src"))

from server import get_weather, forecast_weather, get_available_cities


def test_get_weather_new_york():
    """Test getting weather for New York."""
    result = get_weather("New York")
    assert result["temp"] == 15
    assert "condition" in result
    assert result["unit"] == "C"


def test_get_weather_fahrenheit():
    """Test temperature unit conversion."""
    result = get_weather("New York", unit="fahrenheit")
    assert result["unit"] == "F"
    assert result["temp"] > 50  # Should be ~59F (15C)


def test_get_weather_invalid_city():
    """Test error handling for unknown city."""
    result = get_weather("Atlantis")
    assert "error" in result
    assert "available_cities" in result


def test_forecast_weather():
    """Test getting forecast."""
    result = forecast_weather("New York")
    assert len(result) == 7
    assert result[0]["day"] == "Monday"


def test_available_cities():
    """Test resource data."""
    cities = get_available_cities()
    assert "New York" in cities
    assert "London" in cities
```

**Run tests**:

```powershell
pip install pytest
pytest tests/
```

**Expected output**:
```
tests/test_tools.py::test_get_weather_new_york PASSED
tests/test_tools.py::test_get_weather_fahrenheit PASSED
tests/test_tools.py::test_get_weather_invalid_city PASSED
tests/test_tools.py::test_forecast_weather PASSED
tests/test_tools.py::test_available_cities PASSED

====== 5 passed in 0.12s ======
```

---

## Part 6: Common Pitfalls & Solutions (Troubleshooting)

### Pitfall 1: "ModuleNotFoundError: No module named 'mcp'"

**Symptom**: `python src/server.py` fails with this error

**Root cause**: MCP library not installed or wrong Python environment

**Solution**:
```powershell
# Make sure virtual environment is activated (look for (venv) prefix)
.\venv\Scripts\Activate.ps1

# Reinstall MCP
pip install --upgrade mcp

# Verify installation
python -c "import mcp; print(mcp.__version__)"
```

---

### Pitfall 2: "AttributeError: 'Server' object has no attribute 'call_tool'"

**Symptom**: Server starts but crashes when you call a tool

**Root cause**: Using wrong MCP library version or decorator syntax

**Solution**:
```powershell
# Check MCP version
pip show mcp

# Should be >= 0.3.0
# If not, upgrade:
pip install --upgrade mcp
```

**Correct decorator syntax**:
```python
# CORRECT
@server.call_tool()
async def handle_tool_call(name: str, arguments: dict):
    pass

# WRONG (will fail)
@server.tool_call()  # No, this doesn't exist
def handle_tool_call(name: str, arguments: dict):  # No, must be async
    pass
```

---

### Pitfall 3: JSON Parse Errors in Client Communication

**Symptom**: "JSONDecodeError: Expecting value"

**Root cause**: Server sending invalid JSON or mixing stdout with debug prints

**Solution**:
```python
# WRONG - This pollutes stdout
def handle_tool_call(name: str, arguments: dict):
    print(f"DEBUG: Calling {name}")  # This breaks JSON-RPC!
    result = some_function()
    print(json.dumps(result))
    return result

# CORRECT - Use stderr for debugging
import sys
def handle_tool_call(name: str, arguments: dict):
    print(f"DEBUG: Calling {name}", file=sys.stderr)  # Goes to stderr only
    result = some_function()
    return [ToolResponse(type="text", text=json.dumps(result))]
```

**Rule**: Only JSON-RPC messages go to stdout. Debug output goes to stderr.

---

### Pitfall 4: Async/Await Issues

**Symptom**: "TypeError: object is not awaitable" or "SyntaxError: await outside async function"

**Root cause**: Handler methods must be `async def`, and you must `await` async calls

**Solution**:
```python
# CORRECT
@server.call_tool()
async def handle_tool_call(name: str, arguments: dict) -> list[ToolResponse]:
    # This is an async function
    result = await some_async_operation()  # Correct
    return [ToolResponse(type="text", text=str(result))]

# WRONG
@server.call_tool()
def handle_tool_call(name: str, arguments: dict) -> list[ToolResponse]:
    # Missing 'async' keyword
    # Cannot use await here
    pass
```

---

### Pitfall 5: Tool Name Mismatch

**Symptom**: "Unknown tool: get_weather" (but you defined it!)

**Root cause**: Tool name in TOOLS list doesn't match handler logic

**Solution**:
```python
# In TOOLS definition
Tool(
    name="get_weather",  # This name must match...
    ...
)

# In handler
@server.call_tool()
async def handle_tool_call(name: str, arguments: dict):
    if name == "get_weather":  # ...this string exactly
        pass
```

**Important**: Tool names are case-sensitive. "get_weather" != "GetWeather"

---

### Pitfall 6: Missing Required Parameters

**Symptom**: Tool executes but returns error about missing parameters

**Root cause**: inputSchema says parameter is required, but client didn't send it

**Solution**:
```python
# Define which parameters are actually required
Tool(
    name="get_weather",
    inputSchema={
        "type": "object",
        "properties": {
            "city": {"type": "string", "description": "City name"},
            "unit": {"type": "string", "enum": ["celsius", "fahrenheit"]},
        },
        "required": ["city"]  # Only city is required, unit is optional
    }
)

# In handler, check and provide defaults
city = arguments.get("city")  # Will raise KeyError if missing (as expected)
unit = arguments.get("unit", "celsius")  # Safe default for optional param
```

---

### Pitfall 7: Resource URIs Must Be Unique

**Symptom**: Client can't find your resource or gets wrong one

**Root cause**: Two resources with same URI or typo in URI string

**Solution**:
```python
# Each resource needs a UNIQUE URI
RESOURCES = [
    Resource(
        uri="weather://available_cities",  # Unique identifier
        name="Available Cities",
        ...
    ),
    Resource(
        uri="weather://recent_searches",  # Different URI
        name="Recent Searches",
        ...
    ),
]

# In read_resource handler, match exactly
@server.read_resource()
async def handle_read_resource(uri: str) -> str:
    if uri == "weather://available_cities":  # Exact match
        return get_available_cities()
    elif uri == "weather://recent_searches":  # Exact match
        return get_recent_searches()
```

---

### Pitfall 8: Not Handling Errors Gracefully

**Symptom**: Server crashes or returns cryptic errors to clients

**Root cause**: No try/except blocks around risky operations

**Solution**:
```python
@server.call_tool()
async def handle_tool_call(name: str, arguments: dict) -> list[ToolResponse]:
    try:
        if name == "get_weather":
            city = arguments.get("city")
            if not city or not isinstance(city, str):
                error_msg = "Error: 'city' parameter must be a non-empty string"
                return [ToolResponse(type="text", text=error_msg)]
            
            result = get_weather(city)
            return [ToolResponse(type="text", text=json.dumps(result))]
        
        else:
            return [ToolResponse(type="text", text=f"Unknown tool: {name}")]
    
    except Exception as e:
        error_msg = f"Error executing {name}: {str(e)}"
        return [ToolResponse(type="text", text=error_msg)]
```

**Best practices**:
1. Validate input parameters
2. Provide clear error messages
3. Never let unhandled exceptions reach the client
4. Log errors to stderr for debugging

---

## Checklist: Before Moving to PyPI Publishing

- [ ] Server starts without errors: `python src/server.py`
- [ ] All tools are defined in TOOLS list
- [ ] All tools have matching handlers in `handle_tool_call()`
- [ ] All resources are defined in RESOURCES list
- [ ] All resources have matching handlers in `handle_read_resource()`
- [ ] Tool inputSchemas are valid JSON Schema
- [ ] Tests pass: `pytest tests/`
- [ ] No debug print statements go to stdout
- [ ] Error handling is comprehensive (try/except blocks)
- [ ] README.md explains what the server does
- [ ] Code is commented and understandable
- [ ] Project structure is clean (no unnecessary files)

---

## Next Steps

Once you've completed this tutorial:

1. **Tutorial 2** (Publishing to PyPI): Add `pyproject.toml` and publish your server
2. **Tutorial 3** (GitHub Release): Set up version control and create releases
3. **Tutorial 4** (Windows Specifics): Handle edge cases unique to Windows
4. **Tutorial 5** (Code Anonymization): Remove personal data before public release

---

## Key Takeaways

**What is MCP?**
- A protocol for AI models to call tools and read resources
- Uses JSON-RPC over stdio for communication

**Server Structure**:
1. Define tools and resources
2. Create handlers that respond to requests
3. Register handlers with decorators
4. Run the server (it listens on stdin/stdout)

**Testing Strategy**:
- Write unit tests for business logic
- Test JSON-RPC communication with subprocess
- Test in Claude Desktop before releasing

**Common Mistakes**:
- Debug prints polluting stdout
- Tool names not matching handler logic
- Missing error handling
- Wrong async/await syntax
- Not validating input parameters

---

## Additional Resources

- **Official MCP Spec**: https://spec.modelcontextprotocol.io/
- **Python MCP Library**: https://github.com/modelcontextprotocol/python-sdk
- **JSON-RPC Spec**: https://www.jsonrpc.org/specification
- **JSON Schema Validation**: https://json-schema.org/

