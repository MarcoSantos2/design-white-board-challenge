import { Request, Response } from 'express';
import { VectorService } from '../services/vectorService';

const vectorService = new VectorService();

export class TestRAGController {
  /**
   * Test RAG search functionality
   */
  async testSearch(req: Request, res: Response): Promise<void> {
    try {
      const { query } = req.query;

      if (!query || typeof query !== 'string') {
        res.status(400).json({ error: 'Query parameter is required' });
        return;
      }

      console.log(`🔍 Testing RAG search for: "${query}"`);

      // Generate query embedding
      const queryEmbedding = await vectorService.generateQueryEmbedding(query);
      console.log(`✅ Generated embedding with ${queryEmbedding.length} dimensions`);

      // Search for similar chunks
      const searchResults = await vectorService.searchSimilar(queryEmbedding, 3);
      console.log(`✅ Found ${searchResults.length} similar chunks`);

      // Format results
      const results = searchResults.map((result, index) => ({
        rank: index + 1,
        similarity: (result.similarity * 100).toFixed(1) + '%',
        content: result.chunk.content.substring(0, 200) + '...',
        source: result.chunk.source,
        chunkIndex: result.chunk.chunkIndex
      }));

      res.json({
        success: true,
        data: {
          query,
          embeddingDimensions: queryEmbedding.length,
          resultsFound: searchResults.length,
          results
        }
      });
    } catch (error) {
      console.error('Error testing RAG search:', error);
      res.status(500).json({ 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * Test document processing stats
   */
  async testStats(req: Request, res: Response): Promise<void> {
    try {
      console.log('📊 Testing document stats...');

      // Get chunks count
      const chunks = await vectorService.getChunksBySource('test');
      console.log(`✅ Found ${chunks.length} chunks`);

      res.json({
        success: true,
        data: {
          message: 'RAG system is working!',
          chunksFound: chunks.length,
          timestamp: new Date().toISOString()
        }
      });
    } catch (error) {
      console.error('Error testing stats:', error);
      res.status(500).json({ 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
}

