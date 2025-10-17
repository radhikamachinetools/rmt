import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const PRODUCTS_FILE = path.join(process.cwd(), 'data', 'products.json');

type Product = {
  id: string;
  [key: string]: unknown;
};

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const data = await fs.readFile(PRODUCTS_FILE, 'utf8');
    const { products } = JSON.parse(data);
    const product = products.find((p: Product) => p.id === id);
    
    if (!product) {
      return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, product });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to fetch product' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const data = await fs.readFile(PRODUCTS_FILE, 'utf8');
    const { products } = JSON.parse(data);
    
    const index = products.findIndex((p: Product) => p.id === id);
    if (index === -1) {
      return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
    }
    
    products[index] = { ...products[index], ...body };
    await fs.writeFile(PRODUCTS_FILE, JSON.stringify({ products }, null, 2));
    
    return NextResponse.json({ success: true, product: products[index] });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const data = await fs.readFile(PRODUCTS_FILE, 'utf8');
    const { products } = JSON.parse(data);
    
    const product = products.find((p: Product) => p.id === id);
    if (!product) {
      return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
    }
    
    // Remove product folder and images
    if (product.slug) {
      const productDir = path.join(process.cwd(), 'public', 'uploads', product.slug as string);
      try {
        await fs.rm(productDir, { recursive: true, force: true });
      } catch (error) {
        console.log('Product folder not found or already deleted');
      }
    }
    
    const filteredProducts = products.filter((p: Product) => p.id !== id);
    await fs.writeFile(PRODUCTS_FILE, JSON.stringify({ products: filteredProducts }, null, 2));
    
    return NextResponse.json({ success: true, message: 'Product and images deleted successfully' });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to delete product' }, { status: 500 });
  }
}