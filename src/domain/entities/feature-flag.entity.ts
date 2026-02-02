import { FlagStatus } from '../enums/flag-status.enum';
import { FlagType } from '../enums/flag-type.enum';
import { Environment } from '../enums/environment.enum';

export interface FlagVariant {
  key: string;
  value: string;
  weight: number;
}

export class FeatureFlag {
  constructor(
    public readonly id: string,
    public readonly key: string,
    public readonly name: string,
    public readonly description: string,
    public readonly type: FlagType,
    public readonly status: FlagStatus,
    public readonly environment: Environment,
    public readonly defaultEnabled: boolean,
    public readonly variants: FlagVariant[],
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly createdBy: string,
    public readonly version: number,
  ) {
    this.validate();
  }

  private validate(): void {
    if (!this.key || this.key.trim().length === 0) {
      throw new Error('Flag key não pode ser vazio');
    }

    if (!this.name || this.name.trim().length === 0) {
      throw new Error('Flag name não pode ser vazio');
    }

    if (this.version < 1) {
      throw new Error('Version deve ser maior ou igual a 1');
    }

    if (this.type === FlagType.MULTIVARIATE && this.variants.length === 0) {
      throw new Error('Flags multivariate devem ter pelo menos uma variant');
    }

    if (this.type === FlagType.MULTIVARIATE) {
      const totalWeight = this.variants.reduce((sum, v) => sum + v.weight, 0);
      if (totalWeight !== 100) {
        throw new Error('Total de weights das variants deve ser 100');
      }
    }
  }

  // Regras de negócio
  isActive(): boolean {
    return this.status === FlagStatus.ACTIVE;
  }

  isKillSwitch(): boolean {
    return this.type === FlagType.KILL_SWITCH;
  }

  isArchived(): boolean {
    return this.status === FlagStatus.ARCHIVED;
  }

  canBeEvaluated(): boolean {
    return this.isActive() && !this.isArchived();
  }

  getDefaultValue(): boolean {
    return this.defaultEnabled;
  }

  selectVariant(hash: number): FlagVariant | null {
    if (this.type !== FlagType.MULTIVARIATE || this.variants.length === 0) {
      return null;
    }

    let accumulated = 0;
    for (const variant of this.variants) {
      accumulated += variant.weight;
      if (hash <= accumulated) {
        return variant;
      }
    }

    return this.variants[this.variants.length - 1];
  }
}
