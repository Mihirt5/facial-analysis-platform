"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Upload, Loader2, CheckCircle2, AlertCircle, Info, BarChart3 } from "lucide-react";
import { saveAnalysisResult } from "~/lib/analysis-storage";

interface GPT5AnalysisData {
  analysis: any; // Can be string or structured JSON object
  model?: string;
  usage?: any;
}

export default function OpenRouterTestPage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string>(""); // New state for URL input
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisData, setAnalysisData] = useState<GPT5AnalysisData | null>(null);
  const [error, setError] = useState<string>("");

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImageUrl(""); // Clear URL input when file is uploaded
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
        setAnalysisData(null);
        setError("");
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeWithGPT5 = async () => {
    const imageToAnalyze = imageUrl || selectedImage; // Use URL input if available, otherwise file upload
    if (!imageToAnalyze) return;

    setIsAnalyzing(true);
    setError("");

    try {
      console.log('🚀 Starting GPT-5 analysis with image type:', 
        imageToAnalyze.startsWith('data:') ? 'Base64 Data URL' : 'HTTP URL'
      );
      
      const response = await fetch('/api/openrouter-analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imageUrl: imageToAnalyze }),
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
          saveAnalysisResult('openrouter', imageToAnalyze, result.data);
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
      setError(errorMessage);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            OpenRouter GPT-5 Analysis Test
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Test the OpenRouter GPT-5 integration for comprehensive facial analysis. Upload a facial image to receive detailed analysis across 7 categories.
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

                {/* URL Input */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    📋 <strong>Or paste an image URL:</strong>
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
                  <div className="text-xs text-gray-500">
                    <p>✅ Supports both HTTP URLs and base64 data URLs</p>
                    <p>📋 GPT-5 can analyze images from any publicly accessible URL</p>
                  </div>
                </div>

                {/* Analyze Button */}
                <Button
                  onClick={analyzeWithGPT5}
                  disabled={(!selectedImage && !imageUrl) || isAnalyzing}
                  className="w-full"
                  size="lg"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Analyzing with GPT-5...
                    </>
                  ) : (
                    'Analyze with GPT-5'
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
                      <p className="font-medium mb-1">Using OpenRouter (GPT-5)</p>
                      <p className="text-blue-700 mb-2">
                        This test page uses OpenRouter's GPT-5 model to provide 
                        comprehensive facial analysis across 7 categories: facial structure & proportions,
                        skin & texture analysis, feature-level evaluation, expression & emotional readout,
                        age & health estimation, makeup detection & style mapping, and lighting & image quality factors.
                      </p>
                      <p className="text-xs text-blue-600 border-t border-blue-200 pt-2 mt-2">
                        ℹ️ <strong>Note:</strong> This is a test page that bypasses authentication. 
                        Check your terminal/console for detailed API responses and processing logs.
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
                {/* Analysis Results */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                      GPT-5 Analysis Results
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {analysisData.analysis && typeof analysisData.analysis === 'object' ? (
                      // Display structured JSON analysis
                      <div className="space-y-4">
                        {Object.entries(analysisData.analysis).map(([category, content]) => (
                          <div key={category} className="border-l-4 border-blue-200 pl-4">
                            <h3 className="font-semibold text-gray-800 mb-2">{category}</h3>
                            <div className="text-gray-700 text-sm leading-relaxed">
                              {typeof content === 'string' ? (
                                <p className="whitespace-pre-wrap">{content}</p>
                              ) : (
                                <pre className="text-xs bg-gray-50 p-2 rounded overflow-auto">
                                  {JSON.stringify(content, null, 2)}
                                </pre>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      // Display text analysis
                      <div className="prose prose-sm max-w-none">
                        <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                          {analysisData.analysis}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Raw Response (Collapsible) */}
                {analysisData.rawResponse && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Raw API Response</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <details className="group">
                        <summary className="cursor-pointer text-sm text-gray-600 hover:text-gray-800">
                          Click to view raw response
                        </summary>
                        <pre className="mt-2 p-3 bg-gray-50 rounded text-xs overflow-auto max-h-64">
                          {JSON.stringify(analysisData.rawResponse, null, 2)}
                        </pre>
                      </details>
                    </CardContent>
                  </Card>
                )}
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
                    Upload an image and click "Analyze with Claude 4.5" to see comprehensive facial analysis results.
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
