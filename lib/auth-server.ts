import { NextRequest } from 'next/server';
import { db } from './db';
import { UserSession } from './types';

export const SESSION_COOKIE_NAME = 'iiser_session_token';

/**
 * Extracts and verifies the current session from request cookies.
 */
export function getCurrentSession(req: NextRequest): UserSession | null {
  const token = req.cookies.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;

  const session = db.getSession(token);
  if (!session) return null;

  return session;
}

/**
 * Enforces admin authorization. Returns the admin session if valid, or null.
 */
export function requireAdminSession(req: NextRequest): UserSession | null {
  const session = getCurrentSession(req);
  if (!session || session.role !== 'admin') {
    return null;
  }
  return session;
}
