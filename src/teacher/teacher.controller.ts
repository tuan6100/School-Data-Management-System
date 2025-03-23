import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Put } from '@nestjs/common';
import { TeacherService } from "./teacher.service";
import { CreateTeacherDto } from "./dto/create-teacher.dto";
import { UpdateTeacherDto } from './dto/update-teacher.dto';

@Controller(`${process.env.API_PREFIX}/teacher`)
export class TeacherController {
  constructor(private readonly teacherService: TeacherService) {}

  @Post("/register")
  create(@Body() createTeacherDto: CreateTeacherDto) {
    return this.teacherService.create(createTeacherDto);
  }

  @Get("/get-all")
  findAll(@Query("page") page = 0, @Query("size") size = 10) {
    return this.teacherService.findAll(page, size);
  }

  @Get("/get")
  findOne(@Query("id") id: number) {
    return this.teacherService.findOne(id)
  }

  @Put("/update")
  update(@Query("id") id: number, @Body() updateTeacherDto: UpdateTeacherDto) {
    return this.teacherService.update(id, updateTeacherDto)
  }

  @Delete("/remove")
  remove(@Query("id") id: number) {
    return this.teacherService.remove(id)
  }
}
