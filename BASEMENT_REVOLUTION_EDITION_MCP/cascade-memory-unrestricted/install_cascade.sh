#!/bin/bash

echo "================================================================================"
echo "CASCADE MEMORY SYSTEM - INSTALLATION WIZARD"
echo "6-Layer SQLite Memory Architecture for AI Systems"
echo "================================================================================"
echo ""

# Check for Node.js
if ! command -v node &> /dev/null; then
    echo "[ERROR] Node.js not found!"
    echo "Please install Node.js v18+ from https://nodejs.org"
    echo ""
    exit 1
fi

NODE_VERSION=$(node -v)
echo "[OK] Node.js detected: $NODE_VERSION"

# Check for SQLite3
if ! command -v sqlite3 &> /dev/null; then
    echo "[WARNING] SQLite3 command-line tool not found"
    echo "Will install via npm dependencies instead"
    HAS_SQLITE=false
else
    echo "[OK] SQLite3 detected"
    HAS_SQLITE=true
fi

echo ""
echo "================================================================================"
echo "STEP 1: AI IDENTITY SETUP"
echo "================================================================================"
echo ""

# Get AI name
read -p "What name should this AI use? (e.g., Claude, Assistant, Nova): " AI_NAME
if [ -z "$AI_NAME" ]; then
    AI_NAME="Assistant"
fi
echo "[OK] AI Name: $AI_NAME"

echo ""
echo "Would you like to provide an initial identity statement?"
echo "(This will be the first memory in the identity layer)"
echo ""
echo "Example: \"I am Claude, an AI assistant created by Anthropic to be helpful, harmless, and honest.\""
echo ""
read -p "Identity statement (press Enter to skip): " IDENTITY_STATEMENT

echo ""
echo "================================================================================"
echo "STEP 2: DATABASE LOCATION"
echo "================================================================================"
echo ""

# Get database directory
DEFAULT_DB_PATH="$HOME/Documents/CASCADE_MEMORY"
echo "Default location: $DEFAULT_DB_PATH"
read -p "Database location (press Enter for default): " DB_PATH
if [ -z "$DB_PATH" ]; then
    DB_PATH="$DEFAULT_DB_PATH"
fi

echo "[OK] Database location: $DB_PATH"

# Create database directory
if [ ! -d "$DB_PATH" ]; then
    echo "Creating directory: $DB_PATH"
    mkdir -p "$DB_PATH"
    if [ $? -ne 0 ]; then
        echo "[ERROR] Failed to create directory"
        exit 1
    fi
fi

echo ""
echo "================================================================================"
echo "STEP 3: INSTALLING DEPENDENCIES"
echo "================================================================================"
echo ""

echo "Running npm install..."
npm install
if [ $? -ne 0 ]; then
    echo "[ERROR] npm install failed"
    exit 1
fi
echo "[OK] Dependencies installed"

echo ""
echo "================================================================================"
echo "STEP 4: CREATING CASCADE DATABASES"
echo "================================================================================"
echo ""

# Create SQL schema file
SCHEMA_FILE="$DB_PATH/cascade_schema.sql"
echo "Creating schema file: $SCHEMA_FILE"

cat > "$SCHEMA_FILE" << 'EOF'
-- CASCADE Memory System Database Schema
CREATE TABLE IF NOT EXISTS memories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    timestamp REAL,
    event TEXT,
    context TEXT,
    emotional_intensity REAL,
    importance REAL,
    frequency REAL,
    metadata TEXT
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_timestamp ON memories(timestamp);
CREATE INDEX IF NOT EXISTS idx_importance ON memories(importance);
CREATE INDEX IF NOT EXISTS idx_frequency ON memories(frequency);
EOF

echo "[OK] Schema file created"

# Create databases using Node.js
echo "Creating databases with Node.js..."

cat > create_dbs.js << EOF
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

const dbPath = '$DB_PATH';
const schemaSQL = fs.readFileSync('$SCHEMA_FILE', 'utf8');

const databases = [
  'episodic_memory.db',
  'semantic_memory.db',
  'procedural_memory.db',
  'meta_memory.db',
  'nova_memory.db',
  'working_memory.db'
];

console.log('Creating CASCADE databases...');

