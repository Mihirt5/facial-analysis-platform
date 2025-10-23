import { NextRequest, NextResponse } from 'next/server';
import { analyzeSkinWithZyla } from '~/lib/zyla-skin-analyzer';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { imageUrl } = body;

    if (!imageUrl) {
      return NextResponse.json(
        { error: 'Image URL is required' },
        { status: 400 }
      );
    }

    // Validate URL format - allow both HTTP URLs and base64 data URLs
    const isDataUrl = imageUrl.startsWith('data:');
    const isHttpUrl = imageUrl.startsWith('http://') || imageUrl.startsWith('https://');
    
    if (!isDataUrl && !isHttpUrl) {
      return NextResponse.json(
        { error: 'Invalid image URL format. Must be a data URL (data:image/...) or HTTP URL (http://... or https://...)' },
        { status: 400 }
      );
    }
    
    // For HTTP URLs, validate they're properly formatted
    if (isHttpUrl) {
      try {
        new URL(imageUrl);
      } catch {
        return NextResponse.json(
          { error: 'Invalid HTTP URL format' },
          { status: 400 }
        );
      }
    }

    console.log('🔬 Processing Zyla analysis request...');

    // Call Zyla API
    const analysis = await analyzeSkinWithZyla(imageUrl);

    console.log('✅ Analysis complete, returning results');

    return NextResponse.json({
      success: true,
      data: analysis,
    });

  } catch (error: any) {
    console.error('❌ Zyla analysis API error:', error);
    
    // Provide detailed error information for debugging
    const errorResponse: any = { 
      error: error.message || 'Failed to analyze image',
    };
    
    // Include more details in development mode
    if (process.env.NODE_ENV === 'development') {
      errorResponse.details = error.stack;
      errorResponse.type = error.name;
    }
    
    return NextResponse.json(errorResponse, { status: 500 });
  }
}

