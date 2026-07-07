import { Module } from "@nestjs/common";
import { AuthController } from "../controllers/auth.controller";
import { AdminAuthController } from "../controllers/admin/auth.controller";
import { AuthService } from "../services/auth.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "../entities/user.entity";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtStrategy } from "../security/jwt.strategy";

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      // eslint-disable-next-line @typescript-eslint/require-await
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>("JWT_SECRET"),
        signOptions: { expiresIn: "1d" }, // 86400000ms = 1 day
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController, AdminAuthController],
  providers: [AuthService, JwtStrategy],
  exports: [JwtStrategy, PassportModule],
})
// eslint-disable-next-line prettier/prettier
export class AuthModule { }
