import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { DocumentChunk } from './DocumentChunk';

export enum DocumentStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed'
}

@Entity('documents')
export class Document {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  filename: string;

  @Column()
  originalName: string;

  @Column()
  filePath: string;

  @Column({ type: 'bigint' })
  fileSize: number;

  @Column()
  mimeType: string;

  @Column({ type: 'enum', enum: DocumentStatus, default: DocumentStatus.PENDING })
  status: DocumentStatus;

  @Column({ type: 'int', default: 0 })
  totalChunks: number;

  @Column({ type: 'int', default: 0 })
  totalTokens: number;

  @Column({ type: 'text', nullable: true })
  errorMessage?: string;

  @OneToMany(() => DocumentChunk, chunk => chunk.source, { cascade: true })
  chunks: DocumentChunk[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
