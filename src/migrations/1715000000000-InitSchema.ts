import { MigrationInterface, QueryRunner } from "typeorm";

export class InitSchema1715000000000 implements MigrationInterface {
  name = "InitSchema1715000000000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS users (
          id VARCHAR(36) PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) NOT NULL UNIQUE,
          password VARCHAR(255) NOT NULL,
          plan_type VARCHAR(50) NOT NULL,
          role VARCHAR(20) NOT NULL DEFAULT 'USER',
          daily_errors INT NOT NULL DEFAULT 0,
          last_error_reset DATE NOT NULL,
          created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
          reset_code VARCHAR(6),
          reset_code_expiry TIMESTAMP NULL
      );
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS categories (
          id VARCHAR(36) PRIMARY KEY,
          name VARCHAR(255) NOT NULL UNIQUE,
          description TEXT
      );
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS exams (
          id VARCHAR(36) PRIMARY KEY,
          category_id VARCHAR(36) NOT NULL,
          name VARCHAR(255) NOT NULL,
          year VARCHAR(50),
          institution VARCHAR(255),
          CONSTRAINT fk_exam_category FOREIGN KEY (category_id) REFERENCES categories (id) ON DELETE CASCADE
      );
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS questions (
          id VARCHAR(36) PRIMARY KEY,
          category_id VARCHAR(36) NOT NULL,
          text TEXT NOT NULL,
          option_a TEXT,
          option_b TEXT,
          option_c TEXT,
          option_d TEXT,
          option_e TEXT,
          option_f TEXT,
          subject VARCHAR(100),
          correct_option VARCHAR(1) NOT NULL,
          explanation TEXT,
          exam_id VARCHAR(36),
          CONSTRAINT fk_category FOREIGN KEY (category_id) REFERENCES categories (id) ON DELETE CASCADE,
          CONSTRAINT fk_exam FOREIGN KEY (exam_id) REFERENCES exams (id) ON DELETE CASCADE
      );
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS user_question_interactions (
          id VARCHAR(36) PRIMARY KEY,
          user_id VARCHAR(36) NOT NULL,
          question_id VARCHAR(36) NOT NULL,
          is_correct BOOLEAN NOT NULL,
          is_reviewed BOOLEAN NOT NULL DEFAULT FALSE,
          answered_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT fk_user_interaction FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
          CONSTRAINT fk_question_interaction FOREIGN KEY (question_id) REFERENCES questions (id) ON DELETE CASCADE
      );
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS mock_exams (
          id VARCHAR(36) PRIMARY KEY,
          user_id VARCHAR(36) NOT NULL,
          category_id VARCHAR(36) NOT NULL,
          started_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
          finished_at TIMESTAMP NULL,
          total_questions INT NOT NULL DEFAULT 0,
          correct_answers INT NOT NULL DEFAULT 0,
          CONSTRAINT fk_user_mock FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
          CONSTRAINT fk_category_mock FOREIGN KEY (category_id) REFERENCES categories (id) ON DELETE CASCADE
      );
    `);

    // Insert mock admin user (password: admin123)
    await queryRunner.query(`
      INSERT INTO users (id, name, email, password, plan_type, role, daily_errors, last_error_reset) VALUES 
      ('u9999999-9999-9999-9999-999999999999', 'Admin ConcursoPro', 'admin@concursopro.com', '$2b$10$wN9P.p/.RMBWv04h7m8h..E7zL9VXYoR0P5bWwU.sEaCZZZ.c4e9i', 'PRO', 'ADMIN', 0, CURRENT_DATE);
    `);

    // Insert mock categories
    await queryRunner.query(`
      INSERT INTO categories (id, name, description) VALUES 
      ('c1111111-1111-1111-1111-111111111111', 'PRF', 'Polícia Rodoviária Federal'),
      ('c2222222-2222-2222-2222-222222222222', 'SEFAZ', 'Secretaria da Fazenda'),
      ('c3333333-3333-3333-3333-333333333333', 'TRF', 'Tribunal Regional Federal'),
      ('c4444444-4444-4444-4444-444444444444', 'MEC', 'Ministério da Educação'),
      ('c5555555-5555-5555-5555-555555555555', 'Receita Federal', 'Receita Federal do Brasil'),
      ('c6666666-6666-6666-6666-666666666666', 'ANVISA', 'Agência Nacional de Vigilância Sanitária');
    `);

    await queryRunner.query(`
      INSERT INTO exams (id, category_id, name, year, institution) VALUES 
      ('e1111111-1111-1111-1111-111111111111', 'c1111111-1111-1111-1111-111111111111', 'Prova PRF 2021', '2021', 'CEBRASPE'),
      ('e1111111-1111-1111-1111-111111111112', 'c1111111-1111-1111-1111-111111111111', 'Prova PRF 2018', '2018', 'CEBRASPE'),
      ('e1111111-1111-1111-1111-111111111113', 'c1111111-1111-1111-1111-111111111111', 'Prova PRF 2013', '2013', 'CESPE'),
      
      ('e2222222-2222-2222-2222-222222222221', 'c2222222-2222-2222-2222-222222222222', 'Prova SEFAZ MG 2022', '2022', 'FGV'),
      ('e2222222-2222-2222-2222-222222222222', 'c2222222-2222-2222-2222-222222222222', 'Prova SEFAZ SP 2013', '2013', 'FCC');
    `);

    await queryRunner.query(`
      INSERT INTO questions (id, category_id, exam_id, text, correct_option, subject) VALUES 
      ('q1111111-1111-1111-1111-111111111111', 'c1111111-1111-1111-1111-111111111111', 'e1111111-1111-1111-1111-111111111111', 'Questão 1 da PRF', 'A', 'Português'),
      ('q1111111-1111-1111-1111-111111111112', 'c1111111-1111-1111-1111-111111111111', 'e1111111-1111-1111-1111-111111111111', 'Questão 2 da PRF', 'B', 'Matemática'),
      ('q2222222-2222-2222-2222-222222222221', 'c2222222-2222-2222-2222-222222222222', 'e2222222-2222-2222-2222-222222222221', 'Questão 1 da SEFAZ', 'C', 'Direito Tributário');
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS mock_exams;`);
    await queryRunner.query(`DROP TABLE IF EXISTS user_question_interactions;`);
    await queryRunner.query(`DROP TABLE IF EXISTS questions;`);
    await queryRunner.query(`DROP TABLE IF EXISTS exams;`);
    await queryRunner.query(`DROP TABLE IF EXISTS categories;`);
    await queryRunner.query(`DROP TABLE IF EXISTS users;`);
  }
}
