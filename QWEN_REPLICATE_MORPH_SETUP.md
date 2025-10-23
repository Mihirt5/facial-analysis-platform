# Qwen Image Edit Plus Integration via Replicate

## Overview
The morph generation system now uses **Qwen Image Edit Plus** (Qwen/Qwen-Image-Edit-2509) via the **Replicate API**. This is the official Qwen image editing model that generates properly oriented images.

## Why Replicate + Qwen?
1. **Correct Orientation**: Qwen's official model generates images with proper orientation (matching what works on their website)
2. **High Quality**: Professional image editing model specifically designed for facial transformations
3. **Reliable API**: Replicate provides a stable, well-documented API with polling support
4. **Same Results**: Uses the exact same model that works correctly on Qwen's website

## API Configuration

### Required Environment Variable
```bash
REPLICATE_API_TOKEN=r8_your_token_here
```

You already have this configured in your `.env` file.

### Get a Replicate API Token
1. Go to https://replicate.com/account/api-tokens
2. Create a new token
3. Add it to your `.env` or `.env.local` file

## Technical Details

### Model
- **Name**: `Qwen/Qwen-Image-Edit-2509`
- **Type**: Image-to-image editing with text prompts
- **Platform**: Replicate
- **API Docs**: https://replicate.com/qwen/qwen-image-edit-plus

### Parameters Used
```javascript
{
  image: originalImageUrl,
  prompt: prompt,
  true_cfg_scale: 4.0,
  negative_prompt: " ",
  num_inference_steps: 40,
  guidance_scale: 1.0,
  num_images_per_prompt: 1,
}
```

### Processing Flow
1. **Create Prediction**: POST to `/v1/predictions` with image URL and prompt
2. **Poll for Completion**: Check prediction status every 2 seconds (max 2 minutes)
3. **Retrieve Output**: Get the generated image URL from the successful prediction
4. **Store Result**: Save the URL in the database

## Prompts

All prompts emphasize **NO ROTATION** and **MAINTAIN EXACT CAMERA ORIENTATION**:

### Overall Morph
Keep same person and identity. MAINTAIN EXACT CAMERA ORIENTATION and FRAMING. ABSOLUTELY NO IMAGE ROTATION or head pose change. Make noticeable improvements: thicker eyebrows, sharper jawline, healthier skin tone, reduced blemishes, refined proportions, enhanced jaw definition, natural eyelashes.

### Eyes Morph
Focus only on eye/brow area: reduce upper eyelid exposure for deep-set gaze, improve canthal tilt, thicken brows naturally, improve symmetry, minimize under-eye issues. NO rotation.

### Skin Morph
Focus only on skin: healthy even tone, smooth texture with natural pores, reduce blemishes and redness, minimize fine lines, subtle clarity and glow. NO rotation.

### Jawline Morph
Focus only on jawline/chin: sharpen jawline with defined contours, improve chin projection, balance jaw symmetry, enhance mandibular definition. NO rotation.

### Hair Morph
Uses the existing morph from the user's analysis.

## File Structure

```
src/lib/qwen-replicate-morph-generator.ts  # Main morph generation logic
src/server/api/routers/morph.ts            # tRPC routes for morph generation
src/app/review/[analysis_id]/              # Admin button to generate morphs
```

## Usage

### Admin Panel
1. Go to `/review/orders`
2. Select analyses to process
3. Click "Process Selected" - this will:
   - Generate Claude 4.5 analysis
   - Generate 5 different morphs using Qwen Image Edit Plus
   - Store results in the database
   - Mark analysis as complete

### Processing Time
- **Per morph**: ~20-40 seconds
- **Total for 5 morphs**: ~2-4 minutes
- **Timeout**: 2 minutes per morph (configurable)

## Error Handling

The system handles:
- API failures
- Timeout after 2 minutes
- Failed predictions
- Network errors

All errors are logged with the `[Replicate/Qwen]` prefix for easy debugging.

## Cost Considerations

Replicate pricing for Qwen Image Edit Plus:
- Check current pricing at: https://replicate.com/qwen/qwen-image-edit-plus
- Typically charged per prediction
- Cost-effective for the quality of results

## Previous Implementations

1. **AIMLAPI** - Had orientation issues (images rotated 90°)
2. **Nano Banana** - Had similar orientation issues
3. **Qwen Replicate** (Current) - Correct orientation, matches website behavior

## Troubleshooting

### Images Still Sideways?
- This shouldn't happen with the official Qwen model
- If it does, regenerate the morphs from the admin panel
- Check that you're using the correct Replicate API token

### Model Loading?
- Replicate models may need to "warm up" (cold start)
- The system will wait up to 2 minutes
- Retry if you get a loading error

### Prediction Failed?
- Check your Replicate API token is valid
- Ensure the image URL is publicly accessible
- Review server logs for detailed error messages

## Next Steps

To generate morphs with correct orientation:
1. Your Replicate API token is already configured ✓
2. The Next.js cache has been cleared
3. Restart your dev server: `pnpm dev`
4. Test by processing an analysis from `/review/orders`

The morphs should now generate with proper orientation, matching what you see on Qwen's website! 🎉

