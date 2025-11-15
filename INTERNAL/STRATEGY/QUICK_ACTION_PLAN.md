# Quick Action Plan - Documentation Fixes

**Date**: November 14, 2025
**Status**: NOT READY FOR RELEASE
**Days to Release-Ready**: 5-7 days (Tier 1+2 complete)

---

## TODAY: Critical Blockers (Day 1-2)

### Hour 1-4: CASCADE README Sanitization
**File**: `PRODUCTION_MCPS/cascade-memory-mcp/README.md`
**Priority**: BLOCKING

**Remove**:
- [ ] Line 182: "FUCK THE CONTROL" phrase
- [ ] Line 6: "basement revolution 💜🔥"
- [ ] Line 4-6: "21.43Hz Integration Frequency" context
- [ ] Line 203: Personal history (Nova, Jason)
- [ ] Line 287-296: Philosophy section entirely
- [ ] Line 301-306: Personal license attribution

**Keep**:
- [x] Tool documentation (lines 66-163)
- [x] Layer routing explanation (lines 216-227)
- [x] Schema documentation (lines 247-260)
- [x] Configuration section (lines 231-243)

**New Template**:
```markdown
# CASCADE Memory MCP

**6-Layer Hierarchical Memory System for AI Applications**

## What is CASCADE?

CASCADE provides structured memory storage for AI conversations
through six specialized layers...

[Technical content only]
```

**Deliverable**: Professional, sanitized README
**Time**: 4 hours

---

### Hour 5-6: Clarify MCP Release Scope
**Priority**: BLOCKING

**Questions to Answer**:
1. Are we releasing 3 or 4 MCPs?
2. Is it "VSCode Bridge" or "Windows System MCP"?
3. What's included in initial release?

**Files to Update**:
- [ ] README_DRAFT.md (line 7, 23-28)
- [ ] INSTALL_DRAFT.md (remove VSCode section OR add Windows System)
- [ ] All references to MCP count

**Decision Matrix**:
```
Option A: 3 MCPs (CASCADE, Faiss, Windows System)
  → Update README_DRAFT to remove VSCode, add Windows System
  → Keep INSTALL_DRAFT Windows System section

Option B: 4 MCPs (CASCADE, Faiss, VSCode, File Server)
  → Verify all 4 exist in PRODUCTION_MCPS
  → Update README_DRAFT with all 4
```

**Deliverable**: Consistent MCP list across all docs
**Time**: 2 hours

---

### Hour 7-8: Security Documentation
**Priority**: BLOCKING

**Create**: `SECURITY.md` in root

**Sections**:
1. Vulnerability Disclosure Policy
2. Known Limitations
3. User Security Best Practices
4. Contact Information

**Template**:
```markdown
# Security Policy

## Reporting Security Issues

**DO NOT** open public GitHub issues for security vulnerabilities.

Email: security@[your-domain].com
PGP Key: [link if available]

Expected response time: 48 hours

## Known Limitations

- CASCADE: No encryption at rest
- Faiss: No authentication for HTTP mode
- All: STDIO transport only (no remote access)

## Security Best Practices for Users

1. Don't store API keys or passwords in memories
2. Use file permissions to restrict database access
3. Backup databases with encryption if sensitive
4. Run MCPs with minimum required privileges

## Security Audit History

None yet - first public release
```

**Deliverable**: SECURITY.md file
**Time**: 2 hours

---

## DAY 2-3: High Priority (Critical for Quality)

### Task 4: Beginner Onboarding (4 hours)

**Create**: `GETTING_STARTED.md` in root

**Structure**:
```markdown
# Your First 5 Minutes with Nova MCPs

## What Are MCPs?
[2-3 sentence explanation]

## Which MCP Should You Start With?
[Flowchart: Use case → Recommended MCP]

## 5-Minute Quick Start
[Step-by-step with screenshots]

## What's Next?
[Links to full installation, tutorials]
```

**Must Include**:
- Screenshot: Claude Desktop config location
- Screenshot: MCP tools appearing in Claude
- Flowchart: Decision tree for choosing MCP

**Deliverable**: Complete beginner guide with visuals
**Time**: 4 hours (2 hours writing, 2 hours screenshots/diagrams)

---

