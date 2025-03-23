import {BadRequestException, Injectable, InternalServerErrorException, Logger} from '@nestjs/common'
import {CreateStudentDto} from './dto/create-student.dto'
import {UpdateStudentDto} from './dto/update-student.dto'
import {Student} from "./entities/student.entity"
import {EntityManager, Transactional} from "@mikro-orm/postgresql"
import {InjectMapper} from "@automapper/nestjs"
import {createMap, Mapper} from "@automapper/core"
import {UserService} from "../user/service/user.service"
import {UpdateUserDto} from "../user/dto/update-user.dto"
import {formatDateOnly} from "./student.util";
import { decryptEmail } from '../user/user.util';

@Injectable()
export class StudentService {

  constructor(
      private readonly em : EntityManager,
      @InjectMapper() private  mapper: Mapper,
      private readonly userService: UserService,
      private readonly logger: Logger,
  ) {
    this.logger = new Logger(StudentService.name, {timestamp: true})
  }

  @Transactional()
  async create(createStudentDto: CreateStudentDto): Promise<Object> {
    createMap(this.mapper, CreateStudentDto, Student)
    const newStudent = this.mapper.map(createStudentDto, CreateStudentDto, Student)
    try {
      await this.em.persistAndFlush(newStudent)
      const newStudentEmail =
        `${newStudent.lastName}.${newStudent.firstName.charAt(0)}${newStudent.midName.charAt(0)}${newStudent.studentId}@student.${process.env.EMAIL}`
      await this.userService.create(newStudent.studentId, newStudentEmail, "student")
      this.logger.log("Sending responses...")
      return {
        userId: newStudent.studentId,
        citizenIdCode: newStudent.citizenIdCode,
        fullName: newStudent.firstName + " " + newStudent.midName + " " + newStudent.lastName,
        email: newStudentEmail,
        dob: formatDateOnly(newStudent.dob),
        gender: newStudent.gender,
        pob: newStudent.pob,
        address: newStudent.address,
        educationLevel: newStudent.educationLevel,
      }
    } catch (error) {
      this.logger.error("Error: ", error)
      throw new InternalServerErrorException(error.detail)
    }
  }


  async findAll(page: number, size: number): Promise<Student[] | []> {
    /**
    const offset = page * size
    const sql = `
      SELECT *
      FROM students
      ORDER BY student_id
      LIMIT ? OFFSET ?
    `
    return await this.em.getConnection().execute(sql, [size, offset])
     */
    this.logger.log("Sending responses...")
    return this.em.find(Student, {}, {
      limit: size,
      offset: page * size
    })
  }

  async findOne(id: number): Promise<Object | null> {
    const student = await this.em.findOne(Student, { studentId: id });
    if (!student) return null
    const email = await this.userService.findOneEmail(id, "student") || "";
    this.logger.log("Sending responses...")
    return {
      ...student,
      email: decryptEmail(email)
    };
  }

  @Transactional()
  async update(id: number, updateStudentDto: UpdateStudentDto): Promise<Object> {
    // TODO: backup the old versions to Mongodb
    const studentId = await this.userService.findOneUser(id)
    const student = await this.em.findOne(Student, { studentId: studentId })
    if (!student) throw new BadRequestException(`Student with id ${id} not found`)
    const updateData: Partial<Student> = {}
    if (updateStudentDto.firstName !== undefined) updateData.firstName = updateStudentDto.firstName
    if (updateStudentDto.midName !== undefined) updateData.midName = updateStudentDto.midName
    if (updateStudentDto.lastName !== undefined) updateData.lastName = updateStudentDto.lastName
    if (updateStudentDto.citizenIdCode !== undefined) updateData.citizenIdCode = updateStudentDto.citizenIdCode
    if (updateStudentDto.dob !== undefined) updateData.dob = updateStudentDto.dob
    if (updateStudentDto.gender !== undefined) updateData.gender = updateStudentDto.gender
    if (updateStudentDto.nationality !== undefined) updateData.nationality = updateStudentDto.nationality
    if (updateStudentDto.pob !== undefined) updateData.pob = updateStudentDto.pob
    if (updateStudentDto.address !== undefined) updateData.address = updateStudentDto.address
    if (updateStudentDto.educationLevel !== undefined) updateData.educationLevel = updateStudentDto.educationLevel

    let newEmail = ""
    if (updateData.firstName || updateData.midName || updateData.lastName) {
      const firstName = updateData.firstName ?? student.firstName
      const midName = updateData.midName ?? student.midName
      const lastName = updateData.lastName ?? student.lastName
      newEmail = `${lastName}.${firstName.charAt(0)}${midName.charAt(0)}${id}@school.edu.vn`
      await this.userService.updateEmail(new UpdateUserDto(id, "student"), newEmail)
    }
    Object.assign(student, updateData);
    await this.em.persistAndFlush(student);
    this.logger.log("Sending responses...")
    return {
      userId: student.studentId,
      citizenIdCode: student.citizenIdCode,
      fullName: student.firstName + " " + student.midName + " " + student.lastName,
      email: newEmail || (await this.userService.findOneEmail(id, "student")),
      dob: formatDateOnly(student.dob),
      gender: student.gender,
      pob: student.pob,
      address: student.address,
      educationLevel: student.educationLevel,
    }
  }

  @Transactional()
  async remove(id: number): Promise<string> {
    const student = await this.em.findOne(Student, { studentId: id })
    if (!student) {
      throw new BadRequestException(`Student with ID ${id} not found`)
    }
    await this.em.removeAndFlush(student)
    await this.userService.remove(id, "student")
    return `Student with ID ${id} has been removed`
  }
}
