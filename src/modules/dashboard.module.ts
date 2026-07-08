import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DashboardController } from "../controllers/dashboard.controller";
import { UserQuestionInteraction } from "../entities/user-question-interaction.entity";
import { MockExam } from "../entities/mock-exam.entity";

@Module({
  imports: [TypeOrmModule.forFeature([UserQuestionInteraction, MockExam])],
  controllers: [DashboardController],
})
export class DashboardModule {}
