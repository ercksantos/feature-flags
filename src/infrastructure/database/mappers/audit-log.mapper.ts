import { AuditLogEntity } from '../entities/audit-log.entity';
import { AuditLog, AuditAction, AuditDiff } from '@domain/index';

export class AuditLogMapper {
  static toDomain(entity: AuditLogEntity): AuditLog {
    return new AuditLog(
      entity.id,
      entity.featureFlagId,
      entity.action as AuditAction,
      entity.version,
      entity.author,
      entity.timestamp,
      entity.diff as AuditDiff[],
      entity.metadata || {},
    );
  }

  static toEntity(domain: AuditLog): AuditLogEntity {
    const entity = new AuditLogEntity();
    entity.id = domain.id;
    entity.featureFlagId = domain.featureFlagId;
    entity.action = domain.action;
    entity.version = domain.version;
    entity.author = domain.author;
    entity.timestamp = domain.timestamp;
    entity.diff = domain.diff;
    entity.metadata = domain.metadata;
    return entity;
  }
}
