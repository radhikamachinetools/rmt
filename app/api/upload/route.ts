import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];
    const slug = formData.get('slug') as string;

    if (!files.length || !slug) {
      return NextResponse.json({ success: false, error: 'No files or slug provided' });
    }

    const uploadDir = path.join(process.cwd(), 'public', 'uploads', slug);
    await fs.mkdir(uploadDir, { recursive: true });

    const uploadedPaths: string[] = [];

    for (const file of files) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const filePath = path.join(uploadDir, file.name);
      
      await fs.writeFile(filePath, buffer);
      uploadedPaths.push(`/uploads/${slug}/${file.name}`);
    }

    return NextResponse.json({ success: true, paths: uploadedPaths });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Upload failed' }, { status: 500 });
  }
}