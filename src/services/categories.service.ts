import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, DataSource } from "typeorm";
import { Category } from "../entities/category.entity";
import { UserCategory } from "../entities/user-category.entity";
import { User } from "../entities/user.entity";

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(UserCategory)
    private userCategoryRepository: Repository<UserCategory>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private dataSource: DataSource,
    // eslint-disable-next-line prettier/prettier
  ) { }

  async findAll(userId?: string) {
    const categories = await this.categoryRepository
      .createQueryBuilder("category")
      .leftJoin("category.exams", "exam")
      .leftJoin("exam.questions", "question")
      .select(["category.id", "category.name", "category.description"])
      .addSelect("COUNT(DISTINCT exam.id)", "examsCount")
      .addSelect("COUNT(DISTINCT question.id)", "questionsCount")
      .groupBy("category.id")
      .getRawMany();

    let enrollments: UserCategory[] = [];
    if (userId) {
      enrollments = await this.userCategoryRepository.find({
        where: { user: { id: userId } },
        relations: ["category"],
      });
    }

    return categories.map(
      (cat: {
        category_id: string;
        category_name: string;
        category_description: string;
        examsCount: string;
        questionsCount: string;
      }) => {
        const enrollment = enrollments.find(
          (e) => e.category.id === cat.category_id,
        );
        return {
          id: cat.category_id,
          name: cat.category_name,
          description: cat.category_description,
          examsCount: Number(cat.examsCount) || 0,
          questionsCount: Number(cat.questionsCount) || 0,
          isEnrolled: !!enrollment,
          enrolledAt: enrollment ? enrollment.createdAt : null,
        };
      },
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

  async enrollCategory(userId: string, categoryId: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException("Usuário não encontrado");

    const category = await this.categoryRepository.findOne({
      where: { id: categoryId },
    });
    if (!category) throw new NotFoundException("Concurso não encontrado");

    const existingEnrollment = await this.userCategoryRepository.findOne({
      where: { user: { id: userId }, category: { id: categoryId } },
    });

    if (existingEnrollment)
      throw new BadRequestException("Já cadastrado neste concurso");

    if (user.planType === "FREE") {
      const currentEnrollmentsCount = await this.userCategoryRepository.count({
        where: { user: { id: userId } },
      });
      if (currentEnrollmentsCount >= 2) {
        throw new BadRequestException(
          "Usuários FREE podem se cadastrar em no máximo 2 concursos simultaneamente.",
        );
      }
    }

    const newEnrollment = this.userCategoryRepository.create({
      user,
      category,
    });
    await this.userCategoryRepository.save(newEnrollment);

    return { message: "Cadastrado com sucesso" };
  }

  async unenrollCategory(userId: string, categoryId: string) {
    const enrollment = await this.userCategoryRepository.findOne({
      where: { user: { id: userId }, category: { id: categoryId } },
    });

    if (!enrollment) throw new NotFoundException("Cadastro não encontrado");

    const now = new Date();
    const enrolledAt = new Date(enrollment.createdAt);
    const diffTime = Math.abs(now.getTime() - enrolledAt.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 15) {
      const remainingDays = 15 - diffDays;
      throw new BadRequestException(
        `Você só pode se descadastrar após 15 dias (Faltam ${remainingDays} dias)`,
      );
    }

    await this.userCategoryRepository.remove(enrollment);
    return { message: "Descadastrado com sucesso" };
  }
}
