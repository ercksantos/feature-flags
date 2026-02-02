import { FlagRuleEntity } from '../entities/flag-rule.entity';
import { FlagRule, RuleCondition } from '@domain/index';

export class FlagRuleMapper {
    static toDomain(entity: FlagRuleEntity): FlagRule {
        return new FlagRule(
            entity.id,
            entity.featureFlagId,
            entity.name,
            entity.conditions as RuleCondition[],
            entity.rolloutPercentage,
            entity.enabled,
            entity.priority,
            entity.createdAt,
            entity.updatedAt,
        );
    }

    static toEntity(domain: FlagRule): FlagRuleEntity {
        const entity = new FlagRuleEntity();
        entity.id = domain.id;
        entity.featureFlagId = domain.featureFlagId;
        entity.name = domain.name;
        entity.conditions = domain.conditions;
        entity.rolloutPercentage = domain.rolloutPercentage;
        entity.enabled = domain.enabled;
        entity.priority = domain.priority;
        entity.createdAt = domain.createdAt;
        entity.updatedAt = domain.updatedAt;
        return entity;
    }
}
