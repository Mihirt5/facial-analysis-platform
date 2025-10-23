import { type FacialAnalysis } from "./mediapipe-client";

export type QwenLevel = "subtle" | "moderate" | "enhanced";

export interface QwenMorphResult {
  originalImageUrl: string;
  morphImageUrl: string;
  processingTime: number;
  prompt: string;
  confidence: number;
  level: QwenLevel;
  method: "qwen-inference-api";
}

function promptByLevel(level: QwenLevel): string {
  const common = [
    "Keep the same person and identity",
    "do not change background, hair, clothing or lighting",
    "natural professional portrait, realistic skin texture",
    "do not stylize, not cartoon, not plastic",
    "CRITICAL: maintain exact same orientation as input image",
    "do not rotate, flip, or change the angle of the face",
    "keep the person's head in the exact same position",
    "preserve the original image orientation completely",
  ];

  if (level === "enhanced") {
    return [
      ...common,
      "make changes SUPER noticeable while staying realistic",
      "thicker, fuller, well-shaped eyebrows",
      "much sharper jawline and mandibular definition",
      "enhanced jaw structure with more defined angular features",
      "longer, darker, more prominent eyelashes while keeping them natural",
      "balanced color grading with healthy warm undertones and even skin tone",
      "glowing skin: smoother texture, reduced blemishes, minimized redness, pore-level clarity",
      "refined facial proportions and symmetry, high-definition detail",
      "photogenic, camera-ready appearance with increased contrast and crispness",
      "ABSOLUTELY NO ROTATION: keep face in identical orientation to source image",
    ].join(", ");
  }
  
  if (level === "moderate") {
    return [
      ...common,
      "balanced but visible facial refinement",
      "defined jawline, fuller eyebrows",
      "improved skin tone and texture",
      "subtle enhancement of facial features",
    ].join(", ");
  }
  
  return [
    ...common,
    "very subtle facial enhancement",
    "minimal changes to preserve natural appearance",
  ].join(", ");
}

export class QwenInferenceProcessor {
  private apiToken: string;
  private baseUrl = "https://api-inference.huggingface.co/models";

  constructor() {
    this.apiToken = process.env.HUGGINGFACE_API_TOKEN || "";
    if (!this.apiToken) {
      throw new Error("HUGGINGFACE_API_TOKEN is not set in environment variables");
    }
  }

  async generateMorph(
    imageUrl: string,
    analysis: FacialAnalysis,
    level: QwenLevel = "enhanced"
  ): Promise<QwenMorphResult> {
    const startTime = Date.now();
    const prompt = promptByLevel(level);

    try {
      // Download the input image
      const imageResponse = await fetch(imageUrl);
      if (!imageResponse.ok) {
        throw new Error(`Failed to fetch image: ${imageResponse.statusText}`);
      }
      
      const imageBuffer = await imageResponse.arrayBuffer();
      
      // Convert to base64
      const base64Image = Buffer.from(imageBuffer).toString('base64');
      
      // Call Hugging Face Inference API
      const response = await fetch(
        `${this.baseUrl}/Qwen/Qwen-Image-Edit-2509`,
        {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${this.apiToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            inputs: {
              image: `data:image/jpeg;base64,${base64Image}`,
              prompt: prompt,
              true_cfg_scale: 4.0,
              negative_prompt: "blurry, low quality, distorted, rotated, flipped, sideways",
              num_inference_steps: 40,
              guidance_scale: 1.0,
              num_images_per_prompt: 1,
            }
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Hugging Face API error: ${response.status} - ${errorText}`);
      }

      const result = await response.blob();
      
      // Convert result to base64 URL
      const arrayBuffer = await result.arrayBuffer();
      const base64Result = Buffer.from(arrayBuffer).toString('base64');
      const resultUrl = `data:image/png;base64,${base64Result}`;
      
      return {
        originalImageUrl: imageUrl,
        morphImageUrl: resultUrl,
        prompt,
        confidence: this.calculateConfidence(level),
        level,
        processingTime: Date.now() - startTime,
        method: "qwen-inference-api",
      };
    } catch (error) {
      console.error("Qwen Inference API error:", error);
      throw error;
    }
  }

  async generateMorphVariations(
    imageUrl: string,
    analysis: FacialAnalysis,
  ): Promise<{
    subtle: QwenMorphResult;
    moderate: QwenMorphResult;
    enhanced: QwenMorphResult;
  }> {
    // Generate all three variations
    const [subtle, moderate, enhanced] = await Promise.all([
      this.generateMorph(imageUrl, analysis, "subtle"),
      this.generateMorph(imageUrl, analysis, "moderate"),
      this.generateMorph(imageUrl, analysis, "enhanced"),
    ]);

    return { subtle, moderate, enhanced };
  }

  private calculateConfidence(level: QwenLevel): number {
    switch (level) {
      case "subtle": return 0.9;
      case "moderate": return 0.85;
      case "enhanced": return 0.8;
      default: return 0.8;
    }
  }
}

export const qwenInferenceProcessor = new QwenInferenceProcessor();




