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
    return this.examRepository.find({ relations: ["category"] });
  }

  async createExam(data: Partial<Exam>) {
    const exam = this.examRepository.create(data);
    return this.examRepository.save(exam);
  }
}
