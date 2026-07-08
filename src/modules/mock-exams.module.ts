import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MockExamsService } from "../services/mock-exams.service";
import { MockExamsController } from "../controllers/mock-exams.controller";
import { MockExam } from "../entities/mock-exam.entity";
import { Question } from "../entities/question.entity";
import { Category } from "../entities/category.entity";

@Module({
  imports: [TypeOrmModule.forFeature([MockExam, Question, Category])],
  providers: [MockExamsService],
  controllers: [MockExamsController],
})
export class MockExamsModule {}
