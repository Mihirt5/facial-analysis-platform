# Facial Morphing System

This system automatically generates enhanced versions of user portraits while preserving their identity. It uses AI-powered facial enhancement to create natural-looking improvements.

## Features

- **Identity-Preserving Enhancement**: Maintains the person's identity while improving facial features
- **Multiple Enhancement Levels**: Subtle, moderate, and enhanced variations
- **Facial Analysis Integration**: Uses existing facial analysis data to determine enhancement parameters
- **Before/After Comparison**: Interactive slider to compare original and enhanced images
- **Quality Validation**: Identity preservation validation and confidence scoring

## Technical Architecture

### Core Components

1. **MorphProcessor** (`src/lib/morph-processor.ts`)
   - Main class for handling morph generation
   - Calculates enhancement parameters based on facial analysis
   - Integrates with Replicate API for AI processing
   - Provides multiple enhancement variations

2. **Morph Router** (`src/server/api/routers/morph.ts`)
   - tRPC API endpoints for morph operations
   - Handles morph generation, variations, and validation
   - Database integration for storing morph results

3. **Morph Page** (`src/app/analysis/morph/page.tsx`)
   - User interface for morph generation and viewing
   - Before/after slider component
   - Enhancement level selection
   - Progress tracking and status updates

### Enhancement Parameters

The system calculates enhancement parameters based on facial analysis:

- **Jawline Sharpening**: Based on jaw definition score
- **Cheekbone Lift**: Based on gonial angle measurements
- **Eye Enhancement**: Based on canthal tilt and symmetry
- **Skin Smoothing**: Based on skin damage and texture analysis
- **Symmetry Correction**: Based on facial symmetry measurements

### API Integration

Currently uses **Replicate API** with the GFPGAN model for face restoration and enhancement. The system can be easily extended to support other models or custom solutions.

## Setup Instructions

1. **Install Dependencies**
   ```bash
   pnpm add replicate
   ```

2. **Environment Variables**
   Add to your `.env` file:
   ```
   REPLICATE_API_TOKEN="your-replicate-api-token"
   ```

3. **Database Schema**
   The morph system uses existing analysis tables with additional fields:
   - `morphUrl`: URL of the generated morph
   - `morphVariations`: Object containing subtle/moderate/enhanced variations
   - `morphMetadata`: Enhancement parameters and processing information
   - `morphValidation`: Identity preservation validation results

## Usage

### Generate Single Morph
```typescript
const morphResult = await morphProcessor.generateMorph(
  imageUrl,
  facialAnalysis,
  { enhancementLevel: "moderate" }
);
```

### Generate Multiple Variations
```typescript
const variations = await morphProcessor.generateMorphVariations(
  imageUrl,
  facialAnalysis
);
```

### API Endpoints

- `morph.generateMorph` - Generate a single morph
- `morph.generateMorphVariations` - Generate all enhancement levels
- `morph.getMorphStatus` - Check morph generation status
- `morph.validateMorphIdentity` - Validate identity preservation

## Future Enhancements

1. **Custom Model Integration**: Deploy custom models for better control
2. **Advanced Validation**: Implement face recognition for identity verification
3. **Batch Processing**: Process multiple images simultaneously
4. **Real-time Processing**: WebSocket integration for live updates
5. **Quality Metrics**: Advanced quality scoring and validation

## Cost Considerations

- **Replicate API**: ~$0.01-0.10 per image
- **Processing Time**: 30-60 seconds per morph
- **Storage**: Morph images stored in existing UploadThing infrastructure

## Security & Privacy

- Images are processed through secure API endpoints
- No permanent storage of user images on external services
- Identity validation ensures morphs maintain user likeness
- All processing follows existing privacy policies
