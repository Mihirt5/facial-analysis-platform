import { NextRequest, NextResponse } from 'next/server';
import { UTApi } from 'uploadthing/server';

const utapi = new UTApi();

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    console.log('📤 Uploading file to UploadThing:', file.name, file.size, 'bytes');

    // Upload to UploadThing using the publicImageUploader route
    const uploadResult = await utapi.uploadFiles(file, {
      route: 'publicImageUploader',
    });

    if (!uploadResult || !uploadResult[0]?.url) {
      console.error('❌ Upload failed - no URL returned:', uploadResult);
      throw new Error('Upload failed - no URL returned');
    }

    const publicUrl = uploadResult[0].url;
    console.log('✅ Upload successful:', publicUrl);

    return NextResponse.json({
      success: true,
      url: publicUrl,
      name: uploadResult[0].name,
      size: uploadResult[0].size,
    });

  } catch (error: any) {
    console.error('❌ UploadThing upload error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to upload file' },
      { status: 500 }
    );
  }
}
