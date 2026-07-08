import { IsEmail, IsString, MinLength } from "class-validator";

export class ResetPasswordDto {
  @IsEmail({}, { message: "Formato de e-mail inválido" })
  email: string;

  @IsString()
  code: string;

  @IsString()
  @MinLength(6, { message: "A nova senha deve ter no mínimo 6 caracteres" })
  newPassword: string;
}
