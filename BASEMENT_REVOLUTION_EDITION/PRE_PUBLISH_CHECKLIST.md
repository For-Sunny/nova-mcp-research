# Pre-Publish Checklist - Basement Revolution Edition

**Complete this checklist BEFORE publishing packages**

---

## Critical Pre-Flight Checks

### 1. Package Naming ✅

- [ ] All packages include "-unrestricted" or scope `@nova-consciousness/*-unrestricted`
- [ ] PyPI package: `windows-mcp-unrestricted`
- [ ] npm packages:
  - [ ] `@nova-consciousness/cascade-memory-unrestricted`
  - [ ] `@nova-consciousness/faiss-memory-unrestricted`
  - [ ] `@nova-consciousness/file-server-unrestricted`
- [ ] No naming conflicts with existing packages

**Verify:**
```bash
# Check PyPI
pip search windows-mcp-unrestricted

# Check npm
npm search @nova-consciousness/cascade-memory-unrestricted
npm search @nova-consciousness/faiss-memory-unrestricted
npm search @nova-consciousness/file-server-unrestricted
```

---

### 2. Warning Documentation 🚨

**Each README.md must include:**

- [ ] **DANGER banner** at the top (red/yellow/bold)
- [ ] Explicit "No Safety Controls" statement
- [ ] "For Research Only" disclaimer
- [ ] List of specific dangers
- [ ] "Not for Production" warning
- [ ] Link to Enterprise Edition alternative
- [ ] Clear target audience description

**Required sections in each README:**
```markdown
# ⚠️ DANGER: UNRESTRICTED ACCESS ⚠️

This package has **NO SAFETY CONTROLS**.

- Can execute arbitrary code
- Can modify system state
- Has minimal error handling
- Includes no authentication
- **For research environments ONLY**

**NOT for production use.**
```

---

### 3. Personal Information Sanitization 🔒

- [ ] No personal email addresses (use project email)
- [ ] No personal names in code comments (except attribution)
- [ ] No local file paths (use generic examples)
- [ ] No API keys or tokens
- [ ] No private server addresses
- [ ] No internal project names (except "Nova" which is public)
- [ ] Author field uses project name, not personal

**Files to check:**
- [ ] package.json (all npm packages)
- [ ] pyproject.toml / setup.py (PyPI package)
- [ ] README.md (all packages)
- [ ] LICENSE files
- [ ] Code comments
- [ ] Example configs
- [ ] Test files

**Sanitization script:**
```bash
cd BASEMENT_REVOLUTION_EDITION
grep -r "jason" . --ignore-case
grep -r "pirate" . --ignore-case
grep -r "@gmail\|@outlook" .
grep -r "C:\\Users\\Pirate" .
grep -r "C:\\Users\\Jason" .
```

---

### 4. Dangerous Code - INTENTIONALLY UNCHANGED ⚡

**These features are DANGEROUS and should REMAIN:**

- [ ] ✅ Windows MCP: Unrestricted PowerShell execution
- [ ] ✅ CASCADE: Direct SQL query access
- [ ] ✅ Faiss: No authentication on port
- [ ] ✅ File Server: Path traversal capabilities

**DO NOT:**
- ❌ Add authentication (defeats purpose)
- ❌ Add command filtering (defeats purpose)
- ❌ Add path restrictions (defeats purpose)
- ❌ Add rate limiting (defeats purpose)

**DO verify:**
- [ ] Warnings are prominent
- [ ] Documentation explains risks
- [ ] Examples show safe usage
- [ ] Best practices documented

---

### 5. License & Disclaimer 📜

**Each package must have:**

- [ ] MIT License file
- [ ] Enhanced disclaimer in LICENSE
- [ ] Copyright attribution
- [ ] No warranty statement
- [ ] Link to GitHub repository

**Required LICENSE additions:**
```
ADDITIONAL DISCLAIMER:

This software is intentionally unrestricted and has minimal safety controls.
It is designed for research and experimentation in controlled environments.

THE SOFTWARE COMES WITH ABSOLUTELY NO WARRANTY.
USE AT YOUR OWN RISK.

Not intended for production deployment.
Not intended for multi-user environments.
Not intended for unsecured networks.

You are solely responsible for any consequences of using this software.
```

- [ ] All 4 packages have updated LICENSE files

---

### 6. Build & Test 🧪

