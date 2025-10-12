import { NextResponse } from 'next/server';
import clientPromise from '../../lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('rmt_db');
    
    await db.admin().ping();
    
    const collections = await db.listCollections().toArray();
    
    return NextResponse.json({ 
      success: true, 
      message: 'Connected to MongoDB Atlas',
      database: 'rmt_db',
      collections: collections.map(c => c.name)
    });
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: 'Database connection failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}