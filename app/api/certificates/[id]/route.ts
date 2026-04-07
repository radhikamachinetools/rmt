import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '../../../lib/db';
import { getAdminSession } from '../../../lib/admin-session';
import { buildIdFilter, normalizeMongoDocument } from '../../../lib/mongo-utils';

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    if (!(await getAdminSession())) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const certificateData = await request.json();
    console.log('PUT - Updating certificate in MongoDB:', id);

    const { db } = await connectToDatabase();
    
    const updateData = {
      title: certificateData.title || '',
      description: certificateData.description || '',
      imageUrl: certificateData.imageUrl,
      displayOrder: parseInt(certificateData.displayOrder) || 1,
      status: certificateData.status || 'active',
      updatedAt: new Date()
    };
    
    const result = await db.collection('rmt_certificates').updateOne(
      buildIdFilter(id),
      { $set: updateData }
    );
    
    if (result.matchedCount > 0) {
      console.log('MongoDB update successful');
      return NextResponse.json({ success: true, certificate: normalizeMongoDocument({ _id: id, ...updateData }) });
    } else {
      return NextResponse.json({ success: false, error: 'Certificate not found' }, { status: 404 });
    }
  } catch (error) {
    console.error('Error updating certificate:', error);
    return NextResponse.json({ success: false, error: 'Failed to update certificate' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    if (!(await getAdminSession())) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    console.log('DELETE - Deleting certificate:', id);

    const { db } = await connectToDatabase();
    console.log('Connected to MongoDB for DELETE');
    
    const result = await db.collection('rmt_certificates').deleteOne(buildIdFilter(id));
    
    if (result.deletedCount > 0) {
      console.log('MongoDB delete successful');
      return NextResponse.json({ success: true, message: 'Certificate deleted successfully' });
    } else {
      return NextResponse.json({ success: false, error: 'Certificate not found' }, { status: 404 });
    }
  } catch (error) {
    console.error('Error deleting certificate:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete certificate' }, { status: 500 });
  }
}