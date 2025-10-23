# AIMLAPI Morph Generation - Usage Guide

## ✅ Setup Complete

The TRPC routes for AIMLAPI morph generation have been created and are ready to use!

## 🔧 Prerequisites

Add to your `.env` file:
```bash
AIMLAPI_KEY=46a5bdafe3bf461fb62aadd7961ce56e
```

## 📡 Available TRPC Routes

### 1. Generate Single Morph

Generate a specific morph type for an analysis:

```typescript
const { mutate } = api.morph.generateGlowUpMorph.useMutation();

mutate({
  analysisId: "analysis_123",
  morphType: "eyes" // "overall" | "eyes" | "skin" | "jawline" | "hair"
});
```

**Response:**
```typescript
{
  success: true,
  morphType: "eyes",
  morphUrl: "https://...",
  message: "eyes morph generated successfully"
}
```

### 2. Get All Glow-Up Morphs

Retrieve all generated morphs for an analysis:

```typescript
const { data } = api.morph.getGlowUpMorphs.useQuery({
  analysisId: "analysis_123"
});

// Returns:
// {
//   overall: "https://..." | null,
//   eyes: "https://..." | null,
//   skin: "https://..." | null,
//   jawline: "https://..." | null,
//   hair: "https://..." | null,
//   lastUpdate: "2025-01-01T00:00:00.000Z" | null
// }
```

### 3. Generate All Morphs at Once

Generate all 5 morph types in sequence:

```typescript
const { mutate } = api.morph.generateAllGlowUpMorphs.useMutation();

mutate({
  analysisId: "analysis_123"
});
```

**Response:**
```typescript
{
  success: true,
  morphs: {
    overall: "https://...",
    eyes: "https://...",
    skin: "https://...",
    jawline: "https://...",
    hair: "https://..."
  },
  errors: {},
  message: "Generated 5 out of 5 morphs"
}
```

## 💾 Data Storage

Morphs are stored in the `analysis` table in the `morphMetadata` JSON field:

```json
{
  "morphMetadata": {
    "glowUpMorphs": {
      "overall": "https://...",
      "eyes": "https://...",
      "skin": "https://...",
      "jawline": "https://...",
      "hair": "https://..."
    },
    "lastGlowUpMorphUpdate": "2025-01-01T00:00:00.000Z"
  }
}
```

## 🎯 Integration Example: Glow-Up Protocol Page

### Step 1: Fetch Morphs

```typescript
// In your component
const { data: glowUpMorphs, isLoading } = api.morph.getGlowUpMorphs.useQuery({
  analysisId: analysis.id
});
```

### Step 2: Display Tab-Specific Morphs

```typescript
// Show different morph based on active tab
const getMorphForTab = (tab: string) => {
  switch (tab) {
    case "eyes":
      return glowUpMorphs?.eyes;
    case "skin":
      return glowUpMorphs?.skin;
    case "frame":
      return glowUpMorphs?.jawline;
    case "hair":
      return glowUpMorphs?.hair;
    default:
      return glowUpMorphs?.overall;
  }
};

const activeMorph = getMorphForTab(activeSubtab);
```

### Step 3: Generate Missing Morphs

```typescript
const generateMorph = api.morph.generateGlowUpMorph.useMutation({
  onSuccess: () => {
    // Refetch morphs to get the new one
    refetch();
  }
});

// Generate if missing
if (!glowUpMorphs?.eyes) {
  generateMorph.mutate({
    analysisId: analysis.id,
    morphType: "eyes"
  });
}
```

## 🎨 Morph Types & Prompts

### 1. **Overall** (Full Transformation)
- Comprehensive facial improvements
- Enhances all features while maintaining identity
- Best for showing the complete potential

### 2. **Eyes** (Eye & Brow Area)
- Reduces upper eyelid exposure
- Improves canthal tilt
- Thickens and defines eyebrows
- Minimizes under-eye issues

### 3. **Skin** (Texture & Tone)
- Evens skin tone
- Reduces blemishes and redness
- Smooths texture while keeping natural pores
- Enhances clarity and glow

### 4. **Jawline** (Lower Face Structure)
- Sharpens jawline definition
- Enhances chin projection
- Improves jaw width and symmetry
- Creates more angular features

### 5. **Hair** (Density & Quality)
- Uses the existing morph from analysis
- Falls back to analysis.morphUrl
- No API call needed for this type

## 🚀 Admin Usage (Review Dashboard)

To bulk-generate morphs for all analyses:

```typescript
// In review dashboard
const generateAllMorphs = api.morph.generateAllGlowUpMorphs.useMutation();

analyses.forEach(analysis => {
  if (analysis.status === "complete" && !analysis.morphMetadata?.glowUpMorphs) {
    generateAllMorphs.mutate({ analysisId: analysis.id });
  }
});
```

## ⚠️ Important Notes

1. **Rate Limiting**: The `generateAllGlowUpMorphs` includes 1-second delays between requests
2. **Cost**: Each morph generation uses AIMLAPI credits
3. **Analysis Status**: Analysis must be "complete" before generating morphs
4. **Error Handling**: Check the `errors` object in response for failed morphs
5. **Caching**: Morphs are stored in database to avoid regeneration

## 🔍 Debugging

Enable debug logs in the AIMLAPI service:

```typescript
// In aimlapi-morph-generator.ts
console.log("AIMLAPI Request:", {
  model: "qwen-vl-max-latest",
  prompt: prompt,
  imageUrl: originalImageUrl
});
```

Check server logs for:
- `Starting AIMLAPI {morphType} morph for analysis: {id}`
- `Generating {morphType} morph...`
- AIMLAPI error responses

## 🎯 Next Steps

1. ✅ Add morph generation button to glow-up protocol page
2. ✅ Show loading states during morph generation
3. ✅ Display tab-specific morphs in before/after slider
4. ✅ Add "Generate Morphs" button in review dashboard
5. ✅ Show morph generation progress indicator

The infrastructure is ready - just integrate the TRPC calls into your UI!


