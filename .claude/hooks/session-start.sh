#!/bin/bash
# SessionStart: lo que se imprime aquí le llega a Claude como contexto inicial.
cd "$CLAUDE_PROJECT_DIR" || exit 0
echo "== docs/progreso.md (inicio) =="
head -n 45 docs/progreso.md 2>/dev/null
echo
echo "== git log reciente =="
git log --oneline -10
echo
echo "== git status =="
git status --short | head -n 20
