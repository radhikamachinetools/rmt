import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '../../lib/db';
import { uploadToBlob } from '../../lib/blob';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];
    const type = formData.get('type') as string;

    if (!files.length) {
      return NextResponse.json({ success: false, error: 'No files provided' }, { status: 400 });
    }

    const { db } = await connectToDatabase();
    const count = await db.collection('rmt_infrastructure').countDocuments();
    const newItems = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const url = await uploadToBlob(file, 'infrastructure');

      const newItem = {
        type: type || (file.type.startsWith('video/') ? 'video' : 'image'),
        url,
        title: file.name.split('.')[0],
        description: '',
        order: count + i,
        createdAt: new Date()
      };

      const result = await db.collection('rmt_infrastructure').insertOne(newItem);
      newItems.push({ ...newItem, _id: result.insertedId });
    }

    return NextResponse.json({ success: true, items: newItems });
  } catch (error) {
    console.error('Upload infrastructure error:', error);
    return NextResponse.json({ success: false, error: 'Upload failed' }, { status: 500 });
  }
}
