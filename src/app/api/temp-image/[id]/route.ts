import { NextRequest, NextResponse } from 'next/server';
import { imageStore } from '../temp-image-upload/route';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    const base64Data = imageStore.get(id);
    
    if (!base64Data) {
      return NextResponse.json(
        { error: 'Image not found' },
        { status: 404 }
      );
    }

    // Convert base64 to buffer
    const base64String = base64Data.split(',')[1]; // Remove data:image/jpeg;base64, prefix
    const buffer = Buffer.from(base64String, 'base64');
    
    // Determine content type
    const contentType = base64Data.includes('data:image/png') ? 'image/png' : 'image/jpeg';
    
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
      },
    });

  } catch (error: any) {
    console.error('❌ Temp image serve error:', error);
    return NextResponse.json(
      { error: 'Failed to serve image' },
      { status: 500 }
    );
  }
}
