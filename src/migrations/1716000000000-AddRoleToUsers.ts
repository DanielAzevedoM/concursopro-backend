import { MigrationInterface, QueryRunner } from "typeorm";

export class AddRoleToUsers1716000000000 implements MigrationInterface {
  name = "AddRoleToUsers1716000000000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE users 
      ADD COLUMN role VARCHAR(20) NOT NULL DEFAULT 'USER'
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE users 
      DROP COLUMN role
    `);
  }
}
