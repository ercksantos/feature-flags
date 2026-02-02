import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { AuditLogEntity } from '../entities/audit-log.entity';
import { AuditLogMapper } from '../mappers/audit-log.mapper';
import { IAuditLogRepository, FindAuditLogsOptions, AuditLog } from '@domain/index';

@Injectable()
export class AuditLogRepository implements IAuditLogRepository {
    constructor(
        @InjectRepository(AuditLogEntity)
        private readonly repository: Repository<AuditLogEntity>,
    ) { }

    async create(auditLog: AuditLog): Promise<AuditLog> {
        const entity = AuditLogMapper.toEntity(auditLog);
        const saved = await this.repository.save(entity);
        return AuditLogMapper.toDomain(saved);
    }

    async findById(id: string): Promise<AuditLog | null> {
        const entity = await this.repository.findOne({ where: { id } });
        return entity ? AuditLogMapper.toDomain(entity) : null;
    }

    async findByFeatureFlagId(featureFlagId: string): Promise<AuditLog[]> {
        const entities = await this.repository.find({
            where: { featureFlagId },
            order: { timestamp: 'DESC' },
        });
        return entities.map((entity) => AuditLogMapper.toDomain(entity));
    }

    async findAll(options?: FindAuditLogsOptions): Promise<AuditLog[]> {
        const queryBuilder = this.repository.createQueryBuilder('audit');

        if (options?.featureFlagId) {
            queryBuilder.andWhere('audit.featureFlagId = :featureFlagId', {
                featureFlagId: options.featureFlagId,
            });
        }

        if (options?.author) {
            queryBuilder.andWhere('audit.author = :author', { author: options.author });
        }

        if (options?.action) {
            queryBuilder.andWhere('audit.action = :action', { action: options.action });
        }

        if (options?.startDate && options?.endDate) {
            queryBuilder.andWhere('audit.timestamp BETWEEN :startDate AND :endDate', {
                startDate: options.startDate,
                endDate: options.endDate,
            });
        } else if (options?.startDate) {
            queryBuilder.andWhere('audit.timestamp >= :startDate', {
                startDate: options.startDate,
            });
        } else if (options?.endDate) {
            queryBuilder.andWhere('audit.timestamp <= :endDate', {
                endDate: options.endDate,
            });
        }

        if (options?.limit) {
            queryBuilder.limit(options.limit);
        }

        if (options?.offset) {
            queryBuilder.offset(options.offset);
        }

        queryBuilder.orderBy('audit.timestamp', 'DESC');

        const entities = await queryBuilder.getMany();
        return entities.map((entity) => AuditLogMapper.toDomain(entity));
    }

    async count(options?: FindAuditLogsOptions): Promise<number> {
        const queryBuilder = this.repository.createQueryBuilder('audit');

        if (options?.featureFlagId) {
            queryBuilder.andWhere('audit.featureFlagId = :featureFlagId', {
                featureFlagId: options.featureFlagId,
            });
        }

        if (options?.author) {
            queryBuilder.andWhere('audit.author = :author', { author: options.author });
        }

        if (options?.action) {
            queryBuilder.andWhere('audit.action = :action', { action: options.action });
        }

        if (options?.startDate && options?.endDate) {
            queryBuilder.andWhere('audit.timestamp BETWEEN :startDate AND :endDate', {
                startDate: options.startDate,
                endDate: options.endDate,
            });
        } else if (options?.startDate) {
            queryBuilder.andWhere('audit.timestamp >= :startDate', {
                startDate: options.startDate,
            });
        } else if (options?.endDate) {
            queryBuilder.andWhere('audit.timestamp <= :endDate', {
                endDate: options.endDate,
            });
        }

        return await queryBuilder.getCount();
    }
}
