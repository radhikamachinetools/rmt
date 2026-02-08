import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

type GalleryCategory = {
  _id: string;
  name: string;
  slug: string;
  headerImage: string;
  displayOrder: number;
};

const GALLERY_FILE = path.join(process.cwd(), 'data', 'gallery.json');

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, headerImage, displayOrder } = body;

    if (!name) {
      return NextResponse.json({ success: false, error: 'Category name is required' }, { status: 400 });
    }

    const data = await fs.readFile(GALLERY_FILE, 'utf8');
    const galleryData = JSON.parse(data);

    const categoryIndex = galleryData.galleryCategories.findIndex((cat: GalleryCategory) => cat._id === id);
    if (categoryIndex === -1) {
      return NextResponse.json({ success: false, error: 'Category not found' }, { status: 404 });
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    galleryData.galleryCategories[categoryIndex] = {
      ...galleryData.galleryCategories[categoryIndex],
      name,
      slug,
      headerImage: headerImage || '',
      displayOrder: parseInt(displayOrder) || 0
    };

    await fs.writeFile(GALLERY_FILE, JSON.stringify(galleryData, null, 2));

    return NextResponse.json({ success: true, category: galleryData.galleryCategories[categoryIndex] });
  } catch (error) {
    console.error('Error updating gallery category:', error);
    return NextResponse.json({ success: false, error: 'Failed to update category' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const data = await fs.readFile(GALLERY_FILE, 'utf8');
    const galleryData = JSON.parse(data);

    const categoryIndex = galleryData.galleryCategories.findIndex((cat: GalleryCategory) => cat._id === id);
    if (categoryIndex === -1) {
      return NextResponse.json({ success: false, error: 'Category not found' }, { status: 404 });
    }

    // Remove category and all its items
    galleryData.galleryCategories.splice(categoryIndex, 1);
    galleryData.galleryItems = galleryData.galleryItems.filter((item: any) => item.categoryId !== id);

    await fs.writeFile(GALLERY_FILE, JSON.stringify(galleryData, null, 2));

    return NextResponse.json({ success: true, message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Error deleting gallery category:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete category' }, { status: 500 });
  }
}