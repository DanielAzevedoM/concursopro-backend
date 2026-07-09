import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { QuestionsService } from "../services/questions.service";
import { QuestionsController } from "../controllers/questions.controller";
import { Question } from "../entities/question.entity";
import { QuestionScope } from "../entities/question-scope.entity";
import { User } from "../entities/user.entity";
import { UserQuestionInteraction } from "../entities/user-question-interaction.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Question,
      QuestionScope,
      User,
      UserQuestionInteraction,
    ]),
  ],
  providers: [QuestionsService],
  controllers: [QuestionsController],
})
export class QuestionsModule {}
