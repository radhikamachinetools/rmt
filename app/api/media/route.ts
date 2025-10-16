import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const MEDIA_FILE = path.join(process.cwd(), 'data', 'media.json');

export async function GET() {
  try {
    const data = await fs.readFile(MEDIA_FILE, 'utf8');
    const { media } = JSON.parse(data);
    return NextResponse.json(media);
  } catch {
    return NextResponse.json([]);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = await fs.readFile(MEDIA_FILE, 'utf8');
    const { media } = JSON.parse(data);
    
    const newMedia = {
      id: Date.now().toString(),
      ...body,
      createdAt: new Date().toISOString()
    };
    
    media.push(newMedia);
    await fs.writeFile(MEDIA_FILE, JSON.stringify({ media }, null, 2));
    
    return NextResponse.json({ success: true, media: newMedia });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to add media' }, { status: 500 });
  }
}