import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '../../../lib/db';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    // Try MongoDB first
    try {
      const { db } = await connectToDatabase();
      const admin = await db.collection('rmt_admin').findOne({ username, password });
      
      if (admin) {
        const response = NextResponse.json({ success: true, message: 'Login successful' });
        response.cookies.set('admin-auth', 'true', {
          httpOnly: false,
          secure: false,
          maxAge: 24 * 60 * 60 * 1000,
          path: '/'
        });
        return response;
      }
    } catch (dbError) {
      console.log('MongoDB not available, using fallback');
    }

    // Fallback to original credentials
    if (username === 'admin' && password === 'rmt2024') {
      const response = NextResponse.json({ success: true, message: 'Login successful' });
      response.cookies.set('admin-auth', 'true', {
        httpOnly: false,
        secure: false,
        maxAge: 24 * 60 * 60 * 1000,
        path: '/'
      });
      return response;
    }
    
    return NextResponse.json({ success: false, error: 'Invalid credentials' }, { status: 401 });
  } catch {
    return NextResponse.json({ success: false, error: 'Login failed' }, { status: 500 });
  }
}