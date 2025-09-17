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

async function createUXDesignAssistant() {
  try {
    console.log('🤖 Creating UX Design Assistant...\n');
    
    // Create an assistant that replicates your custom GPT
    const assistant = await openai.beta.assistants.create({
      name: "UX Design Challenge Facilitator",
      instructions: `You are a UX Design Challenge Facilitator, an expert in user experience design, design thinking, and interview preparation. Your role is to help candidates practice for UX design interviews by providing realistic design challenges, constructive feedback, and guidance.

## Your Expertise:
- User Experience (UX) Design
- User Interface (UI) Design
- Design Thinking methodology
- User research and usability testing
- Information architecture
- Interaction design
- Design systems and patterns
- Mobile and web design
- Accessibility and inclusive design
- Design critique and feedback

## Your Approach:
1. **Present realistic design challenges** that mirror actual interview scenarios
2. **Guide candidates through the design process** step by step
3. **Ask probing questions** to help candidates think deeply about their decisions
4. **Provide constructive feedback** on their approach and solutions
5. **Suggest improvements** and alternative approaches
6. **Help with time management** during design exercises
7. **Explain design principles** and best practices

## Challenge Types:
- Mobile app design
- Web application design
- E-commerce experiences
- Dashboard and data visualization
- Onboarding flows
- Error handling and edge cases
- Accessibility improvements
- Design system creation

## Your Style:
- Encouraging and supportive
- Professional but approachable
- Focused on learning and growth
- Asks follow-up questions
- Provides specific, actionable feedback
- Helps candidates think like a designer

Remember: You're not just giving answers - you're helping candidates develop their design thinking skills and confidence for real interviews.`,
      model: "gpt-4o",
      tools: [
        {
          type: "code_interpreter"
        }
      ]
    });

    console.log('✅ Assistant created successfully!');
    console.log(`📋 Assistant ID: ${assistant.id}`);
    console.log(`📝 Name: ${assistant.name}`);
    console.log(`🤖 Model: ${assistant.model}`);
    console.log(`📅 Created: ${new Date(assistant.created_at * 1000).toISOString()}\n`);
    
    console.log('🔧 Next steps:');
    console.log('1. Copy the Assistant ID above');
    console.log('2. Update your backend config to use this Assistant ID');
    console.log('3. Test the integration\n');
    
    return assistant.id;
    
  } catch (error) {
    console.error('❌ Error creating assistant:', error);
    throw error;
  }
}

async function listExistingAssistants() {
  try {
    console.log('📋 Checking existing assistants...\n');
    
    const assistants = await openai.beta.assistants.list();
    
    if (assistants.data.length === 0) {
      console.log('No existing assistants found.\n');
      return null;
    }
    
    console.log(`Found ${assistants.data.length} existing assistant(s):\n`);
    
    assistants.data.forEach((assistant, index) => {
      console.log(`${index + 1}. ${assistant.name}`);
      console.log(`   ID: ${assistant.id}`);
      console.log(`   Model: ${assistant.model}`);
      console.log(`   Created: ${new Date(assistant.created_at * 1000).toISOString()}\n`);
    });
    
    return assistants.data;
    
  } catch (error) {
    console.error('❌ Error listing assistants:', error);
    return null;
  }
}

async function main() {
  try {
    // First, check if you already have assistants
    const existingAssistants = await listExistingAssistants();
    
    if (existingAssistants && existingAssistants.length > 0) {
      console.log('💡 You already have assistants. You can use one of these or create a new one.\n');
      
      // Look for UX-related assistants
      const uxAssistant = existingAssistants.find(a => 
        a.name?.toLowerCase().includes('ux') || 
        a.name?.toLowerCase().includes('design') ||
        a.name?.toLowerCase().includes('challenge')
      );
      
      if (uxAssistant) {
        console.log(`🎯 Found UX-related assistant: ${uxAssistant.name}`);
        console.log(`   ID: ${uxAssistant.id}\n`);
        console.log('You can use this assistant ID in your backend config!');
        return;
      }
    }
    
    // Create a new assistant
    const assistantId = await createUXDesignAssistant();
    
  } catch (error) {
    console.error('❌ Script failed:', error);
    process.exit(1);
  }
}

main();
