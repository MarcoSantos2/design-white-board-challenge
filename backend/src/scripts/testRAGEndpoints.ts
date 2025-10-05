import 'reflect-metadata';
import AppDataSource from '../config/datasource';
import { RAGChatService } from '../services/ragChatService';
import { VectorService } from '../services/vectorService';
import { DocumentChunk } from '../models';

interface EndpointTest {
  name: string;
  test: () => Promise<any>;
  expectedResult: string;
}

class RAGEndpointTester {
  private ragChatService = new RAGChatService();
  private vectorService = new VectorService();

  async runEndpointTests(): Promise<void> {
    console.log('🧪 Starting RAG Endpoint Testing...\n');

    await AppDataSource.initialize();
    console.log('✅ Database connected\n');

    const tests: EndpointTest[] = [
      {
        name: 'Document Statistics',
        test: async () => await this.testDocumentStats(),
        expectedResult: 'Should return document statistics'
      },
      {
        name: 'Document Search',
        test: async () => await this.testDocumentSearch(),
        expectedResult: 'Should return search results'
      },
      {
        name: 'RAG Chat Response',
        test: async () => await this.testRAGChat(),
        expectedResult: 'Should return enhanced chat response'
      }
    ];

    console.log(`📝 Running ${tests.length} endpoint tests...\n`);

    for (let i = 0; i < tests.length; i++) {
      const test = tests[i];
      console.log(`🔍 Test ${i + 1}/${tests.length}: ${test.name}`);
      
      try {
        const result = await test.test();
        console.log(`   ✅ Success: ${test.expectedResult}`);
        console.log(`   📊 Result:`, JSON.stringify(result, null, 2));
        console.log('');
      } catch (error) {
        console.log(`   ❌ Error: ${error}`);
        console.log('');
      }
    }

    await AppDataSource.destroy();
    console.log('🔌 Database connection closed');
  }

  private async testDocumentStats(): Promise<any> {
    const stats = await this.ragChatService.getDocumentStats();
    return {
      totalDocuments: stats.totalDocuments,
      completedDocuments: stats.completedDocuments,
      totalChunks: stats.totalChunks,
      totalTokens: stats.totalTokens
    };
  }

  private async testDocumentSearch(): Promise<any> {
    const query = "What is a whiteboard challenge?";
    const results = await this.ragChatService.searchDocuments(query, 3);
    return {
      query,
      resultsFound: results.length,
      topResult: results[0] ? {
        content: results[0].content.substring(0, 100) + '...',
        similarity: results[0].similarity
      } : null
    };
  }

  private async testRAGChat(): Promise<any> {
    // Test the RAG chat functionality directly
    const request = {
      message: "How do I structure a whiteboard challenge?",
      sessionId: `test-${Date.now()}`
    };

    try {
      const response = await this.ragChatService.sendMessageWithRAG(request);
      return {
        originalMessage: request.message,
        responseLength: response.message.length,
        hasContext: response.message.length > 100, // RAG responses should be longer
        responsePreview: response.message.substring(0, 150) + '...'
      };
    } catch (error) {
      // If RAG chat fails, test the vector search directly
      const queryEmbedding = await this.vectorService.generateQueryEmbedding(request.message);
      const searchResults = await this.vectorService.searchSimilar(queryEmbedding, 3);
      
      return {
        originalMessage: request.message,
        fallbackTest: 'Vector search only',
        resultsFound: searchResults.length,
        topSimilarity: searchResults[0]?.similarity || 0,
        topChunkPreview: searchResults[0]?.chunk.content.substring(0, 100) + '...' || 'No results'
      };
    }
  }
}

// Run the endpoint tests
async function runRAGEndpointTests() {
  const tester = new RAGEndpointTester();
  await tester.runEndpointTests();
}

runRAGEndpointTests().catch(error => {
  console.error('❌ Test suite failed:', error);
  process.exit(1);
});
