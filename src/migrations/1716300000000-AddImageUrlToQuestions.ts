import { MigrationInterface, QueryRunner } from "typeorm";

export class AddImageUrlToQuestions1716300000000 implements MigrationInterface {
  name = "AddImageUrlToQuestions1716300000000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    const hasColumn = await queryRunner.hasColumn("questions", "image_url");
    if (!hasColumn) {
      await queryRunner.query(`
        ALTER TABLE questions 
        ADD COLUMN image_url LONGTEXT NULL
      `);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const hasColumn = await queryRunner.hasColumn("questions", "image_url");
    if (hasColumn) {
      await queryRunner.query(`
        ALTER TABLE questions 
        DROP COLUMN image_url
      `);
    }
  }
}
