import { MigrationInterface, QueryRunner } from "typeorm";

export class UserCategoriesMigration1720000000000 implements MigrationInterface {
    name = "UserCategoriesMigration1720000000000";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE \`user_categories\` (\`id\` varchar(36) NOT NULL, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`user_id\` varchar(36) NULL, \`category_id\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
        );
        await queryRunner.query(
            `ALTER TABLE \`user_categories\` ADD CONSTRAINT \`FK_user_categories_user_id\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE \`user_categories\` ADD CONSTRAINT \`FK_user_categories_category_id\` FOREIGN KEY (\`category_id\`) REFERENCES \`categories\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE \`user_categories\` DROP FOREIGN KEY \`FK_user_categories_category_id\``,
        );
        await queryRunner.query(
            `ALTER TABLE \`user_categories\` DROP FOREIGN KEY \`FK_user_categories_user_id\``,
        );
        await queryRunner.query(`DROP TABLE \`user_categories\``);
    }
}
