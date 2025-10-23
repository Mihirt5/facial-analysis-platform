import OpenAI from 'openai';

export type MorphType = "overall" | "eyes" | "skin" | "jawline";

const PROMPTS: Record<MorphType, string> = {
  overall: `Keep the same person and identity, do not change background, hair, clothing or lighting, natural professional portrait, CRITICAL: Maintain extreme realism and natural skin texture, do not stylize, not cartoon, not plastic, not airbrushed, preserve natural skin pores, fine lines, and texture variations, keep the person's head in the exact same position, make changes noticeable while staying extremely realistic, thicker, fuller, well-shaped eyebrows, much sharper jawline and mandibular definition, balanced color grading with healthy warm undertones and even skin tone, glowing skin: smoother texture while preserving natural skin characteristics, reduced blemishes, minimized redness, pore-level clarity with realistic skin texture, refined facial proportions and symmetry, high-definition detail, photogenic, camera-ready appearance with increased contrast and crispness, enhanced jaw structure with more defined angular features, longer, darker, more prominent eyelashes while keeping them natural. ABSOLUTELY NO ROTATION: keep face in identical orientation to source image, preserve exact image orientation and composition. MAINTAIN NATURAL SKIN TEXTURE: preserve pores, fine lines, natural skin variations, avoid over-smoothing or artificial appearance`,
  
  eyes: `Keep the same person and identity, do not change background, hair, clothing or lighting, natural professional portrait, CRITICAL: Maintain extreme realism and natural skin texture, do not stylize, not cartoon, not plastic, not airbrushed, preserve natural skin pores, fine lines, and texture variations, keep the person's head in the exact same position, make changes noticeable while staying extremely realistic. Focus ONLY on eye/brow area: thicker, fuller, well-shaped eyebrows, longer, darker, more prominent eyelashes while keeping them natural, improved eye symmetry, reduced upper eyelid exposure. NO OTHER CHANGES. Maintain extreme realism and natural skin texture around eyes.`,
  
  skin: `Keep the same person and identity, do not change background, hair, clothing or lighting, natural professional portrait, CRITICAL: Maintain extreme realism and natural skin texture, do not stylize, not cartoon, not plastic, not airbrushed, preserve natural skin pores, fine lines, and texture variations, keep the person's head in the exact same position, make changes noticeable while staying extremely realistic. Focus ONLY on skin: balanced color grading with healthy warm undertones and even skin tone, glowing skin with smoother texture while preserving natural skin characteristics, reduced blemishes, minimized redness, pore-level clarity with realistic skin texture, photogenic skin that looks natural and unprocessed. NO OTHER CHANGES. MAINTAIN NATURAL SKIN TEXTURE: preserve pores, fine lines, natural skin variations, avoid over-smoothing or artificial appearance, keep skin looking human and realistic.`,
  
  jawline: `Keep the same person and identity, do not change background, hair, clothing or lighting, natural professional portrait, CRITICAL: Maintain extreme realism and natural skin texture, do not stylize, not cartoon, not plastic, not airbrushed, preserve natural skin pores, fine lines, and texture variations, keep the person's head in the exact same position, make changes noticeable while staying extremely realistic. Focus ONLY on jawline/chin: much sharper jawline and mandibular definition, enhanced jaw structure with more defined angular features, improved chin projection and contours. NO OTHER CHANGES. Maintain extreme realism and natural skin texture.`
};

export class GPT5MorphGenerator {
  private openai: OpenAI;

  constructor() {
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) throw new Error("OPENROUTER_API_KEY not set");
    
