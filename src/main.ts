import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from 'nestjs-pino';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, { bufferLogs: true });

    // Logger
    app.useLogger(app.get(Logger));

    // Config
    const configService = app.get(ConfigService);
    const port = configService.get<number>('app.port', 3000);

    // CORS
    app.enableCors();

    // Global prefix
    app.setGlobalPrefix('api/v1');

    await app.listen(port);

    const logger = app.get(Logger);
    logger.log(`🚀 Application running on: http://localhost:${port}/api/v1`);
    logger.log(`🏥 Health check: http://localhost:${port}/api/v1/health`);
}

bootstrap();
