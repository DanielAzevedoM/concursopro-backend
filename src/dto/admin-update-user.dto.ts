import { IsEmail, IsOptional, IsString, IsIn } from "class-validator";

export class AdminUpdateUserDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @IsIn(["FREE", "PRO"])
  planType?: string;

  @IsOptional()
  @IsString()
  password?: string;
}
