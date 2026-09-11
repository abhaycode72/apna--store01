import { NextResponse } from 'next/server';
import { isValidSession } from '../login/route';

export function GET(request) {
  return isValidSession(request) ? NextResponse.json({ authenticated: true }) : NextResponse.json({ authenticated: false }, { status: 401 });
}