import { env } from "~/env.js";

/**
 * Zyla API Response Types
 */
interface ZylaAnalysisResponse {
  success: boolean;
  data: {
    skin_analysis: {
      acne?: {
        severity: string;
        affected_areas: string[];
        percentage: number;
      };
      wrinkles?: {
        severity: string;
        types: string[];
        affected_areas: string[];
      };
      pores?: {
        visibility: string;
        size: string;
        affected_areas: string[];
      };
      skin_texture?: {
        smoothness: string;
        roughness_level: string;
      };
      hydration?: {
        level: string;
        dry_areas: string[];
      };
      pigmentation?: {
        evenness: string;
        dark_spots: boolean;
        affected_areas: string[];
      };
      redness?: {
        level: string;
        affected_areas: string[];
      };
      overall_skin_health?: {
        score: number;
        summary: string;
      };
    };
    heat_map?: string;
    segmentation?: {
      forehead: any;
      cheeks: any;
      nose: any;
      chin: any;
    };
  };
  message?: string;
}

/**
 * Structured result for UI consumption
 */
export interface SkinAnalysisResult {
  category: string;
  metric: string;
  value: string;
  severity: 'excellent' | 'good' | 'moderate' | 'poor' | 'severe';
  description: string;
  affectedAreas?: string[];
}

export interface ZylaSkinAnalysis {
  results: SkinAnalysisResult[];
  overallScore: number;
  overallSummary: string;
  rawData: ZylaAnalysisResponse;
}

/**
 * Map severity strings to standardized levels
 */
function mapSeverity(severity: string | undefined): 'excellent' | 'good' | 'moderate' | 'poor' | 'severe' {
  if (!severity) return 'moderate';
  
  const normalized = severity.toLowerCase();
  
  if (normalized.includes('none') || normalized.includes('clear') || normalized.includes('excellent')) {
    return 'excellent';
  }
  if (normalized.includes('mild') || normalized.includes('slight') || normalized.includes('good')) {
    return 'good';
  }
  if (normalized.includes('moderate') || normalized.includes('medium')) {
    return 'moderate';
  }
  if (normalized.includes('severe') || normalized.includes('heavy') || normalized.includes('significant')) {
    return 'severe';
  }
  if (normalized.includes('poor') || normalized.includes('bad')) {
    return 'poor';
  }
  
  return 'moderate';
}

/**
 * Analyze skin using Zyla API
 */
