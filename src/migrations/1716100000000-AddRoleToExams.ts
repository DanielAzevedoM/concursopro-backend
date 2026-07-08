import { MigrationInterface, QueryRunner } from "typeorm";

export class AddRoleToExams1716100000000 implements MigrationInterface {
  name = "AddRoleToExams1716100000000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    const hasTable = await queryRunner.hasTable("exams");
    if (!hasTable) {
      await queryRunner.query(`
        CREATE TABLE exams (
            id VARCHAR(36) PRIMARY KEY,
            category_id VARCHAR(36) NOT NULL,
            name VARCHAR(255) NOT NULL,
            year VARCHAR(50),
            institution VARCHAR(255),
            role VARCHAR(255) NULL,
            CONSTRAINT fk_exam_category FOREIGN KEY (category_id) REFERENCES categories (id) ON DELETE CASCADE
        );
      `);
    } else {
      const hasRole = await queryRunner.hasColumn("exams", "role");
      if (!hasRole) {
        await queryRunner.query(`
          ALTER TABLE exams 
          ADD COLUMN role VARCHAR(255) NULL
        `);
      }
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const hasTable = await queryRunner.hasTable("exams");
    if (hasTable) {
      const hasRole = await queryRunner.hasColumn("exams", "role");
      if (hasRole) {
        await queryRunner.query(`
          ALTER TABLE exams 
          DROP COLUMN role
        `);
      }
    }
  }
}
