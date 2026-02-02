import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('audit_logs')
export class AuditLogEntity {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ type: 'uuid' })
    featureFlagId!: string;

    @Column({ type: 'varchar', length: 50 })
    action!: string;

    @Column({ type: 'int' })
    version!: number;

    @Column({ type: 'varchar', length: 255 })
    author!: string;

    @CreateDateColumn()
    timestamp!: Date;

    @Column({ type: 'jsonb', default: [] })
    diff!: Array<{
        field: string;
        oldValue: unknown;
        newValue: unknown;
    }>;

    @Column({ type: 'jsonb', default: {} })
    metadata!: Record<string, unknown>;
}
