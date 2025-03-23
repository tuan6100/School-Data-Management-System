import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TeacherClassService } from './teacher_class.service';
import { CreateTeacherClassDto } from './dto/create-teacher_class.dto';
import { UpdateTeacherClassDto } from './dto/update-teacher_class.dto';

@Controller('teacher-class')
export class TeacherClassController {
  constructor(private readonly teacherClassService: TeacherClassService) {}

  @Post()
  create(@Body() createTeacherClassDto: CreateTeacherClassDto) {
    return this.teacherClassService.create(createTeacherClassDto);
  }

  @Get()
  findAll() {
    return this.teacherClassService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.teacherClassService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTeacherClassDto: UpdateTeacherClassDto) {
    return this.teacherClassService.update(+id, updateTeacherClassDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.teacherClassService.remove(+id);
  }
}
