import { NextResponse } from 'next/server';
import { getOrders } from '../../../../src/store/orders';
import { isValidSession } from '../login/route';

export function GET(request) {
  if (!isValidSession(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  return NextResponse.json({ orders: getOrders() });
}