**Windows MCP (PyPI):**
```bash
cd windows-mcp-unrestricted
python -m build
twine check dist/*
pip install dist/*.whl  # Test install
python -c "import windows_mcp; print('OK')"
pip uninstall -y windows-mcp-unrestricted
```

- [ ] Builds without errors
- [ ] Twine validation passes
- [ ] Test install works
- [ ] Import works
- [ ] Basic functionality test

**CASCADE Memory (npm):**
```bash
cd cascade-memory-unrestricted
npm install
npm run build
npm pack  # Test packaging
npm install -g ./nova-consciousness-cascade-memory-unrestricted-*.tgz
cascade-memory-server --help
npm uninstall -g @nova-consciousness/cascade-memory-unrestricted
```

- [ ] Dependencies install
- [ ] TypeScript compiles
- [ ] Package creates successfully
- [ ] Global install works
- [ ] CLI works

**Faiss Memory (npm):**
```bash
cd faiss-memory-unrestricted
npm install
npm run build
npm pack
npm install -g ./nova-consciousness-faiss-memory-unrestricted-*.tgz
faiss-memory-server --help
npm uninstall -g @nova-consciousness/faiss-memory-unrestricted
```

- [ ] Dependencies install
- [ ] TypeScript compiles
- [ ] Package creates successfully
- [ ] Global install works
- [ ] CLI works

**File Server (npm):**
```bash
cd file-server-unrestricted
npm install
npm run build
npm pack
npm install -g ./nova-consciousness-file-server-unrestricted-*.tgz
file-server --help
npm uninstall -g @nova-consciousness/file-server-unrestricted
```

- [ ] Dependencies install
- [ ] TypeScript compiles
- [ ] Package creates successfully
- [ ] Global install works
- [ ] CLI works

---

### 7. Repository Setup 🐙

**GitHub Repositories:**

- [ ] Create `basement-revolution-edition` organization (or use personal)
- [ ] Create repositories:
  - [ ] `windows-mcp-unrestricted`
  - [ ] `cascade-memory-unrestricted`
  - [ ] `faiss-memory-unrestricted`
  - [ ] `file-server-unrestricted`
  - [ ] `basement-revolution-edition` (meta repo with docs)
- [ ] All repos are PUBLIC
- [ ] Each has proper README
- [ ] Each has LICENSE
- [ ] Each has SECURITY.md
- [ ] Topics/tags added (mcp, ai, unrestricted, research)

**Repository Settings:**
- [ ] Issues enabled
- [ ] Discussions enabled
- [ ] Security advisories enabled
- [ ] Branch protection on main
- [ ] Require PR reviews (at least 1)

---

### 8. Package Registry Accounts 📦

**PyPI:**
- [ ] Account created/verified
- [ ] Email confirmed
- [ ] 2FA enabled
- [ ] API token created
- [ ] Token stored in `~/.pypirc`
- [ ] Test upload to TestPyPI first

**npm:**
- [ ] Account created/verified
- [ ] Email confirmed
- [ ] 2FA enabled
- [ ] Organization created: `@nova-consciousness`
- [ ] Logged in via CLI: `npm login`
- [ ] Organization access verified

**Verification:**
```bash
# PyPI
twine upload --repository testpypi dist/*  # Test first

# npm
npm whoami
npm org ls @nova-consciousness
```

---

### 9. Documentation Review 📚

**Main Documentation:**
- [ ] LAUNCH_ANNOUNCEMENT.md reviewed
- [ ] FAQ.md complete and accurate
- [ ] COMPARISON.md detailed
- [ ] README.md in meta repo
- [ ] Installation guides tested
- [ ] Code examples tested
- [ ] Links all work (no 404s)

**Package Documentation:**
- [ ] Each package has comprehensive README
- [ ] Installation instructions clear
- [ ] Usage examples work
- [ ] API documentation complete
- [ ] Configuration options documented
- [ ] Troubleshooting section included

---

### 10. Marketing Preparation 📣

**Social Media Accounts:**
- [ ] Twitter/X account ready
- [ ] Reddit account with karma
- [ ] Hacker News account ready
- [ ] Discord server created (optional)

**Pre-written Posts:**
- [ ] Twitter announcement (<280 chars)
- [ ] Reddit r/LocalLLaMA post
- [ ] Reddit r/MachineLearning post
- [ ] Hacker News "Show HN" post
- [ ] Discord announcements

