/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Category } from "../../entities/category.entity";
import { Exam } from "../../entities/exam.entity";

@Injectable()
export class AdminCategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(Exam)
    private examRepository: Repository<Exam>,
    // eslint-disable-next-line prettier/prettier
  ) { }

  async findAllCategories() {
    return this.categoryRepository.find();
  }

  async createCategory(data: Partial<Category>) {
    const category = this.categoryRepository.create(data);
    return this.categoryRepository.save(category);
  }

  async findAllExams() {
    return this.examRepository
      .createQueryBuilder("exam")
      .leftJoinAndSelect("exam.category", "category")
      .loadRelationCountAndMap("exam.questionsCount", "exam.questionScopes")
      .getMany();
  }

  async findOneExam(id: string) {
    const exam = await this.examRepository.findOne({
      where: { id },
      relations: ["category", "questionScopes", "questionScopes.questions"],
    });

    if (exam) {
      const allQuestions: any[] = [];
      exam.questionScopes?.forEach((scope) => {
        if (scope.questions) {
          scope.questions.forEach((q) => {
            allQuestions.push({
              ...q,
              scope: {
                id: scope.id,
                text: scope.text,
                imageUrl: scope.imageUrl,
              },
            });
          });
        }
      });
      (exam as any).questions = allQuestions;
    }

    return exam;
  }

  async createExam(data: Partial<Exam>) {
    const exam = this.examRepository.create(data);
    return this.examRepository.save(exam);
  }

  async updateCategory(id: string, data: Partial<Category>) {
    await this.categoryRepository.update(id, data);
    return this.categoryRepository.findOne({ where: { id } });
  }

  async deleteCategory(id: string) {
    await this.categoryRepository.delete(id);
    return { success: true };
  }

  async updateExam(id: string, data: Partial<Exam>) {
    await this.examRepository.update(id, data);
    return this.examRepository.findOne({
      where: { id },
      relations: ["category"],
    });
  }

  async deleteExam(id: string) {
    await this.examRepository.delete(id);
    return { success: true };
  }
}
