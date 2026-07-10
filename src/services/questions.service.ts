import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Question } from "../entities/question.entity";
import { QuestionScope } from "../entities/question-scope.entity";
import { User } from "../entities/user.entity";
import { UserQuestionInteraction } from "../entities/user-question-interaction.entity";
import { AnswerQuestionDto } from "../dto/answer-question.dto";

@Injectable()
export class QuestionsService {
  private readonly MAX_DAILY_ERRORS_FREE = 5;

  constructor(
    @InjectRepository(Question)
    private questionRepository: Repository<Question>,
    @InjectRepository(QuestionScope)
    private scopeRepository: Repository<QuestionScope>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(UserQuestionInteraction)
    private interactionRepository: Repository<UserQuestionInteraction>,
    // eslint-disable-next-line prettier/prettier
  ) { }

  async getQuestionsByCategory(categoryId: string) {
    return this.scopeRepository.find({
      where: { categoryId },
      relations: ["questions"],
      select: {
        id: true,
        text: true,
        imageUrl: true,
        questions: {
          id: true,
          type: true,
          text: true,
          subject: true,
          optionA: true,
          optionB: true,
          optionC: true,
          optionD: true,
          optionE: true,
          optionF: true,
        },
      },
    });
  }

  async getQuestionsByExam(examId: string) {
    return this.scopeRepository.find({
      where: { examId },
      relations: ["questions"],
      select: {
        id: true,
        text: true,
        imageUrl: true,
        questions: {
          id: true,
          type: true,
          text: true,
          subject: true,
          optionA: true,
          optionB: true,
          optionC: true,
          optionD: true,
          optionE: true,
          optionF: true,
        },
      },
    });
  }

  async startQuestion(user: User, questionId: string) {
    let interaction = await this.interactionRepository.findOne({
      where: { userId: user.id, questionId },
    });

    if (!interaction) {
      interaction = this.interactionRepository.create({
        userId: user.id,
        questionId,
        startedAt: new Date(),
        isCorrect: null, // Allow null since it's not answered yet
      });
      await this.interactionRepository.save(interaction);
    } else if (interaction.isCorrect === null) {
      // User refreshed or restarted before answering
      interaction.startedAt = new Date();
      await this.interactionRepository.save(interaction);
    }

    return { success: true, timeLimit: 20 };
  }

  async answerQuestion(user: User, request: AnswerQuestionDto) {
    const today = new Date();
    const todayStr = new Date(
      today.getTime() - today.getTimezoneOffset() * 60000,
    )
      .toISOString()
      .split("T")[0];

    let userResetStr = null;
    if (user.lastErrorReset) {
      const resetStr =
        typeof user.lastErrorReset === "string"
          ? user.lastErrorReset
          : user.lastErrorReset.toISOString();
      userResetStr = resetStr.split("T")[0];
    }

    // Reset daily errors se for um dia novo
    if (userResetStr !== todayStr) {
      user.dailyErrors = 0;
      user.lastErrorReset = today;
    }

    let lastLoginStr = null;
    if (user.lastLoginDate) {
      const loginDateStr =
        typeof user.lastLoginDate === "string"
          ? user.lastLoginDate
          : user.lastLoginDate.toISOString();
      lastLoginStr = loginDateStr.split("T")[0];
    }

    if (lastLoginStr !== todayStr) {
      user.lastLoginDate = today;

      if (lastLoginStr) {
        const lastDate = new Date(lastLoginStr);
        const currentDate = new Date(todayStr);
        const diffTime = Math.abs(currentDate.getTime() - lastDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
          user.consecutiveLoginDays = (user.consecutiveLoginDays || 0) + 1;
        } else {
          user.consecutiveLoginDays = 1;
        }
      } else {
        user.consecutiveLoginDays = 1;
      }
    }

    // Free Plan check
    if (
      user.planType === "FREE" &&
      user.dailyErrors >= this.MAX_DAILY_ERRORS_FREE
    ) {
      throw new BadRequestException(
        `Você atingiu o limite de ${this.MAX_DAILY_ERRORS_FREE} erros diários no plano gratuito. Assine o Pro ou tente amanhã.`,
      );
    }

    const question = await this.questionRepository.findOne({
      where: { id: request.questionId },
    });
    if (!question) {
      throw new NotFoundException("Questão não encontrada");
    }

    const interaction = await this.interactionRepository.findOne({
      where: { userId: user.id, questionId: request.questionId },
    });

    let forcedWrong = false;
    let messageSuffix = "";

    if (interaction && interaction.startedAt) {
      const diffMs = today.getTime() - interaction.startedAt.getTime();
      const diffSecs = diffMs / 1000;
      if (diffSecs > 23 || request.selectedOption === "TIMEOUT") {
        // 20s + 3s margin
        forcedWrong = true;
        messageSuffix = " (Tempo esgotado)";
      }
    } else if (request.selectedOption === "TIMEOUT") {
      forcedWrong = true;
      messageSuffix = " (Tempo esgotado)";
    }

    const isCorrect = forcedWrong
      ? false
      : question.correctOption.toLowerCase() ===
      request.selectedOption.toLowerCase();

    user.totalQuestionsAnswered = (user.totalQuestionsAnswered || 0) + 1;

    if (isCorrect) {
      user.totalQuestionsCorrect = (user.totalQuestionsCorrect || 0) + 1;
    } else {
      if (user.planType === "FREE") {
        user.dailyErrors = (user.dailyErrors || 0) + 1;
      }
    }

    await this.userRepository.save(user);

    // Save interaction
    if (interaction) {
      interaction.isCorrect = isCorrect;
      interaction.answeredAt = new Date();
      await this.interactionRepository.save(interaction);
    } else {
      const newInteraction = this.interactionRepository.create({
        userId: user.id,
        questionId: question.id,
        isCorrect,
        answeredAt: new Date(),
      });
      await this.interactionRepository.save(newInteraction);
    }

    const remainingLives =
      user.planType === "FREE"
        ? Math.max(0, this.MAX_DAILY_ERRORS_FREE - user.dailyErrors)
        : -1;
    const message =
      (isCorrect ? "Resposta correta!" : "Resposta incorreta.") + messageSuffix;

    return {
      isCorrect,
      correctOption: question.correctOption,
      explanation: question.explanation,
      remainingLives,
      message,
    };
  }
}
