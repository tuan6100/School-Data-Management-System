import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { CreateTeacherDto } from './dto/create-teacher.dto'
import { UpdateTeacherDto } from './dto/update-teacher.dto'
import { EntityManager, Transactional } from '@mikro-orm/postgresql'
import { UserService } from '../user/service/user.service'
import { createMap, Mapper } from '@automapper/core'
import { InjectMapper } from '@automapper/nestjs'
import { Teacher } from './entities/teacher.entity'
import { Subject } from '../subject_combination/enum/subject.enum'
import { decryptEmail } from '../user/user.util';
import { UpdateUserDto } from '../user/dto/update-user.dto';
import { formatDateOnly } from '../student/student.util';

@Injectable()
export class TeacherService {

  constructor(
    private readonly em: EntityManager,
    private readonly userService: UserService,
    @InjectMapper() private readonly  mapper: Mapper,
    private readonly logger: Logger,
  ) {
    this.logger = new Logger(TeacherService.name, {timestamp: true})
  }

  @Transactional()
  async create(createTeacherDto: CreateTeacherDto): Promise<Object> {
    createMap(this.mapper, CreateTeacherDto, Teacher)
    const newTeacher = this.mapper.map(createTeacherDto, CreateTeacherDto, Teacher)
    try {
      await this.em.persistAndFlush(newTeacher)
      const newTeacherEmail =
        `${newTeacher.lastName}.${newTeacher.firstName.charAt(0)}${newTeacher.midName.charAt(0)}${newTeacher.teacherId}@${process.env.EMAIL}`
      await this.userService.create(newTeacher.teacherId, newTeacherEmail, "teacher")
      this.logger.log("Sending responses...")
      return {
        userId: newTeacher.teacherId,
        citizenIdCode: newTeacher.citizenIdCode,
        fullName: newTeacher.firstName + " " + newTeacher.midName + " " + newTeacher.lastName,
        email: newTeacherEmail,
        dob: formatDateOnly(newTeacher.dob),
        gender: newTeacher.gender,
        pob: newTeacher.pob,
        address: newTeacher.address,
        educationLevel: newTeacher.educationLevel,
        contractNumber: newTeacher.contractNumber,
        subject: Subject[newTeacher.subject].toString().toLowerCase()
      }
    } catch (error) {
      this.logger.error("Error: ", error)
      throw new InternalServerErrorException(error.detail)
    }
  }

  async findAll(page: number, size: number) {
    this.logger.log("Sending responses...")
    return this.em.findAll(Teacher, {
      limit: size,
      offset: page * size
    })
  }

  async findOne(id: number): Promise<Object | null> {
    const teacher = await this.em.findOne(
      Teacher, {
        teacherId: id
      })
    if (!teacher) return null
    const email = await this.userService.findOneEmail(id, "teacher") || "";
    this.logger.log("Sending responses...")
    return {
      ...teacher,
      email: decryptEmail(email)
    };
  }

  @Transactional()
  async update(id: number, updateTeacherDto: UpdateTeacherDto): Promise<Object> {
    // TODO: backup the old versions to Mongodb
    const teacher = await this.em.findOne(Teacher, { teacherId: id })
    if (!teacher) throw new BadRequestException(`Teacher with id ${id} not found`)
    const updateData: Partial<Teacher> = {}
    if (updateTeacherDto.firstName !== undefined) updateData.firstName = updateTeacherDto.firstName
    if (updateTeacherDto.midName !== undefined) updateData.midName = updateTeacherDto.midName
    if (updateTeacherDto.lastName !== undefined) updateData.lastName = updateTeacherDto.lastName
    if (updateTeacherDto.citizenIdCode !== undefined) updateData.citizenIdCode = updateTeacherDto.citizenIdCode
    if (updateTeacherDto.dob !== undefined) updateData.dob = updateTeacherDto.dob
    if (updateTeacherDto.gender !== undefined) updateData.gender = updateTeacherDto.gender
    if (updateTeacherDto.nationality !== undefined) updateData.nationality = updateTeacherDto.nationality
    if (updateTeacherDto.pob !== undefined) updateData.pob = updateTeacherDto.pob
    if (updateTeacherDto.address !== undefined) updateData.address = updateTeacherDto.address
    if (updateTeacherDto.educationLevel !== undefined) updateData.educationLevel = updateTeacherDto.educationLevel
    if (updateTeacherDto.contractNumber !== undefined) updateData.contractNumber = updateTeacherDto.contractNumber
    if (updateTeacherDto.subject !== undefined) updateData.subject = Subject[updateTeacherDto.subject.toUpperCase()]

    let newEmail = ""
    if (updateData.firstName || updateData.midName || updateData.lastName) {
      const firstName = updateData.firstName ?? teacher.firstName
      const midName = updateData.midName ?? teacher.midName
      const lastName = updateData.lastName ?? teacher.lastName
      newEmail = `${lastName}.${firstName.charAt(0)}${midName.charAt(0)}${id}@.edu.vn`
      await this.userService.updateEmail(new UpdateUserDto(id, "teacher"), newEmail)
    }
    Object.assign(teacher, updateData);
    await this.em.persistAndFlush(teacher);
    this.logger.log("Sending responses...")
    return {
      userId: teacher.teacherId,
      citizenIdCode: teacher.citizenIdCode,
      fullName: teacher.firstName + " " + teacher.midName + " " + teacher.lastName,
      email: newEmail || (await this.userService.findOneEmail(id, "teacher")),
      dob: formatDateOnly(teacher.dob),
      gender: teacher.gender,
      pob: teacher.pob,
      address: teacher.address,
      educationLevel: teacher.educationLevel,
      subject: Subject[teacher.subject].toString().toLowerCase()
    }
  }

  @Transactional()
  async remove(id: number): Promise<string> {
    const teacher = await this.em.findOne(Teacher, {teacherId: id })
    if (!teacher) {
      throw new BadRequestException(`Teacher with ID ${id} not found`)
    }
    await this.em.removeAndFlush(teacher)
    await this.userService.remove(id, "teacher")
    return `Teacher with ID ${id} has been removed`
  }
}
