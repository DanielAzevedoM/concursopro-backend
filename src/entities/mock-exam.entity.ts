import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from "typeorm";
import { User } from "./user.entity";
import { Category } from "./category.entity";

@Entity("mock_exams")
export class MockExam {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ name: "user_id" })
  userId: string;

  @ManyToOne(() => User, (user) => user.mockExams, { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  user: User;

  @Column({ name: "category_id" })
  categoryId: string;

  @ManyToOne(() => Category, (category) => category.mockExams, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "category_id" })
  category: Category;

  @CreateDateColumn({ name: "started_at", type: "timestamp without time zone" })
  startedAt: Date;

  @Column({
    name: "finished_at",
    type: "timestamp without time zone",
    nullable: true,
  })
  finishedAt: Date;

  @Column({ name: "total_questions", default: 0 })
  totalQuestions: number;

  @Column({ name: "correct_answers", default: 0 })
  correctAnswers: number;
}
