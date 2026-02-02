import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateFlagRulesTable1707000000002 implements MigrationInterface {
    name = 'CreateFlagRulesTable1707000000002';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "flag_rules" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "featureFlagId" uuid NOT NULL,
                "name" character varying(255) NOT NULL,
                "conditions" jsonb NOT NULL,
                "rolloutPercentage" integer NOT NULL DEFAULT 100,
                "enabled" boolean NOT NULL DEFAULT true,
                "priority" integer NOT NULL DEFAULT 0,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_flag_rules" PRIMARY KEY ("id"),
                CONSTRAINT "FK_flag_rules_feature_flag" FOREIGN KEY ("featureFlagId") 
                    REFERENCES "feature_flags"("id") ON DELETE CASCADE
            )
        `);

        await queryRunner.query(`
            CREATE INDEX "IDX_flag_rules_feature_flag_id" ON "flag_rules" ("featureFlagId")
        `);

        await queryRunner.query(`
            CREATE INDEX "IDX_flag_rules_enabled" ON "flag_rules" ("enabled")
        `);

        await queryRunner.query(`
            CREATE INDEX "IDX_flag_rules_priority" ON "flag_rules" ("priority")
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "IDX_flag_rules_priority"`);
        await queryRunner.query(`DROP INDEX "IDX_flag_rules_enabled"`);
        await queryRunner.query(`DROP INDEX "IDX_flag_rules_feature_flag_id"`);
        await queryRunner.query(`DROP TABLE "flag_rules"`);
    }
}
