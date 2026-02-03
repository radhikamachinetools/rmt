import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const INFRASTRUCTURE_FILE = path.join(process.cwd(), 'data', 'infrastructure.json');

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];
    const type = formData.get('type') as string;
    
    if (!files.length) {
      return NextResponse.json({ success: false, error: 'No files provided' }, { status: 400 });
    }

    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'infrastructure');
    await fs.mkdir(uploadDir, { recursive: true });

    const data = await fs.readFile(INFRASTRUCTURE_FILE, 'utf8').catch(() => '{"items":[]}');
    const { items } = JSON.parse(data);

    const newItems = [];

    for (const file of files) {
      const fileName = `${Date.now()}-${file.name}`;
      const filePath = path.join(uploadDir, fileName);
      const buffer = Buffer.from(await file.arrayBuffer());
      await fs.writeFile(filePath, buffer);

      const newItem = {
        _id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        type,
        url: `/uploads/infrastructure/${fileName}`,
        title: file.name.split('.')[0],
        description: '',
        order: items.length + newItems.length
      };

      newItems.push(newItem);
    }

    items.push(...newItems);
    await fs.writeFile(INFRASTRUCTURE_FILE, JSON.stringify({ items }, null, 2));

    return NextResponse.json({ success: true, items: newItems });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ success: false, error: 'Upload failed' }, { status: 500 });
  }
}