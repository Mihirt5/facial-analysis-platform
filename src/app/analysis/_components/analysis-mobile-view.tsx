"use client";

import { useState, useEffect } from "react";
import { api } from "~/trpc/react";
import { ANALYSIS_STRUCTURE } from "~/lib/analysis-structure";
import Image from "next/image";

export interface IAnalysisMobileViewProps {
  className?: string;
  analysisId: string;
}

export const AnalysisMobileView = ({
  className,
  analysisId,
  ...props
}: IAnalysisMobileViewProps) => {
  // Start with the first subtab from ANALYSIS_STRUCTURE
  const [activeTabKey, setActiveTabKey] = useState(ANALYSIS_STRUCTURE[0]?.key || "overview");
  const [selectedSectionKey, setSelectedSectionKey] = useState<string | null>(null);

  // Fetch analysis data
  const { data: analysisData, isLoading } =
    api.analysis.getAnalysisWithContent.useQuery({ analysisId });

  // Find the active subtab definition and data
  const activeSubtabDef = ANALYSIS_STRUCTURE.find(
    (subtab) => subtab.key === activeTabKey
  );

  const activeSubtabData = analysisData?.structure?.find(
    (subtab) => subtab.key === activeTabKey
  );

  // Reset selected section when tab changes, default to first section
  useEffect(() => {
    if (activeSubtabDef?.sections?.[0]) {
      setSelectedSectionKey(activeSubtabDef.sections[0].key);
    }
  }, [activeTabKey, activeSubtabDef]);

  // Get the selected section data from the structure
  const selectedSectionDef = activeSubtabDef?.sections.find(
    (s) => s.key === selectedSectionKey
  );

  const selectedSectionData = activeSubtabData?.sections?.find(
    (s) => s.key === selectedSectionKey
  );

  // Determine what to display
  const hasData = !!analysisData?.hasContent;
  const additionalFeaturesText = activeSubtabData?.additionalFeatures?.text || "";
  
  // Get section-specific image based on the active category
  const getSectionSpecificImage = () => {
    // If there's a section-specific image from the analysis content, use it first
    if (selectedSectionData?.content?.image) {
      return selectedSectionData.content.image;
    }
    
    // Otherwise, use category-appropriate photos from the analysis
    const photos = analysisData?.analysis;
    if (!photos) return "/chat-gpt-image-aug-14-2025-01-42-52-pm-10.png";
    
    switch (activeTabKey) {
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
  const evaluationText = selectedSectionData?.content?.explanation;

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f3f3f3]">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-[#4a4a4a]"></div>
          <p className="text-gray-500">Loading analysis...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={
        "bg-[#f3f3f3] min-h-screen relative overflow-x-hidden " + className
      }
    >
      {/* Header */}
      <div className="relative pt-4 px-6 pb-2">
        <img
          className="w-[40px] h-[40px]"
          style={{ objectFit: "cover", aspectRatio: "1" }}
          src="/untitled-design-58-10.png"
          alt="Logo"
        />
        <div
          className="text-[#4a4a4a] text-left font-inter text-lg font-medium mt-[-32px] ml-[52px]"
          style={{ letterSpacing: "-0.05em" }}
        >
          Analysis
        </div>
        <img
          className="w-[18px] h-[16px] absolute right-6 top-[28px]"
          src="/group0.svg"
          alt="Menu"
        />
      </div>

      {/* Tab Navigation - Scrollable horizontal tabs */}
      <div className="mb-3 overflow-x-auto overflow-y-hidden scrollbar-hide">
        <div className="px-6">
          <div className="bg-[#dcdcdc] rounded-[64px] h-[39px] relative inline-flex">
            <div className="flex items-center h-full px-2 gap-1 whitespace-nowrap">
              {ANALYSIS_STRUCTURE.map((subtab) => (
                <button
                  key={subtab.key}
                  onClick={() => setActiveTabKey(subtab.key)}
                  className={`relative px-3 py-2 text-xs font-medium font-inter transition-all flex-shrink-0 ${
                    activeTabKey === subtab.key
                      ? "text-parallel-main"
                      : "text-[#4a4a4a]"
                  }`}
                  style={{ letterSpacing: "-0.05em" }}
                >
                  {activeTabKey === subtab.key && (
                    <div className="absolute inset-0 bg-parallel-fade-grey rounded-[64px] border-solid border-parallel-main border -z-0" />
                  )}
                  <span className="relative z-10">{subtab.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 space-y-3 pb-8">
        {/* Additional Features Card - Top text bar */}
        <div className="bg-[#ffffff] rounded-[15px] p-4 overflow-hidden">
          <div
            className="text-[#4a4a4a] text-left font-inter text-[11px] font-medium mb-2"
            style={{ letterSpacing: "-0.05em" }}
          >
            Additional Features of your {activeSubtabDef?.name.toLowerCase() || "face"}
          </div>
          <div
            className="text-[#a0a0a0] text-left font-inter text-[10px] leading-[13px] font-medium"
            style={{ letterSpacing: "-0.05em" }}
          >
            {additionalFeaturesText || selectedSectionDef?.description || "Detailed analysis of your facial features"}
          </div>
        </div>

        {/* Main Image Card - Shows selected section's image */}
        <div className="bg-[#ffffff] rounded-[15px] relative overflow-hidden">
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
                <p className="text-gray-400 text-sm">No image available</p>
              </div>
            )}
            <div
              className="absolute top-4 left-4 text-[11px] uppercase text-white"
              style={{ 
                fontFamily: 'Inter, sans-serif',
                fontWeight: 500,
                letterSpacing: "-0.05em" 
              }}
            >
              FILLER TEXT
            </div>
          </div>
        </div>

        {/* Horizontal Scrollable Section Boxes in 2x2 Grid - Below Image */}
        <div className="overflow-x-auto overflow-y-hidden -mx-6 pb-2 scrollbar-hide">
          <div className="flex gap-4 px-6">
            {/* Group sections into pages of 4 (2x2 grid) */}
            {activeSubtabDef?.sections
              .sort((a, b) => a.displayOrder - b.displayOrder)
              .reduce((pages: any[][], section, index) => {
                const pageIndex = Math.floor(index / 4);
                if (!pages[pageIndex]) {
                  pages[pageIndex] = [];
                }
                pages[pageIndex].push(section);
                return pages;
              }, [])
              .map((page, pageIndex) => {
                // If page has 1-2 items, stack vertically; if 3-4 items, use 2x2 grid
                const useVerticalStack = page.length <= 2;
                
                return (
                  <div
                    key={pageIndex}
                    className="flex-shrink-0"
                    style={{ 
                      width: useVerticalStack ? 'auto' : 'calc(100vw - 48px)',
                      maxWidth: useVerticalStack ? 'none' : 'calc(100vw - 48px)'
                    }}
                  >
                    <div className={useVerticalStack ? "flex flex-col gap-3 items-start" : "grid grid-cols-2 gap-3 grid-rows-2"}>
                      {page.map((section) => {
                        const isSelected = selectedSectionKey === section.key;
                        
                        return (
                          <button
                            key={section.key}
                            onClick={() => setSelectedSectionKey(section.key)}
                            className={`rounded-lg p-3 text-left transition-all h-[60px] ${
                              useVerticalStack ? "w-[calc((100vw_-_48px)_*_0.5_-_6px)]" : ""
                            } ${
                              isSelected
                                ? "border border-solid border-[#4a4a4a] bg-parallel-fade-grey"
                                : "bg-white"
                            }`}
                          >
                            <div
                              className={`text-left font-inter text-[11px] font-medium ${
                                isSelected ? "text-parallel-main" : "text-[#4a4a4a]"
                              }`}
                              style={{ letterSpacing: "-0.05em" }}
                            >
                              {section.name}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        {/* Evaluation Card - Shows selected section's evaluation */}
        <div className="bg-[#ffffff] rounded-[15px] p-4 overflow-hidden">
          <div
            className="text-parallel-main text-left font-inter text-xl font-medium mb-2"
            style={{ letterSpacing: "-0.05em" }}
          >
            Evaluation
          </div>
          <div
            className="text-[#a0a0a0] text-left font-inter text-[10px] leading-[13px] font-medium"
            style={{ letterSpacing: "-0.05em" }}
          >
            {evaluationText || "Your analysis is being processed. Detailed evaluation will appear here once complete."}
          </div>
        </div>
      </div>
    </div>
  );
};

