import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from "typeorm";
import { Category } from "./category.entity";
import { Exam } from "./exam.entity";
import { Question } from "./question.entity";

@Entity("question_scopes")
export class QuestionScope {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ name: "category_id" })
  categoryId: string;

  @ManyToOne(() => Category, { onDelete: "CASCADE" })
  @JoinColumn({ name: "category_id" })
  category: Category;

  @Column({ name: "exam_id", nullable: true })
  examId: string;

  @ManyToOne(() => Exam, { onDelete: "CASCADE" })
  @JoinColumn({ name: "exam_id" })
  exam: Exam;

  @Column({ type: "text" })
  text: string;

  @Column({ name: "image_url", type: "longtext", nullable: true })
  imageUrl: string;

  @OneToMany(() => Question, (q) => q.scope, { cascade: true })
  questions: Question[];
}
