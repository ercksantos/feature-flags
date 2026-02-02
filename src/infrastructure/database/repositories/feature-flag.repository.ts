import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FeatureFlagEntity } from '../entities/feature-flag.entity';
import { FeatureFlagMapper } from '../mappers/feature-flag.mapper';
import {
    IFeatureFlagRepository,
    FindFlagsOptions,
    FeatureFlag,
    Environment,
} from '@domain/index';

@Injectable()
export class FeatureFlagRepository implements IFeatureFlagRepository {
    constructor(
        @InjectRepository(FeatureFlagEntity)
        private readonly repository: Repository<FeatureFlagEntity>,
    ) { }

    async create(flag: FeatureFlag): Promise<FeatureFlag> {
        const entity = FeatureFlagMapper.toEntity(flag);
        const saved = await this.repository.save(entity);
        return FeatureFlagMapper.toDomain(saved);
    }

    async update(flag: FeatureFlag): Promise<FeatureFlag> {
        const entity = FeatureFlagMapper.toEntity(flag);
        const updated = await this.repository.save(entity);
        return FeatureFlagMapper.toDomain(updated);
    }

    async delete(id: string): Promise<void> {
        await this.repository.delete(id);
    }

    async findById(id: string): Promise<FeatureFlag | null> {
        const entity = await this.repository.findOne({ where: { id } });
        return entity ? FeatureFlagMapper.toDomain(entity) : null;
    }

    async findByKey(key: string, environment: Environment): Promise<FeatureFlag | null> {
        const entity = await this.repository.findOne({
            where: { key, environment },
        });
        return entity ? FeatureFlagMapper.toDomain(entity) : null;
    }

    async findAll(options?: FindFlagsOptions): Promise<FeatureFlag[]> {
        const queryBuilder = this.repository.createQueryBuilder('flag');

        if (options?.environment) {
            queryBuilder.andWhere('flag.environment = :environment', {
                environment: options.environment,
            });
        }

        if (options?.status) {
            queryBuilder.andWhere('flag.status = :status', { status: options.status });
        }

        if (options?.type) {
            queryBuilder.andWhere('flag.type = :type', { type: options.type });
        }

        if (options?.search) {
            queryBuilder.andWhere('(flag.key ILIKE :search OR flag.name ILIKE :search)', {
                search: `%${options.search}%`,
            });
        }

        if (options?.limit) {
            queryBuilder.limit(options.limit);
        }

        if (options?.offset) {
            queryBuilder.offset(options.offset);
        }

        queryBuilder.orderBy('flag.createdAt', 'DESC');

        const entities = await queryBuilder.getMany();
        return entities.map((entity) => FeatureFlagMapper.toDomain(entity));
    }

    async exists(key: string, environment: Environment): Promise<boolean> {
        const count = await this.repository.count({ where: { key, environment } });
        return count > 0;
    }

    async count(options?: FindFlagsOptions): Promise<number> {
        const queryBuilder = this.repository.createQueryBuilder('flag');

        if (options?.environment) {
            queryBuilder.andWhere('flag.environment = :environment', {
                environment: options.environment,
            });
        }

        if (options?.status) {
            queryBuilder.andWhere('flag.status = :status', { status: options.status });
        }

        if (options?.type) {
            queryBuilder.andWhere('flag.type = :type', { type: options.type });
        }

        if (options?.search) {
            queryBuilder.andWhere('(flag.key ILIKE :search OR flag.name ILIKE :search)', {
                search: `%${options.search}%`,
            });
        }

        return await queryBuilder.getCount();
    }
}
