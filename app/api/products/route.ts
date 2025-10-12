import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '../../lib/mongodb';
import { APP_CONFIG } from '../../lib/constants';

export async function POST(request: NextRequest) {
  try {
    const productData = await request.json();
    
    const client = await clientPromise;
    const db = client.db('rmt_db');
    
    const product = {
      ...productData,
      applicationName: APP_CONFIG.APPLICATION_NAME,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await db.collection('products').insertOne(product);
    
    return NextResponse.json({ 
      success: true, 
      productId: result.insertedId,
      product 
    });
  } catch (error) {
    return NextResponse.json({ error: 'Product creation failed' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('rmt_db');
    
    const products = await db.collection('products').find({ 
      applicationName: APP_CONFIG.APPLICATION_NAME 
    }).toArray();
    
    return NextResponse.json({ success: true, products });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}