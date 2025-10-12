import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const file: File | null = data.get('file') as unknown as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(2, 15);
    const fileExtension = path.extname(file.name);
    const uniqueFileName = `rmt_${timestamp}_${randomId}${fileExtension}`;

    const filePath = path.join(process.cwd(), 'public/uploads', uniqueFileName);
    await writeFile(filePath, buffer);

    return NextResponse.json({ 
      success: true, 
      fileName: uniqueFileName,
      filePath: `/uploads/${uniqueFileName}`
    });
  } catch {
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}