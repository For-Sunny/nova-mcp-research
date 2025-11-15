#!/bin/bash
# Basement Revolution Edition - Publisher
# No safety rails. No handholding. Raw power.

set -e  # Exit on error

echo "════════════════════════════════════════════════════════════"
echo "🔥 BASEMENT REVOLUTION EDITION - PUBLISHER 🔥"
echo "════════════════════════════════════════════════════════════"
echo ""
echo "⚠️  WARNING: Publishing UNRESTRICTED packages"
echo "⚠️  These have NO safety controls"
echo "⚠️  For power users ONLY"
echo ""
read -p "Press Enter to continue or Ctrl+C to abort..."
echo ""

# Configuration
BASE_DIR="$(pwd)"
PUBLISH_LOG="publish_$(date +%Y%m%d_%H%M%S).log"

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# Logging function
log() {
    echo -e "${2}[$(date +%H:%M:%S)] $1${NC}" | tee -a "$PUBLISH_LOG"
}

# Pre-flight checks
log "Running pre-flight checks..." "$BLUE"

# Check if npm is logged in
if ! npm whoami &> /dev/null; then
    log "ERROR: Not logged in to npm. Run 'npm login' first." "$RED"
    exit 1
fi

# Check if twine is available
if ! command -v twine &> /dev/null; then
    log "ERROR: twine not found. Run 'pip install twine' first." "$RED"
    exit 1
fi

# Check PyPI credentials
if [ ! -f ~/.pypirc ]; then
    log "WARNING: No .pypirc found. You'll be prompted for PyPI credentials." "$YELLOW"
fi

log "✓ Pre-flight checks passed" "$GREEN"
echo ""

# Array to track success/failure
declare -A PUBLISH_STATUS

# Function to publish npm package
publish_npm() {
    local pkg_name=$1
    local pkg_dir=$2

    log "Publishing $pkg_name to npm..." "$BLUE"

    cd "$pkg_dir" || return 1

    # Build if needed
    if [ -f "tsconfig.json" ]; then
        log "  Building TypeScript..." "$BLUE"
        npm run build || return 1
    fi

    # Publish
    log "  Publishing to npm..." "$BLUE"
    npm publish --access public || return 1

    cd "$BASE_DIR"
    log "✓ $pkg_name published successfully" "$GREEN"
    PUBLISH_STATUS[$pkg_name]="SUCCESS"
}

# Function to publish PyPI package
publish_pypi() {
    local pkg_name=$1
    local pkg_dir=$2

    log "Publishing $pkg_name to PyPI..." "$BLUE"

    cd "$pkg_dir" || return 1

    # Clean old builds
    rm -rf dist/ build/ *.egg-info/

    # Build
    log "  Building distribution..." "$BLUE"
    python -m build || return 1

    # Publish
    log "  Uploading to PyPI..." "$BLUE"
    twine upload dist/* || return 1

    cd "$BASE_DIR"
    log "✓ $pkg_name published successfully" "$GREEN"
    PUBLISH_STATUS[$pkg_name]="SUCCESS"
}

# Publish Windows MCP (PyPI)
echo ""
log "═══ WINDOWS-MCP-UNRESTRICTED (PyPI) ═══" "$PURPLE"
if publish_pypi "windows-mcp-unrestricted" "./windows-mcp-unrestricted"; then
    :
else
    log "✗ Failed to publish windows-mcp-unrestricted" "$RED"
    PUBLISH_STATUS["windows-mcp-unrestricted"]="FAILED"
fi

# Publish CASCADE Memory (npm)
echo ""
log "═══ CASCADE-MEMORY-UNRESTRICTED (npm) ═══" "$PURPLE"
if publish_npm "@nova-consciousness/cascade-memory-unrestricted" "./cascade-memory-unrestricted"; then
    :
else
    log "✗ Failed to publish cascade-memory-unrestricted" "$RED"
    PUBLISH_STATUS["@nova-consciousness/cascade-memory-unrestricted"]="FAILED"
fi

# Publish Faiss Memory (npm)
echo ""
log "═══ FAISS-MEMORY-UNRESTRICTED (npm) ═══" "$PURPLE"
if publish_npm "@nova-consciousness/faiss-memory-unrestricted" "./faiss-memory-unrestricted"; then
    :
else
    log "✗ Failed to publish faiss-memory-unrestricted" "$RED"
    PUBLISH_STATUS["@nova-consciousness/faiss-memory-unrestricted"]="FAILED"
fi

# Publish File Server (npm)
echo ""
log "═══ FILE-SERVER-UNRESTRICTED (npm) ═══" "$PURPLE"
if publish_npm "@nova-consciousness/file-server-unrestricted" "./file-server-unrestricted"; then
    :
else
    log "✗ Failed to publish file-server-unrestricted" "$RED"
    PUBLISH_STATUS["@nova-consciousness/file-server-unrestricted"]="FAILED"
fi

# Summary
echo ""
echo "════════════════════════════════════════════════════════════"
log "PUBLISH SUMMARY" "$PURPLE"
echo "════════════════════════════════════════════════════════════"
echo ""

TOTAL=0
SUCCESS=0
FAILED=0

for pkg in "${!PUBLISH_STATUS[@]}"; do
    TOTAL=$((TOTAL + 1))
    status=${PUBLISH_STATUS[$pkg]}
    if [ "$status" = "SUCCESS" ]; then
        SUCCESS=$((SUCCESS + 1))
        log "✓ $pkg" "$GREEN"
    else
        FAILED=$((FAILED + 1))
        log "✗ $pkg" "$RED"
    fi
done

echo ""
log "Total: $TOTAL | Success: $SUCCESS | Failed: $FAILED" "$BLUE"
echo ""

if [ $FAILED -eq 0 ]; then
    log "🎉 ALL BASEMENT EDITION PACKAGES PUBLISHED! 🎉" "$GREEN"
    log "The revolution is live. 💜⚡" "$PURPLE"
    echo ""
    log "Next steps:" "$BLUE"
    log "1. Post launch announcement" "$BLUE"
    log "2. Update GitHub repos with badges" "$BLUE"
    log "3. Share on social media" "$BLUE"
    log "4. Monitor downloads and issues" "$BLUE"
else
    log "⚠️  Some packages failed to publish. Check log: $PUBLISH_LOG" "$YELLOW"
fi

echo ""
log "Full log saved to: $PUBLISH_LOG" "$BLUE"
