import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '../../../lib/db';
import { getAdminSession } from '../../../lib/admin-session';
import { buildIdFilter, normalizeMongoDocument } from '../../../lib/mongo-utils';

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    if (!(await getAdminSession())) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const { title, description, url, resource_type, isActive, activeFrom, activeTo } = await request.json();
    const { db } = await connectToDatabase();

    const result = await db.collection('rmt_media').updateOne(
      buildIdFilter(id),
      { $set: { title, description, url, resource_type, isActive, activeFrom, activeTo, updatedAt: new Date() } }
    );

    if (result.matchedCount === 0) return NextResponse.json({ success: false, error: 'Media not found' }, { status: 404 });
    return NextResponse.json({ success: true, media: normalizeMongoDocument({ _id: id, title, description, url, resource_type, isActive, activeFrom, activeTo }) });
  } catch (error) {
    console.error('PUT media error:', error);
    return NextResponse.json({ success: false, error: 'Failed to update media' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    if (!(await getAdminSession())) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const { db } = await connectToDatabase();

    const result = await db.collection('rmt_media').deleteOne(buildIdFilter(id));
    if (result.deletedCount === 0) return NextResponse.json({ success: false, error: 'Media not found' }, { status: 404 });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE media error:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete media' }, { status: 500 });
  }
}
