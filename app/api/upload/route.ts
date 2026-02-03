import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const files = formData.getAll('files') as File[];
    const slug = formData.get('slug') as string;
    const folder = formData.get('folder') as string;
    const type = formData.get('type') as string;

    // Handle certificate uploads
    if (files.length && type === 'certificate') {
      const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'certificates');
      await fs.mkdir(uploadDir, { recursive: true });

      const uploadedPaths: string[] = [];

      for (const file of files) {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const timestamp = Date.now();
        const fileName = `${timestamp}-${file.name}`;
        const filePath = path.join(uploadDir, fileName);
        
        await fs.writeFile(filePath, buffer);
        uploadedPaths.push(`/uploads/certificates/${fileName}`);
      }

      return NextResponse.json({ success: true, paths: uploadedPaths });
    }

    // Handle single file upload with folder
    if (file && folder) {
      const uploadDir = path.join(process.cwd(), 'public', 'uploads', folder);
      await fs.mkdir(uploadDir, { recursive: true });

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const timestamp = Date.now();
      const fileName = `${timestamp}-${file.name}`;
      const filePath = path.join(uploadDir, fileName);
      
      await fs.writeFile(filePath, buffer);
      const url = `/uploads/${folder}/${fileName}`;

      return NextResponse.json({ success: true, url });
    }

    // Handle multiple files upload with slug (existing functionality)
    if (files.length && slug) {
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
    }

    return NextResponse.json({ success: false, error: 'No files provided or missing parameters' });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Upload failed' }, { status: 500 });
  }
}