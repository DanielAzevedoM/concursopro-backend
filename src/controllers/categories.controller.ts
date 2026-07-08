import {
  Controller,
  Get,
  Param,
  Post,
  Delete,
  UseGuards,
  Request,
} from "@nestjs/common";
import { CategoriesService } from "../services/categories.service";
import { AuthGuard } from "@nestjs/passport";
import { Request as ExpressRequest } from "express";
import { User } from "../entities/user.entity";

interface RequestWithUser extends ExpressRequest {
  user: User;
}

@Controller("categories")
export class CategoriesController {
  // eslint-disable-next-line prettier/prettier
  constructor(private readonly categoriesService: CategoriesService) { }

  @UseGuards(AuthGuard("jwt"))
  @Get()
  getAllCategories(@Request() req: RequestWithUser) {
    const userId = req.user.id;
    return this.categoriesService.findAll(userId);
  }

  @UseGuards(AuthGuard("jwt"))
  @Get(":categoryId/details")
  getCategoryDetails(@Param("categoryId") categoryId: string) {
    return this.categoriesService.getCategoryDetails(categoryId);
  }

  @UseGuards(AuthGuard("jwt"))
  @Post(":categoryId/enroll")
  enrollCategory(
    @Request() req: RequestWithUser,
    @Param("categoryId") categoryId: string,
  ) {
    return this.categoriesService.enrollCategory(req.user.id, categoryId);
  }

  @UseGuards(AuthGuard("jwt"))
  @Delete(":categoryId/enroll")
  unenrollCategory(
    @Request() req: RequestWithUser,
    @Param("categoryId") categoryId: string,
  ) {
    return this.categoriesService.unenrollCategory(req.user.id, categoryId);
  }
}
