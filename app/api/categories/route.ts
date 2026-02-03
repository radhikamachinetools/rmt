import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const CATEGORIES_FILE = path.join(process.cwd(), 'data', 'categories.json');

export async function GET() {
  try {
    const data = await fs.readFile(CATEGORIES_FILE, 'utf8');
    const parsedData = JSON.parse(data);
    return NextResponse.json({ success: true, ...parsedData });
  } catch (error) {
    return NextResponse.json({ success: false, categories: [] });
  }
}

export async function POST(request: NextRequest) {
  try {
    const newCategory = await request.json();
    
    let categoriesData;
    try {
      const data = await fs.readFile(CATEGORIES_FILE, 'utf8');
      categoriesData = JSON.parse(data);
    } catch {
      categoriesData = { categories: [] };
    }
    
    categoriesData.categories.push(newCategory);
    
    await fs.writeFile(CATEGORIES_FILE, JSON.stringify(categoriesData, null, 2));
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to create category' }, { status: 500 });
  }
}