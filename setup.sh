#!/bin/bash

# B2B Facial Analysis Platform Setup Script

echo "🚀 Setting up B2B Facial Analysis Platform..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Check if pnpm is installed, if not install it
if ! command -v pnpm &> /dev/null; then
    echo "📦 Installing pnpm..."
    npm install -g pnpm
fi

echo "✅ pnpm $(pnpm -v) detected"

# Install dependencies
echo "📦 Installing dependencies..."
pnpm install

# Create environment file if it doesn't exist
if [ ! -f .env.local ]; then
    echo "📝 Creating .env.local file..."
    cp env.example .env.local
    echo "⚠️  Please edit .env.local and add your API keys:"
    echo "   - ZYLA_API_KEY"
    echo "   - OPENROUTER_API_KEY"
    echo "   - Other required environment variables"
else
    echo "✅ .env.local already exists"
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Edit .env.local and add your API keys"
echo "2. Run: pnpm dev"
echo "3. Open: http://localhost:3000"
echo ""
echo "Test pages:"
echo "- Zyla Analysis: http://localhost:3000/zyla-test"
echo "- GPT-5 Analysis: http://localhost:3000/openrouter-test"
echo "- Dashboard: http://localhost:3000/analysis-dashboard"
echo ""
echo "Happy analyzing! 🔬✨"
