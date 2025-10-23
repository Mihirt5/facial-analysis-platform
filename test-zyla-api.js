#!/usr/bin/env node

/**
 * Simple test script to verify Zyla API integration
 * Run with: node test-zyla-api.js
 */

const https = require('https');
const fs = require('fs');

// Configuration
const API_KEY = process.env.ZYLA_API_KEY || 'YOUR_API_KEY_HERE';
const API_URL = 'https://zylalabs.com/api/9339/skin+face+data+analyzer+api/16877/skin+analysis';

// Test with a public image URL
const TEST_IMAGE_URL = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face';

async function testZylaAPI() {
  console.log('🧪 Testing Zyla API Integration...\n');
  
  if (API_KEY === 'YOUR_API_KEY_HERE') {
    console.error('❌ Please set ZYLA_API_KEY environment variable');
    console.log('   Example: ZYLA_API_KEY=your_key_here node test-zyla-api.js');
    process.exit(1);
  }

  const requestBody = {
    analysis_type: 'comprehensive',
    image_url: TEST_IMAGE_URL,
    focus_areas: ['acne', 'wrinkles', 'pores', 'texture', 'hydration', 'pigmentation'],
  };

  console.log('📤 Request Details:');
  console.log('   URL:', API_URL);
  console.log('   Method: POST');
  console.log('   Image URL:', TEST_IMAGE_URL);
  console.log('   API Key:', API_KEY.substring(0, 10) + '...');
  console.log('   Request Body:', JSON.stringify(requestBody, null, 2));
  console.log('');

  const postData = JSON.stringify(requestBody);

  const options = {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData),
    },
  };

  return new Promise((resolve, reject) => {
    const req = https.request(API_URL, options, (res) => {
      console.log('📥 Response Details:');
      console.log('   Status:', res.statusCode);
      console.log('   Headers:', JSON.stringify(res.headers, null, 2));
      console.log('');

      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        console.log('📦 Raw Response Body:');
        try {
          const parsedData = JSON.parse(data);
          console.log(JSON.stringify(parsedData, null, 2));
          
          if (res.statusCode === 200) {
            console.log('\n✅ API call successful!');
            console.log('   Response structure:', Object.keys(parsedData));
          } else {
            console.log('\n❌ API call failed');
          }
        } catch (e) {
          console.log('Raw text response:', data);
          console.log('\n❌ Failed to parse JSON response');
        }
        
        resolve();
      });
    });

    req.on('error', (error) => {
      console.error('❌ Request error:', error);
      reject(error);
    });

    req.write(postData);
    req.end();
  });
}

// Run the test
testZylaAPI().catch(console.error);
