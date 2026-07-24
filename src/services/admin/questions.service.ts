import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, DeepPartial } from "typeorm";
import { Question } from "../../entities/question.entity";
import { QuestionScope } from "../../entities/question-scope.entity";

@Injectable()
export class AdminQuestionsService {
  constructor(
    @InjectRepository(Question)
    private questionRepository: Repository<Question>,
    @InjectRepository(QuestionScope)
    private scopeRepository: Repository<QuestionScope>,
    // eslint-disable-next-line prettier/prettier
  ) { }

  async createBulk(scopesData: DeepPartial<QuestionScope>[]) {
    const imageKeywordsRegex = /\b(imagem|imagens|figura|figuras|figurinha)\b/i;

    const filteredScopesData = scopesData.filter((scope) => {
      if (scope.text && imageKeywordsRegex.test(scope.text)) {
        return false;
      }

      if (scope.questions) {
        scope.questions = scope.questions.filter((q) => {
          if (q.text && imageKeywordsRegex.test(q.text)) {
            return false;
          }
          return true;
        });

        if (scope.questions.length === 0) {
          return false;
        }
      }

      return true;
    });

    const scopes = this.scopeRepository.create(filteredScopesData);
    return this.scopeRepository.save(scopes);
  }

  async findAll() {
    return this.questionRepository.find({
      relations: ["scope", "scope.category", "scope.exam"],
    });
  }

  async delete(id: string) {
    const question = await this.findOne(id);
    if (!question) return { success: false };

    const scopeId = question.questionScopeId;
    await this.questionRepository.delete(id);

    if (scopeId) {
      const remainingQuestions = await this.questionRepository.count({
        where: { questionScopeId: scopeId },
      });
      if (remainingQuestions === 0) {
        await this.scopeRepository.delete(scopeId);
      }
    }

    return { success: true };
  }

  async findOne(id: string) {
    return this.questionRepository.findOne({
      where: { id },
      relations: ["scope", "scope.category", "scope.exam"],
    });
  }

  async update(id: string, data: Partial<Question> & { baseText?: string }) {
    const { baseText, ...questionData } = data;

    const question = await this.findOne(id);
    if (question && baseText !== undefined && question.questionScopeId) {
      await this.scopeRepository.update(question.questionScopeId, {
        text: baseText,
      });
    }

    await this.questionRepository.update(id, questionData);
    return this.findOne(id);
  }
}
