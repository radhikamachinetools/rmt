import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '../../lib/mongodb';
import { APP_CONFIG } from '../../lib/constants';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('rmt_db');
    
    const media = await db.collection('media').find({ 
      applicationName: APP_CONFIG.APPLICATION_NAME 
    }).toArray();
    
    return NextResponse.json(media);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch media' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const mediaData = await request.json();
    
    const client = await clientPromise;
    const db = client.db('rmt_db');
    
    const media = {
      ...mediaData,
      applicationName: APP_CONFIG.APPLICATION_NAME,
      createdAt: new Date()
    };

    const result = await db.collection('media').insertOne(media);
    
    return NextResponse.json({ 
      success: true, 
      mediaId: result.insertedId,
      media 
    });
  } catch (error) {
    return NextResponse.json({ error: 'Media upload failed' }, { status: 500 });
  }
}