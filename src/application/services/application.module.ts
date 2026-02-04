import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../infrastructure/database/database.module';
import { RedisModule } from '../../infrastructure/cache/redis.module';
import { EvaluationService } from './evaluation.service';
import { RolloutService } from './rollout.service';
import { RuleEvaluationService } from './rule-evaluation.service';

@Module({
    imports: [DatabaseModule, RedisModule],
    providers: [EvaluationService, RolloutService, RuleEvaluationService],
    exports: [EvaluationService, RolloutService, RuleEvaluationService],
})
export class ApplicationModule { }
