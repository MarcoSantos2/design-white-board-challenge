import fs from 'fs/promises';
import path from 'path';
import pdf from 'pdf-parse';
import mammoth from 'mammoth';
import { Document, DocumentStatus, DocumentChunk } from '../models';
import AppDataSource from '../config/datasource';

export interface ProcessedChunk {
  content: string;
  source: string;
  page?: number;
  section?: string;
  chunkIndex: number;
  tokenCount: number;
}

export class DocumentProcessingService {
  private documentRepository = AppDataSource.getRepository(Document);
  private chunkRepository = AppDataSource.getRepository(DocumentChunk);

  /**
   * Process a document file and extract text chunks
   */
  async processDocument(filePath: string, originalName: string): Promise<Document> {
    try {
      // Check if document already exists and is completed
      let document = await this.documentRepository.findOne({ 
        where: { filePath: filePath } 
      });

      if (document && document.status === DocumentStatus.COMPLETED) {
        console.log(`Document ${path.basename(filePath)} already processed successfully, skipping.`);
        return document;
      }

      if (document && document.status === DocumentStatus.PROCESSING) {
        console.log(`Document ${path.basename(filePath)} is currently being processed, skipping.`);
        return document;
      }

      // Get file stats
      const stats = await fs.stat(filePath);
      const ext = path.extname(filePath).toLowerCase();
      
      // Create document record
      document = this.documentRepository.create({
        filename: path.basename(filePath),
        originalName,
        filePath,
        fileSize: stats.size,
        mimeType: this.getMimeType(ext),
        status: DocumentStatus.PROCESSING
      });
      
      await this.documentRepository.save(document);

      // Extract text based on file type
      let text: string;
      switch (ext) {
        case '.pdf':
          text = await this.extractFromPDF(filePath);
          break;
        case '.docx':
          text = await this.extractFromDocx(filePath);
          break;
        default:
          throw new Error(`Unsupported file type: ${ext}`);
      }

      // Clean and chunk the text
      const cleanedText = this.cleanText(text);
      const chunks = this.chunkText(cleanedText, document.id);

      // Save chunks to database
      const documentChunks = chunks.map(chunk => {
        const docChunk = this.chunkRepository.create({
          content: chunk.content,
          source: document.id,
          page: chunk.page,
          section: chunk.section,
          chunkIndex: chunk.chunkIndex,
          tokenCount: chunk.tokenCount,
          embedding: '[]' // Empty JSON array - will be filled when we generate embeddings
        });
        return docChunk;
      });

      await this.chunkRepository.save(documentChunks);

      // Update document status
      document.status = DocumentStatus.COMPLETED;
      document.totalChunks = chunks.length;
      document.totalTokens = chunks.reduce((sum, chunk) => sum + chunk.tokenCount, 0);

      await this.documentRepository.save(document);

      return document;
    } catch (error) {
      // Update document status to failed
      const document = await this.documentRepository.findOne({ where: { filePath } });
      if (document) {
        document.status = DocumentStatus.FAILED;
        document.errorMessage = error instanceof Error ? error.message : 'Unknown error';
        await this.documentRepository.save(document);
      }
      throw error;
    }
  }

  /**
   * Extract text from PDF file
   */
  private async extractFromPDF(filePath: string): Promise<string> {
    const dataBuffer = await fs.readFile(filePath);
    const data = await pdf(dataBuffer);
    return data.text;
  }

  /**
   * Extract text from DOCX file
   */
  private async extractFromDocx(filePath: string): Promise<string> {
    const buffer = await fs.readFile(filePath);
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  }

  /**
   * Clean and normalize text
   */
  private cleanText(text: string): string {
    return text
      .replace(/\s+/g, ' ')           // Normalize whitespace
      .replace(/\n{3,}/g, '\n\n')     // Limit consecutive newlines
      .trim()
      .replace(/[^\w\s.,!?;:()-]/g, '') // Remove special chars
      .replace(/\s+([.,!?;:])/g, '$1'); // Fix punctuation spacing
  }

  /**
   * Split text into chunks with intelligent boundaries
   */
  private chunkText(text: string, source: string): ProcessedChunk[] {
    const maxChunkSize = 1000; // tokens (roughly 750-1000 characters)
    const overlap = 100; // characters overlap between chunks
    
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const chunks: ProcessedChunk[] = [];
    let currentChunk = '';
    let chunkIndex = 0;

    for (let i = 0; i < sentences.length; i++) {
      const sentence = sentences[i].trim() + '. ';
      
      if ((currentChunk + sentence).length > maxChunkSize && currentChunk.length > 0) {
        // Save current chunk
        chunks.push({
          content: currentChunk.trim(),
          source,
          chunkIndex,
          tokenCount: this.estimateTokenCount(currentChunk)
        });
        
        // Start new chunk with overlap
        const overlapText = currentChunk.slice(-overlap);
        currentChunk = overlapText + sentence;
        chunkIndex++;
      } else {
        currentChunk += sentence;
      }
    }

    // Add the last chunk if it has content
    if (currentChunk.trim()) {
      chunks.push({
        content: currentChunk.trim(),
        source,
        chunkIndex,
        tokenCount: this.estimateTokenCount(currentChunk)
      });
    }

    return chunks;
  }

  /**
   * Estimate token count (rough approximation: 1 token ≈ 0.75 characters)
   */
  private estimateTokenCount(text: string): number {
    return Math.ceil(text.length / 0.75);
  }

  /**
   * Get MIME type based on file extension
   */
  private getMimeType(ext: string): string {
    const mimeTypes: { [key: string]: string } = {
      '.pdf': 'application/pdf',
      '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      '.doc': 'application/msword'
    };
    return mimeTypes[ext] || 'application/octet-stream';
  }

  /**
   * Get all processed documents
   */
  async getDocuments(): Promise<Document[]> {
    return await this.documentRepository.find({
      order: { createdAt: 'DESC' }
    });
  }

  /**
   * Get document by ID
   */
  async getDocumentById(id: string): Promise<Document | null> {
    return await this.documentRepository.findOne({
      where: { id },
      relations: ['chunks']
    });
  }

  /**
   * Delete document and its chunks
   */
  async deleteDocument(id: string): Promise<void> {
    await this.chunkRepository.delete({ source: id });
    await this.documentRepository.delete(id);
  }
}
