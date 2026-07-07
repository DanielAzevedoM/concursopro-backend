import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, DataSource } from "typeorm";
import { Category } from "../entities/category.entity";

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    private dataSource: DataSource,
    // eslint-disable-next-line prettier/prettier
  ) { }

  async findAll() {
    const categories = await this.categoryRepository
      .createQueryBuilder("category")
      .leftJoin("category.exams", "exam")
      .leftJoin("exam.questions", "question")
      .select(["category.id", "category.name", "category.description"])
      .addSelect("COUNT(DISTINCT exam.id)", "examsCount")
      .addSelect("COUNT(DISTINCT question.id)", "questionsCount")
      .groupBy("category.id")
      .getRawMany();

    return categories.map(
      (cat: {
        category_id: string;
        category_name: string;
        category_description: string;
        examsCount: string;
        questionsCount: string;
      }) => ({
        id: cat.category_id,
        name: cat.category_name,
        description: cat.category_description,
        examsCount: Number(cat.examsCount) || 0,
        questionsCount: Number(cat.questionsCount) || 0,
      }),
    );
  }

  async getCategoryDetails(categoryId: string) {
    const category = await this.categoryRepository.findOne({
      where: { id: categoryId },
      relations: ["exams", "exams.questions"],
    });

    if (!category) return null;

    const subjectsMap: Record<string, number> = {};
    let totalQuestions = 0;

    category.exams.forEach((exam) => {
      exam.questions.forEach((q) => {
        totalQuestions++;
        const subject = q.subject || "Outros";
        subjectsMap[subject] = (subjectsMap[subject] || 0) + 1;
      });
    });

    return {
      category: {
        id: category.id,
        name: category.name,
        description: category.description,
      },
      exams: category.exams.map((e) => ({
        id: e.id,
        name: e.name,
        year: e.year,
        institution: e.institution,
        questionsCount: e.questions ? e.questions.length : 0,
      })),
      totalQuestions,
      subjects: subjectsMap,
    };
  }
}
