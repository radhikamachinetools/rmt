import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '../../../lib/db';
import { ObjectId } from 'mongodb';

function buildFilter(id: string) {
  try {
    return { $or: [{ _id: new ObjectId(id) }, { _id: id }, { id }] };
  } catch {
    return { $or: [{ _id: id }, { id }] };
  }
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { db } = await connectToDatabase();
    const product = await db.collection('rmt_products').findOne(buildFilter(id));
    if (!product) return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
    return NextResponse.json({ success: true, product });
  } catch (error) {
    console.error('GET product error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch product' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { db } = await connectToDatabase();

    const result = await db.collection('rmt_products').updateOne(
      buildFilter(id),
      { $set: { ...body, updatedAt: new Date() } }
    );

    if (result.matchedCount === 0) return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('PUT product error:', error);
    return NextResponse.json({ success: false, error: 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { db } = await connectToDatabase();

    const result = await db.collection('rmt_products').deleteOne(buildFilter(id));
    if (result.deletedCount === 0) return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });

    return NextResponse.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    console.error('DELETE product error:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete product' }, { status: 500 });
  }
}
