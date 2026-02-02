import { FeatureFlagEntity } from '../entities/feature-flag.entity';
import { FeatureFlag, FlagStatus, FlagType, Environment } from '@domain/index';

export class FeatureFlagMapper {
  static toDomain(entity: FeatureFlagEntity): FeatureFlag {
    return new FeatureFlag(
      entity.id,
      entity.key,
      entity.name,
      entity.description || '',
      entity.type as FlagType,
      entity.status as FlagStatus,
      entity.environment as Environment,
      entity.defaultEnabled,
      entity.variants || [],
      entity.createdAt,
      entity.updatedAt,
      entity.createdBy,
      entity.version,
    );
  }

  static toEntity(domain: FeatureFlag): FeatureFlagEntity {
    const entity = new FeatureFlagEntity();
    entity.id = domain.id;
    entity.key = domain.key;
    entity.name = domain.name;
    entity.description = domain.description;
    entity.type = domain.type;
    entity.status = domain.status;
    entity.environment = domain.environment;
    entity.defaultEnabled = domain.defaultEnabled;
    entity.variants = domain.variants;
    entity.createdAt = domain.createdAt;
    entity.updatedAt = domain.updatedAt;
    entity.createdBy = domain.createdBy;
    entity.version = domain.version;
    return entity;
  }
}
