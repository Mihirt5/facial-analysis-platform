"use client";

import React, { useState } from "react";
import { api } from "~/trpc/react";
import { ANALYSIS_STRUCTURE } from "~/lib/analysis-structure";
import { Eye, Square, Droplets, Skull } from "lucide-react";
import { useIsMobile } from "~/hooks/use-mobile";
import { AnalysisProcessorClient } from "~/components/analysis-processor-client";
import { SimpleAnalysisInline } from "./simple-analysis-inline";
import Image from "next/image";

interface AnalysisViewProps {
  analysisId: string;
  activeSubtab?: string;
  onSubtabChange?: (subtab: string) => void;
}

const subtabIcons = {
  eye_area: Eye,
  nose: Square,
  jaw: Skull,
  skin: Droplets,
};

export function AnalysisView({
  analysisId,
  activeSubtab,
  onSubtabChange: _onSubtabChange,
}: AnalysisViewProps) {
  const [internalActiveSubtab, setInternalActiveSubtab] = useState(
    ANALYSIS_STRUCTURE[0]?.key,
  );
  const isMobile = useIsMobile();
  const [isMounted, setIsMounted] = useState(false);

  // Fix hydration mismatch by waiting for component to mount
  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  // Use external activeSubtab if provided, otherwise use internal state
  const currentActiveSubtab = activeSubtab ?? internalActiveSubtab ?? ANALYSIS_STRUCTURE[0]?.key;

  // Handle subtab change
  const handleSubtabChange = (subtab: string) => {
    if (_onSubtabChange) {
      _onSubtabChange(subtab);
    } else {
      setInternalActiveSubtab(subtab);
    }
  };

  const { data: completionData, isLoading: isLoadingCompletion } =
    api.analysis.checkAnalysisCompletion.useQuery({ analysisId });

  const { data: analysisData, isLoading: isLoadingAnalysis } =
    api.analysis.getAnalysisWithContent.useQuery({ analysisId });

  // Get current subtab data from structured analysis data
  const currentSubtabData = analysisData?.structure?.find(
    (subtab) => subtab.key === currentActiveSubtab,
  );

  // Get active subtab data
  const activeSubtabData = ANALYSIS_STRUCTURE.find(
    (subtab) => subtab.key === currentActiveSubtab,
  );

  // State for selected section
  const [selectedSectionKey, setSelectedSectionKey] = useState<string | null>(
    activeSubtabData?.sections[0]?.key ?? null,
  );

  // Update selected section when subtab changes
  React.useEffect(() => {
    if (activeSubtabData?.sections[0]?.key) {
      setSelectedSectionKey(activeSubtabData.sections[0].key);
    }
  }, [activeSubtabData]);

  if (isLoadingCompletion || isLoadingAnalysis || !isMounted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#fafafa]">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-[#4a4a4a]"></div>
          <p className="text-gray-500">Loading your analysis...</p>
        </div>
      </div>
    );
  }

  if (!completionData || !analysisData) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#fafafa]">
        <div className="text-center">
          <p className="text-gray-500">Unable to load analysis data</p>
        </div>
      </div>
    );
  }

  // Show the new desktop design regardless of completion status
  // Analysis content will show placeholder text until complete
  // Get the selected section data
  const selectedSection = currentSubtabData?.sections?.find(
    (section) => section.key === selectedSectionKey,
  );

  // Get the section definition for the label
  const selectedSectionDef = activeSubtabData?.sections.find(
    (s) => s.key === selectedSectionKey,
  );

  // Get section-specific image based on the active category (same logic as mobile)
  const getSectionSpecificImage = () => {
    // If there's a section-specific image from the analysis content, use it first
    if (selectedSection?.content?.image) {
      return selectedSection.content.image;
    }
    
    // Otherwise, use category-appropriate photos from the analysis
    const photos = analysisData?.analysis;
    if (!photos) return "/chat-gpt-image-aug-14-2025-01-42-52-pm-10.png";
    
    switch (currentActiveSubtab) {
      case "nose":
        return photos.leftPicture || photos.frontPicture;
      case "lips_mouth":
        return photos.frontPicture;
      case "jaw_chin":
        return photos.rightSidePicture || photos.frontPicture;
      case "ears":
        return photos.leftSidePicture || photos.frontPicture;
      case "hairline_forehead":
        return photos.hairlinePicture || photos.frontPicture;
      case "brow_eye":
        return photos.frontPicture;
      case "cheeks_midface":
        return photos.leftPicture || photos.frontPicture;
      case "skin_texture":
        return photos.frontPicture;
      case "overview":
        return photos.frontPicture;
      default:
        return photos.frontPicture || "/chat-gpt-image-aug-14-2025-01-42-52-pm-10.png";
    }
  };
  
  const imageUrl = getSectionSpecificImage();

  return (
    <div className="h-screen overflow-hidden bg-[#fafafa] p-3">
      <div className="flex h-full flex-col rounded-[15px] bg-[#f3f3f3] p-4">
        {/* Header Section */}
        <div className="mb-3 overflow-hidden rounded-[15px] bg-white p-4">
          <h2
            className="mb-2 text-[20px] text-[#4a4a4a]"
            style={{ 
              fontFamily: 'PP Neue Montreal, sans-serif',
              fontWeight: 500,
              letterSpacing: "-0.05em" 
            }}
          >
            Additional Features of your{" "}
            {activeSubtabData?.name.toLowerCase() || "face"}
          </h2>
          <p
            className="text-[12px] leading-[16px] text-[#a0a0a0]"
            style={{ 
              fontFamily: 'PP Neue Montreal, sans-serif',
              fontWeight: 500,
              letterSpacing: "-0.05em" 
            }}
          >
            {selectedSectionDef?.description ||
              "Detailed analysis of your facial features"}
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid flex-1 grid-cols-1 gap-3 overflow-hidden lg:grid-cols-[280px_1fr]">
          {/* Left Column - Feature Cards */}
          <div className="flex flex-col gap-2 overflow-y-auto">
            {activeSubtabData?.sections
              .sort((a, b) => a.displayOrder - b.displayOrder)
              .map((section, index) => {
                const sectionData = currentSubtabData?.sections?.find(
                  (s) => s.key === section.key,
                );
                const isSelected = selectedSectionKey === section.key;
                const isFirstSection = index === 0;

                return (
                  <button
                    key={section.key}
                    onClick={() => setSelectedSectionKey(section.key)}
                    className={`flex min-h-[120px] flex-shrink-0 flex-col justify-between overflow-hidden rounded-[15px] p-4 text-left transition-all ${
                      isSelected
                        ? "border border-solid border-[#4a4a4a] bg-parallel-fade-grey"
                        : "bg-white hover:bg-gray-50"
                    }`}
                  >
                    <div
                      className={`text-[10px] uppercase ${
                        isSelected ? "text-[#4a4a4a]" : "text-[#4a4a4a]"
                      }`}
                      style={{ 
                        fontFamily: 'PP Neue Montreal, sans-serif',
                        fontWeight: 500,
                        letterSpacing: "-0.05em" 
                      }}
                    >
                      {section.description}
                    </div>
                    <div
                      className={`text-[16px] ${
                        isSelected ? "text-[#4a4a4a]" : "text-[#4a4a4a]"
                      }`}
                      style={{ 
                        fontFamily: 'PP Neue Montreal, sans-serif',
                        fontWeight: 500,
                        letterSpacing: "-0.05em" 
                      }}
                    >
                      {section.name}
                    </div>
                  </button>
                );
              })}
          </div>

          {/* Right Column - Image and Evaluation */}
          <div className="flex flex-col gap-3 overflow-y-auto">
            {/* Image Section */}
            <div className="relative overflow-hidden rounded-[15px] bg-white">
              <div className="relative aspect-[3/2] w-full">
                {imageUrl ? (
                  <Image
                    src={imageUrl}
                    alt="Analysis photo"
                    fill
                    className="object-contain"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gray-100">
                    <p className="text-gray-400">No image available</p>
                  </div>
                )}
                <div
                  className="absolute bottom-2 right-4 text-[10px] uppercase text-white"
                  style={{ 
                    fontFamily: 'PP Neue Montreal, sans-serif',
                    fontWeight: 500,
                    letterSpacing: "-0.05em" 
                  }}
                >
                  {activeSubtabData?.name || "Analysis"}
                </div>
              </div>
            </div>

            {/* Evaluation Section */}
            <div className="overflow-hidden rounded-[15px] bg-white p-4 pb-8">
              <h3
                className="mb-2 text-[20px] text-[#4a4a4a]"
                style={{ 
                  fontFamily: 'PP Neue Montreal, sans-serif',
                  fontWeight: 500,
                  letterSpacing: "-0.05em" 
                }}
              >
                Evaluation
              </h3>
              <div
                className="text-[12px] leading-[16px] text-[#a0a0a0]"
                style={{ 
                  fontFamily: 'PP Neue Montreal, sans-serif',
                  fontWeight: 500,
                  letterSpacing: "-0.05em" 
                }}
              >
                {selectedSection?.content?.explanation || 
                  "Your analysis is being processed. Detailed evaluation will appear here once complete."
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
