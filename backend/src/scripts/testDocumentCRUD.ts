import 'reflect-metadata';
import AppDataSource from '../config/datasource';
import { Document, DocumentStatus, DocumentChunk } from '../models';
import { DocumentProcessingService } from '../services/documentProcessingService';
import { VectorService } from '../services/vectorService';
import fs from 'fs/promises';
import path from 'path';

interface TestResult {
  test: string;
  status: 'PASS' | 'FAIL';
  message: string;
  details?: any;
}

class DocumentCRUDTester {
  private documentRepository = AppDataSource.getRepository(Document);
  private chunkRepository = AppDataSource.getRepository(DocumentChunk);
  private documentService = new DocumentProcessingService();
  private vectorService = new VectorService();
  private results: TestResult[] = [];

  async runAllTests(): Promise<void> {
    console.log('🧪 Starting Document CRUD Operations Testing...\n');

    await AppDataSource.initialize();
    console.log('✅ Database connected\n');

    try {
      // Test 1: Document Listing
      await this.testDocumentListing();
      
      // Test 2: Document Status Verification
      await this.testDocumentStatus();
      
      // Test 3: Document-Chunk Relationships
      await this.testDocumentChunkRelationships();
      
      // Test 4: Embedding Storage Verification
      await this.testEmbeddingStorage();
      
      // Test 5: Vector Search Functionality
      await this.testVectorSearch();
      
      // Test 6: Document Metadata Validation
      await this.testDocumentMetadata();
      
      // Test 7: Database Integrity
      await this.testDatabaseIntegrity();

      // Print Results Summary
      this.printResultsSummary();

    } catch (error) {
      console.error('❌ Test suite failed:', error);
    } finally {
      await AppDataSource.destroy();
      console.log('\n🔌 Database connection closed');
    }
  }

  private async testDocumentListing(): Promise<void> {
    console.log('📋 Test 1: Document Listing');
    
    try {
      const documents = await this.documentRepository.find({
        order: { filename: 'ASC' }
      });

      if (documents.length === 6) {
        this.addResult('Document Listing', 'PASS', `Found exactly 6 documents as expected`, {
          count: documents.length,
          files: documents.map(d => d.filename)
        });
        console.log(`   ✅ Found ${documents.length} documents`);
        documents.forEach(doc => {
          console.log(`      - ${doc.filename} (${doc.status})`);
        });
      } else {
        this.addResult('Document Listing', 'FAIL', `Expected 6 documents, found ${documents.length}`);
        console.log(`   ❌ Expected 6 documents, found ${documents.length}`);
      }
    } catch (error) {
      this.addResult('Document Listing', 'FAIL', `Error: ${error}`);
      console.log(`   ❌ Error: ${error}`);
    }
    console.log('');
  }

  private async testDocumentStatus(): Promise<void> {
    console.log('📊 Test 2: Document Status Verification');
    
    try {
      const documents = await this.documentRepository.find();
      const completedDocs = documents.filter(d => d.status === DocumentStatus.COMPLETED);
      const failedDocs = documents.filter(d => d.status === DocumentStatus.FAILED);
      const pendingDocs = documents.filter(d => d.status === DocumentStatus.PENDING);

      if (completedDocs.length === 6 && failedDocs.length === 0 && pendingDocs.length === 0) {
        this.addResult('Document Status', 'PASS', 'All documents are completed successfully', {
          completed: completedDocs.length,
          failed: failedDocs.length,
          pending: pendingDocs.length
        });
        console.log(`   ✅ All ${completedDocs.length} documents completed successfully`);
      } else {
        this.addResult('Document Status', 'FAIL', `Status mismatch: ${completedDocs.length} completed, ${failedDocs.length} failed, ${pendingDocs.length} pending`);
        console.log(`   ❌ Status mismatch: ${completedDocs.length} completed, ${failedDocs.length} failed, ${pendingDocs.length} pending`);
      }
    } catch (error) {
      this.addResult('Document Status', 'FAIL', `Error: ${error}`);
      console.log(`   ❌ Error: ${error}`);
    }
    console.log('');
  }

