import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddDashboardTotalizersToUsers1723000000000 implements MigrationInterface {
  name = "AddDashboardTotalizersToUsers1723000000000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable("users");
    if (table) {
      if (!table.findColumnByName("total_questions_answered")) {
        await queryRunner.addColumn("users", new TableColumn({ name: "total_questions_answered", type: "int", isNullable: false, default: 0 }));
      }
      if (!table.findColumnByName("total_questions_correct")) {
        await queryRunner.addColumn("users", new TableColumn({ name: "total_questions_correct", type: "int", isNullable: false, default: 0 }));
      }
      if (!table.findColumnByName("total_questions_revised")) {
        await queryRunner.addColumn("users", new TableColumn({ name: "total_questions_revised", type: "int", isNullable: false, default: 0 }));
      }
      if (!table.findColumnByName("last_login_date")) {
        await queryRunner.addColumn("users", new TableColumn({ name: "last_login_date", type: "date", isNullable: true }));
      }
      if (!table.findColumnByName("consecutive_login_days")) {
        await queryRunner.addColumn("users", new TableColumn({ name: "consecutive_login_days", type: "int", isNullable: false, default: 0 }));
      }
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable("users");
    if (table) {
      if (table.findColumnByName("consecutive_login_days")) await queryRunner.dropColumn("users", "consecutive_login_days");
      if (table.findColumnByName("last_login_date")) await queryRunner.dropColumn("users", "last_login_date");
      if (table.findColumnByName("total_questions_revised")) await queryRunner.dropColumn("users", "total_questions_revised");
      if (table.findColumnByName("total_questions_correct")) await queryRunner.dropColumn("users", "total_questions_correct");
      if (table.findColumnByName("total_questions_answered")) await queryRunner.dropColumn("users", "total_questions_answered");
    }
  }
}
