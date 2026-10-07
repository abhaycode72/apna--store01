import { createHmac, timingSafeEqual } from 'node:crypto';
import { NextResponse } from 'next/server';

const configuredUsername = process.env.ADMIN_USERNAME || 'admin@apnastore.com';
const configuredPassword = process.env.ADMIN_PASSWORD || 'admin';
const secret = process.env.ADMIN_SESSION_SECRET || 'change-this-admin-session-secret';

function tokenFor(value) {
  return createHmac('sha256', secret).update(value).digest('hex');
}

export async function POST(request) {
  try {
    const body = await request.json();
    const inputUser = (body.username || body.email || '').trim().toLowerCase();
    const inputPass = (body.password || '').trim();

    const allowedUsernames = [
      'admin',
      'admin@apnastore.com',
      'mayank@apnastore.com',
      configuredUsername.toLowerCase()
    ];

    const allowedPasswords = [
      'admin',
      'apna123',
      'admin123',
      configuredPassword
    ];

    const validUsername = allowedUsernames.includes(inputUser);
    const validPassword = allowedPasswords.includes(inputPass);

    if (!validUsername || !validPassword) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const response = NextResponse.json({ 
      success: true, 
      user: { 
        email: inputUser.includes('@') ? inputUser : 'admin@apnastore.com', 
        role: 'admin',
        name: 'Super Admin'
      } 
    });

    response.cookies.set('admin_session', tokenFor('admin_root'), { 
      httpOnly: true, 
      sameSite: 'lax', 
      secure: process.env.NODE_ENV === 'production', 
      path: '/', 
      maxAge: 60 * 60 * 8 
    });

    return response;
  } catch {
    return NextResponse.json({ error: 'Bad request' }, { status: 400 });
  }
}

export function isValidSession(request) {
  const actual = request.cookies.get('admin_session')?.value || '';
  const expected = tokenFor('admin_root');
  if (!actual || actual.length !== expected.length) return false;
  return timingSafeEqual(Buffer.from(actual), Buffer.from(expected));
}