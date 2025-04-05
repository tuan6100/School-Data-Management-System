import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Put, UseGuards } from '@nestjs/common';
import { TeacherService } from "../service/teacher.service";
import { CreateTeacherDto } from "../dto/create-teacher.dto";
import { UpdateTeacherDto } from '../dto/update-teacher.dto';
import { Roles } from '../../app/decorator/app.decorator';
import { AccessTokenGuard } from '../../app/config/security/access_token.guard';
import { RolesGuard } from '../../app/config/security/role.guard';


const apiPrefix = process.env.API_PREFIX?? ""
@Controller(`${apiPrefix}/teacher`)
export class TeacherController {
  constructor(private readonly teacherService: TeacherService) {}

  @Post("/register")
  async create(@Body() createTeacherDto: CreateTeacherDto) {
    return this.teacherService.create(createTeacherDto);
  }

  @Get("/get-all")
  async findAll(@Query("page") page = 0, @Query("size") size = 10) {
    return this.teacherService.findAll(page, size);
  }

  @Get("/get")
  @UseGuards(AccessTokenGuard)
  async findOne(@Query("id") id: number) {
    return this.teacherService.findOne(id)
  }

  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles("teacher")
  @Put("/update")
  async update(@Query("id") id: number, @Body() updateTeacherDto: UpdateTeacherDto) {
    return this.teacherService.update(id, updateTeacherDto)
  }

  @Delete("/remove")
  async remove(@Query("id") id: number) {
    return this.teacherService.remove(id)
  }
}
