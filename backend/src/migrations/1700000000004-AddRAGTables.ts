import { MigrationInterface, QueryRunner } from "typeorm";

export class AddRAGTables1758600953819 implements MigrationInterface {
    name = 'AddRAGTables1758600953819'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "document_chunks" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "content" text NOT NULL, "source" character varying NOT NULL, "page" integer, "section" character varying, "chunkIndex" integer NOT NULL DEFAULT '0', "tokenCount" integer NOT NULL DEFAULT '0', "embedding" text NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_7f9060084e9b872dbb567193978" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_ad55380fb29ac141f336ca5538" ON "document_chunks" ("source", "page") `);
        await queryRunner.query(`CREATE INDEX "IDX_08aad4ac94bbfef682e8caabf7" ON "document_chunks" ("source", "chunkIndex") `);
        // Create GIN index for JSON embedding search
        await queryRunner.query(`CREATE INDEX "IDX_document_chunks_embedding_gin" ON "document_chunks" USING gin ((embedding::jsonb))`);
        await queryRunner.query(`CREATE TYPE "public"."documents_status_enum" AS ENUM('pending', 'processing', 'completed', 'failed')`);
        await queryRunner.query(`CREATE TABLE "documents" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "filename" character varying NOT NULL, "originalName" character varying NOT NULL, "filePath" character varying NOT NULL, "fileSize" bigint NOT NULL, "mimeType" character varying NOT NULL, "status" "public"."documents_status_enum" NOT NULL DEFAULT 'pending', "totalChunks" integer NOT NULL DEFAULT '0', "totalTokens" integer NOT NULL DEFAULT '0', "errorMessage" text, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_ac51aa5181ee2036f5ca482857c" PRIMARY KEY ("id"))`);
        // Clean up any orphaned messages first
        await queryRunner.query(`DELETE FROM "messages" WHERE "conversationId" IS NULL`);
        await queryRunner.query(`ALTER TABLE "messages" DROP CONSTRAINT "FK_e5663ce0c730b2de83445e2fd19"`);
        await queryRunner.query(`ALTER TABLE "messages" ALTER COLUMN "conversationId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "messages" ADD CONSTRAINT "FK_e5663ce0c730b2de83445e2fd19" FOREIGN KEY ("conversationId") REFERENCES "conversations"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "messages" DROP CONSTRAINT "FK_e5663ce0c730b2de83445e2fd19"`);
        await queryRunner.query(`ALTER TABLE "messages" ALTER COLUMN "conversationId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "messages" ADD CONSTRAINT "FK_e5663ce0c730b2de83445e2fd19" FOREIGN KEY ("conversationId") REFERENCES "conversations"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`DROP TABLE "documents"`);
        await queryRunner.query(`DROP TYPE "public"."documents_status_enum"`);
        // Drop GIN index first
        await queryRunner.query(`DROP INDEX "public"."IDX_document_chunks_embedding_gin"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_08aad4ac94bbfef682e8caabf7"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_ad55380fb29ac141f336ca5538"`);
        await queryRunner.query(`DROP TABLE "document_chunks"`);
        // Note: We don't drop the vector extension as it might be used by other tables
    }

}
