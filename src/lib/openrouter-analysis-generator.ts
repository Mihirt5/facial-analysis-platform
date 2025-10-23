import OpenAI from 'openai';
import { db } from "~/server/db";
import { analysisSectionContent, analysis } from "~/server/db/schema";
import { ANALYSIS_STRUCTURE } from "~/lib/analysis-structure";
import { eq } from "drizzle-orm";

// OpenRouter client configuration using OpenAI SDK
// Reference: https://openrouter.ai/docs/quickstart#using-the-openai-sdk
const openrouterClient = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

/**
 * Sanitize text to remove problematic Unicode characters that can cause ByteString errors
 * Removes emojis, special spaces, and other non-ASCII/Latin-1 characters
 */
function sanitizeText(text: string | null | undefined): string {
  if (!text) return '';
  
  return text
    .replace(/[\u{1F600}-\u{1F64F}]/gu, '') // Remove emoticons
    .replace(/[\u{1F300}-\u{1F5FF}]/gu, '') // Remove symbols & pictographs
    .replace(/[\u{1F680}-\u{1F6FF}]/gu, '') // Remove transport & map symbols
    .replace(/[\u{1F700}-\u{1F77F}]/gu, '') // Remove alchemical symbols
    .replace(/[\u{1F780}-\u{1F7FF}]/gu, '') // Remove Geometric Shapes Extended
    .replace(/[\u{1F800}-\u{1F8FF}]/gu, '') // Remove Supplemental Arrows-C
    .replace(/[\u{1F900}-\u{1F9FF}]/gu, '') // Remove Supplemental Symbols and Pictographs
    .replace(/[\u{1FA00}-\u{1FA6F}]/gu, '') // Remove Chess Symbols
    .replace(/[\u{1FA70}-\u{1FAFF}]/gu, '') // Remove Symbols and Pictographs Extended-A
    .replace(/[\u{2600}-\u{26FF}]/gu, '')   // Remove Miscellaneous Symbols
    .replace(/[\u{2700}-\u{27BF}]/gu, '')   // Remove Dingbats
    .replace(/\u202F/g, ' ') // Replace narrow no-break space (U+202F, char 8239) with regular space
    .replace(/\u00A0/g, ' ') // Replace non-breaking space with regular space
    .replace(/\u2000/g, ' ') // Replace en quad
    .replace(/\u2001/g, ' ') // Replace em quad
    .replace(/\u2002/g, ' ') // Replace en space
    .replace(/\u2003/g, ' ') // Replace em space
    .replace(/\u2004/g, ' ') // Replace three-per-em space
    .replace(/\u2005/g, ' ') // Replace four-per-em space
    .replace(/\u2006/g, ' ') // Replace six-per-em space
    .replace(/\u2007/g, ' ') // Replace figure space
    .replace(/\u2008/g, ' ') // Replace punctuation space
    .replace(/\u2009/g, ' ') // Replace thin space
    .replace(/\u200A/g, ' ') // Replace hair space
    .replace(/\u200B/g, '')  // Remove zero-width space
    .replace(/\u200C/g, '')  // Remove zero-width non-joiner
    .replace(/\u200D/g, '')  // Remove zero-width joiner
    .replace(/\uFEFF/g, '')  // Remove zero-width no-break space (BOM)
    .replace(/[^\x00-\x7F\u0080-\u00FF]/g, '') // Keep only ASCII + Latin-1 Supplement (0-255)
    .trim();
}

interface ClaudeAnalysisSection {
  sectionKey: string;
  feature: string;
  measurement?: string;
  status: 'perfect' | 'slight' | 'noticeable' | 'significant' | 'horrible' | 'extreme';
  rating: string;
  ideal?: string;
  description: string;
}

