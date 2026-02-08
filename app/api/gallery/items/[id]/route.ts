import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

type GalleryItem = {
  _id: string;
  categoryId: string;
  type: string;
  url: string;
  title: string;
  displayOrder: number;
};

const GALLERY_FILE = path.join(process.cwd(), 'data', 'gallery.json');

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { categoryId, type, url, title, displayOrder } = body;

    if (!categoryId || !type || !url) {
      return NextResponse.json({ success: false, error: 'Category, type, and URL are required' }, { status: 400 });
    }

    const data = await fs.readFile(GALLERY_FILE, 'utf8');
    const galleryData = JSON.parse(data);

    const itemIndex = galleryData.galleryItems.findIndex((item: GalleryItem) => item._id === id);
    if (itemIndex === -1) {
      return NextResponse.json({ success: false, error: 'Item not found' }, { status: 404 });
    }

    galleryData.galleryItems[itemIndex] = {
      ...galleryData.galleryItems[itemIndex],
      categoryId,
      type,
      url,
      title: title || '',
      displayOrder: parseInt(displayOrder) || 0
    };

    await fs.writeFile(GALLERY_FILE, JSON.stringify(galleryData, null, 2));

    return NextResponse.json({ success: true, item: galleryData.galleryItems[itemIndex] });
  } catch (error) {
    console.error('Error updating gallery item:', error);
    return NextResponse.json({ success: false, error: 'Failed to update item' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const data = await fs.readFile(GALLERY_FILE, 'utf8');
    const galleryData = JSON.parse(data);

    const itemIndex = galleryData.galleryItems.findIndex((item: GalleryItem) => item._id === id);
    if (itemIndex === -1) {
      return NextResponse.json({ success: false, error: 'Item not found' }, { status: 404 });
    }

    galleryData.galleryItems.splice(itemIndex, 1);

    await fs.writeFile(GALLERY_FILE, JSON.stringify(galleryData, null, 2));

    return NextResponse.json({ success: true, message: 'Item deleted successfully' });
  } catch (error) {
    console.error('Error deleting gallery item:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete item' }, { status: 500 });
  }
}