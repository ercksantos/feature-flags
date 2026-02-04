export interface EvaluationContext {
    userId?: string;
    environment: string;
    attributes?: Record<string, unknown>;
}

export interface EvaluationResult {
    enabled: boolean;
    reason: EvaluationReason;
    variant?: string;
}

export enum EvaluationReason {
    KILL_SWITCH = 'kill_switch',
    FLAG_DISABLED = 'flag_disabled',
    FLAG_ENABLED = 'flag_enabled',
    ROLLOUT_MATCHED = 'rollout_matched',
    ROLLOUT_NOT_MATCHED = 'rollout_not_matched',
    RULE_MATCHED = 'rule_matched',
    RULE_NOT_MATCHED = 'rule_not_matched',
    FLAG_NOT_FOUND = 'flag_not_found',
    ERROR = 'error',
}
