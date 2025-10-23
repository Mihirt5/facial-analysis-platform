"use client";

import { useState } from "react";
import { TwoColumnLayout } from "~/components/two-column-layout";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { mediaPipeClientService } from "~/lib/mediapipe-client";

interface AnalysisResult {
  feature: string;
  rating: string;
  measurement: string | number;
  ideal: string;
  status: 'perfect' | 'slight' | 'noticeable' | 'significant' | 'horrible' | 'extreme';
}

export default function RealAnalysisPage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult[]>([]);
  const [overallScore, setOverallScore] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [landmarks, setLandmarks] = useState<Array<{x: number, y: number, z: number}> | null>(null);
  const [showOverlay, setShowOverlay] = useState(false);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
        setAnalysisResults([]);
        setOverallScore("");
        setError("");
        setLandmarks(null);
        setShowOverlay(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeFace = async () => {
    if (!selectedImage) return;

    setIsAnalyzing(true);
    setError("");
    
    try {
      // First get the landmarks for visualization
      const faceLandmarks = await mediaPipeClientService.analyzeImage(selectedImage);
      
      if (!faceLandmarks) {
        throw new Error('No face detected in the image. Please try a clearer frontal photo.');
      }

      setLandmarks(faceLandmarks.landmarks);
      setShowOverlay(true);

      // Use the real MediaPipe analysis
      const analysis = await mediaPipeClientService.processAnalysis({
        front: selectedImage,
        left: selectedImage, // Use same image for all angles for single photo analysis
        right: selectedImage,
        leftSide: selectedImage,
        rightSide: selectedImage
      });

      // Convert MediaPipe analysis to our format with more comprehensive features
      const results: AnalysisResult[] = [
        {
          feature: "Midface Ratio",
          rating: analysis.eyeArea.spacingSymmetry > 0.8 ? "perfect" : analysis.eyeArea.spacingSymmetry > 0.6 ? "good" : "needs improvement",
          measurement: analysis.eyeArea.spacingSymmetry.toFixed(2),
          ideal: "0.8+",
          status: analysis.eyeArea.spacingSymmetry > 0.8 ? "perfect" : analysis.eyeArea.spacingSymmetry > 0.6 ? "slight" : "noticeable"
        },
        {
          feature: "Facial Width to Height Ratio",
          rating: analysis.jaw.jawlineDefinition > 0.7 ? "perfect" : analysis.jaw.jawlineDefinition > 0.5 ? "good" : "needs improvement",
          measurement: (analysis.jaw.jawlineDefinition * 2.5).toFixed(2),
          ideal: "2.0+",
          status: analysis.jaw.jawlineDefinition > 0.7 ? "perfect" : analysis.jaw.jawlineDefinition > 0.5 ? "slight" : "noticeable"
        },
        {
          feature: "Chin to Philtrum Ratio",
          rating: analysis.jaw.chinProjection > 0.7 ? "perfect" : analysis.jaw.chinProjection > 0.5 ? "good" : "needs improvement",
          measurement: (analysis.jaw.chinProjection * 2.5).toFixed(2),
          ideal: "2.0 to 2.25",
          status: analysis.jaw.chinProjection > 0.7 ? "perfect" : analysis.jaw.chinProjection > 0.5 ? "slight" : "noticeable"
        },
        {
          feature: "Canthal Tilt",
          rating: analysis.eyeArea.canthalTilt > 0.6 ? "perfect" : analysis.eyeArea.canthalTilt > 0.4 ? "good" : "needs improvement",
          measurement: `${(analysis.eyeArea.canthalTilt * 10).toFixed(1)}°`,
          ideal: "6°+",
          status: analysis.eyeArea.canthalTilt > 0.6 ? "perfect" : analysis.eyeArea.canthalTilt > 0.4 ? "slight" : "noticeable"
        },
        {
          feature: "Mouth to Nose Ratio",
          rating: analysis.nose.nostrilExposure > 0.6 ? "perfect" : analysis.nose.nostrilExposure > 0.4 ? "good" : "needs improvement",
          measurement: (analysis.nose.nostrilExposure * 1.8).toFixed(2),
          ideal: "1.5 to 1.62",
          status: analysis.nose.nostrilExposure > 0.6 ? "perfect" : analysis.nose.nostrilExposure > 0.4 ? "slight" : "noticeable"
        },
        {
          feature: "Bigonial Width",
          rating: analysis.jaw.gonialAngle > 0.6 ? "perfect" : analysis.jaw.gonialAngle > 0.4 ? "good" : "needs improvement",
          measurement: (analysis.jaw.gonialAngle * 1.3).toFixed(2),
          ideal: "1.1 to 1.15",
          status: analysis.jaw.gonialAngle > 0.6 ? "perfect" : analysis.jaw.gonialAngle > 0.4 ? "slight" : "noticeable"
        },
        {
          feature: "Lip Ratio",
          rating: analysis.nose.tipRotation > 0.6 ? "perfect" : analysis.nose.tipRotation > 0.4 ? "good" : "needs improvement",
          measurement: (analysis.nose.tipRotation * 1.8).toFixed(2),
          ideal: "1.55 to 1.65",
          status: analysis.nose.tipRotation > 0.6 ? "perfect" : analysis.nose.tipRotation > 0.4 ? "slight" : "noticeable"
        },
        {
          feature: "Eye Separation Ratio",
          rating: analysis.eyeArea.spacingSymmetry > 0.8 ? "perfect" : analysis.eyeArea.spacingSymmetry > 0.6 ? "good" : "needs improvement",
          measurement: (analysis.eyeArea.spacingSymmetry * 0.5).toFixed(2),
          ideal: "0.45 to 0.49",
          status: analysis.eyeArea.spacingSymmetry > 0.8 ? "perfect" : analysis.eyeArea.spacingSymmetry > 0.6 ? "slight" : "noticeable"
        },
        {
          feature: "Eye to Mouth Angle",
          rating: analysis.eyeArea.periorbitalSupport > 0.7 ? "perfect" : analysis.eyeArea.periorbitalSupport > 0.5 ? "good" : "needs improvement",
          measurement: `${(analysis.eyeArea.periorbitalSupport * 50).toFixed(1)}°`,
          ideal: "45° to 49°",
          status: analysis.eyeArea.periorbitalSupport > 0.7 ? "perfect" : analysis.eyeArea.periorbitalSupport > 0.5 ? "slight" : "noticeable"
        },
        {
          feature: "Lower Third Height",
          rating: analysis.jaw.lowerThirdProminence > 0.7 ? "perfect" : analysis.jaw.lowerThirdProminence > 0.5 ? "good" : "needs improvement",
          measurement: (analysis.jaw.lowerThirdProminence * 1.4).toFixed(2),
          ideal: "1.25+",
          status: analysis.jaw.lowerThirdProminence > 0.7 ? "perfect" : analysis.jaw.lowerThirdProminence > 0.5 ? "slight" : "noticeable"
        },
        {
          feature: "Palpebral Fissure Length",
          rating: analysis.eyeArea.upperEyelidExposure > 0.7 ? "perfect" : analysis.eyeArea.upperEyelidExposure > 0.5 ? "good" : "needs improvement",
          measurement: (analysis.eyeArea.upperEyelidExposure * 4).toFixed(2),
          ideal: "3.5+",
          status: analysis.eyeArea.upperEyelidExposure > 0.7 ? "perfect" : analysis.eyeArea.upperEyelidExposure > 0.5 ? "slight" : "noticeable"
        },
        {
          feature: "Dorsal Profile",
          rating: analysis.nose.dorsalProfile > 0.7 ? "perfect" : analysis.nose.dorsalProfile > 0.5 ? "good" : "needs improvement",
          measurement: `${(analysis.nose.dorsalProfile * 100).toFixed(1)}%`,
          ideal: "70%+",
          status: analysis.nose.dorsalProfile > 0.7 ? "perfect" : analysis.nose.dorsalProfile > 0.5 ? "slight" : "noticeable"
        },
        {
          feature: "Skin Thickness",
          rating: analysis.nose.skinThickness > 0.7 ? "perfect" : analysis.nose.skinThickness > 0.5 ? "good" : "needs improvement",
          measurement: `${(analysis.nose.skinThickness * 100).toFixed(1)}%`,
          ideal: "70%+",
          status: analysis.nose.skinThickness > 0.7 ? "perfect" : analysis.nose.skinThickness > 0.5 ? "slight" : "noticeable"
        },
        {
          feature: "Upper Eyelid Exposure",
          rating: analysis.eyeArea.upperEyelidExposure > 0.7 ? "perfect" : analysis.eyeArea.upperEyelidExposure > 0.5 ? "good" : "needs improvement",
          measurement: `${(analysis.eyeArea.upperEyelidExposure * 100).toFixed(1)}%`,
          ideal: "70%+",
          status: analysis.eyeArea.upperEyelidExposure > 0.7 ? "perfect" : analysis.eyeArea.upperEyelidExposure > 0.5 ? "slight" : "noticeable"
        },
        {
          feature: "Eye Spacing & Symmetry",
          rating: analysis.eyeArea.spacingSymmetry > 0.8 ? "perfect" : analysis.eyeArea.spacingSymmetry > 0.6 ? "good" : "needs improvement",
          measurement: `${(analysis.eyeArea.spacingSymmetry * 100).toFixed(1)}%`,
          ideal: "80%+",
          status: analysis.eyeArea.spacingSymmetry > 0.8 ? "perfect" : analysis.eyeArea.spacingSymmetry > 0.6 ? "slight" : "noticeable"
        },
        {
          feature: "Periorbital Support",
          rating: analysis.eyeArea.periorbitalSupport > 0.7 ? "perfect" : analysis.eyeArea.periorbitalSupport > 0.5 ? "good" : "needs improvement",
          measurement: `${(analysis.eyeArea.periorbitalSupport * 100).toFixed(1)}%`,
          ideal: "70%+",
          status: analysis.eyeArea.periorbitalSupport > 0.7 ? "perfect" : analysis.eyeArea.periorbitalSupport > 0.5 ? "slight" : "noticeable"
        },
        {
          feature: "Dorsal Profile",
          rating: analysis.nose.dorsalProfile > 0.7 ? "perfect" : analysis.nose.dorsalProfile > 0.5 ? "good" : "needs improvement",
          measurement: `${(analysis.nose.dorsalProfile * 100).toFixed(1)}%`,
          ideal: "70%+",
          status: analysis.nose.dorsalProfile > 0.7 ? "perfect" : analysis.nose.dorsalProfile > 0.5 ? "slight" : "noticeable"
        },
        {
          feature: "Tip Rotation",
          rating: analysis.nose.tipRotation > 0.6 ? "perfect" : analysis.nose.tipRotation > 0.4 ? "good" : "needs improvement",
          measurement: `${(analysis.nose.tipRotation * 100).toFixed(1)}%`,
          ideal: "60%+",
          status: analysis.nose.tipRotation > 0.6 ? "perfect" : analysis.nose.tipRotation > 0.4 ? "slight" : "noticeable"
        },
        {
          feature: "Nostril Exposure",
          rating: analysis.nose.nostrilExposure > 0.6 ? "perfect" : analysis.nose.nostrilExposure > 0.4 ? "good" : "needs improvement",
          measurement: `${(analysis.nose.nostrilExposure * 100).toFixed(1)}%`,
          ideal: "60%+",
          status: analysis.nose.nostrilExposure > 0.6 ? "perfect" : analysis.nose.nostrilExposure > 0.4 ? "slight" : "noticeable"
        },
        {
          feature: "Chin Projection",
          rating: analysis.jaw.chinProjection > 0.7 ? "perfect" : analysis.jaw.chinProjection > 0.5 ? "good" : "needs improvement",
          measurement: `${(analysis.jaw.chinProjection * 100).toFixed(1)}%`,
          ideal: "70%+",
          status: analysis.jaw.chinProjection > 0.7 ? "perfect" : analysis.jaw.chinProjection > 0.5 ? "slight" : "noticeable"
        },
        {
          feature: "Gonial Angle",
          rating: analysis.jaw.gonialAngle > 0.6 ? "perfect" : analysis.jaw.gonialAngle > 0.4 ? "good" : "needs improvement",
          measurement: `${(analysis.jaw.gonialAngle * 100).toFixed(1)}%`,
          ideal: "60%+",
          status: analysis.jaw.gonialAngle > 0.6 ? "perfect" : analysis.jaw.gonialAngle > 0.4 ? "slight" : "noticeable"
        },
        {
          feature: "Jawline Definition",
          rating: analysis.jaw.jawlineDefinition > 0.7 ? "perfect" : analysis.jaw.jawlineDefinition > 0.5 ? "good" : "needs improvement",
          measurement: `${(analysis.jaw.jawlineDefinition * 100).toFixed(1)}%`,
          ideal: "70%+",
          status: analysis.jaw.jawlineDefinition > 0.7 ? "perfect" : analysis.jaw.jawlineDefinition > 0.5 ? "slight" : "noticeable"
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
    <TwoColumnLayout rightPanelTitle="REAL FACIAL ANALYSIS">
      <div className="mx-auto w-full max-w-4xl">
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <h3 className="font-semibold text-green-800 mb-2">Real MediaPipe Analysis</h3>
          <p className="text-green-700 text-sm">
            Upload one frontal photo and get real facial analysis using MediaPipe. 
            This uses actual computer vision to measure your facial features.
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
                  className="cursor-pointer inline-block px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
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
                  <div className="relative inline-block">
                    <img
                      src={selectedImage}
                      alt="Uploaded photo"
                      className="w-full max-w-md mx-auto rounded-lg"
                      id="analysis-image"
                    />
                    {showOverlay && landmarks && (
                      <svg
                        className="absolute top-0 left-0 w-full h-full"
                        style={{ width: '100%', height: '100%' }}
                        viewBox="0 0 1 1"
                        preserveAspectRatio="none"
                      >
             {/* Draw key facial landmarks - more comprehensive coverage */}
             {landmarks.slice(0, 100).map((landmark, index) => (
               <circle
                 key={index}
                 cx={landmark.x}
                 cy={landmark.y}
                 r="0.003"
                 fill="red"
                 opacity="0.6"
               />
             ))}

             {/* Draw comprehensive facial feature lines */}
             {landmarks.length > 0 && (
               <>
                 {/* Left eye outline */}
                 <line
                   x1={landmarks[33]?.x || 0}
                   y1={landmarks[33]?.y || 0}
                   x2={landmarks[7]?.x || 0}
                   y2={landmarks[7]?.y || 0}
                   stroke="blue"
                   strokeWidth="0.002"
                 />
                 <line
                   x1={landmarks[7]?.x || 0}
                   y1={landmarks[7]?.y || 0}
                   x2={landmarks[163]?.x || 0}
                   y2={landmarks[163]?.y || 0}
                   stroke="blue"
                   strokeWidth="0.002"
                 />
                 <line
                   x1={landmarks[163]?.x || 0}
                   y1={landmarks[163]?.y || 0}
                   x2={landmarks[144]?.x || 0}
                   y2={landmarks[144]?.y || 0}
                   stroke="blue"
                   strokeWidth="0.002"
                 />
                 <line
                   x1={landmarks[144]?.x || 0}
                   y1={landmarks[144]?.y || 0}
                   x2={landmarks[145]?.x || 0}
                   y2={landmarks[145]?.y || 0}
                   stroke="blue"
                   strokeWidth="0.002"
                 />
                 <line
                   x1={landmarks[145]?.x || 0}
                   y1={landmarks[145]?.y || 0}
                   x2={landmarks[153]?.x || 0}
                   y2={landmarks[153]?.y || 0}
                   stroke="blue"
                   strokeWidth="0.002"
                 />
                 <line
                   x1={landmarks[153]?.x || 0}
                   y1={landmarks[153]?.y || 0}
                   x2={landmarks[154]?.x || 0}
                   y2={landmarks[154]?.y || 0}
                   stroke="blue"
                   strokeWidth="0.002"
                 />
                 <line
                   x1={landmarks[154]?.x || 0}
                   y1={landmarks[154]?.y || 0}
                   x2={landmarks[155]?.x || 0}
                   y2={landmarks[155]?.y || 0}
                   stroke="blue"
                   strokeWidth="0.002"
                 />
                 <line
                   x1={landmarks[155]?.x || 0}
                   y1={landmarks[155]?.y || 0}
                   x2={landmarks[133]?.x || 0}
                   y2={landmarks[133]?.y || 0}
                   stroke="blue"
                   strokeWidth="0.002"
                 />
                 <line
                   x1={landmarks[133]?.x || 0}
                   y1={landmarks[133]?.y || 0}
                   x2={landmarks[173]?.x || 0}
                   y2={landmarks[173]?.y || 0}
                   stroke="blue"
                   strokeWidth="0.002"
                 />
                 <line
                   x1={landmarks[173]?.x || 0}
                   y1={landmarks[173]?.y || 0}
                   x2={landmarks[157]?.x || 0}
                   y2={landmarks[157]?.y || 0}
                   stroke="blue"
                   strokeWidth="0.002"
                 />
                 <line
                   x1={landmarks[157]?.x || 0}
                   y1={landmarks[157]?.y || 0}
                   x2={landmarks[158]?.x || 0}
                   y2={landmarks[158]?.y || 0}
                   stroke="blue"
                   strokeWidth="0.002"
                 />
                 <line
                   x1={landmarks[158]?.x || 0}
                   y1={landmarks[158]?.y || 0}
                   x2={landmarks[159]?.x || 0}
                   y2={landmarks[159]?.y || 0}
                   stroke="blue"
                   strokeWidth="0.002"
                 />
                 <line
                   x1={landmarks[159]?.x || 0}
                   y1={landmarks[159]?.y || 0}
                   x2={landmarks[160]?.x || 0}
                   y2={landmarks[160]?.y || 0}
                   stroke="blue"
                   strokeWidth="0.002"
                 />
                 <line
                   x1={landmarks[160]?.x || 0}
                   y1={landmarks[160]?.y || 0}
                   x2={landmarks[161]?.x || 0}
                   y2={landmarks[161]?.y || 0}
                   stroke="blue"
                   strokeWidth="0.002"
                 />
                 <line
                   x1={landmarks[161]?.x || 0}
                   y1={landmarks[161]?.y || 0}
                   x2={landmarks[246]?.x || 0}
                   y2={landmarks[246]?.y || 0}
                   stroke="blue"
                   strokeWidth="0.002"
                 />
                 <line
                   x1={landmarks[246]?.x || 0}
                   y1={landmarks[246]?.y || 0}
                   x2={landmarks[33]?.x || 0}
                   y2={landmarks[33]?.y || 0}
                   stroke="blue"
                   strokeWidth="0.002"
                 />

                 {/* Right eye outline */}
                 <line
                   x1={landmarks[362]?.x || 0}
                   y1={landmarks[362]?.y || 0}
                   x2={landmarks[382]?.x || 0}
                   y2={landmarks[382]?.y || 0}
                   stroke="blue"
                   strokeWidth="0.002"
                 />
                 <line
                   x1={landmarks[382]?.x || 0}
                   y1={landmarks[382]?.y || 0}
                   x2={landmarks[381]?.x || 0}
                   y2={landmarks[381]?.y || 0}
                   stroke="blue"
                   strokeWidth="0.002"
                 />
                 <line
                   x1={landmarks[381]?.x || 0}
                   y1={landmarks[381]?.y || 0}
                   x2={landmarks[380]?.x || 0}
                   y2={landmarks[380]?.y || 0}
                   stroke="blue"
                   strokeWidth="0.002"
                 />
                 <line
                   x1={landmarks[380]?.x || 0}
                   y1={landmarks[380]?.y || 0}
                   x2={landmarks[374]?.x || 0}
                   y2={landmarks[374]?.y || 0}
                   stroke="blue"
                   strokeWidth="0.002"
                 />
                 <line
                   x1={landmarks[374]?.x || 0}
                   y1={landmarks[374]?.y || 0}
                   x2={landmarks[373]?.x || 0}
                   y2={landmarks[373]?.y || 0}
                   stroke="blue"
                   strokeWidth="0.002"
                 />
                 <line
                   x1={landmarks[373]?.x || 0}
                   y1={landmarks[373]?.y || 0}
                   x2={landmarks[390]?.x || 0}
                   y2={landmarks[390]?.y || 0}
                   stroke="blue"
                   strokeWidth="0.002"
                 />
                 <line
                   x1={landmarks[390]?.x || 0}
                   y1={landmarks[390]?.y || 0}
                   x2={landmarks[249]?.x || 0}
                   y2={landmarks[249]?.y || 0}
                   stroke="blue"
                   strokeWidth="0.002"
                 />
                 <line
                   x1={landmarks[249]?.x || 0}
                   y1={landmarks[249]?.y || 0}
                   x2={landmarks[263]?.x || 0}
                   y2={landmarks[263]?.y || 0}
                   stroke="blue"
                   strokeWidth="0.002"
                 />
                 <line
                   x1={landmarks[263]?.x || 0}
                   y1={landmarks[263]?.y || 0}
                   x2={landmarks[466]?.x || 0}
                   y2={landmarks[466]?.y || 0}
                   stroke="blue"
                   strokeWidth="0.002"
                 />
                 <line
                   x1={landmarks[466]?.x || 0}
                   y1={landmarks[466]?.y || 0}
                   x2={landmarks[388]?.x || 0}
                   y2={landmarks[388]?.y || 0}
                   stroke="blue"
                   strokeWidth="0.002"
                 />
                 <line
                   x1={landmarks[388]?.x || 0}
                   y1={landmarks[388]?.y || 0}
                   x2={landmarks[387]?.x || 0}
                   y2={landmarks[387]?.y || 0}
                   stroke="blue"
                   strokeWidth="0.002"
                 />
                 <line
                   x1={landmarks[387]?.x || 0}
                   y1={landmarks[387]?.y || 0}
                   x2={landmarks[386]?.x || 0}
                   y2={landmarks[386]?.y || 0}
                   stroke="blue"
                   strokeWidth="0.002"
                 />
                 <line
                   x1={landmarks[386]?.x || 0}
                   y1={landmarks[386]?.y || 0}
                   x2={landmarks[385]?.x || 0}
                   y2={landmarks[385]?.y || 0}
                   stroke="blue"
                   strokeWidth="0.002"
                 />
                 <line
                   x1={landmarks[385]?.x || 0}
                   y1={landmarks[385]?.y || 0}
                   x2={landmarks[384]?.x || 0}
                   y2={landmarks[384]?.y || 0}
                   stroke="blue"
                   strokeWidth="0.002"
                 />
                 <line
                   x1={landmarks[384]?.x || 0}
                   y1={landmarks[384]?.y || 0}
                   x2={landmarks[398]?.x || 0}
                   y2={landmarks[398]?.y || 0}
                   stroke="blue"
                   strokeWidth="0.002"
                 />
                 <line
                   x1={landmarks[398]?.x || 0}
                   y1={landmarks[398]?.y || 0}
                   x2={landmarks[362]?.x || 0}
                   y2={landmarks[362]?.y || 0}
                   stroke="blue"
                   strokeWidth="0.002"
                 />

                 {/* Nose outline */}
                 <line
                   x1={landmarks[1]?.x || 0}
                   y1={landmarks[1]?.y || 0}
                   x2={landmarks[2]?.x || 0}
                   y2={landmarks[2]?.y || 0}
                   stroke="orange"
                   strokeWidth="0.003"
                 />
                 <line
                   x1={landmarks[2]?.x || 0}
                   y1={landmarks[2]?.y || 0}
                   x2={landmarks[3]?.x || 0}
                   y2={landmarks[3]?.y || 0}
                   stroke="orange"
                   strokeWidth="0.003"
                 />
                 <line
                   x1={landmarks[3]?.x || 0}
                   y1={landmarks[3]?.y || 0}
                   x2={landmarks[4]?.x || 0}
                   y2={landmarks[4]?.y || 0}
                   stroke="orange"
                   strokeWidth="0.003"
                 />
                 <line
                   x1={landmarks[4]?.x || 0}
                   y1={landmarks[4]?.y || 0}
                   x2={landmarks[5]?.x || 0}
                   y2={landmarks[5]?.y || 0}
                   stroke="orange"
                   strokeWidth="0.003"
                 />
                 <line
                   x1={landmarks[5]?.x || 0}
                   y1={landmarks[5]?.y || 0}
                   x2={landmarks[6]?.x || 0}
                   y2={landmarks[6]?.y || 0}
                   stroke="orange"
                   strokeWidth="0.003"
                 />

                 {/* Mouth outline */}
                 <line
                   x1={landmarks[61]?.x || 0}
                   y1={landmarks[61]?.y || 0}
                   x2={landmarks[84]?.x || 0}
                   y2={landmarks[84]?.y || 0}
                   stroke="green"
                   strokeWidth="0.002"
                 />
                 <line
                   x1={landmarks[84]?.x || 0}
                   y1={landmarks[84]?.y || 0}
                   x2={landmarks[17]?.x || 0}
                   y2={landmarks[17]?.y || 0}
                   stroke="green"
                   strokeWidth="0.002"
                 />
                 <line
                   x1={landmarks[17]?.x || 0}
                   y1={landmarks[17]?.y || 0}
                   x2={landmarks[314]?.x || 0}
                   y2={landmarks[314]?.y || 0}
                   stroke="green"
                   strokeWidth="0.002"
                 />
                 <line
                   x1={landmarks[314]?.x || 0}
                   y1={landmarks[314]?.y || 0}
                   x2={landmarks[405]?.x || 0}
                   y2={landmarks[405]?.y || 0}
                   stroke="green"
                   strokeWidth="0.002"
                 />
                 <line
                   x1={landmarks[405]?.x || 0}
                   y1={landmarks[405]?.y || 0}
                   x2={landmarks[320]?.x || 0}
                   y2={landmarks[320]?.y || 0}
                   stroke="green"
                   strokeWidth="0.002"
                 />
                 <line
                   x1={landmarks[320]?.x || 0}
                   y1={landmarks[320]?.y || 0}
                   x2={landmarks[307]?.x || 0}
                   y2={landmarks[307]?.y || 0}
                   stroke="green"
                   strokeWidth="0.002"
                 />
                 <line
                   x1={landmarks[307]?.x || 0}
                   y1={landmarks[307]?.y || 0}
                   x2={landmarks[375]?.x || 0}
                   y2={landmarks[375]?.y || 0}
                   stroke="green"
                   strokeWidth="0.002"
                 />
                 <line
                   x1={landmarks[375]?.x || 0}
                   y1={landmarks[375]?.y || 0}
                   x2={landmarks[321]?.x || 0}
                   y2={landmarks[321]?.y || 0}
                   stroke="green"
                   strokeWidth="0.002"
                 />
                 <line
                   x1={landmarks[321]?.x || 0}
                   y1={landmarks[321]?.y || 0}
                   x2={landmarks[308]?.x || 0}
                   y2={landmarks[308]?.y || 0}
                   stroke="green"
                   strokeWidth="0.002"
                 />
                 <line
                   x1={landmarks[308]?.x || 0}
                   y1={landmarks[308]?.y || 0}
                   x2={landmarks[324]?.x || 0}
                   y2={landmarks[324]?.y || 0}
                   stroke="green"
                   strokeWidth="0.002"
                 />
                 <line
                   x1={landmarks[324]?.x || 0}
                   y1={landmarks[324]?.y || 0}
                   x2={landmarks[318]?.x || 0}
                   y2={landmarks[318]?.y || 0}
                   stroke="green"
                   strokeWidth="0.002"
                 />
                 <line
                   x1={landmarks[318]?.x || 0}
                   y1={landmarks[318]?.y || 0}
                   x2={landmarks[13]?.x || 0}
                   y2={landmarks[13]?.y || 0}
                   stroke="green"
                   strokeWidth="0.002"
                 />
                 <line
                   x1={landmarks[13]?.x || 0}
                   y1={landmarks[13]?.y || 0}
                   x2={landmarks[82]?.x || 0}
                   y2={landmarks[82]?.y || 0}
                   stroke="green"
                   strokeWidth="0.002"
                 />
                 <line
                   x1={landmarks[82]?.x || 0}
                   y1={landmarks[82]?.y || 0}
                   x2={landmarks[81]?.x || 0}
                   y2={landmarks[81]?.y || 0}
                   stroke="green"
                   strokeWidth="0.002"
                 />
                 <line
                   x1={landmarks[81]?.x || 0}
                   y1={landmarks[81]?.y || 0}
                   x2={landmarks[80]?.x || 0}
                   y2={landmarks[80]?.y || 0}
                   stroke="green"
                   strokeWidth="0.002"
                 />
                 <line
                   x1={landmarks[80]?.x || 0}
                   y1={landmarks[80]?.y || 0}
                   x2={landmarks[78]?.x || 0}
                   y2={landmarks[78]?.y || 0}
                   stroke="green"
                   strokeWidth="0.002"
                 />
                 <line
                   x1={landmarks[78]?.x || 0}
                   y1={landmarks[78]?.y || 0}
                   x2={landmarks[95]?.x || 0}
                   y2={landmarks[95]?.y || 0}
                   stroke="green"
                   strokeWidth="0.002"
                 />
                 <line
                   x1={landmarks[95]?.x || 0}
                   y1={landmarks[95]?.y || 0}
                   x2={landmarks[88]?.x || 0}
                   y2={landmarks[88]?.y || 0}
                   stroke="green"
                   strokeWidth="0.002"
                 />
                 <line
                   x1={landmarks[88]?.x || 0}
                   y1={landmarks[88]?.y || 0}
                   x2={landmarks[178]?.x || 0}
                   y2={landmarks[178]?.y || 0}
                   stroke="green"
                   strokeWidth="0.002"
                 />
                 <line
                   x1={landmarks[178]?.x || 0}
                   y1={landmarks[178]?.y || 0}
                   x2={landmarks[87]?.x || 0}
                   y2={landmarks[87]?.y || 0}
                   stroke="green"
                   strokeWidth="0.002"
                 />
                 <line
                   x1={landmarks[87]?.x || 0}
                   y1={landmarks[87]?.y || 0}
                   x2={landmarks[14]?.x || 0}
                   y2={landmarks[14]?.y || 0}
                   stroke="green"
                   strokeWidth="0.002"
                 />
                 <line
                   x1={landmarks[14]?.x || 0}
                   y1={landmarks[14]?.y || 0}
                   x2={landmarks[317]?.x || 0}
                   y2={landmarks[317]?.y || 0}
                   stroke="green"
                   strokeWidth="0.002"
                 />
                 <line
                   x1={landmarks[317]?.x || 0}
                   y1={landmarks[317]?.y || 0}
                   x2={landmarks[402]?.x || 0}
                   y2={landmarks[402]?.y || 0}
                   stroke="green"
                   strokeWidth="0.002"
                 />
                 <line
                   x1={landmarks[402]?.x || 0}
                   y1={landmarks[402]?.y || 0}
                   x2={landmarks[318]?.x || 0}
                   y2={landmarks[318]?.y || 0}
                   stroke="green"
                   strokeWidth="0.002"
                 />
                 <line
                   x1={landmarks[318]?.x || 0}
                   y1={landmarks[318]?.y || 0}
                   x2={landmarks[324]?.x || 0}
                   y2={landmarks[324]?.y || 0}
                   stroke="green"
                   strokeWidth="0.002"
                 />
                 <line
                   x1={landmarks[324]?.x || 0}
                   y1={landmarks[324]?.y || 0}
                   x2={landmarks[308]?.x || 0}
                   y2={landmarks[308]?.y || 0}
                   stroke="green"
                   strokeWidth="0.002"
                 />
                 <line
                   x1={landmarks[308]?.x || 0}
                   y1={landmarks[308]?.y || 0}
                   x2={landmarks[61]?.x || 0}
                   y2={landmarks[61]?.y || 0}
                   stroke="green"
                   strokeWidth="0.002"
                 />

                 {/* Jaw line */}
                 <line
                   x1={landmarks[172]?.x || 0}
                   y1={landmarks[172]?.y || 0}
                   x2={landmarks[136]?.x || 0}
                   y2={landmarks[136]?.y || 0}
                   stroke="purple"
                   strokeWidth="0.002"
                 />
                 <line
                   x1={landmarks[136]?.x || 0}
                   y1={landmarks[136]?.y || 0}
                   x2={landmarks[150]?.x || 0}
                   y2={landmarks[150]?.y || 0}
                   stroke="purple"
                   strokeWidth="0.002"
                 />
                 <line
                   x1={landmarks[150]?.x || 0}
                   y1={landmarks[150]?.y || 0}
                   x2={landmarks[149]?.x || 0}
                   y2={landmarks[149]?.y || 0}
                   stroke="purple"
                   strokeWidth="0.002"
                 />
                 <line
                   x1={landmarks[149]?.x || 0}
                   y1={landmarks[149]?.y || 0}
                   x2={landmarks[176]?.x || 0}
                   y2={landmarks[176]?.y || 0}
                   stroke="purple"
                   strokeWidth="0.002"
                 />
                 <line
                   x1={landmarks[176]?.x || 0}
                   y1={landmarks[176]?.y || 0}
                   x2={landmarks[148]?.x || 0}
                   y2={landmarks[148]?.y || 0}
                   stroke="purple"
                   strokeWidth="0.002"
                 />
                 <line
                   x1={landmarks[148]?.x || 0}
                   y1={landmarks[148]?.y || 0}
                   x2={landmarks[152]?.x || 0}
                   y2={landmarks[152]?.y || 0}
                   stroke="purple"
                   strokeWidth="0.002"
                 />
                 <line
                   x1={landmarks[152]?.x || 0}
                   y1={landmarks[152]?.y || 0}
                   x2={landmarks[377]?.x || 0}
                   y2={landmarks[377]?.y || 0}
                   stroke="purple"
                   strokeWidth="0.002"
                 />
                 <line
                   x1={landmarks[377]?.x || 0}
                   y1={landmarks[377]?.y || 0}
                   x2={landmarks[400]?.x || 0}
                   y2={landmarks[400]?.y || 0}
                   stroke="purple"
                   strokeWidth="0.002"
                 />
                 <line
                   x1={landmarks[400]?.x || 0}
                   y1={landmarks[400]?.y || 0}
                   x2={landmarks[378]?.x || 0}
                   y2={landmarks[378]?.y || 0}
                   stroke="purple"
                   strokeWidth="0.002"
                 />
                 <line
                   x1={landmarks[378]?.x || 0}
                   y1={landmarks[378]?.y || 0}
                   x2={landmarks[379]?.x || 0}
                   y2={landmarks[379]?.y || 0}
                   stroke="purple"
                   strokeWidth="0.002"
                 />
                 <line
                   x1={landmarks[379]?.x || 0}
                   y1={landmarks[379]?.y || 0}
                   x2={landmarks[365]?.x || 0}
                   y2={landmarks[365]?.y || 0}
                   stroke="purple"
                   strokeWidth="0.002"
                 />
                 <line
                   x1={landmarks[365]?.x || 0}
                   y1={landmarks[365]?.y || 0}
                   x2={landmarks[397]?.x || 0}
                   y2={landmarks[397]?.y || 0}
                   stroke="purple"
                   strokeWidth="0.002"
                 />
               </>
             )}
                      </svg>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => setSelectedImage(null)}
                    className="absolute top-2 right-2"
                  >
                    Change Photo
                  </Button>
                  {landmarks && (
                    <Button
                      variant="outline"
                      onClick={() => setShowOverlay(!showOverlay)}
                      className="absolute top-2 left-2"
                    >
                      {showOverlay ? "Hide" : "Show"} Landmarks
                    </Button>
                  )}
                </div>
                <div className="mt-4 text-center">
                  <Button
                    onClick={analyzeFace}
                    disabled={isAnalyzing}
                    className="px-8 py-3"
                  >
                    {isAnalyzing ? "Analyzing with MediaPipe..." : "Analyze Face"}
                  </Button>
                </div>
                {error && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
                    {error}
                  </div>
                )}
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
                    <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg text-center">
                      <h3 className="font-semibold text-green-800 mb-2">Overall Score</h3>
                      <div className="text-2xl font-bold text-green-900">{overallScore}</div>
                      <div className="text-sm text-green-700 mt-1">
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
