"use client";

import { useState, useEffect } from 'react';
import { TestAnalysisProcessor } from '~/components/test-analysis-processor';

export default function TestAnalysisPage() {
  const [isTesting, setIsTesting] = useState(false);
  const [testImages, setTestImages] = useState<{
    front: string;
    left: string;
    right: string;
    leftSide: string;
    rightSide: string;
  } | null>(null);
  const [blobFiles, setBlobFiles] = useState<{
    front: File | null;
    left: File | null;
    right: File | null;
    leftSide: File | null;
    rightSide: File | null;
  }>({
    front: null,
    left: null,
    right: null,
    leftSide: null,
    rightSide: null,
  });

  const handleImageUpload = (type: 'front' | 'left' | 'right' | 'leftSide' | 'rightSide', file: File) => {
    // Clean up previous blob URL if it exists
    if (testImages && testImages[type] && testImages[type].startsWith('blob:')) {
      URL.revokeObjectURL(testImages[type]);
    }
    
    const url = URL.createObjectURL(file);
    console.log(`Created blob URL for ${type}:`, url);
    setTestImages(prev => ({
      ...prev,
      [type]: url
    } as any));
    setBlobFiles(prev => ({
      ...prev,
      [type]: file
    }));
  };

  // Cleanup blob URLs on unmount
  useEffect(() => {
    return () => {
      if (testImages) {
        Object.values(testImages).forEach(url => {
          if (url && url.startsWith('blob:')) {
            URL.revokeObjectURL(url);
          }
        });
      }
    };
  }, [testImages]);

  const startTest = () => {
    if (testImages) {
      setIsTesting(true);
    }
  };

  if (isTesting && testImages) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-3xl font-bold mb-6">MediaPipe Analysis Test</h1>
          <TestAnalysisProcessor
            analysisId="test_analysis_123"
            images={testImages}
            onComplete={(results) => {
              console.log('Analysis Results:', results);
              alert('Analysis complete! Check the console and page for results.');
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold mb-6">MediaPipe Analysis Test</h1>
        <p className="text-gray-600 mb-8">
          Upload 5 facial photos to test the MediaPipe integration without authentication.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {[
            { key: 'front', title: 'Front Facing', description: 'Look directly at camera' },
            { key: 'left', title: '3/4 Left', description: 'Turn head 45° left' },
            { key: 'right', title: '3/4 Right', description: 'Turn head 45° right' },
            { key: 'leftSide', title: 'Side Left', description: 'Turn head 90° left' },
            { key: 'rightSide', title: 'Side Right', description: 'Turn head 90° right' },
          ].map(({ key, title, description }) => (
            <div key={key} className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <h3 className="font-semibold mb-2">{title}</h3>
              <p className="text-sm text-gray-600 mb-4">{description}</p>
              
              {testImages?.[key as keyof typeof testImages] ? (
                <div>
                  <img 
                    src={testImages[key as keyof typeof testImages]!} 
                    alt={title}
                    className="w-full h-32 object-cover rounded mb-2"
                  />
                  <button
                    onClick={() => setTestImages(prev => ({ ...prev, [key]: null } as any))}
                    className="text-sm text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleImageUpload(key as keyof typeof testImages, file);
                    }}
                    className="hidden"
                    id={`upload-${key}`}
                  />
                  <label
                    htmlFor={`upload-${key}`}
                    className="cursor-pointer inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Upload Photo
                  </label>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={startTest}
            disabled={!testImages || Object.values(testImages).some(img => !img)}
            className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Start MediaPipe Analysis Test
          </button>
        </div>

        <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h3 className="font-semibold text-yellow-800 mb-2">Note:</h3>
          <p className="text-yellow-700 text-sm">
            This is a test page that bypasses authentication. The analysis will run in your browser 
            using MediaPipe, but the results won't be saved to the database. Check the browser console 
            for detailed processing information.
          </p>
        </div>
      </div>
    </div>
  );
}