# Monolith: Vite frontend + Express API. Build from repo root 

# --- Stage 1: build the SPA (Vite) ---
# Produces static HTML/JS/CSS under dist/ — copied into the final image as ./public.
FROM node:22-bookworm-slim AS frontend-build
WORKDIR /app/frontend
COPY frontend/ ./
# Empty = browser calls /api on the same host as the page (same domain as Express).
ENV VITE_API_URL=
# Public values only (they end up embedded in the client JS). Never pass secrets here.
# Build args are visible as env vars to the RUN below, which is where Vite reads them.
ARG VITE_CLERK_PUBLISHABLE_KEY
ARG VITE_IMAGEKIT_URL_ENDPOINT
ARG VITE_SENTRY_DSN
ARG VITE_WHATSAPP_NUMBER
ARG VITE_INSTAGRAM_URL
ARG VITE_FACEBOOK_URL
ARG VITE_TIKTOK_URL
RUN npm install --no-audit --no-fund \
  && npm run build

  # --- Stage 2: compile the API (TypeScript → JavaScript) ---
# Produces dist/ with index.js and the rest of the server bundle.
FROM node:22-bookworm-slim AS backend-build
WORKDIR /app
COPY backend/ ./
RUN npm install --no-audit --no-fund \
  && npm run build

# --- Stage 3: runtime image (only prod deps + built assets) ---
# Express serves API routes and static files from public/ (the Vite build from stage 1).
FROM node:22-bookworm-slim AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY backend/package.json backend/package-lock.json ./
RUN npm install --omit=dev --no-audit --no-fund && npm cache clean --force

COPY --from=backend-build /app/dist ./dist
COPY --from=frontend-build /app/frontend/dist ./public

EXPOSE 3001
USER node

CMD ["node", "--import", "./dist/instrument.js", "dist/index.js"]