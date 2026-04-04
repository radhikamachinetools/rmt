import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '../../../lib/db';
import { ObjectId } from 'mongodb';

type Category = {
  _id: string;
  name: string;
  slug: string;
  status: string;
  displayOrder: number;
};

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, status, displayOrder } = body;

    if (!name) {
      return NextResponse.json({ success: false, error: 'Category name is required' }, { status: 400 });
    }

    // Generate slug from name
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const { db } = await connectToDatabase();
    console.log('PUT - Updating category in MongoDB:', id);
    
    const updateData = {
      name,
      slug,
      status,
      displayOrder: parseInt(displayOrder) || 0,
      updatedAt: new Date()
    };
    
    // Try to update with ObjectId first, then with string id
    let result;
    try {
      result = await db.collection('rmt_categories').updateOne(
        { _id: new ObjectId(id) },
        { $set: updateData }
      );
    } catch {
      result = await db.collection('rmt_categories').updateOne(
        { _id: id },
        { $set: updateData }
      );
    }
    
    if (result.matchedCount > 0) {
      console.log('MongoDB update successful');
      return NextResponse.json({ success: true, category: { _id: id, ...updateData } });
    } else {
      return NextResponse.json({ success: false, error: 'Category not found' }, { status: 404 });
    }
  } catch (error) {
    console.error('Error updating category:', error);
    return NextResponse.json({ success: false, error: 'Failed to update category' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    console.log('DELETE - Deleting category:', id);

    const { db } = await connectToDatabase();
    console.log('Connected to MongoDB for DELETE');
    
    // Try to delete with ObjectId first, then with string id
    let result;
    try {
      result = await db.collection('rmt_categories').deleteOne({ _id: new ObjectId(id) });
    } catch {
      result = await db.collection('rmt_categories').deleteOne({ _id: id });
    }
    
    if (result.deletedCount > 0) {
      console.log('MongoDB delete successful');
      return NextResponse.json({ success: true, message: 'Category deleted successfully' });
    } else {
      return NextResponse.json({ success: false, error: 'Category not found' }, { status: 404 });
    }
  } catch (error) {
    console.error('Error deleting category:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete category' }, { status: 500 });
  }
}