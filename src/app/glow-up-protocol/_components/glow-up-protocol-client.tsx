"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { ANALYSIS_STRUCTURE } from "~/lib/analysis-structure";
import { api } from "~/trpc/react";
import { GlowUpProtocolView } from "./glow-up-protocol-view";

// Component that uses useSearchParams - wrapped in Suspense
function GlowUpProtocolPageWithSearchParams() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get active tab from URL params or default to eyes tab
  const tabFromUrl = searchParams.get("tab");
  const [activeSubtab, setActiveSubtab] = useState(
    tabFromUrl ?? "eyes",
  );

  // Redirect to eyes tab if no tab is specified
  useEffect(() => {
    if (!tabFromUrl) {
      router.push("/glow-up-protocol?tab=eyes");
    }
  }, [tabFromUrl, router]);

  // Update active subtab when URL changes
  useEffect(() => {
    const newTab = searchParams.get("tab");
    if (newTab && newTab !== activeSubtab) {
      setActiveSubtab(newTab);
    }
  }, [searchParams, activeSubtab]);

  // Query for analysis and intake data
  const { data: analysis, isLoading: isAnalysisLoading } =
    api.analysis.getFirstAnalysis.useQuery();
  const { data: intake, isLoading: isIntakeLoading } =
    api.intake.getMine.useQuery();
  const { data: analysisWithContent } = api.analysis.getAnalysisWithContent.useQuery(
    { analysisId: analysis?.id || "" },
    { enabled: !!analysis?.id }
  );
  
  // Query for morphs to check if they're processed
  const { data: morphsData, isLoading: isMorphsLoading } = 
    api.morphV2.getMorphs.useQuery(
      { analysisId: analysis?.id ?? "" },
      { enabled: !!analysis?.id }
    );

  // Query for recommendations
  const { data: recommendationsData, isLoading: isRecommendationsLoading } = 
    api.morphV2.getRecommendations.useQuery(
      { analysisId: analysis?.id ?? "" },
      { enabled: !!analysis?.id }
    );

  // Map the new morphs structure to the expected format
  const morphs = morphsData ? {
    overall: morphsData.overallUrl,
    eyes: morphsData.eyesUrl,
    skin: morphsData.skinUrl,
    jawline: morphsData.jawlineUrl,
    hair: analysis?.morphUrl, // Use main analysis for hair tab
    lastUpdate: morphsData.updatedAt?.toISOString(),
  } : null;


  // Debug logging for morph data
  useEffect(() => {
    console.log("🔍 [Debug] Analysis data:", analysis);
    console.log("🔍 [Debug] Morphs data:", morphs);
    console.log("🔍 [Debug] Analysis morphUrl:", analysis?.morphUrl);
    console.log("🔍 [Debug] Analysis morphMetadata:", analysis?.morphMetadata);
    console.log("🔍 [Debug] Recommendations data:", recommendationsData);
    console.log("🔍 [Debug] Recommendations loading:", isRecommendationsLoading);
  }, [analysis, morphs, recommendationsData, isRecommendationsLoading]);


  // Show loading state while checking data - don't wait for morphs since they're optional
  if (isAnalysisLoading || isIntakeLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
          <p className="text-gray-500">Loading your protocol...</p>
        </div>
      </div>
    );
  }

  // If no analysis exists, redirect to create-analysis
  if (!analysis) {
    router.push("/create-analysis");
    return null;
  }

  // Show processing status only if we have no recommendations AND analysis is not complete
  // If we have recommendations, show them even if morphs aren't ready
  if (analysis.status !== "complete" && !recommendationsData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="mb-6">
            <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
              <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">Preparing Your Glow-Up Protocol</h1>
            <p className="text-gray-600 leading-relaxed">
              We're finalizing your personalized recommendations and morphs. 
              This usually takes 2-5 minutes.
            </p>
          </div>
          
            <div className="space-y-3 text-sm text-gray-500">
              <div className="flex items-center justify-center gap-2">
                <div className={`w-2 h-2 rounded-full ${analysis.status === "complete" ? "bg-green-500" : "bg-purple-500"}`}></div>
                <span>Facial analysis {analysis.status === "complete" ? "complete" : "in progress"}</span>
              </div>
            </div>

          <div className="mt-6">
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Check Status
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Handle subtab changes by updating URL
  const handleSubtabChange = (subtab: string) => {
    router.push(`/glow-up-protocol?tab=${subtab}`);
  };

  const userName = intake && intake.firstName 
    ? intake.firstName.charAt(0).toUpperCase() + intake.firstName.slice(1).toLowerCase()
    : "You";

  // Use fallback data if no analysis exists (for unrestricted access)
  const analysisId = analysis?.id || "demo-analysis";
  const frontPhotoUrl = analysis?.frontPicture || "/remi-turcotte-oq-6-dp-54-awvw-unsplash-14.png";
  const morphUrl = analysis?.morphUrl || null;
  
  // Get aesthetics score from recommendations (dynamic) or fallback to Claude analysis
  let aestheticsScore = 72; // Default score
  
  // First try to get dynamic score from recommendations
  if (recommendationsData?.aestheticsScore) {
    aestheticsScore = recommendationsData.aestheticsScore;
  } else {
    // Fallback to Claude analysis scores
    const scoresData = analysisWithContent?.structure
      ?.find(s => s.additionalFeatures?.text?.includes('overallAestheticsScore'))
      ?.additionalFeatures?.text;
    
    if (scoresData) {
      try {
        const scores = JSON.parse(scoresData);
        aestheticsScore = scores.overallAestheticsScore 
          ? Math.round(scores.overallAestheticsScore) 
          : 72;
      } catch (e) {
        console.error('Failed to parse scores:', e);
      }
    }
  }

  return (
    <GlowUpProtocolView
      analysisId={analysisId}
      frontPhotoUrl={frontPhotoUrl}
      morphUrl={morphs?.overall || morphUrl}
      morphs={morphs}
      aestheticsScore={aestheticsScore}
      recommendations={recommendationsData}
      activeSubtab={activeSubtab}
      onSubtabChange={handleSubtabChange}
      userName={userName}
    />
  );
}

export default function GlowUpProtocolClient() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
            <p className="text-gray-500">Loading...</p>
          </div>
        </div>
      }
    >
      <GlowUpProtocolPageWithSearchParams />
    </Suspense>
  );
}
