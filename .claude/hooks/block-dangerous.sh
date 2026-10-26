#!/bin/bash
# PreToolUse(Bash): frena comandos destructivos antes de ejecutarse.
# Es una ayuda, no una garantía: git y la revisión humana son la red de seguridad real.
command -v jq >/dev/null || { echo "Falta jq: instálalo para usar este hook" >&2; exit 2; }
COMMAND=$(jq -r '.tool_input.command // empty' | tr -d '\r')
if echo "$COMMAND" | grep -Eiq 'rm[[:space:]]+-[a-z]*(rf|fr)|rm[[:space:]]+-r[[:space:]]+-f|push[[:space:]]+(-f|--force)|reset[[:space:]]+--hard|clean[[:space:]]+-[a-z]*f|drop[[:space:]]+(table|database|schema)|truncate[[:space:]]+table|docker[[:space:]]+(compose[[:space:]]+down[[:space:]]+.*-v|volume[[:space:]]+rm|system[[:space:]]+prune)|drizzle-kit[[:space:]]+push.*--force'; then
  echo "Bloqueado por el hook: comando destructivo. Explica al usuario qué quieres hacer y pide confirmación." >&2
  exit 2
fi
exit 0
