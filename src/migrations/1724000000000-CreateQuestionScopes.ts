import { MigrationInterface, QueryRunner, Table, TableColumn, TableForeignKey } from "typeorm";

export class CreateQuestionScopes1724000000000 implements MigrationInterface {
    name = "CreateQuestionScopes1724000000000";

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create question_scopes table
        await queryRunner.createTable(
            new Table({
                name: "question_scopes",
                columns: [
                    {
                        name: "id",
                        type: "varchar",
                        length: "36",
                        isPrimary: true,
                    },
                    {
                        name: "category_id",
                        type: "varchar",
                        length: "36",
                    },
                    {
                        name: "exam_id",
                        type: "varchar",
                        length: "36",
                        isNullable: true,
                    },
                    {
                        name: "text",
                        type: "text",
                    },
                    {
                        name: "image_url",
                        type: "longtext",
                        isNullable: true,
                    },
                ],
                foreignKeys: [
                    {
                        columnNames: ["category_id"],
                        referencedTableName: "categories",
                        referencedColumnNames: ["id"],
                        onDelete: "CASCADE",
                    },
                    {
                        columnNames: ["exam_id"],
                        referencedTableName: "exams",
                        referencedColumnNames: ["id"],
                        onDelete: "CASCADE",
                    },
                ],
            }),
            true,
        );

        // Add question_scope_id to questions
        const table = await queryRunner.getTable("questions");
        if (table) {
            if (!table.findColumnByName("question_scope_id")) {
                await queryRunner.addColumn(
                    "questions",
                    new TableColumn({
                        name: "question_scope_id",
                        type: "varchar",
                        length: "36",
                        isNullable: true,
                    }),
                );

                await queryRunner.createForeignKey(
                    "questions",
                    new TableForeignKey({
                        columnNames: ["question_scope_id"],
                        referencedTableName: "question_scopes",
                        referencedColumnNames: ["id"],
                        onDelete: "CASCADE",
                    }),
                );
            }
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const table = await queryRunner.getTable("questions");
        if (table) {
            const foreignKey = table.foreignKeys.find(
                (fk) => fk.columnNames.indexOf("question_scope_id") !== -1,
            );
            if (foreignKey) {
                await queryRunner.dropForeignKey("questions", foreignKey);
            }
            if (table.findColumnByName("question_scope_id")) {
                await queryRunner.dropColumn("questions", "question_scope_id");
            }
        }
        await queryRunner.dropTable("question_scopes");
    }
}
