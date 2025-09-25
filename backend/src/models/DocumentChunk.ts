import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

@Entity('document_chunks')
@Index(['source', 'chunkIndex']) // Index for efficient queries by source
@Index(['source', 'page']) // Index for page-based queries
export class DocumentChunk {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  content: string;

  @Column()
  source: string; // Original document filename/path

  @Column({ nullable: true })
  page?: number; // Page number for PDFs

  @Column({ nullable: true })
  section?: string; // Section title or heading

  @Column({ type: 'int', default: 0 })
  chunkIndex: number; // Order of chunk within document

  @Column({ type: 'int', default: 0 })
  tokenCount: number; // Number of tokens in this chunk

  // Vector embedding - 1536 dimensions for OpenAI embeddings
  @Column({ type: 'text' })
  embedding: string; // Store as JSON string, we'll parse it in the service

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
