# Qwen Model Setup Guide

This guide explains how to set up and use the Qwen image editing model alongside nano-banana for comparison.

## Prerequisites

- Hugging Face account
- Active Hugging Face API token

## Step 1: Get Your Hugging Face API Token

1. Go to [https://huggingface.co/settings/tokens](https://huggingface.co/settings/tokens)
2. Click "New token"
3. Give it a name (e.g., "Parallel Morph API")
4. Select **Read** permissions
5. Click "Generate"
6. Copy your token

## Step 2: Add Token to Environment Variables

Add the following line to your `.env` file:

```bash
HUGGINGFACE_API_TOKEN=your_token_here
```

Replace `your_token_here` with the token you copied from Hugging Face.

## Step 3: Restart Your Development Server

```bash
# Stop the current server (Ctrl+C)
# Then restart:
pnpm dev
```

## Step 4: Access the Comparison Page

Navigate to: [http://localhost:3000/analysis/morph-test](http://localhost:3000/analysis/morph-test)

## Features

### Model Comparison Page (`/analysis/morph-test`)

- **Side-by-side comparison** of nano-banana vs Qwen results
- **Three enhancement levels** for Qwen (subtle, moderate, enhanced)
- **Before/After sliders** for both models
- **Download buttons** for each result

### API Endpoints

#### Generate Nano-Banana Morph
```typescript
api.morph.generateMorph.useMutation()
```

#### Generate Qwen Morph
```typescript
api.morph.generateQwenMorph.useMutation({
  analysisId: string,
  level?: "subtle" | "moderate" | "enhanced"
})
```

## Prompt Customization

The prompts for both models are defined in their respective processor files:

- **Nano-Banana**: `src/lib/nanobanana-morph-processor.ts`
- **Qwen**: `src/lib/qwen-inference-processor.ts`

Both include instructions for:
- ✅ Thicker eyebrows
- ✅ Sharper jawline
- ✅ Enhanced jaw structure
- ✅ Longer, darker eyelashes
- ✅ Better skin tone and texture
- ✅ Orientation preservation

## Important Notes

### First Request Latency
The first Qwen request may take **30-60 seconds** as the model "warms up" on Hugging Face's servers. Subsequent requests are faster.

### Rate Limits
Hugging Face Inference API has rate limits based on your account tier:
- **Free tier**: ~30 requests per minute
- **Pro tier**: Higher limits

### Model Availability
If the Qwen model is not available via Inference API, you'll see an error. Alternative options:
1. Use Hugging Face Spaces
2. Deploy your own Python server (see Option 1 in original plan)
3. Use a different model on Replicate

## Troubleshooting

### Error: "HUGGINGFACE_API_TOKEN is not set"
- Make sure you've added the token to your `.env` file
- Restart your development server after adding the token

### Error: "Model is loading" or "Model not found"
- The Qwen model may not be available via Inference API
- Wait a few minutes and try again
- Consider deploying your own server (see Alternative Approaches below)

### Error: "Rate limit exceeded"
- You've hit Hugging Face's rate limit
- Wait a few minutes before trying again
- Consider upgrading your Hugging Face account

## Alternative Approaches

If Hugging Face Inference API doesn't work well, you have these options:

### Option A: Deploy Python Server
Deploy the Python API server to:
- **Railway** (easiest, GPU support)
- **Render** (free tier available)
- **Google Cloud Run** (requires Docker)

### Option B: Use Replicate
Upload the Qwen model to Replicate and use it like nano-banana.

### Option C: Local Development
Run the Python server locally:
```bash
pip install torch diffusers fastapi uvicorn pillow requests
python huggingface_api.py
```

## Switching Default Model

To switch from nano-banana to Qwen as the default:

1. Update `src/app/analysis/morph/page.tsx`
2. Replace `api.morph.generateMorph` with `api.morph.generateQwenMorph`
3. Add level selection UI if desired

## Cost Comparison

| Service | Free Tier | Paid Tier |
|---------|-----------|-----------|
| Replicate (nano-banana) | No | ~$0.0023/sec |
| Hugging Face Inference | ~30 req/min | Pro: $9/month |
| Own Python Server | N/A | Server cost only |

## Support

For issues or questions:
1. Check the browser console for errors
2. Check the server logs
3. Verify your API token is correct
4. Ensure the analysis is complete before generating morphs




