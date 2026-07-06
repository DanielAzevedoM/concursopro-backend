import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MockExam } from '../entities/mock-exam.entity';
import { Question } from '../entities/question.entity';
import { Category } from '../entities/category.entity';
import { User } from '../entities/user.entity';

@Injectable()
export class MockExamsService {
  constructor(
    @InjectRepository(MockExam)
    private mockExamRepository: Repository<MockExam>,
    @InjectRepository(Question)
    private questionRepository: Repository<Question>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async startMockExam(user: User, categoryId: string) {
    if (user.planType !== 'PRO') {
      throw new ForbiddenException('Simulados são exclusivos para assinantes PRO.');
    }

    const category = await this.categoryRepository.findOne({ where: { id: categoryId } });
    if (!category) {
      throw new NotFoundException('Categoria não encontrada');
    }

    const mockExam = this.mockExamRepository.create({
      userId: user.id,
      categoryId: category.id,
    });

    return this.mockExamRepository.save(mockExam);
  }

  async getMockExamQuestions(categoryId: string, limit: number = 50) {
    return this.questionRepository
      .createQueryBuilder('question')
      .where('question.category_id = :categoryId', { categoryId })
      .orderBy('RANDOM()')
      .take(limit)
      .getMany();
  }

  async finishMockExam(user: User, mockExamId: string, correctAnswers: number, totalQuestions: number) {
    const mockExam = await this.mockExamRepository.findOne({ where: { id: mockExamId } });
    
    if (!mockExam) {
      throw new NotFoundException('Simulado não encontrado');
    }

    if (mockExam.userId !== user.id) {
      throw new ForbiddenException('Simulado não pertence a este usuário');
    }

    mockExam.finishedAt = new Date();
    mockExam.correctAnswers = correctAnswers;
    mockExam.totalQuestions = totalQuestions;

    return this.mockExamRepository.save(mockExam);
  }
}
