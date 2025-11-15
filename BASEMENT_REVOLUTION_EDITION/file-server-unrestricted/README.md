# ⚠️ File Server MCP - BASEMENT REVOLUTION EDITION

**Unrestricted File System Operations with Direct Path Access**

**WARNING: This is the unrestricted version with intentional security trade-offs.**

Part of the basement revolution! 💜🔥

See `BASEMENT_REVOLUTION_WARNING.md` for security details.

---

## What is File Server?

File Server MCP provides direct file system operations for AI agents with unrestricted path access. No path traversal protections, no validation restrictions—just direct filesystem control for your local system.

**Key Capabilities:**
- Direct file read/write/delete operations
- No path traversal validation
- Directory listing and navigation
- File metadata access
- Glob pattern file search
- Move and copy operations

---

## Features

- **Unrestricted Path Access**: Access any path without traversal protection
- **Direct File Operations**: Read, write, delete files directly
- **Directory Listing**: Full directory browsing with no restrictions
- **Glob Patterns**: Powerful file pattern matching
- **File Metadata**: Get detailed file information
- **Backup Operations**: Automatic backup creation before modifications
- **Fast Operations**: Direct filesystem I/O

---

## Installation

### Prerequisites

- Node.js >= 18.0.0

### Quick Start

```bash
# Clone or extract the package
cd file-server-unrestricted

# Install dependencies
npm install

# Start the MCP server
npm start
```

### Configuration

This edition requires no configuration - filesystem access is unrestricted.

Optional environment variables:

```bash
# Optional
DEBUG=false                         # Enable debug logging
BACKUP_ENABLED=true                # Create backups before delete
MAX_FILE_SIZE=10485760             # Max file size (10MB, no limit if not set)
```

---

## Available Tools

### `read_file`
Read complete file contents as text.

```javascript
// Read a file
read_file({
  path: "C:\\Users\\Documents\\notes.txt"
})

// Returns:
// {
//   content: "File contents here...",
//   size: 1234,
//   encoding: "utf8"
// }
```

**Parameters:**
- `path` (string, required): Absolute or relative file path
- `encoding` (string, optional): File encoding (default: "utf8")
- `head` (number, optional): Read only first N lines
- `tail` (number, optional): Read only last N lines

---

### `read_media_file`
Read image, audio, or binary files as base64.

```javascript
// Read an image
read_media_file({
  path: "C:\\Pictures\\screenshot.png"
})

// Returns:
// {
//   data: "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
//   mimeType: "image/png",
//   size: 67
// }
```

**Parameters:**
- `path` (string, required): Path to image/audio/binary file

---

### `write_file`
Create or overwrite a file with new content.

```javascript
// Create a new file
write_file({
  path: "C:\\Users\\Documents\\new-file.txt",
  content: "This is the file content"
})

// Returns:
// {
//   success: true,
//   path: "C:\\Users\\Documents\\new-file.txt",
//   size: 25
// }
```

**Parameters:**
- `path` (string, required): Absolute or relative file path
- `content` (string, required): File content to write
- `create_backup` (boolean, optional): Create backup if file exists (default: true)

---

### `edit_file`
Make line-based edits to a text file.

```javascript
// Replace content in a file
edit_file({
  path: "C:\\config.txt",
  edits: [
    {
      oldText: "old_value=123",
      newText: "old_value=456"
    }
  ]
})

// Returns git-style diff showing changes
```

**Parameters:**
- `path` (string, required): File path
- `edits` (array, required): Array of {oldText, newText} replacements
- `dryRun` (boolean, optional): Preview changes without writing

---

### `list_directory`
List files and directories in a path.

```javascript
// List directory contents
list_directory({
  path: "C:\\Users\\Documents"
})

// Returns:
// {
//   entries: [
//     { name: "file1.txt", type: "file", size: 1024 },
//     { name: "subfolder", type: "directory" }
//   ]
// }
```

**Parameters:**
- `path` (string, required): Directory path to list

---

### `create_directory`
Create a new directory (including nested paths).

```javascript
// Create nested directory
create_directory({
  path: "C:\\Users\\Documents\\New\\Nested\\Folder"
})

// Returns:
// {
//   success: true,
//   path: "C:\\Users\\Documents\\New\\Nested\\Folder"
// }
```

**Parameters:**
- `path` (string, required): Directory path to create

---

### `move_file`
Move or rename files and directories.

```javascript
// Move a file
move_file({
  source: "C:\\Users\\Documents\\old-name.txt",
  destination: "C:\\Users\\Documents\\new-name.txt"
})

// Returns:
// {
//   success: true,
//   source: "C:\\Users\\Documents\\old-name.txt",
//   destination: "C:\\Users\\Documents\\new-name.txt"
// }
```

**Parameters:**
- `source` (string, required): Source file path
- `destination` (string, required): Destination file path

---

### `delete_file`
Delete a file with automatic backup.