  private async testDocumentChunkRelationships(): Promise<void> {
    console.log('🔗 Test 3: Document-Chunk Relationships');
    
    try {
      const documents = await this.documentRepository.find();
      let allRelationshipsValid = true;
      const relationshipDetails: any[] = [];

      for (const doc of documents) {
        const chunks = await this.chunkRepository.find({ where: { source: doc.id } });
        
        if (chunks.length === 0) {
          allRelationshipsValid = false;
          relationshipDetails.push({ document: doc.filename, chunks: 0, status: 'NO_CHUNKS' });
        } else {
          relationshipDetails.push({ 
            document: doc.filename, 
            chunks: chunks.length, 
            totalTokens: doc.totalTokens,
            status: 'HAS_CHUNKS' 
          });
        }
      }

      if (allRelationshipsValid) {
        this.addResult('Document-Chunk Relationships', 'PASS', 'All documents have associated chunks', relationshipDetails);
        console.log(`   ✅ All documents have associated chunks`);
        relationshipDetails.forEach(detail => {
          console.log(`      - ${detail.document}: ${detail.chunks} chunks, ${detail.totalTokens} tokens`);
        });
      } else {
        this.addResult('Document-Chunk Relationships', 'FAIL', 'Some documents missing chunks', relationshipDetails);
        console.log(`   ❌ Some documents missing chunks`);
      }
    } catch (error) {
      this.addResult('Document-Chunk Relationships', 'FAIL', `Error: ${error}`);
      console.log(`   ❌ Error: ${error}`);
    }
    console.log('');
  }

  private async testEmbeddingStorage(): Promise<void> {
    console.log('🧠 Test 4: Embedding Storage Verification');
    
    try {
      const chunks = await this.chunkRepository.find();
      const chunksWithEmbeddings = chunks.filter(chunk => {
        try {
          const embedding = JSON.parse(chunk.embedding);
          return Array.isArray(embedding) && embedding.length === 1536;
        } catch {
          return false;
        }
      });

      const totalChunks = chunks.length;
      const validEmbeddings = chunksWithEmbeddings.length;

      if (validEmbeddings === totalChunks && totalChunks > 0) {
        this.addResult('Embedding Storage', 'PASS', `All ${totalChunks} chunks have valid embeddings`, {
          totalChunks,
          validEmbeddings,
          embeddingDimensions: 1536
        });
        console.log(`   ✅ All ${totalChunks} chunks have valid 1536-dimensional embeddings`);
      } else {
        this.addResult('Embedding Storage', 'FAIL', `${validEmbeddings}/${totalChunks} chunks have valid embeddings`);
        console.log(`   ❌ Only ${validEmbeddings}/${totalChunks} chunks have valid embeddings`);
      }
    } catch (error) {
      this.addResult('Embedding Storage', 'FAIL', `Error: ${error}`);
      console.log(`   ❌ Error: ${error}`);
    }
    console.log('');
  }

