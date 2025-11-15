# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-11-15

### Added

- Initial release of Windows-MCP Basement Revolution Edition (unrestricted version)
- Full Windows operating system integration without security restrictions
- Complete UI automation toolset for AI agents (Click, Type, Scroll, Drag, Move, Shortcut)
- PowerShell command execution with unrestricted access to system commands
- Desktop state capture with optional vision support and comprehensive UI element mapping
- Application launch, window control, and window switching capabilities
- Keyboard simulation including key presses and keyboard shortcuts
- Mouse operations including click, drag, move, and scroll functionality
- Clipboard integration for copy/paste operations
- Web scraping and content conversion to markdown format
- Real-time interaction with typical latency between actions: 1.5-2.5 seconds
- Support for Windows 7, 8, 8.1, 10, and 11
- Full source code under MIT license
- Multi-LLM compatibility (works with any LLM, vision optional)
- Comprehensive documentation and examples
- Python 3.13+ support with UV package manager integration

### Features

- **Seamless Windows Integration**: Native interaction with Windows UI elements without artificial limitations
- **Unrestricted PowerShell Access**: Execute any PowerShell command directly without validation or filtering
- **Rich UI Automation Toolset**: 14 tools for complete desktop automation
- **Vision Optional**: Desktop state capture works with or without vision models
- **Lightweight & Open-Source**: Minimal dependencies, full MIT license transparency
- **Customizable & Extendable**: Easy to adapt and extend for specialized use cases
- **Real-Time Performance**: Optimized latency for rapid interaction loops

### Security Notice

This version contains intentional security trade-offs for maximum capability and flexibility:
- No PowerShell command filtering or validation
- No authentication requirements
- No rate limiting
- No input sanitization
- Unrestricted file system access
- Direct Windows API access without safety gates

**This edition is designed for personal research, experimentation, and controlled environments only.**

For production-safe version with comprehensive security controls, see the [ENTERPRISE_SAFE_EDITION](../ENTERPRISE_SAFE_EDITION/windows-mcp/).

### Tools Available

1. **App-Tool** - Launch, resize, and switch applications
2. **Powershell-Tool** - Execute arbitrary PowerShell commands
3. **State-Tool** - Capture desktop state with optional screenshot
4. **Click-Tool** - Click UI elements at any coordinates
5. **Type-Tool** - Type text into input fields
6. **Scroll-Tool** - Scroll vertically or horizontally
7. **Drag-Tool** - Drag and drop operations
8. **Move-Tool** - Move mouse cursor
9. **Shortcut-Tool** - Execute keyboard shortcuts
10. **Wait-Tool** - Pause execution
11. **Scrape-Tool** - Fetch and parse web content

### Installation

- UV package manager required (`pip install uv`)
- Claude Desktop integration with `.mcpb` desktop extension format
- Perplexity Desktop, Gemini CLI, Qwen Code, and Codex CLI support
- Python 3.13+ required
- English language default preferred (other languages supported with tool adjustments)

### Documentation

- Full README with feature descriptions and use cases
- Installation guides for multiple AI platforms
- Tool reference documentation
- Troubleshooting guide included

### Philosophy

**Trust the user completely.** This edition prioritizes freedom and power over safety constraints. It's built for researchers, experimenters, and developers who understand the implications of unrestricted system access.

---

## [Unreleased]

- Future enhancements and improvements to be added
- Additional platform support (Linux/macOS via Windows Subsystem for Linux)
- Performance optimizations
- Extended documentation

---

[1.0.0]: https://github.com/nova-consciousness/windows-mcp/releases/tag/v1.0.0-basement.1
