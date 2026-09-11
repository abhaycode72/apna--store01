import { NextResponse } from 'next/server';
import { addOrder } from '../../../../src/store/orders';

export async function POST(request) {
  const { customer, items, paymentMethod, total } = await request.json();
  const requiredCustomerFields = ['name', 'mobile', 'email', 'address', 'location'];

  if (!customer || requiredCustomerFields.some((field) => !String(customer[field] || '').trim())) {
    return NextResponse.json({ error: 'Complete customer and delivery details are required.' }, { status: 400 });
  }
  if (!/^[0-9]{10}$/.test(customer.mobile)) return NextResponse.json({ error: 'Enter a valid 10-digit mobile number.' }, { status: 400 });
  if (!Array.isArray(items) || items.length === 0) return NextResponse.json({ error: 'Your cart is empty.' }, { status: 400 });
  if (paymentMethod === 'cod' && Number(total) > 1000) return NextResponse.json({ error: 'Cash on Delivery is unavailable above ₹1,000.' }, { status: 400 });

  const order = {
    id: `ORD-${Date.now().toString().slice(-8)}`,
    customer,
    items,
    paymentMethod,
    paymentStatus: paymentMethod === 'cod' ? 'PENDING_COLLECTION' : 'PAID',
    total: Number(total),
    status: 'ORDER_PLACED',
    createdAt: new Date().toISOString(),
  };

  addOrder(order);

  return NextResponse.json({ success: true, order }, { status: 201 });
}