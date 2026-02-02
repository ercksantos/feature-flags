import { Injectable, Logger } from '@nestjs/common';
import { RedisService } from './redis.service';

@Injectable()
export class CacheService {
  private readonly logger = new Logger(CacheService.name);

  constructor(private readonly redisService: RedisService) {}

  async get<T>(key: string): Promise<T | null> {
    try {
      const client = this.redisService.getClient();
      
      if (!client || !this.redisService.isHealthy()) {
        this.logger.warn('Redis not available, returning null');
        return null;
      }

      const value = await client.get(key);
      
      if (!value) {
        return null;
      }

      return JSON.parse(value) as T;
    } catch (error) {
      this.logger.error(`Failed to get cache key: ${key}`, error);
      return null;
    }
  }

  async set(key: string, value: unknown, ttl?: number): Promise<boolean> {
    try {
      const client = this.redisService.getClient();
      
      if (!client || !this.redisService.isHealthy()) {
        this.logger.warn('Redis not available, skipping cache set');
        return false;
      }

      const serialized = JSON.stringify(value);

      if (ttl) {
        await client.setEx(key, ttl, serialized);
      } else {
        await client.set(key, serialized);
      }

      return true;
    } catch (error) {
      this.logger.error(`Failed to set cache key: ${key}`, error);
      return false;
    }
  }

  async delete(key: string): Promise<boolean> {
    try {
      const client = this.redisService.getClient();
      
      if (!client || !this.redisService.isHealthy()) {
        this.logger.warn('Redis not available, skipping cache delete');
        return false;
      }

      await client.del(key);
      return true;
    } catch (error) {
      this.logger.error(`Failed to delete cache key: ${key}`, error);
      return false;
    }
  }

  async deletePattern(pattern: string): Promise<number> {
    try {
      const client = this.redisService.getClient();
      
      if (!client || !this.redisService.isHealthy()) {
        this.logger.warn('Redis not available, skipping pattern delete');
        return 0;
      }

      // Busca todas as keys que correspondem ao padrão
      const keys = await client.keys(pattern);
      
      if (keys.length === 0) {
        return 0;
      }

      // Deleta todas as keys encontradas
      await client.del(keys);
      
      this.logger.log(`Deleted ${keys.length} keys matching pattern: ${pattern}`);
      return keys.length;
    } catch (error) {
      this.logger.error(`Failed to delete pattern: ${pattern}`, error);
      return 0;
    }
  }

  async invalidateFlag(flagKey: string, environment: string): Promise<void> {
    try {
      const client = this.redisService.getClient();
      
      if (!client || !this.redisService.isHealthy()) {
        this.logger.warn('Redis not available, skipping invalidation');
        return;
      }

      // Invalida cache específico da flag
      const flagCacheKey = `flag:${environment}:${flagKey}`;
      await this.delete(flagCacheKey);

      // Invalida lista de flags do ambiente
      const listCacheKey = `flags:${environment}:list`;
      await this.delete(listCacheKey);

      this.logger.log(`Invalidated cache for flag: ${flagKey} in ${environment}`);
    } catch (error) {
      this.logger.error(`Failed to invalidate flag cache: ${flagKey}`, error);
    }
  }

  async invalidateAllFlags(environment?: string): Promise<void> {
    try {
      const client = this.redisService.getClient();
      
      if (!client || !this.redisService.isHealthy()) {
        this.logger.warn('Redis not available, skipping invalidation');
        return;
      }

      if (environment) {
        // Invalida todas as flags de um ambiente específico
        await this.deletePattern(`flag:${environment}:*`);
        await this.deletePattern(`flags:${environment}:*`);
        this.logger.log(`Invalidated all flags cache for environment: ${environment}`);
      } else {
        // Invalida tudo relacionado a flags
        await this.deletePattern('flag:*');
        await this.deletePattern('flags:*');
        this.logger.log('Invalidated all flags cache');
      }
    } catch (error) {
      this.logger.error('Failed to invalidate all flags cache', error);
    }
  }

  async flush(): Promise<boolean> {
    try {
      const client = this.redisService.getClient();
      
      if (!client || !this.redisService.isHealthy()) {
        this.logger.warn('Redis not available, skipping flush');
        return false;
      }

      await client.flushDb();
      this.logger.log('Redis cache flushed successfully');
      return true;
    } catch (error) {
      this.logger.error('Failed to flush Redis cache', error);
      return false;
    }
  }

  isHealthy(): boolean {
    return this.redisService.isHealthy();
  }
}
