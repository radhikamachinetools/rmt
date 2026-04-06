import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '../../lib/db';

export async function GET() {
  try {
    const { db } = await connectToDatabase();
    const media = await db.collection('rmt_media').find({}).sort({ createdAt: -1 }).toArray();
    return NextResponse.json({ success: true, media });
  } catch (error) {
    console.error('GET media error:', error);
    return NextResponse.json({ success: false, media: [], error: 'Failed to fetch media' });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { title, description, url, resource_type, isActive, activeFrom, activeTo } = await request.json();
    const { db } = await connectToDatabase();

    const newMedia = { title, description, url, resource_type, isActive, activeFrom, activeTo, createdAt: new Date() };
    const result = await db.collection('rmt_media').insertOne(newMedia);
    return NextResponse.json({ success: true, media: { ...newMedia, _id: result.insertedId } });
  } catch (error) {
    console.error('POST media error:', error);
    return NextResponse.json({ success: false, error: 'Failed to save media' }, { status: 500 });
  }
}
