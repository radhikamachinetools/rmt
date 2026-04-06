import { put, del } from '@vercel/blob';

export async function uploadToBlob(file: File, folder: string = 'rmt'): Promise<string> {
  const BLOB_TOKEN = process.env.BLOB_READ_WRITE_TOKEN;
  if (!BLOB_TOKEN) throw new Error('BLOB_READ_WRITE_TOKEN is not defined');

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
  const BLOB_TOKEN = process.env.BLOB_READ_WRITE_TOKEN;
  try {
    if (!BLOB_TOKEN) return;
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