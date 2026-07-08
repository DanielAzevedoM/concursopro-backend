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
import { UserQuestionInteraction } from "./user-question-interaction.entity";

@Entity("questions")
export class Question {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ name: "category_id" })
  categoryId: string;

  @ManyToOne(() => Category, (category) => category.questions, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "category_id" })
  category: Category;

  @Column({ name: "exam_id", nullable: true })
  examId: string;

  @ManyToOne(() => Exam, (exam) => exam.questions, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "exam_id" })
  exam: Exam;

  @Column({ type: "varchar", length: 50, default: "MULTIPLE_CHOICE" })
  type: string;

  @Column({ type: "text" })
  text: string;

  @Column({ length: 100, nullable: true })
  subject: string;

  @Column({ name: "image_url", type: "longtext", nullable: true })
  imageUrl: string;

  @Column({ name: "option_a", type: "text", nullable: true })
  optionA: string;

  @Column({ name: "option_b", type: "text", nullable: true })
  optionB: string;

  @Column({ name: "option_c", type: "text", nullable: true })
  optionC: string;

  @Column({ name: "option_d", type: "text", nullable: true })
  optionD: string;

  @Column({ name: "option_e", type: "text", nullable: true })
  optionE: string;

  @Column({ name: "option_f", type: "text", nullable: true })
  optionF: string;

  @Column({ name: "correct_option", length: 1 })
  correctOption: string;

  @Column({ type: "text", nullable: true })
  explanation: string;

  @OneToMany(
    () => UserQuestionInteraction,
    (interaction) => interaction.question,
  )
  interactions: UserQuestionInteraction[];
}
