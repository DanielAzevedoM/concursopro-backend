import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { User } from "./user.entity";
import { Category } from "./category.entity";

@Entity("user_categories")
export class UserCategory {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => User, (user) => user.categoryEnrollments, { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  user: User;

  @ManyToOne(() => Category, (category) => category.userEnrollments, { onDelete: "CASCADE" })
  @JoinColumn({ name: "category_id" })
  category: Category;

  @CreateDateColumn({ name: "created_at", type: "timestamp" })
  createdAt: Date;
}
