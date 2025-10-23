"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { ANALYSIS_STRUCTURE } from "~/lib/analysis-structure";
import { api } from "~/trpc/react";
import { AnalysisView } from "./analysis-view";
import { AnalysisMobileView } from "./analysis-mobile-view";
import { useIsMobile } from "~/hooks/use-mobile";
import { useSession } from "~/lib/auth-client";

// Component that uses useSearchParams - wrapped in Suspense
function AnalysisPageWithSearchParams() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isMobile = useIsMobile();
  const [redirecting, setRedirecting] = useState(false);
  const { data: session, isPending: isSessionLoading } = useSession();

  // Get active tab from URL params or default to first tab
  const tabFromUrl = searchParams.get("tab");
  const [activeSubtab, setActiveSubtab] = useState(
    tabFromUrl ?? ANALYSIS_STRUCTURE[0]?.key,
  );

  // Update active subtab when URL changes
  useEffect(() => {
    const newTab = searchParams.get("tab");
    if (newTab && newTab !== activeSubtab) {
      setActiveSubtab(newTab);
    }
  }, [searchParams, activeSubtab]);

  // Query for analysis and intake data
  const { data: analysis, isLoading: isAnalysisLoading } =
    api.analysis.getFirstAnalysis.useQuery(undefined, {
      enabled: !isSessionLoading && !!session?.user,
      retry: false,
    });
  const { data: intake, isLoading: isIntakeLoading } =
    api.intake.getMine.useQuery(undefined, {
      enabled: !isSessionLoading && !!session?.user,
      retry: false,
    });
  
  // Query for morphs to check if they're processed
  const { data: morphs, isLoading: isMorphsLoading } = 
    api.morph.getGlowUpMorphs.useQuery(
      { analysisId: analysis?.id ?? "" },
      { enabled: !!analysis?.id && !!session?.user, retry: false }
    );

  // Navigate after render to avoid React production hook errors
  useEffect(() => {
    if (isAnalysisLoading || isIntakeLoading) return;
    if (!analysis) {
      setRedirecting(true);
      router.replace("/create-analysis");
      return;
    }
    if (!intake) {
      setRedirecting(true);
      router.replace("/intake");
    }
  }, [analysis, intake, isAnalysisLoading, isIntakeLoading, router]);

  // Handle subtab changes by updating URL
  const handleSubtabChange = (subtab: string) => {
    router.push(`/analysis?tab=${subtab}`);
  };

  // All hooks are now called unconditionally above
  // Now handle conditional rendering logic

  // Show loading state while checking data
  if (isSessionLoading || isAnalysisLoading || isIntakeLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  if (redirecting) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
          <p className="text-gray-500">Redirecting...</p>
        </div>
      </div>
    );
  }

  // Show mobile view on mobile devices
  if (isMobile) {
    if (!analysis) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
            <p className="text-gray-500">Loading analysis...</p>
          </div>
        </div>
      );
    }
    return <AnalysisMobileView analysisId={analysis.id} />;
  }

  if (!analysis) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
          <p className="text-gray-500">Loading analysis...</p>
        </div>
      </div>
    );
  }

  return (
    <AnalysisView
      analysisId={analysis.id}
      activeSubtab={activeSubtab}
      onSubtabChange={handleSubtabChange}
    />
  );
}

export default function AnalysisClient() {
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
      <AnalysisPageWithSearchParams />
    </Suspense>
  );
}
