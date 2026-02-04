import { FlagRule } from '../../domain/entities/flag-rule.entity';
import { RuleOperator } from '../../domain/enums/rule-operator.enum';
import { EvaluationContext } from '../interfaces/evaluation-context.interface';

export class RuleEvaluationService {
  evaluateRule(rule: FlagRule, context: EvaluationContext): boolean {
    if (!rule.conditions || rule.conditions.length === 0) {
      return true;
    }

    // Avalia todas as condições (AND lógico)
    return rule.conditions.every((condition) => this.evaluateCondition(condition, context));
  }

  private evaluateCondition(
    condition: {
      field: string;
      operator: RuleOperator;
      value: unknown;
    },
    context: EvaluationContext,
  ): boolean {
    const attributeValue = this.getAttributeValue(condition.field, context);

    switch (condition.operator) {
      case RuleOperator.EQUALS:
        return attributeValue === condition.value;

      case RuleOperator.NOT_EQUALS:
        return attributeValue !== condition.value;

      case RuleOperator.CONTAINS:
        return (
          typeof attributeValue === 'string' &&
          typeof condition.value === 'string' &&
          attributeValue.includes(condition.value)
        );

      case RuleOperator.IN:
        return Array.isArray(condition.value) && condition.value.includes(attributeValue);

      case RuleOperator.NOT_IN:
        return Array.isArray(condition.value) && !condition.value.includes(attributeValue);

      case RuleOperator.GREATER_THAN:
        return (
          typeof attributeValue === 'number' &&
          typeof condition.value === 'number' &&
          attributeValue > condition.value
        );

      case RuleOperator.LESS_THAN:
        return (
          typeof attributeValue === 'number' &&
          typeof condition.value === 'number' &&
          attributeValue < condition.value
        );

      default:
        return false;
    }
  }

  private getAttributeValue(attribute: string, context: EvaluationContext): unknown {
    // Verifica atributos especiais
    if (attribute === 'userId') {
      return context.userId;
    }

    if (attribute === 'environment') {
      return context.environment;
    }

    // Busca em atributos customizados
    return context.attributes?.[attribute];
  }
}
