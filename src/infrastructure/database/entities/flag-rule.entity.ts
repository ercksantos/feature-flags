import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { FeatureFlagEntity } from './feature-flag.entity';

@Entity('flag_rules')
export class FlagRuleEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  featureFlagId!: string;

  @ManyToOne(() => FeatureFlagEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'featureFlagId' })
  featureFlag!: FeatureFlagEntity;

  @Column({ type: 'varchar', length: 255 })
  name!: string;

  @Column({ type: 'jsonb' })
  conditions!: Array<{
    field: string;
    operator: string;
    value: string | number | string[] | number[];
  }>;

  @Column({ type: 'int', default: 100 })
  rolloutPercentage!: number;

  @Column({ type: 'boolean', default: true })
  enabled!: boolean;

  @Column({ type: 'int', default: 0 })
  priority!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
