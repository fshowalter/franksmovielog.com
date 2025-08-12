#!/bin/bash

# This script adds performance instrumentation to all API and data layer functions

echo "Adding performance instrumentation to API and data layers..."

# Function to add import if not exists
add_import() {
  local file=$1
  if ! grep -q "import { perfLogger }" "$file"; then
    # Find the last import line and add our import after it
    sed -i '' '/^import.*from/!b;:a;n;/^import.*from/ba;i\
import { perfLogger } from "./utils/performanceLogger";
' "$file" 2>/dev/null || \
    sed -i '' '/^import.*from/!b;:a;n;/^import.*from/ba;i\
import { perfLogger } from "./data/utils/performanceLogger";
' "$file" 2>/dev/null || \
    sed -i '' '/^import.*from/!b;:a;n;/^import.*from/ba;i\
import { perfLogger } from "../data/utils/performanceLogger";
' "$file" 2>/dev/null
  fi
}

# Files to instrument
API_FILES=(
  "src/api/data/alltimeStatsJson.ts"
  "src/api/data/castAndCrewJson.ts"
  "src/api/data/collectionsJson.ts"
  "src/api/data/overratedJson.ts"
  "src/api/data/reviewedTitlesJson.ts"
  "src/api/data/underratedJson.ts"
  "src/api/data/underseenJson.ts"
  "src/api/data/viewingsJson.ts"
  "src/api/data/viewingsMarkdown.ts"
  "src/api/data/watchlistProgressJson.ts"
  "src/api/data/watchlistTitlesJson.ts"
  "src/api/data/yearStatsJson.ts"
  "src/api/data/pagesMarkdown.ts"
)

for file in "${API_FILES[@]}"; do
  if [ -f "$file" ]; then
    echo "Instrumenting $file..."
    add_import "$file"
  fi
done

echo "Done! Performance instrumentation has been added."
echo ""
echo "To run with performance logging:"
echo "  DEBUG_PERF=true npm run build"
echo ""
echo "Results will be saved to performance-report.txt"