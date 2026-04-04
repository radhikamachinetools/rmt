import { put, del } from '@vercel/blob';

const BLOB_TOKEN = process.env.BLOB_READ_WRITE_TOKEN!;

if (!BLOB_TOKEN) {
  throw new Error('Please define the BLOB_READ_WRITE_TOKEN environment variable');
}

export async function uploadToBlob(file: File, folder: string = 'rmt'): Promise<string> {
  try {
    const timestamp = Date.now();
    const fileName = `${folder}-${timestamp}-${file.name}`;
    
    const blob = await put(fileName, file, {
      access: 'public',
      token: BLOB_TOKEN,
    });

    return blob.url;
  } catch (error) {
    console.error('Error uploading to blob storage:', error);
    throw new Error('Failed to upload image');
  }
}

export async function deleteFromBlob(url: string): Promise<void> {
  try {
    await del(url, { token: BLOB_TOKEN });
  } catch (error) {
    console.error('Error deleting from blob storage:', error);
    // Don't throw error for delete operations
  }
}

export function extractBlobFileName(url: string): string {
  const parts = url.split('/');
  return parts[parts.length - 1];
}