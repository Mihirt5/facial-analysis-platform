# Zyla API Integration Setup Guide

## Environment Variables

Add the following to your `.env` or `.env.local` file:

```bash
# Zyla Labs Skin Face Data Analyzer API
# Get your API key from: https://zylalabs.com/api-marketplace/health+%26+fitness/skin+face+data+analyzer+api/9339
ZYLA_API_KEY=your_zyla_api_key_here
```

## Testing the Integration

### Option 1: Use the Test Page
1. Start your development server: `npm run dev`
2. Navigate to: `http://localhost:3000/zyla-test`
3. Upload an image and click "Analyze Skin"
4. Check the browser console and terminal for detailed logs

### Option 2: Use the Test Script
1. Set your API key: `export ZYLA_API_KEY=your_key_here`
2. Run the test script: `node test-zyla-api.js`
3. This will test the API with a public image URL

## Common Issues & Solutions

### Issue 1: "Invalid image URL format"
**Solution**: The API route now properly handles both base64 data URLs and HTTP URLs.

### Issue 2: "No connection adapters were found for 'data:image/...'"
**Cause**: The Zyla API may not accept base64 data URLs directly.
**Solution**: 
- For testing: Use the test script with a public HTTP URL
- For production: Upload images to a CDN (UploadThing, S3, Cloudinary) first

### Issue 3: Empty API response `{}`
**Cause**: The API might be returning an error or have a different response structure.
**Solution**: Check the terminal logs for detailed API response information.

### Issue 4: "Unexpected API response structure"
**Cause**: The API response format is unknown (no example provided in documentation).
**Solution**: The code now includes flexible parsing and detailed logging to handle various response formats.

## Debugging Steps

1. **Check Environment Variable**: Ensure `ZYLA_API_KEY` is set correctly
2. **Check API Key**: Verify your API key is valid and has proper permissions
3. **Check Image Format**: Try with a simple, clear frontal face image
4. **Check Network**: Ensure your server can reach `zylalabs.com`
5. **Check Logs**: Look for detailed console output in both browser and terminal

## API Response Structure

Since the Zyla API documentation doesn't provide a response example, the integration includes:

- **Flexible Parsing**: Tries multiple possible response structures
- **Detailed Logging**: Logs the complete raw API response
- **Error Handling**: Provides specific error messages for different failure modes
- **Fallback Logic**: Attempts to extract any available data from the response

## Next Steps

1. Test with a valid API key
2. Check the terminal logs for the actual API response structure
3. Update the parsing logic based on the real response format
4. Integrate with your existing image upload system (UploadThing)

## Files Modified

- `src/lib/zyla-skin-analyzer.ts` - Core API integration logic
- `src/app/api/zyla-analyze/route.ts` - Next.js API route
- `src/app/zyla-test/page.tsx` - Test page for the integration
- `src/env.js` - Environment variable configuration
- `test-zyla-api.js` - Standalone test script