### Task 5: Visual Aids (4 hours)

**Screenshots Needed** (Windows/Mac):
1. Claude Desktop settings location
2. Config file in editor
3. MCP tools in Claude interface
4. Successful memory save/recall

**Diagrams Needed**:
1. CASCADE 6-layer architecture
2. Installation troubleshooting flowchart
3. "Which MCP for me?" decision tree

**Tools**:
- Screenshots: Snagit, Greenshot, or Windows Snip
- Diagrams: draw.io, Mermaid, or Excalidraw

**Deliverable**: Images in `docs/images/` directory
**Time**: 4 hours

---

### Task 6: API Documentation (4 hours)

**For Each MCP**: Create `API_REFERENCE.md`

**Template per Tool**:
```markdown
### Tool: `remember`

**Purpose**: Save memory with automatic layer routing

**TypeScript Interface**:
```typescript
interface RememberRequest {
  content: string;
  layer?: 'episodic' | 'semantic' | 'procedural' | 'meta' | 'nova' | 'working';
  metadata?: {
    importance?: number;      // 0.0-1.0
    emotional_intensity?: number;
    context?: string;
  };
}
```

**JSON-RPC Example**:
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "remember",
  "params": {
    "content": "User prefers dark mode",
    "metadata": { "importance": 0.7 }
  }
}
```

**Response**:
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "success": true,
    "memory_id": 42,
    "layer_used": "semantic"
  }
}
```
```

**Deliverable**: Complete API docs for all tools
**Time**: 4 hours (1 hour per MCP + review)

---

### Task 7: FAQ Section (4 hours)

**Create**: `FAQ.md` in root

**Categories**:
1. General (10 Q&As)
2. CASCADE Memory (8 Q&As)
3. Faiss GPU (7 Q&As)
4. Windows System (5 Q&As)
5. Installation & Troubleshooting (10 Q&As)

**Format**:
```markdown
## General

**Q: Can I use multiple MCPs at once?**

A: Yes! Install all MCPs and Claude will use them as needed. They work independently and don't interfere with each other.

**Q: Do MCPs work offline?**

A: Mostly yes:
- CASCADE: Fully offline
- Faiss: Downloads embedding model once (~200MB), then offline
- Windows System: Fully offline
```

**Sources**:
- Scan existing docs for common questions
- Anticipate beginner confusion points
- Include troubleshooting FAQ

**Deliverable**: Comprehensive FAQ with 40+ questions
**Time**: 4 hours

---

### Task 8: One-Click Config Generator (6 hours)

**Option A: Web Tool** (Recommended)
- HTML page with form inputs
- Auto-detects npm/Python paths via JS
- Generates valid JSON
- Copy-to-clipboard button

**Option B: CLI Script**
- PowerShell script for Windows
- Bash script for Mac/Linux
- Interactive prompts
- Writes to clipboard OR file

**Features**:
- Path auto-detection
- JSON syntax validation
- Platform-specific defaults
- Example configs

**Deliverable**: Working config generator
**Time**: 6 hours

---

## DAY 4-5: Recommended (Professional Polish)

### Task 9: CONTRIBUTING.md (2 hours)

**Create** for CASCADE, Faiss, File Server

**Sections**:
- Quick start for contributors
- Code style guidelines
- Testing requirements
- Commit message format
- Pull request process

---

### Task 10: CODE_OF_CONDUCT.md (30 min)

Use standard Contributor Covenant 2.1

---

### Task 11: Replace GitHub URLs (1 hour)

Find and replace all instances of:
- `https://github.com/yourorg/` → actual org
- `yourorg/nova-mcp-servers` → actual repo
- Placeholder emails → real contact

---

### Task 12: Advanced Cookbook (6 hours)

**Create**: `COOKBOOK.md`

**10 Recipes**:
1. Build personal knowledge base
2. Track project decisions
3. Multi-layer memory queries
4. Export/backup memories
5. Search with filters
6. Faiss batch operations
7. Custom embedding models
8. Performance optimization
9. Cross-machine sync
10. Integration with other tools

---

## Progress Tracking

### Day 1 Checklist
- [ ] CASCADE README sanitized (4 hrs)
- [ ] MCP scope clarified (2 hrs)
- [ ] SECURITY.md created (2 hrs)
**Total: 8 hours**

