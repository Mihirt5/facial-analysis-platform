import OpenAI from 'openai';

export interface RecommendationItem {
  title: string;
  category: string; // "Dermatological", "Cosmetic", "Lifestyle"
  recommendationLevel: string; // "#1", "#2", "#3"
  riskLevel: string; // "Low", "Medium", "High"
  maintenance: string; // "Daily", "Weekly", "Monthly"
  whyRecommendation: string; // Personalized explanation
  products: string[]; // Product names only
}

export interface RecommendationAnalysis {
  aestheticsScore: number; // 0-100
  detectedConditions: string[]; // e.g., ["sparse_eyebrows", "skin_tone_issues", "thinning_hair"]
  overallAnalysis: string; // General observations
  eyes: RecommendationItem[];
  skin: RecommendationItem[];
  hair: RecommendationItem[];
  jawline: RecommendationItem[];
}

const ANALYSIS_PROMPT = `You are an expert aesthetic analyst and medical treatment advisor. Analyze these facial photos and provide comprehensive treatment recommendations.

Photos provided:
1. Front photo (main frontal view)
2. Hairline photo (top/hairline view)
3. Right side profile

Analyze and return a JSON object with:
{
  "aestheticsScore": <number 0-100>,
  "detectedConditions": [<array of specific conditions like "sparse_eyebrows", "acne_scars", "receding_hairline", "weak_jawline", "skin_tone_issues", "sparse_lashes", "pattern_hair_loss", "facial_fat", "skin_texture_issues">],
  "overallAnalysis": "<brief 2-3 sentence summary>",
  "eyesRecommendations": [<array of recommendation objects with title, category, recommendationLevel, riskLevel, maintenance, whyRecommendation, products>],
  "skinRecommendations": [<array of recommendation objects with title, category, recommendationLevel, riskLevel, maintenance, whyRecommendation, products>],
  "hairRecommendations": [<array of recommendation objects with title, category, recommendationLevel, riskLevel, maintenance, whyRecommendation, products>],
  "jawlineRecommendations": [<array of recommendation objects with title, category, recommendationLevel, riskLevel, maintenance, whyRecommendation, products>]
}

For each recommendation object, include:
- "title": "<descriptive treatment name>"
- "category": "<Dermatological|Cosmetic|Medical|Hormonal & Metabolic>"
- "recommendationLevel": "<#1|#2|#3>"
- "riskLevel": "<Low|Medium|High>"
- "maintenance": "<Daily|Weekly|Monthly>"
- "whyRecommendation": "<detailed, actionable description with specific instructions, dosages, timing, and safety warnings>"
- "products": [<array of specific product names from available inventory>]

AVAILABLE PRODUCTS:
- Eyes: ["Latisse", "GHK-Cu"]
- Skin: ["Tretinoin 0.025%", "Azelaic Acid 15% (topical)", "GHK-Cu", "BPC-157"]
- Hair: ["Topical Minoxidil", "Oral Dutasteride", "RU 58841 Topical"]
- Jawline: ["Retatrutide", "TRT", "Enclomiphene"]

IMPORTANT: For "whyRecommendation", write detailed, actionable descriptions like:
"Incorporate Tretinoin 0.025% into your skincare regimen to target acne and improve skin texture. Start with 2-3 times per week at night, gradually increasing to daily use as your skin adjusts. Apply a pea-sized amount to clean, dry skin, avoiding the eye area. Use sunscreen daily as tretinoin increases sun sensitivity. Discontinue if severe irritation occurs."

"Apply Topical Minoxidil 5% twice daily to help preserve your hairline and promote regrowth. Apply 1ml to the scalp in the morning and evening, focusing on the hairline and crown areas. Massage gently and allow to dry completely. Results typically appear within 3-6 months. Continue treatment as stopping may cause hair loss to resume."

Include specific dosages, application instructions, timing, expected results, and safety warnings.

SCORING GUIDELINES:
- 80-100: Exceptional features, minimal improvement needed
- 70-79: Above average, some enhancement opportunities  
- 60-69: Good baseline, moderate improvement potential
- 50-59: Average, several enhancement areas
- 40-49: Below average, significant improvement potential
- 30-39: Poor, major enhancement needed
- 0-29: Very poor, extensive treatment required

Be generous with scoring - most people should score 60-80. Only use very low scores (below 50) for significant issues.`;

// Only products we actually sell - updated to match current inventory
const AVAILABLE_PRODUCTS = {
  eyes: ["Latisse", "GHK-Cu"],
  skin: ["Tretinoin 0.025%", "Azelaic Acid 15% (topical)", "GHK-Cu", "BPC-157"],
  hair: ["Topical Minoxidil", "Oral Dutasteride", "RU 58841 Topical"],
  jawline: ["Retatrutide", "TRT", "Enclomiphene"],
};

