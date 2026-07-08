import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from "typeorm";
import { UserQuestionInteraction } from "./user-question-interaction.entity";
import { MockExam } from "./mock-exam.entity";
import { UserCategory } from "./user-category.entity";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ length: 255 })
  name: string;

  @Column({ length: 255, unique: true })
  email: string;

  @Column({ length: 255 })
  password: string;

  @Column({ name: "plan_type", length: 50 })
  planType: string;

  @Column({ length: 20, default: "USER" })
  role: string;

  @Column({ name: "daily_errors", default: 0 })
  dailyErrors: number;

  @Column({ name: "last_error_reset", type: "date" })
  lastErrorReset: Date;

  @CreateDateColumn({ name: "created_at", type: "timestamp" })
  createdAt: Date;

  @Column({ name: "reset_code", type: "varchar", length: 6, nullable: true })
  resetCode: string | null;

  @Column({ name: "reset_code_expiry", type: "timestamp", nullable: true })
  resetCodeExpiry: Date | null;

  @OneToMany(() => UserQuestionInteraction, (interaction) => interaction.user)
  interactions: UserQuestionInteraction[];

  @OneToMany(() => MockExam, (mockExam) => mockExam.user)
  mockExams: MockExam[];

  @OneToMany(() => UserCategory, (uc) => uc.user)
  categoryEnrollments: UserCategory[];
}
