import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { StudentScoreService } from './student_score.service';
import { CreateStudentScoreDto } from './dto/create-student_score.dto';
import { UpdateStudentScoreDto } from './dto/update-student_score.dto';

@Controller('student-score')
export class StudentScoreController {
  constructor(private readonly studentScoreService: StudentScoreService) {}

  @Post()
  create(@Body() createStudentScoreDto: CreateStudentScoreDto) {
    return this.studentScoreService.create(createStudentScoreDto);
  }

  @Get()
  findAll() {
    return this.studentScoreService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.studentScoreService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStudentScoreDto: UpdateStudentScoreDto) {
    return this.studentScoreService.update(+id, updateStudentScoreDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.studentScoreService.remove(+id);
  }
}
