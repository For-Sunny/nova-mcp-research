# File Server MCP

**Production-Grade File System Operations with Security Controls**

Secure, validated file system access for enterprise environments

Path traversal protection, input validation, and comprehensive error handling

---

## Overview

File Server MCP provides controlled file system operations for AI agents with enterprise-grade security. Designed for production systems requiring safe file access with path validation, permission checks, and audit logging.

**Key Capabilities:**
- Path traversal protection
- Input validation with Zod schemas
- Automatic backup creation
- Permission-aware operations
- Error response sanitization
- Support for glob patterns
- Thread-safe file operations

---

## Features

- **Enterprise Security**: Path validation, input sanitization, permission checks
- **Reliable Operations**: Automatic backups before modifications
- **Flexible Access**: Directory listing, file search with glob patterns
- **Data Protection**: Automatic backup rotation and recovery
- **Performance**: Efficient file I/O with sensible defaults
- **Error Handling**: Comprehensive error handling with secure responses
- **Audit Ready**: Logging support for compliance

---

## Installation

### Prerequisites

- Node.js >= 18.0.0

### Quick Start

```bash
# Install dependencies
npm install

# Create configuration
cp .env.example .env

# Start the server
npm start
```

### Configuration

Create a `.env` file (optional - uses sensible defaults):

```bash
# Security
ALLOWED_PATHS=C:/Users,D:/Data     # Comma-separated allowed paths
MAX_FILE_SIZE=10485760             # Max file size (10MB)

# Features
BACKUP_ENABLED=true                # Create backups before delete
BACKUP_KEEP_DAYS=30                # Backup retention (days)

# Debug
DEBUG=false                         # Enable debug logging
```

---

## Available Tools

### `read_file`
Read complete file contents as text.

```javascript
// Read a text file
read_file({
  path: "C:/Users/Documents/notes.txt",
  encoding: "utf8"
})

// Returns:
// {
//   content: "File contents...",
//   size: 2048,
//   path: "C:/Users/Documents/notes.txt"
// }
```

**Parameters:**
- `path` (string, required): File path (validated)
- `encoding` (string, optional): Encoding (default: "utf8")
- `head` (number, optional): Read only first N lines
- `tail` (number, optional): Read only last N lines

**Security:**
- Path validation and traversal protection
- File existence verification
- Permission checks
- Size limit enforcement

---

### `read_media_file`
Read image, audio, or binary files as base64.

```javascript
// Read an image file
read_media_file({
  path: "C:/Users/Pictures/screenshot.png"
})

// Returns:
// {
//   data: "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
//   mimeType: "image/png",
//   size: 1024
// }
```

**Parameters:**
- `path` (string, required): Path to media file

**Security:**
- Path validation
- File type verification
- Size limit enforcement
- Safe base64 encoding

---

### `write_file`
Create or overwrite a file with new content.

```javascript
// Create or overwrite a file
write_file({
  path: "C:/Users/Documents/new-file.txt",
  content: "File content here",
  create_backup: true
})

// Returns:
// {
//   success: true,
//   path: "C:/Users/Documents/new-file.txt",
//   size: 17,
//   backup: "C:/Users/Documents/.backups/new-file.txt.backup"
// }
```

**Parameters:**
- `path` (string, required): File path (validated)
- `content` (string, required): Content to write
- `create_backup` (boolean, optional): Create backup (default: true)

**Security:**
- Path validation
- Directory traversal protection
- File size validation
- Automatic backup before overwrite
- Permission verification

---

### `edit_file`
Make line-based edits to a text file.

```javascript
// Edit specific lines in a file
edit_file({
  path: "C:/config.txt",
  edits: [
    {
      oldText: "database=localhost",
      newText: "database=prod-server"
    }
  ],
  dryRun: false
})

// Returns git-style diff showing changes
```

**Parameters:**
- `path` (string, required): File path
- `edits` (array, required): Array of {oldText, newText} pairs
- `dryRun` (boolean, optional): Preview without writing (default: false)

**Security:**
- Path validation
- Exact match requirement (prevents accidental changes)
- Automatic backup before modification
- Dry-run capability for verification

---

### `list_directory`
List files and directories in a path.

