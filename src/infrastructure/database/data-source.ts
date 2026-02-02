import { DataSource } from 'typeorm';
import { config } from 'dotenv';

config();

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_DATABASE || 'feature_flags',
    synchronize: false,
    logging: process.env.DB_LOGGING === 'true',
    entities: ['src/infrastructure/database/entities/*.entity.ts'],
    migrations: ['src/infrastructure/database/migrations/*.ts'],
    subscribers: [],
});
