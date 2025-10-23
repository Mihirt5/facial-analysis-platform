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
  midfaceRatio: number;
  facialWidthToHeightRatio: number;
  chinToPhiltrumRatio: number;
  canthalTilt: number;
  mouthToNoseRatio: number;
  bigonialWidth: number;
  lipRatio: number;
  eyeSeparationRatio: number;
  eyeToMouthAngle: number;
  lowerThirdHeight: number;
  palpebralFissureLength: number;
}

// Database with ideal values (from the working detector)
const database = {
  entries: {
    midfaceRatio: { idealLower: 0.8, idealUpper: 1.0, deviation: 0.1, deviatingLow: "short", deviatingHigh: "long" },
    facialWidthToHeightRatio: { idealLower: 1.8, deviation: 0.2, deviatingLow: "narrow" },
    chinToPhiltrumRatio: { idealLower: 2.0, idealUpper: 2.25, deviation: 0.15, deviatingLow: "short", deviatingHigh: "long" },
    canthalTilt: { idealLower: 6, deviation: 2, deviatingLow: "negative" },
    mouthToNoseRatio: { idealLower: 1.5, idealUpper: 1.62, deviation: 0.1, deviatingLow: "narrow", deviatingHigh: "wide" },
    bigonialWidth: { idealLower: 1.1, idealUpper: 1.15, deviation: 0.05, deviatingLow: "narrow", deviatingHigh: "wide" },
    lipRatio: { idealLower: 1.55, idealUpper: 1.65, deviation: 0.1, deviatingLow: "thin", deviatingHigh: "thick" },
    eyeSeparationRatio: { idealLower: 0.45, idealUpper: 0.49, deviation: 0.02, deviatingLow: "close", deviatingHigh: "wide" },
    eyeToMouthAngle: { idealLower: 45, idealUpper: 49, deviation: 3, deviatingLow: "acute", deviatingHigh: "obtuse" },
    lowerThirdHeight: { idealLower: 1.25, deviation: 0.15, deviatingLow: "short" },
    palpebralFissureLength: { idealLower: 3.5, deviation: 0.5, deviatingLow: "short" }
  }
};

