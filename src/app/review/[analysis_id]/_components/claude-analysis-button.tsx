"use client";

import { useState } from "react";
import { Button } from "~/components/ui/button";
import { api } from "~/trpc/react";

interface ClaudeAnalysisButtonProps {
  analysisId: string;
  onSuccess?: () => void;
}

export function ClaudeAnalysisButton({
  analysisId,
  onSuccess,
}: ClaudeAnalysisButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState<string>("");

  const generateAnalysisMutation = api.review.generateClaudeAnalysis.useMutation({
    onSuccess: (result) => {
      console.log("✅ Claude analysis generated:", result);
      setCurrentStep("Analysis complete! Now generating morphs...");
    },
    onError: (error) => {
      console.error("❌ Error generating Claude analysis:", error);
      alert(`Error generating analysis: ${error.message}`);
      setIsLoading(false);
    },
  });

  const generateAllMorphsMutation = api.morph.generateAllGlowUpMorphsAdmin.useMutation({
    onSuccess: (result) => {
      console.log("✅ All morphs generated:", result);
      alert(`Success! Generated analysis and ${Object.keys(result.morphs).length} morphs using Claude 4.5 and Qwen Image Edit`);
      if (onSuccess) {
        onSuccess();
      }
      setIsLoading(false);
      setCurrentStep("");
    },
    onError: (error) => {
      console.error("❌ Error generating morphs:", error);
      alert(`Analysis complete but morph generation failed: ${error.message}`);
      setIsLoading(false);
      setCurrentStep("");
    },
  });

  const handleGenerateAnalysisAndMorphs = async () => {
    const confirmed = confirm(
      "This will analyze the user's images using Claude 4.5 and generate morphs using Qwen Image Edit Plus via Replicate.\n\n" +
      "• Time: 2-5 minutes total\n" +
      "• Cost: ~$0.10-0.20 per analysis + morphs\n" +
      "• Result: Complete analysis + 5 different morphs (overall, eyes, skin, jawline, hair)\n" +
      "• Analysis will be automatically marked as complete when done\n\n" +
      "Continue?"
    );
    
    if (!confirmed) return;

    setIsLoading(true);
    setCurrentStep("Generating Claude analysis...");
    
    try {
      // First generate the analysis
      await generateAnalysisMutation.mutateAsync({ analysisId });
      
      // Then generate all morphs
      setCurrentStep("Analysis complete! Now generating morphs...");
      await generateAllMorphsMutation.mutateAsync({ analysisId });
      
    } catch (error) {
      console.error("Error in generation pipeline:", error);
      setIsLoading(false);
      setCurrentStep("");
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <Button
        onClick={handleGenerateAnalysisAndMorphs}
        disabled={isLoading}
        variant="default"
        size="sm"
        className="bg-purple-600 text-white hover:bg-purple-700"
      >
        {isLoading ? "🤖 Generating Analysis & Morphs..." : "🤖 Generate Analysis & Morphs"}
      </Button>
      {currentStep && (
        <p className="text-xs text-gray-500 text-center">{currentStep}</p>
      )}
    </div>
  );
}

