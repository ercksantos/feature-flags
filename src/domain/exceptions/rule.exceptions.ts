import { DomainException } from './domain.exception';

export class RuleNotFoundException extends DomainException {
  constructor(ruleId: string) {
    super(`Regra não encontrada: ${ruleId}`, 'RULE_NOT_FOUND');
  }
}

export class InvalidRuleConditionException extends DomainException {
  constructor(reason: string) {
    super(`Condição de regra inválida: ${reason}`, 'INVALID_RULE_CONDITION');
  }
}

export class RuleEvaluationException extends DomainException {
  constructor(reason: string) {
    super(`Erro ao avaliar regra: ${reason}`, 'RULE_EVALUATION_ERROR');
  }
}