export default function TensorFlowAnalysisPage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult[]>([]);
  const [overallScore, setOverallScore] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [detectedFeatures, setDetectedFeatures] = useState<FacialMeasurements | null>(null);
  const [showOverlay, setShowOverlay] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [model, setModel] = useState<any>(null);

  // Load TensorFlow.js and face-landmarks-detection
  useEffect(() => {
    const loadTensorFlow = async () => {
      try {
        // Load TensorFlow.js core dynamically at runtime
        const loadScript = (src: string) => {
          return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
          });
        };

        await loadScript('https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-core@4.15.0/dist/tf-core.min.js');
        await loadScript('https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-converter@4.15.0/dist/tf-converter.min.js');
        await loadScript('https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-backend-cpu@4.15.0/dist/tf-backend-cpu.min.js');
        await loadScript('https://cdn.jsdelivr.net/npm/@tensorflow-models/face-landmarks-detection@2.0.1/dist/face-landmarks-detection.min.js');

        // Wait a bit for scripts to load
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Initialize TensorFlow
        const tf = (window as any).tf;
        if (!tf) {
          throw new Error('TensorFlow not loaded');
        }
        await tf.ready();

        // Load face landmarks detection model
        const faceLandmarksDetection = (window as any).faceLandmarksDetection;
        if (!faceLandmarksDetection) {
          throw new Error('Face landmarks detection not loaded');
        }
        const loadedModel = await faceLandmarksDetection.load(
          faceLandmarksDetection.SupportedPackages.mediapipeFacemesh,
          { maxFaces: 1 }
        );
        
        setModel(loadedModel);
        console.log('TensorFlow model loaded successfully');
      } catch (error) {
        console.error('Failed to load TensorFlow:', error);
        setError('Failed to load facial analysis model. Please refresh the page.');
      }
    };

    loadTensorFlow();
  }, []);

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

  // Utility functions from the working detector
  const distance = ([ax, ay]: [number, number], [bx, by]: [number, number]) => {
    return Math.sqrt((ax - bx) ** 2 + (ay - by) ** 2);
  };

  const round = (n: number, digits: number = 2) => {
    const factor = 10 ** (isNaN(digits) ? 2 : digits);
    return Math.round(n * factor) / factor;
  };

  // Assessment function from the working detector
  const assess = (value: number, idealLower?: number, idealUpper?: number, deviation?: number, deviatingLow?: string, deviatingHigh?: string) => {
    const renderMultiplier = (multiplier: number) => {
      if (multiplier === 0) return "slightly too";
      if (multiplier === 1) return "noticeably";
      if (multiplier === 2) return "significantly too";
      if (multiplier === 3) return "horribly";
      return "extremely";
    };

    const calculate = (value: number, idealLower?: number, idealUpper?: number, deviation?: number) => {
      if (idealUpper !== undefined && idealLower !== undefined) {
        if (idealUpper >= value && idealLower <= value) {
          return { type: "perfect" };
        }
      } else if (((idealUpper && !idealLower) && value <= idealUpper) || ((!idealUpper && idealLower) && value >= idealLower)) {
        return { type: "perfect" };
      }

      if (value < (idealLower || 0)) {
        let multiplier = 0;
        let testValue = value;
        while (deviation && (testValue += deviation) < (idealLower || 0)) {
          multiplier++;
        }
        return {
          type: "low",
          multiplier: Math.min(multiplier, 4),
          text: renderMultiplier(multiplier),
        };
      }

      if (value > (idealUpper || Infinity)) {
        let multiplier = 0;
        let testValue = value;
        while (deviation && (testValue -= deviation) > (idealUpper || Infinity)) {
          multiplier++;
        }
        return {
          type: "high",
          multiplier: Math.min(multiplier, 4),
          text: renderMultiplier(multiplier),
        };
      }

      return { type: "perfect" };
    };

    const { type, multiplier, text } = calculate(value, idealLower, idealUpper, deviation);

    if (type === "perfect") {
      return { rating: "perfect", status: "perfect" as const };
    } else if (type === "low") {
      return { 
        rating: `${text} ${deviatingLow}`, 
        status: `deviation-${multiplier}` as any 
      };
    } else if (type === "high") {
      return { 
        rating: `${text} ${deviatingHigh}`, 
        status: `deviation-${multiplier}` as any 
      };
    }

    return { rating: "unknown", status: "noticeable" as const };
  };

  // Analyze facial features using TensorFlow.js
  const analyzeFacialFeatures = async (image: HTMLImageElement): Promise<FacialMeasurements> => {
    if (!model) throw new Error('Model not loaded');

    const predictions = await model.estimateFaces({ input: image });
    if (predictions.length === 0) {
      throw new Error('No face detected');
    }

    const face = predictions[0];
    const annotations = face.annotations;

    // Extract key points (mapping from the working detector)
    const points = {
      leftIris: annotations.rightEyeIris[0],
      rightIris: annotations.leftEyeIris[0],
      leftLateralCanthus: annotations.rightEyeLower1[0],
      leftMedialCanthus: annotations.rightEyeLower1[7],
      rightLateralCanthus: annotations.leftEyeLower1[0],
      rightMedialCanthus: annotations.leftEyeLower1[7],
      leftEyeUpper: annotations.rightEyeUpper0[4],
      leftEyeLower: annotations.rightEyeLower0[4],
      rightEyeUpper: annotations.leftEyeUpper0[4],
      rightEyeLower: annotations.leftEyeLower0[4],
      leftEyebrow: annotations.rightEyebrowUpper[6],
      rightEyebrow: annotations.leftEyebrowUpper[6],
      leftZygo: annotations.silhouette[28],
      rightZygo: annotations.silhouette[8],
      noseBottom: annotations.noseBottom[0],
      leftNoseCorner: annotations.noseRightCorner[0],
      rightNoseCorner: annotations.noseLeftCorner[0],
      leftCupidBow: annotations.lipsUpperOuter[4],
      lipSeparation: annotations.lipsUpperInner[5],
      rightCupidBow: annotations.lipsUpperOuter[6],
      leftLipCorner: annotations.lipsUpperOuter[0],
      rightLipCorner: annotations.lipsUpperOuter[10],
      lowerLip: annotations.lipsLowerOuter[4],
      upperLip: annotations.lipsUpperOuter[5],
      leftGonial: annotations.silhouette[24],
      rightGonial: annotations.silhouette[12],
      chinLeft: annotations.silhouette[19],
      chinTip: annotations.silhouette[18],
      chinRight: annotations.silhouette[17],
    };

    // Calculate measurements using the same logic as the working detector
    const measurements: FacialMeasurements = {
      // Midface ratio
      midfaceRatio: (() => {
        const eyeDistance = distance(points.leftIris, points.rightIris);
        const leftMidface = eyeDistance / distance(points.leftIris, [
          points.leftCupidBow[0] + (points.rightCupidBow[0] - points.leftCupidBow[0]) / 2,
          points.leftCupidBow[1] + (points.rightCupidBow[1] - points.leftCupidBow[1]) / 2
        ]);
        const rightMidface = eyeDistance / distance(points.rightIris, [
          points.leftCupidBow[0] + (points.rightCupidBow[0] - points.leftCupidBow[0]) / 2,
          points.leftCupidBow[1] + (points.rightCupidBow[1] - points.leftCupidBow[1]) / 2
        ]);
        return (leftMidface + rightMidface) / 2;
      })(),

      // Facial width to height ratio
      facialWidthToHeightRatio: (() => {
        const faceWidth = distance(points.leftZygo, points.rightZygo);
        const faceHeight = distance([
          (points.leftEyeUpper[0] + points.rightEyeUpper[0]) / 2,
          (points.leftEyeUpper[1] + points.rightEyeUpper[1]) / 2
        ], [
          (points.leftCupidBow[0] + points.rightCupidBow[0]) / 2,
          (points.leftCupidBow[1] + points.rightCupidBow[1]) / 2
        ]);
        return faceWidth / faceHeight;
      })(),

      // Chin to philtrum ratio
      chinToPhiltrumRatio: distance(points.chinTip, points.lowerLip) / distance(points.upperLip, points.noseBottom),

      // Canthal tilt (average of both eyes)
      canthalTilt: (() => {
        const leftTilt = Math.atan2(
          points.leftLateralCanthus[1] - points.leftMedialCanthus[1],
          points.leftLateralCanthus[0] - points.leftMedialCanthus[0]
        ) * (180 / Math.PI);
        const rightTilt = Math.atan2(
          points.rightLateralCanthus[1] - points.rightMedialCanthus[1],
          points.rightLateralCanthus[0] - points.rightMedialCanthus[0]
        ) * (180 / Math.PI);
        return (leftTilt + rightTilt) / 2;
      })(),

      // Mouth to nose ratio
      mouthToNoseRatio: distance(points.leftLipCorner, points.rightLipCorner) / distance(points.leftNoseCorner, points.rightNoseCorner),

      // Bigonial width
      bigonialWidth: distance(points.leftZygo, points.rightZygo) / distance(points.leftGonial, points.rightGonial),

      // Lip ratio
      lipRatio: (() => {
        const upperLipHeight = distance(points.upperLip, points.lipSeparation);
        const lowerLipHeight = distance(points.lipSeparation, points.lowerLip);
        return lowerLipHeight / upperLipHeight;
      })(),

      // Eye separation ratio
      eyeSeparationRatio: distance(points.leftIris, points.rightIris) / distance(points.leftZygo, points.rightZygo),

      // Eye to mouth angle
      eyeToMouthAngle: (() => {
        const a = [(points.leftIris[0] ?? 0) - (points.lipSeparation[0] ?? 0), (points.leftIris[1] ?? 0) - (points.lipSeparation[1] ?? 0)];
        const b = [(points.rightIris[0] ?? 0) - (points.lipSeparation[0] ?? 0), (points.rightIris[1] ?? 0) - (points.lipSeparation[1] ?? 0)];
        return Math.acos(
          ((a[0] ?? 0) * (b[0] ?? 0) + (a[1] ?? 0) * (b[1] ?? 0)) /
          (Math.sqrt(((a[0] ?? 0) ** 2) + ((a[1] ?? 0) ** 2)) * Math.sqrt(((b[0] ?? 0) ** 2) + ((b[1] ?? 0) ** 2)))
        ) * (180 / Math.PI);
      })(),

      // Lower third height
      lowerThirdHeight: (() => {
        const middlePoint: [number, number] = [
          (points.leftNoseCorner[0] ?? 0) + ((points.rightNoseCorner[0] ?? 0) - (points.leftNoseCorner[0] ?? 0)) / 2,
          (points.leftNoseCorner[1] ?? 0) + ((points.rightNoseCorner[1] ?? 0) - (points.leftNoseCorner[1] ?? 0)) / 2
        ];
        const topPoint: [number, number] = [
          ((points.leftEyebrow[0] ?? 0) + (points.rightEyebrow[0] ?? 0)) / 2,
          ((points.leftEyebrow[1] ?? 0) + (points.rightEyebrow[1] ?? 0)) / 2
        ];
        const bottomPoint: [number, number] = [
          ((points.chinLeft[0] ?? 0) + (points.chinRight[0] ?? 0)) / 2,
          ((points.chinLeft[1] ?? 0) + (points.chinRight[1] ?? 0)) / 2
        ];
        return distance(bottomPoint, middlePoint) / distance(middlePoint, topPoint);
      })(),

      // Palpebral fissure length (average of both eyes)
      palpebralFissureLength: (() => {
        const leftPFL = distance(points.leftLateralCanthus, points.leftMedialCanthus) / distance(points.leftEyeUpper, points.leftEyeLower);
        const rightPFL = distance(points.rightLateralCanthus, points.rightMedialCanthus) / distance(points.rightEyeUpper, points.rightEyeLower);
        return (leftPFL + rightPFL) / 2;
      })(),
    };

    return measurements;
  };

  const analyzeFace = async () => {
    if (!selectedImage || !imageRef.current || !model) return;

    setIsAnalyzing(true);
    setError("");
    
    try {
      const img = imageRef.current;
      
      // Detect facial features
      const features = await analyzeFacialFeatures(img);
      setDetectedFeatures(features);
      setShowOverlay(true);
      
      // Convert to analysis results
      const results: AnalysisResult[] = [
        {
          feature: "Midface Ratio",
          ...assess(features.midfaceRatio, database.entries.midfaceRatio.idealLower, database.entries.midfaceRatio.idealUpper, database.entries.midfaceRatio.deviation, database.entries.midfaceRatio.deviatingLow, database.entries.midfaceRatio.deviatingHigh),
          measurement: round(features.midfaceRatio, 2),
          ideal: `${database.entries.midfaceRatio.idealLower} to ${database.entries.midfaceRatio.idealUpper}`
        },
        {
          feature: "Facial Width to Height Ratio",
          ...assess(features.facialWidthToHeightRatio, database.entries.facialWidthToHeightRatio.idealLower, undefined, database.entries.facialWidthToHeightRatio.deviation, database.entries.facialWidthToHeightRatio.deviatingLow, undefined),
          measurement: round(features.facialWidthToHeightRatio, 2),
          ideal: `more than ${database.entries.facialWidthToHeightRatio.idealLower}`
        },
        {
          feature: "Chin to Philtrum Ratio",
          ...assess(features.chinToPhiltrumRatio, database.entries.chinToPhiltrumRatio.idealLower, database.entries.chinToPhiltrumRatio.idealUpper, database.entries.chinToPhiltrumRatio.deviation, database.entries.chinToPhiltrumRatio.deviatingLow, database.entries.chinToPhiltrumRatio.deviatingHigh),
          measurement: round(features.chinToPhiltrumRatio, 2),
          ideal: `${database.entries.chinToPhiltrumRatio.idealLower} to ${database.entries.chinToPhiltrumRatio.idealUpper}`
        },
        {
          feature: "Canthal Tilt",
          ...assess(features.canthalTilt, database.entries.canthalTilt.idealLower, undefined, database.entries.canthalTilt.deviation, database.entries.canthalTilt.deviatingLow, undefined),
          measurement: `${round(features.canthalTilt, 0)}°`,
          ideal: `more than ${database.entries.canthalTilt.idealLower}°`
        },
        {
          feature: "Mouth to Nose Ratio",
          ...assess(features.mouthToNoseRatio, database.entries.mouthToNoseRatio.idealLower, database.entries.mouthToNoseRatio.idealUpper, database.entries.mouthToNoseRatio.deviation, database.entries.mouthToNoseRatio.deviatingLow, database.entries.mouthToNoseRatio.deviatingHigh),
          measurement: round(features.mouthToNoseRatio, 2),
          ideal: `${database.entries.mouthToNoseRatio.idealLower} to ${database.entries.mouthToNoseRatio.idealUpper}`
        },
        {
          feature: "Bigonial Width",
          ...assess(features.bigonialWidth, database.entries.bigonialWidth.idealLower, database.entries.bigonialWidth.idealUpper, database.entries.bigonialWidth.deviation, database.entries.bigonialWidth.deviatingLow, database.entries.bigonialWidth.deviatingHigh),
          measurement: round(features.bigonialWidth, 2),
          ideal: `${database.entries.bigonialWidth.idealLower} to ${database.entries.bigonialWidth.idealUpper}`
        },
        {
          feature: "Lip Ratio",
          ...assess(features.lipRatio, database.entries.lipRatio.idealLower, database.entries.lipRatio.idealUpper, database.entries.lipRatio.deviation, database.entries.lipRatio.deviatingLow, database.entries.lipRatio.deviatingHigh),
          measurement: round(features.lipRatio, 2),
          ideal: `${database.entries.lipRatio.idealLower} to ${database.entries.lipRatio.idealUpper}`
        },
        {
          feature: "Eye Separation Ratio",
          ...assess(features.eyeSeparationRatio, database.entries.eyeSeparationRatio.idealLower, database.entries.eyeSeparationRatio.idealUpper, database.entries.eyeSeparationRatio.deviation, database.entries.eyeSeparationRatio.deviatingLow, database.entries.eyeSeparationRatio.deviatingHigh),
          measurement: round(features.eyeSeparationRatio, 2),
          ideal: `${database.entries.eyeSeparationRatio.idealLower} to ${database.entries.eyeSeparationRatio.idealUpper}`
        },
        {
          feature: "Eye to Mouth Angle",
          ...assess(features.eyeToMouthAngle, database.entries.eyeToMouthAngle.idealLower, database.entries.eyeToMouthAngle.idealUpper, database.entries.eyeToMouthAngle.deviation, database.entries.eyeToMouthAngle.deviatingLow, database.entries.eyeToMouthAngle.deviatingHigh),
          measurement: `${round(features.eyeToMouthAngle, 0)}°`,
          ideal: `${database.entries.eyeToMouthAngle.idealLower}° to ${database.entries.eyeToMouthAngle.idealUpper}°`
        },
        {
          feature: "Lower Third Height",
          ...assess(features.lowerThirdHeight, database.entries.lowerThirdHeight.idealLower, undefined, database.entries.lowerThirdHeight.deviation, database.entries.lowerThirdHeight.deviatingLow, undefined),
          measurement: round(features.lowerThirdHeight, 2),
          ideal: `more than ${database.entries.lowerThirdHeight.idealLower}`
        },
        {
          feature: "Palpebral Fissure Length",
          ...assess(features.palpebralFissureLength, database.entries.palpebralFissureLength.idealLower, undefined, database.entries.palpebralFissureLength.deviation, database.entries.palpebralFissureLength.deviatingLow, undefined),
          measurement: round(features.palpebralFissureLength, 2),
          ideal: `more than ${database.entries.palpebralFissureLength.idealLower}`
        }
      ];

      setAnalysisResults(results);
      
      // Calculate overall score using the same logic as the working detector
      const counts = {
        perfect: 0,
        deviation0: 0,
        deviation1: 0,
        deviation2: 0,
        deviation3: 0,
        deviation4: 0,
      };

      const weights = {
        perfect: 2,
        deviation0: 1,
        deviation1: 0,
        deviation2: -1,
        deviation3: -2,
        deviation4: -2,
      };

      results.forEach(result => {
        if (result.status === 'perfect') counts.perfect++;
        else if (result.status === 'slight') counts.deviation0++;
        else if (result.status === 'noticeable') counts.deviation1++;
        else if (result.status === 'significant') counts.deviation2++;
        else if (result.status === 'horrible') counts.deviation3++;
        else if (result.status === 'extreme') counts.deviation4++;
      });

      const totalScore = 
        counts.perfect * weights.perfect +
        counts.deviation0 * weights.deviation0 +
        counts.deviation1 * weights.deviation1 +
        counts.deviation2 * weights.deviation2 +
        counts.deviation3 * weights.deviation3 +
        counts.deviation4 * weights.deviation4;

      const maxScore = 22;
      const normalized = Math.max(0, Math.min(8, Math.round((totalScore / maxScore) * 9)));
      
      const labels = {
        0: "Subhuman", 1: "Sub5", 2: "Low-tier Normie", 3: "Normie", 4: "Upper Normie",
        5: "Chadlite", 6: "Chad", 7: "Gigachad", 8: "Terachad"
      };
      
      setOverallScore(labels[normalized as keyof typeof labels] || "Unknown");

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
    <TwoColumnLayout rightPanelTitle="TENSORFLOW FACIAL ANALYSIS">
      <div className="mx-auto w-full max-w-4xl">
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <h3 className="font-semibold text-green-800 mb-2">TensorFlow.js Facial Analysis</h3>
          <p className="text-green-700 text-sm">
            This version uses the same TensorFlow.js face-landmarks-detection model as the working detector, 
            with identical measurement calculations and assessment logic.
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
                {!model && (
                  <p className="mt-2 text-sm text-orange-600">
                    Loading TensorFlow model... Please wait.
                  </p>
                )}
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
                    disabled={isAnalyzing || !model}
                    className="px-8 py-3"
                  >
                    {isAnalyzing ? "Analyzing with TensorFlow..." : "Analyze Face"}
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
                  <CardTitle>TensorFlow Feature Analysis</CardTitle>
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
                        Based on {analysisResults.length} facial features analyzed using TensorFlow.js
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
