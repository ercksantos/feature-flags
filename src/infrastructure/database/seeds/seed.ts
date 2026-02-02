import { AppDataSource } from '../data-source';
import { FeatureFlagEntity } from '../entities/feature-flag.entity';

async function seed() {
    console.log('🌱 Starting database seeding...');

    await AppDataSource.initialize();
    console.log('✅ Database connected');

    const repository = AppDataSource.getRepository(FeatureFlagEntity);

    // Limpar dados existentes (apenas em dev)
    if (process.env.NODE_ENV !== 'production') {
        await repository.query('DELETE FROM feature_flags');
        console.log('🗑️  Cleared existing flags');
    }

    // Seeds básicos
    const flags: Partial<FeatureFlagEntity>[] = [
        {
            key: 'new-dashboard',
            name: 'New Dashboard UI',
            description: 'Enable the redesigned dashboard interface',
            type: 'boolean',
            status: 'active',
            environment: 'development',
            defaultEnabled: true,
            variants: null,
            createdBy: 'system',
            version: 1,
        },
        {
            key: 'beta-features',
            name: 'Beta Features',
            description: 'Access to experimental features for beta users',
            type: 'rollout',
            status: 'active',
            environment: 'development',
            defaultEnabled: false,
            variants: null,
            createdBy: 'system',
            version: 1,
        },
        {
            key: 'payment-methods',
            name: 'Payment Methods',
            description: 'Different payment method options',
            type: 'multivariate',
            status: 'active',
            environment: 'development',
            defaultEnabled: true,
            variants: [
                { key: 'credit-card', value: 'Credit Card', weight: 50 },
                { key: 'pix', value: 'PIX', weight: 30 },
                { key: 'boleto', value: 'Boleto', weight: 20 },
            ],
            createdBy: 'system',
            version: 1,
        },
        {
            key: 'emergency-maintenance',
            name: 'Emergency Maintenance Mode',
            description: 'Kill switch for emergency situations',
            type: 'kill_switch',
            status: 'inactive',
            environment: 'production',
            defaultEnabled: false,
            variants: null,
            createdBy: 'system',
            version: 1,
        },
        {
            key: 'dark-mode',
            name: 'Dark Mode',
            description: 'Enable dark theme across the application',
            type: 'boolean',
            status: 'active',
            environment: 'production',
            defaultEnabled: false,
            variants: null,
            createdBy: 'system',
            version: 1,
        },
    ];

    for (const flag of flags) {
        await repository.save(flag);
        console.log(`✅ Seeded: ${flag.key}`);
    }

    console.log('✅ Seeding completed successfully!');
    await AppDataSource.destroy();
}

seed().catch((error) => {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
});
