import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const CERTIFICATES_FILE = path.join(process.cwd(), 'data', 'certificates.json');

export async function GET() {
  try {
    const data = await fs.readFile(CERTIFICATES_FILE, 'utf8');
    const result = JSON.parse(data);
    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    return NextResponse.json({ success: true, certificates: [] });
  }
}

export async function POST(request: NextRequest) {
  try {
    const newCertificate = await request.json();
    
    let certificatesData;
    try {
      const data = await fs.readFile(CERTIFICATES_FILE, 'utf8');
      certificatesData = JSON.parse(data);
    } catch {
      certificatesData = { certificates: [] };
    }
    
    certificatesData.certificates.push(newCertificate);
    certificatesData.certificates.sort((a: any, b: any) => (a.displayOrder || 0) - (b.displayOrder || 0));
    
    await fs.writeFile(CERTIFICATES_FILE, JSON.stringify(certificatesData, null, 2));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Certificate creation error:', error);
    return NextResponse.json({ success: false, error: 'Failed to create certificate' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const updatedCertificate = await request.json();
    
    let certificatesData;
    try {
      const data = await fs.readFile(CERTIFICATES_FILE, 'utf8');
      certificatesData = JSON.parse(data);
    } catch {
      certificatesData = { certificates: [] };
    }
    
    const index = certificatesData.certificates.findIndex((c: any) => c._id === updatedCertificate._id);
    if (index !== -1) {
      certificatesData.certificates[index] = updatedCertificate;
      certificatesData.certificates.sort((a: any, b: any) => (a.displayOrder || 0) - (b.displayOrder || 0));
      
      await fs.writeFile(CERTIFICATES_FILE, JSON.stringify(certificatesData, null, 2));
      return NextResponse.json({ success: true });
    }
    return NextResponse.json({ success: false, error: 'Certificate not found' }, { status: 404 });
  } catch (error) {
    console.error('Certificate update error:', error);
    return NextResponse.json({ success: false, error: 'Failed to update certificate' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    const data = await fs.readFile(CERTIFICATES_FILE, 'utf8');
    const certificatesData = JSON.parse(data);
    
    certificatesData.certificates = certificatesData.certificates.filter((c: any) => c._id !== id);
    
    await fs.writeFile(CERTIFICATES_FILE, JSON.stringify(certificatesData, null, 2));
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete certificate' }, { status: 500 });
  }
}