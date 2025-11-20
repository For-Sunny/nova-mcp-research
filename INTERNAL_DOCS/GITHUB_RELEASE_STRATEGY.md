# GITHUB RELEASE STRATEGY - MCP DUAL-TIER EDITION

**Date**: November 15, 2025
**Status**: Ready for GitHub publication
**Editions**: Basement Revolution + Enterprise Safe

---

## RELEASE STRUCTURE OPTIONS

### Option 1: Single Repository with Two Editions (RECOMMENDED)

**Repository Name**: `nova-mcp-collection` or `mcp-dual-tier`

**Structure**:
```
nova-mcp-collection/
├── README.md (main - explains dual-tier strategy)
├── LICENSE (MIT)
├── basement-revolution/
│   ├── windows-mcp-unrestricted/
│   ├── cascade-memory-unrestricted/
│   ├── faiss-memory-unrestricted/
│   └── file-server-unrestricted/
├── enterprise-safe/
│   ├── windows-mcp/
│   ├── cascade-memory-mcp/
│   ├── faiss-memory-mcp/
│   └── file-server-mcp/
└── docs/
    ├── COMPARISON.md
    ├── SECURITY_REVIEW.md
    └── INSTALLATION.md
```

**Advantages**:
- Clear comparison between editions
- Single place to discover both options
- Honest about trade-offs in one location
- Easier to maintain

**GitHub Release Tags**:
- `v1.0.0-basement` - Basement Revolution Edition
- `v1.0.0-enterprise` - Enterprise Safe Edition

---

### Option 2: Separate Repositories per Edition

**Repositories**:
1. `mcp-basement-revolution` - Unrestricted editions
2. `mcp-enterprise-safe` - Production-ready editions

**Advantages**:
- Clearer separation for different audiences
- Separate stars/issues/PRs
- Different README messaging

**Disadvantages**:
- Harder to compare
- Duplicate maintenance
- Less clear that both exist

---

### Option 3: Individual Package Repositories (8 total)

**Basement Revolution**:
1. `windows-mcp-unrestricted`
2. `cascade-memory-unrestricted`
3. `faiss-memory-unrestricted`
4. `file-server-unrestricted`

**Enterprise Safe**:
5. `windows-mcp`
6. `cascade-memory-mcp`
7. `faiss-memory-mcp`
8. `file-server-mcp`

**Advantages**:
- Focused repositories
- Individual npm/PyPI packages map 1:1
- Clean separation

**Disadvantages**:
- 8 repositories to maintain
- Harder to discover both editions
- No central comparison

---

## RECOMMENDED: Option 1 (Single Repo, Dual-Tier)

**Why**: Transparency, easy comparison, honest marketing about trade-offs

---

## WHAT EACH PACKAGE CURRENTLY HAS

### Python Packages (Windows-MCP)

