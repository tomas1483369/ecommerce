<div align="center">

# ECOMMERCE

### Hardware & workspace, ready to ship.

A full-stack ecommerce application for product discovery, checkout, order management, and customer support.

<img width="1916" height="841" alt="Captura de pantalla 2026-10-25 130721" src="https://github.com/user-attachments/assets/f7ce0f11-6239-4f10-9ac8-7aacfaa3f8a7" />

<p>
  <strong>React</strong> · <strong>Vite</strong> · <strong>Express</strong> · <strong>TypeScript</strong> · <strong>PostgreSQL</strong>
</p>

</div>

---

## Overview

Ecommerce is a full-stack online store with a storefront and an Express API. The application includes product browsing, checkout and order flows, an admin area, authentication, and customer support features such as chat and video.

## Features

- **Product catalog** — browse products available in the store.
- **Authentication** — user authentication powered by Clerk.
- **Checkout and orders** — checkout and order-related API flows, with Polar integration configured in the backend.
- **Admin area** — administrative routes and interface.
- **Chat and video support** — Stream Chat and Stream Video integrations.
- **Product media** — ImageKit integration for image delivery.
- **Error monitoring** — optional Sentry integration.
- **Single-container deployment** — Docker builds the Vite frontend and TypeScript API, then runs them together.

## Tech stack

| Area | Technology |
|---|---|
| Frontend | React 19, Vite 8, TypeScript |
| Styling | Tailwind CSS 4, DaisyUI |
| Routing and state | React Router, Zustand, TanStack Query |
| Backend | Node.js 22, Express 5, TypeScript |
| Database | PostgreSQL, `pg`, Drizzle ORM |
| Authentication | Clerk |
| Checkout | Polar |
| Chat and video | Stream Chat, Stream Video |
| Image hosting | ImageKit |
| Monitoring | Sentry |
| Validation | Zod |
| Deployment | Docker |

## Repository structure

```text
ecommerce/
├── backend/
│   ├── src/
│   │   ├── lib/             # Environment validation and shared utilities
│   │   ├── middleware/      # Express middleware
│   │   ├── routes/          # API route handlers
│   │   ├── webhooks/        # Clerk and Polar webhook handlers
│   │   └── index.ts         # Express application entry point
│   ├── scripts/             # Maintenance and seed scripts
│   ├── .env.example         # Backend environment variable template
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/                 # React application source
│   ├── public/               # Static public assets, if present
│   └── package.json
├── assets/
│   └── store-preview.png    # README storefront screenshot
├── .dockerignore
├── .gitignore
├── Dockerfile
└── README.md
```

> This is a high-level map of the main areas. Consult the folders in the repository for the complete, current file tree.

## Requirements

- Node.js 22 recommended (the Dockerfile uses Node.js 22).
- npm.
- A PostgreSQL database.
- Accounts/credentials for the integrations you intend to enable: Clerk, Stream, ImageKit, and Polar.
- Docker is optional for containerized deployment.

## Environment variables

The backend validates its configuration at startup. Create `backend/.env` based on `backend/.env.example` and provide real values.

```env
PORT=3001
NODE_ENV=development

DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/DATABASE?sslmode=require

CLERK_PUBLISHABLE_KEY=pk_test_REPLACE_ME
CLERK_SECRET_KEY=sk_test_REPLACE_ME
CLERK_WEBHOOK_SECRET=

FRONTEND_URL=http://localhost:5173

POLAR_ACCESS_TOKEN=
POLAR_WEBHOOK_SECRET=
POLAR_API_BASE=https://api.polar.sh
POLAR_CHECKOUT_PRODUCT_ID=00000000-0000-0000-0000-000000000000

STREAM_API_KEY=REPLACE_ME
STREAM_API_SECRET=REPLACE_ME

IMAGEKIT_PUBLIC_KEY=public_REPLACE_ME
IMAGEKIT_PRIVATE_KEY=private_REPLACE_ME
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/YOUR_IMAGEKIT_ID

SENTRY_DSN=
```

### Variable reference

| Variable | Purpose | Required? |
|---|---|---|
| `PORT` | API listening port; defaults to `3001` | No |
| `NODE_ENV` | Runtime mode: `development`, `production`, or `test` | No |
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `CLERK_PUBLISHABLE_KEY` | Clerk public application key used by the backend | Yes |
| `CLERK_SECRET_KEY` | Clerk server-side secret key | Yes |
| `CLERK_WEBHOOK_SECRET` | Validates Clerk webhook events | Optional in schema; needed for webhook verification |
| `FRONTEND_URL` | Frontend URL used by server-side flows | Yes |
| `POLAR_ACCESS_TOKEN` | Polar API access token | Optional in schema; required for Polar API operations |
| `POLAR_WEBHOOK_SECRET` | Validates Polar webhook events | Optional in schema; required to verify webhooks |
| `POLAR_API_BASE` | Polar API base URL; defaults to `https://api.polar.sh` | No |
| `POLAR_CHECKOUT_PRODUCT_ID` | UUID of the Polar product used by checkout | Yes |
| `STREAM_API_KEY` | Stream project key | Yes |
| `STREAM_API_SECRET` | Stream server-side secret | Yes |
| `IMAGEKIT_PUBLIC_KEY` | ImageKit public key | Yes |
| `IMAGEKIT_PRIVATE_KEY` | ImageKit private key | Yes |
| `IMAGEKIT_URL_ENDPOINT` | ImageKit URL endpoint | Yes |
| `SENTRY_DSN` | Sentry error-monitoring DSN | Optional |

