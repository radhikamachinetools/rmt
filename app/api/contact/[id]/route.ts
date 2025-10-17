import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const CONTACTS_FILE = path.join(process.cwd(), 'data', 'contacts.json');

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { status } = await request.json();
    
    const data = await fs.readFile(CONTACTS_FILE, 'utf8');
    const { contacts } = JSON.parse(data);
    
    const contactIndex = contacts.findIndex((contact: {id: string}) => contact.id === id);
    if (contactIndex === -1) {
      return NextResponse.json({ success: false, error: 'Contact not found' }, { status: 404 });
    }
    
    contacts[contactIndex].status = status;
    await fs.writeFile(CONTACTS_FILE, JSON.stringify({ contacts }, null, 2));
    
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to update status' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    
    const data = await fs.readFile(CONTACTS_FILE, 'utf8');
    const { contacts } = JSON.parse(data);
    
    const filteredContacts = contacts.filter((contact: {id: string}) => contact.id !== id);
    await fs.writeFile(CONTACTS_FILE, JSON.stringify({ contacts: filteredContacts }, null, 2));
    
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to delete contact' }, { status: 500 });
  }
}