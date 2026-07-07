import { Controller, Post, Body, HttpCode, HttpStatus } from "@nestjs/common";
import { AuthService } from "../../services/auth.service";
import { LoginDto } from "../../dto/login.dto";

@Controller("admin/auth")
export class AdminAuthController {
  // eslint-disable-next-line prettier/prettier
  constructor(private readonly authService: AuthService) { }

  @Post("login")
  @HttpCode(HttpStatus.OK)
  login(@Body() loginDto: LoginDto) {
    return this.authService.adminLogin(loginDto);
  }
}