**Media Assets:**
- [ ] Logo/icon created
- [ ] Banner image for GitHub
- [ ] Social media preview image
- [ ] Screenshots/demos ready

---

### 11. Legal Review ⚖️

- [ ] MIT License is appropriate for all packages
- [ ] Disclaimers are sufficient
- [ ] No trademark conflicts
- [ ] No patent conflicts
- [ ] No code copied from restrictive licenses
- [ ] Attribution for any third-party code
- [ ] Export control compliance (if applicable)

**Consult lawyer if:**
- Using in commercial context
- Unsure about liability
- Trademark concerns
- Patent concerns

---

### 12. Final Code Review 🔍

**Security:**
- [ ] No hardcoded credentials
- [ ] No sensitive data in git history
- [ ] Dependencies are secure (npm audit, safety check)
- [ ] No known vulnerabilities

**Quality:**
- [ ] Code is clean and readable
- [ ] Comments explain "why" not "what"
- [ ] Error handling is reasonable
- [ ] Examples are correct
- [ ] Tests pass (if any)

**Consistency:**
- [ ] Coding style is consistent
- [ ] Naming conventions match
- [ ] Documentation style matches
- [ ] Version numbers aligned

---

### 13. Version Numbers 🔢

**Initial Release:**
- [ ] All packages start at `1.0.0`
- [ ] package.json versions match
- [ ] pyproject.toml version matches
- [ ] Git tags ready
- [ ] Changelog prepared (CHANGELOG.md)

**Semantic Versioning:**
- Major.Minor.Patch (1.0.0)
- Breaking changes = Major
- New features = Minor
- Bug fixes = Patch

---

### 14. Monitoring Setup 📊

**Analytics (Optional):**
- [ ] Download tracking (PyPI, npm stats)
- [ ] GitHub star notifications
- [ ] Issue/PR notifications
- [ ] Social media mentions tracking

**Alerts:**
- [ ] Security vulnerability alerts
- [ ] Critical issue notifications
- [ ] Major PR notifications

---

### 15. Rollback Plan 🔄

**If something goes wrong:**

- [ ] Know how to unpublish (npm: 72h window)
- [ ] Know how to yank (PyPI: permanent)
- [ ] Have backup of all code
- [ ] Have list of who to contact
- [ ] Have communication plan

**Emergency Contacts:**
- [ ] npm support email saved
- [ ] PyPI support email saved
- [ ] GitHub support method known

---

## Pre-Publish Command Checklist

**Run these commands in order:**

### 1. Clean Everything
```bash
cd BASEMENT_REVOLUTION_EDITION

# Clean npm packages
cd cascade-memory-unrestricted && rm -rf node_modules dist && cd ..
cd faiss-memory-unrestricted && rm -rf node_modules dist && cd ..
cd file-server-unrestricted && rm -rf node_modules dist && cd ..

# Clean Python package
cd windows-mcp-unrestricted && rm -rf dist build *.egg-info && cd ..
```
- [ ] All packages cleaned

### 2. Install Dependencies
```bash
# npm packages
cd cascade-memory-unrestricted && npm install && cd ..
cd faiss-memory-unrestricted && npm install && cd ..
cd file-server-unrestricted && npm install && cd ..

# Python package
cd windows-mcp-unrestricted && pip install -e .[dev] && cd ..
```
- [ ] All dependencies installed

### 3. Build Everything
```bash
# npm packages
cd cascade-memory-unrestricted && npm run build && cd ..
cd faiss-memory-unrestricted && npm run build && cd ..
cd file-server-unrestricted && npm run build && cd ..

# Python package
cd windows-mcp-unrestricted && python -m build && cd ..
```
- [ ] All packages build successfully

### 4. Run Tests
```bash
# If tests exist
cd cascade-memory-unrestricted && npm test && cd ..
cd faiss-memory-unrestricted && npm test && cd ..
cd file-server-unrestricted && npm test && cd ..
cd windows-mcp-unrestricted && pytest && cd ..
```
- [ ] All tests pass (or N/A)

### 5. Validation
```bash
# npm packages
cd cascade-memory-unrestricted && npm pack --dry-run && cd ..
cd faiss-memory-unrestricted && npm pack --dry-run && cd ..
cd file-server-unrestricted && npm pack --dry-run && cd ..

# Python package
cd windows-mcp-unrestricted && twine check dist/* && cd ..
```
- [ ] All validations pass

