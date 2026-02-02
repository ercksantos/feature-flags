import { Module, Global, OnModuleDestroy } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RedisService } from './redis.service';
import { CacheService } from './cache.service';

@Global()
@Module({
    imports: [ConfigModule],
    providers: [RedisService, CacheService],
    exports: [RedisService, CacheService],
})
export class RedisModule implements OnModuleDestroy {
    constructor(private readonly redisService: RedisService) { }

    async onModuleDestroy(): Promise<void> {
        await this.redisService.disconnect();
    }
}
