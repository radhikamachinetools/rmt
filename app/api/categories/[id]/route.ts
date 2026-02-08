import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

type Category = {
  _id: string;
  name: string;
  slug: string;
  status: string;
  displayOrder: number;
};

const CATEGORIES_FILE = path.join(process.cwd(), 'data', 'categories.json');

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, status, displayOrder } = body;

    if (!name) {
      return NextResponse.json({ success: false, error: 'Category name is required' }, { status: 400 });
    }

    const data = await fs.readFile(CATEGORIES_FILE, 'utf8');
    const { categories } = JSON.parse(data);

    const categoryIndex = categories.findIndex((cat: Category) => cat._id === id);
    if (categoryIndex === -1) {
      return NextResponse.json({ success: false, error: 'Category not found' }, { status: 404 });
    }

    // Generate new slug
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    
    // Check if slug already exists (excluding current category)
    if (categories.some((cat: Category, index: number) => cat.slug === slug && index !== categoryIndex)) {
      return NextResponse.json({ success: false, error: 'Category with this name already exists' }, { status: 400 });
    }

    categories[categoryIndex] = {
      ...categories[categoryIndex],
      name,
      slug,
      status,
      displayOrder: parseInt(displayOrder) || 0
    };

    await fs.writeFile(CATEGORIES_FILE, JSON.stringify({ categories }, null, 2));

    return NextResponse.json({ success: true, category: categories[categoryIndex] });
  } catch (error) {
    console.error('Error updating category:', error);
    return NextResponse.json({ success: false, error: 'Failed to update category' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const data = await fs.readFile(CATEGORIES_FILE, 'utf8');
    const { categories } = JSON.parse(data);

    const categoryIndex = categories.findIndex((cat: Category) => cat._id === id);
    if (categoryIndex === -1) {
      return NextResponse.json({ success: false, error: 'Category not found' }, { status: 404 });
    }

    categories.splice(categoryIndex, 1);

    await fs.writeFile(CATEGORIES_FILE, JSON.stringify({ categories }, null, 2));

    return NextResponse.json({ success: true, message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Error deleting category:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete category' }, { status: 500 });
  }
}