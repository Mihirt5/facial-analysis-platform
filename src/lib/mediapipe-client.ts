"use client";

import { ensureTensorFlow } from './tensorflow-loader';

// Dynamic imports to handle MediaPipe modules
let FaceMesh: any;
let FaceDetection: any;

// Load MediaPipe modules dynamically from CDN
const loadMediaPipeModules = async () => {
  if (!FaceMesh || !FaceDetection) {
    try {
      // Ensure TensorFlow is loaded first to prevent conflicts
      await ensureTensorFlow({ backend: 'cpu', preferLocal: false });
      
      // Load MediaPipe from CDN instead of npm packages
      const loadScript = (src: string) => {
        return new Promise((resolve, reject) => {
          const script = document.createElement('script');
          script.src = src;
          script.type = 'module';
          script.onload = resolve;
          script.onerror = reject;
          document.head.appendChild(script);
        });
      };

      await loadScript('https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh@0.4.1635988167/face_mesh.js');
      await loadScript('https://cdn.jsdelivr.net/npm/@mediapipe/face_detection@0.4.1635988167/face_detection.js');
      
      // Wait for modules to be available
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      FaceMesh = (window as any).FaceMesh;
      FaceDetection = (window as any).FaceDetection;
    } catch (error) {
      console.error('Failed to load MediaPipe modules:', error);
      throw error;
    }
  }
};

export interface FaceLandmarks {
  landmarks: Array<{ x: number; y: number; z: number }>;
  imageWidth: number;
  imageHeight: number;
}

export interface FacialAnalysis {
  eyeArea: {
    canthalTilt: number;
    upperEyelidExposure: number;
    spacingSymmetry: number;
    periorbitalSupport: number;
  };
  nose: {
    dorsalProfile: number;
    tipRotation: number;
    nostrilExposure: number;
    skinThickness: number;
  };
  jaw: {
    chinProjection: number;
    gonialAngle: number;
    jawlineDefinition: number;
    lowerThirdProminence: number;
  };
  skin: {
    elasticity: number;
    damage: number;
    hydrationTexture: number;
    fineLines: number;
  };
}

class MediaPipeClientService {
  private faceMesh: any = null;
  private faceDetection: any = null;
  private isInitialized = false;

  async initialize() {
    if (this.isInitialized) return;

    try {
      // Load MediaPipe modules first
      await loadMediaPipeModules();

      // Initialize Face Mesh
      this.faceMesh = new FaceMesh({
        locateFile: (file: string) => {
          return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`;
        }
      });

      this.faceMesh.setOptions({
        maxNumFaces: 1,
        refineLandmarks: true,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5
      });

      // Initialize Face Detection
      this.faceDetection = new FaceDetection({
        locateFile: (file: string) => {
          return `https://cdn.jsdelivr.net/npm/@mediapipe/face_detection/${file}`;
        }
      });

      this.faceDetection.setOptions({
        model: 'short',
        minDetectionConfidence: 0.5
      });

      this.isInitialized = true;
    } catch (error) {
      console.error('Failed to initialize MediaPipe:', error);
      throw error;
    }
  }