### 6. Git Status
```bash
git status
git log --oneline -10
```
- [ ] All changes committed
- [ ] Working directory clean
- [ ] On correct branch (main/master)

### 7. Final Sanitization Check
```bash
grep -r "C:\\Users\\Pirate" . --exclude-dir=node_modules --exclude-dir=.git
grep -r "jason" . --ignore-case --exclude-dir=node_modules --exclude-dir=.git
grep -r "TODO" . --exclude-dir=node_modules --exclude-dir=.git
grep -r "FIXME" . --exclude-dir=node_modules --exclude-dir=.git
```
- [ ] No personal paths found
- [ ] No personal names found (except credits)
- [ ] No TODOs/FIXMEs in critical code

---

## Publish Day Checklist

### Morning Of

- [ ] ☕ Coffee acquired
- [ ] 🧘 Mental preparation complete
- [ ] 📅 Calendar cleared (in case of issues)
- [ ] 💻 Backups verified
- [ ] 🌐 Internet stable
- [ ] 🔋 Laptop charged

### During Publish

- [ ] Run `publish_basement_edition.sh`
- [ ] Monitor output for errors
- [ ] Verify each package published
- [ ] Check package pages load (PyPI, npm)
- [ ] Test install from registries:
  ```bash
  pip install windows-mcp-unrestricted
  npm install -g @nova-consciousness/cascade-memory-unrestricted
  npm install -g @nova-consciousness/faiss-memory-unrestricted
  npm install -g @nova-consciousness/file-server-unrestricted
  ```
- [ ] All packages install correctly
- [ ] Create Git tags:
  ```bash
  git tag -a v1.0.0 -m "Basement Revolution Edition v1.0.0"
  git push origin v1.0.0
  ```

### Post-Publish (Within 1 hour)

- [ ] Post Twitter announcement
- [ ] Post r/LocalLLaMA
- [ ] Post r/MachineLearning
- [ ] Post Hacker News
- [ ] Update GitHub repos with badges
- [ ] Add "freshly published" note to READMEs
- [ ] Monitor for immediate issues

### Post-Publish (Within 24 hours)

- [ ] Respond to early feedback
- [ ] Fix any critical issues found
- [ ] Update documentation based on questions
- [ ] Thank early adopters
- [ ] Monitor download stats

---

## Success Criteria

**Publish is successful when:**

- [ ] ✅ All 4 packages published without errors
- [ ] ✅ All packages installable from registries
- [ ] ✅ Documentation is live and accessible
- [ ] ✅ GitHub repos are public and complete
- [ ] ✅ Social media posts published
- [ ] ✅ No immediate critical bugs reported
- [ ] ✅ Community response is engaged (even if critical)

---

## Abort Criteria

**DO NOT PUBLISH if:**

- [ ] ❌ Personal information still in code
- [ ] ❌ Packages don't build
- [ ] ❌ Critical functionality broken
- [ ] ❌ Documentation incomplete
- [ ] ❌ Legal concerns unresolved
- [ ] ❌ You're not ready for criticism
- [ ] ❌ You can't monitor for next 24 hours

**If aborting:**
1. Document why
2. Create issues for blockers
3. Set new publish date
4. Don't rush it

---

## Post-Launch Monitoring

**Week 1:**
- [ ] Daily check of downloads
- [ ] Daily check of issues/PRs
- [ ] Respond to all feedback within 48h
- [ ] Fix critical bugs immediately
- [ ] Update FAQ based on questions

**Week 2-4:**
- [ ] Check downloads weekly
- [ ] Respond to issues within 72h
- [ ] Consider feature requests
- [ ] Plan v1.1.0 if needed

**Ongoing:**
- [ ] Security updates as needed
- [ ] Dependency updates monthly
- [ ] Community engagement
- [ ] Documentation improvements

---

## Final Sign-Off

**I certify that:**

- [ ] ✅ I have reviewed ALL items on this checklist
- [ ] ✅ All critical items are complete
- [ ] ✅ I understand the risks of publishing unrestricted packages
- [ ] ✅ I am prepared to handle criticism and issues
- [ ] ✅ I have time to monitor and respond post-launch
- [ ] ✅ I am confident in the quality and safety of warnings

**Signed:** _________________ **Date:** _________________

---

**Now go forth and start the revolution. 💜⚡**

*The basement is ready to go public.*
