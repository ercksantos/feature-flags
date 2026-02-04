import { Injectable, Logger } from '@nestjs/common';
import { FeatureFlag } from '../../domain/entities/feature-flag.entity';
import { IFeatureFlagRepository } from '../../domain/interfaces/feature-flag.repository';
import { IFlagRuleRepository } from '../../domain/interfaces/flag-rule.repository';
import { CacheService } from '../../infrastructure/cache/cache.service';
import { CACHE_KEYS, CACHE_TTL } from '../../infrastructure/cache/cache.constants';
import { FlagStatus } from '../../domain/enums/flag-status.enum';
import { FlagType } from '../../domain/enums/flag-type.enum';
import {
  EvaluationContext,
  EvaluationResult,
  EvaluationReason,
} from '../interfaces/evaluation-context.interface';
import { RolloutService } from './rollout.service';
import { RuleEvaluationService } from './rule-evaluation.service';

@Injectable()
export class EvaluationService {
  private readonly logger = new Logger(EvaluationService.name);

  constructor(
    private readonly flagRepository: IFeatureFlagRepository,
    private readonly ruleRepository: IFlagRuleRepository,
    private readonly cacheService: CacheService,
    private readonly rolloutService: RolloutService,
    private readonly ruleEvaluationService: RuleEvaluationService,
  ) {}

  async evaluate(flagKey: string, context: EvaluationContext): Promise<EvaluationResult> {
    try {
      // Tenta buscar do cache primeiro
      const cacheKey = CACHE_KEYS.FLAG(flagKey, context.environment);
      const cachedFlag = await this.cacheService.get<FeatureFlag>(cacheKey);

      let flag: FeatureFlag | null = cachedFlag;

      // Se não estiver em cache, busca do banco
      if (!flag) {
        flag = await this.flagRepository.findByKey(flagKey, context.environment);

        if (!flag) {
          this.logger.warn(`Flag not found: ${flagKey}`);
          return {
            enabled: false,
            reason: EvaluationReason.FLAG_NOT_FOUND,
          };
        }

        // Armazena no cache
        await this.cacheService.set(cacheKey, flag, CACHE_TTL.FLAG);
      }

      // Kill switch - prioridade máxima (usando FlagType.KILL_SWITCH)
      if (flag.type === FlagType.KILL_SWITCH) {
        this.logger.warn(`Kill switch activated for flag: ${flagKey}`);
        return {
          enabled: false,
          reason: EvaluationReason.KILL_SWITCH,
        };
      }

      // Flag desabilitada
      if (flag.status === FlagStatus.INACTIVE) {
        return {
          enabled: false,
          reason: EvaluationReason.FLAG_DISABLED,
        };
      }

      // Flag booleana simples - usa defaultEnabled
      if (flag.type === FlagType.BOOLEAN) {
        return {
          enabled: flag.defaultEnabled && flag.status === FlagStatus.ACTIVE,
          reason:
            flag.defaultEnabled && flag.status === FlagStatus.ACTIVE
              ? EvaluationReason.FLAG_ENABLED
              : EvaluationReason.FLAG_DISABLED,
        };
      }

      // Flag de rollout - avalia percentual
      if (flag.type === FlagType.ROLLOUT) {
        return await this.evaluateWithRules(flag, context);
      }

      // Flag multivariate - retorna variant baseado em hash
      if (flag.type === FlagType.MULTIVARIATE) {
        return this.evaluateMultivariate(flag, context);
      }

      // Flag operacional - sempre ativa se status = ACTIVE
      return {
        enabled: flag.status === FlagStatus.ACTIVE,
        reason:
          flag.status === FlagStatus.ACTIVE
            ? EvaluationReason.FLAG_ENABLED
            : EvaluationReason.FLAG_DISABLED,
      };
    } catch (error) {
      this.logger.error(
        `Error evaluating flag ${flagKey}`,
        error instanceof Error ? error.stack : error,
      );

      // Fallback seguro: desabilita em caso de erro
      return {
        enabled: false,
        reason: EvaluationReason.ERROR,
      };
    }
  }

  private async evaluateWithRules(
    flag: FeatureFlag,
    context: EvaluationContext,
  ): Promise<EvaluationResult> {
    // Busca regras da flag
    const rules = await this.ruleRepository.findByFeatureFlagId(flag.id);

    // Se não há regras, avalia apenas o rollout geral
    if (!rules || rules.length === 0) {
      return this.evaluateRollout(flag, context);
    }

    // Avalia cada regra em ordem de prioridade
    for (const rule of rules) {
      const ruleMatches = this.ruleEvaluationService.evaluateRule(rule, context);

      if (ruleMatches) {
        // Se a regra tem rollout, avalia
        if (rule.rolloutPercentage !== null && rule.rolloutPercentage !== undefined) {
          const shouldEnable = context.userId
            ? this.rolloutService.shouldEnableForUser(
                context.userId,
                flag.key,
                rule.rolloutPercentage,
              )
            : false;

          return {
            enabled: shouldEnable,
            reason: shouldEnable
              ? EvaluationReason.ROLLOUT_MATCHED
              : EvaluationReason.ROLLOUT_NOT_MATCHED,
          };
        }

        // Regra matched sem rollout = ativa
        return {
          enabled: true,
          reason: EvaluationReason.RULE_MATCHED,
        };
      }
    }

    // Nenhuma regra matched, avalia rollout geral da flag
    return this.evaluateRollout(flag, context);
  }

  private evaluateRollout(flag: FeatureFlag, context: EvaluationContext): EvaluationResult {
    // Se não tem userId, usa defaultEnabled
    if (!context.userId) {
      return {
        enabled: flag.defaultEnabled && flag.status === FlagStatus.ACTIVE,
        reason: flag.defaultEnabled
          ? EvaluationReason.FLAG_ENABLED
          : EvaluationReason.FLAG_DISABLED,
      };
    }

    // Para rollout, usa defaultEnabled como fallback
    return {
      enabled: flag.defaultEnabled && flag.status === FlagStatus.ACTIVE,
      reason: flag.defaultEnabled ? EvaluationReason.FLAG_ENABLED : EvaluationReason.FLAG_DISABLED,
    };
  }

  private evaluateMultivariate(flag: FeatureFlag, context: EvaluationContext): EvaluationResult {
    // Se não tem variants ou userId, retorna desabilitado
    if (!flag.variants || flag.variants.length === 0 || !context.userId) {
      return {
        enabled: false,
        reason: EvaluationReason.FLAG_DISABLED,
      };
    }

    // Usa hash para distribuir variants deterministicamente
    const percentage = this.rolloutService.calculateRolloutPercentage(context.userId, flag.key);

    let cumulativeWeight = 0;
    for (const variant of flag.variants) {
      cumulativeWeight += variant.weight;
      if (percentage <= cumulativeWeight) {
        return {
          enabled: true,
          reason: EvaluationReason.FLAG_ENABLED,
          variant: variant.key,
        };
      }
    }

    // Fallback para primeira variant
    return {
      enabled: true,
      reason: EvaluationReason.FLAG_ENABLED,
      variant: flag.variants[0].key,
    };
  }
}
