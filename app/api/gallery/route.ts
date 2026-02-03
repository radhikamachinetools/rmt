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

type GalleryItem = {
  _id: string;
  categoryId: string;
  type: string;
  url: string;
  title: string;
  displayOrder: number;
};

const GALLERY_FILE = path.join(process.cwd(), 'data', 'gallery.json');

export async function GET() {
  try {
    const data = await fs.readFile(GALLERY_FILE, 'utf8');
    const galleryData = JSON.parse(data);
    
    return NextResponse.json({
      success: true,
      categories: galleryData.galleryCategories.sort((a: GalleryCategory, b: GalleryCategory) => (a.displayOrder || 0) - (b.displayOrder || 0)),
      items: galleryData.galleryItems.sort((a: GalleryItem, b: GalleryItem) => (a.displayOrder || 0) - (b.displayOrder || 0))
    });
  } catch (error) {
    console.error('Error reading gallery:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch gallery' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, ...itemData } = body; // type: 'category' or 'item'

    const data = await fs.readFile(GALLERY_FILE, 'utf8');
    const galleryData = JSON.parse(data);

    if (type === 'category') {
      const { name, headerImage = '', displayOrder = 0 } = itemData;
      
      if (!name) {
        return NextResponse.json({ success: false, error: 'Category name is required' }, { status: 400 });
      }

      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      
      const newCategory = {
        _id: Date.now().toString(),
        name,
        slug,
        headerImage,
        displayOrder: parseInt(displayOrder) || 0
      };

      galleryData.galleryCategories.push(newCategory);
      
      await fs.writeFile(GALLERY_FILE, JSON.stringify(galleryData, null, 2));
      
      return NextResponse.json({ success: true, category: newCategory });
    } else if (type === 'item') {
      const { categoryId, itemType, url, title = '', displayOrder = 0 } = itemData;
      
      if (!categoryId || !itemType || !url) {
        return NextResponse.json({ success: false, error: 'Category, type, and URL are required' }, { status: 400 });
      }

      const newItem = {
        _id: Date.now().toString(),
        categoryId,
        type: itemType,
        url,
        title,
        displayOrder: parseInt(displayOrder) || 0
      };

      galleryData.galleryItems.push(newItem);
      
      await fs.writeFile(GALLERY_FILE, JSON.stringify(galleryData, null, 2));
      
      return NextResponse.json({ success: true, item: newItem });
    }

    return NextResponse.json({ success: false, error: 'Invalid type' }, { status: 400 });
  } catch (error) {
    console.error('Error creating gallery item:', error);
    return NextResponse.json({ success: false, error: 'Failed to create gallery item' }, { status: 500 });
  }
}