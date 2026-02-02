import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, RedisClientType } from 'redis';

@Injectable()
export class RedisService implements OnModuleInit {
  private client: RedisClientType | null = null;
  private isConnected = false;
  private readonly logger = new Logger(RedisService.name);

  constructor(private readonly configService: ConfigService) {}

  async onModuleInit(): Promise<void> {
    await this.connect();
  }

  private async connect(): Promise<void> {
    try {
      const host = this.configService.get<string>('REDIS_HOST', 'localhost');
      const port = this.configService.get<number>('REDIS_PORT', 6379);
      const password = this.configService.get<string>('REDIS_PASSWORD');
      const db = this.configService.get<number>('REDIS_DB', 0);

      const url = password
        ? `redis://:${password}@${host}:${port}/${db}`
        : `redis://${host}:${port}/${db}`;

      this.client = createClient({
        url,
        socket: {
          reconnectStrategy: (retries) => {
            const delay = Math.min(retries * 50, 2000);
            return delay;
          },
        },
      });

      this.client.on('connect', () => {
        this.logger.log('Connecting to Redis...');
      });

      this.client.on('ready', () => {
        this.isConnected = true;
        this.logger.log('Redis connected successfully');
      });

      this.client.on('error', (error) => {
        this.isConnected = false;
        this.logger.error('Redis connection error', error);
      });

      this.client.on('end', () => {
        this.isConnected = false;
        this.logger.warn('Redis connection closed');
      });

      this.client.on('reconnecting', () => {
        this.logger.log('Reconnecting to Redis...');
      });

      await this.client.connect();
      await this.client.ping();
    } catch (error) {
      this.isConnected = false;
      this.logger.error('Failed to connect to Redis', error);
    }
  }

  async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.quit();
      this.client = null;
      this.isConnected = false;
      this.logger.log('Redis disconnected');
    }
  }

  getClient(): RedisClientType | null {
    return this.client;
  }

  isHealthy(): boolean {
    return this.isConnected && this.client !== null;
  }
}
