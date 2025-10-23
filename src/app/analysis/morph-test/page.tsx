"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "~/trpc/react";
import { ScanFace, Download, RefreshCw } from "lucide-react";
import BeforeAfterSlider from "~/components/ui/before-after-slider";

export default function MorphTestPage() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState<"subtle" | "moderate" | "enhanced">("enhanced");
  const [nanoBananaResult, setNanoBananaResult] = useState<string | null>(null);
  const [qwenResult, setQwenResult] = useState<string | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Query for analysis data
  const { data: analysis, isLoading: isAnalysisLoading } =
    api.analysis.getFirstAnalysis.useQuery();

  const { data: completionData, isLoading: isLoadingCompletion } =
    api.analysis.checkAnalysisCompletion.useQuery(
      { analysisId: analysis?.id ?? "" },
      { enabled: !!analysis?.id },
    );

  // Mutations
  const generateNanoBanana = api.morph.generateMorph.useMutation();
  const generateQwen = api.morph.generateQwenMorph.useMutation();

  useEffect(() => {
    if (isAnalysisLoading) return;
    if (!analysis) {
      router.push("/create-analysis");
      return;
    }
  }, [analysis, isAnalysisLoading, router]);

  const handleGenerateNanoBanana = async () => {
    if (!analysis?.id) return;
    
    try {
      const result = await generateNanoBanana.mutateAsync({
        analysisId: analysis.id,
      });
      setNanoBananaResult(result.morphUrl);
    } catch (error) {
      console.error("Failed to generate nano-banana morph:", error);
    }
  };

  const handleGenerateQwen = async () => {
    if (!analysis?.id) return;
    
    try {
      const result = await generateQwen.mutateAsync({
        analysisId: analysis.id,
        level: selectedLevel,
      });
      setQwenResult(result.morphUrl);
    } catch (error) {
      console.error("Failed to generate Qwen morph:", error);
    }
  };

  if (isLoadingCompletion || isAnalysisLoading || !isMounted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  if (!completionData || !analysis) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-500">Unable to load analysis data</p>
        </div>
      </div>
    );
  }

  const isAnalysisComplete = completionData.status === "complete";

  return (
    <div className="bg-background-muted min-h-screen">
      <div className="mx-auto mt-6 max-w-7xl p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-6 rounded-lg border border-purple-200 bg-purple-50 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Model Comparison Test</h1>
              <p className="mt-1 text-sm text-purple-700">
                Compare nano-banana vs Qwen side-by-side
              </p>
            </div>
            <ScanFace className="h-8 w-8 text-purple-600" />
          </div>
        </div>

        {!isAnalysisComplete ? (
          <div className="rounded-lg bg-white p-6">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-200">
                <ScanFace className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="mb-2 text-lg font-medium text-gray-700">
                Analysis in Progress
              </h3>
              <p className="text-sm text-gray-500">
                Your facial analysis is being processed. Come back once it's complete.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Controls */}
            <div className="rounded-lg bg-white p-6">
              <h2 className="mb-4 text-xl font-semibold text-gray-800">Generate Morphs</h2>
              
              {/* Enhancement Level Selector */}
              <div className="mb-6">
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Enhancement Level (for Qwen)
                </label>
                <div className="flex gap-4">
                  {(["subtle", "moderate", "enhanced"] as const).map((level) => (
                    <button
                      key={level}
                      onClick={() => setSelectedLevel(level)}
                      className={`px-4 py-2 rounded-lg border-2 transition-all ${
                        selectedLevel === level
                          ? "border-purple-600 bg-purple-50 text-purple-700"
                          : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
                      }`}
                    >
                      {level.charAt(0).toUpperCase() + level.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Generate Buttons */}
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={handleGenerateNanoBanana}
                  disabled={generateNanoBanana.isPending}
                  className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {generateNanoBanana.isPending ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      Generating Nano-Banana...
                    </>
                  ) : (
                    <>
                      <ScanFace className="h-4 w-4" />
                      Generate Nano-Banana
                    </>
                  )}
                </button>

                <button
                  onClick={handleGenerateQwen}
                  disabled={generateQwen.isPending}
                  className="flex items-center gap-2 rounded-lg bg-purple-600 px-6 py-3 text-white hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {generateQwen.isPending ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      Generating Qwen...
                    </>
                  ) : (
                    <>
                      <ScanFace className="h-4 w-4" />
                      Generate Qwen ({selectedLevel})
                    </>
                  )}
                </button>
              </div>

              {/* Status Messages */}
              {(generateNanoBanana.isPending || generateQwen.isPending) && (
                <p className="mt-4 text-sm text-gray-600 animate-pulse">
                  Please wait 30-60 seconds while the AI processes your image...
                </p>
              )}
            </div>

            {/* Results Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Nano-Banana Result */}
              <div className="rounded-lg bg-white p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">Nano-Banana Result</h3>
                  {nanoBananaResult && (
                    <button
                      onClick={() => window.open(nanoBananaResult, '_blank')}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      <Download className="h-4 w-4" />
                    </button>
                  )}
                </div>
                
                {nanoBananaResult ? (
                  <BeforeAfterSlider
                    beforeImage={analysis.frontPicture}
                    afterImage={nanoBananaResult}
                    reverse
                    initialPosition={33}
                    beforeAlt="Original"
                    afterAlt="Nano-Banana Enhanced"
                    className="aspect-square"
                  />
                ) : (
                  <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                    <p className="text-gray-400">Generate to see result</p>
                  </div>
                )}
              </div>

              {/* Qwen Result */}
              <div className="rounded-lg bg-white p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">Qwen Result</h3>
                  {qwenResult && (
                    <button
                      onClick={() => window.open(qwenResult, '_blank')}
                      className="text-purple-600 hover:text-purple-700"
                    >
                      <Download className="h-4 w-4" />
                    </button>
                  )}
                </div>
                
                {qwenResult ? (
                  <BeforeAfterSlider
                    beforeImage={analysis.frontPicture}
                    afterImage={qwenResult}
                    reverse
                    initialPosition={33}
                    beforeAlt="Original"
                    afterAlt="Qwen Enhanced"
                    className="aspect-square"
                  />
                ) : (
                  <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                    <p className="text-gray-400">Generate to see result</p>
                  </div>
                )}
              </div>
            </div>

            {/* Comparison Notes */}
            {(nanoBananaResult || qwenResult) && (
              <div className="rounded-lg bg-white p-6">
                <h3 className="mb-4 text-lg font-semibold text-gray-800">Comparison Notes</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>
                    <strong>Nano-Banana:</strong> Fast, reliable, but may flip images. Uses Replicate API.
                  </p>
                  <p>
                    <strong>Qwen:</strong> More control over enhancements, better prompt understanding. Uses Hugging Face Inference API.
                  </p>
                  <p className="mt-4 text-xs text-gray-500">
                    Note: First Qwen request may take longer as the model warms up (30-60 seconds).
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}




