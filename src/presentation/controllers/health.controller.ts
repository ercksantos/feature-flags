import { Controller, Get } from '@nestjs/common';

interface HealthCheckResponse {
  status: 'healthy';
  timestamp: string;
  uptime: number;
  service: string;
}

@Controller('health')
export class HealthController {
  @Get()
  check(): HealthCheckResponse {
    return {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      service: 'feature-flags',
    };
  }
}