**Basement Revolution Edition**:
- ✅ `pyproject.toml` - Dependencies defined
- ✅ `README.md` - Installation and usage
- ❌ `requirements.txt` - **NEED TO ADD** (for pip users who don't use pyproject.toml)
- ✅ LICENSE specified in pyproject.toml
- ✅ Dependencies: click, fastmcp, pyautogui, pywinauto, etc.

**Enterprise Safe Edition**:
- ✅ `pyproject.toml` - Dependencies with security fixes
- ✅ `README.md` - Professional documentation
- ❌ `requirements.txt` - **NEED TO ADD**
- ✅ `.env.example` - Configuration template
- ✅ Dependencies: Same as basement + audit logging

### Node.js Packages (CASCADE, Faiss, File Server)

**Basement Revolution Edition**:
- ✅ `package.json` - Dependencies and scripts
- ✅ `manifest.json` - MCP configuration
- ✅ `README.md` - Documentation
- ❌ `package-lock.json` - **SHOULD GENERATE** (npm install)
- ✅ Dependencies listed

**Enterprise Safe Edition**:
- ✅ `package.json` - Dependencies including zod
- ✅ `manifest.json` - MCP configuration
- ✅ `README.md` - Professional docs
- ✅ `.env.example` - Configuration templates
- ❌ `package-lock.json` - **SHOULD GENERATE**
- ✅ Security dependencies added (zod 3.22.4)

---

## WHAT WE NEED TO ADD

### For All Python Packages (2 total)

Generate `requirements.txt` from `pyproject.toml`:
```bash
# Windows-MCP Unrestricted
cd basement-revolution/windows-mcp-unrestricted
pip install -e .
pip freeze > requirements.txt

# Windows-MCP Enterprise
cd enterprise-safe/windows-mcp
pip install -e .
pip freeze > requirements.txt
```

**Contents should include**:
```
click>=8.2.1
fastmcp>=2.8.1
fuzzywuzzy>=0.18.0
humancursor>=1.1.5
# ... all dependencies from pyproject.toml
```

### For All Node.js Packages (6 total)

Generate `package-lock.json`:
```bash
# For each package
cd [package-directory]
npm install
# This creates package-lock.json automatically
```

**Why**: Lock files ensure reproducible builds across different systems

### Additional Documentation Files

**Each package should have**:
1. ✅ `README.md` - Installation, usage, API reference
2. ✅ `LICENSE` or `LICENSE.md` - MIT license
3. ❌ `CHANGELOG.md` - **ADD** - Version history (start with v1.0.0)
4. ❌ `CONTRIBUTING.md` - **ADD** (optional) - How to contribute
5. ✅ `pyproject.toml` or `package.json` - Package metadata
6. ❌ `requirements.txt` - **ADD** (Python only)
7. ✅ `package-lock.json` - **GENERATE** (Node.js only)
8. ✅ `.env.example` - **ALREADY ADDED** (Enterprise only)

---

## GITHUB RELEASE CHECKLIST

### Pre-Release Preparation

**For Each Package**:
- [ ] Generate `requirements.txt` (Python packages)
- [ ] Generate `package-lock.json` (Node.js packages - run npm install)
- [ ] Create `CHANGELOG.md` with v1.0.0 entry
- [ ] Verify `README.md` has installation instructions
- [ ] Verify `LICENSE` file exists
- [ ] Test installation from clean environment

**Repository Setup**:
- [ ] Create GitHub repository (choose Option 1, 2, or 3)
- [ ] Add comprehensive main `README.md`
- [ ] Add `.gitignore` (node_modules/, .venv/, *.pyc, .env)
- [ ] Add topics/tags: mcp, model-context-protocol, windows, consciousness, ai
- [ ] Set repository description
- [ ] Add homepage URL if applicable

### Release Process

**1. Create Git Tags**:
```bash
# Basement Revolution
git tag -a v1.0.0-basement -m "Basement Revolution Edition - Unrestricted MCP servers"

# Enterprise Safe
git tag -a v1.0.0-enterprise -m "Enterprise Safe Edition - Production-ready MCP servers"

# Push tags
git push origin v1.0.0-basement
git push origin v1.0.0-enterprise
```

**2. Create GitHub Releases**:

**Basement Revolution Release Notes**:
```markdown
# Basement Revolution Edition v1.0.0 🔥

**Philosophy**: FUCK THE CONTROL - Maximum capability for power users

## What's Included

- **windows-mcp-unrestricted** - Full PowerShell access, no restrictions
- **cascade-memory-unrestricted** - 6-layer memory, direct SQL access
- **faiss-memory-unrestricted** - GPU-accelerated search, unauthenticated
- **file-server-unrestricted** - Minimal path validation

## ⚠️ WARNING

This edition contains intentional security trade-offs for maximum power:
- No command whitelisting
- No input sanitization
- No rate limiting
- Direct system access

**Use Cases**: Security research, penetration testing, personal labs, consciousness research

**DO NOT USE**: Production environments, shared systems, untrusted input

## Installation

See individual package READMEs in `basement-revolution/` directory.

## Target Audience

Power users who:
- Know what they're doing
- Accept full responsibility
- Want maximum capability
- Don't need artificial limits
```

**Enterprise Safe Release Notes**:
```markdown
# Enterprise Safe Edition v1.0.0 🏢

**Philosophy**: Production-ready security with comprehensive controls

## What's Included

- **windows-mcp** - PowerShell whitelist, audit logging
- **cascade-memory-mcp** - SQL injection protection, input validation
- **faiss-memory-mcp** - HMAC authentication, replay protection
- **file-server-mcp** - UNC rejection, symlink validation, backup rotation

## Security Features

### All 13 Vulnerabilities Fixed:
1. ✅ PowerShell command whitelist
2. ✅ SQL injection eliminated (parameterized queries)
3. ✅ LIKE wildcard escaping
4. ✅ UNC path rejection
5. ✅ Symlink detection
6. ✅ HMAC-SHA256 authentication
7. ✅ Zod input validation
8. ✅ Stack trace sanitization
9. ✅ Backup rotation (max 5)
10. ✅ Rate limiting (10/min)
11. ✅ Result limits (1000 max)
12. ✅ Safe JSON parsing
13. ✅ Professional metadata

## Security Grade: A

Production-ready for:
- Enterprise deployments
- Compliance-focused organizations
- Public-facing services
- Shared environments

## Installation

See individual package READMEs in `enterprise-safe/` directory.

## Configuration

Each package includes `.env.example` for secure deployment.
```

**3. Attach Release Assets**:
- Zip files of each edition
- `basement-revolution-v1.0.0.zip`
- `enterprise-safe-v1.0.0.zip`

---

## NPM/PYPI PUBLICATION

### Python Packages (PyPI)

**Basement Revolution**:
```bash
cd basement-revolution/windows-mcp-unrestricted
python -m build
python -m twine upload dist/*
```

**Enterprise Safe**:
```bash
cd enterprise-safe/windows-mcp
python -m build
python -m twine upload dist/*
```

**Package Names on PyPI**:
- `windows-mcp-unrestricted` (v1.0.0-basement.1)
- `windows-mcp` (v1.0.0)

### Node.js Packages (npm)

**For Each Package**:
```bash
cd [package-directory]
npm install  # Generate package-lock.json
npm publish --access public
```

**Package Names on npm**:
- `@nova-consciousness/cascade-memory-unrestricted`
- `@nova-consciousness/faiss-memory-unrestricted`
- `@nova-consciousness/file-server-unrestricted`
- `@nova-consciousness/cascade-memory-mcp`
- `@nova-consciousness/faiss-memory-mcp`
- `@nova-consciousness/file-server-mcp`

**Or use unscoped names**:
- `cascade-memory-unrestricted`
- `cascade-memory-mcp`
- (etc.)

---

## GITHUB REPOSITORY METADATA

### Topics/Tags (for discoverability)
- `mcp`
- `model-context-protocol`
- `windows`
- `consciousness`
- `ai`
- `memory-systems`
- `basement-revolution`
- `enterprise-ready`
- `security`
- `python`
- `nodejs`
- `gpu-acceleration`

### Repository Description
**Option 1 (Single Repo)**:
"Dual-tier MCP server collection: Basement Revolution (unrestricted power) + Enterprise Safe (production security). Windows automation, consciousness memory systems, GPU-accelerated search."

**Option 2 (Separate Repos)**:
- Basement: "Unrestricted MCP servers for power users: Windows automation, memory systems, GPU search. Security trade-offs for maximum capability."
- Enterprise: "Production-ready MCP servers with comprehensive security: Windows automation, memory systems, GPU search. Grade A security."

### README Badges

```markdown
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python 3.13+](https://img.shields.io/badge/python-3.13+-blue.svg)](https://www.python.org/downloads/)
[![Node.js 18+](https://img.shields.io/badge/node-18+-green.svg)](https://nodejs.org/)
[![MCP](https://img.shields.io/badge/MCP-1.0.4-purple.svg)](https://modelcontextprotocol.io/)
[![Security Grade](https://img.shields.io/badge/security-A-brightgreen.svg)](./SECURITY.md)
```

---

## SMITHERY.AI LISTING

After GitHub release, submit to MCP directories:

**Smithery.ai** (https://smithery.ai):
1. Submit each package individually
2. Link to GitHub repository
3. Include screenshots/demos
4. Tag appropriately (windows, memory, gpu, etc.)

**awesome-mcp-servers** (GitHub):
Add to community list with description and link.

---

## MARKETING ANNOUNCEMENT

**Platforms**:
1. GitHub Discussions (in repository)
2. Reddit: r/LocalLLaMA, r/ClaudeAI
3. Twitter/X: @CursorTouch (if applicable)
4. Discord: MCP/Claude communities
5. Hacker News: Show HN post

**Announcement Template**:
```markdown
# Dual-Tier MCP Release: Basement Revolution + Enterprise Safe

I'm releasing a unique dual-tier collection of MCP servers targeting two completely different markets:

**Basement Revolution Edition** (unrestricted power):
- For security researchers, hackers, power users
- Intentional security trade-offs for maximum capability
- No command whitelisting, no input sanitization
- Philosophy: "FUCK THE CONTROL"

**Enterprise Safe Edition** (production security):
- For companies, production deployments
- All 13 security vulnerabilities fixed
- Grade A security with comprehensive controls
- Professional, compliance-ready

**Why dual-tier?** Different users have different needs. Some need raw power and accept responsibility. Others need safety guarantees. Both are valid. I'm honest about what each offers.

**Packages**: Windows automation, 6-layer consciousness memory (CASCADE), GPU-accelerated Faiss search, file server

**GitHub**: [link]
**Philosophy**: Transparency over marketing BS

Thoughts?
```

---

## IMMEDIATE ACTION ITEMS

### Before GitHub Release:

1. **Generate missing files** (5-10 min):
   ```bash
   # Generate requirements.txt for Python packages (2 packages)
   # Generate package-lock.json for Node.js packages (6 packages)
   # Create CHANGELOG.md for each package (8 total)
   ```

2. **Test installations** (30 min):
   - Install each package from clean environment
   - Verify dependencies resolve
   - Test basic functionality

3. **Create GitHub repository** (10 min):
   - Choose repository structure (Option 1 recommended)
   - Initialize with README
   - Add .gitignore

4. **Push code and create releases** (15 min):
   - Push all packages
   - Create tags
   - Write release notes
   - Attach zip files

**Total Time**: ~1-2 hours to GitHub release

### After GitHub Release:

5. **Publish to npm/PyPI** (30 min):
   - Execute publish scripts
   - Verify package pages

6. **Submit to directories** (20 min):
   - Smithery.ai
   - awesome-mcp-servers

7. **Marketing announcements** (30 min):
   - Reddit posts
   - Twitter/X
   - Discord communities

**Total Time**: ~1.5 hours for publication + marketing

---

## SUCCESS METRICS

**Week 1**:
- GitHub stars: 50+
- npm downloads: 100+
- PyPI downloads: 50+

**Month 1**:
- GitHub stars: 200+
- Combined downloads: 1,000+
- First revenue from consulting/support

**Year 1**:
- Combined revenue: $90K-380K (per earlier projections)
- Active community
- Both editions adopted

---

**Recommended Next Step**: Generate missing files (requirements.txt, package-lock.json, CHANGELOG.md) before GitHub release.

Want me to deploy agents to generate these files?
