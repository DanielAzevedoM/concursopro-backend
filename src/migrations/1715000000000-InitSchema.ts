import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitSchema1715000000000 implements MigrationInterface {
  name = 'InitSchema1715000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS users (
          id UUID PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) NOT NULL UNIQUE,
          password VARCHAR(255) NOT NULL,
          plan_type VARCHAR(50) NOT NULL,
          daily_errors INT NOT NULL DEFAULT 0,
          last_error_reset DATE NOT NULL,
          created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
          reset_code VARCHAR(6),
          reset_code_expiry TIMESTAMP
      );
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS categories (
          id UUID PRIMARY KEY,
          name VARCHAR(255) NOT NULL UNIQUE,
          description TEXT
      );
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS questions (
          id UUID PRIMARY KEY,
          category_id UUID NOT NULL,
          text TEXT NOT NULL,
          option_a TEXT,
          option_b TEXT,
          option_c TEXT,
          option_d TEXT,
          option_e TEXT,
          option_f TEXT,
          correct_option VARCHAR(1) NOT NULL,
          explanation TEXT,
          CONSTRAINT fk_category FOREIGN KEY (category_id) REFERENCES categories (id) ON DELETE CASCADE
      );
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS user_question_interactions (
          id UUID PRIMARY KEY,
          user_id UUID NOT NULL,
          question_id UUID NOT NULL,
          is_correct BOOLEAN NOT NULL,
          is_reviewed BOOLEAN NOT NULL DEFAULT FALSE,
          answered_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT fk_user_interaction FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
          CONSTRAINT fk_question_interaction FOREIGN KEY (question_id) REFERENCES questions (id) ON DELETE CASCADE
      );
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS mock_exams (
          id UUID PRIMARY KEY,
          user_id UUID NOT NULL,
          category_id UUID NOT NULL,
          started_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
          finished_at TIMESTAMP WITHOUT TIME ZONE,
          total_questions INT NOT NULL DEFAULT 0,
          correct_answers INT NOT NULL DEFAULT 0,
          CONSTRAINT fk_user_mock FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
          CONSTRAINT fk_category_mock FOREIGN KEY (category_id) REFERENCES categories (id) ON DELETE CASCADE
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS mock_exams;`);
    await queryRunner.query(`DROP TABLE IF EXISTS user_question_interactions;`);
    await queryRunner.query(`DROP TABLE IF EXISTS questions;`);
    await queryRunner.query(`DROP TABLE IF EXISTS categories;`);
    await queryRunner.query(`DROP TABLE IF EXISTS users;`);
  }
}
