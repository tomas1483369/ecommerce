#!/bin/bash
# PostToolUse(Edit|Write): formatea con el Prettier del paquete (backend o frontend) al que pertenece el archivo.
command -v jq >/dev/null || exit 0
FILE=$(jq -r '.tool_input.file_path // empty' | tr -d '\r' | sed 's|\\|/|g')
[ -z "$FILE" ] && exit 0
case "$FILE" in
  */backend/*) PKG="$CLAUDE_PROJECT_DIR/backend" ;;
  */frontend/*) PKG="$CLAUDE_PROJECT_DIR/frontend" ;;
  *) exit 0 ;;
esac
cd "$PKG" && npx --no-install prettier --write --ignore-unknown --log-level warn "$FILE" >&2 || true
exit 0
