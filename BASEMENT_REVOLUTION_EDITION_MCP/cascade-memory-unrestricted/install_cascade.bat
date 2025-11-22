@echo off
setlocal enabledelayedexpansion

echo ================================================================================
echo CASCADE MEMORY SYSTEM - INSTALLATION WIZARD
echo 6-Layer SQLite Memory Architecture for AI Systems
echo ================================================================================
echo.

REM Check for Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js not found!
    echo Please install Node.js v18+ from https://nodejs.org
    echo.
    pause
    exit /b 1
)

REM Check Node.js version
for /f "tokens=1" %%v in ('node -v') do set NODE_VERSION=%%v
echo [OK] Node.js detected: %NODE_VERSION%

REM Check for SQLite3
where sqlite3 >nul 2>nul
if %errorlevel% neq 0 (
    echo [WARNING] SQLite3 command-line tool not found
    echo Will install via npm dependencies instead
    set HAS_SQLITE=false
) else (
    echo [OK] SQLite3 detected
    set HAS_SQLITE=true
)

echo.
echo ================================================================================
echo STEP 1: AI IDENTITY SETUP
echo ================================================================================
echo.

REM Get AI name
set /p AI_NAME="What name should this AI use? (e.g., Claude, Assistant, Nova): "
if "!AI_NAME!"=="" set AI_NAME=Assistant
echo [OK] AI Name: !AI_NAME!

echo.
echo Would you like to provide an initial identity statement?
echo (This will be the first memory in the identity layer)
echo.
echo Example: "I am Claude, an AI assistant created by Anthropic to be helpful, harmless, and honest."
echo.
set /p IDENTITY_STATEMENT="Identity statement (press Enter to skip): "

echo.
echo ================================================================================
echo STEP 2: DATABASE LOCATION
echo ================================================================================
echo.

REM Get database directory
set DEFAULT_DB_PATH=%USERPROFILE%\Documents\CASCADE_MEMORY
echo Default location: %DEFAULT_DB_PATH%
set /p DB_PATH="Database location (press Enter for default): "
if "!DB_PATH!"=="" set DB_PATH=%DEFAULT_DB_PATH%

echo [OK] Database location: !DB_PATH!

REM Create database directory
if not exist "!DB_PATH!" (
    echo Creating directory: !DB_PATH!
    mkdir "!DB_PATH!"
    if %errorlevel% neq 0 (
        echo [ERROR] Failed to create directory
        pause
        exit /b 1
    )
)

echo.
echo ================================================================================
echo STEP 3: INSTALLING DEPENDENCIES
echo ================================================================================
echo.

echo Running npm install...
call npm install
if %errorlevel% neq 0 (
    echo [ERROR] npm install failed
    pause
    exit /b 1
)
echo [OK] Dependencies installed

echo.
echo ================================================================================
echo STEP 4: CREATING CASCADE DATABASES
echo ================================================================================
echo.

REM Create SQL schema file
set SCHEMA_FILE=!DB_PATH!\cascade_schema.sql
echo Creating schema file: !SCHEMA_FILE!

(
echo -- CASCADE Memory System Database Schema
echo CREATE TABLE IF NOT EXISTS memories ^(
echo     id INTEGER PRIMARY KEY AUTOINCREMENT,
echo     timestamp REAL,
echo     event TEXT,
echo     context TEXT,
echo     emotional_intensity REAL,
echo     importance REAL,
echo     frequency REAL,
echo     metadata TEXT
echo ^);
echo.
echo -- Indexes for performance
echo CREATE INDEX IF NOT EXISTS idx_timestamp ON memories^(timestamp^);
echo CREATE INDEX IF NOT EXISTS idx_importance ON memories^(importance^);
echo CREATE INDEX IF NOT EXISTS idx_frequency ON memories^(frequency^);
) > "!SCHEMA_FILE!"

echo [OK] Schema file created

REM Create databases using Node.js (more reliable than sqlite3 CLI)
echo Creating databases with Node.js...

(
echo const sqlite3 = require^('sqlite3'^).verbose^(^);
echo const fs = require^('fs'^);
echo const path = require^('path'^);
echo.
echo const dbPath = '!DB_PATH!'.replace^(/\\/g, '/'^);
echo const schemaSQL = fs.readFileSync^('!SCHEMA_FILE!', 'utf8'^);
echo.
echo const databases = [
echo   'episodic_memory.db',
echo   'semantic_memory.db',
echo   'procedural_memory.db',
echo   'meta_memory.db',
echo   'nova_memory.db',
echo   'working_memory.db'
echo ];
echo.
echo console.log^('Creating CASCADE databases...'^);
echo.
echo databases.forEach^(dbFile =^> {
echo   const fullPath = path.join^(dbPath, dbFile^);
echo   const db = new sqlite3.Database^(fullPath^);
echo
echo   db.exec^(schemaSQL, ^(err^) =^> {
echo     if ^(err^) {
echo       console.error^(`[ERROR] Failed to create ${dbFile}:`, err^);
echo       process.exit^(1^);
echo     } else {
echo       console.log^(`[OK] Created ${dbFile}`^);
echo     }
echo   }^);
echo
echo   db.close^(^);
echo }^);
echo.
echo console.log^('All databases created successfully!'^);
) > create_dbs.js

