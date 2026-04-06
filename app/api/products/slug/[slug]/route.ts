import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '../../../../lib/db';

export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const { db } = await connectToDatabase();
    const product = await db.collection('rmt_products').findOne({ slug });
    if (!product) return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
    return NextResponse.json({ success: true, product });
  } catch (error) {
    console.error('GET product by slug error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch product' }, { status: 500 });
  }
}
