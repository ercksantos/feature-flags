import { FeatureFlag } from '../entities/feature-flag.entity';
import { Environment } from '../enums/environment.enum';

export interface FindFlagsOptions {
    environment?: Environment;
    status?: string;
    type?: string;
    search?: string;
    limit?: number;
    offset?: number;
}

export interface IFeatureFlagRepository {
    create(flag: FeatureFlag): Promise<FeatureFlag>;
    update(flag: FeatureFlag): Promise<FeatureFlag>;
    delete(id: string): Promise<void>;
    findById(id: string): Promise<FeatureFlag | null>;
    findByKey(key: string, environment: Environment): Promise<FeatureFlag | null>;
    findAll(options?: FindFlagsOptions): Promise<FeatureFlag[]>;
    exists(key: string, environment: Environment): Promise<boolean>;
    count(options?: FindFlagsOptions): Promise<number>;
}
