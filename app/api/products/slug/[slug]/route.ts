import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '../../../../lib/mongodb';
import { APP_CONFIG } from '../../../../lib/constants';

export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const client = await clientPromise;
    const db = client.db('rmt_db');
    
    const product = await db.collection('products').findOne({ 
      slug: params.slug,
      applicationName: APP_CONFIG.APPLICATION_NAME 
    });
    
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, product });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
  }
}