import { NextResponse } from 'next/server';
import { getStoreStatus, updateStoreStatus } from '../../../../src/store/managerData';

export async function GET() {
  const status = getStoreStatus();
  return NextResponse.json({ success: true, storeStatus: status });
}

export async function PATCH(request) {
  try {
    const updates = await request.json();
    const updated = updateStoreStatus(updates);
    return NextResponse.json({ success: true, storeStatus: updated });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
