import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const INFRASTRUCTURE_FILE = path.join(process.cwd(), 'data', 'infrastructure.json');

export async function GET() {
  try {
    const data = await fs.readFile(INFRASTRUCTURE_FILE, 'utf8');
    const { items } = JSON.parse(data);
    return NextResponse.json({ success: true, items });
  } catch {
    return NextResponse.json({ success: true, items: [] });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = await fs.readFile(INFRASTRUCTURE_FILE, 'utf8').catch(() => '{"items":[]}');
    const { items } = JSON.parse(data);
    
    const newItem = {
      _id: Date.now().toString(),
      ...body,
      order: items.length
    };
    
    items.push(newItem);
    await fs.writeFile(INFRASTRUCTURE_FILE, JSON.stringify({ items }, null, 2));
    
    return NextResponse.json({ success: true, item: newItem });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to create item' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    const data = await fs.readFile(INFRASTRUCTURE_FILE, 'utf8');
    const { items } = JSON.parse(data);
    
    const filteredItems = items.filter((item: any) => item._id !== id);
    await fs.writeFile(INFRASTRUCTURE_FILE, JSON.stringify({ items: filteredItems }, null, 2));
    
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const body = await request.json();
    
    const data = await fs.readFile(INFRASTRUCTURE_FILE, 'utf8');
    const { items } = JSON.parse(data);
    
    const updatedItems = items.map((item: any) => 
      item._id === id ? { ...item, ...body } : item
    );
    
    await fs.writeFile(INFRASTRUCTURE_FILE, JSON.stringify({ items: updatedItems }, null, 2));
    
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}