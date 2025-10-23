import { NextRequest, NextResponse } from 'next/server';

// Simple in-memory storage for temporary images
const imageStore = new Map<string, string>();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { base64Data } = body;

    if (!base64Data) {
      return NextResponse.json(
        { error: 'Base64 data is required' },
        { status: 400 }
      );
    }

    // Generate a unique ID for this image
    const imageId = Math.random().toString(36).substring(2, 15);
    
    // Store the base64 data
    imageStore.set(imageId, base64Data);
    
    // Create a public URL - use the external IP instead of localhost
    const host = request.headers.get('host') || 'localhost:3002';
    const protocol = request.headers.get('x-forwarded-proto') || 'http';
    const publicUrl = `${protocol}://${host}/api/temp-image/${imageId}`;
    
    // Clean up old images (keep only last 10)
    if (imageStore.size > 10) {
      const firstKey = imageStore.keys().next().value;
      imageStore.delete(firstKey);
    }

    return NextResponse.json({
      success: true,
      publicUrl,
      imageId,
    });

  } catch (error: any) {
    console.error('❌ Temp image upload error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create temporary image URL' },
      { status: 500 }
    );
  }
}

// Export the image store for the GET endpoint
export { imageStore };
