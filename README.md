# B2B Facial Analysis Platform

A comprehensive facial analysis platform that integrates multiple AI services for detailed skin and facial analysis.

## 🚀 Features

### 🔬 Dual Analysis Systems
- **Zyla API Integration**: Professional skin analysis with detailed metrics
- **OpenRouter GPT-5**: Advanced facial analysis across 7 categories

### 📊 Visual Dashboard
- **Interactive Metric Boxes**: Color-coded severity indicators
- **Regional Analysis**: Breakdown by facial regions (cheeks, chin, forehead)
- **Charts & Graphs**: Visual representation of analysis data
- **Export Functionality**: JSON export for individual or bulk analyses

### 🎯 Analysis Categories

#### Zyla Skin Analysis
- **Acne & Lesions**: Count, severity, affected area percentage
- **Wrinkles**: Regional wrinkle scores and severity assessment
- **Pores**: Density analysis across facial regions
- **Pigmentation**: Dark spot detection and analysis
- **Skin Type**: Classification with confidence scores
- **Overall Severity**: Weighted scoring system

#### GPT-5 Facial Analysis
- **Facial Structure & Proportions**: Face shape, symmetry, golden ratio
- **Skin & Texture Analysis**: Tone, texture, pigmentation assessment
- **Feature-Level Evaluation**: Eyes, nose, lips, eyebrows analysis
- **Expression & Emotional Readout**: Current expression interpretation
- **Age & Health Estimation**: Visual age and health indicators
- **Makeup Detection & Style**: Makeup presence and style analysis
- **Lighting & Image Quality**: Technical image assessment

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **APIs**: Zyla Labs API, OpenRouter GPT-5
- **Storage**: Local Storage for analysis results
- **Deployment**: Vercel-ready

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- pnpm (recommended) or npm

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Mihirt5/b2b-site.git
   cd b2b-site
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Add your API keys to `.env.local`:
   ```env
   ZYLA_API_KEY=your_zyla_api_key_here
   OPENROUTER_API_KEY=your_openrouter_api_key_here
   ```

4. **Run the development server**
   ```bash
   pnpm dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## 📱 Usage

### Test Pages
- **Zyla Test**: `/zyla-test` - Test Zyla skin analysis
- **GPT-5 Test**: `/openrouter-test` - Test OpenRouter facial analysis
- **Dashboard**: `/analysis-dashboard` - View all analysis results

### Analysis Workflow
1. Upload an image or paste an image URL
2. Click "Analyze" to run the analysis
3. Results are automatically saved to the dashboard
4. View detailed metrics, charts, and regional breakdowns
5. Export results as JSON for further analysis

## 🔧 API Integration

### Zyla API
- **Endpoint**: Skin Face Data Analyzer API
- **Requirements**: Public HTTP/HTTPS image URLs
- **Response**: Detailed skin metrics with regional breakdowns

### OpenRouter GPT-5
- **Model**: `openai/gpt-5`
- **Features**: Multi-modal analysis with image input
- **Response**: Structured JSON analysis across 7 categories

## 📊 Dashboard Features

### Visual Components
- **Metric Boxes**: Individual cards for each analysis metric
- **Severity Indicators**: Color-coded severity levels
- **Regional Charts**: Breakdown by facial regions
- **Confidence Scores**: Analysis confidence indicators
- **Quality Warnings**: Image quality alerts

### Data Management
- **Auto-Save**: Results automatically saved to localStorage
- **Export**: Individual or bulk JSON export
- **Comparison**: Side-by-side analysis comparison
- **History**: Complete analysis history tracking

## 🔒 Security

- **Environment Variables**: All API keys stored securely
- **No Hardcoded Secrets**: All sensitive data in environment files
- **Git Protection**: .gitignore prevents accidental commits
- **Input Validation**: URL and file validation

## 📈 Performance

- **Optimized Images**: Efficient image handling and processing
- **Lazy Loading**: Components load as needed
- **Caching**: Analysis results cached locally
- **Responsive Design**: Works on all device sizes

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Zyla Labs** for the comprehensive skin analysis API
- **OpenRouter** for GPT-5 access
- **shadcn/ui** for the beautiful component library
- **Next.js** team for the amazing framework

## 📞 Support

For support or questions, please open an issue on GitHub or contact the development team.

---

**Built with ❤️ for professional facial analysis**