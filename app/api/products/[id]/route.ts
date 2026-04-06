import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '../../../lib/db';
import { ObjectId } from 'mongodb';
import { promises as fs } from 'fs';
import path from 'path';

const PRODUCTS_FILE = path.join(process.cwd(), 'data', 'products.json');

type Product = { id?: string; _id?: unknown; slug?: string; [key: string]: unknown };

function toObjectId(id: string) {
  try { return new ObjectId(id); } catch { return null; }
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    try {
      const { db } = await connectToDatabase();
      const oid = toObjectId(id);
      const filter = oid ? { $or: [{ _id: oid }, { _id: id }, { id }] } : { $or: [{ _id: id }, { id }] };
      const product = await db.collection('rmt_products').findOne(filter);
      if (product) return NextResponse.json({ success: true, product });
    } catch {}

    const data = await fs.readFile(PRODUCTS_FILE, 'utf8');
    const { products } = JSON.parse(data);
    const product = products.find((p: Product) => p.id === id || p._id === id);
    if (!product) return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
    return NextResponse.json({ success: true, product });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to fetch product' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();

    try {
      const { db } = await connectToDatabase();
      const oid = toObjectId(id);
      const filter = oid ? { $or: [{ _id: oid }, { _id: id }, { id }] } : { $or: [{ _id: id }, { id }] };
      const result = await db.collection('rmt_products').updateOne(filter, { $set: { ...body, updatedAt: new Date() } });
      if (result.matchedCount > 0) return NextResponse.json({ success: true });
    } catch {}

    const data = await fs.readFile(PRODUCTS_FILE, 'utf8');
    const { products } = JSON.parse(data);
    const index = products.findIndex((p: Product) => p.id === id || p._id === id);
    if (index === -1) return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
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

    try {
      const { db } = await connectToDatabase();
      const oid = toObjectId(id);
      const filter = oid ? { $or: [{ _id: oid }, { _id: id }, { id }] } : { $or: [{ _id: id }, { id }] };
      const product = await db.collection('rmt_products').findOne(filter);
      if (product) {
        await db.collection('rmt_products').deleteOne(filter);
        return NextResponse.json({ success: true, message: 'Product deleted successfully' });
      }
    } catch {}

    // Fallback: JSON file
    const data = await fs.readFile(PRODUCTS_FILE, 'utf8');
    const { products } = JSON.parse(data);
    const product = products.find((p: Product) => p.id === id || p._id === id);
    if (!product) return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });

    if (product.slug) {
      const productDir = path.join(process.cwd(), 'public', 'uploads', product.slug as string);
      try { await fs.rm(productDir, { recursive: true, force: true }); } catch {}
    }

    const filtered = products.filter((p: Product) => p.id !== id && p._id !== id);
    await fs.writeFile(PRODUCTS_FILE, JSON.stringify({ products: filtered }, null, 2));
    return NextResponse.json({ success: true, message: 'Product deleted successfully' });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to delete product' }, { status: 500 });
  }
}
