import { NextRequest, NextResponse } from 'next/server';
import { uploadToBlob } from '../../lib/blob';
import { getAdminSession } from '../../lib/admin-session';

export async function POST(request: NextRequest) {
  try {
    if (!(await getAdminSession())) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const files = formData.getAll('files') as File[];
    const slug = formData.get('slug') as string;
    const folder = formData.get('folder') as string;
    const type = formData.get('type') as string;

    // Validate file types
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/webm', 'application/pdf'];
    const maxSize = 10 * 1024 * 1024; // 10MB

    // Handle certificate uploads
    if (files.length && type === 'certificate') {
      const uploadedPaths: string[] = [];

      for (const file of files) {
        if (!allowedTypes.includes(file.type)) {
          return NextResponse.json(
            { success: false, error: `Invalid file type: ${file.type}` },
            { status: 400 }
          );
        }
        if (file.size > maxSize) {
          return NextResponse.json(
            { success: false, error: `File too large: ${file.name}` },
            { status: 400 }
          );
        }

        const url = await uploadToBlob(file, 'certificates');
        uploadedPaths.push(url);
      }

      return NextResponse.json({ success: true, paths: uploadedPaths });
    }

    // Handle single file upload with folder
    if (file && folder) {
      if (!allowedTypes.includes(file.type)) {
        return NextResponse.json(
          { success: false, error: 'Invalid file type' },
          { status: 400 }
        );
      }
      if (file.size > maxSize) {
        return NextResponse.json(
          { success: false, error: 'File too large' },
          { status: 400 }
        );
      }

      const url = await uploadToBlob(file, folder);
      return NextResponse.json({ success: true, url });
    }

    // Handle multiple files upload with slug
    if (files.length && slug) {
      const uploadedPaths: string[] = [];

      for (const file of files) {
        if (!allowedTypes.includes(file.type)) {
          return NextResponse.json(
            { success: false, error: `Invalid file type: ${file.type}` },
            { status: 400 }
          );
        }
        if (file.size > maxSize) {
          return NextResponse.json(
            { success: false, error: `File too large: ${file.name}` },
            { status: 400 }
          );
        }

        const url = await uploadToBlob(file, slug);
        uploadedPaths.push(url);
      }

      return NextResponse.json({ success: true, paths: uploadedPaths });
    }

    return NextResponse.json(
      { success: false, error: 'No files provided or missing parameters' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { success: false, error: 'Upload failed' },
      { status: 500 }
    );
  }
}