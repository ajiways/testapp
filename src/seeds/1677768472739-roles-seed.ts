import { MigrationInterface, QueryRunner } from 'typeorm';

export class rolesSeed1677768472739 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        INSERT INTO "public"."roles" (role) VALUES ('user');
        INSERT INTO "public"."roles" (role) VALUES ('admin');
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        DELETE FROM "public"."roles" WHERE role = 'user';
        DELETE FROM "public"."roles" WHERE role = 'admin';
    `);
  }
}
