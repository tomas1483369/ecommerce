import 'dotenv/config';
import * as Sentry from '@sentry/node';

const dsn = process.env.SENTRY_DSN;
const isProduction = process.env.NODE_ENV === 'production';

// Sentry is optional: without SENTRY_DSN nothing is sent.
// Low trace sampling in production keeps us inside the free quota.
if (dsn) {
  Sentry.init({
    dsn,
    environment: process.env.NODE_ENV ?? 'development',
    enableLogs: true,
    tracesSampleRate: isProduction ? 0.1 : 1.0,
    sendDefaultPii: false,
  });
}
