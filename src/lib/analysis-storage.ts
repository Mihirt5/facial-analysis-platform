/**
 * Analysis Data Storage Utility
 * Handles saving, loading, and managing facial analysis results
 */

export interface AnalysisRecord {
  id: string;
  timestamp: string;
  imageUrl: string;
  analysisType: 'zyla' | 'openrouter';
  data: any;
  summary: {
    overallScore?: number;
    keyFindings: string[];
    recommendations: string[];
  };
}

export interface AnalysisSummary {
  overallScore?: number;
  keyFindings: string[];
  recommendations: string[];
}

/**
 * Generate a unique ID for analysis records
 */
export function generateAnalysisId(): string {
  return `analysis_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Extract key findings and recommendations from analysis data
 */
export function extractAnalysisSummary(analysisType: 'zyla' | 'openrouter', data: any): AnalysisSummary {
  const summary: AnalysisSummary = {
    keyFindings: [],
    recommendations: []
  };

  if (analysisType === 'zyla') {
    // Extract overall score
    summary.overallScore = data.overallScore;

    // Extract key findings from results
    if (data.results && Array.isArray(data.results)) {
      data.results.forEach((result: any) => {
        if (result.severity === 'severe' || result.severity === 'poor') {
          summary.keyFindings.push(`${result.metric}: ${result.value} (${result.severity})`);
        }
      });
    }

    // Generate recommendations based on findings
    if (data.results && Array.isArray(data.results)) {
      data.results.forEach((result: any) => {
        if (result.severity === 'severe' || result.severity === 'poor') {
          switch (result.metric.toLowerCase()) {
            case 'acne severity':
              summary.recommendations.push('Consider consulting a dermatologist for acne treatment');
              break;
            case 'wrinkles':
              summary.recommendations.push('Focus on anti-aging skincare routine');
              break;
            case 'pore visibility':
              summary.recommendations.push('Use pore-minimizing products and regular exfoliation');
              break;
            case 'pigmentation':
              summary.recommendations.push('Use sunscreen daily and consider brightening treatments');
              break;
          }
        }
      });
    }
  }

  if (analysisType === 'openrouter') {
    // Extract key findings from GPT-5 analysis
    if (data.analysis && typeof data.analysis === 'object') {
      Object.entries(data.analysis).forEach(([category, content]) => {
        if (typeof content === 'string' && content.length > 50) {
          // Extract first sentence as key finding
          const firstSentence = content.split('.')[0];
          if (firstSentence.length > 20) {
            summary.keyFindings.push(`${category}: ${firstSentence}`);
          }
        }
      });
    }

    // Generate general recommendations
    summary.recommendations.push('Maintain consistent skincare routine');
    summary.recommendations.push('Use sunscreen daily');
    summary.recommendations.push('Stay hydrated and maintain healthy diet');
  }

  return summary;
}

/**
 * Save analysis result to localStorage
 */
export function saveAnalysisResult(
  analysisType: 'zyla' | 'openrouter',
  imageUrl: string,
  data: any
): AnalysisRecord {
  const analysisRecord: AnalysisRecord = {
    id: generateAnalysisId(),
    timestamp: new Date().toISOString(),
    imageUrl,
    analysisType,
    data,
    summary: extractAnalysisSummary(analysisType, data)
  };

  // Load existing analyses
  const existingAnalyses = loadAnalysisResults();
  
  // Add new analysis to the beginning of the array
  const updatedAnalyses = [analysisRecord, ...existingAnalyses];
  
  // Save back to localStorage
  localStorage.setItem('facial-analyses', JSON.stringify(updatedAnalyses));
  
  return analysisRecord;
}

/**
 * Load all analysis results from localStorage
 */
export function loadAnalysisResults(): AnalysisRecord[] {
  try {
    const saved = localStorage.getItem('facial-analyses');
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error('Error loading analysis results:', error);
    return [];
  }
}

/**
 * Delete analysis result by ID
 */
export function deleteAnalysisResult(id: string): boolean {
  try {
    const analyses = loadAnalysisResults();
    const updated = analyses.filter(a => a.id !== id);
    localStorage.setItem('facial-analyses', JSON.stringify(updated));
    return true;
  } catch (error) {
    console.error('Error deleting analysis result:', error);
    return false;
  }
}

/**
 * Export analysis results as JSON
 */
export function exportAnalysisResults(analyses: AnalysisRecord[], filename?: string): void {
  const dataStr = JSON.stringify(analyses, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename || `facial-analyses-${new Date().toISOString().split('T')[0]}.json`;
  link.click();
  URL.revokeObjectURL(url);
}

/**
 * Import analysis results from JSON file
 */
export function importAnalysisResults(file: File): Promise<AnalysisRecord[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        if (Array.isArray(data)) {
          resolve(data);
        } else {
          reject(new Error('Invalid file format'));
        }
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = () => reject(new Error('Error reading file'));
    reader.readAsText(file);
  });
}

/**
 * Get analysis statistics
 */
export function getAnalysisStats(analyses: AnalysisRecord[]) {
  const stats = {
    total: analyses.length,
    zylaCount: analyses.filter(a => a.analysisType === 'zyla').length,
    openrouterCount: analyses.filter(a => a.analysisType === 'openrouter').length,
    averageScore: 0,
    scoreDistribution: {
      excellent: 0,
      good: 0,
      moderate: 0,
      poor: 0,
      severe: 0
    }
  };

  // Calculate average score for Zyla analyses
  const zylaAnalyses = analyses.filter(a => a.analysisType === 'zyla' && a.summary.overallScore);
  if (zylaAnalyses.length > 0) {
    stats.averageScore = zylaAnalyses.reduce((sum, a) => sum + (a.summary.overallScore || 0), 0) / zylaAnalyses.length;
  }

  // Calculate score distribution
  zylaAnalyses.forEach(analysis => {
    const score = analysis.summary.overallScore || 0;
    if (score >= 85) stats.scoreDistribution.excellent++;
    else if (score >= 70) stats.scoreDistribution.good++;
    else if (score >= 50) stats.scoreDistribution.moderate++;
    else if (score >= 30) stats.scoreDistribution.poor++;
    else stats.scoreDistribution.severe++;
  });

  return stats;
}

/**
 * Compare two analyses
 */
export function compareAnalyses(analysis1: AnalysisRecord, analysis2: AnalysisRecord) {
  if (analysis1.analysisType !== analysis2.analysisType) {
    return {
      comparable: false,
      message: 'Cannot compare analyses of different types'
    };
  }

  const comparison = {
    comparable: true,
    scoreChange: 0,
    improvements: [] as string[],
    deteriorations: [] as string[],
    unchanged: [] as string[]
  };

  if (analysis1.analysisType === 'zyla' && analysis2.analysisType === 'zyla') {
    const score1 = analysis1.summary.overallScore || 0;
    const score2 = analysis2.summary.overallScore || 0;
    comparison.scoreChange = score2 - score1;

    // Compare individual metrics
    if (analysis1.data.results && analysis2.data.results) {
      const metrics1 = analysis1.data.results;
      const metrics2 = analysis2.data.results;

      metrics1.forEach((metric1: any) => {
        const metric2 = metrics2.find((m: any) => m.metric === metric1.metric);
        if (metric2) {
          const severityOrder = { excellent: 5, good: 4, moderate: 3, poor: 2, severe: 1 };
          const order1 = severityOrder[metric1.severity as keyof typeof severityOrder] || 0;
          const order2 = severityOrder[metric2.severity as keyof typeof severityOrder] || 0;

          if (order2 > order1) {
            comparison.improvements.push(`${metric1.metric}: ${metric1.severity} → ${metric2.severity}`);
          } else if (order2 < order1) {
            comparison.deteriorations.push(`${metric1.metric}: ${metric1.severity} → ${metric2.severity}`);
          } else {
            comparison.unchanged.push(`${metric1.metric}: ${metric1.severity}`);
          }
        }
      });
    }
  }

  return comparison;
}