export async function analyzeSkinWithZyla(imageUrl: string): Promise<ZylaSkinAnalysis> {
  const apiKey = env.ZYLA_API_KEY;
  
  if (!apiKey) {
    throw new Error('ZYLA_API_KEY is not configured');
  }

    console.log('🔍 Starting Zyla skin analysis...');
    console.log('📸 Image URL length:', imageUrl.length);
    console.log('📸 Image URL type:', imageUrl.startsWith('data:') ? 'Base64 Data URL' : imageUrl.startsWith('http') ? 'HTTP URL' : 'Unknown');
    console.log('📸 Image URL preview:', imageUrl.substring(0, 100) + '...');
    console.log('🔑 API Key present:', !!apiKey);
    console.log('🔑 API Key length:', apiKey?.length || 0);

    // Check if we have a base64 data URL - Zyla API requires HTTP URLs
    if (imageUrl.startsWith('data:')) {
      console.log('❌ Zyla API requires publicly accessible HTTP URLs, not base64 data URLs');
      throw new Error(
        'Zyla API requires publicly accessible image URLs (HTTP/HTTPS), not base64 data URLs. ' +
        'Please upload your image to a public URL first (e.g., using a service like imgur.com, cloudinary.com, or your own CDN).'
      );
    }

  const requestBody = {
    analysis_type: 'comprehensive',
    image_url: imageUrl,
    focus_areas: ['acne', 'wrinkles', 'pores', 'texture', 'hydration', 'pigmentation'],
  };

  console.log('📤 Request body:', JSON.stringify(requestBody, null, 2));

  try {
    const response = await fetch(
      'https://zylalabs.com/api/9339/skin+face+data+analyzer+api/16877/skin+analysis',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Zyla API error:', response.status, errorText);
      throw new Error(`Zyla API request failed: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('✅ Received Zyla analysis response');
    console.log('📦 Raw API Response Type:', typeof data);
    console.log('📦 Raw API Response Keys:', Object.keys(data));
    console.log('📦 Raw API Response Full:', JSON.stringify(data, null, 2));
    
    // Log specific properties to understand the structure
    console.log('🔍 data.success:', data.success);
    console.log('🔍 data.error:', data.error);
    console.log('🔍 data.message:', data.message);
    console.log('🔍 data.data:', data.data);

        // Check for API error responses - be more flexible with error detection
        const hasError = data.error || 
          (typeof data.message === 'string' && data.message.toLowerCase().includes('error')) || 
          data.success === false ||
          (data.status && data.status !== 'success') ||
          (data.code && data.code !== 200);
          
        if (hasError) {
          const errorMsg = typeof data.error === 'string' ? data.error 
            : typeof data.message === 'string' ? data.message
            : data.error === true ? 'API returned error flag'
            : data.success === false ? 'API request unsuccessful (success=false)'
            : data.status ? `API status: ${data.status}`
            : data.code ? `API code: ${data.code}`
            : 'Unknown API error';
          
          console.error('❌ API returned error condition');
          console.error('   - data.error:', data.error);
          console.error('   - data.message:', data.message);
          console.error('   - data.success:', data.success);
          console.error('   - data.status:', data.status);
          console.error('   - data.code:', data.code);
          console.error('   - Full response:', JSON.stringify(data));
          
          throw new Error(`Zyla API error: ${errorMsg}`);
        }

    // Transform the response into structured results
    const results: SkinAnalysisResult[] = [];
    
    // Try different possible response structures
    let skinData = data?.data?.skin_analysis || data?.skin_analysis || data?.analysis || data?.result || data;
    
    console.log('🔍 Extracted skin data:', JSON.stringify(skinData, null, 2));

    // If we still don't have usable data, provide a detailed error
    if (!skinData || typeof skinData !== 'object') {
      console.error('❌ Unable to parse skin data from response');
      console.error('Response keys:', Object.keys(data));
      throw new Error(`Unexpected API response structure. Received: ${JSON.stringify(data).substring(0, 200)}`);
    }

    // Safely extract data with optional chaining
    // The API structure is unknown, so we'll try to extract whatever we can
    
    // Acne Analysis
    if (skinData.acne) {
      results.push({
        category: 'Acne & Blemishes',
        metric: 'Acne Severity',
        value: skinData.acne.severity || skinData.acne.level || 'Not detected',
        severity: mapSeverity(skinData.acne.severity || skinData.acne.level),
        description: `Acne coverage: ${skinData.acne.percentage || skinData.acne.coverage || 0}% of face`,
        affectedAreas: skinData.acne.affected_areas || skinData.acne.areas,
      });
    }

    // Wrinkles Analysis
    if (skinData.wrinkles) {
      results.push({
        category: 'Aging Signs',
        metric: 'Wrinkles',
        value: skinData.wrinkles.severity || skinData.wrinkles.level || 'Not detected',
        severity: mapSeverity(skinData.wrinkles.severity || skinData.wrinkles.level),
        description: Array.isArray(skinData.wrinkles.types) 
          ? skinData.wrinkles.types.join(', ')
          : skinData.wrinkles.description || 'Wrinkle analysis',
        affectedAreas: skinData.wrinkles.affected_areas || skinData.wrinkles.areas,
      });
    }

    // Pores Analysis
    if (skinData.pores) {
      results.push({
        category: 'Skin Texture',
        metric: 'Pore Visibility',
        value: `${skinData.pores.visibility || skinData.pores.level || 'Normal'} ${skinData.pores.size ? `(${skinData.pores.size})` : ''}`.trim(),
        severity: mapSeverity(skinData.pores.visibility || skinData.pores.level),
        description: 'Pore size and visibility assessment',
        affectedAreas: skinData.pores.affected_areas || skinData.pores.areas,
      });
    }

    // Skin Texture
    if (skinData.skin_texture || skinData.texture) {
      const textureData = skinData.skin_texture || skinData.texture;
      results.push({
        category: 'Skin Texture',
        metric: 'Surface Smoothness',
        value: textureData.smoothness || textureData.level || 'Normal',
        severity: mapSeverity(textureData.smoothness || textureData.level),
        description: textureData.roughness_level 
          ? `Roughness level: ${textureData.roughness_level}`
          : textureData.description || 'Surface texture analysis',
      });
    }

    // Hydration
    if (skinData.hydration) {
      results.push({
        category: 'Hydration',
        metric: 'Moisture Level',
        value: skinData.hydration.level || 'Normal',
        severity: mapSeverity(skinData.hydration.level),
        description: skinData.hydration.description || 'Skin hydration and moisture balance',
        affectedAreas: skinData.hydration.dry_areas || skinData.hydration.areas,
      });
    }

    // Pigmentation
    if (skinData.pigmentation) {
      results.push({
        category: 'Pigmentation',
        metric: 'Skin Tone Evenness',
        value: skinData.pigmentation.evenness || skinData.pigmentation.level || 'Normal',
        severity: skinData.pigmentation.dark_spots ? 'poor' : mapSeverity(skinData.pigmentation.evenness || skinData.pigmentation.level),
        description: skinData.pigmentation.dark_spots 
          ? 'Dark spots detected'
          : skinData.pigmentation.description || 'Even skin tone',
        affectedAreas: skinData.pigmentation.affected_areas || skinData.pigmentation.areas,
      });
    }

    // Redness
    if (skinData.redness) {
      results.push({
        category: 'Sensitivity',
        metric: 'Redness Level',
        value: skinData.redness.level || 'Normal',
        severity: mapSeverity(skinData.redness.level),
        description: skinData.redness.description || 'Skin sensitivity and redness',
        affectedAreas: skinData.redness.affected_areas || skinData.redness.areas,
      });
    }
    
    // If no specific metrics found, try to extract any available data as generic results
    if (results.length === 0) {
      console.warn('⚠️ No standard metrics found, attempting to parse generic data...');
      
      // Try to create results from any available properties
      for (const [key, value] of Object.entries(skinData)) {
        if (value && typeof value === 'object' && !Array.isArray(value)) {
          results.push({
            category: 'General Analysis',
            metric: key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
            value: (value as any).level || (value as any).severity || (value as any).value || 'Detected',
            severity: mapSeverity((value as any).level || (value as any).severity),
            description: (value as any).description || JSON.stringify(value),
          });
        }
      }
    }

    // If still no results, throw a more informative error
    if (results.length === 0) {
      console.error('❌ No metrics could be extracted from API response');
      throw new Error(
        'The API returned a response but no analyzable skin metrics were found. ' +
        'This could mean: (1) The API structure has changed, (2) The image was not suitable for analysis, ' +
        `or (3) The API returned an error. Response: ${JSON.stringify(data).substring(0, 300)}`
      );
    }

    // Calculate overall score from available data
    const overallScore = skinData.overall_skin_health?.score || 
      skinData.score ||
      calculateOverallScore(results);
    
    const overallSummary = skinData.overall_skin_health?.summary || 
      skinData.summary ||
      generateSummary(results, overallScore);

    console.log(`✅ Processed ${results.length} skin metrics`);

    return {
      results,
      overallScore,
      overallSummary,
      rawData: data,
    };

  } catch (error) {
    console.error('❌ Zyla analysis error:', error);
    throw error;
  }
}

/**
 * Calculate overall skin health score from individual metrics
 */
function calculateOverallScore(results: SkinAnalysisResult[]): number {
  if (results.length === 0) return 50;

  const severityScores: Record<string, number> = {
    excellent: 100,
    good: 80,
    moderate: 60,
    poor: 40,
    severe: 20,
  };

  const totalScore = results.reduce((sum, result) => {
    return sum + (severityScores[result.severity] || 60);
  }, 0);

  return Math.round(totalScore / results.length);
}

/**
 * Generate a summary based on results
 */
function generateSummary(results: SkinAnalysisResult[], score: number): string {
  const excellentCount = results.filter(r => r.severity === 'excellent').length;
  const concernCount = results.filter(r => ['poor', 'severe'].includes(r.severity)).length;

  if (score >= 85) {
    return `Excellent skin health with ${excellentCount} optimal metrics. Keep up your current skincare routine.`;
  } else if (score >= 70) {
    return `Good overall skin condition with some areas for improvement. Focus on targeted treatments.`;
  } else if (score >= 50) {
    return `Moderate skin health with ${concernCount} areas needing attention. Consider a comprehensive skincare plan.`;
  } else {
    return `Significant skin concerns detected in ${concernCount} areas. Professional consultation recommended.`;
  }
}

