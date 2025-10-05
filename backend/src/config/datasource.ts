import 'reflect-metadata';
import dotenv from 'dotenv';
import { DataSource } from 'typeorm';
import { User, Conversation, Message, Document, DocumentChunk } from '../models';

// Load environment variables
dotenv.config();

const dataSourceOptions = {
  type: 'postgres' as const,
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'ux_interview_app',
  synchronize: false, // Always false for migrations
  logging: process.env.NODE_ENV === 'development',
  entities: [User, Conversation, Message, Document, DocumentChunk],
  migrations: ['src/migrations/*.ts'],
  subscribers: ['src/subscribers/*.ts'],
};

const AppDataSourceMigrations = new DataSource(dataSourceOptions);

export default AppDataSourceMigrations; 