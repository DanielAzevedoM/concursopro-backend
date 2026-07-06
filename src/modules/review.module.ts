import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReviewController } from '../controllers/review.controller';
import { UserQuestionInteraction } from '../entities/user-question-interaction.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserQuestionInteraction])],
  controllers: [ReviewController],
})
export class ReviewModule {}