    this.openai = new OpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey,
      defaultHeaders: {
        "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
        "X-Title": "Parallel Morphs",
      },
    });
  }

  async generateSingleMorph(imageUrl: string, morphType: MorphType): Promise<string | null> {
    try {
      console.log(`[GPT5] Generating ${morphType} morph...`);
      console.log(`[GPT5] Input image URL:`, imageUrl.substring(0, 100) + "...");
      console.log(`[GPT5] Prompt:`, PROMPTS[morphType].substring(0, 100) + "...");
      
      const requestPayload = {
        model: "openai/gpt-5-image",
        messages: [{
          role: "user",
          content: [
            { type: "image_url", image_url: { url: imageUrl } },
            { type: "text", text: `Edit this image: ${PROMPTS[morphType]}` }
          ]
        }]
      };
      
      console.log(`[GPT5] Request payload:`, JSON.stringify(requestPayload, null, 2));
      
      const completion = await this.openai.chat.completions.create(requestPayload);

      console.log(`[GPT5] Response:`, JSON.stringify(completion, null, 2));
      console.log(`[GPT5] Message structure:`, JSON.stringify(completion.choices?.[0]?.message, null, 2));

      const message = completion.choices?.[0]?.message;
      
      // Try to extract image URL from response
      console.log(`[GPT5] Full message object:`, JSON.stringify(message, null, 2));
      
      // Check message.images array first (OpenRouter specific format)
      if (message?.images && Array.isArray(message.images) && message.images.length > 0) {
        const imageUrl = message.images[0]?.image_url || message.images[0]?.url;
        if (imageUrl && typeof imageUrl === 'string') {
          console.log(`[GPT5] Found image in message.images:`, imageUrl.substring(0, 100));
          return imageUrl;
        }
      }

      // Check content array
      const content = message?.content;
      if (Array.isArray(content)) {
        for (const part of content) {
          if (part?.type === 'image_url' && part?.image_url?.url) {
            console.log(`[GPT5] Found image in content array`);
            return part.image_url.url;
          }
        }
      }

      // Check if content is a direct URL string
      if (typeof content === 'string') {
        if (content.startsWith('data:image') || content.startsWith('http')) {
          console.log(`[GPT5] Found image in content string`);
          return content;
        }
      }

      // Check for other possible image fields
      if (message?.image_url) {
        console.log(`[GPT5] Found image in message.image_url`);
        return message.image_url;
      }

      if (message?.image) {
        console.log(`[GPT5] Found image in message.image`);
        return message.image;
      }

      // Deep scan the entire response for any image URLs
      const responseStr = JSON.stringify(completion);
      const urlMatch = responseStr.match(/https?:\/\/[^\s"']+\.(jpg|jpeg|png|gif|webp)/i);
      if (urlMatch) {
        console.log(`[GPT5] Found image URL via deep scan:`, urlMatch[0]);
        return urlMatch[0];
      }

      // Check for base64 data URLs
      const base64Match = responseStr.match(/data:image\/[^;]+;base64,[A-Za-z0-9+/=]+/);
      if (base64Match) {
        console.log(`[GPT5] Found base64 image via deep scan`);
        return base64Match[0];
      }

      console.error(`[GPT5] Could not extract image from response`);
      console.error(`[GPT5] Message keys:`, message ? Object.keys(message) : 'No message');
      console.error(`[GPT5] Message.images:`, message?.images);
      console.error(`[GPT5] Message.content:`, message?.content);
      console.error(`[GPT5] Full completion object keys:`, Object.keys(completion));
      return null;
    } catch (error) {
      console.error(`[GPT5] Error generating ${morphType}:`, error);
      return null;
    }
  }

  async generateAllMorphs(imageUrl: string): Promise<Record<MorphType, string | null>> {
    console.log(`[GPT5] Starting all 4 morphs for image`);
    
    const results: Record<MorphType, string | null> = {
      overall: null,
      eyes: null,
      skin: null,
      jawline: null
    };

    const types: MorphType[] = ["overall", "eyes", "skin", "jawline"];
    
    for (const type of types) {
      results[type] = await this.generateSingleMorph(imageUrl, type);
      
      // Wait 2 seconds between requests to avoid rate limits
      if (type !== "jawline") {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }

    const successCount = Object.values(results).filter(v => v !== null).length;
    console.log(`[GPT5] Completed: ${successCount}/4 morphs generated`);

    return results;
  }
}

export const gpt5MorphGenerator = new GPT5MorphGenerator();
