# Quick Start: OpenRouter Claude 4.5 Integration

## 🚀 Get Started in 3 Steps

### **Step 1: Add API Key**

Edit `.env.local`:
```bash
OPENROUTER_API_KEY=sk-or-v1-YOUR_KEY_HERE
SITE_URL=https://parallel.com
```

Get key: https://openrouter.ai/keys

### **Step 2: Restart Server**

```bash
# Ctrl+C to stop, then:
pnpm dev
```

### **Step 3: Generate Analysis**

1. Go to: `http://localhost:3000/review/analysis_1759563679195_fflte0i`
2. Click **"🤖 Generate Claude Analysis"** (purple button)
3. Wait 30-60 seconds
4. Click **"Mark Complete"**
5. User can now view at `/analysis`

## ✅ That's It!

Your analysis will now show:
- ✅ Real analysis from Claude 4.5
- ✅ Brutally honest assessments
- ✅ All 16 sections populated
- ✅ Detailed multi-paragraph explanations
- ✅ Professional clinical tone

## 📖 Full Documentation

See `OPENROUTER_CLAUDE_INTEGRATION.md` for complete details.

## 💡 Tips

- **Cost**: ~$0.05-0.10 per analysis
- **Time**: 30-60 seconds
- **Quality**: Production-ready, brutally honest
- **Storage**: Results cached in database, won't re-run

## 🎯 Your Analysis ID

```
analysis_1759563679195_fflte0i
```

Use this ID in the review panel URL.

