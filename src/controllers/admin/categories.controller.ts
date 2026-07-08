import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { AdminGuard } from "../../security/admin.guard";
import { AdminCategoriesService } from "../../services/admin/categories.service";
import { Category } from "../../entities/category.entity";
import { Exam } from "../../entities/exam.entity";

@Controller("admin/categories")
@UseGuards(AuthGuard("jwt"), AdminGuard)
export class AdminCategoriesController {
  constructor(
    private readonly adminCategoriesService: AdminCategoriesService,
    // eslint-disable-next-line prettier/prettier
  ) { }

  @Get()
  findAllCategories() {
    return this.adminCategoriesService.findAllCategories();
  }

  @Post()
  createCategory(@Body() data: Partial<Category>) {
    return this.adminCategoriesService.createCategory(data);
  }

  @Put(":id")
  updateCategory(@Param("id") id: string, @Body() data: Partial<Category>) {
    return this.adminCategoriesService.updateCategory(id, data);
  }

  @Delete(":id")
  deleteCategory(@Param("id") id: string) {
    return this.adminCategoriesService.deleteCategory(id);
  }

  @Get("exams")
  findAllExams() {
    return this.adminCategoriesService.findAllExams();
  }

  @Post("exams")
  createExam(@Body() data: Partial<Exam>) {
    return this.adminCategoriesService.createExam(data);
  }

  @Get("exams/:id")
  findOneExam(@Param("id") id: string) {
    return this.adminCategoriesService.findOneExam(id);
  }

  @Put("exams/:id")
  updateExam(@Param("id") id: string, @Body() data: Partial<Exam>) {
    return this.adminCategoriesService.updateExam(id, data);
  }

  @Delete("exams/:id")
  deleteExam(@Param("id") id: string) {
    return this.adminCategoriesService.deleteExam(id);
  }
}
