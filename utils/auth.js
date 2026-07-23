import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { query } from './db';

const TOKEN_NAME = 'rangsit_token';

export function signToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return null;
  }
}

export async function setAuthCookie(token) {
  const cookieStore = await cookies();
  cookieStore.set(TOKEN_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 7
  });
}

export async function clearAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.set(TOKEN_NAME, '', { path: '/', maxAge: 0 });
}

export async function getTokenFromCookies() {
  const cookieStore = await cookies();
  return cookieStore.get(TOKEN_NAME)?.value || null;
}

export async function getUserFromRequest() {
  const token = await getTokenFromCookies();
  if (!token) return null;
  const decoded = verifyToken(token);
  if (!decoded?.id) return null;
  const users = await query(
    `SELECT id, email, first_name, last_name, username, birthday, bio, avatar, profile_completed, created_at
     FROM users WHERE id = ?`,
    [decoded.id]
  );
  return users[0] || null;
}
