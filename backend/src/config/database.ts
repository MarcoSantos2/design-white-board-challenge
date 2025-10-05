import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User, Conversation, Message, Document, DocumentChunk } from '../models';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'ux_interview_app',
  synchronize: process.env.NODE_ENV === 'development', // Only sync in development
  logging: process.env.NODE_ENV === 'development',
  entities: [User, Conversation, Message, Document, DocumentChunk],
  migrations: ['src/migrations/*.ts'],
  subscribers: ['src/subscribers/*.ts'],
  migrationsRun: process.env.NODE_ENV !== 'development', // Auto-run migrations in production
}); 