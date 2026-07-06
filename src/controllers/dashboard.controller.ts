import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { User } from '../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserQuestionInteraction } from '../entities/user-question-interaction.entity';
import { MockExam } from '../entities/mock-exam.entity';
import { AuthGuard } from '@nestjs/passport';

@Controller('api/dashboard')
export class DashboardController {
  constructor(
    @InjectRepository(UserQuestionInteraction)
    private interactionRepository: Repository<UserQuestionInteraction>,
    @InjectRepository(MockExam)
    private mockExamRepository: Repository<MockExam>,
  ) {}

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async getDashboardMetrics(@Request() req: { user: User }) {
    const user = req.user;

    const totalQuestionsSolved = await this.interactionRepository.count({
      where: { userId: user.id },
    });
    const totalQuestionsCorrect = await this.interactionRepository.count({
      where: { userId: user.id, isCorrect: true },
    });
    const totalQuestionsReviewed = await this.interactionRepository.count({
      where: { userId: user.id, isReviewed: true },
    });
    const totalMockExamsCompleted = await this.mockExamRepository.count({
      where: { userId: user.id },
    });

    return {
      planType: user.planType,
      dailyErrors: user.dailyErrors,
      totalQuestionsSolved,
      totalQuestionsCorrect,
      totalQuestionsReviewed,
      totalMockExamsCompleted,
    };
  }
}
