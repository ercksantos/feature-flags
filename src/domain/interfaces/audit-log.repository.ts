import { AuditLog } from '../entities/audit-log.entity';

export interface FindAuditLogsOptions {
    featureFlagId?: string;
    author?: string;
    action?: string;
    startDate?: Date;
    endDate?: Date;
    limit?: number;
    offset?: number;
}

export interface IAuditLogRepository {
    create(auditLog: AuditLog): Promise<AuditLog>;
    findById(id: string): Promise<AuditLog | null>;
    findByFeatureFlagId(featureFlagId: string): Promise<AuditLog[]>;
    findAll(options?: FindAuditLogsOptions): Promise<AuditLog[]>;
    count(options?: FindAuditLogsOptions): Promise<number>;
}
