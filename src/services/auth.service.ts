import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  Logger,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "../entities/user.entity";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { RegisterDto } from "../dto/register.dto";
import { LoginDto } from "../dto/login.dto";

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
    // eslint-disable-next-line prettier/prettier
  ) { }

  async register(registerDto: RegisterDto) {
    const existingUser = await this.userRepository.findOne({
      where: { email: registerDto.email },
    });
    if (existingUser) {
      throw new BadRequestException("Email já está em uso");
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    const user = this.userRepository.create({
      name: registerDto.name,
      email: registerDto.email,
      password: hashedPassword,
      planType: "FREE",
      dailyErrors: 0,
      lastErrorReset: new Date(),
    });

    await this.userRepository.save(user);

    const payload = { sub: user.email, id: user.id };
    const jwtToken = this.jwtService.sign(payload);

    return {
      token: jwtToken,
      name: user.name,
      email: user.email,
      planType: user.planType,
      role: user.role,
    };
  }

  async login(loginDto: LoginDto) {
    const user = await this.userRepository.findOne({
      where: { email: loginDto.email },
    });

    if (!user) {
      throw new UnauthorizedException("Usuário não encontrado");
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException("Credenciais inválidas");
    }

    const today = new Date();
    // Local date string for today
    const todayStr = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().split('T')[0];

    let userLastLoginStr = null;
    let diffDays = 0;

    if (user.lastLoginDate) {
      const loginStr = typeof user.lastLoginDate === 'string' 
          ? user.lastLoginDate 
          : (user.lastLoginDate as Date).toISOString();
      userLastLoginStr = loginStr.split('T')[0];
        
      // Calculate difference in days (ignoring time)
      const d1 = new Date(todayStr);
      const d2 = new Date(userLastLoginStr);
      diffDays = Math.round((d1.getTime() - d2.getTime()) / (1000 * 3600 * 24));
    }

    if (!userLastLoginStr) {
      user.consecutiveLoginDays = 1;
      user.lastLoginDate = today;
      await this.userRepository.save(user);
    } else {
      if (diffDays === 1) {
        user.consecutiveLoginDays = (user.consecutiveLoginDays || 0) + 1;
        user.lastLoginDate = today;
        await this.userRepository.save(user);
      } else if (diffDays > 1) {
        user.consecutiveLoginDays = 1;
        user.lastLoginDate = today;
        await this.userRepository.save(user);
      }
    }

    const payload = { sub: user.email, id: user.id };
    const jwtToken = this.jwtService.sign(payload);

    return {
      token: jwtToken,
      name: user.name,
      email: user.email,
      planType: user.planType,
      role: user.role,
    };
  }

  async adminLogin(loginDto: LoginDto) {
    const user = await this.userRepository.findOne({
      where: { email: loginDto.email },
    });

    if (!user) {
      throw new UnauthorizedException("Usuário não encontrado");
    }

    if (user.role !== "ADMIN") {
      throw new UnauthorizedException("Acesso restrito para administradores");
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException("Credenciais inválidas");
    }

    const payload = { sub: user.email, id: user.id, adminContext: true };
    const jwtToken = this.jwtService.sign(payload, { expiresIn: "1h" });

    return {
      token: jwtToken,
      name: user.name,
      email: user.email,
      planType: user.planType,
      role: user.role,
    };
  }

  async getMe(user: User) {
    const freshUser = await this.userRepository.findOne({
      where: { id: user.id },
    });
    if (!freshUser) {
      throw new UnauthorizedException("Usuário não encontrado");
    }
    return {
      name: freshUser.name,
      email: freshUser.email,
      planType: freshUser.planType,
      role: freshUser.role,
      dailyErrors: freshUser.dailyErrors,
      lastErrorReset: freshUser.lastErrorReset,
    };
  }

  async forgotPassword(email: string) {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new BadRequestException("Usuário não encontrado com este e-mail");
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetCode = code;

    const expiry = new Date();
    expiry.setMinutes(expiry.getMinutes() + 15);
    user.resetCodeExpiry = expiry;

    await this.userRepository.save(user);

    this.logger.log(`\n=================================================`);
    this.logger.log(`CÓDIGO DE RECUPERAÇÃO PARA ${email}: ${code}`);
    this.logger.log(`=================================================\n`);
  }

  async resetPassword(email: string, code: string, newPassword: string) {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new BadRequestException("Usuário não encontrado");
    }

    if (!user.resetCode || user.resetCode !== code) {
      throw new BadRequestException("Código inválido");
    }

    if (!user.resetCodeExpiry || user.resetCodeExpiry < new Date()) {
      throw new BadRequestException(
        "Código expirado. Solicite um novo código.",
      );
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetCode = null;
    user.resetCodeExpiry = null;

    await this.userRepository.save(user);
  }
}
