import { Controller, Get } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { CacheService } from '../../infrastructure/cache/cache.service';

interface HealthCheckResponse {
  status: 'healthy' | 'degraded';
  timestamp: string;
  uptime: number;
  service: string;
  database: 'connected' | 'disconnected';
  cache: 'connected' | 'disconnected';
}

@Controller('health')
export class HealthController {
  constructor(
    private readonly dataSource: DataSource,
    private readonly cacheService: CacheService,
  ) { }

  @Get()
  check(): HealthCheckResponse {
    const isDatabaseHealthy = this.dataSource.isInitialized;
    const isCacheHealthy = this.cacheService.isHealthy();

    return {
      status: isDatabaseHealthy && isCacheHealthy ? 'healthy' : 'degraded',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      service: 'feature-flags',
      database: isDatabaseHealthy ? 'connected' : 'disconnected',
      cache: isCacheHealthy ? 'connected' : 'disconnected',
    };
  }
}
