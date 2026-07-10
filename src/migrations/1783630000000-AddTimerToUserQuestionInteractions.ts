import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddTimerToUserQuestionInteractions1783630000000 implements MigrationInterface {
    name = "AddTimerToUserQuestionInteractions1783630000000";

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Change is_correct to nullable
        await queryRunner.changeColumn(
            "user_question_interactions",
            "is_correct",
            new TableColumn({
                name: "is_correct",
                type: "boolean",
                isNullable: true,
            })
        );

        // Add started_at column
        await queryRunner.addColumn(
            "user_question_interactions",
            new TableColumn({
                name: "started_at",
                type: "timestamp",
                isNullable: true,
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Remove started_at column
        await queryRunner.dropColumn("user_question_interactions", "started_at");

        // Revert is_correct to non-nullable (will fail if there are nulls, but standard for down migrations)
        await queryRunner.changeColumn(
            "user_question_interactions",
            "is_correct",
            new TableColumn({
                name: "is_correct",
                type: "boolean",
                isNullable: false,
            })
        );
    }
}
