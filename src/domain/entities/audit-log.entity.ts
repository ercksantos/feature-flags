export enum AuditAction {
  CREATED = 'created',
  UPDATED = 'updated',
  DELETED = 'deleted',
  ACTIVATED = 'activated',
  DEACTIVATED = 'deactivated',
  ARCHIVED = 'archived',
}

export interface AuditDiff {
  field: string;
  oldValue: unknown;
  newValue: unknown;
}

export class AuditLog {
  constructor(
    public readonly id: string,
    public readonly featureFlagId: string,
    public readonly action: AuditAction,
    public readonly version: number,
    public readonly author: string,
    public readonly timestamp: Date,
    public readonly diff: AuditDiff[],
    public readonly metadata: Record<string, unknown>,
  ) {
    this.validate();
  }

  private validate(): void {
    if (!this.featureFlagId || this.featureFlagId.trim().length === 0) {
      throw new Error('FeatureFlagId não pode ser vazio');
    }

    if (!this.author || this.author.trim().length === 0) {
      throw new Error('Author não pode ser vazio');
    }

    if (this.version < 1) {
      throw new Error('Version deve ser maior ou igual a 1');
    }

    if (!Array.isArray(this.diff)) {
      throw new Error('Diff deve ser um array');
    }
  }

  hasDiff(): boolean {
    return this.diff.length > 0;
  }

  isCreation(): boolean {
    return this.action === AuditAction.CREATED;
  }

  isDeletion(): boolean {
    return this.action === AuditAction.DELETED;
  }
}
