import { createHmac, timingSafeEqual } from 'node:crypto';
import { NextResponse } from 'next/server';

const username = process.env.ADMIN_USERNAME || 'admin';
const password = process.env.ADMIN_PASSWORD || 'apna123';
const secret = process.env.ADMIN_SESSION_SECRET || 'change-this-admin-session-secret';

function tokenFor(value) {
  return createHmac('sha256', secret).update(value).digest('hex');
}

export async function POST(request) {
  const body = await request.json();
  const validUsername = body.username === username;
  const validPassword = body.password === password;
  if (!validUsername || !validPassword) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });

  const response = NextResponse.json({ success: true });
  response.cookies.set('admin_session', tokenFor(username), { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', path: '/', maxAge: 60 * 60 * 8 });
  return response;
}

export function isValidSession(request) {
  const actual = request.cookies.get('admin_session')?.value || '';
  const expected = tokenFor(username);
  return actual.length === expected.length && timingSafeEqual(Buffer.from(actual), Buffer.from(expected));
}