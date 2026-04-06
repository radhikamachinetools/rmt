import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '../../../lib/db';
import { ObjectId } from 'mongodb';

function buildFilter(id: string) {
  try {
    return { $or: [{ _id: new ObjectId(id) }, { _id: id }] };
  } catch {
    return { _id: id as any };
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { title, description, url, resource_type, isActive, activeFrom, activeTo } = await request.json();
    const { db } = await connectToDatabase();

    const result = await db.collection('rmt_media').updateOne(
      buildFilter(id),
      { $set: { title, description, url, resource_type, isActive, activeFrom, activeTo, updatedAt: new Date() } }
    );

    if (result.matchedCount === 0) return NextResponse.json({ success: false, error: 'Media not found' }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('PUT media error:', error);
    return NextResponse.json({ success: false, error: 'Failed to update media' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { db } = await connectToDatabase();

    const result = await db.collection('rmt_media').deleteOne(buildFilter(id));
    if (result.deletedCount === 0) return NextResponse.json({ success: false, error: 'Media not found' }, { status: 404 });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE media error:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete media' }, { status: 500 });
  }
}
