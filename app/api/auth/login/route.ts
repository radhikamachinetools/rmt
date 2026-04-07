import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '../../../lib/db';
import { createAdminSession } from '../../../lib/admin-session';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    const { db } = await connectToDatabase();
    const admin = await db.collection('rmt_admin').findOne({ username, password, status: { $ne: 'inactive' } });

    if (admin) {
      const response = NextResponse.json({ success: true, message: 'Login successful' });
      response.cookies.set('admin-session', createAdminSession(username), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24,
        path: '/',
      });
      return response;
    }

    if (process.env.ADMIN_USERNAME && process.env.ADMIN_PASSWORD && username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
      const response = NextResponse.json({ success: true, message: 'Login successful' });
      response.cookies.set('admin-session', createAdminSession(username), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24,
        path: '/',
      });
      return response;
    }
    
    return NextResponse.json({ success: false, error: 'Invalid credentials' }, { status: 401 });
  } catch {
    return NextResponse.json({ success: false, error: 'Login failed' }, { status: 500 });
  }
}