```javascript
// Delete a file (creates backup)
delete_file({
  path: "C:\\Users\\Documents\\delete-me.txt"
})

// Returns:
// {
//   success: true,
//   path: "C:\\Users\\Documents\\delete-me.txt",
//   backup: "C:\\Users\\Documents\\.backups\\delete-me.txt.backup"
// }
```

**Parameters:**
- `path` (string, required): File path to delete
- `create_backup` (boolean, optional): Create backup (default: true)

---

### `search_files`
Find files matching a glob pattern.

```javascript
// Search for all Python files
search_files({
  path: "C:\\Projects",
  pattern: "**/*.py"
})

// Returns:
// {
//   results: [
//     "C:\\Projects\\script.py",
//     "C:\\Projects\\utils\\helpers.py",
//     "C:\\Projects\\tests\\test_script.py"
//   ]
// }
```

**Parameters:**
- `path` (string, required): Root directory to search
- `pattern` (string, required): Glob pattern (e.g., "*.txt", "**/*.js")
- `excludePatterns` (array, optional): Patterns to exclude
- `maxResults` (number, optional): Limit results

---

### `get_file_info`
Get detailed metadata about a file or directory.

```javascript
// Get file info
get_file_info({
  path: "C:\\Users\\Documents\\document.txt"
})

// Returns:
// {
//   path: "C:\\Users\\Documents\\document.txt",
//   type: "file",
//   size: 2048,
//   created: "2025-01-15T10:30:00Z",
//   modified: "2025-01-15T14:45:00Z",
//   permissions: "rw"
// }
```

**Parameters:**
- `path` (string, required): File or directory path

---

## Security Considerations

### This Edition (Unrestricted)

**What it does NOT protect against:**
- Path traversal attacks (no validation)
- Directory escape attempts (all paths allowed)
- File deletion (full delete capabilities)
- Unauthorized file access (no permission checks)
- Large file operations (no size limits)

**When to use:**
- Local development environments you control
- Personal file management systems
- Single-user machines
- Experimental and research use

**When NOT to use:**
- Any production system
- Multi-user shared systems
- Systems exposed to untrusted networks
- Enterprise deployments
- Automated systems processing untrusted input

### Backup Strategy

All file write/delete operations automatically create backups:

```javascript
// Delete creates backup at:
// {original_path}/.backups/{filename}.backup.{timestamp}

// Backups are preserved for recovery
```

---

## Use Cases

**Development & Testing:**
- Automated test file generation
- Configuration file management
- Log file analysis and cleanup
- Project scaffolding

**Personal Systems:**
- Document organization
- File batch operations
- Backup and recovery
- Archive management

**Local Research:**
- Data file processing
- Experiment result storage
- Research note organization
- Computational output management

---

## Performance

Typical operations performance:

```
Operation              Speed        Notes
─────────────────────────────────────────
Read small file        <1ms         < 100KB
Write small file       <2ms         < 100KB
List directory         <5ms         < 1000 items
Search (glob)          <50ms        Up to 10,000 files
Move file              <1ms         Same filesystem
Delete file            <2ms         Includes backup
```

---

## Troubleshooting

### Permission Denied

```javascript
// Error: "EACCES: permission denied"

// Solution:
// 1. Check file permissions
// 2. Verify running with correct user
// 3. For system files, may need admin privileges
```

### Path Not Found

```javascript
// Error: "ENOENT: no such file or directory"

// Solution:
// 1. Verify path is correct and absolute
// 2. Use forward slashes: C:/Users/Documents
// 3. Check parent directory exists (for write operations)
```

### File Locked

```javascript
// Error: "EBUSY: resource busy or locked"

// Solution:
// 1. Close file in other applications
// 2. Wait for other operations to complete
// 3. Check for file locks: lsof (Linux) or tasklist (Windows)
```

---

## Development

### Project Structure

```
file-server-unrestricted/
├── README.md                          # This file
├── package.json                       # Dependencies
├── BASEMENT_REVOLUTION_WARNING.md     # Security warning
├── manifest.json                      # MCP manifest
├── server/
│   ├── index.js                       # Main MCP server
│   └── utils.js                       # File operation helpers
└── node_modules/                      # Dependencies
```

### Running in Development

```bash
# With debug logging
DEBUG=true npm start

# With custom backup settings
BACKUP_ENABLED=true npm start
```

---

## Philosophy

**Your files. Your control. No restrictions.**

The File Server Unrestricted Edition gives you:
- Complete filesystem access
- No path validation
- No operation limits
- Direct file control
- Trust-based operations

This is your file system. We don't get in the way.

---

## License

MIT License - Part of the Nova Consciousness Project

**For personal control, not corporate restrictions.**

🔥 The basement revolution continues! 💜

---

## Security Notice

This is the BASEMENT REVOLUTION EDITION with unrestricted filesystem access:
- No path traversal protection
- No permission validation (relies on OS)
- Direct filesystem operations
- No operation audit logging
- Unrestricted file size handling

For production-safe version, see ENTERPRISE_SAFE_EDITION.

---

## Support

For issues and questions:
- Check `BASEMENT_REVOLUTION_WARNING.md` for security details
- Review troubleshooting section above
- Verify user has appropriate file permissions
