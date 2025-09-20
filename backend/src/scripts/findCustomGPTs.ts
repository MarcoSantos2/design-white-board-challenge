import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.OPENAI_API_KEY) {
  console.error('❌ OPENAI_API_KEY is required in environment variables');
  process.exit(1);
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function findCustomGPTs() {
  try {
    console.log('🔍 Searching for your custom GPTs...\n');
    
    // Note: OpenAI doesn't have a direct API to list custom GPTs yet
    // But we can check if a specific model ID exists by trying to use it
    
    console.log('📋 To find your custom GPT ID:');
    console.log('1. Go to https://platform.openai.com/gpts');
    console.log('2. Click on your custom GPT');
    console.log('3. Look for the Model ID or API ID');
    console.log('4. It will look like: gpt-1234567890abcdef or g-1234567890abcdef\n');
    
    console.log('🔧 Once you have the ID, update your backend config:');
    console.log('   backend/src/config/openai.ts');
    console.log('   Change model: "gpt-4o" to your custom GPT ID\n');
    
    // Test if we can access the API
    console.log('✅ OpenAI API connection test...');
    const models = await openai.models.list();
    console.log(`✅ Connected! Found ${models.data.length} available models`);
    
    // Show some available models
    console.log('\n📝 Available models (first 10):');
    models.data.slice(0, 10).forEach(model => {
      console.log(`   - ${model.id}`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

findCustomGPTs();
