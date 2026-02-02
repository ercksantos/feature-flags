import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateFeatureFlagsTable1707000000001 implements MigrationInterface {
  name = 'CreateFeatureFlagsTable1707000000001';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "feature_flags" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "key" character varying(100) NOT NULL,
                "name" character varying(255) NOT NULL,
                "description" text,
                "type" character varying(50) NOT NULL,
                "status" character varying(50) NOT NULL DEFAULT 'inactive',
                "environment" character varying(50) NOT NULL,
                "defaultEnabled" boolean NOT NULL DEFAULT false,
                "variants" jsonb,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "createdBy" character varying(255) NOT NULL,
                "version" integer NOT NULL DEFAULT 1,
                CONSTRAINT "PK_feature_flags" PRIMARY KEY ("id"),
                CONSTRAINT "UQ_feature_flags_key" UNIQUE ("key")
            )
        `);

    await queryRunner.query(`
            CREATE INDEX "IDX_feature_flags_key" ON "feature_flags" ("key")
        `);

    await queryRunner.query(`
            CREATE INDEX "IDX_feature_flags_environment" ON "feature_flags" ("environment")
        `);

    await queryRunner.query(`
            CREATE INDEX "IDX_feature_flags_status" ON "feature_flags" ("status")
        `);

    await queryRunner.query(`
            CREATE INDEX "IDX_feature_flags_type" ON "feature_flags" ("type")
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_feature_flags_type"`);
    await queryRunner.query(`DROP INDEX "IDX_feature_flags_status"`);
    await queryRunner.query(`DROP INDEX "IDX_feature_flags_environment"`);
    await queryRunner.query(`DROP INDEX "IDX_feature_flags_key"`);
    await queryRunner.query(`DROP TABLE "feature_flags"`);
  }
}
