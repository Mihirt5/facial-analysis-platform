import { NextRequest, NextResponse } from 'next/server';
import { env } from "~/env.js";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { imageUrl } = body;

    if (!imageUrl) {
      return NextResponse.json(
        { error: 'Image URL is required' },
        { status: 400 }
      );
    }

    console.log('🔬 Processing OpenRouter/GPT-5 analysis request...');

    const apiKey = env.OPENROUTER_API_KEY;
    
    if (!apiKey) {
      throw new Error('OPENROUTER_API_KEY is not configured');
    }

    // Use OpenRouter API with GPT-5 for facial analysis
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "HTTP-Referer": "http://localhost:3002", // Optional. Site URL for rankings on openrouter.ai.
        "X-Title": "B2B Site Facial Analysis", // Optional. Site title for rankings on openrouter.ai.
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "model": "openai/gpt-5",
        "messages": [
          {
            "role": "user",
            "content": [
              {
                "type": "text",
                "text": `You are an expert facial analysis model specializing in detailed evaluations for women. Analyze the uploaded image comprehensively across the following categories:

1. Facial Structure & Proportions — identify face shape, symmetry, jawline angle, chin projection, and golden ratio conformity.
2. Skin & Texture — evaluate skin tone, undertone, texture, pigmentation, acne, and hydration.
3. Feature-Level Analysis — describe eyes, nose, lips, and eyebrows in terms of shape, proportion, and symmetry.
4. Expression & Emotional Readout — interpret current expression, subtle emotions, and overall expressiveness.
5. Age & Health Estimation — estimate visual age, signs of fatigue or stress, and skin health level.
6. Makeup Detection & Style — detect presence of makeup, style, color palette match, and blending quality.
7. Lighting & Image Quality — describe lighting direction, shadow influence, and how it affects accuracy.

Return results in a structured JSON format:
{
  "Facial Structure": {...},
  "Skin Analysis": {...},
  "Features": {...},
  "Expression": {...},
  "Age & Health": {...},
  "Makeup": {...},
  "Lighting": {...},
  "Overall Summary": "Concise synthesis of major insights"
}

Be objective, descriptive, and non-judgmental. Avoid subjective terms like 'beautiful' or 'attractive'; use analytical language instead.`
              },
              {
                "type": "image_url",
                "image_url": {
                  "url": imageUrl
                }
              }
            ]
          }
        ],
        "max_tokens": 4000,
        "temperature": 0.3
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ OpenRouter API error:', response.status, errorText);
      throw new Error(`OpenRouter API request failed: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('✅ Received OpenRouter/GPT-5 analysis response');

    if (!data.choices || !data.choices[0]?.message?.content) {
      throw new Error('Invalid response format from OpenRouter API');
    }

    const analysisContent = data.choices[0].message.content;
    
    // Try to parse as JSON, fallback to text if not valid JSON
    let analysisData;
    try {
      analysisData = JSON.parse(analysisContent);
    } catch (parseError) {
      // If not valid JSON, wrap in a structured format
      analysisData = {
        "Analysis": analysisContent,
        "Overall Summary": "GPT-5 provided detailed facial analysis",
        "Raw Response": analysisContent
      };
    }

    console.log('✅ OpenRouter/GPT-5 analysis complete, returning results');

    return NextResponse.json({
      success: true,
      data: {
        analysis: analysisData,
        model: "openai/gpt-5",
        usage: data.usage
      },
    });

  } catch (error: any) {
    console.error('❌ OpenRouter/GPT-5 analysis API error:', error);
    
    const errorResponse: any = { 
      error: error.message || 'Failed to analyze image with OpenRouter/GPT-5',
    };
    
    if (process.env.NODE_ENV === 'development') {
      errorResponse.details = error.stack;
      errorResponse.type = error.name;
    }
    
    return NextResponse.json(errorResponse, { status: 500 });
  }
}