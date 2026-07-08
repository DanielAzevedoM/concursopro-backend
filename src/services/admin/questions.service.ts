import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Question } from "../../entities/question.entity";

@Injectable()
export class AdminQuestionsService {
  constructor(
    @InjectRepository(Question)
    private questionRepository: Repository<Question>,
    // eslint-disable-next-line prettier/prettier
  ) { }

  async createBulk(questionsData: Partial<Question>[]) {
    const questions = this.questionRepository.create(questionsData);
    return this.questionRepository.save(questions);
  }

  async findAll() {
    return this.questionRepository.find({ relations: ["category", "exam"] });
  }

  async delete(id: string) {
    await this.questionRepository.delete(id);
    return { success: true };
  }

  async findOne(id: string) {
    return this.questionRepository.findOne({
      where: { id },
      relations: ["category", "exam"],
    });
  }

  async update(id: string, data: Partial<Question>) {
    await this.questionRepository.update(id, data);
    return this.findOne(id);
  }
}
