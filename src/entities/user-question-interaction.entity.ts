import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from "typeorm";
import { User } from "./user.entity";
import { Question } from "./question.entity";

@Entity("user_question_interactions")
export class UserQuestionInteraction {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ name: "user_id" })
  userId: string;

  @ManyToOne(() => User, (user) => user.interactions, { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  user: User;

  @Column({ name: "question_id" })
  questionId: string;

  @ManyToOne(() => Question, (question) => question.interactions, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "question_id" })
  question: Question;

  @Column({ name: "is_correct", type: "boolean", nullable: true })
  isCorrect: boolean | null;

  @Column({ name: "is_reviewed", default: false })
  isReviewed: boolean;

  @Column({ name: "started_at", type: "timestamp", nullable: true })
  startedAt: Date;

  @CreateDateColumn({
    name: "answered_at",
    type: "timestamp",
  })
  answeredAt: Date;
}
