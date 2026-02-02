import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateAuditLogsTable1707000000003 implements MigrationInterface {
    name = 'CreateAuditLogsTable1707000000003';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "audit_logs" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "featureFlagId" uuid NOT NULL,
                "action" character varying(50) NOT NULL,
                "version" integer NOT NULL,
                "author" character varying(255) NOT NULL,
                "timestamp" TIMESTAMP NOT NULL DEFAULT now(),
                "diff" jsonb NOT NULL DEFAULT '[]',
                "metadata" jsonb NOT NULL DEFAULT '{}',
                CONSTRAINT "PK_audit_logs" PRIMARY KEY ("id")
            )
        `);

        await queryRunner.query(`
            CREATE INDEX "IDX_audit_logs_feature_flag_id" ON "audit_logs" ("featureFlagId")
        `);

        await queryRunner.query(`
            CREATE INDEX "IDX_audit_logs_action" ON "audit_logs" ("action")
        `);

        await queryRunner.query(`
            CREATE INDEX "IDX_audit_logs_timestamp" ON "audit_logs" ("timestamp")
        `);

        await queryRunner.query(`
            CREATE INDEX "IDX_audit_logs_author" ON "audit_logs" ("author")
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "IDX_audit_logs_author"`);
        await queryRunner.query(`DROP INDEX "IDX_audit_logs_timestamp"`);
        await queryRunner.query(`DROP INDEX "IDX_audit_logs_action"`);
        await queryRunner.query(`DROP INDEX "IDX_audit_logs_feature_flag_id"`);
        await queryRunner.query(`DROP TABLE "audit_logs"`);
    }
}
