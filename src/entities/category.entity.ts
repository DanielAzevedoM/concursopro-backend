import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Question } from "./question.entity";
import { MockExam } from "./mock-exam.entity";
import { Exam } from "./exam.entity";

@Entity("categories")
export class Category {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ length: 255, unique: true })
  name: string;

  @Column({ type: "text", nullable: true })
  description: string;

  @OneToMany(() => Question, (question) => question.category)
  questions: Question[];

  @OneToMany(() => MockExam, (mockExam) => mockExam.category)
  mockExams: MockExam[];

  @OneToMany(() => Exam, (exam) => exam.category)
  exams: Exam[];
}
