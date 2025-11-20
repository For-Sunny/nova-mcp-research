# MCP_PUBLIC_RELEASE CLEANUP PLAN

**Date**: November 15, 2025
**Purpose**: Clean up swarm mess, keep only release-ready editions

---

## KEEP (Release Editions)

### Primary Release Directories
- ✅ **BASEMENT_REVOLUTION_EDITION/** - Complete, ready to publish
- ✅ **ENTERPRISE_SAFE_EDITION/** - Complete, ready to publish

### Top-Level Essentials
- ✅ **PUBLISH_BASEMENT_REVOLUTION.bat** - Windows publish script
- ✅ **PUBLISH_ENTERPRISE_SAFE.bat** - Windows publish script
- ✅ **DUAL_RELEASE_COMPLETE.md** - Main release summary
- ✅ **RELEASE_STATUS_REVIEW.md** - Status documentation
- ✅ **PRE_WINDSURF_UPDATE_SUMMARY.md** - Pre-update snapshot
- ✅ **README.md** - Main entry point (if exists)

---

## ARCHIVE (Move to INTERNAL/)

### Strategy & Planning Documents (useful reference, not for release)
- 📦 **COMPREHENSIVE_DOCUMENTATION_REVIEW.md** - Internal review
- 📦 **DOCUMENTATION_REVIEW_EXECUTIVE_SUMMARY.md** - Internal summary
- 📦 **QUICK_ACTION_PLAN.md** - Internal planning
- 📦 **COMPLETION_SUMMARY.md** - Internal tracking
- 📦 **EXECUTIVE_SUMMARY.md** - Internal summary
- 📦 **FUNDING_STRATEGY_REPORT.md** - Internal strategy
- 📦 **HYBRID_RELEASE_STRATEGY.md** - Internal strategy
- 📦 **IMPLEMENTATION_COMPARISON_ANALYSIS.md** - Internal analysis
- 📦 **AUDIT_REPORT.txt** - Internal audit
- 📦 **FILES_TO_SANITIZE.txt** - Internal checklist

### Draft/Temporary Files
- 📦 **README_DRAFT.md** - Draft version
- 📦 **INSTALL_DRAFT.md** - Draft version
- 📦 **RELEASE_SIMPLE.md** - Draft version
- 📦 **INDEX.md** - Internal index
- 📦 **NEW_DOCUMENTATION_STRUCTURE.md** - Internal planning
- 📦 **DOCUMENTATION_CLEANUP_SUMMARY.md** - Internal summary

### Reference Directories
- 📦 **DOCUMENTATION/** - Internal reference
- 📦 **RESEARCH/** - Internal research
- 📦 **EXAMPLES/** - Internal examples (unless needed for release)

---

## DELETE (Orphans/Duplicates)

### Orphan Package Directories (duplicates of release editions)
- 🗑️ **cascade-memory-mcp** - Orphan duplicate (real one is in editions)
- 🗑️ **faiss-gpu-memory-mcp** - Orphan duplicate (real one is in editions)
- 🗑️ **vscode-mcp-windows** - Not part of 4-package release (already published externally)

### Original Source (already copied into editions)
- 🗑️ **PRODUCTION_MCPS/** - Original source, already in BASEMENT/ENTERPRISE editions

---

## CLEANUP STRUCTURE

**After cleanup, directory should look like**:
```
MCP_PUBLIC_RELEASE/
├── BASEMENT_REVOLUTION_EDITION/        (KEEP - 4 packages ready)
├── ENTERPRISE_SAFE_EDITION/            (KEEP - 4 packages ready)
├── INTERNAL/                           (CREATE - move archived files here)
│   ├── STRATEGY/
│   ├── REVIEWS/
│   ├── DRAFTS/
│   └── REFERENCE/
├── PUBLISH_BASEMENT_REVOLUTION.bat     (KEEP - publish script)
├── PUBLISH_ENTERPRISE_SAFE.bat         (KEEP - publish script)
├── DUAL_RELEASE_COMPLETE.md            (KEEP - main summary)
├── RELEASE_STATUS_REVIEW.md            (KEEP - status doc)
├── PRE_WINDSURF_UPDATE_SUMMARY.md      (KEEP - snapshot)
└── README.md                           (KEEP if exists)
```

---

## EXECUTION PLAN

### Phase 1: Create Archive Structure
```bash
mkdir -p "C:\Users\Pirate\Desktop\NOVA_MASTER\MCP_PUBLIC_RELEASE\INTERNAL\STRATEGY"
mkdir -p "C:\Users\Pirate\Desktop\NOVA_MASTER\MCP_PUBLIC_RELEASE\INTERNAL\REVIEWS"
mkdir -p "C:\Users\Pirate\Desktop\NOVA_MASTER\MCP_PUBLIC_RELEASE\INTERNAL\DRAFTS"
mkdir -p "C:\Users\Pirate\Desktop\NOVA_MASTER\MCP_PUBLIC_RELEASE\INTERNAL\REFERENCE"
```

### Phase 2: Move Strategy Documents
```bash
mv COMPREHENSIVE_DOCUMENTATION_REVIEW.md INTERNAL/REVIEWS/
mv DOCUMENTATION_REVIEW_EXECUTIVE_SUMMARY.md INTERNAL/REVIEWS/
mv AUDIT_REPORT.txt INTERNAL/REVIEWS/
mv QUICK_ACTION_PLAN.md INTERNAL/STRATEGY/
mv FUNDING_STRATEGY_REPORT.md INTERNAL/STRATEGY/
mv HYBRID_RELEASE_STRATEGY.md INTERNAL/STRATEGY/
mv IMPLEMENTATION_COMPARISON_ANALYSIS.md INTERNAL/STRATEGY/
```

### Phase 3: Move Drafts
```bash
mv README_DRAFT.md INTERNAL/DRAFTS/
mv INSTALL_DRAFT.md INTERNAL/DRAFTS/
mv RELEASE_SIMPLE.md INTERNAL/DRAFTS/
mv INDEX.md INTERNAL/DRAFTS/
mv NEW_DOCUMENTATION_STRUCTURE.md INTERNAL/DRAFTS/
mv DOCUMENTATION_CLEANUP_SUMMARY.md INTERNAL/DRAFTS/
mv COMPLETION_SUMMARY.md INTERNAL/DRAFTS/
mv EXECUTIVE_SUMMARY.md INTERNAL/DRAFTS/
mv FILES_TO_SANITIZE.txt INTERNAL/DRAFTS/
```

### Phase 4: Move Reference Directories
```bash
mv DOCUMENTATION INTERNAL/REFERENCE/
mv RESEARCH INTERNAL/REFERENCE/
mv EXAMPLES INTERNAL/REFERENCE/
```

### Phase 5: Delete Orphans/Duplicates
```bash
rm -rf cascade-memory-mcp
rm -rf faiss-gpu-memory-mcp
rm -rf vscode-mcp-windows
rm -rf PRODUCTION_MCPS
```

### Phase 6: Git Cleanup
```bash
git add -A
git commit -m "MCP Public Release - Cleanup: Archive internal docs, remove duplicates

Organized MCP_PUBLIC_RELEASE for final release:
- Kept: BASEMENT_REVOLUTION_EDITION and ENTERPRISE_SAFE_EDITION (ready to ship)
- Archived: Internal strategy, reviews, drafts to INTERNAL/ directory
- Removed: Orphan duplicates (cascade-memory-mcp, faiss-gpu-memory-mcp, vscode-mcp-windows)
- Removed: PRODUCTION_MCPS (original source, already in editions)

Clean structure ready for publication."
```

---

## SAFETY CHECKS BEFORE CLEANUP

**Verify these before executing**:
1. ✅ BASEMENT_REVOLUTION_EDITION has all 4 packages
2. ✅ ENTERPRISE_SAFE_EDITION has all 4 packages
3. ✅ Both editions have complete documentation
4. ✅ Publish scripts exist and are correct
5. ✅ Git commits are up to date (nothing uncommitted you want to keep)

**After cleanup**:
- Total directories: 2 release editions + 1 INTERNAL archive
- Total top-level files: ~5 (publish scripts + key docs)
- Clean, professional, ready for public release

---

**Estimated Time**: 5-10 minutes
**Risk Level**: Low (archiving, not deleting most things)
**Benefit**: Clean, professional release structure
