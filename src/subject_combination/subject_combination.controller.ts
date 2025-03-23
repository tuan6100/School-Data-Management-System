import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SubjectCombinationService } from './subject_combination.service';
import { CreateSubjectCombinationDto } from './dto/create-subject_combination.dto';
import { UpdateSubjectCombinationDto } from './dto/update-subject_combination.dto';

@Controller('subject-combination')
export class SubjectCombinationController {
  constructor(private readonly subjectCombinationService: SubjectCombinationService) {}

  @Post()
  create(@Body() createSubjectCombinationDto: CreateSubjectCombinationDto) {
    return this.subjectCombinationService.create(createSubjectCombinationDto);
  }

  @Get()
  findAll() {
    return this.subjectCombinationService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.subjectCombinationService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSubjectCombinationDto: UpdateSubjectCombinationDto) {
    return this.subjectCombinationService.update(+id, updateSubjectCombinationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.subjectCombinationService.remove(+id);
  }
}