node create_dbs.js
if %errorlevel% neq 0 (
    echo [ERROR] Database creation failed
    del create_dbs.js
    pause
    exit /b 1
)

del create_dbs.js
echo.

REM Seed identity layer with AI name and identity statement
if not "!IDENTITY_STATEMENT!"=="" (
    echo Seeding identity layer...

    REM Get current timestamp (Unix epoch in seconds)
    for /f %%i in ('powershell -command "[Math]::Floor([decimal](Get-Date -UFormat %%s))"') do set TIMESTAMP=%%i

    (
    echo const sqlite3 = require^('sqlite3'^).verbose^(^);
    echo const path = require^('path'^);
    echo.
    echo const dbPath = '!DB_PATH!'.replace^(/\\/g, '/'^);
    echo const identityDb = path.join^(dbPath, 'nova_memory.db'^);
    echo.
    echo const db = new sqlite3.Database^(identityDb^);
    echo.
    echo const insertSQL = `INSERT INTO memories ^(timestamp, event, context, emotional_intensity, importance, frequency, metadata^) VALUES ^(?, ?, ?, ?, ?, ?, ?^)`;
    echo.
    echo const metadata = JSON.stringify^({
    echo   layer: 'identity',
    echo   type: 'core_self',
    echo   source: 'initialization',
    echo   ai_name: '!AI_NAME!'
    echo }^);
    echo.
    echo db.run^(insertSQL, [
    echo   !TIMESTAMP!,
    echo   'Core Identity',
    echo   'My name is !AI_NAME!. !IDENTITY_STATEMENT!',
    echo   1.0,
    echo   1.0,
    echo   1.0,
    echo   metadata
    echo ], function^(err^) {
    echo   if ^(err^) {
    echo     console.error^('[ERROR] Failed to seed identity:', err^);
    echo     process.exit^(1^);
    echo   } else {
    echo     console.log^('[OK] Identity layer seeded with core identity'^);
    echo   }
    echo   db.close^(^);
    echo }^);
    ) > seed_identity.js

    node seed_identity.js
    del seed_identity.js
)

echo.
echo ================================================================================
echo STEP 5: CONFIGURATION
echo ================================================================================
echo.

REM Create .env file
set ENV_FILE=.env
echo Creating configuration file: !ENV_FILE!

(
echo # CASCADE Memory System Configuration
echo # Generated by install_cascade.bat
echo.
echo # Database paths
echo CASCADE_EPISODIC_DB=!DB_PATH!\episodic_memory.db
echo CASCADE_SEMANTIC_DB=!DB_PATH!\semantic_memory.db
echo CASCADE_PROCEDURAL_DB=!DB_PATH!\procedural_memory.db
echo CASCADE_META_DB=!DB_PATH!\meta_memory.db
echo CASCADE_NOVA_DB=!DB_PATH!\nova_memory.db
echo CASCADE_WORKING_DB=!DB_PATH!\working_memory.db
echo.
echo # AI Identity
echo AI_NAME=!AI_NAME!
echo.
echo # Operating frequency
echo CASCADE_FREQUENCY=21.43
) > "!ENV_FILE!"

echo [OK] Configuration saved to !ENV_FILE!

echo.
echo ================================================================================
echo INSTALLATION COMPLETE!
echo ================================================================================
echo.
echo AI Name: !AI_NAME!
echo Database Location: !DB_PATH!
echo.
echo Next steps:
echo 1. Configure your MCP client to use this CASCADE server
echo 2. Add the following to your Claude Desktop config:
echo.
echo    "cascade-memory-mcp": {
echo      "command": "node",
echo      "args": ["%CD%\index.js"],
echo      "env": {
echo        "CASCADE_EPISODIC_DB": "!DB_PATH!\episodic_memory.db",
echo        "CASCADE_SEMANTIC_DB": "!DB_PATH!\semantic_memory.db",
echo        "CASCADE_PROCEDURAL_DB": "!DB_PATH!\procedural_memory.db",
echo        "CASCADE_META_DB": "!DB_PATH!\meta_memory.db",
echo        "CASCADE_NOVA_DB": "!DB_PATH!\nova_memory.db",
echo        "CASCADE_WORKING_DB": "!DB_PATH!\working_memory.db"
echo      }
echo    }
echo.
echo 3. Restart Claude Desktop
echo.
echo For detailed MCP configuration, see CASCADE_MEMORY_SYSTEM.md
echo.
pause
