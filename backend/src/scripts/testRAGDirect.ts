import 'reflect-metadata';
import AppDataSource from '../config/datasource';
import { VectorService } from '../services/vectorService';
import { DocumentChunk } from '../models';

interface TestResult {
  query: string;
  resultsFound: number;
  topSimilarity: number;
  topChunkPreview: string;
  quality: 'Excellent' | 'Good' | 'Fair' | 'Poor';
}

class DirectRAGTester {
  private vectorService = new VectorService();

  async runDirectTests(): Promise<void> {
    console.log('🧪 Starting Direct RAG Testing...\n');

    await AppDataSource.initialize();
    console.log('✅ Database connected\n');

    try {
      const testQueries = [
        "What is a whiteboard challenge and how do I structure one?",
        "What are the key components of a UX design framework?",
        "How do I conduct user research for a design project?",
        "What are some good examples of design thinking exercises?",
        "How do I create effective prompts for design challenges?",
        "What is the design thinking process?",
        "How do I facilitate a design workshop?",
        "What are the best practices for user interviews?",
        "How do I create wireframes and prototypes?",
        "What is usability testing and how do I conduct it?"
      ];

      console.log(`📝 Testing ${testQueries.length} queries...\n`);

      const results: TestResult[] = [];

      for (let i = 0; i < testQueries.length; i++) {
        const query = testQueries[i];
        console.log(`🔍 Test ${i + 1}/${testQueries.length}: "${query}"`);

        try {
          const result = await this.testQuery(query);
          results.push(result);
          
          console.log(`   ✅ Found ${result.resultsFound} results`);
          console.log(`   📊 Top Similarity: ${result.topSimilarity.toFixed(3)}`);
          console.log(`   🎯 Quality: ${result.quality}`);
          console.log(`   📄 Preview: "${result.topChunkPreview}"`);
          console.log('');

        } catch (error) {
          console.log(`   ❌ Error: ${error}`);
          console.log('');
        }
      }

      // Print comprehensive results
      await this.printResultsSummary(results);

    } catch (error) {
      console.error('❌ Test suite failed:', error);
    } finally {
      await AppDataSource.destroy();
      console.log('🔌 Database connection closed');
    }
  }

  private async testQuery(query: string): Promise<TestResult> {
    // Generate embedding for the query
    const queryEmbedding = await this.vectorService.generateQueryEmbedding(query);
    
    // Search for similar chunks
    const searchResults = await this.vectorService.searchSimilar(queryEmbedding, 5);
    
    if (searchResults.length === 0) {
      return {
        query,
        resultsFound: 0,
        topSimilarity: 0,
        topChunkPreview: 'No results found',
        quality: 'Poor'
      };
    }

    const topResult = searchResults[0];
    const topChunkPreview = topResult.chunk.content.substring(0, 100) + '...';
    
    // Determine quality based on similarity score
    let quality: 'Excellent' | 'Good' | 'Fair' | 'Poor';
    if (topResult.similarity >= 0.7) quality = 'Excellent';
    else if (topResult.similarity >= 0.5) quality = 'Good';
    else if (topResult.similarity >= 0.3) quality = 'Fair';
    else quality = 'Poor';

    return {
      query,
      resultsFound: searchResults.length,
      topSimilarity: topResult.similarity,
      topChunkPreview,
      quality
    };
  }

  private async printResultsSummary(results: TestResult[]): Promise<void> {
    console.log('📊 DIRECT RAG TESTING SUMMARY');
    console.log('='.repeat(50));
    
    const totalTests = results.length;
    const excellentCount = results.filter(r => r.quality === 'Excellent').length;
    const goodCount = results.filter(r => r.quality === 'Good').length;
    const fairCount = results.filter(r => r.quality === 'Fair').length;
    const poorCount = results.filter(r => r.quality === 'Poor').length;
    
    const avgSimilarity = results.reduce((sum, r) => sum + r.topSimilarity, 0) / totalTests;
    const avgResultsFound = results.reduce((sum, r) => sum + r.resultsFound, 0) / totalTests;

    console.log(`Total Tests: ${totalTests}`);
    console.log(`Average Similarity: ${avgSimilarity.toFixed(3)}`);
    console.log(`Average Results Found: ${avgResultsFound.toFixed(1)}`);
    console.log('');
    
    console.log('🎯 Quality Distribution:');
    console.log(`   Excellent (≥0.7): ${excellentCount} (${(excellentCount/totalTests*100).toFixed(1)}%)`);
    console.log(`   Good (≥0.5): ${goodCount} (${(goodCount/totalTests*100).toFixed(1)}%)`);
    console.log(`   Fair (≥0.3): ${fairCount} (${(fairCount/totalTests*100).toFixed(1)}%)`);
    console.log(`   Poor (<0.3): ${poorCount} (${(poorCount/totalTests*100).toFixed(1)}%)`);
    console.log('');

    // Show detailed results
    console.log('📝 Detailed Results:');
    results.forEach((result, index) => {
      console.log(`${index + 1}. "${result.query}"`);
      console.log(`   Similarity: ${result.topSimilarity.toFixed(3)} (${result.quality})`);
      console.log(`   Results: ${result.resultsFound}`);
      console.log(`   Preview: "${result.topChunkPreview}"`);
      console.log('');
    });

    // Overall assessment
    const successRate = ((excellentCount + goodCount) / totalTests) * 100;
    
    console.log('🎯 OVERALL ASSESSMENT');
    console.log('='.repeat(30));
    console.log(`Success Rate (Good+): ${successRate.toFixed(1)}%`);
    console.log(`Average Similarity: ${avgSimilarity.toFixed(3)}`);
    
    if (successRate >= 80) {
      console.log('🎉 RAG vector search is working excellently!');
    } else if (successRate >= 60) {
      console.log('✅ RAG vector search is working well!');
    } else if (successRate >= 40) {
      console.log('⚠️  RAG vector search needs improvement.');
    } else {
      console.log('❌ RAG vector search is not working effectively.');
    }

    // Show some sample chunks to verify content quality
    console.log('\n📄 Sample Document Chunks:');
    const chunkRepository = AppDataSource.getRepository(DocumentChunk);
    const sampleChunks = await chunkRepository.find({ take: 3 });
    
    sampleChunks.forEach((chunk, index) => {
      console.log(`${index + 1}. Source: ${chunk.source}`);
      console.log(`   Content: "${chunk.content.substring(0, 150)}..."`);
      console.log(`   Tokens: ${chunk.tokenCount}`);
      console.log('');
    });
  }
}

// Run the direct tests
async function runDirectRAGTests() {
  const tester = new DirectRAGTester();
  await tester.runDirectTests();
}

runDirectRAGTests().catch(error => {
  console.error('❌ Test suite failed:', error);
  process.exit(1);
});
