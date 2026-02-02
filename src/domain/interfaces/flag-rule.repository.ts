import { FlagRule } from '../entities/flag-rule.entity';

export interface FindRulesOptions {
  featureFlagId?: string;
  enabled?: boolean;
}

export interface IFlagRuleRepository {
  create(rule: FlagRule): Promise<FlagRule>;
  update(rule: FlagRule): Promise<FlagRule>;
  delete(id: string): Promise<void>;
  findById(id: string): Promise<FlagRule | null>;
  findByFeatureFlagId(featureFlagId: string): Promise<FlagRule[]>;
  findAll(options?: FindRulesOptions): Promise<FlagRule[]>;
}
