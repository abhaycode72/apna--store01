import { NextResponse } from 'next/server';
import { getInventory, updateInventoryItem, addInventoryItem } from '../../../../src/store/managerData';

export async function GET() {
  const inventory = getInventory();
  return NextResponse.json({ success: true, inventory });
}

export async function PATCH(request) {
  try {
    const { id, updates } = await request.json();
    if (!id) {
      return NextResponse.json({ error: 'Product id is required' }, { status: 400 });
    }
    const updated = updateInventoryItem(id, updates);
    if (!updated) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, item: updated });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    if (!body.name || !body.price) {
      return NextResponse.json({ error: 'Name and price are required' }, { status: 400 });
    }
    const newItem = addInventoryItem(body);
    return NextResponse.json({ success: true, item: newItem }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
