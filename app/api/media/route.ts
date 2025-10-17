import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const MEDIA_FILE = path.join(process.cwd(), 'data', 'media.json');

export async function GET() {
  try {
    const data = await fs.readFile(MEDIA_FILE, 'utf8');
    const { media } = JSON.parse(data);
    return NextResponse.json({ success: true, media });
  } catch {
    return NextResponse.json({ success: true, media: [] });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { title, description, url, resource_type, isActive, activeFrom, activeTo } = await request.json();
    
    let media = [];
    try {
      const data = await fs.readFile(MEDIA_FILE, 'utf8');
      media = JSON.parse(data).media || [];
    } catch {
      // File doesn't exist, start with empty array
    }
    
    const newMedia = {
      id: Date.now().toString(),
      title,
      description,
      url,
      resource_type,
      isActive,
      activeFrom,
      activeTo,
      createdAt: new Date().toISOString()
    };
    
    media.push(newMedia);
    await fs.writeFile(MEDIA_FILE, JSON.stringify({ media }, null, 2));
    
    return NextResponse.json({ success: true, media: newMedia });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to save media' }, { status: 500 });
  }
}