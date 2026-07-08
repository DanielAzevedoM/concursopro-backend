import {
    MigrationInterface,
    QueryRunner,
    TableColumn,
    TableForeignKey,
} from "typeorm";

export class AddExamIdToQuestions1721000000000 implements MigrationInterface {
    name = "AddExamIdToQuestions1721000000000";

    public async up(queryRunner: QueryRunner): Promise<void> {
        const table = await queryRunner.getTable("questions");
        if (table && !table.findColumnByName("exam_id")) {
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
                    columnNames: ["exam_id"],
                    referencedColumnNames: ["id"],
                    referencedTableName: "exams",
                    onDelete: "CASCADE",
                    name: "fk_question_exam_id",
                }),
            );
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const table = await queryRunner.getTable("questions");
        if (table && table.findColumnByName("exam_id")) {
            await queryRunner.dropForeignKey("questions", "fk_question_exam_id");
            await queryRunner.dropColumn("questions", "exam_id");
        }
    }
}
