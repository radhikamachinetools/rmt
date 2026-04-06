import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '../../lib/db';
import { ObjectId } from 'mongodb';

function buildFilter(id: string) {
  try {
    return { $or: [{ _id: new ObjectId(id) }, { _id: id }] };
  } catch {
    return { _id: id as any };
  }
}

export async function GET() {
  try {
    const { db } = await connectToDatabase();
    const items = await db.collection('rmt_infrastructure').find({}).sort({ order: 1 }).toArray();
    return NextResponse.json({ success: true, items });
  } catch (error) {
    console.error('GET infrastructure error:', error);
    return NextResponse.json({ success: false, items: [] });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { db } = await connectToDatabase();
    const count = await db.collection('rmt_infrastructure').countDocuments();
    const newItem = { ...body, order: count, createdAt: new Date() };
    const result = await db.collection('rmt_infrastructure').insertOne(newItem);
    return NextResponse.json({ success: true, item: { ...newItem, _id: result.insertedId } });
  } catch (error) {
    console.error('POST infrastructure error:', error);
    return NextResponse.json({ success: false, error: 'Failed to create item' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ success: false, error: 'ID required' }, { status: 400 });
    const body = await request.json();
    const { db } = await connectToDatabase();
    await db.collection('rmt_infrastructure').updateOne(buildFilter(id), { $set: { ...body, updatedAt: new Date() } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('PUT infrastructure error:', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ success: false, error: 'ID required' }, { status: 400 });
    const { db } = await connectToDatabase();
    await db.collection('rmt_infrastructure').deleteOne(buildFilter(id));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE infrastructure error:', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
