#!/bin/bash

echo "🧪 Testing API Integrations"
echo "=========================="

# Check if development server is running
if ! curl -s http://localhost:3002 > /dev/null; then
    echo "❌ Development server not running on port 3002"
    echo "Please run: npm run dev"
    exit 1
fi

echo "✅ Development server is running on port 3002"
echo ""

echo "🔗 Test Pages Available:"
echo "  - Zyla API Test: http://localhost:3002/zyla-test"
echo "  - OpenRouter Claude Test: http://localhost:3002/openrouter-test"
echo ""

echo "📋 Instructions:"
echo "1. Open both test pages in your browser"
echo "2. Upload a facial image to each page"
echo "3. Click the analyze button"
echo "4. Check the browser console and terminal for detailed logs"
echo ""

echo "🔧 API Status Check:"
echo "  - Zyla API Key: ${ZYLA_API_KEY:+✅ SET}"
echo "  - OpenRouter API Key: ${OPENROUTER_API_KEY:+✅ SET}"
echo ""

echo "📝 Notes:"
echo "  - Zyla API may require publicly accessible image URLs"
echo "  - Both APIs will show detailed error messages if something goes wrong"
echo "  - Check terminal logs for raw API responses"
