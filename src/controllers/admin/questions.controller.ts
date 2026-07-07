import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { AdminGuard } from "../../security/admin.guard";
import { AdminQuestionsService } from "../../services/admin/questions.service";
import { DeepPartial } from "typeorm";
import { Question } from "../../entities/question.entity";

@Controller("admin/questions")
@UseGuards(AuthGuard("jwt"), AdminGuard)
export class AdminQuestionsController {
  // eslint-disable-next-line prettier/prettier
  constructor(private readonly adminQuestionsService: AdminQuestionsService) { }

  @Get()
  findAll() {
    return this.adminQuestionsService.findAll();
  }

  @Post("bulk")
  createBulk(@Body("questions") questions: DeepPartial<Question>[]) {
    return this.adminQuestionsService.createBulk(questions);
  }

  @Delete(":id")
  delete(@Param("id") id: string) {
    return this.adminQuestionsService.delete(id);
  }
}
