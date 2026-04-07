import { cookies } from 'next/headers';
import crypto from 'crypto';

const SESSION_COOKIE_NAME = 'admin-session';
const SESSION_TTL_SECONDS = 60 * 60 * 24;

function getSessionSecret() {
  return process.env.ADMIN_AUTH_SECRET || 'rmt-admin-local-secret';
}

function sign(payload: string) {
  return crypto.createHmac('sha256', getSessionSecret()).update(payload).digest('hex');
}

export function createAdminSession(username: string) {
  const expiresAt = Date.now() + SESSION_TTL_SECONDS * 1000;
  const payload = JSON.stringify({ username, expiresAt });
  const signature = sign(payload);
  return Buffer.from(`${payload}.${signature}`).toString('base64url');
}

export function verifyAdminSession(token: string | undefined | null) {
  if (!token) return false;

  try {
    const decoded = Buffer.from(token, 'base64url').toString('utf8');
    const separatorIndex = decoded.lastIndexOf('.');
    if (separatorIndex === -1) return false;

    const payload = decoded.slice(0, separatorIndex);
    const signature = decoded.slice(separatorIndex + 1);

    if (sign(payload) !== signature) return false;

    const parsed = JSON.parse(payload) as { username?: string; expiresAt?: number };
    return Boolean(parsed.username && parsed.expiresAt && parsed.expiresAt > Date.now());
  } catch {
    return false;
  }
}

export async function getAdminSession() {
  const cookieStore = await cookies();
  return verifyAdminSession(cookieStore.get(SESSION_COOKIE_NAME)?.value);
}