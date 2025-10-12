import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import clientPromise from '../../../lib/mongodb';
import { APP_CONFIG } from '../../../lib/constants';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    const client = await clientPromise;
    const db = client.db('rmt_db');
    
    const user = await db.collection('admins').findOne({ 
      username, 
      applicationName: APP_CONFIG.APPLICATION_NAME 
    });
    
    if (!user || !user.password || !bcrypt.compareSync(password, user.password)) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    return NextResponse.json({ success: true, user: { id: user._id, username: user.username, applicationName: user.applicationName } });
  } catch {
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}