import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const ADMIN_FILE = path.join(process.cwd(), 'data', 'admin.json');

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();
    const data = await fs.readFile(ADMIN_FILE, 'utf8');
    const { admin } = JSON.parse(data);
    
    if (username === admin.username && password === admin.password) {
      const response = NextResponse.json({ success: true, message: 'Login successful' });
      response.cookies.set('admin-auth', 'true', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        path: '/'
      });
      return response;
    }
    
    return NextResponse.json({ success: false, error: 'Invalid credentials' }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Login failed' }, { status: 500 });
  }
}