# Morph Model Comparison Setup - Complete ✅

## What Was Built

A complete side-by-side comparison system for testing **nano-banana** (Replicate) vs **Qwen** (Hugging Face) image enhancement models.

## Files Created/Modified

### New Files
1. **`src/lib/qwen-inference-processor.ts`** - Qwen processor using Hugging Face Inference API
2. **`src/app/analysis/morph-test/page.tsx`** - Dedicated comparison UI page
3. **`QWEN_SETUP.md`** - Complete setup guide for Qwen
4. **`MORPH_COMPARISON_SUMMARY.md`** - This file

### Modified Files
1. **`src/server/api/routers/morph.ts`** - Added `generateQwenMorph` endpoint

## Quick Start

### 1. Get Hugging Face Token
```bash
# Visit: https://huggingface.co/settings/tokens
# Create a new token with "Read" permissions
```

### 2. Add to Environment
```bash
# Add to your .env file:
HUGGINGFACE_API_TOKEN=hf_xxxxxxxxxxxxx
```

### 3. Restart Server
```bash
# Stop current server (Ctrl+C)
pnpm dev
```

### 4. Access Comparison Page
```
http://localhost:3000/analysis/morph-test
```

## Features

### Comparison Page
- ✅ Side-by-side nano-banana vs Qwen results
- ✅ Interactive before/after sliders for both
- ✅ Three enhancement levels for Qwen (subtle, moderate, enhanced)
- ✅ Download buttons for each result
- ✅ Live generation status
- ✅ Processing time display

### Prompts (Both Models)
Both models use the same enhanced prompt:
- Thicker, fuller eyebrows
- Much sharper jawline
- Enhanced jaw structure
- Longer, darker eyelashes
- Better skin tone and texture
- Orientation preservation instructions

## API Usage

### Nano-Banana (Existing)
```typescript
const result = await api.morph.generateMorph.mutateAsync({
  analysisId: "analysis_id_here"
});
```

### Qwen (New)
```typescript
const result = await api.morph.generateQwenMorph.mutateAsync({
  analysisId: "analysis_id_here",
  level: "enhanced" // or "subtle", "moderate"
});
```

## Architecture

```
Frontend (Next.js)
    │
    ├── /analysis/morph (Production - nano-banana only)
    │
    └── /analysis/morph-test (Testing - both models)
            │
            ├── Nano-Banana → Replicate API → google/nano-banana
            │
            └── Qwen → Hugging Face Inference API → Qwen/Qwen-Image-Edit-2509
```

## Model Comparison

| Feature | Nano-Banana | Qwen |
|---------|-------------|------|
| **Provider** | Replicate | Hugging Face |
| **Speed** | Fast (~10-20s) | Varies (30-60s first request) |
| **Cost** | ~$0.0023/sec | Free tier: ~30 req/min |
| **Orientation Issue** | Sometimes flips | Unknown (needs testing) |
| **Customization** | Limited | High (multiple levels) |
| **Reliability** | High | Depends on HF availability |

## Testing Workflow

1. **Upload Analysis Photos**
   - Go to `/create-analysis`
   - Upload front profile photo
   - Wait for analysis to complete

2. **Generate Comparisons**
   - Go to `/analysis/morph-test`
   - Click "Generate Nano-Banana"
   - Select enhancement level
   - Click "Generate Qwen"

3. **Compare Results**
   - Use sliders to compare before/after
   - Check for orientation issues
   - Evaluate enhancement quality
   - Download preferred result

4. **Iterate on Prompts**
   - Edit `src/lib/qwen-inference-processor.ts` (Qwen)
   - Edit `src/lib/nanobanana-morph-processor.ts` (nano-banana)
   - Restart server
   - Test again

## Next Steps

### If Qwen Works Better
1. Update `/analysis/morph` page to use Qwen
2. Remove or keep nano-banana as fallback
3. Add level selector to production UI

### If Nano-Banana Works Better
1. Keep using nano-banana
2. Delete Qwen files or keep for reference
3. Focus on fixing orientation issue

### If Both Have Issues
1. Try other models on Replicate
2. Deploy custom Python server for Qwen
3. Explore InstantID, Fooocus, or GFPGAN

## Troubleshooting

### "HUGGINGFACE_API_TOKEN is not set"
- Add token to `.env`
- Restart server

### "Model is loading"
- First request can take 30-60 seconds
- Be patient, model is warming up

### "Rate limit exceeded"
- Wait a few minutes
- Consider upgrading HF account

### Both models flip image
- Add image orientation detection
- Pre-process with EXIF rotation
- Use different models

## Cost Estimates

**Monthly Usage (100 users, 1 morph each)**
- Nano-Banana: ~$5-10/month
- Qwen (Free): $0
- Qwen (Pro): $9/month + server costs

## Documentation

- Full setup guide: `QWEN_SETUP.md`
- Code: `src/lib/qwen-inference-processor.ts`
- Test page: `src/app/analysis/morph-test/page.tsx`
- API: `src/server/api/routers/morph.ts`

---

**Status**: ✅ Ready to test
**Type Errors**: ✅ None
**Build**: ✅ Passing




