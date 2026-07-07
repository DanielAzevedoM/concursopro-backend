import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "../../entities/user.entity";

@Injectable()
export class AdminUsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    // eslint-disable-next-line prettier/prettier
  ) { }

  async findAll() {
    return this.userRepository.find({
      select: [
        "id",
        "name",
        "email",
        "planType",
        "role",
        "dailyErrors",
        "createdAt",
      ],
    });
  }

  async delete(id: string) {
    await this.userRepository.delete(id);
  }
}
