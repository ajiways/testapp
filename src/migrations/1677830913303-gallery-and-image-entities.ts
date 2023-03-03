import { MigrationInterface, QueryRunner } from 'typeorm';

export class galleryAndImageEntities1677830913303
  implements MigrationInterface
{
  name = 'galleryAndImageEntities1677830913303';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "images" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "file_path" character varying NOT NULL, "original_file_name" character varying NOT NULL, "original_file_extension" "public"."images_original_file_extension_enum" NOT NULL, "galleryId" integer, CONSTRAINT "UQ_7adf8df88e8f675e56dc69c6e11" UNIQUE ("file_path"), CONSTRAINT "PK_1fe148074c6a1a91b63cb9ee3c9" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "galleries" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer NOT NULL, CONSTRAINT "REL_22c8efdc30dbfd0af55ed08c9c" UNIQUE ("userId"), CONSTRAINT "PK_86b77299615c92db3d68c9c7919" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`ALTER TABLE "users" ADD "galleryId" integer`);
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "UQ_58513197d8eb9c5501b01723745" UNIQUE ("galleryId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "images" ADD CONSTRAINT "FK_9212cdd4f00a6a7c70bb6ba7f90" FOREIGN KEY ("galleryId") REFERENCES "galleries"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "galleries" ADD CONSTRAINT "FK_22c8efdc30dbfd0af55ed08c9ce" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "FK_58513197d8eb9c5501b01723745" FOREIGN KEY ("galleryId") REFERENCES "galleries"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "FK_58513197d8eb9c5501b01723745"`,
    );
    await queryRunner.query(
      `ALTER TABLE "galleries" DROP CONSTRAINT "FK_22c8efdc30dbfd0af55ed08c9ce"`,
    );
    await queryRunner.query(
      `ALTER TABLE "images" DROP CONSTRAINT "FK_9212cdd4f00a6a7c70bb6ba7f90"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "UQ_58513197d8eb9c5501b01723745"`,
    );
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "galleryId"`);
    await queryRunner.query(`DROP TABLE "galleries"`);
    await queryRunner.query(`DROP TABLE "images"`);
  }
}
