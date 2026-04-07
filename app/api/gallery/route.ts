import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '../../lib/db';
import { getAdminSession } from '../../lib/admin-session';
import { normalizeMongoDocuments } from '../../lib/mongo-utils';

export async function GET() {
  try {
    const { db } = await connectToDatabase();

    const [categories, items] = await Promise.all([
      db.collection('rmt_gallery_categories').find({}).sort({ displayOrder: 1 }).toArray(),
      db.collection('rmt_gallery_items').find({}).sort({ displayOrder: 1 }).toArray(),
    ]);

    return NextResponse.json({ success: true, categories: normalizeMongoDocuments(categories), items: normalizeMongoDocuments(items) });
  } catch (error) {
    console.error('GET gallery error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch gallery' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!(await getAdminSession())) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { type, ...itemData } = body;
    const { db } = await connectToDatabase();

    if (type === 'category') {
      const { name, headerImage = '', displayOrder = 0 } = itemData;
      if (!name) return NextResponse.json({ success: false, error: 'Category name is required' }, { status: 400 });

      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const newCategory = { name, slug, headerImage, displayOrder: parseInt(displayOrder) || 0, createdAt: new Date() };

      const result = await db.collection('rmt_gallery_categories').insertOne(newCategory);
      return NextResponse.json({ success: true, category: { ...newCategory, _id: result.insertedId.toString(), id: result.insertedId.toString() } });
    }

    if (type === 'item') {
      const { categoryId, itemType, url, title = '', displayOrder = 0 } = itemData;
      if (!categoryId || !itemType || !url) {
        return NextResponse.json({ success: false, error: 'Category, type, and URL are required' }, { status: 400 });
      }

      const newItem = { categoryId, type: itemType, url, title, displayOrder: parseInt(displayOrder) || 0, createdAt: new Date() };
      const result = await db.collection('rmt_gallery_items').insertOne(newItem);
      return NextResponse.json({ success: true, item: { ...newItem, _id: result.insertedId.toString(), id: result.insertedId.toString() } });
    }

    return NextResponse.json({ success: false, error: 'Invalid type' }, { status: 400 });
  } catch (error) {
    console.error('POST gallery error:', error);
    return NextResponse.json({ success: false, error: 'Failed to create gallery item' }, { status: 500 });
  }
}
