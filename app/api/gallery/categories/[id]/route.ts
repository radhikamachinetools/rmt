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
    const { name, headerImage, displayOrder } = await request.json();

    if (!name) return NextResponse.json({ success: false, error: 'Category name is required' }, { status: 400 });

    const { db } = await connectToDatabase();
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const updateData = { name, slug, headerImage: headerImage || '', displayOrder: parseInt(displayOrder) || 0, updatedAt: new Date() };

    const result = await db.collection('rmt_gallery_categories').updateOne(buildFilter(id), { $set: updateData });

    if (result.matchedCount === 0) return NextResponse.json({ success: false, error: 'Category not found' }, { status: 404 });
    return NextResponse.json({ success: true, category: { _id: id, ...updateData } });
  } catch (error) {
    console.error('PUT gallery category error:', error);
    return NextResponse.json({ success: false, error: 'Failed to update category' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { db } = await connectToDatabase();

    const result = await db.collection('rmt_gallery_categories').deleteOne(buildFilter(id));
    if (result.deletedCount === 0) return NextResponse.json({ success: false, error: 'Category not found' }, { status: 404 });

    await db.collection('rmt_gallery_items').deleteMany({ categoryId: id });

    return NextResponse.json({ success: true, message: 'Category deleted successfully' });
  } catch (error) {
    console.error('DELETE gallery category error:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete category' }, { status: 500 });
  }
}
