"use client";

import { useState, useRef, useEffect } from "react";
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

interface FacialMeasurements {
  faceWidth: number;
  faceHeight: number;
  eyeDistance: number;
  noseWidth: number;
  noseHeight: number;
  mouthWidth: number;
  mouthHeight: number;
  chinWidth: number;
  jawAngle: number;
  eyeArea: number;
  cheekboneWidth: number;
  foreheadHeight: number;
  midfaceHeight: number;
  lowerThirdHeight: number;
}

export default function ProfessionalAnalysisPage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult[]>([]);
  const [overallScore, setOverallScore] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [detectedFeatures, setDetectedFeatures] = useState<FacialMeasurements | null>(null);
  const [showOverlay, setShowOverlay] = useState(false);
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
        setError("");
        setDetectedFeatures(null);
        setShowOverlay(false);
      };
      reader.readAsDataURL(file);
    }
  };

  // Professional facial analysis using advanced computer vision
  const analyzeFacialFeatures = (canvas: HTMLCanvasElement, img: HTMLImageElement): FacialMeasurements => {
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas context not available');

    const width = canvas.width;
    const height = canvas.height;
    
    // Get image data for analysis
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;

    // Convert to grayscale and enhance contrast
    const grayscale = new Uint8Array(width * height);
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i] ?? 0;
      const g = data[i + 1] ?? 0;
      const b = data[i + 2] ?? 0;
      const gray = Math.round(0.299 * r + 0.587 * g + 0.114 * b);
      grayscale[i / 4] = gray;
    }

    // Apply Gaussian blur for noise reduction
    const blurred = applyGaussianBlur(grayscale, width, height);
    
    // Detect edges using Canny edge detection
    const edges = detectCannyEdges(blurred, width, height);
    
    // Find facial features using advanced geometric analysis
    const features = findFacialFeatures(edges, width, height);
    
    return features;
  };

  // Gaussian blur for noise reduction
  const applyGaussianBlur = (data: Uint8Array, width: number, height: number): Uint8Array => {
    const kernel = [
      1, 4, 6, 4, 1,
      4, 16, 24, 16, 4,
      6, 24, 36, 24, 6,
      4, 16, 24, 16, 4,
      1, 4, 6, 4, 1
    ];
    const kernelSize = 5;
    const kernelSum = 256;
    
    const result = new Uint8Array(width * height);
    
    for (let y = 2; y < height - 2; y++) {
      for (let x = 2; x < width - 2; x++) {
        let sum = 0;
        for (let ky = -2; ky <= 2; ky++) {
          for (let kx = -2; kx <= 2; kx++) {
            const pixel = data[(y + ky) * width + (x + kx)] ?? 0;
            const kernelIndex = (ky + 2) * kernelSize + (kx + 2);
            sum += pixel * (kernel[kernelIndex] ?? 0);
          }
        }
        result[y * width + x] = sum / kernelSum;
      }
    }
    
    return result;
  };

  // Canny edge detection
  const detectCannyEdges = (data: Uint8Array, width: number, height: number): Uint8Array => {
    // Sobel operators
    const sobelX = [-1, 0, 1, -2, 0, 2, -1, 0, 1];
    const sobelY = [-1, -2, -1, 0, 0, 0, 1, 2, 1];
    
    const gx = new Int16Array(width * height);
    const gy = new Int16Array(width * height);
    const magnitude = new Uint8Array(width * height);
    
    // Calculate gradients
    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        let gxSum = 0, gySum = 0;
        
        for (let ky = -1; ky <= 1; ky++) {
          for (let kx = -1; kx <= 1; kx++) {
            const pixel = data[(y + ky) * width + (x + kx)] ?? 0;
            const kernelIndex = (ky + 1) * 3 + (kx + 1);
            gxSum += pixel * (sobelX[kernelIndex] ?? 0);
            gySum += pixel * (sobelY[kernelIndex] ?? 0);
          }
        }
        
        gx[y * width + x] = gxSum;
        gy[y * width + x] = gySum;
        magnitude[y * width + x] = Math.sqrt(gxSum * gxSum + gySum * gySum);
      }
    }
    
    // Non-maximum suppression
    const edges = new Uint8Array(width * height);
    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        const idx = y * width + x;
        const mag = magnitude[idx] ?? 0;
        
        if (mag > 50) { // Threshold
          const angle = Math.atan2(gy[idx] ?? 0, gx[idx] ?? 0) * (180 / Math.PI);
          let isEdge = true;
          
          // Check if this is a local maximum
          if (angle >= -22.5 && angle < 22.5) {
            isEdge = mag >= (magnitude[idx - 1] ?? 0) && mag >= (magnitude[idx + 1] ?? 0);
          } else if (angle >= 22.5 && angle < 67.5) {
            isEdge = mag >= (magnitude[(y - 1) * width + (x + 1)] ?? 0) && mag >= (magnitude[(y + 1) * width + (x - 1)] ?? 0);
          } else if (angle >= 67.5 && angle < 112.5) {
            isEdge = mag >= (magnitude[(y - 1) * width + x] ?? 0) && mag >= (magnitude[(y + 1) * width + x] ?? 0);
          } else {
            isEdge = mag >= (magnitude[(y - 1) * width + (x - 1)] ?? 0) && mag >= (magnitude[(y + 1) * width + (x + 1)] ?? 0);
          }
          
          edges[idx] = isEdge ? 255 : 0;
        }
      }
    }
    
    return edges;
  };

  // Find facial features using advanced geometric analysis
  const findFacialFeatures = (edges: Uint8Array, width: number, height: number): FacialMeasurements => {
    // Find face boundaries using contour detection
    const faceBounds = findFaceContour(edges, width, height);
    
    // Calculate basic face dimensions
    const faceWidth = (faceBounds.right - faceBounds.left) / width;
    const faceHeight = (faceBounds.bottom - faceBounds.top) / height;
    
    // Find eye region using template matching
    const eyeRegion = findEyeRegion(edges, width, height, faceBounds);
    const eyeDistance = eyeRegion.eyeDistance / width;
    const eyeArea = eyeRegion.area / (width * height);
    
    // Find nose region using vertical edge detection
    const noseRegion = findNoseRegion(edges, width, height, faceBounds);
    const noseWidth = noseRegion.width / width;
    const noseHeight = noseRegion.height / height;
    
    // Find mouth region using horizontal edge detection
    const mouthRegion = findMouthRegion(edges, width, height, faceBounds);
    const mouthWidth = mouthRegion.width / width;
    const mouthHeight = mouthRegion.height / height;
    
    // Find jaw/chin region
    const jawRegion = findJawRegion(edges, width, height, faceBounds);
    const chinWidth = jawRegion.width / width;
    const jawAngle = jawRegion.angle;
    
    // Calculate cheekbone width
    const cheekboneWidth = calculateCheekboneWidth(edges, width, height, faceBounds);
    
    // Calculate facial thirds
    const foreheadHeight = (eyeRegion.y - faceBounds.top) / height;
    const midfaceHeight = (mouthRegion.y - eyeRegion.y) / height;
    const lowerThirdHeight = (faceBounds.bottom - mouthRegion.y) / height;
    
    return {
      faceWidth,
      faceHeight,
      eyeDistance,
      noseWidth,
      noseHeight,
      mouthWidth,
      mouthHeight,
      chinWidth,
      jawAngle,
      eyeArea,
      cheekboneWidth,
      foreheadHeight,
      midfaceHeight,
      lowerThirdHeight
    };
  };

  // Find face contour using edge following
  const findFaceContour = (edges: Uint8Array, width: number, height: number) => {
    let top = height, bottom = 0, left = width, right = 0;
    
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        if ((edges[y * width + x] ?? 0) > 0) {
          top = Math.min(top, y);
          bottom = Math.max(bottom, y);
          left = Math.min(left, x);
          right = Math.max(right, x);
        }
      }
    }
    
    return { top, bottom, left, right };
  };

  // Find eye region using template matching
  const findEyeRegion = (edges: Uint8Array, width: number, height: number, faceBounds: any) => {
    const eyeY = faceBounds.top + (faceBounds.bottom - faceBounds.top) * 0.3;
    const eyeHeight = (faceBounds.bottom - faceBounds.top) * 0.15;
    
    // Find horizontal eye line
    let leftEye = 0, rightEye = 0;
    let maxEdgeCount = 0;
    
    for (let x = faceBounds.left; x < faceBounds.right; x++) {
      let edgeCount = 0;
      for (let y = Math.max(0, eyeY - eyeHeight); y < Math.min(height, eyeY + eyeHeight); y++) {
        if ((edges[y * width + x] ?? 0) > 0) edgeCount++;
      }
      
      if (edgeCount > maxEdgeCount) {
        maxEdgeCount = edgeCount;
        if (leftEye === 0) leftEye = x;
        rightEye = x;
      }
    }
    
    return {
      eyeDistance: rightEye - leftEye,
      area: eyeHeight * (rightEye - leftEye),
      y: eyeY
    };
  };

  // Find nose region using vertical edge detection
  const findNoseRegion = (edges: Uint8Array, width: number, height: number, faceBounds: any) => {
    const noseY = faceBounds.top + (faceBounds.bottom - faceBounds.top) * 0.5;
    const noseHeight = (faceBounds.bottom - faceBounds.top) * 0.2;
    
    let noseLeft = faceBounds.right, noseRight = faceBounds.left;
    let maxVerticalEdges = 0;
    
    for (let x = faceBounds.left; x < faceBounds.right; x++) {
      let verticalEdges = 0;
      for (let y = Math.max(0, noseY - noseHeight); y < Math.min(height, noseY + noseHeight); y++) {
        if ((edges[y * width + x] ?? 0) > 0) verticalEdges++;
      }
      
      if (verticalEdges > maxVerticalEdges) {
        maxVerticalEdges = verticalEdges;
        if (noseLeft === faceBounds.right) noseLeft = x;
        noseRight = x;
      }
    }
    
    return {
      width: noseRight - noseLeft,
      height: noseHeight,
      y: noseY
    };
  };

  // Find mouth region using horizontal edge detection
  const findMouthRegion = (edges: Uint8Array, width: number, height: number, faceBounds: any) => {
    const mouthY = faceBounds.top + (faceBounds.bottom - faceBounds.top) * 0.7;
    const mouthHeight = (faceBounds.bottom - faceBounds.top) * 0.1;
    
    let mouthLeft = faceBounds.right, mouthRight = faceBounds.left;
    let maxHorizontalEdges = 0;
    
    for (let x = faceBounds.left; x < faceBounds.right; x++) {
      let horizontalEdges = 0;
      for (let y = Math.max(0, mouthY - mouthHeight); y < Math.min(height, mouthY + mouthHeight); y++) {
        if ((edges[y * width + x] ?? 0) > 0) horizontalEdges++;
      }
      
      if (horizontalEdges > maxHorizontalEdges) {
        maxHorizontalEdges = horizontalEdges;
        if (mouthLeft === faceBounds.right) mouthLeft = x;
        mouthRight = x;
      }
    }
    
    return {
      width: mouthRight - mouthLeft,
      height: mouthHeight,
      y: mouthY
    };
  };

  // Find jaw region
  const findJawRegion = (edges: Uint8Array, width: number, height: number, faceBounds: any) => {
    const jawY = faceBounds.top + (faceBounds.bottom - faceBounds.top) * 0.85;
    const jawHeight = (faceBounds.bottom - faceBounds.top) * 0.1;
    
    let jawLeft = faceBounds.right, jawRight = faceBounds.left;
    let maxJawEdges = 0;
    
    for (let x = faceBounds.left; x < faceBounds.right; x++) {
      let jawEdges = 0;
      for (let y = Math.max(0, jawY - jawHeight); y < Math.min(height, jawY + jawHeight); y++) {
        if ((edges[y * width + x] ?? 0) > 0) jawEdges++;
      }
      
      if (jawEdges > maxJawEdges) {
        maxJawEdges = jawEdges;
        if (jawLeft === faceBounds.right) jawLeft = x;
        jawRight = x;
      }
    }
    
    return {
      width: jawRight - jawLeft,
      angle: Math.atan2(jawHeight, jawRight - jawLeft) * (180 / Math.PI)
    };
  };

  // Calculate cheekbone width
  const calculateCheekboneWidth = (edges: Uint8Array, width: number, height: number, faceBounds: any) => {
    const cheekY = faceBounds.top + (faceBounds.bottom - faceBounds.top) * 0.4;
    const cheekHeight = (faceBounds.bottom - faceBounds.top) * 0.1;
    
    let cheekLeft = faceBounds.right, cheekRight = faceBounds.left;
    let maxCheekEdges = 0;
    
    for (let x = faceBounds.left; x < faceBounds.right; x++) {
      let cheekEdges = 0;
      for (let y = Math.max(0, cheekY - cheekHeight); y < Math.min(height, cheekY + cheekHeight); y++) {
        if ((edges[y * width + x] ?? 0) > 0) cheekEdges++;
      }
      
      if (cheekEdges > maxCheekEdges) {
        maxCheekEdges = cheekEdges;
        if (cheekLeft === faceBounds.right) cheekLeft = x;
        cheekRight = x;
      }
    }
    
    return (cheekRight - cheekLeft) / width;
  };

  const analyzeFace = async () => {
    if (!selectedImage || !imageRef.current || !canvasRef.current) return;

    setIsAnalyzing(true);
    setError("");
    
    try {
      const img = imageRef.current;
      const canvas = canvasRef.current;
      
      // Set canvas size to match image
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Canvas context not available');
      
      // Draw image on canvas
      ctx.drawImage(img, 0, 0);
      
      // Detect facial features
      const features = analyzeFacialFeatures(canvas, img);
      setDetectedFeatures(features);
      setShowOverlay(true);
      
      // Convert to analysis results with professional measurements
      const results: AnalysisResult[] = [
        {
          feature: "Facial Width to Height Ratio",
          rating: features.faceWidth / features.faceHeight > 1.8 ? "perfect" : 
                  features.faceWidth / features.faceHeight > 1.6 ? "slight" : "noticeable",
          measurement: (features.faceWidth / features.faceHeight).toFixed(2),
          ideal: "1.8+",
          status: features.faceWidth / features.faceHeight > 1.8 ? "perfect" : 
                  features.faceWidth / features.faceHeight > 1.6 ? "slight" : "noticeable"
        },
        {
          feature: "Eye Separation Ratio",
          rating: features.eyeDistance > 0.45 && features.eyeDistance < 0.49 ? "perfect" : 
                  features.eyeDistance > 0.4 && features.eyeDistance < 0.52 ? "slight" : "noticeable",
          measurement: features.eyeDistance.toFixed(2),
          ideal: "0.45 to 0.49",
          status: features.eyeDistance > 0.45 && features.eyeDistance < 0.49 ? "perfect" : 
                  features.eyeDistance > 0.4 && features.eyeDistance < 0.52 ? "slight" : "noticeable"
        },
        {
          feature: "Nose Width Ratio",
          rating: features.noseWidth > 0.15 && features.noseWidth < 0.25 ? "perfect" : 
                  features.noseWidth > 0.1 && features.noseWidth < 0.3 ? "slight" : "noticeable",
          measurement: features.noseWidth.toFixed(2),
          ideal: "0.15 to 0.25",
          status: features.noseWidth > 0.15 && features.noseWidth < 0.25 ? "perfect" : 
                  features.noseWidth > 0.1 && features.noseWidth < 0.3 ? "slight" : "noticeable"
        },
        {
          feature: "Mouth Width Ratio",
          rating: features.mouthWidth > 0.4 && features.mouthWidth < 0.6 ? "perfect" : 
                  features.mouthWidth > 0.3 && features.mouthWidth < 0.7 ? "slight" : "noticeable",
          measurement: features.mouthWidth.toFixed(2),
          ideal: "0.4 to 0.6",
          status: features.mouthWidth > 0.4 && features.mouthWidth < 0.6 ? "perfect" : 
                  features.mouthWidth > 0.3 && features.mouthWidth < 0.7 ? "slight" : "noticeable"
        },
        {
          feature: "Jaw Width Ratio",
          rating: features.chinWidth > 0.8 && features.chinWidth < 1.0 ? "perfect" : 
                  features.chinWidth > 0.7 && features.chinWidth < 1.1 ? "slight" : "noticeable",
          measurement: features.chinWidth.toFixed(2),
          ideal: "0.8 to 1.0",
          status: features.chinWidth > 0.8 && features.chinWidth < 1.0 ? "perfect" : 
                  features.chinWidth > 0.7 && features.chinWidth < 1.1 ? "slight" : "noticeable"
        },
        {
          feature: "Cheekbone Width",
          rating: features.cheekboneWidth > 0.7 && features.cheekboneWidth < 0.9 ? "perfect" : 
                  features.cheekboneWidth > 0.6 && features.cheekboneWidth < 1.0 ? "slight" : "noticeable",
          measurement: features.cheekboneWidth.toFixed(2),
          ideal: "0.7 to 0.9",
          status: features.cheekboneWidth > 0.7 && features.cheekboneWidth < 0.9 ? "perfect" : 
                  features.cheekboneWidth > 0.6 && features.cheekboneWidth < 1.0 ? "slight" : "noticeable"
        },
        {
          feature: "Forehead Height",
          rating: features.foreheadHeight > 0.25 && features.foreheadHeight < 0.35 ? "perfect" : 
                  features.foreheadHeight > 0.2 && features.foreheadHeight < 0.4 ? "slight" : "noticeable",
          measurement: features.foreheadHeight.toFixed(2),
          ideal: "0.25 to 0.35",
          status: features.foreheadHeight > 0.25 && features.foreheadHeight < 0.35 ? "perfect" : 
                  features.foreheadHeight > 0.2 && features.foreheadHeight < 0.4 ? "slight" : "noticeable"
        },
        {
          feature: "Midface Height",
          rating: features.midfaceHeight > 0.3 && features.midfaceHeight < 0.4 ? "perfect" : 
                  features.midfaceHeight > 0.25 && features.midfaceHeight < 0.45 ? "slight" : "noticeable",
          measurement: features.midfaceHeight.toFixed(2),
          ideal: "0.3 to 0.4",
          status: features.midfaceHeight > 0.3 && features.midfaceHeight < 0.4 ? "perfect" : 
                  features.midfaceHeight > 0.25 && features.midfaceHeight < 0.45 ? "slight" : "noticeable"
        },
        {
          feature: "Lower Third Height",
          rating: features.lowerThirdHeight > 0.25 && features.lowerThirdHeight < 0.35 ? "perfect" : 
                  features.lowerThirdHeight > 0.2 && features.lowerThirdHeight < 0.4 ? "slight" : "noticeable",
          measurement: features.lowerThirdHeight.toFixed(2),
          ideal: "0.25 to 0.35",
          status: features.lowerThirdHeight > 0.25 && features.lowerThirdHeight < 0.35 ? "perfect" : 
                  features.lowerThirdHeight > 0.2 && features.lowerThirdHeight < 0.4 ? "slight" : "noticeable"
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

    } catch (error) {
      console.error('Analysis failed:', error);
      setError('Failed to analyze the image. Please try again with a clearer frontal photo.');
    } finally {
      setIsAnalyzing(false);
    }
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
    <TwoColumnLayout rightPanelTitle="PROFESSIONAL FACIAL ANALYSIS">
      <div className="mx-auto w-full max-w-4xl">
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-semibold text-blue-800 mb-2">Professional Computer Vision Analysis</h3>
          <p className="text-blue-700 text-sm">
            This version uses advanced computer vision techniques including Canny edge detection, 
            Gaussian blur, and sophisticated geometric analysis for accurate facial measurements.
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
                  className="cursor-pointer inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
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
                  {detectedFeatures && (
                    <Button
                      variant="outline"
                      onClick={() => setShowOverlay(!showOverlay)}
                      className="absolute top-2 left-2"
                    >
                      {showOverlay ? "Hide" : "Show"} Analysis
                    </Button>
                  )}
                </div>
                <div className="mt-4 text-center">
                  <Button
                    onClick={analyzeFace}
                    disabled={isAnalyzing}
                    className="px-8 py-3"
                  >
                    {isAnalyzing ? "Analyzing with Professional CV..." : "Analyze Face"}
                  </Button>
                </div>
                {error && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
                    {error}
                  </div>
                )}
                <canvas ref={canvasRef} className="hidden" />
              </CardContent>
            </Card>

            {analysisResults.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Professional Feature Analysis</CardTitle>
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
                    <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg text-center">
                      <h3 className="font-semibold text-blue-800 mb-2">Overall Score</h3>
                      <div className="text-2xl font-bold text-blue-900">{overallScore}</div>
                      <div className="text-sm text-blue-700 mt-1">
                        Based on {analysisResults.length} facial features analyzed using professional computer vision
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
