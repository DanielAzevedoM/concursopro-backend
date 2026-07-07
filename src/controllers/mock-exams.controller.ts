import {
  Controller,
  Post,
  Get,
  Put,
  Param,
  UseGuards,
  Request,
  Query,
  ParseIntPipe,
  DefaultValuePipe,
} from "@nestjs/common";
import { User } from "../entities/user.entity";
import { MockExamsService } from "../services/mock-exams.service";
import { AuthGuard } from "@nestjs/passport";

@Controller("mock-exams")
export class MockExamsController {
  constructor(private readonly mockExamsService: MockExamsService) { }

  @UseGuards(AuthGuard("jwt"))
  @Post("start/:categoryId")
  startMockExam(
    @Request() req: { user: User },
    @Param("categoryId") categoryId: string,
  ) {
    return this.mockExamsService.startMockExam(req.user, categoryId);
  }

  @Get("questions/:categoryId")
  getMockExamQuestions(
    @Param("categoryId") categoryId: string,
    @Query("limit", new DefaultValuePipe(50), ParseIntPipe) limit: number,
  ) {
    return this.mockExamsService.getMockExamQuestions(categoryId, limit);
  }

  @UseGuards(AuthGuard("jwt"))
  @Put("finish/:mockExamId")
  finishMockExam(
    @Request() req: { user: User },
    @Param("mockExamId") mockExamId: string,
    @Query("correctAnswers", ParseIntPipe) correctAnswers: number,
    @Query("totalQuestions", ParseIntPipe) totalQuestions: number,
  ) {
    return this.mockExamsService.finishMockExam(
      req.user,
      mockExamId,
      correctAnswers,
      totalQuestions,
    );
  }
}
