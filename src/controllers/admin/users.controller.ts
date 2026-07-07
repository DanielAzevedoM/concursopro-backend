import { Controller, Get, Delete, Param, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { AdminGuard } from "../../security/admin.guard";
import { AdminUsersService } from "../../services/admin/users.service";

@Controller("admin/users")
@UseGuards(AuthGuard("jwt"), AdminGuard)
export class AdminUsersController {
  // eslint-disable-next-line prettier/prettier
  constructor(private readonly adminUsersService: AdminUsersService) { }

  @Get()
  findAll() {
    return this.adminUsersService.findAll();
  }

  @Delete(":id")
  delete(@Param("id") id: string) {
    return this.adminUsersService.delete(id);
  }
}
