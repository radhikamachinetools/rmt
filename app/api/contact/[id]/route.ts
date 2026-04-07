import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '../../../lib/db';
import { getAdminSession } from '../../../lib/admin-session';
import { buildIdFilter } from '../../../lib/mongo-utils';

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    if (!(await getAdminSession())) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const { status } = await request.json();
    const { db } = await connectToDatabase();

    const result = await db.collection('rmt_contacts').updateOne(buildIdFilter(id), { $set: { status, updatedAt: new Date() } });

    if (result.matchedCount === 0) return NextResponse.json({ success: false, error: 'Contact not found' }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('PATCH contact error:', error);
    return NextResponse.json({ success: false, error: 'Failed to update status' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    if (!(await getAdminSession())) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const { db } = await connectToDatabase();

    const result = await db.collection('rmt_contacts').deleteOne(buildIdFilter(id));
    if (result.deletedCount === 0) return NextResponse.json({ success: false, error: 'Contact not found' }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE contact error:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete contact' }, { status: 500 });
  }
}
