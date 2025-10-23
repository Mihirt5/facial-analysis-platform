"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { UploadButton } from "~/utils/uploadthing";
import { api } from "~/trpc/react";
import Image from "next/image";
import { Button } from "~/components/ui/button";

interface UploadedImage {
  url: string;
  key: string;
}

interface FaceImages {
  front: UploadedImage | null;
  leftThreeQuarter: UploadedImage | null;
  rightThreeQuarter: UploadedImage | null;
  leftSide: UploadedImage | null;
  rightSide: UploadedImage | null;
  hairline: UploadedImage | null;
}

const imageTypes = [
  {
    key: "front" as keyof FaceImages,
    title: "1. Front Facing",
    description: "Look directly at the camera with a neutral expression",
    icon: "/group0.svg",
  },
  {
    key: "leftThreeQuarter" as keyof FaceImages,
    title: "2. 3/4 Left",
    description: "Turn your head 45 degrees to the left",
    icon: "/Group1.svg",
  },
  {
    key: "leftSide" as keyof FaceImages,
    title: "3. Left Side",
    description: "Turn your head completely to the left (90 degrees)",
    icon: "/group2.svg",
  },
  {
    key: "rightThreeQuarter" as keyof FaceImages,
    title: "4. 3/4 Right",
    description: "Turn your head 45 degrees to the right",
    icon: "/group3.svg",
  },
  {
    key: "rightSide" as keyof FaceImages,
    title: "5. Right Side",
    description: "Turn your head completely to the right (90 degrees)",
    icon: "/group4.svg",
  },
  {
    key: "hairline" as keyof FaceImages,
    title: "6. Hairline",
    description: "Tilt chin slightly down; keep forehead and hairline in frame",
    icon: "/group5.svg",
  },
];

