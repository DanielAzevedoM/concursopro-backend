import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddMissingColumnsToQuestions1722000000000 implements MigrationInterface {
    name = "AddMissingColumnsToQuestions1722000000000";

    public async up(queryRunner: QueryRunner): Promise<void> {
        const table = await queryRunner.getTable("questions");
        if (table) {
            if (!table.findColumnByName("subject")) {
                await queryRunner.addColumn(
                    "questions",
                    new TableColumn({
                        name: "subject",
                        type: "varchar",
                        length: "100",
                        isNullable: true,
                    }),
                );
            }
            if (!table.findColumnByName("option_e")) {
                await queryRunner.addColumn(
                    "questions",
                    new TableColumn({
                        name: "option_e",
                        type: "text",
                        isNullable: true,
                    }),
                );
            }
            if (!table.findColumnByName("option_f")) {
                await queryRunner.addColumn(
                    "questions",
                    new TableColumn({
                        name: "option_f",
                        type: "text",
                        isNullable: true,
                    }),
                );
            }
            if (!table.findColumnByName("explanation")) {
                await queryRunner.addColumn(
                    "questions",
                    new TableColumn({
                        name: "explanation",
                        type: "text",
                        isNullable: true,
                    }),
                );
            }
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const table = await queryRunner.getTable("questions");
        if (table) {
            if (table.findColumnByName("explanation")) {
                await queryRunner.dropColumn("questions", "explanation");
            }
            if (table.findColumnByName("option_f")) {
                await queryRunner.dropColumn("questions", "option_f");
            }
            if (table.findColumnByName("option_e")) {
                await queryRunner.dropColumn("questions", "option_e");
            }
            if (table.findColumnByName("subject")) {
                await queryRunner.dropColumn("questions", "subject");
            }
        }
    }
}
