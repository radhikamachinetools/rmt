import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '../../lib/db';
import { promises as fs } from 'fs';
import path from 'path';

const PRODUCTS_FILE = path.join(process.cwd(), 'data', 'products.json');

export async function GET(request: NextRequest) {
  try {
    // Try MongoDB first
    try {
      const { db } = await connectToDatabase();
      const products = await db.collection('rmt_products').find({}).sort({ order: 1 }).toArray();
      if (products.length > 0) {
        return NextResponse.json({ success: true, products });
      }
    } catch (dbError) {
      console.log('MongoDB not available, using JSON fallback');
    }

    // Fallback to JSON file
    const data = await fs.readFile(PRODUCTS_FILE, 'utf8');
    const parsedData = JSON.parse(data);
    return NextResponse.json({ success: true, ...parsedData });
  } catch (error) {
    return NextResponse.json({ success: false, products: [] });
  }
}

export async function POST(request: NextRequest) {
  try {
    const productData = await request.json();
    
    // Try MongoDB first
    try {
      const { db } = await connectToDatabase();
      const newId = Date.now().toString();
      const newProduct = {
        _id: newId,
        id: newId,
        ...productData,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      await db.collection('rmt_products').insertOne(newProduct);
      return NextResponse.json({ success: true, product: newProduct });
    } catch (dbError) {
      console.log('MongoDB not available, using JSON fallback');
    }

    // Fallback to JSON file
    const data = await fs.readFile(PRODUCTS_FILE, 'utf8');
    const { products } = JSON.parse(data);
    
    const newId = Date.now().toString();
    const newProduct = {
      _id: newId,
      id: newId,
      ...productData,
      order: products.length + 1
    };
    
    products.push(newProduct);
    await fs.writeFile(PRODUCTS_FILE, JSON.stringify({ products }, null, 2));
    
    return NextResponse.json({ success: true, product: newProduct });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to create product' }, { status: 500 });
  }
}