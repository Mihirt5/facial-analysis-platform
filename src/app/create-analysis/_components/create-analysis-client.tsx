"use client";
import type { NextPage } from "next";
import { useState, useEffect } from "react";
import { useIsMobile } from "~/hooks/use-mobile";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { api } from "~/trpc/react";
import { UploadButton } from "~/utils/uploadthing";
import { DesktopCreateAnalysis } from "./desktop-create-analysis";

const CreateAnalysisClient: NextPage = () => {
  const isMobile = useIsMobile();
  // Stabilize initial render to avoid hydration/hook-order issues
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const router = useRouter();
  const [uploadedImages, setUploadedImages] = useState<Record<string, { url: string; key: string }>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const utils = api.useUtils();

  // Declare hooks first; choose branch after to keep hook order stable

  // Check if user already has an analysis - use safe selection
  const { data: existingAnalysis, isLoading: isCheckingAnalysis, refetch: refetchAnalysis } = api.analysis.getFirstAnalysis.useQuery(undefined, {
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    staleTime: 0, // Always consider data stale
    gcTime: 0, // Don't cache this query
  });

  // Also check for pending submissions (photos uploaded already)
  const { data: pendingSubmission } = api.analysis.hasPendingSubmission.useQuery(undefined, {
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    staleTime: 0,
    gcTime: 0,
  });

  // Redirect to analysis page if user already has an analysis or a pending submission
  useEffect(() => {
    if (!isCheckingAnalysis && (existingAnalysis || pendingSubmission?.hasPending)) {
      console.log("User already has analysis or pending submission, redirecting to /analysis");
      window.location.href = "/analysis";
    }
  }, [existingAnalysis, isCheckingAnalysis, pendingSubmission?.hasPending]);

  // Also refetch analysis status when component mounts to ensure fresh data
  useEffect(() => {
    refetchAnalysis();
  }, [refetchAnalysis]);

  const submitPhotos = api.analysis.submitPhotos.useMutation({
    onSuccess: async () => {
      await Promise.all([
        utils.analysis.getFirstAnalysis.invalidate(),
        utils.analysis.hasPendingSubmission.invalidate(),
      ]);
      window.location.href = "/analysis";
    },
    onError: () => setIsSubmitting(false),
  });

  const mobileLayoutItems = [
    {
      mobileLayoutHeight: "103px",
      mobileLayoutPadding: "0px 1px 0px 4px",
      group55: "/Group-55.svg",
      groupIconBorder: "",
      groupIconPadding: "",
      groupIconBackgroundColor: "",
      front: "Front",
      key: "front",
    },
    {
      mobileLayoutHeight: "",
      mobileLayoutPadding: "",
      group55: "/Group-55.svg",
      groupIconBorder: "",
      groupIconPadding: "",
      groupIconBackgroundColor: "",
      front: "Left 3/4 ",
      key: "leftThreeQuarter",
    },
    {
      mobileLayoutHeight: "",
      mobileLayoutPadding: "",
      group55: "/Group-55.svg",
      groupIconBorder: "",
      groupIconPadding: "",
      groupIconBackgroundColor: "",
      front: "Left Side",
      key: "leftSide",
    },
    {
      mobileLayoutHeight: "",
      mobileLayoutPadding: "",
      group55: "/Group-55.svg",
      groupIconBorder: "",
      groupIconPadding: "",
      groupIconBackgroundColor: "",
      front: "Right 3/4",
      key: "rightThreeQuarter",
    },
    {
      mobileLayoutHeight: "",
      mobileLayoutPadding: "",
      group55: "/Group-55.svg",
      groupIconBorder: "",
      groupIconPadding: "",
      groupIconBackgroundColor: "",
      front: "Right Side",
      key: "rightSide",
    },
    {
      mobileLayoutHeight: "121px",
      mobileLayoutPadding: "0px 1px 18px 4px",
      group55: "/Group-55.svg",
      groupIconBorder: "none",
      groupIconPadding: "0",
      groupIconBackgroundColor: "transparent",
      front: "Hairline",
      key: "hairline",
    },
  ];

  // Only require 5 mandatory images (hairline optional)
  const requiredKeys = ["front", "leftThreeQuarter", "rightThreeQuarter", "leftSide", "rightSide"] as const;
  const requiredUploadedCount = requiredKeys.filter((k) => !!uploadedImages[k]?.url).length;
  const totalRequired = requiredKeys.length; // 5
  const uploadedCount = Object.keys(uploadedImages).length;
  const progressPercent = Math.round((requiredUploadedCount / totalRequired) * 100);

  const handleImageUpload = (key: string, files: { ufsUrl: string; key: string }[]) => {
    // Handle UploadThing response
    if (files?.[0]) {
      setUploadedImages(prev => ({
        ...prev,
        [key]: { url: files[0]?.ufsUrl ?? "", key: files[0]?.key ?? "" }
      }));
    }
  };

  const handleSubmit = async () => {
    // Require at least mandatory 5 images; hairline optional
    if (requiredUploadedCount < totalRequired) return;
    setIsSubmitting(true);
    try {
      await submitPhotos.mutateAsync({
        frontPicture: uploadedImages.front?.url || "",
        leftPicture: uploadedImages.leftThreeQuarter?.url || "",
        rightPicture: uploadedImages.rightThreeQuarter?.url || "", 
        leftSidePicture: uploadedImages.leftSide?.url || "",
        rightSidePicture: uploadedImages.rightSide?.url || "",
        hairlinePicture: uploadedImages.hairline?.url || undefined,
      });
    } catch (e) {
      setIsSubmitting(false);
    }
  };

  // Keep markup stable until mounted
  if (!mounted) {
    return (
      <div className="w-full relative bg-[#f3f3f3] overflow-hidden flex flex-col items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-Parallel-Main"></div>
          <p className="text-[#a0a0a0] font-[Inter]">Loading...</p>
        </div>
      </div>
    );
  }

  // Show desktop design for non-mobile users
  if (!isMobile) {
    return <DesktopCreateAnalysis />;
  }

  // Show loading state while checking if user already has analysis
  if (isCheckingAnalysis) {
    return (
      <div className="w-full relative bg-[#f3f3f3] overflow-hidden flex flex-col items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-Parallel-Main"></div>
          <p className="text-[#a0a0a0] font-[Inter]">Checking your analysis status...</p>
        </div>
      </div>
    );
  }

  // Don't render the upload form if user already has an analysis (they'll be redirected)
  if (existingAnalysis) {
    return null;
  }

  return (
    <div className="w-full relative bg-[#f3f3f3] overflow-hidden flex flex-col items-end pt-[41px] pb-[49px] pl-[34px] pr-[39px] box-border gap-[29px] leading-[normal] tracking-[normal] text-left text-[13px] text-[#a0a0a0] font-[Inter]">
      <div className="self-stretch h-[46px] flex items-start justify-end pt-0 pb-[13.5px] pl-0 pr-[15px] box-border max-w-full">
        <div className="flex-1 flex items-end gap-[17.5px] max-w-full">
          <Image
            className="cursor-pointer [border:none] p-0 bg-[transparent] h-[32.5px] w-[32.5px] relative object-contain"
            width={32.5}
            height={32.5}
            sizes="100vw"
            alt=""
            src="/Group@2x.png"
            onClick={() => router.back()}
          />
          <div className="flex-1 flex flex-col items-start justify-end pt-0 px-0 pb-[12.5px]">
            <div className="self-stretch h-1 relative rounded-[100px] bg-[#d9d9d9]">
              <div className="absolute top-[0px] left-[0px] rounded-[100px] bg-[#d9d9d9] w-full h-full hidden" />
              <div className="absolute top-[0px] left-[0px] rounded-[100px] bg-Parallel-Main h-1 z-[1]" style={{ width: `${progressPercent}%` }} />
            </div>
          </div>
        </div>
      </div>
      <section className="self-stretch flex items-start justify-end pt-0 pb-2.5 pl-1 pr-[29px] box-border max-w-full text-left text-xl sm:text-2xl md:text-3xl lg:text-[32px] text-Parallel-Main font-[Inter]">
        <div className="flex-1 flex flex-col items-start gap-[13px] max-w-full">
          <h1 className="m-0 relative text-[length:inherit] tracking-[-0.05em] font-medium font-[inherit] leading-tight">
            <p className="m-0">Upload 5 Neutral-Lighting Selfies</p>
          </h1>
          <div className="relative text-[13px] tracking-[-0.05em] leading-[13px] font-medium text-[#a0a0a0]">{`This enables baseline scan & future progress comparisons.`}</div>
        </div>
      </section>
      {mobileLayoutItems.map((item, index) => (
        <div key={index} className="self-stretch h-[103px] flex items-start justify-end py-0 pl-1 pr-px box-border max-w-full text-left text-xl text-Parallel-Main font-[Inter]">
          <div className="flex-1 flex items-start gap-[23px] max-w-full mq259:flex-wrap">
            {uploadedImages[item.key] ? (
              <img
                className="h-[103px] w-[103px] relative mq259:flex-1 object-cover rounded-[8px]"
                src={uploadedImages[item.key]?.url}
                alt=""
                style={{
                  border: item.groupIconBorder,
                  padding: item.groupIconPadding,
                  backgroundColor: item.groupIconBackgroundColor,
                }}
              />
            ) : (
              <Image
                className="h-[103px] w-[103px] relative mq259:flex-1"
                loading="lazy"
                width={103}
                height={103}
                sizes="100vw"
                alt=""
                src={item.group55}
                style={{
                  border: item.groupIconBorder,
                  padding: item.groupIconPadding,
                  backgroundColor: item.groupIconBackgroundColor,
                }}
              />
            )}
            <div className="h-[97px] flex-1 flex flex-col items-start pt-1.5 px-0 pb-0 box-border">
              <div className="self-stretch flex-1 flex flex-col items-start gap-[18px]">
                <div className="w-[118px] flex-1 flex flex-col items-start gap-[3px]">
                  <h3 className="m-0 relative text-[length:inherit] tracking-[-0.05em] font-medium font-[inherit]">
                    {item.front}
                  </h3>
                  <div className="relative text-[13px] tracking-[-0.05em] leading-[13px] font-medium text-[#a0a0a0] whitespace-nowrap">
                    Face camera directly
                  </div>
                </div>
                <UploadButton
                  endpoint="imageUploader"
                  onClientUploadComplete={(res) => {
                    console.log("Upload successful:", res);
                    handleImageUpload(item.key, res);
                  }}
                  onUploadError={(error: Error) => {
                    console.error("Upload error:", error);
                    alert(`Upload failed: ${error.message}`);
                  }}
                  onUploadBegin={(file) => {
                    console.log("Upload started:", file);
                  }}
                  appearance={{
                    button: "border-Parallel-Main border-solid border-[1px] py-[5px] px-[50px] bg-Parallel-Fade-Grey self-stretch h-[33px] rounded-[64px] box-border overflow-hidden shrink-0 flex items-start hover:bg-[rgba(112,112,112,0.16)] hover:border-[#707070] hover:border-solid hover:hover:border-[1px] hover:box-border text-xs tracking-[-0.05em] leading-[19px] font-medium font-[Inter] text-Parallel-Main text-center whitespace-nowrap",
                    allowedContent: "hidden",
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      ))}
      <div className="self-stretch h-[69px] flex flex-col items-start gap-[15px] max-w-full">
        <div className="w-[362px] h-[13px] flex items-start py-0 px-[85px] box-border max-w-full mq258:pl-5 mq258:pr-5 mq258:box-border">
          <div className="relative tracking-[-0.05em] leading-[13px] font-medium">
            Upload {Math.max(0, totalRequired - requiredUploadedCount)} more photos to continue
            {uploadedImages.hairline?.url ? " (hairline received)" : " (hairline optional)"}
          </div>
        </div>
        <button 
          onClick={handleSubmit}
          disabled={requiredUploadedCount < totalRequired || isSubmitting}
          className="cursor-pointer border-Parallel-Main border-solid border-[1px] py-[9px] px-5 bg-[rgba(0,0,0,0.09)] self-stretch h-[41px] rounded-[64px] box-border overflow-hidden shrink-0 flex items-start justify-center hover:bg-[rgba(51,51,51,0.09)] hover:border-[#707070] hover:border-solid hover:hover:border-[1px] hover:box-border disabled:opacity-50"
        >
          <div className="w-[134px] relative text-[15px] tracking-[-0.05em] leading-[19px] font-medium font-[Inter] text-Parallel-Main text-center inline-block shrink-0">
            {isSubmitting ? "Processing..." : "Continue"}
          </div>
        </button>
      </div>
    </div>
  );
};

export default CreateAnalysisClient;
