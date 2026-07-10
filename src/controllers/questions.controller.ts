import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
} from "@nestjs/common";
import { User } from "../entities/user.entity";
import { QuestionsService } from "../services/questions.service";
import { AnswerQuestionDto } from "../dto/answer-question.dto";
import { AuthGuard } from "@nestjs/passport";

@Controller("questions")
export class QuestionsController {
  // eslint-disable-next-line prettier/prettier
  constructor(private readonly questionsService: QuestionsService) { }

  @Get("category/:categoryId")
  getQuestionsByCategory(@Param("categoryId") categoryId: string) {
    return this.questionsService.getQuestionsByCategory(categoryId);
  }

  @Get("exam/:examId")
  getQuestionsByExam(@Param("examId") examId: string) {
    return this.questionsService.getQuestionsByExam(examId);
  }

  @UseGuards(AuthGuard("jwt"))
  @Post("start")
  startQuestion(
    @Request() req: { user: User },
    @Body("questionId") questionId: string,
  ) {
    return this.questionsService.startQuestion(req.user, questionId);
  }

  @UseGuards(AuthGuard("jwt"))
  @Post("answer")
  answerQuestion(
    @Request() req: { user: User },
    @Body() answerQuestionDto: AnswerQuestionDto,
  ) {
    return this.questionsService.answerQuestion(req.user, answerQuestionDto);
  }
}
