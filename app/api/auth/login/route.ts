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