import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function GET() {
  try {
    const PRODUCTS_FILE = path.join(process.cwd(), 'data', 'products.json');
    const data = await fs.readFile(PRODUCTS_FILE, 'utf8');
    const parsedData = JSON.parse(data);
    return NextResponse.json({ success: true, ...parsedData });
  } catch (error) {
    return NextResponse.json({ success: false, products: [] });
  }
}

export async function POST(request: Request) {
  try {
    const PRODUCTS_FILE = path.join(process.cwd(), 'data', 'products.json');
    const productData = await request.json();
    
    // Read existing products
    const data = await fs.readFile(PRODUCTS_FILE, 'utf8');
    const { products } = JSON.parse(data);
    
    // Generate new ID
    const newId = Date.now().toString();
    const newProduct = {
      _id: newId,
      id: newId,
      ...productData,
      order: products.length + 1
    };
    
    // Add new product
    products.push(newProduct);
    
    // Write back to file
    await fs.writeFile(PRODUCTS_FILE, JSON.stringify({ products }, null, 2));
    
    return NextResponse.json({ success: true, product: newProduct });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to create product' }, { status: 500 });
  }
}