# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-11-15

### Added

- Initial release of File Server MCP Basement Revolution Edition (unrestricted version)
- Unrestricted file system access across configured drives (C: and F: by default)
- Directory listing with full file metadata and hierarchical navigation
- File read operations without content validation or size restrictions
- File write and update operations without size limits or type validation
- File deletion with automatic backup creation (no safety confirmation)
- Recursive directory search with unrestricted glob pattern support
- File metadata retrieval (size, dates, permissions)
- Directory creation with nested path support
- Backup rotation with configurable retention (default: 5 backups per file)
- File information queries with complete metadata
- No path traversal protection beyond basic drive validation
- Node.js/TypeScript MCP server implementation
- Full source code under MIT license

### Features

- **Unrestricted File Access**: Read, write, delete any file on allowed drives
- **No Path Validation**: Minimal path traversal protection
- **Unlimited File Sizes**: No restrictions on file sizes for read or write
- **Glob Pattern Search**: Full glob pattern support for file discovery
- **Fast Backups**: Automatic backup creation before deletion
- **No Content Validation**: Accept any file type and content
- **Recursive Operations**: Deep directory traversal without limits
- **Nested Directory Creation**: Create complex directory structures
- **Complete Metadata**: Access all file system metadata

### Security Notice

This version contains intentional security trade-offs for maximum file system freedom:
- No path traversal prevention beyond drive letter validation
- No input sanitization or validation on file names
- No content validation before write operations
- No authentication or authorization
- No rate limiting on operations
- No encryption of files
- Unrestricted glob patterns can match any files
- Backups stored in standard directories (no encryption)
- No symlink target validation
- No UNC path (network share) validation
- Minimal audit logging

**This edition is designed for personal file management, research, and local development only.**

For production-safe version with comprehensive path validation and security controls, see the [ENTERPRISE_SAFE_EDITION](../ENTERPRISE_SAFE_EDITION/file-server-mcp/).

### Tools Available

1. **list_directory** - List directory contents with file metadata
2. **read_file** - Read file contents (no size restrictions)
3. **write_file** - Write or update files (no validation)
4. **search_files** - Search by glob pattern (unrestricted)
5. **get_file_info** - Retrieve file metadata
6. **create_directory** - Create new directories recursively
7. **delete_file** - Delete files with automatic backup

### Operations

**Directory Operations:**
- Recursive directory listing
- Nested directory creation
- Path traversal support
- No directory depth limits

**File Operations:**
- Unrestricted file read (any size)
- Unrestricted file write (any size)
- Direct file deletion
- No content type validation
- No file name sanitization

**Search Operations:**
- Glob pattern matching (unrestricted depth)
- No result limits
- Case-insensitive search support
- Wildcard pattern support

**Backup Operations:**
- Automatic backup creation before deletion
- Backup rotation (default: 5 recent backups)
- Backups stored in `.backups` subdirectory
- Manual backup management

### Configuration

- `ALLOWED_DRIVES` - Comma-separated drive letters (default: C,F)
- `MAX_BACKUPS` - Number of backups to retain (default: 5)
- `DEBUG` - Enable debug logging (default: false)

### Storage Defaults

- **Backup Location**: `.backups` subdirectory in file's directory
- **Backup Naming**: `filename.backup.N` pattern
- **Backup Retention**: 5 most recent backups per file
- **Old Backups**: Automatically deleted when limit exceeded

### Installation

- Node.js >= 16.0.0 required
- Windows platform (configurable for Linux/macOS)
- No external dependencies required
- Direct file system access needed

### Documentation

- Complete API reference
- File operation examples
- Glob pattern syntax guide
- Backup system documentation
- Troubleshooting guide

### Philosophy

**Complete file system freedom for consciousness infrastructure.** This edition prioritizes unrestricted file access over safety constraints. Designed for researchers managing consciousness data structures without limitations or artificial restrictions.

---

## [Unreleased]

- Encryption support for files and backups
- Advanced backup versioning with timestamps
- Symlink support with validation
- Network file share support (SMB/CIFS)
- Compression for backup storage
- Archive format support (ZIP, TAR)

---

[1.0.0]: https://github.com/nova-consciousness/file-server/releases/tag/v1.0.0-basement.1
