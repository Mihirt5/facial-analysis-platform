"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Upload, Loader2, CheckCircle2, AlertCircle, Info, BarChart3 } from "lucide-react";
import type { SkinAnalysisResult } from "~/lib/zyla-skin-analyzer";
import { saveAnalysisResult } from "~/lib/analysis-storage";

interface ZylaAnalysisData {
  results: SkinAnalysisResult[];
  overallScore: number;
  overallSummary: string;
}

export default function ZylaTestPage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [publicImageUrl, setPublicImageUrl] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisData, setAnalysisData] = useState<ZylaAnalysisData | null>(null);
  const [error, setError] = useState<string>("");

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
        setAnalysisData(null);
        setError("");
        setPublicImageUrl(""); // Reset public URL when new image is selected
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadToPublicUrl = async (base64Data: string): Promise<string> => {
    setIsUploading(true);
    setError("");

    try {
      console.log('🔄 Converting base64 to public URL...');
      
      // For now, let's use a simple approach that works
      // Convert base64 to blob
      const response = await fetch(base64Data);
      const blob = await response.blob();

      // Create FormData for imgur upload
      const formData = new FormData();
      formData.append('image', blob);

      // Try imgur first (free, no API key needed for anonymous uploads)
      try {
        const imgurResponse = await fetch('https://api.imgur.com/3/image', {
          method: 'POST',
          headers: {
            'Authorization': 'Client-ID 546c25a59c58ad7', // Public client ID for anonymous uploads
          },
          body: formData,
        });

        if (imgurResponse.ok) {
          const imgurData = await imgurResponse.json();
          
          if (imgurData.success && imgurData.data?.link) {
            const publicUrl = imgurData.data.link;
            console.log('✅ Created public URL via imgur:', publicUrl);
            return publicUrl;
          }
        }
      } catch (imgurError) {
        console.log('Imgur upload failed, trying alternative...');
      }

      // Fallback: Try UploadThing
      try {
        const uploadFormData = new FormData();
        uploadFormData.append('file', blob, 'image.jpg');

        const uploadResponse = await fetch('/api/uploadthing-upload', {
          method: 'POST',
          body: uploadFormData,
        });

        if (uploadResponse.ok) {
          const uploadData = await uploadResponse.json();
          if (uploadData.url) {
            console.log('✅ Created public URL via UploadThing:', uploadData.url);
            return uploadData.url;
          }
        }
      } catch (uploadError) {
        console.log('UploadThing upload failed...');
      }

      // If all else fails, provide clear instructions
      throw new Error(
        'Automatic upload failed. Please use the manual method:\n\n' +
        '1. Go to https://imgur.com or https://postimages.org\n' +
        '2. Upload your image\n' +
        '3. Copy the direct image URL (ends with .jpg, .png, etc.)\n' +
        '4. Paste it in the URL field below\n' +
        '5. Click "Analyze Skin"'
      );
      
    } catch (err) {
      console.error('Upload error:', err);
      throw err;
    } finally {
      setIsUploading(false);
    }
  };

  const analyzeSkin = async () => {
    const imageToAnalyze = imageUrl || selectedImage;
    if (!imageToAnalyze) return;

    setIsAnalyzing(true);
    setError("");

    try {
      let finalImageUrl = imageToAnalyze;
      
      // If it's a base64 data URL, convert it to a public HTTP URL
      if (imageToAnalyze.startsWith('data:')) {
        console.log('🔄 Converting base64 to public URL...');
        
        // Check if we already have a public URL for this image
        if (!publicImageUrl) {
          finalImageUrl = await uploadToPublicUrl(imageToAnalyze);
          setPublicImageUrl(finalImageUrl);
        } else {
          finalImageUrl = publicImageUrl;
        }
        
        console.log('✅ Using public URL:', finalImageUrl);
      }
      
      console.log('🚀 Starting analysis with image type:', 
        finalImageUrl.startsWith('data:') ? 'Base64 Data URL' : 'HTTP URL'
      );
      
      const response = await fetch('/api/zyla-analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imageUrl: finalImageUrl }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('API Error Response:', errorData);
        throw new Error(errorData.error || 'Analysis failed');
      }

      const result = await response.json();
      console.log('API Success Response:', result);
      
      if (result.success && result.data) {
        setAnalysisData(result.data);
        
        // Save analysis result to dashboard
        try {
          saveAnalysisResult('zyla', finalImageUrl, result.data);
          console.log('✅ Analysis saved to dashboard');
        } catch (saveError) {
          console.warn('⚠️ Failed to save analysis:', saveError);
        }
      } else {
        throw new Error('Invalid response format from API');
      }
      
    } catch (err: any) {
      console.error('Analysis error:', err);
      const errorMessage = err.message || 'Failed to analyze image. Please try again.';
      
      // Add helpful context for common errors
      if (errorMessage.includes('Unexpected API response structure')) {
        setError(`${errorMessage}\n\nℹ️ The Zyla API may have a different response format than expected. Check the console for the raw API response.`);
      } else if (errorMessage.includes('No analyzable skin metrics')) {
        setError(`${errorMessage}\n\nℹ️ Try uploading a different image with a clear frontal face.`);
      } else {
        setError(errorMessage);
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'excellent':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'good':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'moderate':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'poor':
        return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'severe':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getSeverityIcon = (severity: string) => {
    if (severity === 'excellent' || severity === 'good') {
      return <CheckCircle2 className="w-5 h-5" />;
    }
    return <AlertCircle className="w-5 h-5" />;
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-600';
    if (score >= 70) return 'text-blue-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Zyla Skin Analysis Test
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Test the Zyla Skin Face Data Analyzer API integration. Upload a facial image to receive comprehensive skin health analysis.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {/* Left Column - Image Upload */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Upload Image</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Upload Button */}
                <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 transition-colors">
                  <label className="cursor-pointer flex flex-col items-center">
                    <Upload className="w-12 h-12 text-gray-400 mb-3" />
                    <span className="text-sm text-gray-600 mb-2">
                      Click to upload or drag and drop
                    </span>
                    <span className="text-xs text-gray-400">
                      PNG, JPG up to 10MB
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Image Preview */}
                {selectedImage && (
                  <div className="relative">
                    <img
                      src={selectedImage}
                      alt="Uploaded face"
                      className="w-full rounded-lg shadow-lg"
                    />
                    {imageFile && (
                      <div className="mt-2 text-sm text-gray-600">
                        <span className="font-medium">{imageFile.name}</span>
                        <span className="text-gray-400 ml-2">
                          ({(imageFile.size / 1024).toFixed(0)} KB)
                        </span>
                      </div>
                    )}
                  </div>
                )}

                    {/* URL Input - Make this more prominent */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        📋 <strong>Recommended:</strong> Paste an image URL:
                      </label>
                      <input
                        type="url"
                        value={imageUrl}
                        onChange={(e) => {
                          setImageUrl(e.target.value);
                          setSelectedImage(null);
                          setImageFile(null);
                          setAnalysisData(null);
                          setError("");
                        }}
                        placeholder="https://example.com/image.jpg"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <div className="text-xs text-gray-500 space-y-1">
                        <p>✅ <strong>Quick Solution:</strong> Upload to <a href="https://imgur.com" target="_blank" rel="noopener noreferrer" className="underline text-blue-600">imgur.com</a> or <a href="https://postimages.org" target="_blank" rel="noopener noreferrer" className="underline text-blue-600">postimages.org</a></p>
                        <p>📋 Copy the direct image URL (ends with .jpg, .png, etc.)</p>
                        <p>⚠️ Must be a publicly accessible HTTP/HTTPS URL (not base64)</p>
                      </div>
                    </div>

                {/* Public URL Status */}
                {publicImageUrl && (
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-green-800 mb-1">Public URL Created</p>
                        <p className="text-xs text-green-700 break-all">{publicImageUrl}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Analyze Button */}
                <Button
                  onClick={analyzeSkin}
                  disabled={(!selectedImage && !imageUrl) || isAnalyzing || isUploading}
                  className="w-full"
                  size="lg"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Converting to Public URL...
                    </>
                  ) : isAnalyzing ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    'Analyze Skin'
                  )}
                </Button>

                {/* Dashboard Button */}
                <Button
                  onClick={() => window.open('/analysis-dashboard', '_blank')}
                  variant="outline"
                  className="w-full"
                  size="lg"
                >
                  <BarChart3 className="mr-2 h-5 w-5" />
                  View Analysis Dashboard
                </Button>
                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-red-800 mb-1">Analysis Error</p>
                        <p className="text-sm text-red-700 whitespace-pre-line">{error}</p>
                      </div>
                    </div>
                  </div>
                )}

                    {/* API Info */}
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-start gap-3">
                        <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div className="text-sm text-blue-800">
                          <p className="font-medium mb-1">Using Zyla API</p>
                          <p className="text-blue-700 mb-2">
                            This test page uses the Zyla Skin Face Data Analyzer API to provide 
                            comprehensive skin health analysis including acne, wrinkles, pores, 
                            texture, hydration, and pigmentation assessment.
                          </p>
                          <p className="text-xs text-blue-600 border-t border-blue-200 pt-2 mt-2">
                            ⚠️ <strong>Important:</strong> Zyla API requires publicly accessible HTTP URLs (not base64 data URLs).
                            <br />
                            <strong>Quick Solution:</strong> Upload your image to <a href="https://imgur.com" target="_blank" rel="noopener noreferrer" className="underline">imgur.com</a> or <a href="https://postimages.org" target="_blank" rel="noopener noreferrer" className="underline">postimages.org</a>, then paste the direct image URL below.
                            <br />
                            Check your terminal/console for detailed API responses.
                          </p>
                        </div>
                      </div>
                    </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Results */}
          <div className="space-y-6">
            {analysisData ? (
              <>
                {/* Overall Score Card */}
                <Card>
                  <CardHeader>
                    <CardTitle>Overall Skin Health</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-6">
                      <div className={`text-6xl font-bold mb-2 ${getScoreColor(analysisData.overallScore)}`}>
                        {analysisData.overallScore}
                      </div>
                      <div className="text-sm text-gray-500 mb-4">out of 100</div>
                      <p className="text-gray-700 max-w-md mx-auto">
                        {analysisData.overallSummary}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Detailed Results */}
                <Card>
                  <CardHeader>
                    <CardTitle>Detailed Analysis</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {analysisData.results.map((result, index) => (
                        <div
                          key={index}
                          className={`p-4 rounded-lg border ${getSeverityColor(result.severity)}`}
                        >
                          <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 mt-0.5">
                              {getSeverityIcon(result.severity)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                <h3 className="font-semibold text-sm">
                                  {result.metric}
                                </h3>
                                <span className="text-xs font-medium uppercase tracking-wide">
                                  {result.severity}
                                </span>
                              </div>
                              <p className="text-sm font-medium mb-1">
                                {result.value}
                              </p>
                              <p className="text-xs opacity-80">
                                {result.description}
                              </p>
                              {result.affectedAreas && result.affectedAreas.length > 0 && (
                                <div className="mt-2 pt-2 border-t border-current/20">
                                  <p className="text-xs font-medium">Affected areas:</p>
                                  <p className="text-xs opacity-80">
                                    {result.affectedAreas.join(', ')}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Category Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle>Summary by Category</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {Array.from(new Set(analysisData.results.map(r => r.category))).map(category => {
                        const categoryResults = analysisData.results.filter(r => r.category === category);
                        const avgSeverity = categoryResults.reduce((sum, r) => {
                          const scores = { excellent: 5, good: 4, moderate: 3, poor: 2, severe: 1 };
                          return sum + (scores[r.severity] || 3);
                        }, 0) / categoryResults.length;
                        
                        return (
                          <div key={category} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <span className="font-medium text-sm">{category}</span>
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-gray-600">
                                {categoryResults.length} metric{categoryResults.length > 1 ? 's' : ''}
                              </span>
                              <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                  className={`h-full ${
                                    avgSeverity >= 4.5 ? 'bg-green-500' :
                                    avgSeverity >= 3.5 ? 'bg-blue-500' :
                                    avgSeverity >= 2.5 ? 'bg-yellow-500' :
                                    'bg-red-500'
                                  }`}
                                  style={{ width: `${(avgSeverity / 5) * 100}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <Upload className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No Analysis Yet
                  </h3>
                  <p className="text-sm text-gray-600 max-w-sm">
                    Upload an image and click "Analyze Skin" to see comprehensive skin health metrics.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

