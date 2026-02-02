import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { FeatureFlagEntity } from './entities/feature-flag.entity';
import { FlagRuleEntity } from './entities/flag-rule.entity';
import { AuditLogEntity } from './entities/audit-log.entity';
import { FeatureFlagRepository } from './repositories/feature-flag.repository';
import { FlagRuleRepository } from './repositories/flag-rule.repository';
import { AuditLogRepository } from './repositories/audit-log.repository';

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                type: 'postgres',
                host: configService.get<string>('database.host'),
                port: configService.get<number>('database.port'),
                username: configService.get<string>('database.username'),
                password: configService.get<string>('database.password'),
                database: configService.get<string>('database.database'),
                synchronize: configService.get<boolean>('database.synchronize'),
                logging: configService.get<boolean>('database.logging'),
                entities: [FeatureFlagEntity, FlagRuleEntity, AuditLogEntity],
                migrations: ['dist/infrastructure/database/migrations/*.js'],
            }),
        }),
        TypeOrmModule.forFeature([FeatureFlagEntity, FlagRuleEntity, AuditLogEntity]),
    ],
    providers: [FeatureFlagRepository, FlagRuleRepository, AuditLogRepository],
    exports: [FeatureFlagRepository, FlagRuleRepository, AuditLogRepository],
})
export class DatabaseModule { }
