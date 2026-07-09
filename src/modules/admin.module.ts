import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "../entities/user.entity";
import { Category } from "../entities/category.entity";
import { Exam } from "../entities/exam.entity";
import { Question } from "../entities/question.entity";
import { QuestionScope } from "../entities/question-scope.entity";

import { AdminUsersController } from "../controllers/admin/users.controller";
import { AdminCategoriesController } from "../controllers/admin/categories.controller";
import { AdminQuestionsController } from "../controllers/admin/questions.controller";

import { AdminUsersService } from "../services/admin/users.service";
import { AdminCategoriesService } from "../services/admin/categories.service";
import { AdminQuestionsService } from "../services/admin/questions.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Category, Exam, Question, QuestionScope]),
  ],
  controllers: [
    AdminUsersController,
    AdminCategoriesController,
    AdminQuestionsController,
  ],
  providers: [AdminUsersService, AdminCategoriesService, AdminQuestionsService],
})
// eslint-disable-next-line prettier/prettier
export class AdminModule { }
