import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FlagRuleEntity } from '../entities/flag-rule.entity';
import { FlagRuleMapper } from '../mappers/flag-rule.mapper';
import { IFlagRuleRepository, FindRulesOptions, FlagRule } from '@domain/index';

@Injectable()
export class FlagRuleRepository implements IFlagRuleRepository {
    constructor(
        @InjectRepository(FlagRuleEntity)
        private readonly repository: Repository<FlagRuleEntity>,
    ) { }

    async create(rule: FlagRule): Promise<FlagRule> {
        const entity = FlagRuleMapper.toEntity(rule);
        const saved = await this.repository.save(entity);
        return FlagRuleMapper.toDomain(saved);
    }

    async update(rule: FlagRule): Promise<FlagRule> {
        const entity = FlagRuleMapper.toEntity(rule);
        const updated = await this.repository.save(entity);
        return FlagRuleMapper.toDomain(updated);
    }

    async delete(id: string): Promise<void> {
        await this.repository.delete(id);
    }

    async findById(id: string): Promise<FlagRule | null> {
        const entity = await this.repository.findOne({ where: { id } });
        return entity ? FlagRuleMapper.toDomain(entity) : null;
    }

    async findByFeatureFlagId(featureFlagId: string): Promise<FlagRule[]> {
        const entities = await this.repository.find({
            where: { featureFlagId },
            order: { priority: 'DESC', createdAt: 'ASC' },
        });
        return entities.map((entity) => FlagRuleMapper.toDomain(entity));
    }

    async findAll(options?: FindRulesOptions): Promise<FlagRule[]> {
        const queryBuilder = this.repository.createQueryBuilder('rule');

        if (options?.featureFlagId) {
            queryBuilder.andWhere('rule.featureFlagId = :featureFlagId', {
                featureFlagId: options.featureFlagId,
            });
        }

        if (options?.enabled !== undefined) {
            queryBuilder.andWhere('rule.enabled = :enabled', { enabled: options.enabled });
        }

        queryBuilder.orderBy('rule.priority', 'DESC');
        queryBuilder.addOrderBy('rule.createdAt', 'ASC');

        const entities = await queryBuilder.getMany();
        return entities.map((entity) => FlagRuleMapper.toDomain(entity));
    }
}
