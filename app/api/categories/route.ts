import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '../../lib/db';
import { getAdminSession } from '../../lib/admin-session';
import { normalizeMongoDocuments } from '../../lib/mongo-utils';

export async function GET() {
  try {
    console.log('GET /api/categories - Starting fetch');
    
    const { db } = await connectToDatabase();
    console.log('Connected to MongoDB');
    
    const categories = await db.collection('rmt_categories')
      .find({})
      .sort({ displayOrder: 1 })
      .toArray();
      
    console.log('MongoDB categories found:', categories.length);
    
    return NextResponse.json({ success: true, categories: normalizeMongoDocuments(categories) });
  } catch (error) {
    console.error('GET categories error:', error);
    return NextResponse.json({ success: false, categories: [], error: error.message });
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!(await getAdminSession())) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const newCategory = await request.json();
    console.log('POST /api/categories - Creating category:', newCategory);
    
    // Generate slug from name
    const slug = newCategory.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    
    const { db } = await connectToDatabase();
    console.log('Connected to MongoDB for POST');
    
    const categoryData = {
      name: newCategory.name,
      slug,
      status: newCategory.status || 'active',
      displayOrder: parseInt(newCategory.displayOrder) || 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const result = await db.collection('rmt_categories').insertOne(categoryData);
    console.log('MongoDB insert result:', result.insertedId);
    
    // Return the created category with the MongoDB _id
    const createdCategory = { ...categoryData, _id: result.insertedId.toString(), id: result.insertedId.toString() };
    return NextResponse.json({ success: true, category: createdCategory });
  } catch (error) {
    console.error('POST categories error:', error);
    return NextResponse.json({ success: false, error: 'Failed to create category' }, { status: 500 });
  }
}