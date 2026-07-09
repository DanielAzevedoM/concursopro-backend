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
    await this.questionRepository.delete(id);
    return { success: true };
  }

  async findOne(id: string) {
    return this.questionRepository.findOne({
      where: { id },
      relations: ["scope", "scope.category", "scope.exam"],
    });
  }

  async update(id: string, data: Partial<Question>) {
    await this.questionRepository.update(id, data);
    return this.findOne(id);
  }
}
