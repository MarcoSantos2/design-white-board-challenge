import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateConversationTable1700000000002 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `
            CREATE TABLE "conversations" (
                "id" uuid NOT NULL DEFAULT gen_random_uuid(),
                "userId" uuid,
                "title" character varying(255),
                "description" text,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "lastUpdated" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_ee34f4f7ced4ec8681f26bf04ef" PRIMARY KEY ("id")
            );
            `,
        )

        await queryRunner.query(
            `
            ALTER TABLE "conversations" 
            ADD CONSTRAINT "FK_aa05f739eb2f8abfe06f05bc0de" 
            FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;
            `,
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "conversations" DROP CONSTRAINT "FK_aa05f739eb2f8abfe06f05bc0de"`,
        )

        await queryRunner.query(
            `DROP TABLE "conversations"`,
        )
    }
} 