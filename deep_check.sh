#!/bin/bash
echo "--- UNUSED ASSETS (0 IMPORTS) ---"
find src/assets -type f -not -path "*/\.*" | while read assetpath; do
  filename=$(basename "$assetpath")
  # Is this filename mentioned anywhere in the code?
  if ! grep -qF "$filename" -r src/ 2>/dev/null; then
    echo "$filename"
  fi
done

echo ""
echo "--- DEAD IMPORTS (IMPORTED BUT UNUSED VARIABLE) ---"
find src -type f -name "*.tsx" | while read file; do
  grep -E "import [a-zA-Z0-9_]+ from ['\"].*(assets|figma:asset).*['\"]" "$file" | while read line; do
    varname=$(echo "$line" | awk '{print $2}')
    count=$(grep -ow "$varname" "$file" | wc -l)
    if [ "$count" -eq 1 ]; then
      echo "File: $file"
      echo "Variable: $varname"
    fi
  done
done
