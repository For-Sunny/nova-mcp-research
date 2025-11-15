@echo off
REM ================================================================
REM ENTERPRISE SAFE EDITION - PUBLISH SCRIPT
REM ================================================================
REM Production-ready versions with comprehensive security controls
REM ================================================================

echo.
echo ═══════════════════════════════════════════════════════════
echo   ENTERPRISE SAFE EDITION - PUBLISH SCRIPT
echo ═══════════════════════════════════════════════════════════
echo.
echo   Publishing production-ready versions with security fixes:
echo     - windows-mcp
echo     - cascade-memory-mcp
echo     - faiss-memory-mcp
echo     - file-server-mcp
echo.
echo ═══════════════════════════════════════════════════════════
echo.

set /p CONFIRM="Type 'PUBLISH' to confirm: "
if not "%CONFIRM%"=="PUBLISH" (
    echo.
    echo ❌ Publish cancelled.
    pause
    exit /b 1
)

echo.
echo ✅ Confirmation received. Proceeding with publish...
echo.

cd "%~dp0ENTERPRISE_SAFE_EDITION"

REM ================================================================
REM PRE-PUBLISH VERIFICATION
REM ================================================================
echo.
echo 🔍 Running pre-publish verification...
echo.

REM Check that security fixes have been applied
echo Checking for security fixes...

REM Verify no SQL concatenation in CASCADE
findstr /C:"WHERE ${options.where}" cascade-memory-mcp\server\index.js >nul 2>&1
if not errorlevel 1 (
    echo ❌ SECURITY RISK: SQL concatenation still present in CASCADE
    echo    Please apply security fixes from IMPLEMENTATION_GUIDE.md
    pause
    exit /b 1
)

REM Verify PowerShell whitelist exists in Windows-MCP
findstr /C:"ALLOWED_POWERSHELL_COMMANDS" windows-mcp\src\desktop\service.py >nul 2>&1
if errorlevel 1 (
    echo ❌ SECURITY RISK: PowerShell whitelist not found in Windows-MCP
    echo    Please apply security fixes from IMPLEMENTATION_GUIDE.md
    pause
    exit /b 1
)

echo ✅ Basic security checks passed
echo.

REM ================================================================
REM 1. WINDOWS-MCP (Python/PyPI)
REM ================================================================
echo.
echo [1/4] Publishing windows-mcp to PyPI...
echo.

cd windows-mcp

REM Run security audit
echo Running pip-audit...
pip-audit
if errorlevel 1 (
    echo ⚠️  Warning: pip-audit found vulnerabilities
    set /p CONTINUE="Continue anyway? (yes/no): "
    if not "%CONTINUE%"=="yes" exit /b 1
)

REM Build the package
python -m build

REM Upload to PyPI (requires API token)
python -m twine upload dist/*

if errorlevel 1 (
    echo ❌ Failed to publish windows-mcp
    pause
    exit /b 1
)

echo ✅ windows-mcp published to PyPI
cd ..

REM ================================================================
REM 2. CASCADE-MEMORY-MCP (Node.js/npm)
REM ================================================================
echo.
echo [2/4] Publishing cascade-memory-mcp to npm...
echo.

cd cascade-memory-mcp

REM Install dependencies
call npm install

REM Run security audit
echo Running npm audit...
call npm audit --production
if errorlevel 1 (
    echo ⚠️  Warning: npm audit found vulnerabilities
    set /p CONTINUE="Continue anyway? (yes/no): "
    if not "%CONTINUE%"=="yes" exit /b 1
)

REM Run tests if available
if exist "package.json" (
    findstr /C:"\"test\"" package.json >nul 2>&1
    if not errorlevel 1 (
        echo Running tests...
        call npm test
        if errorlevel 1 (
            echo ⚠️  Tests failed
            set /p CONTINUE="Continue anyway? (yes/no): "
            if not "%CONTINUE%"=="yes" exit /b 1
        )
    )
)

REM Publish to npm (requires login: npm login)
call npm publish --access public

if errorlevel 1 (
    echo ❌ Failed to publish cascade-memory-mcp
    pause
    exit /b 1
)

echo ✅ cascade-memory-mcp published to npm
cd ..

REM ================================================================
REM 3. FAISS-MEMORY-MCP (Node.js/npm)
REM ================================================================
echo.
echo [3/4] Publishing faiss-memory-mcp to npm...
echo.

cd faiss-memory-mcp

REM Install dependencies
call npm install

REM Run security audit
echo Running npm audit...
call npm audit --production
if errorlevel 1 (
    echo ⚠️  Warning: npm audit found vulnerabilities
    set /p CONTINUE="Continue anyway? (yes/no): "
    if not "%CONTINUE%"=="yes" exit /b 1
)

REM Publish to npm
call npm publish --access public

if errorlevel 1 (
    echo ❌ Failed to publish faiss-memory-mcp
    pause
    exit /b 1
)

echo ✅ faiss-memory-mcp published to npm
cd ..

REM ================================================================
REM 4. FILE-SERVER-MCP (Node.js/npm)
REM ================================================================
echo.
echo [4/4] Publishing file-server-mcp to npm...
echo.

cd file-server-mcp

REM Install dependencies
call npm install

REM Run security audit
echo Running npm audit...
call npm audit --production
if errorlevel 1 (
    echo ⚠️  Warning: npm audit found vulnerabilities
    set /p CONTINUE="Continue anyway? (yes/no): "
    if not "%CONTINUE%"=="yes" exit /b 1
)

REM Publish to npm
call npm publish --access public

if errorlevel 1 (
    echo ❌ Failed to publish file-server-mcp
    pause
    exit /b 1
)

echo ✅ file-server-mcp published to npm
cd ..

REM ================================================================
REM PUBLISH COMPLETE
REM ================================================================
echo.
echo ═══════════════════════════════════════════════════════════
echo   🎉 ENTERPRISE SAFE EDITION - PUBLISH COMPLETE
echo ═══════════════════════════════════════════════════════════
echo.
echo   All 4 packages published successfully:
echo     ✅ windows-mcp (PyPI)
echo     ✅ cascade-memory-mcp (npm)
echo     ✅ faiss-memory-mcp (npm)
echo     ✅ file-server-mcp (npm)
echo.
echo   Production-ready MCPs now available for enterprise use.
echo.
echo ═══════════════════════════════════════════════════════════
echo.

pause
