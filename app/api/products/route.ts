import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '../../lib/db';
import { getAdminSession } from '../../lib/admin-session';
import { normalizeMongoDocuments } from '../../lib/mongo-utils';

export async function GET() {
  try {
    const { db } = await connectToDatabase();
    const products = await db.collection('rmt_products').find({}).sort({ order: 1 }).toArray();
    return NextResponse.json({ success: true, products: normalizeMongoDocuments(products) });
  } catch (error) {
    console.error('GET products error:', error);
    return NextResponse.json({ success: false, products: [], error: 'Failed to fetch products' });
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!(await getAdminSession())) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const productData = await request.json();
    const { db } = await connectToDatabase();

    const newProduct = {
      ...productData,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await db.collection('rmt_products').insertOne(newProduct);
    return NextResponse.json({ success: true, product: { ...newProduct, _id: result.insertedId.toString(), id: result.insertedId.toString() } });
  } catch (error) {
    console.error('POST products error:', error);
    return NextResponse.json({ success: false, error: 'Failed to create product' }, { status: 500 });
  }
}
