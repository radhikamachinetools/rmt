import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import clientPromise from '../../lib/mongodb';
import { APP_CONFIG } from '../../lib/constants';

export async function POST() {
  try {
    const client = await clientPromise;
    const db = client.db('rmt_db');
    
    const hashedPassword = bcrypt.hashSync('admin123', 10);
    
    await db.collection('admins').insertOne({
      username: 'admin',
      password: hashedPassword,
      applicationName: APP_CONFIG.APPLICATION_NAME,
      createdAt: new Date()
    });

    return NextResponse.json({ message: 'Admin user created' });
  } catch (error) {
    return NextResponse.json({ error: 'Seed failed' }, { status: 500 });
  }
}