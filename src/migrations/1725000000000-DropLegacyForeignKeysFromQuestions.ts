import { MigrationInterface, QueryRunner, TableColumn, TableForeignKey } from "typeorm";

export class DropLegacyForeignKeysFromQuestions1725000000000 implements MigrationInterface {
    name = "DropLegacyForeignKeysFromQuestions1725000000000";

    public async up(queryRunner: QueryRunner): Promise<void> {
        const table = await queryRunner.getTable("questions");

        if (table) {
            // Drop exam_id foreign key and column
            const examFk = table.foreignKeys.find(fk => fk.columnNames.indexOf("exam_id") !== -1);
            if (examFk) {
                await queryRunner.dropForeignKey("questions", examFk);
            }
            if (table.findColumnByName("exam_id")) {
                await queryRunner.dropColumn("questions", "exam_id");
            }

            // Drop category_id foreign key and column
            const categoryFk = table.foreignKeys.find(fk => fk.columnNames.indexOf("category_id") !== -1);
            if (categoryFk) {
                await queryRunner.dropForeignKey("questions", categoryFk);
            } else {
                // Also try by name just in case
                const categoryFkByName = table.foreignKeys.find(fk => fk.name === "fk_category");
                if (categoryFkByName) {
                    await queryRunner.dropForeignKey("questions", categoryFkByName);
                }
            }
            if (table.findColumnByName("category_id")) {
                await queryRunner.dropColumn("questions", "category_id");
            }
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Re-add category_id column and foreign key
        await queryRunner.addColumn(
            "questions",
            new TableColumn({
                name: "category_id",
                type: "varchar",
                length: "36",
                isNullable: true, // Typically nullable when restoring down to avoid data issues
            }),
        );
        await queryRunner.createForeignKey(
            "questions",
            new TableForeignKey({
                name: "fk_category",
                columnNames: ["category_id"],
                referencedColumnNames: ["id"],
                referencedTableName: "categories",
                onDelete: "CASCADE",
            }),
        );

        // Re-add exam_id column and foreign key
        await queryRunner.addColumn(
            "questions",
            new TableColumn({
                name: "exam_id",
                type: "varchar",
                length: "36",
                isNullable: true,
            }),
        );
        await queryRunner.createForeignKey(
            "questions",
            new TableForeignKey({
                name: "fk_question_exam_id",
                columnNames: ["exam_id"],
                referencedColumnNames: ["id"],
                referencedTableName: "exams",
                onDelete: "CASCADE",
            }),
        );
    }
}
