import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateMessageTable1700000000003 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `
            CREATE TYPE "public"."messages_role_enum" AS ENUM('system', 'user', 'assistant');
            `,
        )

        await queryRunner.query(
            `
            CREATE TABLE "messages" (
                "id" uuid NOT NULL DEFAULT gen_random_uuid(),
                "conversationId" uuid NOT NULL,
                "role" "public"."messages_role_enum" NOT NULL DEFAULT 'user',
                "content" text NOT NULL,
                "timestamp" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_18325f38ae6de43878487eff986" PRIMARY KEY ("id")
            );
            `,
        )

        await queryRunner.query(
            `
            ALTER TABLE "messages" 
            ADD CONSTRAINT "FK_e5663ce0c730b2de83445e2fd19" 
            FOREIGN KEY ("conversationId") REFERENCES "conversations"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
            `,
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "messages" DROP CONSTRAINT "FK_e5663ce0c730b2de83445e2fd19"`,
        )

        await queryRunner.query(
            `DROP TABLE "messages"`,
        )

        await queryRunner.query(
            `DROP TYPE "public"."messages_role_enum"`,
        )
    }
} 