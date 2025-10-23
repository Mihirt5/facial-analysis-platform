"use client";

import { useEffect, useState } from 'react';
import { api } from '~/trpc/react';

interface AnalysisProcessingStatusProps {
  analysisId: string;
  onProcessingComplete?: () => void;
}

export function AnalysisProcessingStatus({ 
  analysisId, 
  onProcessingComplete 
}: AnalysisProcessingStatusProps) {
  const [isProcessing, setIsProcessing] = useState(true);
  const [processingStep, setProcessingStep] = useState('Initializing...');

  const { data: completionData, refetch } = api.analysis.checkAnalysisCompletion.useQuery(
    { analysisId },
    { 
      refetchInterval: 2000, // Check every 2 seconds
      enabled: isProcessing 
    }
  );

  useEffect(() => {
    if (completionData) {
      const isComplete = completionData.status === 'complete';
      
      if (isComplete) {
        setProcessingStep('Analysis complete!');
        setIsProcessing(false);
        onProcessingComplete?.();
      } else if (completionData.status === 'in_progress') {
        setProcessingStep('Processing facial landmarks...');
      } else if (completionData.status === 'ready') {
        setProcessingStep('Finalizing analysis...');
      }
    }
  }, [completionData, onProcessingComplete]);

  if (!isProcessing) {
    return null;
  }

  return (
    <div className="flex flex-col items-center justify-center space-y-4 p-8">
      <div className="relative">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-gray-200 border-t-gray-900"></div>
      </div>
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900">
          Processing Your Analysis
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          {processingStep}
        </p>
        <p className="text-xs text-gray-500 mt-2">
          This may take a few moments...
        </p>
      </div>
    </div>
  );
}