  async analyzeImage(imageUrl: string): Promise<FaceLandmarks | null> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    return new Promise((resolve, reject) => {
      if (!this.faceMesh) {
        reject(new Error('FaceMesh not initialized'));
        return;
      }

      console.log("MediaPipe loading image from URL:", imageUrl);
      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      img.onload = () => {
        console.log("MediaPipe image loaded successfully:", imageUrl);
        this.faceMesh!.onResults((results: any) => {
          if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
            const landmarks = results.multiFaceLandmarks[0]!.map((landmark: any) => ({
              x: landmark.x,
              y: landmark.y,
              z: landmark.z
            }));
            
            resolve({
              landmarks,
              imageWidth: img.width,
              imageHeight: img.height
            });
          } else {
            resolve(null);
          }
        });

        this.faceMesh!.send({ image: img });
      };

      img.onerror = (error) => {
        console.error("MediaPipe failed to load image:", imageUrl, error);
        reject(new Error(`Failed to load image: ${imageUrl}`));
      };

      img.src = imageUrl;
    });
  }

  calculateFacialAnalysis(landmarks: FaceLandmarks): FacialAnalysis {
    const { landmarks: points, imageWidth, imageHeight } = landmarks;

    // Convert normalized coordinates to pixel coordinates
    const toPixels = (point: { x: number; y: number; z: number } | undefined) => {
      if (!point) {
        return { x: 0, y: 0, z: 0 };
      }
      return {
        x: point.x * imageWidth,
        y: point.y * imageHeight,
        z: point.z
      };
    };

    // Key landmark indices for facial analysis
    const keyPoints = {
      // Eye landmarks
      leftEyeInner: 133, rightEyeInner: 362,
      leftEyeOuter: 33, rightEyeOuter: 263,
      leftEyeTop: 159, rightEyeTop: 386,
      leftEyeBottom: 145, rightEyeBottom: 374,
      
      // Nose landmarks
      noseTip: 1, noseBridge: 6, noseLeft: 31, noseRight: 35,
      
      // Jaw landmarks
      chin: 18, jawLeft: 172, jawRight: 397,
      
      // Face contour
      faceLeft: 172, faceRight: 397, faceTop: 10, faceBottom: 18
    };

    // Calculate eye area metrics
    const leftEyeInner = toPixels(points[keyPoints.leftEyeInner]);
    const rightEyeInner = toPixels(points[keyPoints.rightEyeInner]);
    const leftEyeOuter = toPixels(points[keyPoints.leftEyeOuter]);
    const rightEyeOuter = toPixels(points[keyPoints.rightEyeOuter]);
    const leftEyeTop = toPixels(points[keyPoints.leftEyeTop]);
    const leftEyeBottom = toPixels(points[keyPoints.leftEyeBottom]);
    const rightEyeTop = toPixels(points[keyPoints.rightEyeTop]);
    const rightEyeBottom = toPixels(points[keyPoints.rightEyeBottom]);

    // Canthal Tilt (angle of eye corners)
    const leftCanthalTilt = Math.atan2(
      leftEyeOuter.y - leftEyeInner.y,
      leftEyeOuter.x - leftEyeInner.x
    ) * (180 / Math.PI);
    const rightCanthalTilt = Math.atan2(
      rightEyeOuter.y - rightEyeInner.y,
      rightEyeOuter.x - rightEyeInner.x
    ) * (180 / Math.PI);
    const canthalTilt = (leftCanthalTilt + rightCanthalTilt) / 2;

    // Upper Eyelid Exposure
    const leftEyeHeight = Math.abs(leftEyeTop.y - leftEyeBottom.y);
    const rightEyeHeight = Math.abs(rightEyeTop.y - rightEyeBottom.y);
    const upperEyelidExposure = ((leftEyeHeight + rightEyeHeight) / 2) / imageHeight;

    // Eye Spacing & Symmetry
    const eyeDistance = Math.abs(rightEyeInner.x - leftEyeInner.x);
    const eyeSpacing = eyeDistance / imageWidth;
    const eyeSymmetry = 1 - Math.abs(leftCanthalTilt - rightCanthalTilt) / 90;

    // Periorbital Support (simplified)
    const periorbitalSupport = Math.min(upperEyelidExposure * 2, 1);

    // Calculate nose metrics
    const noseTip = toPixels(points[keyPoints.noseTip]);
    const noseBridge = toPixels(points[keyPoints.noseBridge]);
    const noseLeft = toPixels(points[keyPoints.noseLeft]);
    const noseRight = toPixels(points[keyPoints.noseRight]);

    // Dorsal Profile (nose bridge curve)
    const noseHeight = Math.abs(noseTip.y - noseBridge.y);
    const dorsalProfile = Math.min(noseHeight / imageHeight * 3, 1);

    // Tip Rotation (simplified)
    const tipRotation = Math.min(Math.abs(noseTip.x - (noseLeft.x + noseRight.x) / 2) / imageWidth * 4, 1);

    // Nostril Exposure
    const nostrilWidth = Math.abs(noseRight.x - noseLeft.x);
    const nostrilExposure = Math.min(nostrilWidth / imageWidth * 2, 1);

    // Nose Skin Thickness (simplified estimation)
    const skinThickness = Math.min((noseHeight + nostrilWidth) / (imageHeight + imageWidth) * 2, 1);

    // Calculate jaw metrics
    const chin = toPixels(points[keyPoints.chin]);
    const jawLeft = toPixels(points[keyPoints.jawLeft]);
    const jawRight = toPixels(points[keyPoints.jawRight]);

    // Chin Projection
    const chinProjection = Math.min(chin.y / imageHeight * 2, 1);

    // Gonial Angle (jaw angle)
    const leftGonialAngle = Math.atan2(
      jawLeft.y - chin.y,
      jawLeft.x - chin.x
    ) * (180 / Math.PI);
    const rightGonialAngle = Math.atan2(
      jawRight.y - chin.y,
      jawRight.x - chin.x
    ) * (180 / Math.PI);
    const gonialAngle = Math.min((leftGonialAngle + rightGonialAngle) / 2 / 90, 1);

    // Jawline Definition
    const jawlineDefinition = Math.min(
      (Math.abs(jawLeft.y - chin.y) + Math.abs(jawRight.y - chin.y)) / imageHeight * 2, 1
    );

    // Lower Third Prominence
    const lowerThirdProminence = Math.min(chin.y / imageHeight * 1.5, 1);

    // Skin analysis (simplified - would need more sophisticated analysis)
    const skinElasticity = 0.7; // Placeholder - would need texture analysis
    const skinDamage = 0.3; // Placeholder - would need damage detection
    const skinHydrationTexture = 0.8; // Placeholder - would need texture analysis
    const skinFineLines = 0.4; // Placeholder - would need line detection

    return {
      eyeArea: {
        canthalTilt: Math.max(0, Math.min(1, (canthalTilt + 90) / 180)),
        upperEyelidExposure: Math.max(0, Math.min(1, upperEyelidExposure)),
        spacingSymmetry: Math.max(0, Math.min(1, (eyeSpacing + eyeSymmetry) / 2)),
        periorbitalSupport: Math.max(0, Math.min(1, periorbitalSupport))
      },
      nose: {
        dorsalProfile: Math.max(0, Math.min(1, dorsalProfile)),
        tipRotation: Math.max(0, Math.min(1, tipRotation)),
        nostrilExposure: Math.max(0, Math.min(1, nostrilExposure)),
        skinThickness: Math.max(0, Math.min(1, skinThickness))
      },
      jaw: {
        chinProjection: Math.max(0, Math.min(1, chinProjection)),
        gonialAngle: Math.max(0, Math.min(1, gonialAngle)),
        jawlineDefinition: Math.max(0, Math.min(1, jawlineDefinition)),
        lowerThirdProminence: Math.max(0, Math.min(1, lowerThirdProminence))
      },
      skin: {
        elasticity: Math.max(0, Math.min(1, skinElasticity)),
        damage: Math.max(0, Math.min(1, skinDamage)),
        hydrationTexture: Math.max(0, Math.min(1, skinHydrationTexture)),
        fineLines: Math.max(0, Math.min(1, skinFineLines))
      }
    };
  }

  async processAnalysis(images: {
    front: string;
    left: string;
    right: string;
    leftSide: string;
    rightSide: string;
  }): Promise<FacialAnalysis> {
    // Analyze the front-facing image for most metrics
    const frontLandmarks = await this.analyzeImage(images.front);
    
    if (!frontLandmarks) {
      throw new Error('Could not detect face in front image');
    }

    // Use front image for primary analysis
    const analysis = this.calculateFacialAnalysis(frontLandmarks);

    // Optionally analyze side profiles for additional metrics
    try {
      const leftSideLandmarks = await this.analyzeImage(images.leftSide);
      if (leftSideLandmarks) {
        // Update profile-specific metrics
        const sideAnalysis = this.calculateFacialAnalysis(leftSideLandmarks);
        analysis.jaw.chinProjection = sideAnalysis.jaw.chinProjection;
        analysis.nose.dorsalProfile = sideAnalysis.nose.dorsalProfile;
      }
    } catch (error) {
      console.warn('Could not analyze left side profile:', error);
    }

    return analysis;
  }
}

export const mediaPipeClientService = new MediaPipeClientService();