// Tiny .env.local loader for scripts (never prints values).
import { readFileSync, existsSync } from 'node:fs';
export function loadEnv(file = '.env.local') {
  if (!existsSync(file)) return;
  for (const line of readFileSync(file, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
}
export function requireTestKey() {
  const k = process.env.STRIPE_SECRET_KEY || '';
  const live = !k.startsWith('sk_test_') && !k.startsWith('rk_test_');
  if (live && process.env.STRIPE_ALLOW_LIVE !== 'true') { console.error('Refusing: STRIPE_SECRET_KEY is not a TEST key (set STRIPE_ALLOW_LIVE=true only at owner-approved go-live).'); process.exit(1); }
  return k;
}
