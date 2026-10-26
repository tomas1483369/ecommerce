#!/bin/bash
# Deja el proyecto listo y comprueba que todo está en verde antes de trabajar.
set -e
cd "$(dirname "$0")"

echo "== Instalando dependencias =="
npm --prefix backend install --no-audit --no-fund --loglevel error
npm --prefix frontend install --no-audit --no-fund --loglevel error

echo "== Verificando (typecheck + lint) =="
npm run check --silent

echo "== Tests =="
npm test --silent

if [ ! -f backend/.env ]; then
  echo "AVISO: falta backend/.env (cópialo de backend/.env.example) para correr la app."
fi
if command -v docker >/dev/null && ! docker compose ps --status running db 2>/dev/null | grep -q db; then
  echo "AVISO: la base de datos local no está corriendo (docker compose up -d db)."
fi

echo "OK: proyecto en verde, listo para trabajar"
