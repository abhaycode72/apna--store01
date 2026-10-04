import { NextResponse } from 'next/server';
import { getOrders, updateOrder, addOrder, deleteOrder } from '../../../../src/store/orders';

export async function GET() {
  const orders = getOrders();
  return NextResponse.json({ success: true, orders });
}

export async function PATCH(request) {
  try {
    const { orderId, updates } = await request.json();
    if (!orderId) {
      return NextResponse.json({ error: 'orderId is required' }, { status: 400 });
    }
    const updated = updateOrder(orderId, updates);
    if (!updated) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, order: updated });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const order = {
      id: `ORD-${Date.now().toString().slice(-6)}`,
      customer: body.customer || {
        name: 'Walk-in Customer',
        mobile: '9999999999',
        address: 'Direct Store Pickup',
        location: 'Patna Central Hub',
      },
      items: body.items || [],
      paymentMethod: body.paymentMethod || 'cash',
      paymentStatus: body.paymentStatus || 'PAID',
      total: Number(body.total) || 0,
      status: body.status || 'ORDER_PLACED',
      createdAt: new Date().toISOString(),
      assignedRider: body.assignedRider || null,
      notes: body.notes || 'Created manually by Store Manager',
      preparationTimeEstimate: '5 mins',
    };
    addOrder(order);
    return NextResponse.json({ success: true, order }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('id');
    if (!orderId) return NextResponse.json({ error: 'id param required' }, { status: 400 });
    const deleted = deleteOrder(orderId);
    return NextResponse.json({ success: deleted });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
