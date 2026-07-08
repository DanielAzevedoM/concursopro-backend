import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTypeToQuestions1716200000000 implements MigrationInterface {
  name = "AddTypeToQuestions1716200000000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    const hasType = await queryRunner.hasColumn("questions", "type");
    if (!hasType) {
      await queryRunner.query(`
        ALTER TABLE questions 
        ADD COLUMN type VARCHAR(50) NOT NULL DEFAULT 'MULTIPLE_CHOICE'
      `);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const hasType = await queryRunner.hasColumn("questions", "type");
    if (hasType) {
      await queryRunner.query(`
        ALTER TABLE questions 
        DROP COLUMN type
      `);
    }
  }
}
