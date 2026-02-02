import { RuleOperator } from '../enums/rule-operator.enum';

export interface RuleCondition {
    field: string;
    operator: RuleOperator;
    value: string | number | string[] | number[];
}

export class FlagRule {
    constructor(
        public readonly id: string,
        public readonly featureFlagId: string,
        public readonly name: string,
        public readonly conditions: RuleCondition[],
        public readonly rolloutPercentage: number,
        public readonly enabled: boolean,
        public readonly priority: number,
        public readonly createdAt: Date,
        public readonly updatedAt: Date,
    ) {
        this.validate();
    }

    private validate(): void {
        if (this.rolloutPercentage < 0 || this.rolloutPercentage > 100) {
            throw new Error('Rollout percentage deve estar entre 0 e 100');
        }

        if (this.priority < 0) {
            throw new Error('Priority deve ser maior ou igual a 0');
        }

        if (!this.name || this.name.trim().length === 0) {
            throw new Error('Rule name não pode ser vazio');
        }

        if (!Array.isArray(this.conditions)) {
            throw new Error('Conditions deve ser um array');
        }
    }

    // Regras de negócio
    isApplicable(): boolean {
        return this.enabled;
    }

    hasConditions(): boolean {
        return this.conditions.length > 0;
    }

    shouldRollout(hash: number): boolean {
        return hash <= this.rolloutPercentage;
    }
}
