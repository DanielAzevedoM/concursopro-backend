import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CategoriesService } from "../services/categories.service";
import { CategoriesController } from "../controllers/categories.controller";
import { Category } from "../entities/category.entity";
import { UserCategory } from "../entities/user-category.entity";
import { User } from "../entities/user.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Category, UserCategory, User])],
  providers: [CategoriesService],
  controllers: [CategoriesController],
  exports: [CategoriesService],
})
export class CategoriesModule {}
