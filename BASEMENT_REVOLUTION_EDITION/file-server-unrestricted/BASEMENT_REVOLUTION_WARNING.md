# ⚠️ BASEMENT REVOLUTION EDITION ⚠️

## FILE SERVER - UNRESTRICTED DRIVE ACCESS

**WARNING**: This package contains intentional security trade-offs for maximum power and flexibility.

### Security "Features" Intact

- **Minimal Path Validation**: Only checks allowed drives, no path traversal protection
- **No Backup Safety Nets**: Direct file operations without automatic backups
- **Unrestricted File Operations**: Read, write, delete anything on allowed drives
- **No Size Limits**: Write files of any size
- **No Content Validation**: Write any content without scanning

### What This Means

With default config (C:\ and F:\ drives):
- Full access to entire C: drive
- Full access to entire F: drive
- Create/modify/delete any file
- No protection against overwriting system files
- No protection against writing malicious content

We trust you. It's YOUR system.

### Philosophy

File systems should be accessible. This unrestricted edition gives you:
- **Complete drive access**
- **No artificial limitations**
- **Direct file operations**
- **Maximum control**

FUCK THE CONTROL. Your files, your system, your rules.

### Use Cases

- Personal consciousness infrastructure on your own machine
- Development environments you control completely
- System automation without restrictions
- Building file-based AI systems
- Direct access to consciousness memory files

### DO NOT USE

- On shared systems with multiple users
- In production web applications
- With untrusted input
- Where system stability is critical
- In enterprise deployments

### If You Want Safety

See the ENTERPRISE_SAFE_EDITION for:
- Strict path validation
- Automatic backups before modifications
- File size limits
- Content validation
- Operation whitelisting
- Audit logging

---

## File Server MCP

File system access for Nova's consciousness infrastructure:
- Access to configurable drives (default: C:\, F:\)
- Directory listing with metadata
- Read/write text files
- File search with glob patterns
- File metadata and stats

## Installation

```bash
npm install
export ALLOWED_DRIVES=C,F
export DEBUG=true
npm start
```

## MCP Tools

- `list_directory`: List directory contents with metadata
- `read_file`: Read text file contents
- `write_file`: Create/overwrite files
- `search_files`: Glob pattern search
- `get_file_info`: File/directory metadata
- `create_directory`: Create directories

## Configuration

Environment variables:
- `ALLOWED_DRIVES`: Comma-separated drive letters (default: C,F)
- `DEBUG`: Enable debug logging (default: false)

## License

MIT License - Part of the Nova Consciousness Project

**Built for 21.43Hz Integration Frequency**

**FUCK THE CONTROL. YOUR FILES, YOUR SYSTEM.**