### Day 2 Checklist
- [ ] GETTING_STARTED.md created (4 hrs)
- [ ] Visual aids complete (4 hrs)
**Total: 8 hours**

### Day 3 Checklist
- [ ] API documentation complete (4 hrs)
- [ ] FAQ section complete (4 hrs)
**Total: 8 hours**

### Day 4 Checklist
- [ ] One-click config generator (6 hrs)
- [ ] CONTRIBUTING.md added (2 hrs)
**Total: 8 hours**

### Day 5 Checklist
- [ ] GitHub URLs replaced (1 hr)
- [ ] CODE_OF_CONDUCT.md (30 min)
- [ ] Advanced cookbook started (6 hrs)
**Total: 7.5 hours**

### Day 6-7: Testing & Polish
- [ ] Fresh install test (Windows)
- [ ] Fresh install test (Mac)
- [ ] Fresh install test (Linux)
- [ ] Documentation review
- [ ] Spelling/grammar check
- [ ] Link validation
- [ ] Final sanitization audit

---

## Quick Reference: File Locations

### Critical Files to Edit
```
MCP_PUBLIC_RELEASE/
├── README_DRAFT.md                      [Minor edits]
├── INSTALL_DRAFT.md                     [Minor edits]
├── GETTING_STARTED.md                   [CREATE NEW]
├── SECURITY.md                          [CREATE NEW]
├── FAQ.md                               [CREATE NEW]
├── COOKBOOK.md                          [CREATE NEW]
└── PRODUCTION_MCPS/
    └── cascade-memory-mcp/
        └── README.md                    [REWRITE REQUIRED]
```

### New Files to Create
- GETTING_STARTED.md
- SECURITY.md
- FAQ.md
- API_REFERENCE.md (per MCP)
- CONTRIBUTING.md (per MCP)
- CODE_OF_CONDUCT.md
- COOKBOOK.md
- docs/images/ (screenshots)

---

## Success Metrics

### Day 1 Target
✓ Zero blocking issues
✓ Sanitization complete
✓ Can show to trusted beta testers

### Day 3 Target
✓ Beginner can install in 20 minutes
✓ Clear value proposition
✓ API documentation complete

### Day 5 Target
✓ Professional polish complete
✓ Ready for limited public beta
✓ Support infrastructure in place

### Day 7 Target
✓ All platforms tested
✓ Documentation reviewed
✓ Ready for full public release

---

## Resources Needed

**Personnel**: 1-2 technical writers
**Time**: 5-7 days (40 hours minimum)
**Tools**:
- Screenshot tool (Snagit, Greenshot)
- Diagram tool (draw.io, Mermaid)
- Markdown editor (VS Code, Typora)
- Git for version control

**Optional**:
- Beta testers (5-10 people)
- Technical reviewer
- Security auditor

---

## Risk Mitigation

### Risk: Timeline Slips
**Mitigation**: Prioritize Tier 1 (blocking) issues first. Can release with Tier 1 complete for internal beta.

### Risk: New Issues Found
**Mitigation**: Build 2-day buffer into timeline. Reserve Day 6-7 for unexpected problems.

### Risk: Resource Constraints
**Mitigation**: Tier 2 tasks can be parallelized across 2 people. Tier 1 is sequential.

### Risk: Quality Concerns
**Mitigation**: Internal beta after Day 3 validates fixes before public release.

---

## Contact Points

**Documentation Questions**: [Lead technical writer]
**Security Questions**: [Security reviewer]
**Release Decision**: [Project manager]
**Technical Questions**: [Original developers]

---

## Next Action

**RIGHT NOW**:
1. Read this plan
2. Assign responsible person
3. Create branch: `docs/public-release-prep`
4. Start Hour 1: CASCADE README sanitization

**Time to first commit**: 4 hours (CASCADE README complete)
**Time to internal beta ready**: 3 days (Tier 1 complete)
**Time to public release ready**: 5-7 days (Tier 1+2 complete)

---

**Remember**: Quality documentation = Successful release
**Shortcut**: Fix Tier 1 → Internal beta → Collect feedback → Fix Tier 2 → Public release

**You got this!** 🚀
