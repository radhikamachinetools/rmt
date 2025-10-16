import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const CONTACTS_FILE = path.join(process.cwd(), 'data', 'contacts.json');

export async function POST(request: NextRequest) {
  try {
    const { name, email, phone, message, subject, company } = await request.json();
    
    const data = await fs.readFile(CONTACTS_FILE, 'utf8');
    const { contacts } = JSON.parse(data);
    
    const newContact = {
      id: Date.now().toString(),
      name,
      email,
      phone,
      message,
      subject,
      company,
      createdAt: new Date().toISOString()
    };
    
    contacts.push(newContact);
    await fs.writeFile(CONTACTS_FILE, JSON.stringify({ contacts }, null, 2));
    
    return NextResponse.json({ success: true, message: 'Message sent successfully' });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to send message' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const data = await fs.readFile(CONTACTS_FILE, 'utf8');
    const { contacts } = JSON.parse(data);
    return NextResponse.json({ success: true, contacts });
  } catch {
    return NextResponse.json({ success: false, contacts: [] });
  }
}