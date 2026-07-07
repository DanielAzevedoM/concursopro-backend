import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Question } from '../entities/question.entity';
import { User } from '../entities/user.entity';
import { UserQuestionInteraction } from '../entities/user-question-interaction.entity';
import { AnswerQuestionDto } from '../dto/answer-question.dto';

@Injectable()
export class QuestionsService {
  private readonly MAX_DAILY_ERRORS_FREE = 5;

  constructor(
    @InjectRepository(Question)
    private questionRepository: Repository<Question>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(UserQuestionInteraction)
    private interactionRepository: Repository<UserQuestionInteraction>,
  ) {}

  async getQuestionsByCategory(categoryId: string) {
    return this.questionRepository.find({ where: { categoryId } });
  }

  async getQuestionsByExam(examId: string) {
    return this.questionRepository.find({ 
      where: { examId },
      select: ['id', 'categoryId', 'examId', 'text', 'subject', 'optionA', 'optionB', 'optionC', 'optionD', 'optionE', 'optionF'] // Do not send correctOption/explanation!
    });
  }

  async answerQuestion(user: User, request: AnswerQuestionDto) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const userLastErrorReset = new Date(user.lastErrorReset);
    userLastErrorReset.setHours(0, 0, 0, 0);

    // Reset daily errors if needed
    if (userLastErrorReset.getTime() !== today.getTime()) {
      user.dailyErrors = 0;
      user.lastErrorReset = today;
      await this.userRepository.save(user);
    }

    // Free Plan check
    if (user.planType === 'FREE' && user.dailyErrors >= this.MAX_DAILY_ERRORS_FREE) {
      throw new BadRequestException(`Você atingiu o limite de ${this.MAX_DAILY_ERRORS_FREE} erros diários no plano gratuito. Assine o Pro ou tente amanhã.`);
    }

    const question = await this.questionRepository.findOne({ where: { id: request.questionId } });
    if (!question) {
      throw new NotFoundException('Questão não encontrada');
    }

    const isCorrect = question.correctOption.toLowerCase() === request.selectedOption.toLowerCase();

    if (!isCorrect && user.planType === 'FREE') {
      user.dailyErrors += 1;
      await this.userRepository.save(user);
    }

    // Save interaction
    const interaction = this.interactionRepository.create({
      userId: user.id,
      questionId: question.id,
      isCorrect,
    });
    await this.interactionRepository.save(interaction);

    const remainingLives = user.planType === 'FREE' ? Math.max(0, this.MAX_DAILY_ERRORS_FREE - user.dailyErrors) : -1;
    const message = isCorrect ? 'Resposta correta!' : 'Resposta incorreta.';

    return {
      isCorrect,
      correctOption: question.correctOption,
      explanation: question.explanation,
      remainingLives,
      message,
    };
  }
}
