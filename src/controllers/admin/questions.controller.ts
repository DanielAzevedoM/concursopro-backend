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
import { AdminQuestionsService } from "../../services/admin/questions.service";
import { QuestionScope } from "../../entities/question-scope.entity";
import { Question } from "../../entities/question.entity";
import { DeepPartial } from "typeorm";

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
  createBulk(@Body("scopes") scopes: DeepPartial<QuestionScope>[]) {
    return this.adminQuestionsService.createBulk(scopes);
  }

  @Delete(":id")
  delete(@Param("id") id: string) {
    return this.adminQuestionsService.delete(id);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.adminQuestionsService.findOne(id);
  }

  @Put(":id")
  update(@Param("id") id: string, @Body() data: Partial<Question>) {
    return this.adminQuestionsService.update(id, data);
  }
}
