# Guía: ecosistema de harness engineering con Claude Code

Oct 16, 2026 · @Daniel

## Qué vas a construir

Vas a montar un harness completo alrededor de Claude Code en 11 pasos, de la base técnica a la mejora continua. El orden importa: cada capa se apoya en la anterior. Sin tests, los hooks y el TDD de Superpowers no tienen nada que verificar. Sin un CLAUDE.md claro, las skills y subagentes no saben las reglas del proyecto.

La regla de oro del harness engineering: **empieza mínimo y agrega una pieza cada vez que el agente falle en algo**. No instales todo de golpe; cada skill, hook o MCP extra consume contexto y puede chocar con otros.

**Las dos clases de piezas de un harness** (marco de [Birgitta Böckeler en martinfowler.com](https://martinfowler.com/articles/harness-engineering.html)):

|  | Guías (antes de que actúe) | Sensores (después de que actúa) |
| --- | --- | --- |
| **Deterministas** (rápidas, baratas, siempre iguales) | Plantillas, scripts, `init.sh` | Tests, linter, type checker, hooks |
| **Con IA** (más lentas, juzgan el significado) | CLAUDE.md, docs/, skills | Subagente revisor, revisión de código con IA |

Necesitas las dos: solo guías y nadie comprueba que se cumplan; solo sensores y el agente repite los mismos errores. Empieza siempre por los sensores deterministas (Paso 2), porque son los más confiables.

El orden recomendado:

1. Instalar Claude Code
2. Base técnica del repo: git, tests, linter, formateador, CI
3. Memoria del proyecto: CLAUDE.md (reglas) y docs/ (decisiones, hitos, progreso, tests)
4. Permisos: settings.json
5. Hooks esenciales
6. Plugins y Superpowers (el flujo de trabajo)
7. Skills propias (cuando repitas algo)
8. Subagentes (cuando una tarea necesite su propio contexto)
9. MCP servers (solo los que uses)
10. Flujo diario por feature
11. Mantener y mejorar el harness

No tienes que hacer esto a mano: cada paso se lo puedes pedir a Claude, y al final de la guía hay una tabla con el prompt de cada uno. Tu trabajo es decidir y revisar. Los pasos 1 a 6 son el día 1. Los pasos 7 a 9 se agregan a medida que el proyecto los pida.

## Paso 1: instalar Claude Code

Necesitas un plan Pro, Max, Team, Enterprise o una cuenta de Console. El plan gratuito no incluye Claude Code ([docs](https://code.claude.com/docs/en/setup.md)).

**Requisitos**: macOS 13+, Windows 10 1809+, Ubuntu 20.04+ o Debian 10+, y al menos 4 GB de RAM.

1. **Instala** con el instalador nativo (recomendado, se actualiza solo):
   - macOS, Linux o WSL: `curl -fsSL https://claude.ai/install.sh | bash`
   - Windows PowerShell: `irm https://claude.ai/install.ps1 | iex`
   - Alternativas: `brew install --cask claude-code`, `winget install Anthropic.ClaudeCode` o `npm install -g @anthropic-ai/claude-code` (requiere Node.js 22+, nunca con `sudo`).
2. **Verifica**: `claude --version`, y si algo falla, `claude doctor` para un diagnóstico.
3. **Inicia sesión**: entra a la carpeta del proyecto, ejecuta `claude` y sigue los pasos en el navegador.
4. **Opcional**: instala la extensión de tu editor (VS Code o JetBrains) para ver los cambios en diffs.
5. **Instala `jq`** (`brew install jq` o `sudo apt install jq`). Los hooks de esta guía lo usan para leer el JSON que envía Claude Code.

**Si usas Windows**, trabaja dentro de **WSL2** (Ubuntu): los hooks de esta guía son scripts de bash, y el sandbox no funciona en Windows nativo ([docs](https://code.claude.com/docs/en/setup.md)). Solo el instalador nativo se actualiza solo; si instalaste con Homebrew o WinGet, actualiza con `brew upgrade claude-code` o `winget upgrade`.

## Paso 2: base técnica del repo

Antes de configurar nada de IA, el repo necesita herramientas que digan objetivamente si el código está bien. Son los "sensores" del harness: el agente las usa para verificarse a sí mismo.

1. **Crea el repo y conéctalo a GitHub**: `git init`, un `.gitignore` adecuado a tu stack y el primer commit. Git es tu red de seguridad: cada cambio del agente se puede revisar y revertir.
2. **Elige un framework de tests** y deja al menos un test pasando.
3. **Configura linter y formateador** con reglas estrictas desde el inicio.
4. **Configura el type checker** si tu lenguaje lo tiene.
5. **Crea comandos de una sola línea** para cada verificación (en `package.json`, `Makefile` o `pyproject.toml`). El agente debe poder correr `npm test` o `make check` sin adivinar.
6. **Configura CI** (GitHub Actions) que corra tests, lint y types en cada push y PR. Es la última barrera aunque falle todo lo demás.
7. **Protege secretos**: `.env` en `.gitignore` y un `.env.example` sin valores reales.

**Qué usar (recomendación 2026)**. Si no tienes preferencia, elige TypeScript o Python: son los stacks donde Claude rinde mejor y donde más ejemplos hay.

| Necesidad | TypeScript / Node | Python | Por qué |
| --- | --- | --- | --- |
| Gestor de paquetes | [pnpm](https://pnpm.io) o npm | [uv](https://docs.astral.sh/uv/) | uv es el estándar actual en Python: rápido y maneja versiones, entornos y dependencias en una sola herramienta |
| Tests unitarios | [Vitest](https://vitest.dev) | [pytest](https://docs.pytest.org) | En State of JS 2025, Vitest tiene la satisfacción más alta (\~96%) mientras Jest cae ([fuente](https://qaskills.sh/blog/state-of-js-2025-testing-frameworks-results)); pytest es el estándar de Python |
| Tests de punta a punta | [Playwright](https://playwright.dev) | [Playwright](https://playwright.dev/python/) | Supera a Cypress en uso y satisfacción, y tiene MCP para que Claude lo maneje (Paso 9) |
| Lint + formato | [Biome](https://biomejs.dev) (o ESLint + Prettier si tu framework lo exige) | [Ruff](https://docs.astral.sh/ruff/) (`ruff check` y `ruff format`) | Una sola herramienta, muy rápida: ideal para correr en cada edición desde un hook |
| Tipos | `tsc --noEmit` | [mypy](https://mypy-lang.org) o [pyright](https://github.com/microsoft/pyright) | Los errores de tipos son feedback inmediato para el agente |
| CI | [GitHub Actions](https://docs.github.com/actions) | [GitHub Actions](https://docs.github.com/actions) | Gratis para repos públicos, y Claude Code tiene integración oficial con él |

Si usas Biome, cambia `npx prettier --write` por `npx biome format --write` en el hook del Paso 5; con Python, usa `ruff format`.

Mientras más rápido corran estos comandos, mejor: el agente los ejecutará decenas de veces por sesión.

**Script de arranque `init.sh`**: un solo comando que deja el proyecto listo y comprueba que todo está en verde antes de que Claude toque nada. Cada sesión empieza ejecutándolo, así el agente nunca trabaja sobre un proyecto roto sin saberlo. Pídele a Claude que lo cree:

```bash
#!/bin/bash
set -e
echo "== Instalando dependencias =="
npm install            # o: uv sync
echo "== Verificando =="
npm run check          # lint + tipos
npm test               # tests
echo "OK: proyecto en verde, listo para trabajar"
```

Y agrega en CLAUDE.md: *"Al iniciar una sesión, ejecuta ./init.sh. Si falla, arregla eso antes de cualquier otra cosa."*

## Paso 3: memoria del proyecto (CLAUDE.md)

CLAUDE.md es lo primero que Claude lee en cada sesión: las reglas de tu proyecto. Mantenlo por debajo de 200 líneas, como un mapa que apunta a documentos más detallados ([docs](https://code.claude.com/docs/en/memory.md)).

1. **Genera la base** con `/init`. Claude analiza el repo y escribe un CLAUDE.md con los comandos de build, tests y convenciones.
2. **Revísalo y ajústalo** (o pídele a Claude que lo ajuste). Debe incluir:
   - Qué es el proyecto, en 2 o 3 líneas
   - Stack y estructura de carpetas principal
   - Comandos exactos: instalar, correr, tests, lint, types
   - Convenciones: nombres, estilo, patrones obligatorios
   - Qué NO hacer: carpetas que no se tocan, librerías prohibidas
   - Definición de "terminado": tests, lint y types en verde
3. **Mueve el detalle a `docs/` y menciónalo por su ruta** (por ejemplo: "la arquitectura está en docs/arquitectura.md"). Claude lo leerá cuando lo necesite. Ojo: si usas la sintaxis de import `@docs/arquitectura.md`, ese archivo se carga completo en **cada** sesión, así que reserva el `@` para lo que realmente debe estar siempre presente ([docs](https://code.claude.com/docs/en/memory.md)).
4. **Haz commit** del CLAUDE.md para que todo el equipo (y cada sesión) lo comparta.

**Dónde vive cada archivo** (se cargan todos y se suman, no se reemplazan):

| Archivo | Alcance | ¿Va a git? |
| --- | --- | --- |
| `~/.claude/CLAUDE.md` | Tus preferencias en todos los proyectos | No |
| `./CLAUDE.md` o `./.claude/CLAUDE.md` | Reglas del proyecto | Sí |
| `./CLAUDE.local.md` | Tus notas personales en este proyecto | No (agrégalo al `.gitignore`) |
| `subcarpeta/CLAUDE.md` | Reglas de esa parte del código; se carga al trabajar ahí | Sí |

**¿CLAUDE.md o AGENTS.md?** `AGENTS.md` es el formato que leen otros agentes (Codex, Cursor, Copilot). Si quieres que tu repo sirva con cualquier herramienta, pon las reglas en `AGENTS.md` y deja el `CLAUDE.md` con una sola línea: `@AGENTS.md` (aquí el import sí conviene, porque esas reglas deben cargarse siempre). Claude Code también lee `AGENTS.md` por su cuenta cuando no hay CLAUDE.md, pero el import es lo más seguro. En ambos casos, que funcione como un **mapa** que apunta a `docs/`, no como un manual gigante.

**Qué poner y qué no** (según las [buenas prácticas oficiales](https://code.claude.com/docs/en/best-practices)):

| Incluir | No incluir |
| --- | --- |
| Comandos que Claude no puede adivinar | Lo que Claude deduce leyendo el código |
| Reglas de estilo distintas a las habituales | Convenciones estándar del lenguaje |
| Cómo correr los tests y cuál runner usar | Documentación detallada de APIs (enlázala) |
| Convenciones de ramas y PRs | Información que cambia seguido |
| Decisiones de arquitectura propias del proyecto | Tutoriales o explicaciones largas |
| Trampas o comportamientos no evidentes | Obviedades como "escribe código limpio" |

Por cada línea pregúntate: *¿si la borro, Claude se equivocaría?* Si no, bórrala. Un CLAUDE.md demasiado largo hace que Claude ignore justo las reglas importantes. Si una regla se sigue saltando, márcala con "IMPORTANTE" (solo esa) o conviértela en hook. Usa `/context` para confirmar que se cargó.

Usa `/memory` para ver y abrir estos archivos. Claude Code también tiene memoria automática, donde guarda aprendizajes por proyecto; se activa o desactiva desde el mismo `/memory`.

Ejemplo mínimo:

```markdown
# Mi App
API de reservas en TypeScript + Express + PostgreSQL.

## Comandos
- Instalar: `npm install`
- Tests: `npm test`
- Lint y tipos: `npm run check`

## Reglas
- Toda feature nueva lleva tests.
- Valida los datos de entrada con zod en los controladores.
- No modifiques `src/legacy/`.

## Terminado = `npm test` y `npm run check` en verde.

## Más contexto (léelo cuando lo necesites)
- Arquitectura: docs/arquitectura.md
- Decisiones: docs/decisiones/
- Progreso: docs/progreso.md
```

## Paso 3b: documentación viva (la memoria del proyecto)

CLAUDE.md dice las reglas; la carpeta `docs/` guarda todo lo demás que Claude necesita recordar entre sesiones: por qué se decidió algo, en qué hito vas, qué falta y cómo se prueba. Si no está en el repo, para Claude no existe, y tendrías que repetírselo cada vez.

**Estructura recomendada**:

```
docs/
├── vision.md            # Qué es el producto, para quién, qué NO es
├── arquitectura.md      # Componentes, capas, flujo de datos
├── roadmap.md           # Hitos (milestones) con criterios de "hecho"
├── progreso.md          # Bitácora: qué se hizo, qué sigue, bloqueos
├── testing.md           # Estrategia de tests: tipos, cobertura, cómo correrlos
├── decisiones/          # Un ADR por decisión importante
│   ├── 0001-usar-postgresql.md
│   └── 0002-autenticacion-con-jwt.md
└── superpowers/         # Lo crea Superpowers: specs/ y plans/ de cada feature
```

| Archivo | Para qué le sirve a Claude | Cuándo se actualiza |
| --- | --- | --- |
| `vision.md` | Entender el objetivo y no inventar features | Rara vez |
| `arquitectura.md` | Saber dónde va cada cosa | Cuando cambia la estructura |
| `decisiones/NNNN-*.md` | Saber por qué se hizo algo y no deshacerlo | Cada decisión importante |
| `roadmap.md` | Saber qué hito toca y qué es "terminado" | Al cerrar o replanear un hito |
| `progreso.md` | Retomar donde quedó la sesión anterior | Al final de cada sesión o feature |
| `testing.md` | Escribir tests como el proyecto espera | Cuando cambia la estrategia |

**Dos archivos más para que el agente no se pierda** (patrón de Anthropic, usado en el [repo de ejemplo de BettaTech](https://github.com/betta-tech/ejemplo-harness-subagentes)):

- **`feature_list.json`**: todas las features del proyecto, cada una con los pasos para verificarla de punta a punta y un campo `passes` que empieza en `false`. Anthropic usa JSON porque el modelo tiende menos a reescribir o borrar entradas de un JSON que de un markdown. La regla: **el agente solo puede cambiar `passes`**, nunca borrar ni editar features. Esto evita que declare el proyecto terminado antes de tiempo ([Anthropic](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents)).
- **`CHECKPOINTS.md`**: los criterios concretos de "estado final correcto" (qué debe pasar para dar algo por terminado). El revisor compara contra esto, no contra su opinión.

Formato que usa Anthropic:

```json
[
  {
    "category": "auth",
    "description": "El usuario puede recuperar su contraseña por email",
    "steps": [
      "Ir a /login y hacer clic en 'Olvidé mi contraseña'",
      "Escribir un email registrado y enviar",
      "Abrir el enlace recibido y definir una contraseña nueva",
      "Iniciar sesión con la contraseña nueva"
    ],
    "passes": false
  }
]
```

El `roadmap.md` sigue sirviendo para la visión de hitos; `feature_list.json` es el detalle operativo. Pídele a Claude que lo genere a partir de `vision.md` al inicio del proyecto, y revísalo tú: es la definición de lo que vas a construir.

**Los ADR (Architecture Decision Records)** son archivos cortos, uno por decisión, que nunca se borran: si cambias de opinión, escribes uno nuevo que reemplaza al anterior. La plantilla más usada es [MADR](https://github.com/adr/madr) (Markdown Architectural Decision Records); esta es una versión simplificada que basta para empezar:

```markdown
# 0002. Autenticación con JWT
Estado: Aceptada (2026-10-20)

## Contexto
Necesitamos auth para la API móvil, sin sesiones en servidor.

## Decisión
JWT de acceso (15 min) + refresh token en base de datos.

## Alternativas descartadas
- Sesiones con cookies: no sirven bien para la app móvil.
- Auth0: costo y dependencia externa en esta etapa.

## Consecuencias
Hay que implementar rotación y revocación de refresh tokens.
```

**Cómo lo hace Claude por ti**:

1. **Al iniciar el proyecto**, después de `/init`, pídele: *"Crea la carpeta docs/ con vision.md, arquitectura.md, roadmap.md, progreso.md, testing.md y decisiones/. Hazme preguntas sobre el producto para llenarlos, y registra como ADR las decisiones de stack que ya tomamos."*
2. **Conéctalo con CLAUDE.md**, agregando estas reglas (pídele a Claude que las agregue):

```markdown
## Documentación (obligatorio)
- Al iniciar una sesión, lee docs/progreso.md y docs/roadmap.md.
- Antes de proponer cambios de arquitectura, revisa docs/decisiones/.
- Cuando tomemos una decisión técnica importante, crea un ADR nuevo en docs/decisiones/.
- Al terminar una feature, actualiza docs/progreso.md y marca el hito en docs/roadmap.md.
- Sigue docs/testing.md al escribir tests.
```

3. **Automatízalo con una skill** `registrar-decision` que cree el ADR con el número siguiente y el formato de arriba (ver Paso 7). Así basta con decir *"registra esta decisión"*.
4. **Opcional, con un hook `SessionStart`** que imprima las últimas líneas de `docs/progreso.md` y el `git log` reciente, para que cada sesión arranque con contexto sin que lo pidas (ver Paso 5).
5. **Revisa lo que escribe**: Claude redacta, pero tú apruebas las decisiones. Un ADR equivocado se convierte en una regla equivocada.

La memoria automática de Claude Code (`/memory`) complementa esto con aprendizajes personales, pero no la uses para decisiones del proyecto: esas van en `docs/`, versionadas y visibles para todo el equipo.

## Paso 4: permisos (settings.json)

Los permisos deciden qué puede hacer Claude sin preguntarte. Configúralos para que lo rutinario fluya sin interrupciones y lo delicado pida tu aprobación ([docs](https://code.claude.com/docs/en/permissions.md)).

1. **Crea `.claude/settings.json`** en el proyecto y haz commit. Es la configuración compartida.
2. **Define tres listas**. Se evalúan en orden deny → ask → allow, y un deny no se puede abrir con un allow:
   - `allow`: comandos seguros y frecuentes (tests, lint)
   - `ask`: acciones con consecuencias (push, instalar dependencias)
   - `deny`: lo que nunca debe pasar (borrar todo, leer secretos)
3. **Usa `.claude/settings.local.json`** para ajustes personales (no va a git), y `~/.claude/settings.json` para tus preferencias globales.
4. **Activa el sandbox** con `/sandbox` en macOS, Linux o WSL2. Aísla los comandos bash a nivel del sistema operativo. En Linux necesita `bubblewrap` y `socat` ([docs](https://code.claude.com/docs/en/sandboxing.md)).

Ejemplo de `.claude/settings.json` (adapta los comandos a tu stack):

```json
{
  "permissions": {
    "allow": [
      "Bash(npm test *)",
      "Bash(npm run lint *)",
      "Bash(npm run check *)",
      "Bash(git status)",
      "Bash(git diff *)"
    ],
    "ask": [
      "Bash(git push *)",
      "Bash(npm install *)"
    ],
    "deny": [
      "Read(./.env)",
      "Read(./.env.*)",
      "Read(!./.env.example)"
    ]
  }
}
```

La última regla vuelve a permitir `.env.example`, que sí debe poder leerse porque no tiene secretos. En el Paso 5 agregarás los hooks a este mismo archivo.

**Modos de permiso** (cámbialos en la sesión con `Shift+Tab`, o con `defaultMode` en settings). Desde la versión 2.1.283, Claude Code arranca por defecto en modo **auto** ([docs](https://code.claude.com/docs/en/permission-modes.md)):

| Modo | Qué hace | Cuándo usarlo |
| --- | --- | --- |
| `auto` (por defecto) | Un clasificador revisa cada acción y bloquea solo lo riesgoso | El día a día, junto con tus reglas `deny` |
| `default` (manual) | Pregunta antes de editar archivos o correr comandos | Al empezar, para aprender qué hace Claude |
| `acceptEdits` | Edita archivos sin preguntar | Cuando confías en el flujo pero quieres aprobar comandos |
| `plan` | Explora y planea, no edita | Antes de cambios grandes |
| `dontAsk` | Deniega todo lo que no esté en `allow` | Scripts automáticos con `claude -p` |
| `bypassPermissions` | Todo corre sin preguntar | Solo en contenedores o VMs aislados |

Tus reglas `deny` y los hooks siguen aplicando en todos los modos: son tu red de seguridad aunque estés en auto. Usa `/permissions` para revisar y ajustar las reglas desde la sesión.

**Lo que las reglas no protegen** ([docs](https://code.claude.com/docs/en/permissions.md)): una regla de Bash compara el texto del comando, así que no es una barrera de seguridad. `Bash(rm *)` no frena `/bin/rm` ni `bash -c "rm ..."`, y un script como `./init.sh` puede ejecutar por dentro comandos que tus reglas `ask` no ven. Del mismo modo, `Read(./.env)` impide que Claude abra el archivo, pero no que un script de Python o Node lo lea. Para aislar de verdad, usa el **sandbox**: en macOS, Linux y WSL2 restringe qué archivos y qué red pueden tocar los comandos (no aplica a las herramientas de edición de Claude, a los MCP ni a los hooks). En Ubuntu 24.04 o superior puede requerir un ajuste de AppArmor para `bubblewrap` ([docs](https://code.claude.com/docs/en/sandboxing.md)).

## Paso 5: hooks esenciales

Los hooks convierten reglas en garantías: se ejecutan siempre, en momentos fijos, sin depender de que Claude se acuerde. Empieza con tres ([docs](https://code.claude.com/docs/en/hooks-guide.md)).

**Cómo funcionan**: Claude Code le pasa al hook un JSON por la entrada estándar, con datos como `tool_input.command` (para Bash) o `tool_input.file_path` (para Edit y Write). El código de salida decide qué pasa:

- `0`: todo bien, sigue
- `2`: bloquear; el texto que imprimas en stderr le llega a Claude como motivo
- otro: error que no bloquea

**Los tres hooks del día 1**:

| Hook | Evento | Qué hace |
| --- | --- | --- |
| Bloquear comandos peligrosos | `PreToolUse` en `Bash` | Frena `rm -rf` y similares antes de ejecutarse |
| Formatear al editar | `PostToolUse` en `Edit\|Write` | Pasa el formateador por cada archivo que Claude toca |
| Tests antes de terminar | `Stop` | Si los tests fallan, Claude no puede darse por terminado |

1. **Crea la carpeta** `.claude/hooks/`.
2. **Crea el script que bloquea** `.claude/hooks/block-dangerous.sh` y dale permisos con `chmod +x`. Si falta `jq`, bloquea por seguridad en vez de dejar pasar todo:

```bash
#!/bin/bash
command -v jq >/dev/null || { echo "Falta jq: instálalo para usar este hook" >&2; exit 2; }
COMMAND=$(jq -r '.tool_input.command // empty')
if echo "$COMMAND" | grep -Eiq 'rm[[:space:]]+-[a-z]*(rf|fr)|rm[[:space:]]+-r[[:space:]]+-f|push[[:space:]]+(-f|--force)|drop[[:space:]]+(table|database)'; then
  echo "Bloqueado por el hook: comando peligroso. Pide confirmación al usuario." >&2
  exit 2
fi
exit 0
```

3. **Crea el script de tests** `.claude/hooks/tests-before-stop.sh` (también con `chmod +x`). El hook `Stop` corre al final de **cada** respuesta de Claude, incluso cuando solo te contesta una pregunta, así que el script se salta los tests si no hay cambios sin commitear:

```bash
#!/bin/bash
cd "$CLAUDE_PROJECT_DIR" || exit 0
# Sin cambios en el código: no hace falta correr tests
git diff --quiet && git diff --cached --quiet && exit 0
OUT=$(npm test 2>&1) || {
  echo "Los tests fallan. Corrígelos antes de terminar:" >&2
  echo "$OUT" | tail -n 30 >&2
  exit 2
}
exit 0
```

Mientras los tests fallen, Claude no puede terminar y recibe el error para corregirlo. Para evitar un bucle infinito, Claude Code deja pasar el `Stop` si se bloquea 8 veces seguidas sin que Claude haga nada entre medio ([docs](https://code.claude.com/docs/en/hooks-guide)). Usa un comando de tests que no quede en modo vigilancia (por ejemplo `vitest run`, no `vitest`).

4. **Regístralos** en `.claude/settings.json`. Va en el **mismo archivo** que los permisos del Paso 4: `permissions` y `hooks` son claves hermanas. Así queda el archivo completo:

```json
{
  "permissions": {
    "allow": ["Bash(npm test *)", "Bash(npm run lint *)", "Bash(npm run check *)", "Bash(git status)", "Bash(git diff *)"],
    "ask": ["Bash(git push *)", "Bash(npm install *)"],
    "deny": ["Read(./.env)", "Read(./.env.*)", "Read(!./.env.example)"]
  },
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          { "type": "command", "command": "\"$CLAUDE_PROJECT_DIR\"/.claude/hooks/block-dangerous.sh" }
        ]
      }
    ],
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          { "type": "command", "command": "jq -r '.tool_input.file_path' | xargs -I{} npx prettier --write --ignore-unknown \"{}\"" }
        ]
      }
    ],
    "Stop": [
      {
        "hooks": [
          { "type": "command", "command": "\"$CLAUDE_PROJECT_DIR\"/.claude/hooks/tests-before-stop.sh" }
        ]
      }
    ]
  }
}
```

5. **Adapta los comandos a tu stack**. En el hook de formato cambia `npx prettier --write --ignore-unknown` por `npx biome format --write` (Biome) o `ruff format` (Python). En el de tests cambia `npm test` por `pytest` o el comando de tu proyecto.
6. **Comprueba** con `/hooks` que aparecen registrados, y prueba pidiéndole a Claude algo que deba bloquearse.
7. **Haz commit** de `.claude/hooks/` y `settings.json`.

**Importante: el bloqueador es una ayuda, no una garantía**. Buscar texto en un comando siempre tiene huecos (otra forma de escribir lo mismo, un script que lo ejecuta por dentro). La protección real es la combinación de git (todo se puede revertir), el sandbox del Paso 4 y no usar `bypassPermissions` fuera de un contenedor.

**Hooks para después**, cuando los necesites: `Notification` para avisarte cuando Claude espera tu respuesta, `UserPromptSubmit` para validar o enriquecer tus prompts, y `SessionStart` para cargar contexto al iniciar. Lo que imprima un hook `SessionStart` le llega a Claude como contexto; por ejemplo, para que cada sesión arranque sabiendo dónde quedó:

```json
"SessionStart": [
  { "hooks": [ { "type": "command", "command": "cd \"$CLAUDE_PROJECT_DIR\" && tail -n 30 docs/progreso.md && git log --oneline -10" } ] }
]
```

Hay más de 30 eventos en total ([referencia](https://code.claude.com/docs/en/hooks.md)).

**Ejemplos para inspirarte** (léelos, no los instales a ciegas): [claude-code-hooks-mastery](https://github.com/disler/claude-code-hooks-mastery) tiene un ejemplo por cada evento, y [karanb192/claude-code-hooks](https://github.com/karanb192/claude-code-hooks) trae un bloqueador de comandos peligrosos más completo que el de arriba. Puedes pasarle el enlace a Claude y pedirle que adapte uno a tu proyecto.

## Paso 6: plugins y Superpowers

Superpowers es el plugin que le da a Claude el flujo de trabajo: brainstorm, plan, TDD, revisión y cierre. Es el único plugin que instalarías el día 1.

1. **Abre el gestor de plugins** con `/plugin` para ver las pestañas Discover, Installed y Marketplaces. El marketplace oficial (`claude-plugins-official`) se agrega solo la primera vez ([docs](https://code.claude.com/docs/en/discover-plugins.md)).
2. **Instala Superpowers** con una de estas dos opciones, según su [README](https://github.com/obra/superpowers):
   - Marketplace oficial: `/plugin install superpowers@claude-plugins-official`
   - Marketplace del autor: `/plugin marketplace add obra/superpowers-marketplace` y luego `/plugin install superpowers@superpowers-marketplace`
3. **Verifica**: el resumen de la instalación indica si el plugin ya está activo; si no, ejecuta `/reload-plugins`. Superpowers solo trae skills (no comandos): escribe `/superpowers:` y deberías ver la lista, o revisa la pestaña Installed de `/plugin`.
4. **Pruébalo** con una feature pequeña: describe lo que quieres construir y la skill de brainstorming se activará sola.

**Qué trae Superpowers**: skills de brainstorming, escritura y ejecución de planes, TDD estricto, depuración sistemática, revisión de código, desarrollo con subagentes, worktrees y verificación antes de dar algo por terminado. Guarda los diseños y planes como markdown dentro del repo.

**Alcance del plugin**: por defecto se instala solo para ti (`user`). Con `claude plugin install superpowers@claude-plugins-official --scope project` queda activado en `.claude/settings.json` del repo, pero cada persona del equipo igual debe instalarlo una vez en su máquina ([docs](https://code.claude.com/docs/en/discover-plugins.md)).

**Otros plugins**: el marketplace oficial tiene más (por ejemplo, integración con GitHub). Instala uno solo cuando tengas un problema concreto que resuelva. Antes de instalar plugins de terceros, revisa qué hooks y comandos traen, porque ejecutan código en tu máquina.

**Plugin de inteligencia de código**: si usas un lenguaje tipado (TypeScript, Python con tipos, Go, Rust), Anthropic recomienda instalar el plugin de *code intelligence* de tu lenguaje desde `/plugin`. Le da a Claude navegación precisa por símbolos y detección automática de errores después de cada edición ([docs](https://code.claude.com/docs/en/best-practices)).

**¿Y Spec Kit?** Si más adelante trabajas en equipo o quieres especificaciones más formales, puedes agregar [GitHub Spec Kit](https://github.com/github/spec-kit). Al principio, no lo combines con Superpowers.

## Paso 7: skills propias

Una skill es un procedimiento empaquetado que Claude carga cuando lo necesita. Créala cuando te descubras explicándole lo mismo por segunda o tercera vez ([docs](https://code.claude.com/docs/en/skills.md)).

1. **Detecta el procedimiento repetido**: crear un endpoint, una migración de base de datos, preparar un release.
2. **Crea la carpeta** `.claude/skills/<nombre>/` con un archivo `SKILL.md` (o en `~/.claude/skills/` si es para todos tus proyectos).
3. **Escribe la descripción con cuidado**. Claude decide cuándo usar la skill leyendo la descripción, así que debe decir qué hace y cuándo aplica.
4. **Escribe los pasos** en el cuerpo. Puedes agregar scripts o plantillas en la misma carpeta.
5. **Pruébala**: se activa sola cuando la tarea coincide, o a mano con `/<nombre>`.

Ejemplo, `.claude/skills/nuevo-endpoint/SKILL.md`:

```markdown
---
name: nuevo-endpoint
description: Crea un endpoint REST nuevo siguiendo la arquitectura del proyecto. Úsala cuando el usuario pida una ruta o endpoint de API.
---
1. Define el esquema de entrada y salida con zod en src/schemas/.
2. Escribe primero el test de integración en tests/api/.
3. Crea el controlador en src/controllers/ y regístralo en src/routes.ts.
4. Corre npm test y npm run check hasta que estén en verde.
5. Documenta el endpoint en docs/api.md.
```

Notas:

- Si quieres que solo se active a mano, agrega `disable-model-invocation: true` al frontmatter.
- Los antiguos comandos en `.claude/commands/*.md` siguen funcionando, pero para cosas nuevas se recomiendan skills.
- Puedes pedirle a Claude que cree la skill por ti, o usar la skill `writing-skills que tra`e Superpowers.

**Ejemplos para inspirarte**: el repo oficial [anthropics/skills](https://github.com/anthropics/skills) muestra cómo están hechas las skills de Anthropic, y la lista [awesome-claude-code](https://github.com/hesreallyhim/awesome-claude-code) recopila skills de la comunidad. Úsalas como referencia y crea las tuyas para tu proyecto.

## Paso 8: subagentes

Un subagente es un Claude especializado que trabaja en su propio contexto y te devuelve solo el resultado. Sirve para tareas que ensucian el contexto (buscar en muchos archivos) o que necesitan otra mirada (revisar código) ([docs](https://code.claude.com/docs/en/sub-agents.md)).

1. **Usa primero los que ya vienen**: Explore (búsqueda), Plan (diseño) y general-purpose. Superpowers además usa subagentes en su ejecución de planes.
2. **Crea uno propio solo si lo necesitas**, en `.claude/agents/<nombre>.md` (proyecto) o `~/.claude/agents/` (personal). Lo más fácil es pedírselo a Claude.
3. **Limita sus herramientas** con `tools`. Un revisor no necesita editar archivos.
4. **Elige el modelo** con `model`: uno más rápido y barato para búsquedas, uno más capaz para razonar.

Ejemplo, `.claude/agents/code-reviewer.md`:

```markdown
---
name: code-reviewer
description: Revisa los cambios recientes buscando bugs, problemas de seguridad y violaciones de las reglas del CLAUDE.md. Úsalo antes de cada PR.
tools: Read, Glob, Grep, Bash
model: sonnet
---
Eres un revisor de código exigente. Revisa el diff con git diff.
Reporta problemas por severidad (bloqueante, mayor, menor) con archivo y línea.
No edites archivos: solo reporta.
```

Este revisor tiene `Bash` para poder correr `git diff`, pero eso también le permitiría modificar archivos: el "no edites" es una instrucción, no un bloqueo. Si quieres un revisor estrictamente de solo lectura, quita `Bash` de `tools` y pásale tú el diff ([docs](https://code.claude.com/docs/en/sub-agents.md)).

Otros subagentes útiles cuando el proyecto crezca: uno que escriba tests, uno de seguridad y uno que mantenga la documentación al día. Agrégalos de a uno.

**Ejemplos para inspirarte**: [awesome-claude-code-subagents](https://github.com/VoltAgent/awesome-claude-code-subagents) tiene más de 100 subagentes listos (revisor, depurador, escritor de tests). Copia solo el que necesites y ajústalo a tu proyecto.

**Patrón avanzado: líder, implementador y revisor**. Es el que muestra el [repo de BettaTech](https://github.com/betta-tech/ejemplo-harness-subagentes), y es útil cuando el proyecto ya está andando:

| Rol | Qué hace | Qué NO hace |
| --- | --- | --- |
| `leader` | Lee `feature_list.json`, arma el plan y delega | No escribe código |
| `implementer` | Implementa una sola feature y corre los tests | No se aprueba a sí mismo |
| `reviewer` | Compara el trabajo contra `docs/` y `CHECKPOINTS.md` | No edita código |

La clave es que **cada subagente escribe su resultado en un archivo** (por ejemplo `progress/impl_auth-reset.md` y `progress/review_auth-reset.md`) y al líder solo le devuelve la ruta. Así el contexto principal no se llena y no hay "teléfono roto" entre agentes.

Ojo: Superpowers ya hace algo parecido con su ejecución por subagentes. Usa uno de los dos enfoques, no ambos a la vez; empieza con Superpowers y pasa a este patrón solo si necesitas más control.

## Paso 9: MCP servers

MCP conecta a Claude con herramientas externas: GitHub, tu base de datos, documentación, un navegador. Agrega solo los que vayas a usar, porque cada uno suma herramientas al contexto ([docs](https://code.claude.com/docs/en/mcp.md)).

**Primero, los CLI**: instala `gh` (GitHub CLI) e inicia sesión con `gh auth login`. Con eso Claude ya maneja issues, PRs y Actions sin ningún MCP. Haz lo mismo con el CLI de cada servicio que uses.

**Después, solo el MCP que resuelva un problema concreto**. Los más usados por desarrolladores:

| MCP | Agrégalo cuando… | Cómo instalarlo |
| --- | --- | --- |
| [Playwright MCP](https://github.com/microsoft/playwright-mcp) (Microsoft) | Tu proyecto tenga interfaz web y quieras que Claude la pruebe en un navegador real | `claude mcp add playwright -- npx @playwright/mcp@latest` |
| [Context7](https://github.com/upstash/context7) (Upstash) | Claude use APIs viejas de una librería; le da documentación actualizada | `npx ctx7 setup --claude` (te deja elegir modo MCP o CLI + skills; [guía](https://context7.com/docs/resources/all-clients)) |
| [GitHub MCP](https://github.com/github/github-mcp-server) (oficial) | `gh` no te alcance (por ejemplo, revisiones complejas de PRs) | Ver comando abajo ([guía](https://github.com/github/github-mcp-server/blob/main/docs/installation-guides/install-claude.md)) |
| [Supabase](https://supabase.com/docs/guides/getting-started/mcp) o [Neon](https://neon.com/docs/ai/neon-mcp-server) | Uses ese servicio de PostgreSQL y quieras que consulte el esquema real | Según su guía, en modo solo lectura |
| [Chrome DevTools MCP](https://github.com/ChromeDevTools/chrome-devtools-mcp) | Necesites analizar rendimiento, red o consola del navegador | `claude mcp add chrome-devtools -- npx -y chrome-devtools-mcp@latest` |
| [Sentry](https://docs.sentry.io/product/sentry-mcp/) | Ya tengas usuarios y errores en producción | Según su guía |

Comando para GitHub MCP (en tu terminal, no dentro de Claude Code). Ojo: el token queda en el historial de tu terminal y guardado en `~/.claude.json`; usa un token de permisos mínimos:

```bash
claude mcp add --transport http github https://api.githubcopilot.com/mcp/ --header "Authorization: Bearer TU_TOKEN_DE_GITHUB"
```

**Pasos**:

1. **Elige el alcance** con `--scope`: `local` (por defecto, solo tú en este proyecto), `project` (se guarda en `.mcp.json` y va a git) o `user` (tú, en todos tus proyectos).
2. **Nunca escribas tokens en `.mcp.json`**. Si un MCP compartido necesita uno, usa una variable de entorno con la sintaxis `${GITHUB_TOKEN}` dentro del archivo, y que cada persona la defina en su máquina ([docs](https://code.claude.com/docs/en/mcp.md)).
3. **Instálalo una sola vez**: o con `claude mcp add` (local) o en `.mcp.json` (project), no de las dos formas. La primera vez que abras un proyecto con `.mcp.json`, Claude Code te pedirá aprobar esos servidores.
4. **Verifica** con `claude mcp list` o `/mcp` dentro de la sesión.

Ejemplo de `.mcp.json` para compartir Playwright con el equipo (sin secretos):

```json
{
  "mcpServers": {
    "playwright": { "type": "stdio", "command": "npx", "args": ["@playwright/mcp@latest"] }
  }
}
```

Regla práctica: si notas que copias y pegas información de una herramienta en el chat una y otra vez, ese es el MCP que te falta.

**Menos herramientas suele ser mejor**. Vercel quitó casi todas las herramientas especializadas de su agente interno d0 (de unas 17 a 2: ejecutar comandos y ejecutar SQL). El agente pasó a ser 3,5 veces más rápido, usó 37% menos tokens y su tasa de éxito subió de 80% a 100% en sus pruebas ([Vercel](https://vercel.com/blog/we-removed-80-percent-of-our-agents-tools)). Anthropic dice lo mismo para Claude Code: las herramientas de línea de comandos como `gh`, `aws` o `sentry-cli` son la forma más eficiente en contexto de usar servicios externos ([docs](https://code.claude.com/docs/en/best-practices)). Antes de agregar un MCP, instala el CLI del servicio y pregúntate si Claude ya puede hacerlo con la terminal.

## Paso 10: flujo diario por feature

Cada feature sigue el mismo ciclo: diseñar, planear, implementar con tests, verificar, revisar y cerrar. Con Superpowers instalado, gran parte se activa solo; tu trabajo es aprobar en los puntos de control.

1. **Arranca limpio**: rama nueva o worktree (`claude --worktree nombre-feature`), y una sesión nueva de Claude Code (o `/clear`) para no arrastrar contexto viejo.
2. **Brainstorm**: describe la feature o di "hagamos brainstorm de esta feature antes de programar" (también puedes invocar `/superpowers:brainstorming`). Claude te hace preguntas, propone 2 o 3 enfoques y escribe un diseño en `docs/superpowers/specs/`. **Tú lo apruebas o corriges.**
3. **Plan** (`/superpowers:writing-plans`): el diseño se divide en tareas pequeñas, cada una con sus tests. Revísalo; es el punto más barato para corregir el rumbo.
4. **Ejecución**: Superpowers ofrece dos formas. `/superpowers:subagent-driven-development` lanza un subagente nuevo por tarea con revisión entre tareas (recomendado si el plan es largo); `/superpowers:executing-plans` ejecuta todas las tareas en la misma sesión con una revisión al final. En ambas se trabaja con TDD y tus hooks formatean y bloquean lo peligroso mientras tanto.
5. **Verificación**: tests, lint y types en verde. Si hay interfaz, pruébala en el navegador.
6. **Revisión**: pide una revisión del código contra el plan (por ejemplo con `/code-review`), y léelo tú también antes del merge.
7. **Cierre**: Claude actualiza `docs/progreso.md`, marca la feature en `feature_list.json`, registra los ADR de las decisiones tomadas y hace commit con mensaje descriptivo. Luego PR y CI en verde.
8. **Aprende**: si algo salió mal, aplica el ciclo de mejora del Paso 11.

Para tareas pequeñas (un bug, un cambio de texto) no hace falta todo el ciclo. Usa el **plan mode** de Claude Code o pídelo directo, pero siempre con tests.

**Sin Superpowers, el flujo oficial de Anthropic** es: explorar, planear, implementar y hacer commit ([docs](https://code.claude.com/docs/en/best-practices)). Para features grandes, pídele que te entreviste y escriba la spec:

```text
Quiero construir [descripción breve]. Entrevístame en detalle con la herramienta AskUserQuestion.
Pregunta por implementación, UI/UX, casos borde y tradeoffs; no preguntes lo obvio.
Cuando terminemos, escribe la spec completa en SPEC.md.
```

Luego abre una **sesión nueva** para implementarla: así el contexto queda limpio y centrado en el código.

**Cómo hacer que Claude no se detenga hasta que esté bien** (de más suave a más estricto):

- **En el prompt**: "corre los tests y corrige hasta que pasen".
- **Con `/goal`**: defines una condición (por ejemplo, que pasen los tests) y un evaluador aparte la revisa en cada turno hasta que se cumpla. El evaluador no corre comandos por sí mismo: juzga por lo que Claude muestra, así que pide que la condición incluya la salida de los tests.
- **Con el hook `Stop`** del Paso 5: un bloqueo determinista que no lo deja terminar mientras fallen.
- **Con un revisor independiente**: la skill incluida `/code-review` revisa el diff en un subagente con contexto limpio, así quien hizo el trabajo no es quien lo califica.

Pídele siempre **evidencia** en vez de un "listo": la salida de los tests, el comando que corrió o una captura de pantalla.

Comandos útiles durante la sesión:

| Comando | Para qué |
| --- | --- |
| `/context` | Ver qué está ocupando el contexto |
| `/compact` | Resumir la conversación cuando se alarga |
| `/clear` | Empezar de cero entre tareas distintas |
| `Esc` | Detener a Claude en medio de una acción, sin perder el contexto |
| `Esc Esc` o `/rewind` | Volver a un punto anterior (código y conversación). No deshace cambios hechos con comandos de terminal ni la mayoría de ediciones de subagentes: para eso está git |
| `Shift+Tab` | Cambiar de modo: auto → manual → aceptar ediciones → plan |
| `claude --continue` | Retomar la última sesión |

## Paso 11: mantener y mejorar el harness

El harness nunca está terminado: crece con cada error del agente. Cuando algo falla, no lo corrijas solo en esa conversación. Pregúntate qué faltó (una regla, un test, una herramienta, un doc) y agrégalo al repo para que no vuelva a pasar ([OpenAI](https://openai.com/en/index/harness-engineering/)).

**El ciclo de mejora**, de la medida más suave a la más fuerte:

1. **Regla en CLAUDE.md**: el agente olvidó una convención. Sirve como recordatorio, pero puede ignorarse.
2. **Test o regla de linter**: la regla es verificable. Escribe el mensaje de error como una instrucción de cómo arreglarlo, para que el agente sepa qué hacer.
3. **Hook**: la regla debe cumplirse siempre, sin excepción.
4. **Skill o subagente**: el problema es un procedimiento completo que se repite.

**Buenas prácticas de Anthropic y OpenAI**:

- **CLAUDE.md como mapa, no como enciclopedia**: OpenAI recomienda unas 100 líneas que apunten a documentos más detallados en una carpeta `docs/`.
- **Todo lo que el agente necesita va en el repo**: decisiones, specs y planes como markdown versionado. Lo que está en Slack o en tu cabeza, el agente no lo ve.
- **Archivo de progreso para tareas largas**: Anthropic usa una lista de features marcadas como pasando o fallando, más un log de progreso. Cada sesión nueva lee el log y el `git log` para retomar donde quedó ([Anthropic](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents)).
- **Una feature a la vez**, terminando cada sesión con el código funcionando, probado y commiteado.
- **Verificación de punta a punta**: si hay interfaz, que el agente la pruebe en un navegador, no solo con tests unitarios.
- **Limpieza continua**: pídele cada cierto tiempo al agente que busque docs desactualizados, código muerto o deuda técnica, en PRs pequeños.

**Revisión periódica (cada 2 a 4 semanas)**:

- [ ] ¿El CLAUDE.md sigue siendo corto y vigente?
- [ ] ¿Hay skills, subagentes o MCPs que no uso? Quítalos.
- [ ] ¿Qué errores se repitieron? Conviértelos en test, regla o hook.
- [ ] ¿Los hooks siguen siendo rápidos? Uno lento frena cada edición.
- [ ] ¿Revisé el código de plugins y hooks de terceros que actualicé?

**Errores comunes al empezar**:

- Instalar decenas de skills y subagentes el primer día.
- Un CLAUDE.md de 1.000 líneas que nadie mantiene.
- Dar permisos totales (`bypassPermissions`) fuera de un contenedor aislado.
- No tener tests: el agente dice "listo" sin forma de comprobarlo.
- Corregir al agente en el chat una y otra vez en vez de cambiar el harness.

**Patrones de falla que describe Anthropic** ([docs](https://code.claude.com/docs/en/best-practices)):

- **La sesión cajón de sastre**: mezclas tareas sin relación y el contexto se llena de ruido. Solución: `/clear` entre tareas.
- **Corregir una y otra vez**: si ya lo corregiste dos veces sobre lo mismo, el contexto está contaminado. Solución: `/clear` y un prompt mejor que incluya lo aprendido.
- **Confiar sin verificar**: código que parece correcto pero falla en casos borde. Solución: siempre tests, scripts o capturas; si no lo puedes verificar, no lo publiques.
- **Exploración infinita**: pedir "investiga X" sin acotar y Claude lee cientos de archivos. Solución: acota la pregunta o usa un subagente.
- **Revisor que encuentra problemas en todo**: un revisor al que le pides fallas siempre encuentra algunas. Pídele solo lo que afecta la corrección o los requisitos, o terminarás sobre-ingeniando.

**Cada pieza del harness es una suposición sobre lo que el modelo no puede hacer solo**, y esas suposiciones caducan. Anthropic recomienda: empieza con lo más simple, y cuando salga un modelo nuevo, quita las piezas de una en una para ver cuáles siguen aportando ([Anthropic](https://www.anthropic.com/engineering/harness-design-long-running-apps)). También encontró que los agentes sobrevaloran su propio trabajo: un evaluador separado y exigente es de las mejoras más efectivas.

**No confíes ciegamente en los tests que escribe la IA**: pueden probar lo que el código hace en vez de lo que debería hacer. Revisa tú los tests de las funciones críticas y mantén algo de prueba manual ([martinfowler.com](https://martinfowler.com/articles/harness-engineering.html)).

## Qué decirle a Claude en cada paso

Tú instalas Claude Code (Paso 1) y Claude hace el resto contigo. Revisa siempre lo que propone antes de aprobarlo.

| Paso | Prompt sugerido |
| --- | --- |
| 2. Base técnica | "Vamos a crear un proyecto en \[TypeScript con pnpm, Vitest, Biome y Playwright \| Python con uv, pytest, Ruff y Playwright\]. Configura git, .gitignore, framework de tests con un test de ejemplo, linter, formateador, type checker, scripts de una línea para cada uno, un workflow de GitHub Actions que los corra y un init.sh que instale todo y verifique que está en verde." |
| 3. CLAUDE.md | `/init`, y luego: "Ajusta el CLAUDE.md: menos de 200 líneas, comandos exactos, reglas, qué no tocar y definición de terminado." |
| 3b. docs/ | "Crea docs/ con vision, arquitectura, roadmap, progreso, testing y decisiones/. Hazme preguntas para llenarlos, genera feature\_list.json y CHECKPOINTS.md, y registra como ADR las decisiones de stack. Agrega al CLAUDE.md las reglas para mantenerlos." |
| 4. Permisos | "Crea .claude/settings.json con permisos: allow para tests y lint, ask para push e instalar dependencias, deny para leer .env (menos .env.example). Luego ayúdame a activar el sandbox con /sandbox." |
| 5. Hooks | "Crea hooks: PreToolUse que bloquee comandos peligrosos, PostToolUse que formatee al editar y Stop que corra los tests. Explícame cada uno." |
| 6. Superpowers | (Lo instalas tú con `/plugin install superpowers@claude-plugins-official`.) |
| 7. Skills | "Crea una skill registrar-decision que genere un ADR numerado en docs/decisiones/ con el formato del proyecto." |
| 8. Subagentes | "Crea un subagente code-reviewer que revise el diff contra el CLAUDE.md y CHECKPOINTS.md, sin permiso para editar archivos." |
| 9. MCP | "Necesito que pruebes la interfaz en un navegador: agrega Playwright MCP al .mcp.json del proyecto, sin secretos." |
| 10. Feature | "Hagamos brainstorm de \[feature\] antes de programar." |
| 11. Mejora | "Cometiste \[error\] dos veces. Propón cómo evitarlo: regla en CLAUDE.md, test, lint o hook." |

## Checklist final

- [ ] Claude Code instalado, `claude doctor` sin errores
- [ ] Repo con git, tests, linter, formateador, tipos y CI en verde, más un init.sh que lo verifica todo
- [ ] CLAUDE.md corto, con comandos y definición de terminado
- [ ] docs/ con visión, arquitectura, roadmap, progreso, testing y decisiones/, más feature\_list.json y CHECKPOINTS.md
- [ ] Reglas en CLAUDE.md para mantener docs/ al día
- [ ] `.claude/settings.json` con allow, ask y deny
- [ ] Sandbox activado (macOS, Linux o WSL2)
- [ ] Hooks: bloquear peligrosos, formatear, tests antes de terminar
- [ ] Superpowers instalado y probado con una feature pequeña
- [ ] Skill `registrar-decision` (cuando tomes la primera decisión)
- [ ] Subagente revisor (cuando hagas el primer PR)
- [ ] gh instalado y autenticado; MCP solo cuando resuelvan un problema concreto; ningún token en git
- [ ] Revisión del harness agendada cada 2 a 4 semanas

## Fuentes

- [Claude Code: instalación](https://code.claude.com/docs/en/setup.md)
- [Claude Code: memoria y CLAUDE.md](https://code.claude.com/docs/en/memory.md)
- [Claude Code: permisos](https://code.claude.com/docs/en/permissions.md) y [sandbox](https://code.claude.com/docs/en/sandboxing.md)
- [Claude Code: guía de hooks](https://code.claude.com/docs/en/hooks-guide.md) y [referencia](https://code.claude.com/docs/en/hooks.md)
- [Claude Code: skills](https://code.claude.com/docs/en/skills.md)
- [Claude Code: subagentes](https://code.claude.com/docs/en/sub-agents.md)
- [Claude Code: MCP](https://code.claude.com/docs/en/mcp.md)
- [Claude Code: plugins](https://code.claude.com/docs/en/discover-plugins.md)
- [Superpowers (obra)](https://github.com/obra/superpowers)
- [GitHub Spec Kit](https://github.com/github/spec-kit)
- [OpenAI: Harness engineering](https://openai.com/en/index/harness-engineering/)
- [Anthropic: Effective harnesses for long-running agents](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents)

* [BettaTech: ¿Qué es esto del Harness Engineering? (video)](https://www.youtube.com/watch?v=q9Vaoz0hd0U)
* [betta-tech/ejemplo-harness-subagentes (repo de ejemplo)](https://github.com/betta-tech/ejemplo-harness-subagentes)

- [Claude Code: buenas prácticas](https://code.claude.com/docs/en/best-practices)
- [Claude Code: modos de permiso](https://code.claude.com/docs/en/permission-modes.md)
- [Anthropic: Harness design for long-running application development](https://www.anthropic.com/engineering/harness-design-long-running-apps)
- [Birgitta Böckeler: Harness engineering for coding agent users](https://martinfowler.com/articles/harness-engineering.html)
- [Vercel: We removed 80% of our agent's tools](https://vercel.com/blog/we-removed-80-percent-of-our-agents-tools)
