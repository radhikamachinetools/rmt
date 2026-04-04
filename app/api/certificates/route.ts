import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '../../lib/db';

export async function GET() {
  try {
    console.log('GET /api/certificates - Starting fetch');
    
    const { db } = await connectToDatabase();
    console.log('Connected to MongoDB');
    
    const certificates = await db.collection('rmt_certificates')
      .find({})
      .sort({ displayOrder: 1 })
      .toArray();
      
    console.log('MongoDB certificates found:', certificates.length);
    
    return NextResponse.json({ success: true, certificates });
  } catch (error) {
    console.error('GET certificates error:', error);
    return NextResponse.json({ success: false, certificates: [], error: error.message });
  }
}

export async function POST(request: NextRequest) {
  try {
    const certificateData = await request.json();
    console.log('POST /api/certificates - Creating certificate:', certificateData);
    
    const { db } = await connectToDatabase();
    console.log('Connected to MongoDB for POST');
    
    const newCertificate = {
      title: certificateData.title || '',
      description: certificateData.description || '',
      imageUrl: certificateData.imageUrl,
      displayOrder: parseInt(certificateData.displayOrder) || 1,
      status: certificateData.status || 'active',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const result = await db.collection('rmt_certificates').insertOne(newCertificate);
    console.log('MongoDB insert result:', result.insertedId);
    
    const createdCertificate = { ...newCertificate, _id: result.insertedId.toString() };
    return NextResponse.json({ success: true, certificate: createdCertificate });
  } catch (error) {
    console.error('POST certificates error:', error);
    return NextResponse.json({ success: false, error: 'Failed to create certificate' }, { status: 500 });
  }
}