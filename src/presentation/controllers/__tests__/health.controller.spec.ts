import { Test, TestingModule } from '@nestjs/testing';
import { HealthController } from '../health.controller';
import { DataSource } from 'typeorm';
import { CacheService } from '../../../infrastructure/cache/cache.service';

describe('HealthController', () => {
  let controller: HealthController;

  beforeEach(async () => {
    const mockDataSource = {
      isInitialized: true,
    };

    const mockCacheService = {
      isHealthy: jest.fn().mockReturnValue(true),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [
        {
          provide: DataSource,
          useValue: mockDataSource,
        },
        {
          provide: CacheService,
          useValue: mockCacheService,
        },
      ],
    }).compile();

    controller = module.get<HealthController>(HealthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('check', () => {
    it('should return health check status', () => {
      const result = controller.check();

      expect(result).toMatchObject({
        status: expect.any(String),
        timestamp: expect.any(String),
        uptime: expect.any(Number),
        service: 'feature-flags',
        database: expect.any(String),
        cache: expect.any(String),
      });
    });

    it('should return valid ISO 8601 timestamp', () => {
      const result = controller.check();
      const timestamp = new Date(result.timestamp);

      expect(timestamp.toISOString()).toBe(result.timestamp);
    });
  });
});
