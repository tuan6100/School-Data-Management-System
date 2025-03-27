import {BadRequestException, Injectable, InternalServerErrorException} from '@nestjs/common'
import { UpdateUserDto } from '../dto/update-user.dto'
import UserAuth from "../entities/user.entity"
import {Role} from "../enum/role.enum"
import { EntityManager, Transactional } from '@mikro-orm/postgresql';
import { encryptEmail, encryptPassword, generateStrongPassword } from '../utility/user.security.util';
import {logger} from "@mikro-orm/nestjs";
import { InjectModel } from '@nestjs/mongoose';
import { UserAuthCollection } from '../mongo/user.collection';
import { Model } from 'mongoose';

@Injectable()
export class UserService {

  constructor(
    private readonly em: EntityManager,
    @InjectModel(UserAuthCollection.name) private readonly userAuthModel: Model<UserAuthCollection>
  ) {}


  @Transactional()
  async create(id: number, firstName: string, midName: string, lastName: string , role: string) {
    const newStudentEmail = (role === "student") ?
      `${lastName}.${firstName.charAt(0)}${midName.charAt(0)}${id}@student.${process.env.EMAIL}` :
      `${lastName}.${firstName.charAt(0)}${midName.charAt(0)}${id}.${process.env.EMAIL}`
    const newStudentPassword = generateStrongPassword(id, role)
    const hashedPassword = await encryptPassword(newStudentPassword);
    const newUser = new UserAuth.Builder()
      .withUser(id)
      .withEmail(encryptEmail(newStudentEmail))
      .withPassword(hashedPassword)
      .withRole(Role[role.toUpperCase() as keyof typeof Role])
      .build();
    this.em.persistAndFlush(newUser).catch(e => {
      logger.error(e)
      throw new InternalServerErrorException("Error during save the user")
    })
    const userAuthData = new this.userAuthModel({
      userAuthId: id,
      email: newStudentEmail,
      fullname: `${firstName} ${midName} ${lastName}`,
      rawPassword: newStudentPassword
    });
    await userAuthData.save()
    return newUser
  }

  async findAll() {
    return `This action returns all user`
  }

  async findOneUser(userAuthId: number): Promise<number | null> {
    const user = await this.em.findOne(
      UserAuth, {userAuthId: userAuthId}
    )
    return user?.userId ?? null
  }

  async findOneEmail(userId: number, role: string): Promise<string | null> {
    const user = await this.em.findOne(
      UserAuth, {
        userId: userId,
        role: Role[role.toUpperCase()]
      })
    return user?.email ?? null
  }

  @Transactional()
  async updateEmail(updateUserDto: UpdateUserDto, email: string) {
    const query = `
        update users set email = ?
        where user_id = ? and role = ?
    `
    await this.em.getConnection().execute(query, [email, updateUserDto.userId, Role[updateUserDto.role]])
  }

  async updatePassword(updateUserDto: UpdateUserDto, password: string) {
    const encryptedPassword = encryptPassword(password)
    const query = `
        update users set password = ?
        where user_id = ? and role = ?
    `
    await this.em.getConnection().execute(query, [encryptedPassword, updateUserDto.userId, Role[updateUserDto.role]])
  }

  async remove(id: number, role: string) {
    const user = await this.em.findOne(
      UserAuth, {
        userId: id,
        role: Role[role.toUpperCase()]
      })
    if (!user) {
      throw new BadRequestException("User not found")
    }
    await this.em.removeAndFlush(user)
  }
}
