import { MigrationInterface, QueryRunner } from "typeorm";

export class AddFirebaseFieldsToUsers1730450000000 implements MigrationInterface {
  name = 'AddFirebaseFieldsToUsers1730450000000'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" ADD COLUMN "firebaseUid" varchar(128)`);
    await queryRunner.query(`ALTER TABLE "users" ADD COLUMN "photoUrl" varchar(512)`);
    await queryRunner.query(`ALTER TABLE "users" ADD COLUMN "providerId" varchar(128)`);
    await queryRunner.query(`ALTER TABLE "users" ADD COLUMN "emailVerified" boolean NOT NULL DEFAULT false`);
    await queryRunner.query(`ALTER TABLE "users" ADD COLUMN "lastLoginAt" TIMESTAMP`);
    await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "email" DROP NOT NULL`);
    await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "UQ_users_firebaseUid" UNIQUE ("firebaseUid")`);
    await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "UQ_users_email_nullable" UNIQUE ("email")`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "UQ_users_email_nullable"`);
    await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "UQ_users_firebaseUid"`);
    await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "email" SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "lastLoginAt"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "emailVerified"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "providerId"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "photoUrl"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "firebaseUid"`);
  }
}



