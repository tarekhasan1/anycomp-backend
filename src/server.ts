import 'reflect-metadata';
import { createApp } from './app';
import { AppDataSource } from './config/database';
import { env } from './config/env';

const startServer = async () => {
  try {
    // Initialize database connection
    await AppDataSource.initialize();
    console.log('✅ Database connected successfully');

    // Create Express app
    const app = createApp();

    // Use PORT from environment (Railway sets this)
    const PORT = parseInt(process.env.PORT || '5000');
    
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`🌍 Environment: ${env.NODE_ENV}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();