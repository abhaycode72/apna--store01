import { NextResponse } from 'next/server';
import { getOrders, updateOrder } from '../../../../src/store/orders';
import { isValidSession } from '../login/route';

export function GET(request) {
  if (!isValidSession(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  return NextResponse.json({ orders: getOrders() });
}

export async function PATCH(request) {
  if (!isValidSession(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { orderId, status, paymentStatus, customer } = await request.json();
  const order = updateOrder(orderId, { status, paymentStatus, customer });
  return order ? NextResponse.json({ success: true, order }) : NextResponse.json({ error: 'Order not found' }, { status: 404 });
}