import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeepPartial, Repository } from "typeorm";
import { Question } from "../../entities/question.entity";

@Injectable()
export class AdminQuestionsService {
  constructor(
    @InjectRepository(Question)
    private questionRepository: Repository<Question>,
    // eslint-disable-next-line prettier/prettier
  ) { }

  async createBulk(questionsData: DeepPartial<Question>[]) {
    const questions = this.questionRepository.create(questionsData);
    return this.questionRepository.save(questions);
  }

  async findAll() {
    return this.questionRepository.find({ relations: ["category", "exam"] });
  }

  async delete(id: string) {
    await this.questionRepository.delete(id);
  }
}
