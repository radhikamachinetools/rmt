import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '../../lib/db';

export async function GET() {
  try {
    const { db } = await connectToDatabase();
    const products = await db.collection('rmt_products').find({}).sort({ order: 1 }).toArray();
    return NextResponse.json({ success: true, products });
  } catch (error) {
    console.error('GET products error:', error);
    return NextResponse.json({ success: false, products: [], error: 'Failed to fetch products' });
  }
}

export async function POST(request: NextRequest) {
  try {
    const productData = await request.json();
    const { db } = await connectToDatabase();

    const newProduct = {
      ...productData,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await db.collection('rmt_products').insertOne(newProduct);
    return NextResponse.json({ success: true, product: { ...newProduct, _id: result.insertedId } });
  } catch (error) {
    console.error('POST products error:', error);
    return NextResponse.json({ success: false, error: 'Failed to create product' }, { status: 500 });
  }
}
