import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const MEDIA_FILE = path.join(process.cwd(), 'data', 'media.json');

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { title, description, url, resource_type, isActive, activeFrom, activeTo } = await request.json();
    
    const data = await fs.readFile(MEDIA_FILE, 'utf8');
    const { media } = JSON.parse(data);
    
    const index = media.findIndex((item: any) => item.id === id);
    if (index === -1) {
      return NextResponse.json({ success: false, error: 'Media not found' }, { status: 404 });
    }
    
    media[index] = {
      ...media[index],
      title,
      description,
      url,
      resource_type,
      isActive,
      activeFrom,
      activeTo
    };
    
    await fs.writeFile(MEDIA_FILE, JSON.stringify({ media }, null, 2));
    
    return NextResponse.json({ success: true, media: media[index] });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to update media' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    
    const data = await fs.readFile(MEDIA_FILE, 'utf8');
    const { media } = JSON.parse(data);
    
    const filteredMedia = media.filter((item: any) => item.id !== id);
    await fs.writeFile(MEDIA_FILE, JSON.stringify({ media: filteredMedia }, null, 2));
    
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to delete media' }, { status: 500 });
  }
}