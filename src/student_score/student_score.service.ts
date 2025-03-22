import { Injectable } from '@nestjs/common';
import { CreateStudentScoreDto } from './dto/create-student_score.dto';
import { UpdateStudentScoreDto } from './dto/update-student_score.dto';

@Injectable()
export class StudentScoreService {
  create(createStudentScoreDto: CreateStudentScoreDto) {
    return 'This action adds a new studentScore';
  }

  findAll() {
    return `This action returns all studentScore`;
  }

  findOne(id: number) {
    return `This action returns a #${id} studentScore`;
  }

  update(id: number, updateStudentScoreDto: UpdateStudentScoreDto) {
    return `This action updates a #${id} studentScore`;
  }

  remove(id: number) {
    return `This action removes a #${id} studentScore`;
  }
}