export function DesktopCreateAnalysis() {
  const router = useRouter();
  const [images, setImages] = useState<FaceImages>({
    front: null,
    leftThreeQuarter: null,
    rightThreeQuarter: null,
    leftSide: null,
    rightSide: null,
    hairline: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [noiseOffset, setNoiseOffset] = useState(0);
  
  // Animate the noise/gradient
  useEffect(() => {
    const interval = setInterval(() => {
      setNoiseOffset((prev) => (prev + 1) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  // Redirect away if analysis exists or a pending submission already exists
  const { data: existingAnalysis } = api.analysis.getFirstAnalysis.useQuery(undefined, {
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    staleTime: 0,
    gcTime: 0,
  });
  const { data: pendingSubmission } = api.analysis.hasPendingSubmission.useQuery(undefined, {
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    staleTime: 0,
    gcTime: 0,
  });

  useEffect(() => {
    if (existingAnalysis || pendingSubmission?.hasPending) {
      router.replace("/analysis");
    }
  }, [existingAnalysis, pendingSubmission?.hasPending, router]);

  const submitPhotos = api.analysis.submitPhotos.useMutation({
    onSuccess: () => {
      router.push(`/analysis`);
    },
    onError: (error) => {
      console.error("Failed to submit photos:", error);
      setIsSubmitting(false);
    },
  });

  const handleImageUpload = (
    type: keyof FaceImages,
    files: { url: string; key: string }[],
  ) => {
    if (files?.[0]) {
      setImages((prev) => ({
        ...prev,
        [type]: { url: files[0]?.url, key: files[0]?.key },
      }));
    }
  };

  const removeImage = (type: keyof FaceImages) => {
    setImages((prev) => ({
      ...prev,
      [type]: null,
    }));
  };

  // Require 5 images; hairline optional
  const requiredKeys: (keyof FaceImages)[] = [
    "front",
    "leftThreeQuarter",
    "rightThreeQuarter",
    "leftSide",
    "rightSide",
  ];
  const requiredUploadedCount = requiredKeys.filter((k) => !!images[k]).length;
  const allRequiredUploaded = requiredUploadedCount === requiredKeys.length;
  const progressPercentage = (requiredUploadedCount / requiredKeys.length) * 100;

  const handleSubmit = async () => {
    if (!allRequiredUploaded) {
      console.log("Not all images uploaded");
      return;
    }

    console.log("Submitting images:", images);
    setIsSubmitting(true);
    
    try {
      await submitPhotos.mutateAsync({
        frontPicture: images.front!.url,
        leftPicture: images.leftThreeQuarter!.url,
        rightPicture: images.rightThreeQuarter!.url,
        leftSidePicture: images.leftSide!.url,
        rightSidePicture: images.rightSide!.url,
        hairlinePicture: images.hairline?.url,
      });
    } catch (error) {
      console.error("Error submitting analysis:", error);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#C0C7D4] h-screen relative overflow-hidden font-['Inter']">
      {/* Left Panel - Animated Blue Gradient with Fractal Noise */}
      <div className="rounded-[15px] w-[910px] h-[calc(100vh-28px)] absolute left-2.5 top-3.5 overflow-hidden">
        {/* Animated gradient background */}
        <div 
          className="absolute inset-0 transition-all duration-1000"
          style={{
            backgroundImage: `linear-gradient(${noiseOffset}deg, #8B9DC3 0%, #C0C7D4 25%, #DFE3E8 50%, #C0C7D4 75%, #8B9DC3 100%)`,
            backgroundSize: '400% 400%',
          }}
        />
        
        {/* Animated blurred circles for depth */}
        <div
          className="absolute w-[600px] h-[600px] rounded-full opacity-40 transition-transform duration-[3000ms]"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.6) 0%, rgba(192,199,212,0) 70%)',
            filter: 'blur(80px)',
            left: '20%',
            top: '10%',
            transform: `translate(${Math.sin(noiseOffset / 30) * 50}px, ${Math.cos(noiseOffset / 30) * 50}px)`,
          }}
        />
        <div
          className="absolute w-[400px] h-[400px] rounded-full opacity-30 transition-transform duration-[4000ms]"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(139,157,195,0.8) 0%, rgba(192,199,212,0) 70%)',
            filter: 'blur(60px)',
            right: '15%',
            bottom: '20%',
            transform: `translate(${Math.cos(noiseOffset / 40) * 60}px, ${Math.sin(noiseOffset / 40) * 60}px)`,
          }}
        />
        
        {/* SVG noise filter */}
        <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none">
          <filter id="fractalNoiseCreate">
            <feTurbulence 
              type="fractalNoise" 
              baseFrequency="0.65" 
              numOctaves="3" 
              stitchTiles="stitch"
              seed={noiseOffset}
            />
            <feColorMatrix type="saturate" values="0"/>
          </filter>
          <rect width="100%" height="100%" filter="url(#fractalNoiseCreate)" />
        </svg>
        
        {/* Logo */}
        <Image
          src="/untitled-design-58-20.png"
          alt="Parallel Logo"
          width={82}
          height={82}
          className="w-[82px] h-[82px] absolute left-[67px] top-[77px] object-cover z-10"
          priority
        />
        
        {/* Welcome text - smaller */}
        <div className="absolute left-[67px] top-[190px] z-10">
          <h1
            className="text-left font-medium text-[48px] text-white"
            style={{ letterSpacing: "-0.02em" }}
          >
            Upload 5 Neutral-Lighting Selfies
          </h1>
          <p className="text-white text-lg mt-2" style={{ letterSpacing: "-0.02em" }}>
            This enables baseline scan &amp; future progress comparisons.
          </p>
        </div>
      </div>

      {/* Right Panel - Photo Upload */}
      <div className="w-[510px] h-[calc(100vh-28px)] absolute right-[29px] top-3.5">
        <div className="bg-[#f3f3f3] rounded-[15px] w-full h-full absolute left-0 top-0 px-12 py-8 overflow-y-auto">
          {/* Progress bar */}
          <div className="bg-[#d9d9d9] rounded-[100px] w-full h-[7px] mb-12">
            <div
              className="bg-[#4a4a4a] rounded-[100px] h-[7px] transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>

          {/* Photo Upload Sections */}
          <div className="space-y-6">
            {imageTypes.map((imageType) => (
              <div key={imageType.key} className="flex items-center gap-4">
                <div className="w-[103px] h-[103px] flex-shrink-0 relative">
                  <div className="bg-white rounded-[10px] border-dashed border-[#4a4a4a] border w-full h-full flex items-center justify-center">
                    {images[imageType.key] ? (
                      <Image
                        src={images[imageType.key]!.url}
                        alt={imageType.title}
                        width={103}
                        height={103}
                        className="w-full h-full object-cover rounded-[9px]"
                      />
                    ) : (
                      <Image
                        src={imageType.icon}
                        alt={imageType.title}
                        width={40}
                        height={40}
                        className="w-[40px] h-[40px] object-contain"
                      />
                    )}
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-[#4a4a4a] text-xl font-medium mb-1">
                    {imageType.title}
                  </h3>
                  <p className="text-[#4a4a4a] text-[13px] mb-3">
                    {imageType.description}
                  </p>
                  <UploadButton
                    endpoint="imageUploader"
                    onClientUploadComplete={(res) => {
                      handleImageUpload(imageType.key, res);
                    }}
                    onUploadError={(error: Error) => {
                      alert(`ERROR! ${error.message}`);
                    }}
                    className="ut-button:w-full ut-button:bg-[#4a4a4a] ut-button:text-white ut-button:ut-readying:bg-[#4a4a4a]/50 ut-button:ut-uploading:bg-[#4a4a4a]/50 ut-button:ut-readying:text-white ut-button:ut-uploading:text-white ut-button:h-[38px] ut-button:px-4 ut-button:text-xs ut-button:rounded-[64px] ut-button:border ut-button:border-[#4a4a4a] ut-button:font-medium ut-button:hover:bg-[#3a3a3a] ut-button:hover:border-[#3a3a3a] ut-allowed-content:hidden"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Continue Button */}
          <div className="mt-12">
            <Button
              onClick={handleSubmit}
              disabled={!allRequiredUploaded || isSubmitting}
              className={`w-full h-[52px] rounded-lg text-base font-medium transition-colors ${
                allRequiredUploaded && !isSubmitting
                  ? "bg-[#4a4a4a] text-white hover:bg-[#3a3a3a]"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              {isSubmitting ? "Processing..." : "Continue"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
