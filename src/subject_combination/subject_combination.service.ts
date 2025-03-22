import { Injectable } from '@nestjs/common';
import { CreateSubjectCombinationDto } from './dto/create-subject_combination.dto';
import { UpdateSubjectCombinationDto } from './dto/update-subject_combination.dto';

@Injectable()
export class SubjectCombinationService {
  create(createSubjectCombinationDto: CreateSubjectCombinationDto) {
    return 'This action adds a new subjectCombination';
  }

  findAll() {
    return `This action returns all subjectCombination`;
  }

  findOne(id: number) {
    return `This action returns a #${id} subjectCombination`;
  }

  update(id: number, updateSubjectCombinationDto: UpdateSubjectCombinationDto) {
    return `This action updates a #${id} subjectCombination`;
  }

  remove(id: number) {
    return `This action removes a #${id} subjectCombination`;
  }
}