  private async testVectorSearch(): Promise<void> {
    console.log('🔍 Test 5: Vector Search Functionality');
    
    try {
      const testQueries = [
        'whiteboard challenge framework',
        'UX design process',
        'user research methods',
        'design thinking approach'
      ];

      let searchTestsPassed = 0;
      const searchResults: any[] = [];

      for (const query of testQueries) {
        try {
          const queryEmbedding = await this.vectorService.generateQueryEmbedding(query);
          const results = await this.vectorService.searchSimilar(queryEmbedding, 3);
          
          if (results.length > 0 && results[0].similarity > 0) {
            searchTestsPassed++;
            searchResults.push({
              query,
              resultsFound: results.length,
              topSimilarity: results[0].similarity,
              topChunk: results[0].chunk.content.substring(0, 100) + '...'
            });
            console.log(`   ✅ "${query}": Found ${results.length} results (top similarity: ${results[0].similarity.toFixed(3)})`);
          } else {
            searchResults.push({ query, error: 'No results or zero similarity' });
            console.log(`   ❌ "${query}": No results or zero similarity`);
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          searchResults.push({ query, error: errorMessage });
          console.log(`   ❌ "${query}": Error - ${errorMessage}`);
        }
      }

      if (searchTestsPassed === testQueries.length) {
        this.addResult('Vector Search', 'PASS', `All ${testQueries.length} search queries returned results`, searchResults);
      } else {
        this.addResult('Vector Search', 'FAIL', `${searchTestsPassed}/${testQueries.length} search queries passed`, searchResults);
      }
    } catch (error) {
      this.addResult('Vector Search', 'FAIL', `Error: ${error}`);
      console.log(`   ❌ Error: ${error}`);
    }
    console.log('');
  }

  private async testDocumentMetadata(): Promise<void> {
    console.log('📝 Test 6: Document Metadata Validation');
    
    try {
      const documents = await this.documentRepository.find();
      let metadataValid = true;
      const metadataDetails: any[] = [];

      for (const doc of documents) {
        const issues: string[] = [];
        
        if (!doc.filename) issues.push('Missing filename');
        if (!doc.filePath) issues.push('Missing filePath');
        if (doc.fileSize <= 0) issues.push('Invalid fileSize');
        if (!doc.mimeType) issues.push('Missing mimeType');
        if (doc.totalChunks <= 0) issues.push('Invalid totalChunks');
        if (doc.totalTokens <= 0) issues.push('Invalid totalTokens');

        const isValid = issues.length === 0;
        if (!isValid) metadataValid = false;

        metadataDetails.push({
          filename: doc.filename,
          isValid,
          issues,
          metadata: {
            fileSize: doc.fileSize,
            mimeType: doc.mimeType,
            totalChunks: doc.totalChunks,
            totalTokens: doc.totalTokens
          }
        });

        if (isValid) {
          console.log(`   ✅ ${doc.filename}: All metadata valid`);
        } else {
          console.log(`   ❌ ${doc.filename}: ${issues.join(', ')}`);
        }
      }

      if (metadataValid) {
        this.addResult('Document Metadata', 'PASS', 'All documents have valid metadata', metadataDetails);
      } else {
        this.addResult('Document Metadata', 'FAIL', 'Some documents have invalid metadata', metadataDetails);
      }
    } catch (error) {
      this.addResult('Document Metadata', 'FAIL', `Error: ${error}`);
      console.log(`   ❌ Error: ${error}`);
    }
    console.log('');
  }

  private async testDatabaseIntegrity(): Promise<void> {
    console.log('🔒 Test 7: Database Integrity');
    
    try {
      // Test foreign key relationships
      const documents = await this.documentRepository.find();
      let integrityValid = true;
      const integrityIssues: string[] = [];

      for (const doc of documents) {
        const chunks = await this.chunkRepository.find({ where: { source: doc.id } });
        
        // Check if chunk count matches document totalChunks
        if (chunks.length !== doc.totalChunks) {
          integrityValid = false;
          integrityIssues.push(`${doc.filename}: chunk count mismatch (${chunks.length} vs ${doc.totalChunks})`);
        }

        // Check if all chunks reference valid document
        for (const chunk of chunks) {
          if (chunk.source !== doc.id) {
            integrityValid = false;
            integrityIssues.push(`${doc.filename}: chunk references wrong document`);
          }
        }
      }

      // Test orphaned chunks
      const allChunks = await this.chunkRepository.find();
      const documentIds = documents.map(d => d.id);
      const orphanedChunks = allChunks.filter(chunk => !documentIds.includes(chunk.source));
      
      if (orphanedChunks.length > 0) {
        integrityValid = false;
        integrityIssues.push(`Found ${orphanedChunks.length} orphaned chunks`);
      }

      if (integrityValid) {
        this.addResult('Database Integrity', 'PASS', 'All database relationships are valid', {
          documents: documents.length,
          totalChunks: allChunks.length,
          orphanedChunks: 0
        });
        console.log(`   ✅ Database integrity verified: ${documents.length} documents, ${allChunks.length} chunks`);
      } else {
        this.addResult('Database Integrity', 'FAIL', 'Database integrity issues found', {
          issues: integrityIssues,
          orphanedChunks: orphanedChunks.length
        });
        console.log(`   ❌ Database integrity issues:`);
        integrityIssues.forEach(issue => console.log(`      - ${issue}`));
      }
    } catch (error) {
      this.addResult('Database Integrity', 'FAIL', `Error: ${error}`);
      console.log(`   ❌ Error: ${error}`);
    }
    console.log('');
  }

  private addResult(test: string, status: 'PASS' | 'FAIL', message: string, details?: any): void {
    this.results.push({ test, status, message, details });
  }

  private printResultsSummary(): void {
    console.log('📊 TEST RESULTS SUMMARY');
    console.log('='.repeat(50));
    
    const passed = this.results.filter(r => r.status === 'PASS').length;
    const failed = this.results.filter(r => r.status === 'FAIL').length;
    const total = this.results.length;

    console.log(`Total Tests: ${total}`);
    console.log(`✅ Passed: ${passed}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`Success Rate: ${((passed / total) * 100).toFixed(1)}%`);
    console.log('');

    if (failed > 0) {
      console.log('❌ FAILED TESTS:');
      this.results.filter(r => r.status === 'FAIL').forEach(result => {
        console.log(`   - ${result.test}: ${result.message}`);
      });
      console.log('');
    }

    if (passed === total) {
      console.log('🎉 ALL TESTS PASSED! Document CRUD operations are working correctly.');
    } else {
      console.log('⚠️  Some tests failed. Please review the issues above.');
    }
  }
}

// Run the tests
async function runDocumentCRUDTests() {
  const tester = new DocumentCRUDTester();
  await tester.runAllTests();
}

runDocumentCRUDTests().catch(error => {
  console.error('❌ Test suite failed:', error);
  process.exit(1);
});
