# AIMLAPI Integration Setup

## Environment Variable

Add this to your `.env` file:

```bash
AIMLAPI_KEY=46a5bdafe3bf461fb62aadd7961ce56e
```

## Usage

The AIMLAPI is used to generate before/after morphs using qwen-image-edit model.

### Morph Types:
1. **Overall Morph** - Complete facial transformation
2. **Eyes Morph** - Eye and brow area enhancements
3. **Skin Morph** - Skin quality improvements
4. **Jawline Morph** - Lower face structure optimization
5. **Hair Morph** - Hair density and quality (uses actual morph image)

### API Endpoint
- Base URL: `https://api.aimlapi.com/v1`
- Model: `qwen-vl-max-latest` (for image editing)

### Cost
Using prepaid credits from aimlapi.com

