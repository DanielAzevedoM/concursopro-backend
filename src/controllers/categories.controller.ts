import { Controller, Get, Param } from "@nestjs/common";
import { CategoriesService } from "../services/categories.service";

@Controller("categories")
export class CategoriesController {
  // eslint-disable-next-line prettier/prettier
  constructor(private readonly categoriesService: CategoriesService) { }

  @Get()
  getAllCategories() {
    return this.categoriesService.findAll();
  }

  @Get(":categoryId/details")
  getCategoryDetails(@Param("categoryId") categoryId: string) {
    return this.categoriesService.getCategoryDetails(categoryId);
  }
}
