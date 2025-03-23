import {BadRequestException, Injectable, InternalServerErrorException} from '@nestjs/common'
import { UpdateUserDto } from './dto/update-user.dto'
import UserAuth from "./entities/user.entity"
import {Role} from "./enum/role.enum"
import {EntityManager, Transactional} from "@mikro-orm/postgresql"
import {encryptPassword, generateStrongPassword} from "./user.util"
import {logger} from "@mikro-orm/nestjs";

@Injectable()
export class UserService {

  constructor(
      private readonly em: EntityManager
  ) {}

  @Transactional()
  async create(id: number, email: string, role: string) {
    const newStudentPassword = generateStrongPassword(id, role)
    const hashedPassword = await encryptPassword(newStudentPassword);
    const newUser = new UserAuth.Builder()
        .withUser(id)
        .withEmail(email)
        .withPassword(hashedPassword)
        .withRole(Role.STUDENT)
        .build();
    this.em.persistAndFlush(newUser).catch(e => {
      logger.error(e)
      throw new InternalServerErrorException("Error during save the user")
    })
    return newUser
  }

  async findAll() {
    return `This action returns all user`
  }

  async findOneEmail(userId: number, role: string): Promise<string | null> {
    const user = await this.em.findOne(UserAuth, {userId: userId, role: Role[role]})
    return user?.email ?? null
  }

  @Transactional()
  async update(updateUserDto: UpdateUserDto) {
    const user = await this.em.findOne(UserAuth, { userId: updateUserDto.userId });
    if (!user) {
      throw new BadRequestException("User not found");
    }
    if (updateUserDto.email !== undefined) {
      user.email = updateUserDto.email;
    }
    if (updateUserDto.password !== undefined) {
      user.password = updateUserDto.password;
    }
    await this.em.nativeUpdate(UserAuth, { userId: updateUserDto.userId }, user);
  }


  @Transactional()
  async remove(id: number) {
    const user = await this.em.findOne(UserAuth, {userId: id})
    if (!user) {
      throw new BadRequestException("User not found")
    }
    await this.em.removeAndFlush(user)
  }
}
