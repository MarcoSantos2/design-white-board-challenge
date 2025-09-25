import { OpenAI } from 'openai';
import { DocumentChunk } from '../models';
import AppDataSource from '../config/datasource';
import { Not } from 'typeorm';

export interface SearchResult {
  chunk: DocumentChunk;
  similarity: number;
}

export class VectorService {
  private openai: OpenAI;
  private chunkRepository = AppDataSource.getRepository(DocumentChunk);

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
  }

  /**
   * Generate embeddings for text chunks
   */
  async generateEmbeddings(chunks: { content: string; id: string }[]): Promise<void> {
    try {
      // Generate embeddings in batches to avoid rate limits
      const batchSize = 100;
      for (let i = 0; i < chunks.length; i += batchSize) {
        const batch = chunks.slice(i, i + batchSize);
        
        const response = await this.openai.embeddings.create({
          model: 'text-embedding-3-small', // More cost-effective than text-embedding-ada-002
          input: batch.map(chunk => chunk.content)
        });

        // Update chunks with embeddings
        for (let j = 0; j < batch.length; j++) {
          const embedding = response.data[j].embedding;
          await this.chunkRepository.update(batch[j].id, {
            embedding: JSON.stringify(embedding)
          });
        }

        // Add small delay to respect rate limits
        if (i + batchSize < chunks.length) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }
    } catch (error) {
      console.error('Error generating embeddings:', error);
      throw error;
    }
  }

  /**
   * Generate embedding for a single query
   */
  async generateQueryEmbedding(query: string): Promise<number[]> {
    try {
      const response = await this.openai.embeddings.create({
        model: 'text-embedding-3-small',
        input: query
      });
      return response.data[0].embedding;
    } catch (error) {
      console.error('Error generating query embedding:', error);
      throw error;
    }
  }

  /**
   * Search for similar chunks using cosine similarity
   */
  async searchSimilar(queryEmbedding: number[], limit: number = 5): Promise<SearchResult[]> {
    try {
    // Get all chunks with embeddings
    const chunks = await this.chunkRepository.find({
      where: { embedding: Not('[]') }
    });

      if (chunks.length === 0) {
        return [];
      }

      // Calculate cosine similarity for each chunk
      const results: SearchResult[] = [];
      
      for (const chunk of chunks) {
        try {
          const chunkEmbedding = JSON.parse(chunk.embedding);
          const similarity = this.calculateCosineSimilarity(queryEmbedding, chunkEmbedding);
          
          results.push({
            chunk,
            similarity
          });
        } catch (error) {
          console.error(`Error parsing embedding for chunk ${chunk.id}:`, error);
        }
      }

      // Sort by similarity and return top results
      return results
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, limit);
    } catch (error) {
      console.error('Error searching similar chunks:', error);
      throw error;
    }
  }

  /**
   * Calculate cosine similarity between two vectors
   */
  private calculateCosineSimilarity(vecA: number[], vecB: number[]): number {
    if (vecA.length !== vecB.length) {
      throw new Error('Vectors must have the same length');
    }

    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < vecA.length; i++) {
      dotProduct += vecA[i] * vecB[i];
      normA += vecA[i] * vecA[i];
      normB += vecB[i] * vecB[i];
    }

    normA = Math.sqrt(normA);
    normB = Math.sqrt(normB);

    if (normA === 0 || normB === 0) {
      return 0;
    }

    return dotProduct / (normA * normB);
  }

  /**
   * Process chunks that don't have embeddings yet
   */
  async processPendingChunks(): Promise<void> {
    try {
      const chunksWithoutEmbeddings = await this.chunkRepository.find({
        where: { embedding: '[]' }
      });

      if (chunksWithoutEmbeddings.length === 0) {
        console.log('No chunks pending embedding generation');
        return;
      }

      console.log(`Processing ${chunksWithoutEmbeddings.length} chunks for embedding generation`);

      const chunksForEmbedding = chunksWithoutEmbeddings.map(chunk => ({
        content: chunk.content,
        id: chunk.id
      }));

      await this.generateEmbeddings(chunksForEmbedding);
      console.log('Embedding generation completed');
    } catch (error) {
      console.error('Error processing pending chunks:', error);
      throw error;
    }
  }

  /**
   * Get chunks by document source
   */
  async getChunksBySource(source: string): Promise<DocumentChunk[]> {
    return await this.chunkRepository.find({
      where: { source },
      order: { chunkIndex: 'ASC' }
    });
  }
}
