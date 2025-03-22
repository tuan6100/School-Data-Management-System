import { Injectable } from '@nestjs/common';
import { CreateTeacherClassDto } from './dto/create-teacher_class.dto';
import { UpdateTeacherClassDto } from './dto/update-teacher_class.dto';

@Injectable()
export class TeacherClassService {
  create(createTeacherClassDto: CreateTeacherClassDto) {
    return 'This action adds a new teacherClass';
  }

  findAll() {
    return `This action returns all teacherClass`;
  }

  findOne(id: number) {
    return `This action returns a #${id} teacherClass`;
  }

  update(id: number, updateTeacherClassDto: UpdateTeacherClassDto) {
    return `This action updates a #${id} teacherClass`;
  }

  remove(id: number) {
    return `This action removes a #${id} teacherClass`;
  }
}
