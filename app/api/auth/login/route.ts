import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '../../../lib/mongodb';
import { APP_CONFIG } from '../../../lib/constants';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const bcrypt = require('bcryptjs');

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json({ error: 'Username and password required' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('rmt_db');
    
    const user = await db.collection('admins').findOne({ 
      username, 
      applicationName: APP_CONFIG.APPLICATION_NAME 
    });
    
    if (!user || !user.password || typeof user.password !== 'string') {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const isValidPassword = bcrypt.compareSync(String(password), String(user.password));
    if (!isValidPassword) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    return NextResponse.json({ 
      success: true, 
      user: { 
        id: user._id, 
        username: user.username, 
        applicationName: user.applicationName 
      } 
    });
  } catch {
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}