interface ClaudeAnalysisResponse {
  overview: ClaudeAnalysisSection[];
  browEye: ClaudeAnalysisSection[];
  nose: ClaudeAnalysisSection[];
  lipsMouth: ClaudeAnalysisSection[];
  cheeksMidface: ClaudeAnalysisSection[];
  jawChin: ClaudeAnalysisSection[];
  ears: ClaudeAnalysisSection[];
  skinTexture: ClaudeAnalysisSection[];
  hairlineForehead: ClaudeAnalysisSection[];
  overallSummary: string;
  overviewSummary: string;
  browEyeSummary: string;
  noseSummary: string;
  lipsMouthSummary: string;
  cheeksMidfaceSummary: string;
  jawChinSummary: string;
  earsSummary: string;
  skinTextureSummary: string;
  hairlineForeheadSummary: string;
  // Numerical scores out of 10
  overviewScore: number;
  browEyeScore: number;
  noseScore: number;
  lipsMouthScore: number;
  cheeksMidfaceScore: number;
  jawChinScore: number;
  earsScore: number;
  skinTextureScore: number;
  hairlineForeheadScore: number;
  overallAestheticsScore: number;
}

/**
 * Generate comprehensive facial analysis using Claude 4.5 via OpenRouter
 * Analyzes all uploaded images and generates detailed content for each section
 */
