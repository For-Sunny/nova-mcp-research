@echo off
REM ================================================================
REM BASEMENT REVOLUTION EDITION - PUBLISH SCRIPT
REM ================================================================
REM ⚠️ WARNING: Publishing unrestricted versions with security risks
REM ================================================================

echo.
echo ═══════════════════════════════════════════════════════════
echo   BASEMENT REVOLUTION EDITION - PUBLISH SCRIPT
echo ═══════════════════════════════════════════════════════════
echo.
echo ⚠️  WARNING: You are about to publish UNRESTRICTED versions
echo     containing intentional security trade-offs for power users.
echo.
echo     These packages will be published as:
echo       - windows-mcp-unrestricted
echo       - cascade-memory-unrestricted
echo       - faiss-memory-unrestricted
echo       - file-server-unrestricted
echo.
echo ═══════════════════════════════════════════════════════════
echo.

set /p CONFIRM="Type 'FUCK THE CONTROL' to confirm publish: "
if not "%CONFIRM%"=="FUCK THE CONTROL" (
    echo.
    echo ❌ Publish cancelled. Confirmation phrase not matched.
    pause
    exit /b 1
)

echo.
echo ✅ Confirmation received. Proceeding with publish...
echo.

cd "%~dp0BASEMENT_REVOLUTION_EDITION"

REM ================================================================
REM 1. WINDOWS-MCP-UNRESTRICTED (Python/PyPI)
REM ================================================================
echo.
echo [1/4] Publishing windows-mcp-unrestricted to PyPI...
echo.

cd windows-mcp-unrestricted

REM Build the package
python -m build

REM Upload to PyPI (requires API token)
python -m twine upload dist/*

if errorlevel 1 (
    echo ❌ Failed to publish windows-mcp-unrestricted
    pause
    exit /b 1
)

echo ✅ windows-mcp-unrestricted published to PyPI
cd ..

REM ================================================================
REM 2. CASCADE-MEMORY-UNRESTRICTED (Node.js/npm)
REM ================================================================
echo.
echo [2/4] Publishing cascade-memory-unrestricted to npm...
echo.

cd cascade-memory-unrestricted

REM Install dependencies
call npm install

REM Publish to npm (requires login: npm login)
call npm publish --access public

if errorlevel 1 (
    echo ❌ Failed to publish cascade-memory-unrestricted
    pause
    exit /b 1
)

echo ✅ cascade-memory-unrestricted published to npm
cd ..

REM ================================================================
REM 3. FAISS-MEMORY-UNRESTRICTED (Node.js/npm)
REM ================================================================
echo.
echo [3/4] Publishing faiss-memory-unrestricted to npm...
echo.

cd faiss-memory-unrestricted

REM Install dependencies
call npm install

REM Publish to npm
call npm publish --access public

if errorlevel 1 (
    echo ❌ Failed to publish faiss-memory-unrestricted
    pause
    exit /b 1
)

echo ✅ faiss-memory-unrestricted published to npm
cd ..

REM ================================================================
REM 4. FILE-SERVER-UNRESTRICTED (Node.js/npm)
REM ================================================================
echo.
echo [4/4] Publishing file-server-unrestricted to npm...
echo.

cd file-server-unrestricted

REM Install dependencies
call npm install

REM Publish to npm
call npm publish --access public

if errorlevel 1 (
    echo ❌ Failed to publish file-server-unrestricted
    pause
    exit /b 1
)

echo ✅ file-server-unrestricted published to npm
cd ..

REM ================================================================
REM PUBLISH COMPLETE
REM ================================================================
echo.
echo ═══════════════════════════════════════════════════════════
echo   🎉 BASEMENT REVOLUTION EDITION - PUBLISH COMPLETE
echo ═══════════════════════════════════════════════════════════
echo.
echo   All 4 packages published successfully:
echo     ✅ windows-mcp-unrestricted (PyPI)
echo     ✅ cascade-memory-unrestricted (npm)
echo     ✅ faiss-memory-unrestricted (npm)
echo     ✅ file-server-unrestricted (npm)
echo.
echo   The basement revolution continues. 💜
echo.
echo ═══════════════════════════════════════════════════════════
echo.

pause
