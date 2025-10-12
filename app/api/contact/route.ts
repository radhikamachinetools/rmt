import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '../../lib/mongodb';
import { APP_CONFIG } from '../../lib/constants';

export async function POST(request: NextRequest) {
  try {
    const contactData = await request.json();
    
    const client = await clientPromise;
    const db = client.db('rmt_db');
    
    const contact = {
      ...contactData,
      applicationName: APP_CONFIG.APPLICATION_NAME,
      createdAt: new Date(),
      status: 'new'
    };

    const result = await db.collection('contacts').insertOne(contact);
    
    return NextResponse.json({ 
      success: true, 
      contactId: result.insertedId 
    });
  } catch (error) {
    return NextResponse.json({ error: 'Contact form submission failed' }, { status: 500 });
  }
}