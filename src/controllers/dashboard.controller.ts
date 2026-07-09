import { Controller, Get, UseGuards, Request } from "@nestjs/common";
import { User } from "../entities/user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserQuestionInteraction } from "../entities/user-question-interaction.entity";
import { MockExam } from "../entities/mock-exam.entity";
import { AuthGuard } from "@nestjs/passport";

@Controller("dashboard")
export class DashboardController {
  constructor(
    @InjectRepository(UserQuestionInteraction)
    private interactionRepository: Repository<UserQuestionInteraction>,
    @InjectRepository(MockExam)
    private mockExamRepository: Repository<MockExam>,
    // eslint-disable-next-line prettier/prettier
  ) { }

  @UseGuards(AuthGuard("jwt"))
  @Get()
  async getDashboardMetrics(@Request() req: { user: User }) {
    const user = req.user;

    const totalMockExamsCompleted = await this.mockExamRepository.count({
      where: { userId: user.id },
    });

    return {
      planType: user.planType,
      dailyErrors: user.dailyErrors,
      totalQuestionsSolved: user.totalQuestionsAnswered,
      totalQuestionsCorrect: user.totalQuestionsCorrect,
      totalQuestionsReviewed: user.totalQuestionsRevised,
      totalMockExamsCompleted,
      consecutiveLoginDays: user.consecutiveLoginDays,
    };
  }
}
