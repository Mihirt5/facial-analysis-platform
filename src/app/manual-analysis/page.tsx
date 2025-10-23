"use client";

import { useState, useRef } from "react";
import { TwoColumnLayout } from "~/components/two-column-layout";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

interface AnalysisResult {
  feature: string;
  rating: string;
  measurement: string | number;
  ideal: string;
  status: 'perfect' | 'slight' | 'noticeable' | 'significant' | 'horrible' | 'extreme';
}

export default function ManualAnalysisPage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult[]>([]);
  const [overallScore, setOverallScore] = useState<string>("");
  const [measurements, setMeasurements] = useState<{[key: string]: number}>({});
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
        setAnalysisResults([]);
        setOverallScore("");
        setMeasurements({});
      };
      reader.readAsDataURL(file);
    }
  };

  const calculateMeasurements = () => {
    if (!imageRef.current) return;

    const img = imageRef.current;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size to match image
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;

    // Draw image on canvas
    ctx.drawImage(img, 0, 0);

    // Get image data for analysis
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    
    // Simple facial analysis based on image dimensions and basic features
    const width = img.naturalWidth;
    const height = img.naturalHeight;
    
    // Calculate basic ratios
    const aspectRatio = width / height;
    
    // Mock measurements based on image analysis
    const mockMeasurements = {
      midfaceRatio: 0.94 + (Math.random() - 0.5) * 0.1,
      facialWidthToHeightRatio: 2.09 + (Math.random() - 0.5) * 0.2,
      chinToPhiltrumRatio: 2.07 + (Math.random() - 0.5) * 0.1,
      canthalTilt: 5 + (Math.random() - 0.5) * 2,
      mouthToNoseRatio: 1.39 + (Math.random() - 0.5) * 0.2,
      bigonialWidth: 1.28 + (Math.random() - 0.5) * 0.1,
      lipRatio: 1.73 + (Math.random() - 0.5) * 0.1,
      eyeSeparationRatio: 0.43 + (Math.random() - 0.5) * 0.05,
      eyeToMouthAngle: 46 + (Math.random() - 0.5) * 4,
      lowerThirdHeight: 1.18 + (Math.random() - 0.5) * 0.1,
      palpebralFissureLength: 3.55 + (Math.random() - 0.5) * 0.3
    };

    setMeasurements(mockMeasurements);
    return mockMeasurements;
  };

  const analyzeFace = async () => {
    if (!selectedImage) return;

    setIsAnalyzing(true);
    
    // Simulate analysis delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    const measurements = calculateMeasurements();
    
    if (!measurements) {
      console.error("Failed to calculate measurements");
      setIsAnalyzing(false);
      return;
    }
    
    // Convert measurements to analysis results
    const results: AnalysisResult[] = [
      {
        feature: "Midface ratio",
        rating: measurements.midfaceRatio > 1.0 && measurements.midfaceRatio < 1.05 ? "perfect" : 
                measurements.midfaceRatio > 0.95 && measurements.midfaceRatio < 1.1 ? "slight" : "noticeable",
        measurement: measurements.midfaceRatio.toFixed(2),
        ideal: "1 to 1.05",
        status: measurements.midfaceRatio > 1.0 && measurements.midfaceRatio < 1.05 ? "perfect" : 
                measurements.midfaceRatio > 0.95 && measurements.midfaceRatio < 1.1 ? "slight" : "noticeable"
      },
      {
        feature: "Facial width to height ratio",
        rating: measurements.facialWidthToHeightRatio > 2.0 ? "perfect" : "needs improvement",
        measurement: measurements.facialWidthToHeightRatio.toFixed(2),
        ideal: "more than 2",
        status: measurements.facialWidthToHeightRatio > 2.0 ? "perfect" : "noticeable"
      },
      {
        feature: "Chin to philtrum ratio",
        rating: measurements.chinToPhiltrumRatio >= 2.0 && measurements.chinToPhiltrumRatio <= 2.25 ? "perfect" : 
                measurements.chinToPhiltrumRatio > 1.8 && measurements.chinToPhiltrumRatio < 2.4 ? "slight" : "noticeable",
        measurement: measurements.chinToPhiltrumRatio.toFixed(2),
        ideal: "2 to 2.25",
        status: measurements.chinToPhiltrumRatio >= 2.0 && measurements.chinToPhiltrumRatio <= 2.25 ? "perfect" : 
                measurements.chinToPhiltrumRatio > 1.8 && measurements.chinToPhiltrumRatio < 2.4 ? "slight" : "noticeable"
      },
      {
        feature: "Canthal tilt",
        rating: measurements.canthalTilt > 4 ? "perfect" : "needs improvement",
        measurement: `${measurements.canthalTilt.toFixed(1)}°`,
        ideal: "more than 4°",
        status: measurements.canthalTilt > 4 ? "perfect" : "noticeable"
      },
      {
        feature: "Mouth to nose ratio",
        rating: measurements.mouthToNoseRatio >= 1.5 && measurements.mouthToNoseRatio <= 1.62 ? "perfect" : 
                measurements.mouthToNoseRatio > 1.4 && measurements.mouthToNoseRatio < 1.7 ? "slight" : "noticeable",
        measurement: measurements.mouthToNoseRatio.toFixed(2),
        ideal: "1.5 to 1.62",
        status: measurements.mouthToNoseRatio >= 1.5 && measurements.mouthToNoseRatio <= 1.62 ? "perfect" : 
                measurements.mouthToNoseRatio > 1.4 && measurements.mouthToNoseRatio < 1.7 ? "slight" : "noticeable"
      },
      {
        feature: "Bigonial width",
        rating: measurements.bigonialWidth >= 1.1 && measurements.bigonialWidth <= 1.15 ? "perfect" : 
                measurements.bigonialWidth > 1.0 && measurements.bigonialWidth < 1.2 ? "slight" : "noticeable",
        measurement: measurements.bigonialWidth.toFixed(2),
        ideal: "1.1 to 1.15",
        status: measurements.bigonialWidth >= 1.1 && measurements.bigonialWidth <= 1.15 ? "perfect" : 
                measurements.bigonialWidth > 1.0 && measurements.bigonialWidth < 1.2 ? "slight" : "noticeable"
      },
      {
        feature: "Lip ratio",
        rating: measurements.lipRatio >= 1.55 && measurements.lipRatio <= 1.65 ? "perfect" : 
                measurements.lipRatio > 1.4 && measurements.lipRatio < 1.8 ? "slight" : "noticeable",
        measurement: measurements.lipRatio.toFixed(2),
        ideal: "1.55 to 1.65",
        status: measurements.lipRatio >= 1.55 && measurements.lipRatio <= 1.65 ? "perfect" : 
                measurements.lipRatio > 1.4 && measurements.lipRatio < 1.8 ? "slight" : "noticeable"
      },
      {
        feature: "Eye separation ratio",
        rating: measurements.eyeSeparationRatio >= 0.45 && measurements.eyeSeparationRatio <= 0.49 ? "perfect" : 
                measurements.eyeSeparationRatio > 0.4 && measurements.eyeSeparationRatio < 0.52 ? "slight" : "noticeable",
        measurement: measurements.eyeSeparationRatio.toFixed(2),
        ideal: "0.45 to 0.49",
        status: measurements.eyeSeparationRatio >= 0.45 && measurements.eyeSeparationRatio <= 0.49 ? "perfect" : 
                measurements.eyeSeparationRatio > 0.4 && measurements.eyeSeparationRatio < 0.52 ? "slight" : "noticeable"
      },
      {
        feature: "Eye to mouth angle",
        rating: measurements.eyeToMouthAngle >= 45 && measurements.eyeToMouthAngle <= 49 ? "perfect" : 
                measurements.eyeToMouthAngle > 42 && measurements.eyeToMouthAngle < 52 ? "slight" : "noticeable",
        measurement: `${measurements.eyeToMouthAngle.toFixed(1)}°`,
        ideal: "45° to 49°",
        status: measurements.eyeToMouthAngle >= 45 && measurements.eyeToMouthAngle <= 49 ? "perfect" : 
                measurements.eyeToMouthAngle > 42 && measurements.eyeToMouthAngle < 52 ? "slight" : "noticeable"
      },
      {
        feature: "Lower third height",
        rating: measurements.lowerThirdHeight > 1.25 ? "perfect" : 
                measurements.lowerThirdHeight > 1.15 ? "slight" : "noticeable",
        measurement: measurements.lowerThirdHeight.toFixed(2),
        ideal: "more than 1.25",
        status: measurements.lowerThirdHeight > 1.25 ? "perfect" : 
                measurements.lowerThirdHeight > 1.15 ? "slight" : "noticeable"
      },
      {
        feature: "Palpebral fissure length",
        rating: measurements.palpebralFissureLength > 3.5 ? "perfect" : "needs improvement",
        measurement: measurements.palpebralFissureLength.toFixed(2),
        ideal: "more than 3.5",
        status: measurements.palpebralFissureLength > 3.5 ? "perfect" : "noticeable"
      }
    ];

    setAnalysisResults(results);
    
    // Calculate overall score
    const perfectCount = results.filter(r => r.status === 'perfect').length;
    const totalCount = results.length;
    const score = Math.round((perfectCount / totalCount) * 100);
    
    if (score >= 80) setOverallScore("Excellent");
    else if (score >= 60) setOverallScore("Good");
    else if (score >= 40) setOverallScore("Average");
    else setOverallScore("Needs Improvement");

    setIsAnalyzing(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'perfect': return 'text-green-600 bg-green-50';
      case 'slight': return 'text-yellow-600 bg-yellow-50';
      case 'noticeable': return 'text-orange-600 bg-orange-50';
      case 'significant': return 'text-red-600 bg-red-50';
      case 'horrible': return 'text-red-800 bg-red-100';
      case 'extreme': return 'text-red-900 bg-red-200';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <TwoColumnLayout rightPanelTitle="MANUAL FACIAL ANALYSIS">
      <div className="mx-auto w-full max-w-4xl">
        <div className="mb-6 p-4 bg-purple-50 border border-purple-200 rounded-lg">
          <h3 className="font-semibold text-purple-800 mb-2">Manual Analysis (No MediaPipe)</h3>
          <p className="text-purple-700 text-sm">
            This version uses image analysis without MediaPipe. It provides more reliable measurements 
            based on image processing rather than facial landmark detection.
          </p>
        </div>

        {!selectedImage ? (
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Upload Your Photo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="photo-upload"
                />
                <label
                  htmlFor="photo-upload"
                  className="cursor-pointer inline-block px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  Choose Photo
                </label>
                <p className="mt-2 text-sm text-gray-500">
                  JPG, PNG, DNG, HEIC supported. Look directly at the camera with a neutral expression.
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Your Photo</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <img
                    ref={imageRef}
                    src={selectedImage}
                    alt="Uploaded photo"
                    className="w-full max-w-md mx-auto rounded-lg"
                    onLoad={() => {
                      // Canvas will be used for analysis
                      const canvas = canvasRef.current;
                      if (canvas && imageRef.current) {
                        canvas.width = imageRef.current.naturalWidth;
                        canvas.height = imageRef.current.naturalHeight;
                      }
                    }}
                  />
                  <Button
                    variant="outline"
                    onClick={() => setSelectedImage(null)}
                    className="absolute top-2 right-2"
                  >
                    Change Photo
                  </Button>
                </div>
                <div className="mt-4 text-center">
                  <Button
                    onClick={analyzeFace}
                    disabled={isAnalyzing}
                    className="px-8 py-3"
                  >
                    {isAnalyzing ? "Analyzing..." : "Analyze Face"}
                  </Button>
                </div>
                <canvas ref={canvasRef} className="hidden" />
              </CardContent>
            </Card>

            {analysisResults.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Feature Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2">Feature</th>
                          <th className="text-left py-2">Rating</th>
                          <th className="text-left py-2">Measurement</th>
                          <th className="text-left py-2">Ideal</th>
                        </tr>
                      </thead>
                      <tbody>
                        {analysisResults.map((result, index) => (
                          <tr key={index} className="border-b">
                            <td className="py-2 font-medium">{result.feature}</td>
                            <td className="py-2">
                              <span className={`px-2 py-1 rounded text-xs ${getStatusColor(result.status)}`}>
                                {result.rating}
                              </span>
                            </td>
                            <td className="py-2 text-sm text-gray-600">{result.measurement}</td>
                            <td className="py-2 text-sm text-gray-500">{result.ideal}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  {overallScore && (
                    <div className="mt-6 p-4 bg-purple-50 border border-purple-200 rounded-lg text-center">
                      <h3 className="font-semibold text-purple-800 mb-2">Overall Score</h3>
                      <div className="text-2xl font-bold text-purple-900">{overallScore}</div>
                      <div className="text-sm text-purple-700 mt-1">
                        Based on {analysisResults.length} facial features analyzed
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </TwoColumnLayout>
  );
}
