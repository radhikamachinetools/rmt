import { NextResponse } from 'next/server';
import { getAdminSession } from '../../../lib/admin-session';

export async function GET() {
  if (!(await getAdminSession())) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  return NextResponse.json({ authenticated: true });
}