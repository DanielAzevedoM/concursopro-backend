import {
  Controller,
  Get,
  Delete,
  Put,
  Param,
  Body,
  UseGuards,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { AdminGuard } from "../../security/admin.guard";
import { AdminUsersService } from "../../services/admin/users.service";
import { AdminUpdateUserDto } from "../../dto/admin-update-user.dto";

@Controller("admin/users")
@UseGuards(AuthGuard("jwt"), AdminGuard)
export class AdminUsersController {
  // eslint-disable-next-line prettier/prettier
  constructor(private readonly adminUsersService: AdminUsersService) { }

  @Get()
  findAll() {
    return this.adminUsersService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.adminUsersService.findOne(id);
  }

  @Put(":id")
  update(@Param("id") id: string, @Body() updateData: AdminUpdateUserDto) {
    return this.adminUsersService.update(id, updateData);
  }

  @Delete(":id")
  delete(@Param("id") id: string) {
    return this.adminUsersService.delete(id);
  }
}
