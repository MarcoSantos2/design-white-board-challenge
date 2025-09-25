import 'reflect-metadata';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs/promises';
import { DocumentProcessingService } from '../services/documentProcessingService';
import { VectorService } from '../services/vectorService';
import AppDataSource from '../config/datasource';

// Load environment variables
dotenv.config();

async function processSourceDocuments() {
  try {
    console.log('🚀 Starting document processing...');
    
    // Initialize database connection
    await AppDataSource.initialize();
    console.log('✅ Database connected');

    const documentService = new DocumentProcessingService();
    const vectorService = new VectorService();

    // Get source documents directory
    const sourceDir = path.join(__dirname, '../source_documents');
    const files = await fs.readdir(sourceDir);

    console.log(`📁 Found ${files.length} files in source directory`);

    for (const file of files) {
      const filePath = path.join(sourceDir, file);
      const ext = path.extname(file).toLowerCase();
      
      // Only process PDF and DOCX files
      if (ext === '.pdf' || ext === '.docx') {
        console.log(`\n📄 Processing: ${file}`);
        
        try {
          const document = await documentService.processDocument(filePath, file);
          console.log(`✅ Document processed: ${document.id}`);
          console.log(`   - Status: ${document.status}`);
          console.log(`   - Chunks: ${document.totalChunks}`);
          console.log(`   - Tokens: ${document.totalTokens}`);
        } catch (error) {
          console.error(`❌ Error processing ${file}:`, error);
        }
      } else {
        console.log(`⏭️  Skipping ${file} (unsupported format)`);
      }
    }

    console.log('\n🔄 Generating embeddings for all chunks...');
    await vectorService.processPendingChunks();
    console.log('✅ Embedding generation completed');

    console.log('\n📊 Summary:');
    const documents = await documentService.getDocuments();
    console.log(`   - Total documents: ${documents.length}`);
    
    const completedDocs = documents.filter(doc => doc.status === 'completed');
    const failedDocs = documents.filter(doc => doc.status === 'failed');
    
    console.log(`   - Completed: ${completedDocs.length}`);
    console.log(`   - Failed: ${failedDocs.length}`);
    
    if (failedDocs.length > 0) {
      console.log('\n❌ Failed documents:');
      failedDocs.forEach(doc => {
        console.log(`   - ${doc.originalName}: ${doc.errorMessage}`);
      });
    }

  } catch (error) {
    console.error('💥 Fatal error:', error);
  } finally {
    await AppDataSource.destroy();
    console.log('🔌 Database connection closed');
  }
}

// Run the script
if (require.main === module) {
  processSourceDocuments();
}

export { processSourceDocuments };