```javascript
// List directory contents
list_directory({
  path: "C:/Users/Documents"
})

// Returns:
// {
//   entries: [
//     {
//       name: "document.txt",
//       type: "file",
//       size: 2048,
//       modified: "2025-01-15T14:30:00Z"
//     },
//     {
//       name: "subfolder",
//       type: "directory"
//     }
//   ],
//   total: 15
// }
```

**Parameters:**
- `path` (string, required): Directory path (validated)

**Security:**
- Path validation
- Directory traversal prevention
- Permission verification
- Safe error responses

---

### `create_directory`
Create a new directory (including nested paths).

```javascript
// Create nested directory
create_directory({
  path: "C:/Users/Documents/Projects/NewProject"
})

// Returns:
// {
//   success: true,
//   path: "C:/Users/Documents/Projects/NewProject"
// }
```

**Parameters:**
- `path` (string, required): Directory path to create

**Security:**
- Path validation
- Parent directory verification
- Permission checks

---

### `move_file`
Move or rename files and directories.

```javascript
// Move or rename a file
move_file({
  source: "C:/Users/Documents/old-name.txt",
  destination: "C:/Users/Documents/new-name.txt"
})

// Returns:
// {
//   success: true,
//   source: "C:/Users/Documents/old-name.txt",
//   destination: "C:/Users/Documents/new-name.txt"
// }
```

**Parameters:**
- `source` (string, required): Source path (validated)
- `destination` (string, required): Destination path (validated)

**Security:**
- Source and destination validation
- Overwrite prevention
- Directory traversal protection

---

### `delete_file`
Delete a file with automatic backup preservation.

```javascript
// Delete a file (with backup)
delete_file({
  path: "C:/Users/Documents/old-file.txt",
  create_backup: true
})

// Returns:
// {
//   success: true,
//   path: "C:/Users/Documents/old-file.txt",
//   backup: "C:/Users/Documents/.backups/old-file.txt.backup"
// }
```

**Parameters:**
- `path` (string, required): File path (validated)
- `create_backup` (boolean, optional): Create backup (default: true)

**Security:**
- Path validation
- Backup creation
- Confirmation requirement
- Permission verification

---

### `search_files`
Find files matching a glob pattern.

```javascript
// Search for Python files
search_files({
  path: "C:/Projects",
  pattern: "**/*.py",
  excludePatterns: ["**/test_*.py"]
})

// Returns:
// {
//   results: [
//     "C:/Projects/main.py",
//     "C:/Projects/utils/helpers.py",
//     "C:/Projects/src/app.py"
//   ],
//   total: 3
// }
```

**Parameters:**
- `path` (string, required): Root directory (validated)
- `pattern` (string, required): Glob pattern
- `excludePatterns` (array, optional): Patterns to exclude
- `maxResults` (number, optional): Result limit

**Security:**
- Path validation
- Glob complexity limits
- Result count limits
- Directory traversal prevention

---

### `get_file_info`
Get detailed metadata about a file or directory.

```javascript
// Get file information
get_file_info({
  path: "C:/Users/Documents/document.txt"
})

// Returns:
// {
//   path: "C:/Users/Documents/document.txt",
//   type: "file",
//   size: 2048,
//   created: "2025-01-10T08:00:00Z",
//   modified: "2025-01-15T14:30:00Z",
//   permissions: "rw",
//   isReadable: true,
//   isWritable: true
// }
```

**Parameters:**
- `path` (string, required): File or directory path

**Security:**
- Path validation
- Permission-aware reporting
- Safe error handling

---

## Security Features

### Path Traversal Protection

All paths are validated to prevent directory traversal attacks:

```javascript
// Protected against:
// - "../../../etc/passwd"
// - "..\\..\\windows\\system32"
// - Symlink attacks
// - Case-variation bypasses

// Validation includes:
// - Path normalization
// - Allowed path verification
// - Symlink resolution
```

### Input Validation

All user inputs are validated with Zod schemas:

```javascript
// File path validation
- Length limits
- Character whitelist
- No null bytes
- Normalized format

// File content validation
- Size limits (default 10MB)
- Encoding verification
- Content type checking
```