### Frontend environment

The Dockerfile accepts `VITE_CLERK_PUBLISHABLE_KEY` as a build argument and sets `VITE_API_URL` to an empty value by default so the browser can call `/api` on the same origin.

For local development, inspect the frontend's environment access and Vite configuration to confirm the exact variable names used by the current checkout. Vite exposes variables prefixed with `VITE_` to browser code, so **never place private keys or secrets in frontend environment variables**.

## Installation and local development

### 1. Clone the repository

```bash
git clone https://github.com/tomas1483369/ecommerce.git
cd ecommerce
```

### 2. Configure the backend

```bash
cd backend
npm install
```

Create `backend/.env` by copying the example file:

**macOS/Linux**
```bash
cp .env.example .env
```

**Windows PowerShell**
```powershell
Copy-Item .env.example .env
```

Edit `backend/.env` and set the actual PostgreSQL connection string and credentials for the services you use.

### 3. Start the API

From `backend/`:

```bash
npm run dev
```

The API defaults to port `3001`. Its health check is available at `/health` once the server is running.

### 4. Start the frontend

Open a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Vite prints the local frontend URL in the terminal (commonly `http://localhost:5173`). Configure the frontend's API URL and Clerk publishable key according to the frontend configuration.

### Useful scripts

**Backend** (`backend/`):

| Command | Description |
|---|---|
| `npm run dev` | Run the API in watch mode |
| `npm run build` | Compile TypeScript |
| `npm start` | Start the compiled API |
| `npm run db:push` | Apply the Drizzle schema to the configured database |
| `npm run db:seed` | Run the seed script |
| `npm run format` | Format backend files |
| `npm run format:check` | Check formatting |

**Frontend** (`frontend/`):

| Command | Description |
|---|---|
| `npm run dev` | Start Vite development server |
| `npm run build` | Build the production frontend |
| `npm run preview` | Preview the production build |
| `npm run lint` | Run ESLint |
| `npm run format` | Format frontend files |
| `npm run format:check` | Check formatting |

## Docker deployment

The root `Dockerfile` uses a multi-stage build to compile the frontend and backend and package them into one runtime image. The final container runs the compiled API, which also serves the built frontend assets.

Build the image from the repository root:

```bash
docker build -t ecommerce .
```

Run it with a backend environment file:

```bash
docker run --rm -p 3001:3001 --env-file backend/.env ecommerce
```

To supply the Clerk publishable key during the frontend build, pass the build argument supported by the Dockerfile:

```bash
docker build \
  --build-arg VITE_CLERK_PUBLISHABLE_KEY=pk_test_REPLACE_ME \
  -t ecommerce .
```

The app listens on port `3001` inside the container. Configure your deployment platform to expose that port and provide the backend environment variables as secrets. Do not bake private credentials into the image.

## API overview

The API entry point mounts these route groups:

| Path | Purpose |
|---|---|
| `/health` | Health check |
| `/api/me` | Current-user endpoints |
| `/api/products` | Product endpoints |
| `/api/stream` | Stream integration endpoints |
| `/api/checkout` | Checkout endpoints |
| `/api/admin` | Administrative endpoints |
| `/api/orders` | Order endpoints |
| `/webhooks/clerk` | Clerk webhook receiver |
| `/webhooks/polar` | Polar webhook receiver |

Exact operations and request formats are defined by the route handlers in `backend/src/routes/` and webhook handlers in `backend/src/webhooks/`.

## Security notes

- Never commit `backend/.env`, database passwords, API secrets, webhook secrets, or production credentials.
- Use only public/publishable keys in frontend code. Values prefixed with `VITE_` are bundled into client-side assets and must not contain secrets.
- Configure webhook endpoints and secrets in the relevant service dashboards.
- Use separate credentials for development and production.

## Screenshot

The storefront screenshot shown above is stored at `assets/store-preview.png`. Keep this relative path unchanged, or update the image path in this README if you move the file.

## License

The backend package currently declares the ISC license. Confirm the intended license for the entire repository and add a root `LICENSE` file if you want to distribute the project under explicit terms.