export async function generateClaudeAnalysis(images: {
  frontPicture: string;
  leftPicture: string;
  rightPicture: string;
  leftSidePicture: string;
  rightSidePicture: string;
  hairlinePicture?: string | null;
}): Promise<ClaudeAnalysisResponse> {
  
  const prompt = `You are a professional facial aesthetics consultant performing a comprehensive clinical evaluation for medical and aesthetic planning purposes. This analysis will be used by healthcare professionals to provide personalized recommendations and treatment planning.

Perform a thorough, objective, and clinically detailed facial analysis of the person shown in these images. Your assessment should be:
- **Professional and clinical** in tone
- **Objective and precise** in observations  
- **Medically accurate** using aesthetic benchmarks
- **Comprehensive and specific** rather than vague
- **Honest and direct** about deviations from aesthetic ideals

IMAGES PROVIDED:
- Image 1: Front view (for overall face, eyes, lips, skin, cheeks)
- Image 2: Left 3/4 view (for cheekbones, facial contours)
- Image 3: Right 3/4 view (for symmetry assessment)
- Image 4: Left profile (for nose, jaw, chin projection)
- Image 5: Right profile (for nose, jaw, chin confirmation)
${images.hairlinePicture ? '- Image 6: **HAIRLINE-SPECIFIC PHOTO** - USE THIS IMAGE FOR DETAILED HAIRLINE AND FOREHEAD ANALYSIS. Examine hairline recession, density, temple thinning, and any signs of hair loss with particular scrutiny.' : ''}

This is a clinical assessment for professional use. Identify both strengths and areas that deviate from ideal aesthetic standards. Be specific about asymmetries, proportional imbalances, aging signs, and structural features. Your analysis will help medical professionals create personalized treatment plans.

Analyze the following categories in depth:

**OVERVIEW** (6 features)
1. **Facial Harmony** - Overall balance and proportion of facial features
2. **Facial Symmetry** - Left-right balance and mirror symmetry
3. **Masculinity/Femininity** - Gender-typical features and dimorphism
4. **Youthfulness** - Age-related features and aging signs
5. **Face Shape** - Overall face shape classification and suitability
6. **Overall Attractiveness** - Holistic aesthetic appeal and presence

**BROW & EYE AREA** (7 features)
1. **Brow Shape & Structure** - Shape, thickness, definition, and arch
2. **Brow Positioning** - Lift, tilt, start/end points, tail length
3. **Eye Shape & Size** - Shape, symmetry, width, height, depth
4. **Canthal Tilt** - Angle between inner and outer eye corners
5. **Eyelids & Corners** - Exposure, corner shape, scleral show, hooding
6. **Under-Eye Area** - Pigmentation, puffiness, hollowness, support
7. **Other Eye Metrics** - Iris color, limbal ring, epicanthic fold, spacing

**NOSE** (5 features)
1. **Bridge & Dorsal Profile** - Bridge width, shape, dorsal line
2. **Tip & Rotation** - Tip definition, rotation, projection
3. **Symmetry & Alignment** - Columella, septum, deviation
4. **Nostril Details** - Shape, flare, exposure, balance
5. **Angles & Relationships** - Nasofrontal, nasolabial, supratip break

**LIPS & MOUTH** (5 features)
1. **Lip Shape & Proportion** - Fullness, ratios, Cupid's bow
2. **Definition & Surface** - Vermilion border, smoothness, lip lines
3. **Color & Contrast** - Natural lip color, contrast with skin
4. **Smile Dynamics** - Tooth show, symmetry, gum visibility
5. **Additional Metrics** - Buccal corridors, Duchenne activation, philtrum

**CHEEKS & MIDFACE** (5 features)
1. **Cheekbone Prominence** - Height, width, and projection of cheekbones
2. **Midface Volume** - Fullness and support in the midface region
3. **Cheek Hollows** - Depth and definition of cheek hollows
4. **Midface Proportions** - Balance of midface height and width
5. **Ogee Curve** - S-curve from temple to cheek to jaw

**JAW & CHIN** (8 features)
1. **Jaw Shape** - Overall jaw shape and structure
2. **Jaw Width** - Bigonial width and facial frame
3. **Gonial Angle** - Angle at the jaw corner near the ear
4. **Jawline Definition** - Clarity and sharpness of the jawline
5. **Chin Projection** - Forward prominence of the chin
6. **Chin Width & Shape** - Width and contour of the chin
7. **Chin Inclination** - Angle and tilt of the chin
8. **Submental Area** - Neck-jaw transition and submental definition

**EARS** (5 features)
1. **Ear Size** - Overall size relative to face
2. **Ear Shape** - Contour and structure of the ear
3. **Ear Protrusion** - How far ears stick out from head
4. **Ear Symmetry** - Balance between left and right ears
5. **Ear Position** - Height and alignment relative to eyes

**SKIN & TEXTURE** (8 features)
1. **Skin Tone & Evenness** - Uniformity and consistency of skin color
2. **Texture Quality** - Surface smoothness and refinement
3. **Pore Size & Visibility** - Size and prominence of pores
4. **Acne & Blemishes** - Active breakouts, scarring, imperfections
5. **Pigmentation Issues** - Dark spots, hyperpigmentation, melasma
6. **Redness & Sensitivity** - Flushing, rosacea, vascular issues
7. **Aging Signs** - Fine lines, wrinkles, elasticity loss
8. **Overall Skin Health** - General vitality and health of skin

**HAIRLINE & FOREHEAD** (7 features) ${images.hairlinePicture ? '- **USE THE DEDICATED HAIRLINE PHOTO (LAST IMAGE) FOR THIS ANALYSIS**' : ''}
1. **Hairline Shape** - Shape and contour of the hairline (examine for widow's peak, M-shape, rounded, straight)
2. **Hairline Position** - Height and placement on forehead (measure if receded beyond normal position)
3. **Recession & Thinning** - Signs of hair loss or recession (**BE THOROUGH - examine temples, corners, and overall density carefully**)
4. **Hair Density at Temples** - Thickness at hairline and temples (**examine for any thinning, sparse areas, or miniaturization**)
5. **Forehead Height** - Vertical proportion of forehead (normal range: 5-6cm from brow to hairline)
6. **Forehead Width** - Horizontal proportion and shape
7. **Forehead Slope** - Angle and projection of forehead

**CRITICAL FOR HAIRLINE ANALYSIS**: Be especially thorough and honest about hairline recession, temple recession (even Norwood 1-2), hair density issues, and any signs of thinning. Do not minimize or overlook early signs of hair loss. Use clinical precision in describing the hairline quality and position.

For each feature, provide:
- **sectionKey**: Use exact keys from this list: "overview_facial_harmony", "overview_symmetry", "overview_masculinity_femininity", "overview_youthfulness", "overview_face_shape", "overview_attractiveness", "brow_shape_structure", "brow_positioning", "eye_shape_size", "eye_canthal_tilt", "eyelids_corners", "undereye_area", "eye_other_metrics", "nose_bridge_dorsal", "nose_tip_rotation", "nose_symmetry_alignment", "nose_nostril_details", "nose_angles", "lip_shape_proportion", "lip_definition_surface", "lip_color_contrast", "smile_dynamics", "mouth_additional", "cheekbone_prominence", "midface_volume", "cheek_hollows", "midface_proportions", "ogee_curve", "jaw_shape", "jaw_width", "jaw_angle", "jawline_definition", "chin_projection", "chin_width_shape", "chin_inclination", "submental_area", "ear_size", "ear_shape", "ear_protrusion", "ear_symmetry", "ear_position", "skin_tone_evenness", "skin_texture_quality", "skin_pores", "skin_acne_blemishes", "skin_pigmentation", "skin_redness_sensitivity", "skin_aging_signs", "skin_overall_health", "hairline_shape", "hairline_position", "hairline_recession", "hair_density_temples", "forehead_height", "forehead_width", "forehead_slope"
- **feature**: Human-readable feature name
- **measurement**: Numerical value, ratio, or descriptive measurement where applicable
- **status**: One of: perfect, slight, noticeable, significant, horrible, extreme (based on deviation from ideal)
- **rating**: Human-readable rating (e.g., "Excellent", "Good", "Fair", "Poor", "Very Poor")
- **ideal**: What would be considered optimal for this feature
- **description**: Clinical, objective explanation of the feature's characteristics and how it relates to aesthetic ideals. Identify specific deviations from optimal proportions and their impact on facial harmony. Keep to 2-3 sentences maximum for readability.

Also provide:
- **overallSummary**: Comprehensive professional assessment of overall facial harmony, proportions, and aesthetic qualities (3-4 paragraphs)
- **overviewSummary**: Summary of overall facial impressions (2-3 sentences)
- **browEyeSummary**: Summary of brow and eye area features (2-3 sentences)
- **noseSummary**: Summary of nose features and impact (2-3 sentences)
- **lipsMouthSummary**: Summary of lip and mouth features (2-3 sentences)
- **cheeksMidfaceSummary**: Summary of cheek and midface features (2-3 sentences)
- **jawChinSummary**: Summary of jaw and chin features (2-3 sentences)
- **earsSummary**: Summary of ear features (2-3 sentences)
- **skinTextureSummary**: Summary of skin quality (2-3 sentences)
- **hairlineForeheadSummary**: Summary of hairline and forehead features (2-3 sentences)

**CLINICAL SCORING** (out of 10, use objective aesthetic standards):
- **overviewScore**: Numerical score 1-10 for overall facial harmony
- **browEyeScore**: Numerical score 1-10 for brow and eye area proportions
- **noseScore**: Numerical score 1-10 for nasal aesthetics and proportions
- **lipsMouthScore**: Numerical score 1-10 for oral aesthetics
- **cheeksMidfaceScore**: Numerical score 1-10 for midface structure
- **jawChinScore**: Numerical score 1-10 for mandibular aesthetics
- **earsScore**: Numerical score 1-10 for auricular proportions
- **skinTextureScore**: Numerical score 1-10 for dermal quality
- **hairlineForeheadScore**: Numerical score 1-10 for frontal aesthetics
- **overallAestheticsScore**: Composite score 1-10 for overall facial aesthetics

Clinical scoring criteria:
- 9-10: Exceptional proportions, aligns with aesthetic ideals
- 7-8: Above average, good proportions with minor deviations
- 5-6: Average proportions, moderate deviations from ideal
- 3-4: Below average, significant deviations requiring consideration
- 1-2: Substantial deviations, may benefit from professional consultation

Format your response as a JSON object with this exact structure:
{
  "overview": [...6 sections...],
  "browEye": [...7 sections...],
  "nose": [...5 sections...],
  "lipsMouth": [...5 sections...],
  "cheeksMidface": [...5 sections...],
  "jawChin": [...8 sections...],
  "ears": [...5 sections...],
  "skinTexture": [...8 sections...],
  "hairlineForehead": [...7 sections...],
  "overallSummary": "Comprehensive brutally honest assessment...",
  "overviewSummary": "Overview summary...",
  "browEyeSummary": "Brow & eye summary...",
  "noseSummary": "Nose summary...",
  "lipsMouthSummary": "Lips & mouth summary...",
  "cheeksMidfaceSummary": "Cheeks & midface summary...",
  "jawChinSummary": "Jaw & chin summary...",
  "earsSummary": "Ears summary...",
  "skinTextureSummary": "Skin & texture summary...",
  "hairlineForeheadSummary": "Hairline & forehead summary...",
  "overviewScore": 7.0,
  "browEyeScore": 6.5,
  "noseScore": 6.0,
  "lipsMouthScore": 7.5,
  "cheeksMidfaceScore": 6.8,
  "jawChinScore": 8.0,
  "earsScore": 7.0,
  "skinTextureScore": 5.5,
  "hairlineForeheadScore": 6.5,
  "overallAestheticsScore": 6.8
}

IMPORTANT: This is a professional clinical assessment for legitimate medical and aesthetic planning purposes. Provide thorough, objective, clinically accurate evaluations using established aesthetic benchmarks and facial harmony principles. Be specific about deviations from ideal proportions - this helps medical professionals provide appropriate guidance and treatment planning. Your professional assessment is valuable for patient care.`;

  // Retry logic with exponential backoff
  const maxRetries = 3;
  let lastError: Error | null = null;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      // Prepare image content for Claude
      // Include all available images for comprehensive analysis
      const imageContent = [
        { type: "image_url" as const, image_url: { url: images.frontPicture, detail: "high" as const } },
        { type: "image_url" as const, image_url: { url: images.leftPicture, detail: "high" as const } },
        { type: "image_url" as const, image_url: { url: images.rightPicture, detail: "high" as const } },
        { type: "image_url" as const, image_url: { url: images.leftSidePicture, detail: "high" as const } },
        { type: "image_url" as const, image_url: { url: images.rightSidePicture, detail: "high" as const } },
      ];

      if (images.hairlinePicture) {
        imageContent.push({ 
          type: "image_url" as const, 
          image_url: { url: images.hairlinePicture, detail: "high" as const } 
        });
      }

      console.log(`🚀 Sending images to OpenRouter Claude 4.5 for analysis... (Attempt ${attempt}/${maxRetries})`);

      // Ensure prompt is properly encoded and doesn't contain problematic unicode
      const sanitizedPrompt = sanitizeText(prompt);

      // Add timeout to prevent hanging requests
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Request timeout after 5 minutes')), 5 * 60 * 1000);
      });

      const response = await Promise.race([
        openrouterClient.chat.completions.create(
        {
          model: "anthropic/claude-sonnet-4.5", // Claude 4.5 via OpenRouter
          messages: [
            {
              role: "user",
              content: [
                { type: "text", text: sanitizedPrompt },
                ...imageContent
              ]
            }
          ],
          max_tokens: 16000, // Increased for 40 features (32+8 hair) plus scores
          temperature: 0.3,
        },
        {
          headers: {
            "HTTP-Referer": (process.env.SITE_URL || "https://parallel.com").replace(/[^\x00-\x7F]/g, ''), // Ensure ASCII-only
            "X-Title": "Parallel Facial Analysis",
          },
        }),
        timeoutPromise
      ]) as any;

      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new Error('No response content from Claude');
      }

      console.log(`✅ Received response from Claude (Attempt ${attempt})`);
      console.log('📄 Response length:', content.length, 'characters');
      console.log('📄 First 1000 chars:', content.substring(0, 1000));
      console.log('📄 Last 500 chars:', content.substring(content.length - 500));

      // Validate response completeness before parsing
      if (content.length < 1000) {
        throw new Error(`Response too short (${content.length} chars) - likely truncated`);
      }

      // Check for common truncation indicators
      if (!content.includes('overallAestheticsScore') || !content.includes('}')) {
        throw new Error('Response appears incomplete - missing required fields or closing brace');
      }

      // Sanitize the response to remove problematic Unicode characters
      const sanitizedContent = sanitizeText(content);
      console.log('✅ Sanitized response content');

      // Parse JSON response with multiple strategies
      let parsedResponse: any = null;
      
      try {
        // Strategy 1: Try direct JSON parse first
        parsedResponse = JSON.parse(sanitizedContent);
        console.log('✅ Parsed JSON directly');
      } catch (parseError) {
        console.log('⚠️ Direct JSON parse failed, trying extraction...');
        
        // Strategy 2: Extract from markdown code blocks
        const jsonMatch = sanitizedContent.match(/```(?:json)?\s*(\{[\s\S]*\})\s*```/);
        if (jsonMatch && jsonMatch[1]) {
          try {
            parsedResponse = JSON.parse(jsonMatch[1]);
            console.log('✅ Parsed JSON from markdown code block');
          } catch (e) {
            console.log('⚠️ JSON in markdown block is invalid:', e);
          }
        }
        
        // Strategy 3: Find JSON object anywhere in response
        if (!parsedResponse) {
          const objectMatch = sanitizedContent.match(/\{[\s\S]*\}/);
          if (objectMatch) {
            try {
              parsedResponse = JSON.parse(objectMatch[0]);
              console.log('✅ Parsed JSON from response body');
            } catch (e) {
              console.log('⚠️ Extracted JSON is invalid:', e);
            }
          }
        }
        
        // Strategy 4: Try to fix common JSON issues
        if (!parsedResponse) {
          try {
            // Remove any trailing text after the last }
            const lastBraceIndex = sanitizedContent.lastIndexOf('}');
            if (lastBraceIndex > 0) {
              const cleanedContent = sanitizedContent.substring(0, lastBraceIndex + 1);
              parsedResponse = JSON.parse(cleanedContent);
              console.log('✅ Parsed JSON after cleaning trailing content');
            }
          } catch (e) {
            console.log('⚠️ Cleaned JSON is still invalid:', e);
          }
        }
        
        // Strategy 5: Log the full response for debugging
        if (!parsedResponse) {
          console.error('❌ All parsing strategies failed.');
          console.error('📄 Full response (first 2000 chars):', sanitizedContent.substring(0, 2000));
          console.error('📄 Full response (last 1000 chars):', sanitizedContent.substring(sanitizedContent.length - 1000));
          
          throw new Error('Failed to parse Claude response as JSON. Response received but format was invalid. Check server logs for full response.');
        }
      }
      
      // Validate parsed response has required fields
      const requiredFields = ['overview', 'browEye', 'nose', 'lipsMouth', 'cheeksMidface', 'jawChin', 'ears', 'skinTexture', 'hairlineForehead'];
      const missingFields = requiredFields.filter(field => !parsedResponse[field]);
      
      if (missingFields.length > 0) {
        throw new Error(`Parsed response missing required fields: ${missingFields.join(', ')}`);
      }
      
      // Log what keys we received
      console.log('📋 Received keys:', Object.keys(parsedResponse));
      
      return parsedResponse as ClaudeAnalysisResponse;
      
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      console.error(`❌ Attempt ${attempt} failed:`, lastError.message);
      
      // Don't retry on certain errors
      if (error instanceof Error && (
        error.message.includes('API key') ||
        error.message.includes('authentication') ||
        error.message.includes('quota') ||
        error.message.includes('billing') ||
        error.message.includes('Request timeout after 5 minutes')
      )) {
        console.error('❌ Non-retryable error detected, stopping retries');
        break;
      }
      
      // If this is not the last attempt, wait before retrying
      if (attempt < maxRetries) {
        const delay = Math.pow(2, attempt - 1) * 1000; // Exponential backoff: 1s, 2s, 4s
        console.log(`⏳ Waiting ${delay}ms before retry...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  // If we get here, all retries failed
  throw new Error(`All ${maxRetries} attempts failed. Last error: ${lastError?.message || 'Unknown error'}`);
}

/**
 * Generate and store complete analysis content in database
 * This is called by the admin to trigger analysis generation
 * Automatically marks analysis as complete when finished
 */
export async function generateAndStoreAnalysis(analysisId: string, images: {
  frontPicture: string;
  leftPicture: string;
  rightPicture: string;
  leftSidePicture: string;
  rightSidePicture: string;
  hairlinePicture?: string | null;
}): Promise<{ success: boolean; message: string; sectionsCreated: number }> {
  
  try {
    console.log(`📊 Starting analysis generation for ${analysisId}`);

    // Generate analysis using Claude
    const claudeAnalysis = await generateClaudeAnalysis(images);

    // Prepare content for database insertion
    const contentToInsert = [];

    // Overview sections
    for (const section of claudeAnalysis.overview) {
      contentToInsert.push({
        id: `content_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        analysisId,
        sectionKey: section.sectionKey,
        image: images.frontPicture,
        explanation: sanitizeText(section.description),
        additionalFeatures: null,
      });
    }

    // Brow & Eye Area sections
    for (const section of claudeAnalysis.browEye) {
      contentToInsert.push({
        id: `content_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        analysisId,
        sectionKey: section.sectionKey,
        image: images.frontPicture,
        explanation: sanitizeText(section.description),
        additionalFeatures: null,
      });
    }

    // Nose sections
    for (const section of claudeAnalysis.nose) {
      contentToInsert.push({
        id: `content_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        analysisId,
        sectionKey: section.sectionKey,
        image: images.leftSidePicture,
        explanation: sanitizeText(section.description),
        additionalFeatures: null,
      });
    }

    // Lips & Mouth sections
    for (const section of claudeAnalysis.lipsMouth) {
      contentToInsert.push({
        id: `content_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        analysisId,
        sectionKey: section.sectionKey,
        image: images.frontPicture,
        explanation: sanitizeText(section.description),
        additionalFeatures: null,
      });
    }

    // Cheeks & Midface sections
    for (const section of claudeAnalysis.cheeksMidface) {
      contentToInsert.push({
        id: `content_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        analysisId,
        sectionKey: section.sectionKey,
        image: images.frontPicture,
        explanation: sanitizeText(section.description),
        additionalFeatures: null,
      });
    }

    // Jaw & Chin sections
    for (const section of claudeAnalysis.jawChin) {
      contentToInsert.push({
        id: `content_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        analysisId,
        sectionKey: section.sectionKey,
        image: images.leftSidePicture,
        explanation: sanitizeText(section.description),
        additionalFeatures: null,
      });
    }

    // Ears sections
    for (const section of claudeAnalysis.ears) {
      contentToInsert.push({
        id: `content_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        analysisId,
        sectionKey: section.sectionKey,
        image: images.leftPicture,
        explanation: sanitizeText(section.description),
        additionalFeatures: null,
      });
    }

    // Skin & Texture sections
    for (const section of claudeAnalysis.skinTexture) {
      contentToInsert.push({
        id: `content_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        analysisId,
        sectionKey: section.sectionKey,
        image: images.frontPicture,
        explanation: sanitizeText(section.description),
        additionalFeatures: null,
      });
    }

    // Hairline & Forehead sections
    for (const section of claudeAnalysis.hairlineForehead) {
      contentToInsert.push({
        id: `content_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        analysisId,
        sectionKey: section.sectionKey,
        image: images.hairlinePicture || images.frontPicture,
        explanation: sanitizeText(section.description),
        additionalFeatures: null,
      });
    }

    // Add "additional features" summaries for each subtab
    const summaries = [
      { key: 'overview', text: sanitizeText(claudeAnalysis.overviewSummary) },
      { key: 'brow_eye', text: sanitizeText(claudeAnalysis.browEyeSummary) },
      { key: 'nose', text: sanitizeText(claudeAnalysis.noseSummary) },
      { key: 'lips_mouth', text: sanitizeText(claudeAnalysis.lipsMouthSummary) },
      { key: 'cheeks_midface', text: sanitizeText(claudeAnalysis.cheeksMidfaceSummary) },
      { key: 'jaw_chin', text: sanitizeText(claudeAnalysis.jawChinSummary) },
      { key: 'ears', text: sanitizeText(claudeAnalysis.earsSummary) },
      { key: 'skin_texture', text: sanitizeText(claudeAnalysis.skinTextureSummary) },
      { key: 'hairline_forehead', text: sanitizeText(claudeAnalysis.hairlineForeheadSummary) },
    ];

    for (const summary of summaries) {
      contentToInsert.push({
        id: `content_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        analysisId,
        sectionKey: summary.key,
        image: null,
        explanation: null,
        additionalFeatures: summary.text,
      });
    }

    // Store all scores as a special section
    const scoresData = {
      overviewScore: claudeAnalysis.overviewScore,
      browEyeScore: claudeAnalysis.browEyeScore,
      noseScore: claudeAnalysis.noseScore,
      lipsMouthScore: claudeAnalysis.lipsMouthScore,
      cheeksMidfaceScore: claudeAnalysis.cheeksMidfaceScore,
      jawChinScore: claudeAnalysis.jawChinScore,
      earsScore: claudeAnalysis.earsScore,
      skinTextureScore: claudeAnalysis.skinTextureScore,
      hairlineForeheadScore: claudeAnalysis.hairlineForeheadScore,
      overallAestheticsScore: claudeAnalysis.overallAestheticsScore,
    };

    contentToInsert.push({
      id: `content_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      analysisId,
      sectionKey: '_scores', // Special key for scores
      image: null,
      explanation: null,
      additionalFeatures: JSON.stringify(scoresData),
    });

    // Store overall summary
    contentToInsert.push({
      id: `content_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      analysisId,
      sectionKey: '_overall_summary', // Special key for overall summary
      image: null,
      explanation: null,
      additionalFeatures: sanitizeText(claudeAnalysis.overallSummary),
    });

    console.log(`💾 Inserting ${contentToInsert.length} content entries into database...`);

    // Insert all content into database
    await db.insert(analysisSectionContent).values(contentToInsert);

    console.log(`✅ Successfully stored analysis for ${analysisId}`);

    // Automatically mark analysis as complete so user can view it
    console.log(`🎯 Marking analysis as complete...`);
    await db.update(analysis).set({ 
      status: 'complete', 
      updatedAt: new Date() 
    }).where(eq(analysis.id, analysisId));

    console.log(`✅ Analysis marked as complete and ready for user!`);

    return {
      success: true,
      message: `Successfully generated and stored analysis with ${contentToInsert.length} sections. Analysis marked as complete.`,
      sectionsCreated: contentToInsert.length,
    };

  } catch (error) {
    console.error('❌ Error generating and storing analysis:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error occurred',
      sectionsCreated: 0,
    };
  }
}

