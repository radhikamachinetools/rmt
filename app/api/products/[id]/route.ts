import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import clientPromise from '../../../lib/mongodb';
import { APP_CONFIG } from '../../../lib/constants';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const client = await clientPromise;
    const db = client.db('rmt_db');
    
    const product = await db.collection('products').findOne({ 
      _id: new ObjectId(params.id),
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

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const productData = await request.json();
    
    const client = await clientPromise;
    const db = client.db('rmt_db');
    
    const result = await db.collection('products').updateOne(
      { 
        _id: new ObjectId(params.id),
        applicationName: APP_CONFIG.APPLICATION_NAME 
      },
      { 
        $set: {
          ...productData,
          updatedAt: new Date()
        }
      }
    );
    
    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const client = await clientPromise;
    const db = client.db('rmt_db');
    
    const result = await db.collection('products').deleteOne({ 
      _id: new ObjectId(params.id),
      applicationName: APP_CONFIG.APPLICATION_NAME 
    });
    
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}