import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
import { Specialist } from '../entities/Specialist.entity';
import { ServiceOffering } from '../entities/ServiceOffering.entity';
import { PlatformFee } from '../entities/PlatformFee.entity';
import { Media } from '../entities/Media.entity';

dotenv.config();

// Parse DATABASE_URL if provided (Railway uses this)
const getDatabaseConfig = () => {
  if (process.env.DATABASE_URL) {
    const url = new URL(process.env.DATABASE_URL);
    return {
      type: 'postgres' as const,
      host: url.hostname,
      port: parseInt(url.port || '5432'),
      username: url.username,
      password: url.password,
      database: url.pathname.slice(1), // Remove leading /
      ssl: url.protocol === 'postgresql+ssl:' ? { rejectUnauthorized: false } : false,
    };
  }

  // Fallback to Railway's standard PostgreSQL variables
  return {
    type: 'postgres' as const,
    host: process.env.PGHOST || 'localhost',
    port: parseInt(process.env.PGPORT || '5432'),
    username: process.env.PGUSER || 'postgres',
    password: process.env.PGPASSWORD || 'postgres',
    database: process.env.PGDATABASE || 'anycomp_db',
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
  };
};

const dbConfig = getDatabaseConfig();

export const AppDataSource = new DataSource({
  ...dbConfig,
  synchronize: process.env.NODE_ENV !== 'production', // IMPORTANT: false in production
  logging: process.env.NODE_ENV === 'development',
  entities: [Specialist, ServiceOffering, PlatformFee, Media],
  migrations: ['src/migrations/**/*.ts'],
  subscribers: [],
});