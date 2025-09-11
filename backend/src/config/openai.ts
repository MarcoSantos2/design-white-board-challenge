import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.OPENAI_API_KEY) {
  throw new Error('OPENAI_API_KEY is required in environment variables');
}

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const CHAT_CONFIG = {
  model: 'gpt-4o', // Using GPT-4o for better performance with custom GPTs
  maxTokens: 1000,
  temperature: 0.7,
}; 