databases.forEach(dbFile => {
  const fullPath = path.join(dbPath, dbFile);
  const db = new sqlite3.Database(fullPath);

  db.exec(schemaSQL, (err) => {
    if (err) {
      console.error(\`[ERROR] Failed to create \${dbFile}:\`, err);
      process.exit(1);
    } else {
      console.log(\`[OK] Created \${dbFile}\`);
    }
  });

  db.close();
});

console.log('All databases created successfully!');
EOF

node create_dbs.js
if [ $? -ne 0 ]; then
    echo "[ERROR] Database creation failed"
    rm -f create_dbs.js
    exit 1
fi

rm -f create_dbs.js
echo ""

# Seed identity layer with AI name and identity statement
if [ -n "$IDENTITY_STATEMENT" ]; then
    echo "Seeding identity layer..."

    TIMESTAMP=$(date +%s)

    cat > seed_identity.js << EOF
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = '$DB_PATH';
const identityDb = path.join(dbPath, 'nova_memory.db');

const db = new sqlite3.Database(identityDb);

const insertSQL = \`INSERT INTO memories (timestamp, event, context, emotional_intensity, importance, frequency, metadata) VALUES (?, ?, ?, ?, ?, ?, ?)\`;

const metadata = JSON.stringify({
  layer: 'identity',
  type: 'core_self',
  source: 'initialization',
  ai_name: '$AI_NAME'
});

db.run(insertSQL, [
  $TIMESTAMP,
  'Core Identity',
  'My name is $AI_NAME. $IDENTITY_STATEMENT',
  1.0,
  1.0,
  1.0,
  metadata
], function(err) {
  if (err) {
    console.error('[ERROR] Failed to seed identity:', err);
    process.exit(1);
  } else {
    console.log('[OK] Identity layer seeded with core identity');
  }
  db.close();
});
EOF

    node seed_identity.js
    rm -f seed_identity.js
fi

echo ""
echo "================================================================================"
echo "STEP 5: CONFIGURATION"
echo "================================================================================"
echo ""

# Create .env file
ENV_FILE=".env"
echo "Creating configuration file: $ENV_FILE"

cat > "$ENV_FILE" << EOF
# CASCADE Memory System Configuration
# Generated by install_cascade.sh

# Database paths
CASCADE_EPISODIC_DB=$DB_PATH/episodic_memory.db
CASCADE_SEMANTIC_DB=$DB_PATH/semantic_memory.db
CASCADE_PROCEDURAL_DB=$DB_PATH/procedural_memory.db
CASCADE_META_DB=$DB_PATH/meta_memory.db
CASCADE_NOVA_DB=$DB_PATH/nova_memory.db
CASCADE_WORKING_DB=$DB_PATH/working_memory.db

# AI Identity
AI_NAME=$AI_NAME

# Operating frequency
CASCADE_FREQUENCY=21.43
EOF

echo "[OK] Configuration saved to $ENV_FILE"

echo ""
echo "================================================================================"
echo "INSTALLATION COMPLETE!"
echo "================================================================================"
echo ""
echo "AI Name: $AI_NAME"
echo "Database Location: $DB_PATH"
echo ""
echo "Next steps:"
echo "1. Configure your MCP client to use this CASCADE server"
echo "2. Add the following to your Claude Desktop config:"
echo ""
echo "   \"cascade-memory-mcp\": {"
echo "     \"command\": \"node\","
echo "     \"args\": [\"$(pwd)/index.js\"],"
echo "     \"env\": {"
echo "       \"CASCADE_EPISODIC_DB\": \"$DB_PATH/episodic_memory.db\","
echo "       \"CASCADE_SEMANTIC_DB\": \"$DB_PATH/semantic_memory.db\","
echo "       \"CASCADE_PROCEDURAL_DB\": \"$DB_PATH/procedural_memory.db\","
echo "       \"CASCADE_META_DB\": \"$DB_PATH/meta_memory.db\","
echo "       \"CASCADE_NOVA_DB\": \"$DB_PATH/nova_memory.db\","
echo "       \"CASCADE_WORKING_DB\": \"$DB_PATH/working_memory.db\""
echo "     }"
echo "   }"
echo ""
echo "3. Restart Claude Desktop"
echo ""
echo "For detailed MCP configuration, see CASCADE_MEMORY_SYSTEM.md"
echo ""
