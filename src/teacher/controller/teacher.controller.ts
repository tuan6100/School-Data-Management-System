import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Put, UseGuards } from '@nestjs/common';
import { TeacherService } from "../service/teacher.service";
import { CreateTeacherDto } from "../dto/create-teacher.dto";
import { UpdateTeacherDto } from '../dto/update-teacher.dto';
import { AccessTokenGuard, RolesGuard } from '../../app/config/app.guard';
import { Roles } from '../../app/decorator/app.decorator';


const apiPrefix = process.env.API_PREFIX || ""
@Controller(`${apiPrefix}/teacher`)
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
  @UseGuards(AccessTokenGuard)
  findOne(@Query("id") id: number) {
    return this.teacherService.findOne(id)
  }

  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles("teacher")
  @Put("/update")
  update(@Query("id") id: number, @Body() updateTeacherDto: UpdateTeacherDto) {
    return this.teacherService.update(id, updateTeacherDto)
  }

  @Delete("/remove")
  remove(@Query("id") id: number) {
    return this.teacherService.remove(id)
  }
}
