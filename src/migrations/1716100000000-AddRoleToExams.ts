import { MigrationInterface, QueryRunner } from "typeorm";

export class AddRoleToExams1716100000000 implements MigrationInterface {
  name = "AddRoleToExams1716100000000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    const hasRole = await queryRunner.hasColumn("exams", "role");
    if (!hasRole) {
      await queryRunner.query(`
        ALTER TABLE exams 
        ADD COLUMN role VARCHAR(255) NULL
      `);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const hasRole = await queryRunner.hasColumn("exams", "role");
    if (hasRole) {
      await queryRunner.query(`
        ALTER TABLE exams 
        DROP COLUMN role
      `);
    }
  }
}
