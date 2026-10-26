#!/bin/bash
# Stop: si hay cambios sin commitear, los tests deben pasar antes de que Claude dé por terminada su respuesta.
cd "$CLAUDE_PROJECT_DIR" || exit 0
if git diff --quiet && git diff --cached --quiet && [ -z "$(git ls-files --others --exclude-standard)" ]; then
  exit 0
fi
OUT=$(npm test 2>&1) || {
  echo "Los tests fallan. Corrígelos antes de terminar:" >&2
  echo "$OUT" | tail -n 40 >&2
  exit 2
}
exit 0
