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