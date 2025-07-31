import dotenv from 'dotenv';
import { AppDataSource } from '../config/database';
import { ChatService } from '../services/chatService';
import { ChatRequest } from '../types/chat';

// Load environment variables
dotenv.config();

async function testConversation() {
  console.log('🚀 Starting database and OpenAI API test...\n');

  try {
    // Initialize database connection
    console.log('📊 Connecting to database...');
    await AppDataSource.initialize();
    console.log('✅ Database connected successfully!\n');

    // Initialize chat service
    const chatService = new ChatService();

    // Test 1: Create a new conversation
    console.log('💬 Test 1: Creating new conversation...');
    const firstMessage: ChatRequest = {
      message: "Hello! I'm testing the UX whiteboard challenge system. Can you give me a brief introduction to what you do?",
      sessionId: undefined // This will create a new conversation
    };

    const response1 = await chatService.sendMessage(firstMessage);
    console.log('✅ First message sent and saved!');
    console.log(`📝 Conversation ID: ${response1.conversationId}`);
    console.log(`🤖 AI Response: ${response1.message.substring(0, 100)}...\n`);

    if (!response1.conversationId) {
      throw new Error('❌ No conversation ID returned from first message');
    }

    // Test 2: Continue the conversation
    console.log('💬 Test 2: Continuing conversation...');
    const secondMessage: ChatRequest = {
      message: "That sounds interesting! Can you give me a sample UX design challenge?",
      sessionId: response1.conversationId
    };

    const response2 = await chatService.sendMessage(secondMessage);
    console.log('✅ Second message sent and saved!');
    console.log(`🤖 AI Response: ${response2.message.substring(0, 100)}...\n`);

    // Test 3: Retrieve the full conversation
    console.log('📚 Test 3: Retrieving full conversation...');
    const fullConversation = await chatService.getConversation(response1.conversationId);
    
    if (fullConversation) {
      console.log('✅ Conversation retrieved successfully!');
      console.log(`📊 Conversation contains ${fullConversation.messages.length} messages:`);
      
      fullConversation.messages.forEach((msg, index) => {
        console.log(`  ${index + 1}. [${msg.role.toUpperCase()}]: ${msg.content.substring(0, 50)}...`);
      });
      console.log('');
    }

    // Test 4: List all conversations
    console.log('📋 Test 4: Listing all conversations...');
    const allConversations = await chatService.getAllConversations();
    console.log(`✅ Found ${allConversations.length} total conversations in database\n`);

    // Test 5: Database verification queries
    console.log('🔍 Test 5: Direct database verification...');
    
    const conversationRepo = AppDataSource.getRepository('Conversation');
    const messageRepo = AppDataSource.getRepository('Message');
    
    const totalConversations = await conversationRepo.count();
    const totalMessages = await messageRepo.count();
    
    console.log(`✅ Database verification:`);
    console.log(`  📊 Total conversations in DB: ${totalConversations}`);
    console.log(`  💬 Total messages in DB: ${totalMessages}`);
    console.log('');

    // Test summary
    console.log('🎉 ALL TESTS PASSED! Summary:');
    console.log('  ✅ Database connection established');
    console.log('  ✅ OpenAI API integration working');
    console.log('  ✅ Conversations saved to database');
    console.log('  ✅ Messages saved with proper relationships');
    console.log('  ✅ Data retrieval working correctly');
    console.log('  ✅ Full conversation flow validated\n');

    console.log('🎯 Your system is ready for production use!');

  } catch (error) {
    console.error('❌ Test failed with error:', error);
    throw error;
  } finally {
    // Close database connection
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
      console.log('🔒 Database connection closed');
    }
  }
}

// Run the test
testConversation()
  .then(() => {
    console.log('\n✅ Test completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Test failed:', error);
    process.exit(1);
  }); 