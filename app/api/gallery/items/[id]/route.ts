import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '../../../../lib/db';
import { getAdminSession } from '../../../../lib/admin-session';
import { buildIdFilter, normalizeMongoDocument } from '../../../../lib/mongo-utils';

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    if (!(await getAdminSession())) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const { categoryId, itemType, type, url, title, displayOrder } = await request.json();
    const itemTypeValue = itemType || type;

    if (!categoryId || !itemTypeValue || !url) {
      return NextResponse.json({ success: false, error: 'Category, type, and URL are required' }, { status: 400 });
    }

    const { db } = await connectToDatabase();
    const updateData = { categoryId, type: itemTypeValue, url, title: title || '', displayOrder: parseInt(displayOrder) || 0, updatedAt: new Date() };

    const result = await db.collection('rmt_gallery_items').updateOne(buildIdFilter(id), { $set: updateData });

    if (result.matchedCount === 0) return NextResponse.json({ success: false, error: 'Item not found' }, { status: 404 });
    return NextResponse.json({ success: true, item: normalizeMongoDocument({ _id: id, ...updateData }) });
  } catch (error) {
    console.error('PUT gallery item error:', error);
    return NextResponse.json({ success: false, error: 'Failed to update item' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    if (!(await getAdminSession())) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const { db } = await connectToDatabase();

    const result = await db.collection('rmt_gallery_items').deleteOne(buildIdFilter(id));
    if (result.deletedCount === 0) return NextResponse.json({ success: false, error: 'Item not found' }, { status: 404 });
    return NextResponse.json({ success: true, message: 'Item deleted successfully' });
  } catch (error) {
    console.error('DELETE gallery item error:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete item' }, { status: 500 });
  }
}
