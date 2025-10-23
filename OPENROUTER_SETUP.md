# OpenRouter Claude 4.5 Integration Guide

This guide explains how to set up and use OpenRouter with Claude 4.5 for advanced facial image analysis.

## Overview

The integration uses [OpenRouter](https://openrouter.ai/docs/quickstart) to access Claude 4.5's advanced vision capabilities for facial analysis. This provides:

- **Superior AI Vision**: Claude 4.5's state-of-the-art image understanding
- **Natural Language Analysis**: Detailed, human-readable facial feature descriptions
- **Comprehensive Coverage**: Analysis of all facial features including skin quality
- **Flexible Switching**: Toggle between traditional MediaPipe and Claude analysis

## Setup Instructions

### 1. Get Your OpenRouter API Key

1. Go to [OpenRouter.ai](https://openrouter.ai)
2. Sign up for an account
3. Navigate to the [API Keys](https://openrouter.ai/keys) section
4. Click "Create Key"
5. Copy your new API key

### 2. Configure Environment Variables

Add these variables to your `.env.local` file:

```bash
# OpenRouter API Key (Required)
OPENROUTER_API_KEY=your_openrouter_api_key_here

# Site URL for OpenRouter attribution (Optional but recommended)
SITE_URL=https://your-site-url.com

# Enable OpenRouter Claude analysis (set to 'true' to use Claude)
NEXT_PUBLIC_USE_OPENROUTER=true
```

### 3. Install Dependencies

The integration uses the existing OpenAI SDK (already installed):

```bash
# Already in your package.json
"openai": "^6.0.1"
```

## Usage

### Enable Claude Analysis

Set the environment variable to enable Claude-powered analysis:

```bash
NEXT_PUBLIC_USE_OPENROUTER=true
```

### Disable Claude Analysis (Use Traditional MediaPipe)

To use the traditional MediaPipe analysis:

```bash
NEXT_PUBLIC_USE_OPENROUTER=false
```

Or simply remove/comment out the `NEXT_PUBLIC_USE_OPENROUTER` variable.

## How It Works

### 1. OpenRouter Service (`src/lib/openrouter-image-analysis.ts`)

- Configures OpenAI SDK to use OpenRouter endpoint
- Sends facial images to Claude 4.5 via OpenRouter
- Receives comprehensive JSON analysis
- Converts results to match existing analysis format

### 2. API Route (`src/app/api/analyze-image/route.ts`)

- Handles image analysis requests
- Validates OpenRouter API key
- Calls Claude via OpenRouter
- Returns formatted results

### 3. Analysis Component Integration

The `simple-analysis-inline.tsx` component automatically detects which analysis method to use based on the `NEXT_PUBLIC_USE_OPENROUTER` environment variable.

## Features Analyzed by Claude

### Eye Area
- **Canthal Tilt**: Angle between inner and outer eye corners
- **Upper Eyelid Exposure**: Visibility of upper eyelid
- **Eye Spacing & Symmetry**: Distance and alignment
- **Periorbital Support**: Bone structure around eye socket

### Nose
- **Dorsal Profile**: Side view of nose bridge
- **Tip Rotation**: Angle and position of nasal tip
- **Nostril Exposure**: Visibility and symmetry
- **Skin Thickness**: Nasal skin definition

### Jaw
- **Chin Projection**: Forward prominence
- **Gonial Angle**: Angle near ear
- **Jawline Definition**: Clarity and sharpness
- **Lower Third Prominence**: Proportion of lower face

### Skin
- **Elasticity**: Stretch and return ability
- **Damage**: Sun damage, pigmentation signs
- **Hydration and Texture**: Moisture balance, smoothness
- **Fine Lines**: Early wrinkles and skin quality

## Response Format

Claude returns a structured JSON response:

```json
{
  "results": [
    {
      "feature": "Canthal Tilt",
      "measurement": "5 degrees",
      "status": "perfect",
      "rating": "Excellent",
      "ideal": "0-10 degrees",
      "description": "Detailed analysis of this feature..."
    }
  ],
  "overallSummary": "Comprehensive facial harmony assessment...",
  "strengths": ["Feature 1", "Feature 2", "Feature 3"],
  "concerns": ["Area 1", "Area 2"]
}
```

## Cost Considerations

- OpenRouter charges per API call based on the model used
- Claude 4.5 pricing: ~$3-5 per 1M input tokens, ~$15 per 1M output tokens
- Each image analysis uses approximately 1000-2000 tokens
- Monitor your usage on the [OpenRouter dashboard](https://openrouter.ai/activity)

## Troubleshooting

### "OpenRouter API key not configured"
- Ensure `OPENROUTER_API_KEY` is set in your `.env.local`
- Restart your development server after adding the key

### "Failed to analyze image"
- Check that the image URL is publicly accessible
- Verify your OpenRouter account has credits
- Check the console for detailed error messages

### Analysis not using Claude
- Ensure `NEXT_PUBLIC_USE_OPENROUTER=true` is set
- Restart your Next.js development server
- Clear your browser cache

## API Reference

### OpenRouter Documentation

- [Quickstart Guide](https://openrouter.ai/docs/quickstart)
- [API Reference](https://openrouter.ai/docs)
- [Model List](https://openrouter.ai/docs/models)

### Model Information

- **Model ID**: `anthropic/claude-3.5-sonnet`
- **Context Window**: 200K tokens
- **Max Output**: 4096 tokens
- **Vision Support**: Yes (high detail)

## Comparison: Claude vs Traditional Analysis

### Claude 4.5 Advantages:
✅ Natural language descriptions
✅ Contextual understanding
✅ Skin quality analysis
✅ Holistic facial harmony assessment
✅ No landmark detection required

### Traditional MediaPipe Advantages:
✅ Precise numerical measurements
✅ Landmark visualization overlays
✅ No API costs
✅ Faster processing
✅ Works offline

## Next Steps

1. **Get API Key**: Sign up at [OpenRouter.ai](https://openrouter.ai)
2. **Add to .env.local**: Configure your environment variables
3. **Enable Feature**: Set `NEXT_PUBLIC_USE_OPENROUTER=true`
4. **Test**: Upload an image and see Claude's analysis
5. **Monitor**: Check usage and costs on OpenRouter dashboard

## Support

- **OpenRouter Support**: [Discord](https://discord.gg/openrouter)
- **Documentation**: [openrouter.ai/docs](https://openrouter.ai/docs)
- **API Status**: [status.openrouter.ai](https://status.openrouter.ai)

