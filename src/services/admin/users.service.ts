import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "../../entities/user.entity";
import { AdminUpdateUserDto } from "../../dto/admin-update-user.dto";
import * as bcrypt from "bcrypt";

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

  async findOne(id: string) {
    const user = await this.userRepository.findOne({
      where: { id },
      select: ["id", "name", "email", "planType", "role"],
    });
    if (!user) throw new NotFoundException("Usuário não encontrado");
    return user;
  }

  async update(id: string, updateData: AdminUpdateUserDto) {
    const user = await this.findOne(id);

    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    } else {
      delete updateData.password;
    }

    Object.assign(user, updateData);
    await this.userRepository.save(user);
    return user;
  }

  async delete(id: string) {
    await this.userRepository.delete(id);
  }
}
