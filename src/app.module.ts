import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggingModule } from './infrastructure/logging/logging.module';
import { DatabaseModule } from './infrastructure/database/database.module';
import { RedisModule } from './infrastructure/cache/redis.module';
import { HealthController } from './presentation/controllers/health.controller';
import appConfig from './infrastructure/config/app.config';
import databaseConfig from './infrastructure/config/database.config';
import redisConfig from './infrastructure/config/redis.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig, redisConfig],
      envFilePath: ['.env.local', '.env'],
    }),
    LoggingModule,
    DatabaseModule,
    RedisModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
