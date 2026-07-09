import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from "typeorm";
import { Category } from "./category.entity";
import { QuestionScope } from "./question-scope.entity";

@Entity("exams")
export class Exam {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ name: "category_id" })
  categoryId: string;

  @ManyToOne(() => Category, (category) => category.exams, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "category_id" })
  category: Category;

  @Column({ length: 255 })
  name: string;

  @Column({ length: 50, nullable: true })
  year: string;

  @Column({ length: 255, nullable: true })
  institution: string;

  @Column({ length: 255, nullable: true })
  role: string;

  @OneToMany(() => QuestionScope, (scope) => scope.exam)
  questionScopes: QuestionScope[];
}
