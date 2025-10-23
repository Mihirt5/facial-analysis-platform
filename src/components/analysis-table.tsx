"use client";

import { useState } from "react";
import { Button } from "~/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { CopyEmailButton } from "~/components/ui/copy-email-button";
import { useRouter } from "next/navigation";
import type { Analysis } from "~/types/types";
import { IntakeButton } from "./ui/intake-button";
import { api } from "~/trpc/react";
import { Checkbox } from "~/components/ui/checkbox";
import { Check, Play, Sparkles, Trash2, Brain, FileText, Wand2, Target, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

interface AnalysisTableProps {
  analyses: Analysis[];
}

export function AnalysisTable({ analyses }: AnalysisTableProps) {
  const router = useRouter();
  const [selectedAnalyses, setSelectedAnalyses] = useState<Set<string>>(new Set());
  const [isBulkProcessing, setIsBulkProcessing] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [shouldCancel, setShouldCancel] = useState(false);
  const [processingJobs, setProcessingJobs] = useState<Array<{id: string, type: 'analysis' | 'morphs' | 'full' | 'recommendations' | 'text-analysis' | 'morphs-recommendations', startTime: Date}>>([]);
  const [bulkResults, setBulkResults] = useState<{
    completed: string[];
    failed: Array<{id: string, error: string}>;
    cancelled: string[];
  }>({ completed: [], failed: [], cancelled: [] });

  const markComplete = api.review.markAnalysisComplete.useMutation({
    onSuccess: () => router.refresh(),
  });

  // Helper function to retry TRPC mutations on network errors
  const retryMutation = async <T,>(
    mutationFn: (input: T) => Promise<any>,
    input: T,
    maxRetries: number = 3,
    baseDelay: number = 1000
  ): Promise<any> => {
    let lastError: Error | null = null;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`🔄 Attempting mutation (attempt ${attempt}/${maxRetries})`);
        return await mutationFn(input);
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        console.error(`❌ Attempt ${attempt} failed:`, lastError.message);
        
        // Check if this is a retryable network error
        const isRetryableError = 
          lastError.message.includes('network error') ||
          lastError.message.includes('ERR_HTTP2_PING_FAILED') ||
          lastError.message.includes('fetch') ||
          lastError.message.includes('timeout') ||
          lastError.message.includes('ECONNRESET') ||
          lastError.message.includes('ENOTFOUND');
        
        if (!isRetryableError || attempt === maxRetries) {
          throw lastError;
        }
        
        // Wait before retrying with exponential backoff
        const delay = baseDelay * Math.pow(2, attempt - 1);
        console.log(`⏳ Waiting ${delay}ms before retry...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    
    throw lastError || new Error('All retry attempts failed');
  };

  const generateAnalysisOnly = api.review.generateClaudeAnalysis.useMutation({
    onSuccess: () => {
      console.log("✅ Analysis generated");
      router.refresh();
    },
    onError: (error) => {
      console.error("❌ Error generating analysis:", error);
    },
  });

  const generateAnalysisAndMorphs = api.review.generateClaudeAnalysis.useMutation({
    onSuccess: () => {
      console.log("✅ Analysis generated");
    },
    onError: (error) => {
      console.error("❌ Error generating analysis:", error);
    },
  });

  const generateAllMorphs = api.morphV2.generateMorphsAdmin.useMutation({
    onSuccess: (data) => {
      console.log("✅ Morphs generated - Server response:", data);
    },
    onError: (error) => {
      console.error("❌ Error generating morphs:", error);
    },
  });

  const generateRecommendationsOnly = api.morphV2.generateRecommendationsOnly.useMutation({
    onSuccess: (data) => {
      console.log("✅ Recommendations generated:", data);
    },
    onError: (error) => {
      console.error("❌ Error generating recommendations:", error);
    },
  });

  const generateMorphsOnly = api.morphV2.generateMorphsAdmin.useMutation({
    onSuccess: (data) => {
      console.log("✅ Morphs generated:", data);
    },
    onError: (error) => {
      console.error("❌ Error generating morphs:", error);
    },
  });

  const formatAnalysisId = (id: string) => {
    const lastUnderscoreIndex = id.lastIndexOf("_");
    if (lastUnderscoreIndex === -1) {
      return id.substring(0, 5);
    }
    const lastPart = id.substring(lastUnderscoreIndex + 1);
    return lastPart.substring(0, 7);
  };

  const handleSelectAnalysis = (analysisId: string, checked: boolean) => {
    const newSelected = new Set(selectedAnalyses);
    if (checked) {
      newSelected.add(analysisId);
    } else {
      newSelected.delete(analysisId);
    }
    setSelectedAnalyses(newSelected);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedAnalyses(new Set(analyses.map(a => a.id)));
    } else {
      setSelectedAnalyses(new Set());
    }
  };

  const handleBulkAnalysisOnly = async () => {
    if (selectedAnalyses.size === 0) return;
    
    const confirmed = confirm(
      `This will generate analysis for ${selectedAnalyses.size} analyses (without morphs).\n\n` +
      `• Time: 1-3 minutes per analysis\n` +
      `• Cost: ~$0.05-0.10 per analysis\n` +
      `• Result: Complete analysis (no morphs)\n\n` +
      `Continue?`
    );
    
    if (!confirmed) return;

    setIsBulkProcessing(true);
    setIsPaused(false);
    setShouldCancel(false);
    setBulkResults({ completed: [], failed: [], cancelled: [] });
    
    const analysisIds = Array.from(selectedAnalyses);
    let completed = 0;
    let failed = 0;
    let cancelled = 0;
    
    try {
      for (let i = 0; i < analysisIds.length; i++) {
        const analysisId = analysisIds[i];
        
        if (!analysisId) continue; // Skip if analysisId is undefined
        
        // Check for cancellation
        if (shouldCancel) {
          console.log(`🛑 Cancelling bulk operation at analysis ${i + 1}/${analysisIds.length}`);
          setBulkResults(prev => ({ ...prev, cancelled: analysisIds.slice(i) }));
          cancelled = analysisIds.length - i;
          break;
        }
        
        // Handle pause
        while (isPaused && !shouldCancel) {
          console.log(`⏸️ Operation paused at analysis ${i + 1}/${analysisIds.length}`);
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
        
        if (shouldCancel) {
          setBulkResults(prev => ({ ...prev, cancelled: analysisIds.slice(i) }));
          cancelled = analysisIds.length - i;
          break;
        }
        
        // Add to processing jobs
        setProcessingJobs(prev => [...prev, { id: analysisId, type: 'analysis', startTime: new Date() }]);
        
        try {
          console.log(`Generating analysis for ${analysisId}... (${i + 1}/${analysisIds.length})`);
          await retryMutation(
            (input) => generateAnalysisOnly.mutateAsync(input),
            { analysisId },
            3, // 3 retries
            2000 // 2 second base delay
          );
          console.log(`✅ Completed analysis ${analysisId}`);
          
          setBulkResults(prev => ({ ...prev, completed: [...prev.completed, analysisId] }));
          completed++;
          
        } catch (error) {
          console.error(`❌ Failed analysis ${analysisId}:`, error);
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          setBulkResults(prev => ({ 
            ...prev, 
            failed: [...prev.failed, { id: analysisId, error: errorMessage }] 
          }));
          failed++;
        } finally {
          // Remove from processing jobs
          setProcessingJobs(prev => prev.filter(job => job.id !== analysisId));
        }
      }
      
      // Show summary
      const summary = `Bulk Analysis Complete!\n\n` +
        `✅ Completed: ${completed}\n` +
        `❌ Failed: ${failed}\n` +
        `🛑 Cancelled: ${cancelled}\n\n` +
        `${failed > 0 ? 'Check console for error details.' : 'All analyses completed successfully!'}`;
      
      alert(summary);
      
      if (completed > 0) {
        setSelectedAnalyses(new Set());
        router.refresh();
      }
      
    } catch (error) {
      console.error("Bulk analysis generation error:", error);
      alert("Bulk operation failed. Check console for details.");
    } finally {
      setIsBulkProcessing(false);
      setIsPaused(false);
      setShouldCancel(false);
    }
  };

  const handleBulkMorphsOnly = async () => {
    if (selectedAnalyses.size === 0) return;
    
    const confirmed = confirm(
      `This will generate morphs for ${selectedAnalyses.size} analyses using GPT-5 Image.\n\n` +
      `• Time: 1-2 minutes per analysis\n` +
      `• Cost: ~$0.05-0.10 per analysis (morphs only)\n` +
      `• Result: 4 morphs per analysis (overall, eyes, skin, jawline)\n` +
      `• Note: Analysis must be completed first\n\n` +
      `Continue?`
    );
    
    if (!confirmed) return;

    setIsBulkProcessing(true);
    setIsPaused(false);
    setShouldCancel(false);
    setBulkResults({ completed: [], failed: [], cancelled: [] });
    
    const analysisIds = Array.from(selectedAnalyses);
    let completed = 0;
    let failed = 0;
    let cancelled = 0;
    
    try {
      for (let i = 0; i < analysisIds.length; i++) {
        const analysisId = analysisIds[i];
        
        if (!analysisId) continue; // Skip if analysisId is undefined
        
        // Check for cancellation
        if (shouldCancel) {
          console.log(`🛑 Cancelling bulk operation at analysis ${i + 1}/${analysisIds.length}`);
          setBulkResults(prev => ({ ...prev, cancelled: analysisIds.slice(i) }));
          cancelled = analysisIds.length - i;
          break;
        }
        
        // Handle pause
        while (isPaused && !shouldCancel) {
          console.log(`⏸️ Operation paused at analysis ${i + 1}/${analysisIds.length}`);
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
        
        if (shouldCancel) {
          setBulkResults(prev => ({ ...prev, cancelled: analysisIds.slice(i) }));
          cancelled = analysisIds.length - i;
          break;
        }
        
        // Add to processing jobs
        setProcessingJobs(prev => [...prev, { id: analysisId, type: 'morphs', startTime: new Date() }]);
        
        try {
          console.log(`Generating morphs for analysis ${analysisId}... (${i + 1}/${analysisIds.length})`);
          await retryMutation(
            (input) => generateAllMorphs.mutateAsync(input),
            { analysisId },
            3, // 3 retries
            2000 // 2 second base delay
          );
          console.log(`✅ Completed morphs ${analysisId}`);
          
          setBulkResults(prev => ({ ...prev, completed: [...prev.completed, analysisId] }));
          completed++;
          
        } catch (error) {
          console.error(`❌ Failed morphs ${analysisId}:`, error);
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          setBulkResults(prev => ({ 
            ...prev, 
            failed: [...prev.failed, { id: analysisId, error: errorMessage }] 
          }));
          failed++;
        } finally {
          // Remove from processing jobs
          setProcessingJobs(prev => prev.filter(job => job.id !== analysisId));
        }
      }
      
      // Show summary
      const summary = `Bulk Morphs Generation Complete!\n\n` +
        `✅ Completed: ${completed}\n` +
        `❌ Failed: ${failed}\n` +
        `🛑 Cancelled: ${cancelled}\n\n` +
        `${failed > 0 ? 'Check console for error details.' : 'All morphs completed successfully!'}`;
      
      alert(summary);
      
      if (completed > 0) {
        setSelectedAnalyses(new Set());
        router.refresh();
      }
      
    } catch (error) {
      console.error("Bulk morphs generation error:", error);
      alert("Bulk operation failed. Check console for details.");
    } finally {
      setIsBulkProcessing(false);
      setIsPaused(false);
      setShouldCancel(false);
    }
  };

  const handleBulkRecommendationsOnly = async () => {
    if (selectedAnalyses.size === 0) return;
    
    const confirmed = confirm(
      `This will generate personalized recommendations for ${selectedAnalyses.size} analyses using Qwen vision model.\n\n` +
      `• Time: 30-60 seconds per analysis\n` +
      `• Cost: ~$0.01-0.03 per analysis\n` +
      `• Result: Aesthetics score + personalized recommendations\n` +
      `• Photos needed: Front, hairline, and side profile\n\n` +
      `Continue?`
    );
    
    if (!confirmed) return;

    setIsBulkProcessing(true);
    setIsPaused(false);
    setShouldCancel(false);
    setBulkResults({ completed: [], failed: [], cancelled: [] });
    
    const analysisIds = Array.from(selectedAnalyses);
    let completed = 0;
    let failed = 0;
    let cancelled = 0;
    
    try {
      for (let i = 0; i < analysisIds.length; i++) {
        const analysisId = analysisIds[i];
        
        if (!analysisId) continue; // Skip if analysisId is undefined
        
        // Check for cancellation
        if (shouldCancel) {
          console.log(`🛑 Cancelling bulk operation at analysis ${i + 1}/${analysisIds.length}`);
          setBulkResults(prev => ({ ...prev, cancelled: analysisIds.slice(i) }));
          cancelled = analysisIds.length - i;
          break;
        }
        
        // Handle pause
        while (isPaused && !shouldCancel) {
          console.log(`⏸️ Operation paused at analysis ${i + 1}/${analysisIds.length}`);
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
        
        if (shouldCancel) {
          setBulkResults(prev => ({ ...prev, cancelled: analysisIds.slice(i) }));
          cancelled = analysisIds.length - i;
          break;
        }
        
        // Add to processing jobs
        setProcessingJobs(prev => [...prev, { id: analysisId, type: 'analysis', startTime: new Date() }]);
        
        try {
          console.log(`Generating recommendations for analysis ${analysisId}... (${i + 1}/${analysisIds.length})`);
          await retryMutation(
            (input) => generateRecommendationsOnly.mutateAsync(input),
            { analysisId },
            3, // 3 retries
            2000 // 2 second base delay
          );
          console.log(`✅ Completed recommendations ${analysisId}`);
          
          setBulkResults(prev => ({ ...prev, completed: [...prev.completed, analysisId] }));
          completed++;
          
        } catch (error) {
          console.error(`❌ Failed recommendations ${analysisId}:`, error);
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          setBulkResults(prev => ({ 
            ...prev, 
            failed: [...prev.failed, { id: analysisId, error: errorMessage }] 
          }));
          failed++;
        } finally {
          // Remove from processing jobs
          setProcessingJobs(prev => prev.filter(job => job.id !== analysisId));
        }
      }
      
      // Show summary
      const summary = `Bulk Recommendations Generation Complete!\n\n` +
        `✅ Completed: ${completed}\n` +
        `❌ Failed: ${failed}\n` +
        `🛑 Cancelled: ${cancelled}\n\n` +
        `${failed > 0 ? 'Check console for error details.' : 'All recommendations completed successfully!'}`;
      
      alert(summary);
      
      if (completed > 0) {
        setSelectedAnalyses(new Set());
        router.refresh();
      }
      
    } catch (error) {
      console.error("Bulk recommendations generation error:", error);
      alert("Bulk operation failed. Check console for details.");
    } finally {
      setIsBulkProcessing(false);
      setIsPaused(false);
      setShouldCancel(false);
    }
  };

  const handleBulkProcess = async () => {
    if (selectedAnalyses.size === 0) return;
    
    const confirmed = confirm(
      `This will process ${selectedAnalyses.size} analyses with Claude 4.5 and generate morphs with GPT-5 Image.\n\n` +
      `• Time: 2-5 minutes per analysis\n` +
      `• Cost: ~$0.10-0.20 per analysis + morphs\n` +
      `• Result: Complete analysis + 4 morphs per analysis\n\n` +
      `Continue?`
    );
    
    if (!confirmed) return;

    setIsBulkProcessing(true);
    setIsPaused(false);
    setShouldCancel(false);
    setBulkResults({ completed: [], failed: [], cancelled: [] });
    
    const analysisIds = Array.from(selectedAnalyses);
    let completed = 0;
    let failed = 0;
    let cancelled = 0;
    
    try {
      for (let i = 0; i < analysisIds.length; i++) {
        const analysisId = analysisIds[i];
        
        if (!analysisId) continue; // Skip if analysisId is undefined
        
        // Check for cancellation
        if (shouldCancel) {
          console.log(`🛑 Cancelling bulk operation at analysis ${i + 1}/${analysisIds.length}`);
          setBulkResults(prev => ({ ...prev, cancelled: analysisIds.slice(i) }));
          cancelled = analysisIds.length - i;
          break;
        }
        
        // Handle pause
        while (isPaused && !shouldCancel) {
          console.log(`⏸️ Operation paused at analysis ${i + 1}/${analysisIds.length}`);
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
        
        if (shouldCancel) {
          setBulkResults(prev => ({ ...prev, cancelled: analysisIds.slice(i) }));
          cancelled = analysisIds.length - i;
          break;
        }
        
        // Add to processing jobs
        setProcessingJobs(prev => [...prev, { id: analysisId, type: 'full', startTime: new Date() }]);
        
        try {
          console.log(`Processing analysis ${analysisId}... (${i + 1}/${analysisIds.length})`);
          
          // Generate analysis first with retry
          await retryMutation(
            (input) => generateAnalysisAndMorphs.mutateAsync(input),
            { analysisId },
            3, // 3 retries
            2000 // 2 second base delay
          );
          
          // Update job type to morphs
          setProcessingJobs(prev => prev.map(job => 
            job.id === analysisId ? { ...job, type: 'morphs' as const } : job
          ));
          
          // Then generate morphs with retry
          await retryMutation(
            (input) => generateAllMorphs.mutateAsync(input),
            { analysisId },
            3, // 3 retries
            2000 // 2 second base delay
          );
          
          console.log(`✅ Completed analysis ${analysisId}`);
          
          setBulkResults(prev => ({ ...prev, completed: [...prev.completed, analysisId] }));
          completed++;
          
        } catch (error) {
          console.error(`❌ Failed analysis ${analysisId}:`, error);
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          setBulkResults(prev => ({ 
            ...prev, 
            failed: [...prev.failed, { id: analysisId, error: errorMessage }] 
          }));
          failed++;
        } finally {
          // Remove from processing jobs
          setProcessingJobs(prev => prev.filter(job => job.id !== analysisId));
        }
      }
      
      // Show summary
      const summary = `Bulk Processing Complete!\n\n` +
        `✅ Completed: ${completed}\n` +
        `❌ Failed: ${failed}\n` +
        `🛑 Cancelled: ${cancelled}\n\n` +
        `${failed > 0 ? 'Check console for error details.' : 'All analyses completed successfully!'}`;
      
      alert(summary);
      
      if (completed > 0) {
        setSelectedAnalyses(new Set());
        router.refresh();
      }
      
    } catch (error) {
      console.error("Bulk processing error:", error);
      alert("Bulk operation failed. Check console for details.");
    } finally {
      setIsBulkProcessing(false);
      setIsPaused(false);
      setShouldCancel(false);
    }
  };

  const deleteOne = api.review.deleteAnalysis.useMutation({
    onSuccess: () => router.refresh(),
  });

  const deleteMany = api.review.deleteAnalyses.useMutation({
    onSuccess: () => router.refresh(),
  });

  const handleDeleteOne = async (analysisId: string) => {
    const confirmed = confirm(
      "Delete this analysis content? This will remove the analysis results, morphs, and recommendations, but preserve the user's photos. The analysis can be regenerated."
    );
    if (!confirmed) return;
    await deleteOne.mutateAsync({ analysisId });
  };

  const handleBulkDelete = async () => {
    if (selectedAnalyses.size === 0) return;
    const confirmed = confirm(
      `Delete analysis content for ${selectedAnalyses.size} selected analyses? This will remove the analysis results, morphs, and recommendations, but preserve the user's photos. The analyses can be regenerated.`
    );
    if (!confirmed) return;
    await deleteMany.mutateAsync({ analysisIds: Array.from(selectedAnalyses) });
    setSelectedAnalyses(new Set());
  };

  // New handler for text analysis only
  const handleBulkTextAnalysisOnly = async () => {
    if (selectedAnalyses.size === 0) return;
    
    const confirmed = confirm(
      `This will generate text analysis for ${selectedAnalyses.size} analyses (Claude analysis only, no morphs or recommendations).\n\n` +
      `• Time: 1-3 minutes per analysis\n` +
      `• Cost: ~$0.01-0.03 per analysis\n` +
      `• Result: Detailed text analysis of facial features\n` +
      `• Note: This is the same as "Analysis Only" but with clearer naming\n\n` +
      `Continue?`
    );
    
    if (!confirmed) return;

    setIsBulkProcessing(true);
    setIsPaused(false);
    setShouldCancel(false);
    setBulkResults({ completed: [], failed: [], cancelled: [] });
    
    const analysisIds = Array.from(selectedAnalyses);
    let completed = 0;
    let failed = 0;
    let cancelled = 0;
    
    try {
      for (let i = 0; i < analysisIds.length; i++) {
        const analysisId = analysisIds[i];
        
        if (!analysisId) continue;
        
        // Check for cancellation
        if (shouldCancel) {
          console.log(`🛑 Cancelling bulk operation at analysis ${i + 1}/${analysisIds.length}`);
          setBulkResults(prev => ({ ...prev, cancelled: analysisIds.slice(i) }));
          cancelled = analysisIds.length - i;
          break;
        }
        
        // Handle pause
        while (isPaused && !shouldCancel) {
          console.log(`⏸️ Operation paused at analysis ${i + 1}/${analysisIds.length}`);
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
        
        if (shouldCancel) {
          cancelled = analysisIds.length - i;
          break;
        }
        
        // Add to processing jobs
        setProcessingJobs(prev => [...prev, { id: analysisId, type: 'text-analysis', startTime: new Date() }]);
        
        try {
          console.log(`Generating text analysis for ${analysisId}... (${i + 1}/${analysisIds.length})`);
          await retryMutation(
            (input) => generateAnalysisOnly.mutateAsync(input),
            { analysisId },
            3, // 3 retries
            2000 // 2 second base delay
          );
          console.log(`✅ Completed text analysis ${analysisId}`);
          
          setBulkResults(prev => ({ ...prev, completed: [...prev.completed, analysisId] }));
          completed++;
          
        } catch (error) {
          console.error(`❌ Failed text analysis ${analysisId}:`, error);
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          setBulkResults(prev => ({ 
            ...prev, 
            failed: [...prev.failed, { id: analysisId, error: errorMessage }] 
          }));
          failed++;
        } finally {
          // Remove from processing jobs
          setProcessingJobs(prev => prev.filter(job => job.id !== analysisId));
        }
      }
      
      // Show summary
      const summary = `Bulk Text Analysis Complete!\n\n` +
        `✅ Completed: ${completed}\n` +
        `❌ Failed: ${failed}\n` +
        `🛑 Cancelled: ${cancelled}\n\n` +
        `${failed > 0 ? 'Check console for error details.' : 'All text analyses completed successfully!'}`;
      
      alert(summary);
      
      if (completed > 0) {
        setSelectedAnalyses(new Set());
        router.refresh();
      }
      
    } catch (error) {
      console.error("Bulk text analysis generation error:", error);
      alert("Bulk operation failed. Check console for details.");
    } finally {
      setIsBulkProcessing(false);
      setIsPaused(false);
      setShouldCancel(false);
    }
  };

  // New handler for morphs + recommendations together
  const handleBulkMorphsAndRecommendations = async () => {
    if (selectedAnalyses.size === 0) return;
    
    const confirmed = confirm(
      `This will generate morphs AND recommendations for ${selectedAnalyses.size} analyses.\n\n` +
      `• Time: 2-3 minutes per analysis\n` +
      `• Cost: ~$0.06-0.12 per analysis\n` +
      `• Result: 4 morphs + personalized recommendations per analysis\n` +
      `• Note: Analysis must be completed first\n\n` +
      `Continue?`
    );
    
    if (!confirmed) return;

    setIsBulkProcessing(true);
    setIsPaused(false);
    setShouldCancel(false);
    setBulkResults({ completed: [], failed: [], cancelled: [] });
    
    const analysisIds = Array.from(selectedAnalyses);
    let completed = 0;
    let failed = 0;
    let cancelled = 0;
    
    try {
      for (let i = 0; i < analysisIds.length; i++) {
        const analysisId = analysisIds[i];
        
        if (!analysisId) continue;
        
        // Check for cancellation
        if (shouldCancel) {
          console.log(`🛑 Cancelling bulk operation at analysis ${i + 1}/${analysisIds.length}`);
          setBulkResults(prev => ({ ...prev, cancelled: analysisIds.slice(i) }));
          cancelled = analysisIds.length - i;
          break;
        }
        
        // Handle pause
        while (isPaused && !shouldCancel) {
          console.log(`⏸️ Operation paused at analysis ${i + 1}/${analysisIds.length}`);
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
        
        if (shouldCancel) {
          cancelled = analysisIds.length - i;
          break;
        }
        
        // Add to processing jobs
        setProcessingJobs(prev => [...prev, { id: analysisId, type: 'morphs-recommendations', startTime: new Date() }]);
        
        try {
          console.log(`Generating morphs and recommendations for ${analysisId}... (${i + 1}/${analysisIds.length})`);
          
          // First generate morphs
          console.log(`🔄 Generating morphs for ${analysisId}...`);
          await retryMutation(
            (input) => generateMorphsOnly.mutateAsync(input),
            { analysisId },
            3, // 3 retries
            2000 // 2 second base delay
          );
          console.log(`✅ Completed morphs for ${analysisId}`);
          
          // Then generate recommendations
          console.log(`🔄 Generating recommendations for ${analysisId}...`);
          await retryMutation(
            (input) => generateRecommendationsOnly.mutateAsync(input),
            { analysisId },
            3, // 3 retries
            2000 // 2 second base delay
          );
          console.log(`✅ Completed recommendations for ${analysisId}`);
          
          setBulkResults(prev => ({ ...prev, completed: [...prev.completed, analysisId] }));
          completed++;
          
        } catch (error) {
          console.error(`❌ Failed morphs+recommendations ${analysisId}:`, error);
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          setBulkResults(prev => ({ 
            ...prev, 
            failed: [...prev.failed, { id: analysisId, error: errorMessage }] 
          }));
          failed++;
        } finally {
          // Remove from processing jobs
          setProcessingJobs(prev => prev.filter(job => job.id !== analysisId));
        }
      }
      
      // Show summary
      const summary = `Bulk Morphs + Recommendations Complete!\n\n` +
        `✅ Completed: ${completed}\n` +
        `❌ Failed: ${failed}\n` +
        `🛑 Cancelled: ${cancelled}\n\n` +
        `${failed > 0 ? 'Check console for error details.' : 'All morphs and recommendations completed successfully!'}`;
      
      alert(summary);
      
      if (completed > 0) {
        setSelectedAnalyses(new Set());
        router.refresh();
      }
      
    } catch (error) {
      console.error("Bulk morphs+recommendations generation error:", error);
      alert("Bulk operation failed. Check console for details.");
    } finally {
      setIsBulkProcessing(false);
      setIsPaused(false);
      setShouldCancel(false);
    }
  };

  return (
    <>
    {/* Active Processing Jobs */}
    {processingJobs.length > 0 && (
      <div className="mb-4 overflow-hidden rounded-lg border border-blue-200 bg-blue-50 shadow-sm">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-semibold text-blue-900">
              Active Processing Jobs ({processingJobs.length})
            </h4>
            <div className="h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
          </div>
          <div className="space-y-2">
            {processingJobs.map(job => {
              const analysis = analyses.find(a => a.id === job.id);
              const elapsed = Math.floor((new Date().getTime() - job.startTime.getTime()) / 1000);
              return (
                <div key={job.id} className="flex items-center justify-between text-xs bg-white rounded px-3 py-2">
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full overflow-hidden">
                      <img
                        src={analysis?.frontPicture}
                        alt="User"
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiNGM0Y0RjYiLz4KPGNpcmNsZSBjeD0iMjAiIGN5PSIxNiIgcj0iNiIgZmlsbD0iIzlDQTNBRiIvPgo8cGF0aCBkPSJNMzAgMzJDMzAgMjcuNTgyIDI1LjQxOCAyMyAyMCAyM0MxNC41ODIgMjMgMTAgMjcuNTgyIDEwIDMyIiBmaWxsPSIjOUNBM0FGIi8+Cjwvc3ZnPgo=';
                        }}
                      />
                    </div>
                    <span className="font-medium text-gray-900">{analysis?.user.name}</span>
                    <span className="text-gray-500">•</span>
                    <span className="text-gray-600">{formatAnalysisId(job.id)}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${
                      job.type === 'analysis' 
                        ? 'border-blue-200 bg-blue-100 text-blue-700'
                        : job.type === 'text-analysis'
                        ? 'border-blue-200 bg-blue-100 text-blue-700'
                        : job.type === 'morphs'
                        ? 'border-purple-200 bg-purple-100 text-purple-700'
                        : job.type === 'recommendations'
                        ? 'border-green-200 bg-green-100 text-green-700'
                        : job.type === 'morphs-recommendations'
                        ? 'border-orange-200 bg-orange-100 text-orange-700'
                        : 'border-gray-200 bg-gray-100 text-gray-700'
                    }`}>
                      {job.type === 'analysis' && '🧠 Generating Analysis...'}
                      {job.type === 'text-analysis' && '📝 Generating Text Analysis...'}
                      {job.type === 'morphs' && '✨ Generating Morphs...'}
                      {job.type === 'recommendations' && '🎯 Generating Recommendations...'}
                      {job.type === 'morphs-recommendations' && '🎨 Generating Morphs + Recommendations...'}
                      {job.type === 'full' && '🚀 Full Processing...'}
                    </span>
                    <span className="text-gray-500">{elapsed}s</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    )}

    <div className="overflow-hidden bg-white shadow sm:rounded-md">
      <div className="px-4 py-4 sm:px-6 sm:py-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              All Analysis Orders
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              View and manage all facial analysis orders
            </p>
          </div>
          {selectedAnalyses.size > 0 && (
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600">
                {selectedAnalyses.size} selected
              </span>
              
              {/* Bulk operation dropdown */}
              {!isBulkProcessing && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="gap-2">
                      <Play className="h-4 w-4" />
                      Process Selected
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-64">
                    <DropdownMenuItem onClick={handleBulkTextAnalysisOnly}>
                      <FileText className="mr-2 h-4 w-4" />
                      <div>
                        <div className="font-medium">Text Analysis Only</div>
                        <div className="text-xs text-gray-500">Generate Claude text analysis</div>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleBulkMorphsOnly}>
                      <Wand2 className="mr-2 h-4 w-4" />
                      <div>
                        <div className="font-medium">Morphs Only</div>
                        <div className="text-xs text-gray-500">Generate GPT-5 morphs</div>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleBulkRecommendationsOnly}>
                      <Target className="mr-2 h-4 w-4" />
                      <div>
                        <div className="font-medium">Recommendations Only</div>
                        <div className="text-xs text-gray-500">Generate GPT-5 recommendations</div>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleBulkMorphsAndRecommendations}>
                      <Sparkles className="mr-2 h-4 w-4" />
                      <div>
                        <div className="font-medium">Morphs + Recommendations</div>
                        <div className="text-xs text-gray-500">Generate both together</div>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleBulkProcess}>
                      <Brain className="mr-2 h-4 w-4" />
                      <div>
                        <div className="font-medium">Full Process</div>
                        <div className="text-xs text-gray-500">Analysis + morphs + recommendations</div>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleBulkDelete} className="text-red-600">
                      <Trash2 className="mr-2 h-4 w-4" />
                      <div>
                        <div className="font-medium">Delete Analysis Content</div>
                        <div className="text-xs text-gray-500">Remove results, keep photos</div>
                      </div>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
              
              {/* Processing control buttons */}
              {isBulkProcessing && (
                <>
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
                    <span className="text-sm text-gray-600">
                      Processing... {isPaused && "(Paused)"}
                    </span>
                  </div>
                  
                  {!isPaused ? (
                    <Button
                      onClick={() => setIsPaused(true)}
                      variant="outline"
                      size="sm"
                      className="border-yellow-500 text-yellow-600 hover:bg-yellow-50"
                    >
                      ⏸️ Pause
                    </Button>
                  ) : (
                    <Button
                      onClick={() => setIsPaused(false)}
                      variant="outline"
                      size="sm"
                      className="border-green-500 text-green-600 hover:bg-green-50"
                    >
                      ▶️ Resume
                    </Button>
                  )}
                  
                  <Button
                    onClick={() => setShouldCancel(true)}
                    variant="destructive"
                    size="sm"
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    🛑 Cancel
                  </Button>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {analyses && analyses.length > 0 ? (
        <>
          {/* Mobile Card Layout */}
          <div className="block sm:hidden">
            <div className="space-y-4 p-4">
              {analyses.map((analysis) => (
                <div
                  key={analysis.id}
                  className="block rounded-lg border bg-gray-50 p-4 transition-colors hover:bg-gray-100"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        checked={selectedAnalyses.has(analysis.id)}
                        onCheckedChange={(checked) => handleSelectAnalysis(analysis.id, checked as boolean)}
                        onClick={(e) => e.stopPropagation()}
                      />
                      <img
                        className="h-10 w-10 rounded-full object-cover cursor-pointer"
                        src={analysis.frontPicture}
                        alt="Customer"
                        onClick={() => router.push(`/review/${analysis.id}`)}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiNGM0Y0RjYiLz4KPGNpcmNsZSBjeD0iMjAiIGN5PSIxNiIgcj0iNiIgZmlsbD0iIzlDQTNBRiIvPgo8cGF0aCBkPSJNMzAgMzJDMzAgMjcuNTgyIDI1LjQxOCAyMyAyMCAyM0MxNC41ODIgMjMgMTAgMjcuNTgyIDEwIDMyIiBmaWxsPSIjOUNBM0FGIi8+Cjwvc3ZnPgo=';
                        }}
                      />
                      <div className="cursor-pointer" onClick={() => router.push(`/review/${analysis.id}`)}>
                        <p className="font-medium text-gray-900">
                          {analysis.user.name}
                        </p>
                        <div className="text-sm text-gray-500">
                          <CopyEmailButton email={analysis.user.email} />
                        </div>
                        <p className="text-sm text-gray-500">
                          ID: {formatAnalysisId(analysis.id)}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Report Type</p>
                      <p className="font-medium">Comprehensive</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Created At</p>
                      <p className="font-medium">
                        {new Date(analysis.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="mt-3">
                    <p className="text-sm text-gray-500 mb-2">Content Status</p>
                    <div className="flex items-center gap-2">
                      {/* Analysis indicator */}
                      <div className={`flex items-center gap-1 rounded-full border px-2 py-1 text-xs ${
                        analysis.sectionContent && analysis.sectionContent.length > 0
                          ? "border-blue-200 bg-blue-50 text-blue-700"
                          : "border-gray-200 bg-gray-50 text-gray-400"
                      }`}>
                        <FileText className="h-3 w-3" />
                        <span>Analysis</span>
                      </div>
                      {/* Morph indicator */}
                      <div className={`flex items-center gap-1 rounded-full border px-2 py-1 text-xs ${
                        analysis.morphMetadata && typeof analysis.morphMetadata === 'object' && 'glowUpMorphs' in analysis.morphMetadata
                          ? "border-purple-200 bg-purple-50 text-purple-700"
                          : "border-gray-200 bg-gray-50 text-gray-400"
                      }`}>
                        <Wand2 className="h-3 w-3" />
                        <span>Morphs</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3">
                    <p className="text-sm text-gray-500">Intake Form</p>
                    <IntakeButton analysis={analysis} />
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {analysis.status === "ready" && (
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          markComplete.mutate({ analysisId: analysis.id });
                        }}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        Mark Complete
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Desktop Table Layout */}
          <div className="hidden overflow-x-auto sm:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">
                    <Checkbox
                      checked={selectedAnalyses.size === analyses.length && analyses.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead className="w-[100px]">ID</TableHead>
                  <TableHead>Customer Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Intake</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Content</TableHead>
                  <TableHead>Report Type</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {analyses.map((analysis) => (
                  <TableRow
                    key={analysis.id}
                    className="hover:bg-gray-50"
                  >
                    <TableCell>
                      <Checkbox
                        checked={selectedAnalyses.has(analysis.id)}
                        onCheckedChange={(checked) => handleSelectAnalysis(analysis.id, checked as boolean)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </TableCell>
                    <TableCell 
                      className="font-medium cursor-pointer"
                      onClick={() => router.push(`/review/${analysis.id}`)}
                    >
                      {formatAnalysisId(analysis.id)}
                    </TableCell>
                    <TableCell 
                      className="cursor-pointer"
                      onClick={() => router.push(`/review/${analysis.id}`)}
                    >
                      <div className="flex items-center">
                        <img
                          className="mr-3 h-8 w-8 rounded-full object-cover"
                          src={analysis.frontPicture}
                          alt="Customer"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiNGM0Y0RjYiLz4KPGNpcmNsZSBjeD0iMjAiIGN5PSIxNiIgcj0iNiIgZmlsbD0iIzlDQTNBRiIvPgo8cGF0aCBkPSJNMzAgMzJDMzAgMjcuNTgyIDI1LjQxOCAyMyAyMCAyM0MxNC41ODIgMjMgMTAgMjcuNTgyIDEwIDMyIiBmaWxsPSIjOUNBM0FGIi8+Cjwvc3ZnPgo=';
                          }}
                        />
                        <span>{analysis.user.name}</span>
                      </div>
                    </TableCell>
                    <TableCell 
                      className="cursor-pointer"
                      onClick={() => router.push(`/review/${analysis.id}`)}
                    >
                      <CopyEmailButton email={analysis.user.email} />
                    </TableCell>
                    <TableCell 
                      className="cursor-pointer"
                      onClick={() => router.push(`/review/${analysis.id}`)}
                    >
                      <IntakeButton analysis={analysis} />
                    </TableCell>
                    <TableCell 
                      className="cursor-pointer"
                      onClick={() => router.push(`/review/${analysis.id}`)}
                    >
                      <span
                        className={`inline-flex items-center rounded-full border px-2 py-1 text-xs font-medium ${
                          analysis.status === "complete"
                            ? "border-green-200 bg-green-100 text-green-800"
                            : analysis.status === "ready"
                              ? "border-blue-200 bg-blue-100 text-blue-800"
                              : "border-orange-200 bg-orange-100 text-orange-800"
                        }`}
                      >
                        {analysis.status === "complete"
                          ? "Complete"
                          : analysis.status === "ready"
                            ? "Ready"
                            : "In Progress"}
                      </span>
                    </TableCell>
                    <TableCell 
                      className="cursor-pointer"
                      onClick={() => router.push(`/review/${analysis.id}`)}
                    >
                      <div className="flex items-center gap-2">
                        {/* Analysis indicator */}
                        <div className={`flex items-center gap-1 rounded-full border px-2 py-1 text-xs ${
                          analysis.sectionContent && analysis.sectionContent.length > 0
                            ? "border-blue-200 bg-blue-50 text-blue-700"
                            : "border-gray-200 bg-gray-50 text-gray-400"
                        }`}>
                          <FileText className="h-3 w-3" />
                          <span className="hidden lg:inline">Analysis</span>
                        </div>
                        {/* Morph indicator */}
                        <div className={`flex items-center gap-1 rounded-full border px-2 py-1 text-xs ${
                          analysis.morphMetadata && typeof analysis.morphMetadata === 'object' && 'glowUpMorphs' in analysis.morphMetadata
                            ? "border-purple-200 bg-purple-50 text-purple-700"
                            : "border-gray-200 bg-gray-50 text-gray-400"
                        }`}>
                          <Wand2 className="h-3 w-3" />
                          <span className="hidden lg:inline">Morphs</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell 
                      className="cursor-pointer"
                      onClick={() => router.push(`/review/${analysis.id}`)}
                    >
                      Comprehensive
                    </TableCell>
                    <TableCell 
                      className="cursor-pointer"
                      onClick={() => router.push(`/review/${analysis.id}`)}
                    >
                      {new Date(analysis.createdAt).toLocaleString()}
                    </TableCell>
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <div className="flex gap-2">
                        {analysis.status === "ready" && (
                          <Button
                            onClick={() => markComplete.mutate({ analysisId: analysis.id })}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            Mark Complete
                          </Button>
                        )}
                        <Button
                          variant="destructive"
                          onClick={() => handleDeleteOne(analysis.id)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </>
      ) : (
        <div className="px-4 py-8 text-center sm:py-12">
          <div className="mb-4 text-gray-400">
            <svg
              className="mx-auto h-10 w-10 sm:h-12 sm:w-12"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h3 className="mb-2 text-base font-medium text-gray-900 sm:text-lg">
            No analyses yet
          </h3>
          <p className="mb-4 text-sm text-gray-500 sm:mb-6 sm:text-base">
            Get started by creating your first facial analysis
          </p>
          <Button asChild className="px-4 py-2 text-sm sm:px-6 sm:text-base">
            <a href="/create-analysis">Start Your First Analysis</a>
          </Button>
        </div>
      )}
    </div>
    </>
  );
}
