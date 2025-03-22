import {Controller, Get, Post, Body, Param, Delete, Query, Put} from "@nestjs/common"
import { StudentService } from "./student.service"
import { CreateStudentDto } from "./dto/create-student.dto"
import { UpdateStudentDto } from "./dto/update-student.dto"

@Controller("/api/v1/student")
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Post("/register")
  create(@Body() createStudentDto: CreateStudentDto) {
    return this.studentService.create(createStudentDto)
  }

  @Get("/get-all")
  findAll(@Query("page") page = 0, @Query("size") size = 10) {
    return this.studentService.findAll(page, size)
  }

  @Get("/get")
  findOne(@Param("id") id: number) {
    return this.studentService.findOne(id)
  }

  @Put("/update")
  update(@Query("id") id: number, @Body() updateStudentDto: UpdateStudentDto) {
    return this.studentService.update(id, updateStudentDto)
  }

  @Delete("/remove")
  remove(@Query("id") id: number) {
    return this.studentService.remove(id)
  }
}
