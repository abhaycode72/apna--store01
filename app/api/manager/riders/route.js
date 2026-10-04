import { NextResponse } from 'next/server';
import { getRiders, updateRider, addRider } from '../../../../src/store/managerData';

export async function GET() {
  const riders = getRiders();
  return NextResponse.json({ success: true, riders });
}

export async function PATCH(request) {
  try {
    const { id, updates } = await request.json();
    if (!id) {
      return NextResponse.json({ error: 'Rider id is required' }, { status: 400 });
    }
    const updated = updateRider(id, updates);
    if (!updated) {
      return NextResponse.json({ error: 'Rider not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, rider: updated });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    if (!body.name || !body.phone) {
      return NextResponse.json({ error: 'Name and phone are required' }, { status: 400 });
    }
    const newRider = addRider(body);
    return NextResponse.json({ success: true, rider: newRider }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
