import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '../../../../lib/db';
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
    const { categoryId, itemType, type, url, title, displayOrder } = await request.json();
    const itemTypeValue = itemType || type;

    if (!categoryId || !itemTypeValue || !url) {
      return NextResponse.json({ success: false, error: 'Category, type, and URL are required' }, { status: 400 });
    }

    const { db } = await connectToDatabase();
    const updateData = { categoryId, type: itemTypeValue, url, title: title || '', displayOrder: parseInt(displayOrder) || 0, updatedAt: new Date() };

    const result = await db.collection('rmt_gallery_items').updateOne(buildFilter(id), { $set: updateData });

    if (result.matchedCount === 0) return NextResponse.json({ success: false, error: 'Item not found' }, { status: 404 });
    return NextResponse.json({ success: true, item: { _id: id, ...updateData } });
  } catch (error) {
    console.error('PUT gallery item error:', error);
    return NextResponse.json({ success: false, error: 'Failed to update item' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { db } = await connectToDatabase();

    const result = await db.collection('rmt_gallery_items').deleteOne(buildFilter(id));
    if (result.deletedCount === 0) return NextResponse.json({ success: false, error: 'Item not found' }, { status: 404 });
    return NextResponse.json({ success: true, message: 'Item deleted successfully' });
  } catch (error) {
    console.error('DELETE gallery item error:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete item' }, { status: 500 });
  }
}
