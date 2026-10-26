import { afterEach, describe, expect, it } from 'vitest';
import { loadEnv } from './env';

const base = {
  DATABASE_URL: 'postgresql://u:p@localhost:5432/db',
  CLERK_PUBLISHABLE_KEY: 'pk_test',
  CLERK_SECRET_KEY: 'sk_test',
  FRONTEND_URL: 'http://localhost:5173',
  POLAR_CHECKOUT_PRODUCT_ID: '00000000-0000-0000-0000-000000000000',
  IMAGEKIT_PUBLIC_KEY: 'pub',
  IMAGEKIT_PRIVATE_KEY: 'priv',
  IMAGEKIT_URL_ENDPOINT: 'https://ik.imagekit.io/x',
};

const original = { ...process.env };

afterEach(() => {
  process.env = { ...original };
});

describe('loadEnv', () => {
  it('treats an empty optional SENTRY_DSN as unset', () => {
    process.env = { ...base, SENTRY_DSN: '' };
    expect(loadEnv().SENTRY_DSN).toBeUndefined();
  });

  it('still rejects a malformed SENTRY_DSN', () => {
    process.env = { ...base, SENTRY_DSN: 'not-a-url' };
    expect(() => loadEnv()).toThrow('Invalid environment variables');
  });
});