const RECOMMENDATION_TEMPLATES = {
  eyes: {
    sparse_brows: {
      title: "Eyebrow Enhancement",
      category: "Cosmetic",
      products: ["Latisse"],
    },
    thin_brows: {
      title: "Eyebrow Thickening", 
      category: "Cosmetic",
      products: ["Latisse"],
    },
    uneven_brows: {
      title: "Eyebrow Shaping",
      category: "Cosmetic",
      products: ["Latisse"],
    },
    sparse_lashes: {
      title: "Eyelash Enhancement",
      category: "Cosmetic",
      products: ["Latisse"],
    },
  },
  skin: {
    acne: {
      title: "Acne Treatment",
      category: "Dermatological",
      products: ["Tretinoin 0.025%", "Azelaic Acid 15% (topical)"],
    },
    texture: {
      title: "Skin Texture Improvement",
      category: "Dermatological",
      products: ["Tretinoin 0.025%", "GHK-Cu", "BPC-157"],
    },
    hyperpigmentation: {
      title: "Hyperpigmentation Treatment",
      category: "Dermatological",
      products: ["Azelaic Acid 15% (topical)", "Tretinoin 0.025%"],
    },
    aging: {
      title: "Anti-Aging Treatment",
      category: "Dermatological",
      products: ["Tretinoin 0.025%", "GHK-Cu", "BPC-157"],
    },
    inflammation: {
      title: "Inflammation Reduction",
      category: "Dermatological",
      products: ["BPC-157", "Azelaic Acid 15% (topical)"],
    },
    uneven_tone: {
      title: "Skin Tone Improvement",
      category: "Dermatological",
      products: ["Azelaic Acid 15% (topical)", "Tretinoin 0.025%"],
    },
  },
  hair: {
    thinning: {
      title: "Hair Density Optimization",
      category: "Dermatological",
      products: ["Topical Minoxidil", "Oral Dutasteride"],
    },
    receding: {
      title: "Hairline Restoration",
      category: "Dermatological",
      products: ["Topical Minoxidil", "Oral Dutasteride", "RU 58841 Topical"],
    },
    pattern_loss: {
      title: "Male Pattern Hair Loss Treatment",
      category: "Dermatological",
      products: ["Oral Dutasteride", "Topical Minoxidil"],
    },
  },
  jawline: {
    definition: {
      title: "Jawline Definition",
      category: "Hormonal & Metabolic",
      products: ["Retatrutide", "TRT"],
    },
    fat_reduction: {
      title: "Facial Fat Reduction",
      category: "Hormonal & Metabolic",
      products: ["Retatrutide", "TRT"],
    },
    muscle_definition: {
      title: "Facial Muscle Enhancement",
      category: "Hormonal & Metabolic",
      products: ["TRT", "Enclomiphene"],
    },
  },
};

export class GPT5RecommendationGenerator {
  private openai: OpenAI;

  constructor() {
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) throw new Error("OPENROUTER_API_KEY not set");
    
    this.openai = new OpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey,
      defaultHeaders: {
        "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
        "X-Title": "Parallel Recommendations",
      },
    });
  }

  async analyzePhotos(
    frontPhotoUrl: string,
    hairlinePhotoUrl: string,
    rightSidePhotoUrl: string
  ): Promise<RecommendationAnalysis> {
    console.log(`[GPT-5 Image Mini] Starting photo analysis...`);
    console.log(`[GPT-5 Image Mini] Photo URLs:`, { frontPhotoUrl, hairlinePhotoUrl, rightSidePhotoUrl });

    // Validate photo URLs
    if (!frontPhotoUrl || !hairlinePhotoUrl || !rightSidePhotoUrl) {
      throw new Error("Missing required photo URLs");
    }

    try {
      console.log(`[GPT-5 Image Mini] Making API call to OpenRouter...`);
      const completion = await this.openai.chat.completions.create({
        model: "openai/gpt-5-image-mini",
        messages: [{
          role: "user",
          content: [
            { type: "text", text: ANALYSIS_PROMPT },
            { type: "image_url", image_url: { url: frontPhotoUrl } },
            { type: "image_url", image_url: { url: hairlinePhotoUrl } },
            { type: "image_url", image_url: { url: rightSidePhotoUrl } },
          ]
        }],
        response_format: { type: "json_object" }
      });

      console.log(`[GPT-5 Image Mini] API call completed successfully`);

      const response = completion.choices?.[0]?.message?.content;
      if (!response) {
        console.error(`[GPT-5 Image Mini] No response content from API`);
        console.error(`[GPT-5 Image Mini] Completion object:`, completion);
        throw new Error("No response from GPT-5 Image Mini");
      }

      console.log(`[GPT-5 Image Mini] Raw response:`, response);
      
      let analysis;
      try {
        analysis = JSON.parse(response);
      } catch (parseError) {
        console.error(`[GPT-5 Image Mini] Failed to parse JSON response:`, parseError);
        console.error(`[GPT-5 Image Mini] Raw response that failed to parse:`, response);
        throw new Error(`Failed to parse GPT-5 Image Mini response: ${parseError instanceof Error ? parseError.message : "Unknown parse error"}`);
      }

      console.log(`[GPT-5 Image Mini] Parsed analysis:`, analysis);
      console.log(`[GPT-5 Image Mini] Analysis complete. Score: ${analysis.aestheticsScore}`);

      // Generate personalized recommendations based on detected issues
      const recommendations = this.generateRecommendations(analysis);

      return recommendations;
    } catch (error) {
      console.error(`[GPT-5 Image Mini] Analysis error:`, error);
      console.error(`[GPT-5 Image Mini] Error type:`, typeof error);
      console.error(`[GPT-5 Image Mini] Error message:`, error instanceof Error ? error.message : "Unknown error");
      console.error(`[GPT-5 Image Mini] Error stack:`, error instanceof Error ? error.stack : "No stack trace");
      throw error;
    }
  }

  private generateRecommendations(analysis: any): RecommendationAnalysis {
    const result: RecommendationAnalysis = {
      aestheticsScore: analysis.aestheticsScore,
      detectedConditions: analysis.detectedConditions,
      overallAnalysis: analysis.overallAnalysis,
      eyes: analysis.eyesRecommendations || [],
      skin: analysis.skinRecommendations || [],
      hair: analysis.hairRecommendations || [],
      jawline: analysis.jawlineRecommendations || [],
    };

    return result;
  }


}

export const gpt5RecommendationGenerator = new GPT5RecommendationGenerator();
