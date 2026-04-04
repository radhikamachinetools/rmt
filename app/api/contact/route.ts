import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '../../lib/mongodb';

export async function POST(request: NextRequest) {
  try {
    const { name, email, phone, message, subject, company } = await request.json();
    
    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, error: 'Name, email, and message are required' },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    
    // Check if email already exists
    const existingContact = await db.collection('rmt_contacts').findOne({ email });
    if (existingContact) {
      return NextResponse.json(
        { success: false, error: 'Query already exists for this email' },
        { status: 400 }
      );
    }
    
    const newContact = {
      name,
      email,
      phone: phone || '',
      message,
      subject: subject || '',
      company: company || '',
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    await db.collection('rmt_contacts').insertOne(newContact);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Message sent successfully' 
    });
  } catch (error) {
    console.error('Contact creation error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to send message' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const { db } = await connectToDatabase();
    const contacts = await db.collection('rmt_contacts')
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({ success: true, contacts });
  } catch (error) {
    console.error('Error fetching contacts:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch contacts', contacts: [] },
      { status: 500 }
    );
  }
}