### Backup Strategy

Automatic backups protect against accidental deletion:

```javascript
// Backup location:
// {original_path}/.backups/{filename}.backup.{timestamp}

// Retention:
// - Kept for 30 days (configurable)
// - Automatic cleanup
// - Recovery capability
```

### Error Response Sanitization

- No stack traces exposed
- No system paths in errors
- Secure error messages
- Logging for debugging

### Permission-Aware Operations

- Respects OS file permissions
- Permission validation before operations
- Safe fallback behaviors
- Audit logging

---

## Performance

Typical performance metrics:

```
Operation              Time        Notes
──────────────────────────────────────────
Read small file        <1ms        < 100KB
Write small file       <2ms        < 100KB
List directory         <5ms        < 1000 items
Search (glob)          <50ms       Up to 10,000 files
Move file              <1ms        Same filesystem
Get file info          <1ms        Metadata only
```

---

## Architecture

### Security Layers

```
User Input
    ↓
Zod Validation (type, length, format)
    ↓
Path Normalization & Validation
    ↓
Traversal Protection Check
    ↓
Permission Verification
    ↓
File Operation
    ↓
Backup Creation (if applicable)
    ↓
Safe Response
```

### Component Design

```
MCP Client
    ↓
File Server MCP (this package)
    ├─ Input Validation
    ├─ Path Security
    ├─ Permission Checking
    └─ Backup Management
    ↓
File System (OS-level)
    ├─ Files
    ├─ Directories
    └─ Permissions
```

---

## Troubleshooting

### Permission Denied

```
Error: "EACCES: permission denied"

Solution:
1. Check file/directory permissions
2. Verify user has read/write access
3. For system files, may need elevated privileges
4. Check file owner and group
```

### Path Not Found

```
Error: "ENOENT: no such file or directory"

Solution:
1. Verify path is correct
2. Check path exists
3. For write operations, verify parent exists
4. Use normalized path format
```

### Path Traversal Blocked

```
Error: "Path traversal detected"

Solution:
1. Use absolute paths
2. Avoid ".." in paths
3. Check path is within allowed directories
4. Verify no symlink attacks
```

### File Locked

```
Error: "EBUSY: resource busy or locked"

Solution:
1. Close file in other applications
2. Wait for other operations
3. Check file locks: lsof (Linux) or tasklist (Windows)
4. Retry operation
```

### Backup Not Found

```
Error: "Backup file not found"

Solution:
1. Check backup retention settings
2. Verify backups are enabled
3. Check .backups directory exists
4. Review backup cleanup schedule
```

---

## Development

### Project Structure

```
file-server-mcp/
├── README.md                       # This file
├── package.json                    # Dependencies & scripts
├── manifest.json                   # MCP server manifest
├── .env.example                    # Configuration template
├── server/
│   ├── index.js                    # Main MCP server
│   └── utils.js                    # File operation helpers
└── node_modules/                   # Dependencies
```

### Running in Development

```bash
# Start with debug logging
DEBUG=true npm start

# Run tests
npm test

# Run security tests
npm run test:security

# Lint code
npm run lint
```

---

## Production Deployment

### Pre-Deployment Checklist

- [ ] Security audit completed
- [ ] Backup strategy configured
- [ ] Error logging set up
- [ ] Monitoring configured
- [ ] Permission policies verified
- [ ] Allowed paths configured
- [ ] File size limits appropriate

### Deployment Steps

```bash
# 1. Install dependencies
npm install --production

# 2. Create .env with production settings
cp .env.example .env
# Edit with production values

# 3. Verify permissions
# Ensure service user can access required paths

# 4. Start server
npm start

# 5. Monitor logs
tail -f logs/file-server.log
```

---

## License

MIT License

For more information, see LICENSE file.

---

## Support

For issues, questions, or security concerns:

1. Review error messages and troubleshooting section
2. Check file permissions and paths
3. Enable DEBUG=true for detailed logging
4. Verify configuration variables are set
5. Review security implementation details

---

## Requirements

- Node.js >= 18.0.0
- Read/write permissions on target file system
- Sufficient disk space for backups
- System clock synchronized (for backup timestamps)
