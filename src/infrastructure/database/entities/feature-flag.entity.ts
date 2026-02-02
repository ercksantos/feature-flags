import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('feature_flags')
export class FeatureFlagEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  key!: string;

  @Column({ type: 'varchar', length: 255 })
  name!: string;

  @Column({ type: 'text', nullable: true })
  description!: string;

  @Column({ type: 'varchar', length: 50 })
  type!: string;

  @Column({ type: 'varchar', length: 50, default: 'inactive' })
  status!: string;

  @Column({ type: 'varchar', length: 50 })
  environment!: string;

  @Column({ type: 'boolean', default: false })
  defaultEnabled!: boolean;

  @Column({ type: 'jsonb', nullable: true })
  variants!: Array<{ key: string; value: string; weight: number }> | null;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @Column({ type: 'varchar', length: 255 })
  createdBy!: string;

  @Column({ type: 'int', default: 1 })
  version!: number;
}
