import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { AppDataSource } from './config/database';
import chatRoutes from './routes/chatRoutes';
import authRoutes from './routes/authRoutes';
import { optionalAuth } from './middleware/auth';
import ragRoutes from './routes/ragRoutes';
import testRAGRoutes from './routes/testRAGRoutes';
// Import all models to ensure they're registered with TypeORM
import './models';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize database connection
AppDataSource.initialize()
  .then(() => {
    console.log('Database connection initialized successfully');
  })
  .catch((error) => {
    console.error('Error during database initialization:', error);
  });

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/chat', optionalAuth, chatRoutes);
app.use('/api/rag', ragRoutes);
app.use('/api/test-rag', testRAGRoutes);

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'UX Whiteboard Challenge API' });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    database: AppDataSource.isInitialized ? 'Connected' : 'Disconnected'
  });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 